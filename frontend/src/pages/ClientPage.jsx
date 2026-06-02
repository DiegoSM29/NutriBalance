import { useState, useEffect } from 'react';
import { getCatalogo, crearPedido } from '../services/api';
import ClienteDashboard from '../components/Client';

export default function ClientPage() {
    const user = JSON.parse(localStorage.getItem('user'));

    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [comprobante, setComprobante] = useState(null);

    useEffect(() => {
        cargarCatalogo();
    }, []);

    async function cargarCatalogo() {
        try {
            const res = await getCatalogo();
            if (res.success) setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar el catalogo", error);
        }
    }

    const agregarAlCarrito = (producto) => {
        setMensaje({ tipo: '', texto: '' });

        const itemExistente = carrito.find(item => item.id_producto === producto.id_producto);

        if (itemExistente) {
            if (itemExistente.cantidad >= producto.stock_actual) {
                setMensaje({ tipo: 'error', texto: `Solo hay ${producto.stock_actual} unidades disponibles.` });
                return;
            }

            setCarrito(carrito.map(item =>
                item.id_producto === producto.id_producto
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const modificarCantidad = (id_producto, cambio) => {
        setMensaje({ tipo: '', texto: '' });

        const productoOriginal = productos.find(p => p.id_producto === id_producto);
        const itemCarrito = carrito.find(c => c.id_producto === id_producto);
        const nuevaCantidad = itemCarrito.cantidad + cambio;

        if (nuevaCantidad === 0) {
            setCarrito(carrito.filter(item => item.id_producto !== id_producto));
            return;
        }

        if (nuevaCantidad > productoOriginal.stock_actual) {
            setMensaje({ tipo: 'error', texto: `Stock maximo alcanzado.` });
            return;
        }

        setCarrito(carrito.map(item =>
            item.id_producto === id_producto
                ? { ...item, cantidad: nuevaCantidad }
                : item
        ));
    };

    const totalCarrito = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);

    const abrirModalPago = () => {
        if (carrito.length === 0) return;
        setMensaje({ tipo: '', texto: '' });
        setComprobante(null);
        setShowPagoModal(true);
    };

    const cerrarModalPago = () => {
        setShowPagoModal(false);
        setComprobante(null);
    };

    const confirmarPedido = async () => {
        if (!comprobante) return;

        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const datosPedido = {
                productos: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad
                }))
            };

            const res = await crearPedido(datosPedido, comprobante);

            setShowPagoModal(false);
            setComprobante(null);
            setMensaje({ tipo: 'success', texto: `¡Pedido #${res.data.id_pedido} confirmado con exito!` });
            setCarrito([]);
            cargarCatalogo();

        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.errors?.comprobante?.[0] || err.message || 'Error al procesar el pedido.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ClienteDashboard
            user={user}
            productos={productos}
            carrito={carrito}
            mensaje={mensaje}
            loading={loading}
            totalCarrito={totalCarrito}
            agregarAlCarrito={agregarAlCarrito}
            modificarCantidad={modificarCantidad}
            confirmarPedido={confirmarPedido}
            showPagoModal={showPagoModal}
            comprobante={comprobante}
            onAbrirModalPago={abrirModalPago}
            onSeleccionarComprobante={setComprobante}
            onConfirmarPago={confirmarPedido}
            onCerrarModal={cerrarModalPago}
        />
    );
}


import { useState, useEffect, useRef } from 'react';
import { getAdminProductos, crearAdminProducto, actualizarAdminProducto, eliminarAdminProducto, getAlertas, marcarAlertaLeida } from '../services/api';
import ProductDashboard from '../components/ProductDashboard';

const initialForm = {
    nombre: '',
    categoria: 'Suplementos',
    tipo_producto: 'Polvo',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: ''
};

export default function ProductPage() {
    const [productos, setProductos] = useState([]);
    const [alertas, setAlertas] = useState([]); 
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    
    // Estado para controlar qué pestaña se muestra
    const [activeTab, setActiveTab] = useState('catalogo'); 

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState(initialForm);
    const [imagen, setImagen] = useState(null);

    // Obtenemos el usuario actual para enviar su ID en los headers de las alertas
    const usuarioActual = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        cargarProductos();
        cargarAlertas();
    }, []);

    const cargarProductos = async () => {
        try {
            const res = await getAdminProductos();
            if (res.success) setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos", error);
        }
    };

    const cargarAlertas = async () => {
        try {
            // Le pasamos un header manual (simulando lo que hara axios/fetch) si no lo tenemos global
            const response = await fetch('http://localhost:8000/api/alertas', {
                method: 'GET',
                headers: { 
                    'Accept': 'application/json',
                    'X-User-Id': usuarioActual?.id_usuario 
                },
            });
            const res = await response.json();
            if (res.success) setAlertas(res.data);
        } catch (error) {
            console.error("Error cargando alertas", error);
        }
    };

    const handleMarcarLeida = async (id) => {
        try {
            const res = await marcarAlertaLeida(id);
            if (res.success) {
                // Actualizamos el estado local para mover la alerta al historial
                setAlertas(alertas.map(a => 
                    a.id_alerta === id ? { ...a, leida: true } : a
                ));
            }
        } catch (error) {
            console.error("Error al marcar alerta", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    const iniciarEdicion = (producto) => {
        setModoEdicion(true);
        setProductoEditandoId(producto.id_producto);
        setForm({
            nombre: producto.nombre,
            categoria: producto.categoria || 'Suplementos',
            tipo_producto: producto.tipo_producto || 'Polvo',
            precio_venta: producto.precio_venta,
            stock_actual: producto.stock_actual,
            stock_minimo: producto.stock_minimo
        });
        setImagen(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setModoEdicion(false);
        setProductoEditandoId(null);
        setForm(initialForm);
        setImagen(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('categoria', form.categoria);
        formData.append('tipo_producto', form.tipo_producto);
        formData.append('precio_venta', form.precio_venta);
        formData.append('stock_actual', form.stock_actual);
        formData.append('stock_minimo', form.stock_minimo);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            let res;
            if (modoEdicion) {
                res = await actualizarAdminProducto(productoEditandoId, formData);
            } else {
                res = await crearAdminProducto(formData);
            }

            setMensaje({ tipo: 'success', texto: res.message });
            cancelarEdicion();
            cargarProductos();
            cargarAlertas(); 
        } catch (err) {
            let errorTexto = 'Error al procesar el producto.';
            if (err.errors) errorTexto = Object.values(err.errors)[0][0];
            else if (err.message) errorTexto = err.message;
            setMensaje({ tipo: 'error', texto: errorTexto });
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto: ${nombre}?`)) return;

        try {
            const res = await eliminarAdminProducto(id);
            setMensaje({ tipo: 'success', texto: res.message });
            cargarProductos();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message || 'Error al eliminar.' });
        }
    };

    return (
        <ProductDashboard
            productos={productos}
            alertas={alertas} 
            mensaje={mensaje}
            loading={loading}
            modoEdicion={modoEdicion}
            form={form}
            fileInputRef={fileInputRef}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            iniciarEdicion={iniciarEdicion}
            cancelarEdicion={cancelarEdicion}
            handleEliminar={handleEliminar}
            handleMarcarLeida={handleMarcarLeida}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />
    );
}
import { useState, useEffect } from 'react';
import { getCatalogo, crearPedido } from '../services/api';

export default function ClienteDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));

    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarCatalogo();
    }, []);

    const cargarCatalogo = async () => {
        try {
            const res = await getCatalogo();
            if (res.success) setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar el catalogo", error);
        }
    };

    const agregarAlCarrito = (producto) => {
        setMensaje({ tipo: '', texto: '' }); 

        const itemExistente = carrito.find(item => item.id_producto === producto.id_producto);

        if (itemExistente) {
            // Usamos stock_actual segun tu DB
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

    // Calculamos el total usando precio_venta
    const totalCarrito = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);

    const confirmarPedido = async () => {
        if (carrito.length === 0) return;

        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const datosPedido = {
                productos: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad
                }))
            };

            const res = await crearPedido(datosPedido);

            // En tu base de datos no hay "numero_pedido", usamos el ID autogenerado
            setMensaje({ tipo: 'success', texto: `¡Pedido #${res.data.id_pedido} confirmado con exito!` });
            setCarrito([]);
            cargarCatalogo();

        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message || 'Error al procesar el pedido.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hola, {user.nombre}</h1>
                    <p className="text-gray-500 text-sm">Explora nuestro catalogo y haz tu pedido.</p>
                </div>

                {mensaje.texto && (
                    <div className={`p-4 rounded-lg text-sm flex items-center gap-2 ${mensaje.tipo === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                        {mensaje.texto}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay productos disponibles por el momento.</p>
                    ) : (
                        productos.map(producto => (
                            <div key={producto.id_producto} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">{producto.nombre}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{producto.categoria} - {producto.tipo_producto}</p>
                                    <p className="text-emerald-600 font-bold text-lg mt-3">Bs {Number(producto.precio_venta).toFixed(2)}</p>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        Stock: {producto.stock_actual}
                                    </span>
                                    <button 
                                        onClick={() => agregarAlCarrito(producto)}
                                        className="bg-gray-800 hover:bg-black text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                                        title="Agregar al carrito"
                                    >
                                        <i className="bi bi-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <i className="bi bi-basket text-emerald-500"></i> Tu Pedido
                    </h2>

                    {carrito.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <i className="bi bi-cart-x text-4xl mb-2 block opacity-50"></i>
                            <p className="text-sm">Tu carrito esta vacio</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-4">
                                {carrito.map(item => (
                                    <div key={item.id_producto} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <p className="text-sm font-medium text-gray-800 truncate">{item.nombre}</p>
                                            <p className="text-xs text-gray-500">Bs {Number(item.precio_venta).toFixed(2)} c/u</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 shadow-sm">
                                            <button 
                                                onClick={() => modificarCantidad(item.id_producto, -1)}
                                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded transition-colors"
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.cantidad}</span>
                                            <button 
                                                onClick={() => modificarCantidad(item.id_producto, 1)}
                                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:bg-gray-50 rounded transition-colors"
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-100 my-4" />
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 font-medium">Total a pagar</span>
                                <span className="text-2xl font-bold text-gray-800">Bs {totalCarrito.toFixed(2)}</span>
                            </div>

                            <button 
                                onClick={confirmarPedido}
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        Confirmar Pedido <i className="bi bi-arrow-right"></i>
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
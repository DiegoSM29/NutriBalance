import { useState, useEffect, useRef } from 'react';
import { getAdminProductos, crearAdminProducto, actualizarAdminProducto, eliminarAdminProducto } from '../services/api';

const API_URL = 'http://localhost:8000';

export default function ProductDashboard() {
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    
    // Controles de edicion
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const fileInputRef = useRef(null); // Para resetear el input de archivo

    const initialForm = {
        nombre: '',
        categoria: 'Suplementos',
        tipo_producto: 'Polvo',
        precio_venta: '',
        stock_actual: '',
        stock_minimo: ''
    };
    
    const [form, setForm] = useState(initialForm);
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const res = await getAdminProductos();
            if (res.success) setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos", error);
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

    // Funcion que carga los datos de un producto en el formulario para editarlo
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
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al form
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

        // Preparamos los datos en formato FormData para poder enviar la imagen
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
            cancelarEdicion(); // Limpia todo
            cargarProductos();
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
        <div className="max-w-7xl mx-auto">
            <header className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h1>
                <p className="text-sm text-gray-500">Administra los productos del catálogo, fotos y control de stock.</p>
            </header>

            {mensaje.texto && (
                <div className={`mb-6 p-4 rounded-lg text-sm flex items-center gap-2 ${mensaje.tipo === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                    {mensaje.texto}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Formulario de Creación / Edición */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        {modoEdicion ? 'Editar Producto' : 'Registrar Producto'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                            <input name="nombre" type="text" required className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.nombre} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Imagen (Opcional)</label>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
                                <select name="categoria" className="w-full p-2 border rounded text-sm bg-white" value={form.categoria} onChange={handleChange}>
                                    <option value="Suplementos">Suplementos</option>
                                    <option value="Vitaminas">Vitaminas</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Accesorios">Accesorios</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                                <select name="tipo_producto" className="w-full p-2 border rounded text-sm bg-white" value={form.tipo_producto} onChange={handleChange}>
                                    <option value="Polvo">Polvo</option>
                                    <option value="Capsulas">Cápsulas</option>
                                    <option value="Liquido">Líquido</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Precio de Venta (Bs)</label>
                            <input name="precio_venta" type="number" step="0.10" min="0" required className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.precio_venta} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Stock Actual</label>
                                <input name="stock_actual" type="number" min="0" required className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.stock_actual} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Stock Mínimo</label>
                                <input name="stock_minimo" type="number" min="0" required className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.stock_minimo} onChange={handleChange} />
                            </div>
                        </div>
                        
                        <div className="pt-2 flex gap-2">
                            {modoEdicion && (
                                <button type="button" onClick={cancelarEdicion} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded transition-colors text-sm">
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded transition-colors text-sm disabled:opacity-60">
                                {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Productos */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Catálogo Actual</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                                    <th className="p-3 font-medium w-16">Foto</th>
                                    <th className="p-3 font-medium">Producto</th>
                                    <th className="p-3 font-medium text-center">Precio</th>
                                    <th className="p-3 font-medium text-center">Stock</th>
                                    <th className="p-3 font-medium text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.length === 0 ? (
                                    <tr><td colSpan="5" className="p-4 text-center text-gray-500 text-sm">No hay productos registrados.</td></tr>
                                ) : (
                                    productos.map(p => (
                                        <tr key={p.id_producto} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                                                    {p.imagen ? (
                                                        <img src={`${API_URL}/${p.imagen}`} alt={p.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <i className="bi bi-image text-gray-400"></i>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-medium text-gray-800">{p.nombre}</div>
                                                <div className="text-gray-500 text-xs">{p.categoria} - {p.tipo_producto}</div>
                                            </td>
                                            <td className="p-3 text-center text-emerald-600 font-medium">Bs {Number(p.precio_venta).toFixed(2)}</td>
                                            <td className="p-3 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock_actual <= p.stock_minimo ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {p.stock_actual}
                                                    </span>
                                                    {p.stock_actual <= p.stock_minimo && (
                                                        <span className="text-[10px] text-red-500 mt-1"><i className="bi bi-exclamation-triangle"></i> Bajo</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-center space-x-2">
                                                <button 
                                                    onClick={() => iniciarEdicion(p)}
                                                    className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                                                    title="Editar producto"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleEliminar(p.id_producto, p.nombre)}
                                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                    title="Eliminar producto"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
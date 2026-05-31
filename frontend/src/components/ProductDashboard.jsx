const API_URL = 'http://localhost:8000';

export default function ProductDashboard({
    productos, alertas, mensaje, loading, modoEdicion, form,
    fileInputRef, handleChange, handleFileChange, handleSubmit,
    iniciarEdicion, cancelarEdicion, handleEliminar, handleMarcarLeida,
    activeTab, setActiveTab 
}) {
    
    // Separar las alertas activas del historial general
    const alertasActivas = alertas?.filter(a => !a.leida) || [];
    const historialAlertas = alertas?.filter(a => a.leida) || [];

    return (
        <div className="max-w-7xl mx-auto">
            
            {/* Cabecera y Pestañas */}
            <header className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-0">
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra los productos y monitorea las alertas de stock.</p>
                    
                    <div className="flex gap-6 mt-6 border-b border-gray-200">
                        <button 
                            onClick={() => setActiveTab('catalogo')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'catalogo' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <i className="bi bi-box-seam me-2"></i>Catálogo
                            {activeTab === 'catalogo' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('notificaciones')}
                            className={`pb-3 text-sm font-medium transition-colors relative flex items-center ${activeTab === 'notificaciones' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <i className="bi bi-bell me-2"></i>Notificaciones
                            {alertasActivas.length > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                    {alertasActivas.length}
                                </span>
                            )}
                            {activeTab === 'notificaciones' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
                        </button>
                    </div>
                </div>
            </header>

            {mensaje.texto && (
                <div className={`mb-6 p-4 rounded-lg text-sm flex items-center gap-2 ${mensaje.tipo === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                    {mensaje.texto}
                </div>
            )}

            {/* PESTAÑA 1: CATÁLOGO */}
            {activeTab === 'catalogo' && (
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
                                                    <button onClick={() => iniciarEdicion(p)} className="text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Editar producto">
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button onClick={() => handleEliminar(p.id_producto, p.nombre)} className="text-red-500 hover:text-red-700 p-1 transition-colors" title="Eliminar producto">
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
            )}

            {/* PESTAÑA 2: NOTIFICACIONES E HISTORIAL */}
            {activeTab === 'notificaciones' && (
                <div className="space-y-8">
                    
                    {/* Alertas Pendientes */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="bi bi-exclamation-triangle-fill text-red-500"></i> Alertas Pendientes
                        </h2>
                        
                        {alertasActivas.length === 0 ? (
                            <p className="text-gray-500 text-sm border border-dashed border-gray-200 p-6 text-center rounded-lg">
                                <i className="bi bi-check2-circle text-2xl text-emerald-500 mb-2 block"></i>
                                No hay alertas de stock pendientes en este momento.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {alertasActivas.map(alerta => (
                                    <div key={alerta.id_alerta} className="bg-red-50 p-4 rounded-lg shadow-sm border-l-4 border-red-500 flex justify-between items-start hover:shadow-md transition-shadow">
                                        <div>
                                            <p className="font-bold text-red-800">{alerta.producto?.nombre}</p>
                                            <p className="text-sm text-red-700 mt-1">
                                                Stock actual: <span className="font-bold">{alerta.stock_registrado}</span> 
                                                <span className="text-red-400 text-xs ml-1">(Mínimo: {alerta.producto?.stock_minimo})</span>
                                            </p>
                                            <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1">
                                                <i className="bi bi-clock"></i>
                                                {new Date(alerta.fecha_alerta).toLocaleString('es-BO')}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleMarcarLeida(alerta.id_alerta)} 
                                            className="text-red-300 hover:text-emerald-600 transition-colors p-1" 
                                            title="Marcar como resuelto"
                                        >
                                            <i className="bi bi-check-circle-fill text-xl"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Historial de Alertas */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="bi bi-clock-history text-gray-500"></i> Historial de Notificaciones
                        </h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                                        <th className="p-3 font-medium">Fecha de Alerta</th>
                                        <th className="p-3 font-medium">Producto</th>
                                        <th className="p-3 font-medium text-center">Stock Registrado</th>
                                        <th className="p-3 font-medium text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historialAlertas.length === 0 ? (
                                        <tr><td colSpan="4" className="p-4 text-center text-gray-500 text-sm">No hay historial de alertas registradas.</td></tr>
                                    ) : (
                                        historialAlertas.map(alerta => (
                                            <tr key={alerta.id_alerta} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                                                <td className="p-3 text-gray-500">{new Date(alerta.fecha_alerta).toLocaleString('es-BO')}</td>
                                                <td className="p-3 font-medium text-gray-800">{alerta.producto?.nombre}</td>
                                                <td className="p-3 text-center text-red-500 font-medium">{alerta.stock_registrado}</td>
                                                <td className="p-3 text-center">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        <i className="bi bi-check2-all me-1"></i>Revisado
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
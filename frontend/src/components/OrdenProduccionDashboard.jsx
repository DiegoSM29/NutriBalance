import fondo from '../assets/fondo4.png';

const estadoConfig = {
    planificada: { label: 'Planificada', icon: 'bi-calendar-check', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    en_proceso: { label: 'En Proceso', icon: 'bi-arrow-repeat', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    completada: { label: 'Completada', icon: 'bi-check2-all', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelada: { label: 'Cancelada', icon: 'bi-x-circle', class: 'bg-red-50 text-red-700 border-red-200' },
};

const estadoOptions = ['planificada', 'en_proceso', 'completada', 'cancelada'];

const filtros = [
    { value: '', label: 'Todas', icon: 'bi-list' },
    { value: 'planificada', label: 'Planificada', icon: 'bi-calendar-check' },
    { value: 'en_proceso', label: 'En Proceso', icon: 'bi-arrow-repeat' },
    { value: 'completada', label: 'Completada', icon: 'bi-check2-all' },
    { value: 'cancelada', label: 'Cancelada', icon: 'bi-x-circle' },
];

export default function OrdenProduccionDashboard({
    ordenes, productos, mensaje, loading, form, filtroEstado,
    handleChange, handleSubmit, setFiltroEstado,
    abrirEdicion, handleCambiarEstado,
    editModal, cerrarEdicion, handleEditChange, handleEditSubmit
}) {
    const productosTerminados = productos?.filter(p => p.tipo_producto !== 'Materia Prima') || [];

    return (
        <div className="-m-4 md:-m-8 min-h-screen bg-cover bg-center bg-fixed p-4 md:p-8" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-[slideDown_0.4s_ease]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <i className="bi bi-gear text-emerald-600"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Órdenes de Producción</h1>
                        <p className="text-sm text-gray-500">Crea, reprograma y gestiona el estado de las órdenes de producción.</p>
                    </div>
                </div>
            </div>

            {mensaje.texto && (
                <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${mensaje.tipo === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                    {mensaje.texto}
                </div>
            )}

            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-[fadeSlideUp_0.5s_ease]">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <i className="bi bi-plus-lg text-emerald-600"></i>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Nueva Orden de Producción</h2>
                        <p className="text-xs text-gray-500">Selecciona el producto, la cantidad y la fecha planificada.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Producto Terminado</label>
                        <select name="id_producto" required className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" value={form.id_producto} onChange={handleChange}>
                            <option value="">Seleccionar...</option>
                            {productosTerminados.map(p => (
                                <option key={p.id_producto} value={p.id_producto}>
                                    {p.nombre} (Stock: {p.stock_actual})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad a Producir</label>
                        <input name="cantidad" type="number" min="1" required placeholder="Ej: 100"
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                            value={form.cantidad} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Fecha Planificada</label>
                        <input name="fecha_planificada" type="date" required
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                            value={form.fecha_planificada} onChange={handleChange} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                        {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <i className="bi bi-plus-lg"></i>}
                        {loading ? 'Creando...' : 'Crear Orden'}
                    </button>
                </form>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-4 animate-[fadeIn_0.5s_ease_0.15s]">
                        {filtros.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFiltroEstado(f.value)}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border ${
                                    filtroEstado === f.value
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <i className={`bi ${f.icon}`}></i>
                                {f.label}
                                {f.value && ordenes.filter(o => o.estado === f.value).length > 0 && (
                                    <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        filtroEstado === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {ordenes.filter(o => o.estado === f.value).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-[fadeSlideUp_0.5s_ease_0.25s]">
                        {ordenes.length === 0 ? (
                            <div className="p-16 text-center">
                                <i className="bi bi-clipboard-x text-5xl text-gray-300 block mb-4"></i>
                                <p className="text-gray-500 text-sm">No hay órdenes de producción registradas.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">N° Orden</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Producto</th>
                                            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Cantidad</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Fecha Planificada</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Creado por</th>
                                            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Estado</th>
                                            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {ordenes.map(o => {
                                            const est = estadoConfig[o.estado] || estadoConfig.planificada;
                                            return (
                                                <tr key={o.id_orden} className="hover:bg-gray-50/50 transition-colors animate-[fadeIn_0.4s_ease]" style={{ animationDelay: `${ordenes.indexOf(o) * 0.05}s` }}>
                                                    <td className="px-5 py-4">
                                                        <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">{o.numero_orden}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm font-medium text-gray-800">{o.producto?.nombre || 'Producto #' + o.id_producto}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="text-sm font-semibold text-gray-700">{o.cantidad}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                                                            <i className="bi bi-calendar3 text-gray-400"></i>
                                                            {o.fecha_planificada}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="text-sm text-gray-700">
                                                            {o.usuario ? `${o.usuario.nombre} ${o.usuario.apellido || ''}` : '—'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {o.fecha_creacion ? new Date(o.fecha_creacion).toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${est.class}`}>
                                                            <i className={`bi ${est.icon}`}></i>
                                                            {est.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            {o.estado !== 'completada' && o.estado !== 'cancelada' && (
                                                                <>
                                                                    <button onClick={() => abrirEdicion(o)}
                                                                        className="w-full bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98]">
                                                                        <i className="bi bi-calendar-event"></i> Reprogramar
                                                                    </button>
                                                                    <div className="flex gap-1.5">
                                                                        {o.estado === 'planificada' && (
                                                                            <button onClick={() => handleCambiarEstado(o, 'en_proceso')}
                                                                                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.05] active:scale-[0.95]">
                                                                                <i className="bi bi-play-fill"></i> Iniciar
                                                                            </button>
                                                                        )}
                                                                        {o.estado === 'en_proceso' && (
                                                                            <button onClick={() => handleCambiarEstado(o, 'completada')}
                                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.05] active:scale-[0.95]">
                                                                                <i className="bi bi-check-lg"></i> Completar
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => handleCambiarEstado(o, 'cancelada')}
                                                                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.05] active:scale-[0.95]">
                                                                            <i className="bi bi-x-lg"></i> Cancelar
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {o.estado === 'completada' && (
                                                                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-1.5">
                                                                    <i className="bi bi-check2-all"></i> Finalizada
                                                                </span>
                                                            )}
                                                            {o.estado === 'cancelada' && (
                                                                <span className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 px-4 py-2 rounded-xl flex items-center gap-1.5">
                                                                    <i className="bi bi-slash-circle"></i> Cancelada
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="border-t border-gray-50 px-5 py-3 flex justify-between items-center">
                            <span className="text-xs text-gray-400">{ordenes.length} orden(es) registrada(s)</span>
                        </div>
                    </div>

            {/* Modal */}
            {editModal.visible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-[scaleIn_0.25s_ease]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <i className="bi bi-calendar-event text-blue-600"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Reprogramar Orden</h3>
                                    <p className="text-xs text-gray-500">{editModal.orden?.numero_orden}</p>
                                </div>
                            </div>
                            <button onClick={cerrarEdicion} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <i className="bi bi-x-lg text-gray-400"></i>
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Estado</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {estadoOptions.map(eo => {
                                        const cfg = estadoConfig[eo];
                                        return (
                                            <label key={eo}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${
                                                    editModal.orden?.estado === eo
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}>
                                                <input type="radio" name="estado" value={eo}
                                                    checked={editModal.orden?.estado === eo}
                                                    onChange={handleEditChange}
                                                    className="accent-emerald-600" />
                                                <i className={`bi ${cfg.icon}`}></i>
                                                {cfg.label}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad</label>
                                <input name="cantidad" type="number" min="1" required
                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                    value={editModal.orden?.cantidad || ''} onChange={handleEditChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Fecha Planificada</label>
                                <input name="fecha_planificada" type="date" required
                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                    value={editModal.orden?.fecha_planificada || ''} onChange={handleEditChange} />
                            </div>
                            <div className="flex gap-3 pt-3">
                                <button type="button" onClick={cerrarEdicion}
                                    className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm">
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                                    <i className="bi bi-check-lg"></i> Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}


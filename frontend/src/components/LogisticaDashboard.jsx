const API_URL = 'http://localhost:8000';

const estadoBadge = {
    confirmado: 'bg-blue-100 text-blue-800 border-blue-200',
    preparacion: 'bg-purple-100 text-purple-800 border-purple-200',
    enviado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const estadoIcon = {
    confirmado: 'bi-check-circle',
    preparacion: 'bi-gear',
    enviado: 'bi-truck',
    entregado: 'bi-check2-all',
};

const estadoLabels = {
    confirmado: 'Pendiente',
    preparacion: 'En preparación',
    enviado: 'Enviado',
    entregado: 'Entregado',
};

const filtros = [
    { value: '', label: 'Todos', icon: 'bi-list' },
    { value: 'confirmado', label: 'Pendiente', icon: 'bi-clock-history' },
    { value: 'preparacion', label: 'En preparación', icon: 'bi-gear' },
    { value: 'enviado', label: 'Enviado', icon: 'bi-truck' },
    { value: 'entregado', label: 'Entregado', icon: 'bi-check2-all' },
];

const siguienteEstado = {
    confirmado: 'preparacion',
    preparacion: 'enviado',
    enviado: 'entregado',
};

export default function LogisticaDashboard({
    pedidos,
    loading,
    filtroEstado,
    setFiltroEstado,
    pedidoExpandido,
    setPedidoExpandido,
    historial,
    cargandoHistorial,
    cargarHistorial,
    onActualizarEstado,
    modalEstado,
    setModalEstado,
    observacion,
    setObservacion,
    modalAbierto,
    setModalAbierto,
    comprobanteUrl,
}) {
    const pedidosFiltrados = filtroEstado
        ? pedidos.filter(p => p.estado === filtroEstado)
        : pedidos;

    const conteo = {};
    pedidos.forEach(p => { conteo[p.estado] = (conteo[p.estado] || 0) + 1; });

    function abrirModal(pedido, nuevoEstado) {
        setModalEstado({ pedido, nuevoEstado });
        setObservacion('');
        setModalAbierto(true);
    }

    function confirmarCambio() {
        if (!modalEstado) return;
        onActualizarEstado(modalEstado.pedido.id_pedido, modalEstado.nuevoEstado, observacion);
        setModalAbierto(false);
        setModalEstado(null);
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Logística</h1>
                <p className="text-gray-500 text-sm">Gestiona el despacho de pedidos confirmados.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {filtros.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFiltroEstado(f.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filtroEstado === f.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <i className={`bi ${f.icon}`}></i>
                        {f.label}
                        {f.value && conteo[f.value] > 0 && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filtroEstado === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {conteo[f.value]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : pedidosFiltrados.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <i className="bi bi-inbox text-6xl text-gray-300 block mb-4"></i>
                    <p className="text-gray-500 text-lg">
                        {filtroEstado
                            ? `No hay pedidos con estado "${estadoLabels[filtroEstado] || filtroEstado}"`
                            : 'No hay pedidos de logística'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pedidosFiltrados.map(pedido => (
                        <div key={pedido.id_pedido} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 pb-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div>
                                        <span className="text-sm text-gray-400">Pedido #</span>
                                        <span className="text-lg font-bold text-gray-800">{pedido.id_pedido}</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${estadoBadge[pedido.estado] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                        <i className={`bi ${estadoIcon[pedido.estado] || 'bi-question-circle'}`}></i>
                                        {estadoLabels[pedido.estado] || pedido.estado}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-4">
                                    <span><i className="bi bi-calendar3 me-1"></i>{new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    <span><i className="bi bi-person me-1"></i>{pedido.cliente?.usuario?.nombre} {pedido.cliente?.usuario?.apellido}</span>
                                    <span><i className="bi bi-envelope me-1"></i>{pedido.cliente?.usuario?.correo}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        if (pedidoExpandido === pedido.id_pedido) {
                                            setPedidoExpandido(null);
                                        } else {
                                            setPedidoExpandido(pedido.id_pedido);
                                            cargarHistorial(pedido.id_pedido);
                                        }
                                    }}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mb-3"
                                >
                                    <i className={`bi ${pedidoExpandido === pedido.id_pedido ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    {pedidoExpandido === pedido.id_pedido ? 'Ocultar detalles' : 'Ver detalles'}
                                </button>

                                {pedidoExpandido === pedido.id_pedido && (
                                    <div className="space-y-3 mb-4">
                                        <div className="space-y-2">
                                            {pedido.detalles.map(detalle => (
                                                <div key={detalle.id_detalle_pedido} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    {detalle.producto?.imagen ? (
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                            <img src={`${API_URL}/${detalle.producto.imagen}`} alt={detalle.producto.nombre} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                                                            <i className="bi bi-box text-gray-400 text-lg"></i>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">{detalle.producto?.nombre || 'Producto'}</p>
                                                        <p className="text-xs text-gray-500">{detalle.cantidad} x Bs {Number(detalle.subtotal / detalle.cantidad).toFixed(2)}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-800">Bs {Number(detalle.subtotal).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {pedido.comprobante && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2"><i className="bi bi-image me-1"></i>Comprobante de pago</p>
                                                <a href={comprobanteUrl(pedido.comprobante)} target="_blank" rel="noopener noreferrer" className="inline-block">
                                                    <div className="w-40 h-40 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:ring-2 hover:ring-emerald-400 transition-shadow">
                                                        <img src={comprobanteUrl(pedido.comprobante)} alt="Comprobante" className="w-full h-full object-cover" />
                                                    </div>
                                                </a>
                                            </div>
                                        )}

                                        {cargandoHistorial ? (
                                            <div className="flex justify-center py-4">
                                                <span className="inline-block w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                                            </div>
                                        ) : historial[pedido.id_pedido] && historial[pedido.id_pedido].length > 0 ? (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2"><i className="bi bi-clock-history me-1"></i>Historial de cambios</p>
                                                <div className="space-y-2">
                                                    {historial[pedido.id_pedido].map(h => (
                                                        <div key={h.id_historial} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-xs font-medium text-gray-800">
                                                                        {h.estado_anterior ? (
                                                                            <>{h.estado_anterior} <i className="bi bi-arrow-right text-emerald-500 mx-1"></i> </>) : null}
                                                                        {h.estado_nuevo}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400">
                                                                        {new Date(h.fecha_cambio).toLocaleString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                {h.observacion && (
                                                                    <p className="text-xs text-gray-500 mt-1 italic">"{h.observacion}"</p>
                                                                )}
                                                                {h.usuario && (
                                                                    <p className="text-[10px] text-gray-400 mt-0.5">por {h.usuario.nombre} {h.usuario.apellido}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-lg font-bold text-gray-800">Bs {Number(pedido.total).toFixed(2)}</span>

                                <div className="flex gap-2">
                                    {siguienteEstado[pedido.estado] && (
                                        <button
                                            onClick={() => abrirModal(pedido, siguienteEstado[pedido.estado])}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <i className={`bi ${
                                                siguienteEstado[pedido.estado] === 'preparacion' ? 'bi-gear' :
                                                siguienteEstado[pedido.estado] === 'enviado' ? 'bi-truck' : 'bi-check2-all'
                                            }`}></i>
                                            {siguienteEstado[pedido.estado] === 'preparacion' ? 'Iniciar preparación' :
                                             siguienteEstado[pedido.estado] === 'enviado' ? 'Marcar como enviado' :
                                             'Marcar como entregado'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalAbierto && modalEstado && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Cambiar estado del pedido</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Pedido <strong>#{modalEstado.pedido.id_pedido}</strong> — Pasar a{' '}
                            <strong>{estadoLabels[modalEstado.nuevoEstado] || modalEstado.nuevoEstado}</strong>
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observación (opcional)</label>
                            <textarea
                                value={observacion}
                                onChange={e => setObservacion(e.target.value)}
                                placeholder="Agrega una nota sobre este cambio..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarCambio}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                            >
                                Confirmar cambio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


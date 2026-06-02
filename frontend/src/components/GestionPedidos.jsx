const API_URL = 'http://localhost:8000';

const estadoBadge = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmado: 'bg-blue-100 text-blue-800 border-blue-200',
    preparacion: 'bg-purple-100 text-purple-800 border-purple-200',
    enviado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rechazado: 'bg-red-100 text-red-800 border-red-200',
};

const estadoIcon = {
    pendiente: 'bi-clock-history',
    confirmado: 'bi-check-circle',
    preparacion: 'bi-gear',
    enviado: 'bi-truck',
    entregado: 'bi-check2-all',
    rechazado: 'bi-x-circle',
};

const filtrosBase = [
    { value: '', label: 'Todos', icon: 'bi-list' },
    { value: 'pendiente', label: 'Pendiente', icon: 'bi-clock-history' },
    { value: 'confirmado', label: 'Confirmado', icon: 'bi-check-circle' },
    { value: 'rechazado', label: 'Rechazado', icon: 'bi-x-circle' },
];

export default function GestionPedidos({ user, pedidos, loading, onActualizarEstado, pedidoExpandido, setPedidoExpandido, comprobanteUrl, filtroEstado, setFiltroEstado }) {
    const esRolPedidos = user?.rol === 'pedidos';
    const filtros = esRolPedidos ? filtrosBase.filter(f => f.value !== 'rechazado') : filtrosBase;

    const pedidosFiltrados = filtroEstado
        ? pedidos.filter(p => p.estado === filtroEstado)
        : pedidos;

    const conteo = {};
    pedidos.forEach(p => { conteo[p.estado] = (conteo[p.estado] || 0) + 1; });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
                <p className="text-gray-500 text-sm">Revisa comprobantes y actualiza el estado de los pedidos.</p>
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
                    <p className="text-gray-500 text-lg">{filtroEstado ? `No hay pedidos con estado "${filtroEstado}"` : 'No hay pedidos registrados'}</p>
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
                                        {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-4">
                                    <span><i className="bi bi-calendar3 me-1"></i>{new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    <span><i className="bi bi-person me-1"></i>{pedido.cliente?.usuario?.nombre} {pedido.cliente?.usuario?.apellido}</span>
                                    <span><i className="bi bi-envelope me-1"></i>{pedido.cliente?.usuario?.correo}</span>
                                </div>

                                <button
                                    onClick={() => setPedidoExpandido(pedidoExpandido === pedido.id_pedido ? null : pedido.id_pedido)}
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
                                                <a
                                                    href={comprobanteUrl(pedido.comprobante)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block"
                                                >
                                                    <div className="w-40 h-40 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:ring-2 hover:ring-emerald-400 transition-shadow">
                                                        <img
                                                            src={comprobanteUrl(pedido.comprobante)}
                                                            alt="Comprobante"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-lg font-bold text-gray-800">Bs {Number(pedido.total).toFixed(2)}</span>

                                {pedido.estado === 'pendiente' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onActualizarEstado(pedido.id_pedido, 'confirmado')}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <i className="bi bi-check-lg"></i> Aprobar
                                        </button>
                                        <button
                                            onClick={() => onActualizarEstado(pedido.id_pedido, 'rechazado')}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <i className="bi bi-x-lg"></i> Rechazar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


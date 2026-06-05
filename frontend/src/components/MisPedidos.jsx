const API_URL = 'http://localhost:8000';

const estadoBadge = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmado: 'bg-blue-100 text-blue-800 border-blue-200',
    preparacion: 'bg-purple-100 text-purple-800 border-purple-200',
    enviado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelado: 'bg-red-100 text-red-800 border-red-200',
};

const estadoIcon = {
    pendiente: 'bi-clock-history',
    confirmado: 'bi-check-circle',
    preparacion: 'bi-gear',
    enviado: 'bi-truck',
    entregado: 'bi-check2-all',
    cancelado: 'bi-x-circle',
};

export default function MisPedidos({ pedidos, loading }) {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Mis Pedidos</h1>
                <p className="text-gray-500 text-sm">Historial de pedidos realizados.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : pedidos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <i className="bi bi-inbox text-6xl text-gray-300 block mb-4"></i>
                    <p className="text-gray-500 text-lg">No tienes pedidos aún</p>
                    <p className="text-gray-400 text-sm mt-1">Realiza tu primer pedido en Mi Tienda.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pedidos.map(pedido => (
                        <div key={pedido.id_pedido} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 pb-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                    <div>
                                        <span className="text-sm text-gray-400">Pedido #</span>
                                        <span className="text-lg font-bold text-gray-800">{pedido.id_pedido}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${estadoBadge[pedido.estado] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                            <i className={`bi ${estadoIcon[pedido.estado] || 'bi-question-circle'}`}></i>
                                            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-4">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>

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
                                                <p className="text-xs text-gray-500">
                                                    {detalle.cantidad} x Bs {Number(detalle.subtotal / detalle.cantidad).toFixed(2)}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800">Bs {Number(detalle.subtotal).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">Total</span>
                                <span className="text-lg font-bold text-gray-800">Bs {Number(pedido.total).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function NotificacionesCliente({
    notificaciones,
    loading,
    noLeidas,
    onMarcarLeida,
    onMarcarTodasLeidas,
}) {
    const iconos = {
        pedido: 'bi-box-seam',
        alerta: 'bi-exclamation-triangle',
        sistema: 'bi-gear',
    };

    const colores = {
        pedido: 'border-l-emerald-500 bg-emerald-50',
        alerta: 'border-l-red-500 bg-red-50',
        sistema: 'border-l-blue-500 bg-blue-50',
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mis Notificaciones</h1>
                    <p className="text-gray-500 text-sm">Mantente al tanto de tus pedidos.</p>
                </div>
                {noLeidas > 0 && (
                    <button
                        onClick={onMarcarTodasLeidas}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                        <i className="bi bi-check2-all"></i>
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            {noLeidas > 0 && (
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                    <i className="bi bi-bell-fill text-emerald-600"></i>
                    Tienes <strong>{noLeidas}</strong> notificación{noLeidas !== 1 ? 'es' : ''} sin leer
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : notificaciones.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <i className="bi bi-bell-slash text-6xl text-gray-300 block mb-4"></i>
                    <p className="text-gray-500 text-lg">No tienes notificaciones</p>
                    <p className="text-gray-400 text-sm mt-1">Las notificaciones de tus pedidos aparecerán aquí.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notificaciones.map(notif => (
                        <div
                            key={notif.id_notificacion}
                            className={`border-l-4 ${colores[notif.tipo] || 'border-l-gray-300 bg-white'} rounded-r-xl shadow-sm border border-gray-100 border-l-4 overflow-hidden transition-colors ${!notif.leida ? 'ring-1 ring-emerald-200' : 'opacity-75'}`}
                        >
                            <div className="p-4 flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.leida ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <i className={`bi ${iconos[notif.tipo] || 'bi-bell'} text-lg`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className={`text-sm font-semibold ${!notif.leida ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notif.titulo}
                                                {!notif.leida && (
                                                    <span className="ml-2 inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-0.5">{notif.mensaje}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                {new Date(notif.fecha_creacion).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            {!notif.leida && (
                                                <button
                                                    onClick={() => onMarcarLeida(notif.id_notificacion)}
                                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
                                                    title="Marcar como leída"
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

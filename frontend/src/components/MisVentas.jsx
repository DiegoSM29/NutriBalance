const API_URL = 'http://localhost:8000';

export default function MisVentas({ user, ventas, loading, ventaExpandida, setVentaExpandida }) {
    const totalVendido = ventas.reduce((acc, v) => acc + Number(v.total), 0);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <i className="bi bi-receipt text-emerald-600"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Mis Ventas</h1>
                        <p className="text-sm text-gray-500">Historial de ventas realizadas por {user?.nombre} {user?.apellido}</p>
                    </div>
                </div>
            </div>

            {ventas.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <i className="bi bi-receipt-cutoff text-blue-600"></i>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{ventas.length}</p>
                                <p className="text-xs text-gray-500">Ventas realizadas</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <i className="bi bi-currency-dollar text-emerald-600"></i>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">Bs {totalVendido.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">Total vendido</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <i className="bi bi-people text-amber-600"></i>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{new Set(ventas.map(v => v.id_cliente)).size}</p>
                                <p className="text-xs text-gray-500">Clientes atendidos</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : ventas.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <i className="bi bi-cart-x text-6xl text-gray-300 block mb-4"></i>
                    <p className="text-gray-500 text-lg">No has registrado ventas todavía.</p>
                    <p className="text-gray-400 text-sm mt-1">Las ventas que realices aparecerán aquí.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {ventas.map(venta => (
                        <div key={venta.id_venta} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6 pb-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <i className="bi bi-receipt text-emerald-600 text-lg"></i>
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold text-gray-800">Venta #{venta.id_venta}</span>
                                            <span className="text-xs text-gray-400 ml-2 font-mono">{venta.comprobante}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <i className="bi bi-calendar3"></i>
                                        {new Date(venta.fecha_venta).toLocaleString('es-BO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <i className="bi bi-person-circle text-gray-400"></i>
                                        <span className="font-medium text-gray-700">{venta.cliente?.usuario?.nombre} {venta.cliente?.usuario?.apellido}</span>
                                    </span>
                                    {venta.cliente?.usuario?.correo && (
                                        <span className="flex items-center gap-1.5">
                                            <i className="bi bi-envelope text-gray-400"></i>
                                            {venta.cliente.usuario.correo}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                                        <i className="bi bi-currency-dollar"></i>
                                        Bs {Number(venta.total).toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setVentaExpandida(ventaExpandida === venta.id_venta ? null : venta.id_venta)}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                    <i className={`bi ${ventaExpandida === venta.id_venta ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    {ventaExpandida === venta.id_venta ? 'Ocultar productos' : 'Ver productos'}
                                </button>
                            </div>

                            {ventaExpandida === venta.id_venta && (
                                <div className="border-t border-gray-100">
                                    <div className="p-6 space-y-3">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                            <i className="bi bi-box-seam"></i> Productos
                                        </h4>
                                        {venta.detalles?.map(detalle => (
                                            <div key={detalle.id_detalle} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    {detalle.producto?.imagen ? (
                                                        <img src={`${API_URL}/${detalle.producto.imagen}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <i className="bi bi-box text-gray-400 text-lg"></i>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{detalle.producto?.nombre || 'Producto'}</p>
                                                    <p className="text-xs text-gray-500">{detalle.cantidad} x Bs {Number(detalle.precio_unitario).toFixed(2)}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">Bs {Number(detalle.subtotal).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Total de la venta</span>
                                        <span className="text-xl font-bold text-emerald-700">Bs {Number(venta.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


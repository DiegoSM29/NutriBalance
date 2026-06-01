import { useState } from 'react';

const API_URL = 'http://localhost:8000';

const estadoBadge = {
    confirmado: 'bg-blue-100 text-blue-800 border-blue-200',
    preparacion: 'bg-purple-100 text-purple-800 border-purple-200',
    enviado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rechazado: 'bg-red-100 text-red-800 border-red-200',
};

const estadoIcon = {
    confirmado: 'bi-check-circle',
    preparacion: 'bi-gear',
    enviado: 'bi-truck',
    entregado: 'bi-check2-all',
    pendiente: 'bi-clock-history',
    rechazado: 'bi-x-circle',
};

function FacturaImprimible({ pedido, onClose }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:bg-white print:p-0 print:static print:inset-auto">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:max-h-none print:overflow-visible">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-800">Factura</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                        >
                            <i className="bi bi-printer"></i>
                            Imprimir
                        </button>
                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">NutriBalance</h1>
                            <p className="text-sm text-gray-500 mt-1">Suplementos deportivos</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">FACTURA</p>
                            <p className="text-sm text-gray-500"># {String(pedido.id_pedido).padStart(6, '0')}</p>
                        </div>
                    </div>

                    <div className="border-t border-b border-gray-200 py-4 mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Cliente</p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                {pedido.cliente?.usuario?.nombre} {pedido.cliente?.usuario?.apellido}
                            </p>
                            <p className="text-sm text-gray-500">{pedido.cliente?.usuario?.correo}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fecha</p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(pedido.fecha_pedido).toLocaleTimeString('es-ES', {
                                    hour: '2-digit', minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>

                    <table className="w-full mb-6">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Producto</th>
                                <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Cant.</th>
                                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Precio</th>
                                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.detalles.map(detalle => (
                                <tr key={detalle.id_detalle_pedido} className="border-b border-gray-100">
                                    <td className="py-3 text-sm font-medium text-gray-800">{detalle.producto?.nombre}</td>
                                    <td className="py-3 text-sm text-gray-600 text-center">{detalle.cantidad}</td>
                                    <td className="py-3 text-sm text-gray-600 text-right">Bs {Number(detalle.subtotal / detalle.cantidad).toFixed(2)}</td>
                                    <td className="py-3 text-sm font-medium text-gray-800 text-right">Bs {Number(detalle.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end border-t border-gray-200 pt-4">
                        <div className="w-64 space-y-1">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>Bs {Number(pedido.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Envío</span>
                                <span>Bs 0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>Bs {Number(pedido.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
                        <p>NutriBalance - Suplementos deportivos de calidad</p>
                        <p className="mt-1">Gracias por tu compra</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MisFacturas({ user, pedidos, loading }) {
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

    const pedidosFactura = pedidos.filter(p =>
        ['confirmado', 'preparacion', 'enviado', 'entregado'].includes(p.estado)
    );

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Mis Facturas</h1>
                <p className="text-gray-500 text-sm">Consulta y descarga las facturas de tus pedidos.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : pedidosFactura.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <i className="bi bi-receipt text-6xl text-gray-300 block mb-4"></i>
                    <p className="text-gray-500 text-lg">No tienes facturas disponibles</p>
                    <p className="text-gray-400 text-sm mt-1">Las facturas de tus pedidos aparecerán aquí cuando sean confirmados.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pedidosFactura.map(pedido => (
                        <div key={pedido.id_pedido} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <i className="bi bi-receipt text-emerald-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Factura # {String(pedido.id_pedido).padStart(6, '0')}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${estadoBadge[pedido.estado] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                        <i className={`bi ${estadoIcon[pedido.estado] || 'bi-question-circle'}`}></i>
                                        {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800">Bs {Number(pedido.total).toFixed(2)}</span>
                                    <button
                                        onClick={() => setFacturaSeleccionada(pedido)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                                    >
                                        <i className="bi bi-eye"></i>
                                        Ver factura
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {facturaSeleccionada && (
                <FacturaImprimible
                    pedido={facturaSeleccionada}
                    onClose={() => setFacturaSeleccionada(null)}
                />
            )}
        </div>
    );
}

const API_URL = 'http://localhost:8000';

import qrImage from '../assets/qr.jpeg';

export default function ClienteDashboard({
    user,
    productos,
    carrito,
    mensaje,
    loading,
    totalCarrito,
    agregarAlCarrito,
    modificarCantidad,
    confirmarPedido,
    showPagoModal,
    comprobante,
    onAbrirModalPago,
    onSeleccionarComprobante,
    onConfirmarPago,
    onCerrarModal,
}) {
    return (
        <>
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
                                    {producto.imagen ? (
                                        <div className="w-full h-36 rounded-lg overflow-hidden mb-3 bg-gray-100">
                                            <img
                                                src={`${API_URL}/${producto.imagen}`}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-36 rounded-lg mb-3 bg-gray-100 flex items-center justify-center">
                                            <i className="bi bi-image text-gray-400 text-3xl"></i>
                                        </div>
                                    )}
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
                                onClick={onAbrirModalPago}
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

            {showPagoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-[fadeIn_0.2s_ease]">
                        <button
                            onClick={onCerrarModal}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Pagar con QR</h2>
                        <p className="text-sm text-gray-500 text-center mb-5">
                            Escanea el código QR para realizar tu pago y sube el comprobante.
                        </p>

                        <div className="flex justify-center mb-5">
                            <div className="w-52 h-52 rounded-xl border-2 border-dashed border-gray-200 p-2 bg-gray-50 flex items-center justify-center">
                                <img
                                    src={qrImage}
                                    alt="QR de pago"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="bi bi-image me-1"></i>
                                Sube tu comprobante de pago
                            </label>
                            <div
                                onClick={() => document.getElementById('comprobante-input').click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
                            >
                                {comprobante ? (
                                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                                        <i className="bi bi-check-circle-fill text-lg"></i>
                                        <span className="text-sm font-medium">{comprobante.name}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSeleccionarComprobante(null); }}
                                            className="text-red-500 hover:text-red-700 ml-1"
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <i className="bi bi-cloud-arrow-up text-3xl text-gray-300 block mb-1"></i>
                                        <p className="text-sm text-gray-500">Haz clic para seleccionar la imagen</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · Max 5MB</p>
                                    </div>
                                )}
                            </div>
                            <input
                                id="comprobante-input"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files[0]) onSeleccionarComprobante(e.target.files[0]);
                                    e.target.value = '';
                                }}
                            />
                        </div>

                        <button
                            onClick={onConfirmarPago}
                            disabled={loading || !comprobante}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    Pagar y Confirmar Pedido <i className="bi bi-check-lg"></i>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

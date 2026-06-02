export default function ReporteDashboard({
    tipoReporte, setTipoReporte, fechaInicio, setFechaInicio, fechaFin, setFechaFin,
    generarReporte, datos, loading, error, exportarExcel, exportarPDF
}) {
    return (
        <div className="max-w-7xl mx-auto print:p-0">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 print:hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <i className="bi bi-graph-up-arrow text-indigo-600"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Generador de Reportes</h1>
                        <p className="text-sm text-gray-500">Analitica y toma de decisiones.</p>
                    </div>
                </div>

                <form onSubmit={generarReporte} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipo de Reporte</label>
                        <select className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
                            <option value="ventas">Reporte de Ventas</option>
                            <option value="inventario">Reporte de Inventario</option>
                            <option value="produccion">Reporte de Producción</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Fecha Inicio</label>
                        <input type="date" required className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Fecha Fin</label>
                        <input type="date" required className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                        {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <i className="bi bi-magic"></i>}
                        Generar
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-8 print:hidden">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
            )}

            {datos && !loading && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:border-none print:shadow-none print:p-0">
                    
                    <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Reporte de {tipoReporte}</h2>
                            <p className="text-gray-500 mt-1">Periodo: {new Date(fechaInicio).toLocaleDateString()} al {new Date(fechaFin).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 print:hidden">
                            <button onClick={exportarExcel} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2">
                                <i className="bi bi-file-earmark-spreadsheet"></i> Excel (CSV)
                            </button>
                            <button onClick={exportarPDF} className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                                <i className="bi bi-file-earmark-pdf"></i> PDF
                            </button>
                        </div>
                    </div>

                    {tipoReporte === 'ventas' && (
                        <div className="space-y-8">
                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl inline-block print:w-full">
                                <p className="text-sm text-indigo-600 font-bold uppercase">Ingresos Totales del Periodo</p>
                                <p className="text-4xl font-black text-indigo-900 mt-1">Bs {Number(datos.total).toFixed(2)}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Top 5 Productos Vendidos</h3>
                                    <table className="w-full text-sm text-left">
                                        <thead><tr className="text-gray-500"><th>Producto</th><th>Cantidad</th><th>Ingresos</th></tr></thead>
                                        <tbody>
                                            {datos.top_productos.map((p, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-2 font-medium text-gray-800">{p.nombre}</td>
                                                    <td className="py-2 text-indigo-600 font-bold">{p.cantidad_total}</td>
                                                    <td className="py-2">Bs {p.ingresos}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Rendimiento por Vendedor</h3>
                                    <table className="w-full text-sm text-left">
                                        <thead><tr className="text-gray-500"><th>Vendedor</th><th>N° Ventas</th><th>Total Recaudado</th></tr></thead>
                                        <tbody>
                                            {datos.por_vendedor.map((v, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-2 font-medium text-gray-800">{v.nombre} {v.apellido}</td>
                                                    <td className="py-2">{v.cantidad_ventas}</td>
                                                    <td className="py-2 text-emerald-600 font-bold">Bs {v.total_ventas}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {tipoReporte === 'inventario' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold text-red-600 mb-4 border-b border-red-100 pb-2 flex items-center gap-2">
                                    <i className="bi bi-exclamation-triangle"></i> Productos en Riesgo (Bajo Stock)
                                </h3>
                                {datos.bajo_stock.length === 0 ? <p className="text-sm text-gray-500">No hay productos en nivel crítico.</p> : (
                                    <table className="w-full text-sm text-left border border-red-100 rounded-lg overflow-hidden">
                                        <thead className="bg-red-50"><tr className="text-red-700"><th className="p-3">Producto</th><th className="p-3">Stock Actual</th><th className="p-3">Mínimo Permitido</th></tr></thead>
                                        <tbody>
                                            {datos.bajo_stock.map((p, i) => (
                                                <tr key={i} className="border-t border-red-50">
                                                    <td className="p-3 font-medium">{p.nombre}</td>
                                                    <td className="p-3 font-bold text-red-600">{p.stock_actual}</td>
                                                    <td className="p-3 text-gray-500">{p.stock_minimo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Resumen de Movimientos en el Periodo</h3>
                                <div className="flex gap-4">
                                    {datos.movimientos.map((m, i) => (
                                        <div key={i} className={`p-4 rounded-xl border flex-1 ${m.tipo_movimiento === 'ENTRADA' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                                            <p className={`text-xs font-bold uppercase ${m.tipo_movimiento === 'ENTRADA' ? 'text-emerald-600' : 'text-orange-600'}`}>{m.tipo_movimiento}S</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{m.cantidad_total} <span className="text-sm font-normal text-gray-500">unidades afectadas</span></p>
                                            <p className="text-xs text-gray-500 mt-2">En {m.total_movimientos} registros distintos.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {tipoReporte === 'produccion' && (
                        <div className="space-y-8">
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl inline-block print:w-full">
                                <p className="text-sm text-blue-600 font-bold uppercase">Eficiencia de Producción (Completadas / Total)</p>
                                <div className="flex items-end gap-3 mt-1">
                                    <p className="text-4xl font-black text-blue-900">{datos.eficiencia}%</p>
                                    <div className="w-48 h-3 bg-blue-200 rounded-full mb-2 overflow-hidden"><div className="h-full bg-blue-600" style={{width: `${datos.eficiencia}%`}}></div></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Estado de Órdenes</h3>
                                    <table className="w-full text-sm text-left">
                                        <thead><tr className="text-gray-500"><th>Estado</th><th>Cantidad de Órdenes</th><th>Total Unidades</th></tr></thead>
                                        <tbody>
                                            {datos.resumen_estados.map((e, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-2 font-medium capitalize text-gray-800">{e.estado.replace('_', ' ')}</td>
                                                    <td className="py-2">{e.total_ordenes}</td>
                                                    <td className="py-2 font-bold">{e.cantidad_total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Productos Más Fabricados</h3>
                                    <table className="w-full text-sm text-left">
                                        <thead><tr className="text-gray-500"><th>Producto</th><th>Unidades Terminadas</th></tr></thead>
                                        <tbody>
                                            {datos.mas_producidos.map((p, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-2 font-medium text-gray-800">{p.nombre}</td>
                                                    <td className="py-2 text-blue-600 font-bold">{p.total_producido}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


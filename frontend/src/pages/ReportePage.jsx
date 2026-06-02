import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReporte } from '../services/api';
import ReporteDashboard from '../components/ReporteDashboard';

export default function ReportePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [tipoReporte, setTipoReporte] = useState('ventas');

    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);
    
    const [fechaInicio, setFechaInicio] = useState(haceUnMes.toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState(hoy.toISOString().split('T')[0]);
    
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCambioTipo = (nuevoTipo) => {
        setTipoReporte(nuevoTipo);
        setDatos(null); 
        setError('');
    };

    useEffect(() => {
        if (!user || !['admin', 'super-admin'].includes(user.rol)) {
            navigate('/login');
        }
    }, [user, navigate]);

    const generarReporte = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await getReporte(tipoReporte, fechaInicio, fechaFin);
            setDatos(res.data);
        } catch (err) {
            setError(err.message || 'Error al generar el reporte.');
            setDatos(null);
        } finally {
            setLoading(false);
        }
    };

    // Funciones de Exportacion
    const exportarExcel = () => {
        if (!datos) return;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `REPORTE DE ${tipoReporte.toUpperCase()}\n`;
        csvContent += `Periodo: ${fechaInicio} al ${fechaFin}\n\n`;

        if (tipoReporte === 'ventas') {
            csvContent += "TOTAL VENTAS (Bs)\n" + datos.total + "\n\n";
            csvContent += "TOP PRODUCTOS\nNombre,Cantidad Vendida,Ingresos\n";
            datos.top_productos.forEach(p => { csvContent += `${p.nombre},${p.cantidad_total},${p.ingresos}\n`; });
            csvContent += "\nVENTAS POR VENDEDOR\nVendedor,Cantidad de Ventas,Total Generado\n";
            datos.por_vendedor.forEach(v => { csvContent += `${v.nombre} ${v.apellido},${v.cantidad_ventas},${v.total_ventas}\n`; });
        } else if (tipoReporte === 'inventario') {
            csvContent += "PRODUCTOS CON BAJO STOCK\nNombre,Stock Actual,Minimo Permitido\n";
            datos.bajo_stock.forEach(p => { csvContent += `${p.nombre},${p.stock_actual},${p.stock_minimo}\n`; });
            csvContent += "\nRESUMEN DE MOVIMIENTOS\nTipo,Total Movimientos,Cantidad de Productos\n";
            datos.movimientos.forEach(m => { csvContent += `${m.tipo_movimiento},${m.total_movimientos},${m.cantidad_total}\n`; });
        } else if (tipoReporte === 'produccion') {
            csvContent += `EFICIENCIA DE PRODUCCION: ${datos.eficiencia}%\n\n`;
            csvContent += "RESUMEN POR ESTADOS\nEstado,Ordenes,Total Producido\n";
            datos.resumen_estados.forEach(e => { csvContent += `${e.estado},${e.total_ordenes},${e.cantidad_total}\n`; });
            csvContent += "\nPRODUCTOS MAS PRODUCIDOS\nProducto,Cantidad Total\n";
            datos.mas_producidos.forEach(p => { csvContent += `${p.nombre},${p.total_producido}\n`; });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Reporte_${tipoReporte}_${fechaInicio}_al_${fechaFin}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportarPDF = () => {
        window.print();
    };

    return (
        <ReporteDashboard
            tipoReporte={tipoReporte}
            setTipoReporte={handleCambioTipo}
            fechaInicio={fechaInicio}
            setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}
            setFechaFin={setFechaFin}
            generarReporte={generarReporte}
            datos={datos}
            loading={loading}
            error={error}
            exportarExcel={exportarExcel}
            exportarPDF={exportarPDF}
        />
    );
}


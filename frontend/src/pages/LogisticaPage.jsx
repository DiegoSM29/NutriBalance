import { useState, useEffect } from 'react';
import { getPedidosLogistica, actualizarEstadoPedido, getHistorialPedido } from '../services/api';
import LogisticaDashboard from '../components/LogisticaDashboard';

const API_URL = 'http://localhost:8000';

export default function LogisticaPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pedidoExpandido, setPedidoExpandido] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [historial, setHistorial] = useState({});
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [modalEstado, setModalEstado] = useState(null);
    const [observacion, setObservacion] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            const res = await getPedidosLogistica();
            if (res.success) setPedidos(res.data);
        } catch (error) {
            console.error('Error al cargar pedidos', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarHistorial = async (idPedido) => {
        try {
            setCargandoHistorial(true);
            const res = await getHistorialPedido(idPedido);
            if (res.success) {
                setHistorial(prev => ({ ...prev, [idPedido]: res.data }));
            }
        } catch (error) {
            console.error('Error al cargar historial', error);
        } finally {
            setCargandoHistorial(false);
        }
    };

    const handleActualizarEstado = async (id, estado, observacion) => {
        try {
            await actualizarEstadoPedido(id, estado, observacion);
            setModalAbierto(false);
            setModalEstado(null);
            cargarPedidos();
        } catch (err) {
            const msg = err?.message || err?.errors ? Object.values(err.errors).flat().join(', ') : 'Error al actualizar estado';
            alert(msg);
        }
    };

    const comprobanteUrl = (ruta) => `${API_URL}/storage/${ruta}`;

    return (
        <LogisticaDashboard
            user={user}
            pedidos={pedidos}
            loading={loading}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            pedidoExpandido={pedidoExpandido}
            setPedidoExpandido={setPedidoExpandido}
            historial={historial}
            cargandoHistorial={cargandoHistorial}
            cargarHistorial={cargarHistorial}
            onActualizarEstado={handleActualizarEstado}
            modalEstado={modalEstado}
            setModalEstado={setModalEstado}
            observacion={observacion}
            setObservacion={setObservacion}
            modalAbierto={modalAbierto}
            setModalAbierto={setModalAbierto}
            comprobanteUrl={comprobanteUrl}
        />
    );
}

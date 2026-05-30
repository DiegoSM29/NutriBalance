import { useState, useEffect } from 'react';
import { getTodosPedidos, actualizarEstadoPedido } from '../services/api';
import GestionPedidos from '../components/GestionPedidos';

const API_URL = 'http://localhost:8000';

export default function GestionPedidosPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pedidoExpandido, setPedidoExpandido] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('pendiente');

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const res = await getTodosPedidos();
            if (res.success) setPedidos(res.data);
        } catch (error) {
            console.error('Error al cargar pedidos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActualizarEstado = async (id, estado) => {
        try {
            await actualizarEstadoPedido(id, estado);
            cargarPedidos();
        } catch (err) {
            console.error('Error al actualizar estado', err);
        }
    };

    const comprobanteUrl = (ruta) => `${API_URL}/storage/${ruta}`;

    return (
        <GestionPedidos
            user={user}
            pedidos={pedidos}
            loading={loading}
            onActualizarEstado={handleActualizarEstado}
            pedidoExpandido={pedidoExpandido}
            setPedidoExpandido={setPedidoExpandido}
            comprobanteUrl={comprobanteUrl}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
        />
    );
}
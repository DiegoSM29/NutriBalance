import { useState, useEffect } from 'react';
import { getMisPedidos } from '../services/api';
import MisPedidos from '../components/MisPedidos';

export default function MisPedidosPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function cargarPedidos() {
        try {
            const res = await getMisPedidos();
            if (res.success) setPedidos(res.data);
        } catch (error) {
            console.error('Error al cargar pedidos', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarPedidos();
    }, []);

    return (
        <MisPedidos
            user={user}
            pedidos={pedidos}
            loading={loading}
        />
    );
}


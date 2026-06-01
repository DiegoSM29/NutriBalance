import { useState, useEffect } from 'react';
import { getMisPedidos } from '../services/api';
import MisFacturas from '../components/MisFacturas';

export default function MisFacturasPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const res = await getMisPedidos();
            if (res.success) setPedidos(res.data);
        } catch (error) {
            console.error('Error al cargar pedidos', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MisFacturas
            user={user}
            pedidos={pedidos}
            loading={loading}
        />
    );
}

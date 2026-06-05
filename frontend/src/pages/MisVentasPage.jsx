import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisVentas } from '../services/api';
import MisVentas from '../components/MisVentas';

export default function MisVentasPage() {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }, []);

    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ventaExpandida, setVentaExpandida] = useState(null);

    const cargarVentas = useCallback(async () => {
        try {
            const res = await getMisVentas();
            if (res.success) setVentas(res.data);
        } catch (error) {
            console.error("Error cargando ventas", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user || user.rol !== 'ventas') {
            navigate('/login');
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            cargarVentas();
        }
    }, [user, navigate, cargarVentas]);

    return (
        <MisVentas
            user={user}
            ventas={ventas}
            loading={loading}
            ventaExpandida={ventaExpandida}
            setVentaExpandida={setVentaExpandida}
        />
    );
}


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisVentas } from '../services/api';
import MisVentas from '../components/MisVentas';

export default function MisVentasPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ventaExpandida, setVentaExpandida] = useState(null);

    useEffect(() => {
        if (!user || !['ventas', 'admin', 'super-admin'].includes(user.rol)) {
            navigate('/login');
        } else {
            cargarVentas();
        }
    }, []);

    const cargarVentas = async () => {
        try {
            const res = await getMisVentas();
            if (res.success) setVentas(res.data);
        } catch (error) {
            console.error("Error cargando ventas", error);
        } finally {
            setLoading(false);
        }
    };

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

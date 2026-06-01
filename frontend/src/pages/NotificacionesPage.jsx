import { useState, useEffect, useCallback } from 'react';
import { getMisNotificaciones, marcarNotificacionLeida, marcarTodasNotificacionesLeidas } from '../services/api';
import NotificacionesCliente from '../components/NotificacionesCliente';

export default function NotificacionesPage() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [loading, setLoading] = useState(true);

    const cargarNotificaciones = useCallback(async () => {
        try {
            const res = await getMisNotificaciones();
            if (res.success) {
                setNotificaciones(res.data);
                setNoLeidas(res.no_leidas);
            }
        } catch (error) {
            console.error('Error al cargar notificaciones', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    const handleMarcarLeida = async (id) => {
        try {
            await marcarNotificacionLeida(id);
            cargarNotificaciones();
        } catch (err) {
            console.error('Error al marcar notificación como leída', err);
        }
    };

    const handleMarcarTodasLeidas = async () => {
        try {
            await marcarTodasNotificacionesLeidas();
            cargarNotificaciones();
        } catch (err) {
            console.error('Error al marcar todas como leídas', err);
        }
    };

    return (
        <NotificacionesCliente
            notificaciones={notificaciones}
            loading={loading}
            noLeidas={noLeidas}
            onMarcarLeida={handleMarcarLeida}
            onMarcarTodasLeidas={handleMarcarTodasLeidas}
        />
    );
}

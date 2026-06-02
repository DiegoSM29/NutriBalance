import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getOrdenesProduccion, crearOrdenProduccion, actualizarOrdenProduccion,
    getAdminProductos
} from '../services/api';
import OrdenProduccionDashboard from '../components/OrdenProduccionDashboard';

const initialForm = {
    id_producto: '',
    cantidad: '',
    fecha_planificada: '',
};

export default function OrdenProduccionPage() {
    const navigate = useNavigate();
    const usuarioActual = JSON.parse(localStorage.getItem('user'));

    const [ordenes, setOrdenes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [editModal, setEditModal] = useState({ visible: false, orden: null });

    useEffect(() => {
        if (!usuarioActual || !['super-admin', 'admin', 'produccion'].includes(usuarioActual.rol)) {
            navigate('/login');
        } else {
            cargarOrdenes();
            cargarProductos();
        }
    }, [filtroEstado]);

    const cargarOrdenes = async () => {
        try {
            const res = await getOrdenesProduccion(filtroEstado);
            if (res.success) setOrdenes(res.data);
        } catch (error) {
            console.error("Error cargando órdenes", error);
        }
    };

    const cargarProductos = async () => {
        try {
            const res = await getAdminProductos();
            if (res.success) setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const res = await crearOrdenProduccion(form);
            setMensaje({ tipo: 'success', texto: res.message });
            setForm(initialForm);
            cargarOrdenes();
        } catch (err) {
            let errorTexto = 'Error al crear la orden.';
            if (err.errors) errorTexto = Object.values(err.errors)[0][0];
            else if (err.message) errorTexto = err.message;
            setMensaje({ tipo: 'error', texto: errorTexto });
        } finally {
            setLoading(false);
        }
    };

    const abrirEdicion = (orden) => {
        setEditModal({ visible: true, orden });
    };

    const cerrarEdicion = () => {
        setEditModal({ visible: false, orden: null });
    };

    const handleEditChange = (e) => {
        setEditModal({ ...editModal, orden: { ...editModal.orden, [e.target.name]: e.target.value } });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' });

        try {
            const data = {};
            if (editModal.orden.fecha_planificada) data.fecha_planificada = editModal.orden.fecha_planificada;
            if (editModal.orden.cantidad) data.cantidad = editModal.orden.cantidad;
            if (editModal.orden.estado) data.estado = editModal.orden.estado;

            const res = await actualizarOrdenProduccion(editModal.orden.id_orden, data);
            setMensaje({ tipo: 'success', texto: res.message });
            cerrarEdicion();
            cargarOrdenes();
        } catch (err) {
            let errorTexto = 'Error al actualizar la orden.';
            if (err.errors) errorTexto = Object.values(err.errors)[0][0];
            else if (err.message) errorTexto = err.message;
            setMensaje({ tipo: 'error', texto: errorTexto });
        }
    };

    const handleCambiarEstado = async (orden, nuevoEstado) => {
        if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;
        try {
            const res = await actualizarOrdenProduccion(orden.id_orden, { estado: nuevoEstado });
            setMensaje({ tipo: 'success', texto: res.message });
            cargarOrdenes();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message || 'Error al actualizar estado.' });
        }
    };

    return (
        <OrdenProduccionDashboard
            ordenes={ordenes}
            productos={productos}
            mensaje={mensaje}
            loading={loading}
            form={form}
            filtroEstado={filtroEstado}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setFiltroEstado={setFiltroEstado}
            abrirEdicion={abrirEdicion}
            handleCambiarEstado={handleCambiarEstado}
            editModal={editModal}
            cerrarEdicion={cerrarEdicion}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
        />
    );
}

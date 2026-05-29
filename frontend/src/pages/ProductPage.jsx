import { useState, useEffect, useRef } from 'react';
import { getAdminProductos, crearAdminProducto, actualizarAdminProducto, eliminarAdminProducto } from '../services/api';
import ProductDashboard from '../components/ProductDashboard';

const initialForm = {
    nombre: '',
    categoria: 'Suplementos',
    tipo_producto: 'Polvo',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: ''
};

export default function ProductPage() {
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState(initialForm);
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

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

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    const iniciarEdicion = (producto) => {
        setModoEdicion(true);
        setProductoEditandoId(producto.id_producto);
        setForm({
            nombre: producto.nombre,
            categoria: producto.categoria || 'Suplementos',
            tipo_producto: producto.tipo_producto || 'Polvo',
            precio_venta: producto.precio_venta,
            stock_actual: producto.stock_actual,
            stock_minimo: producto.stock_minimo
        });
        setImagen(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setModoEdicion(false);
        setProductoEditandoId(null);
        setForm(initialForm);
        setImagen(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('categoria', form.categoria);
        formData.append('tipo_producto', form.tipo_producto);
        formData.append('precio_venta', form.precio_venta);
        formData.append('stock_actual', form.stock_actual);
        formData.append('stock_minimo', form.stock_minimo);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            let res;
            if (modoEdicion) {
                res = await actualizarAdminProducto(productoEditandoId, formData);
            } else {
                res = await crearAdminProducto(formData);
            }

            setMensaje({ tipo: 'success', texto: res.message });
            cancelarEdicion();
            cargarProductos();
        } catch (err) {
            let errorTexto = 'Error al procesar el producto.';
            if (err.errors) errorTexto = Object.values(err.errors)[0][0];
            else if (err.message) errorTexto = err.message;
            setMensaje({ tipo: 'error', texto: errorTexto });
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto: ${nombre}?`)) return;

        try {
            const res = await eliminarAdminProducto(id);
            setMensaje({ tipo: 'success', texto: res.message });
            cargarProductos();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message || 'Error al eliminar.' });
        }
    };

    return (
        <ProductDashboard
            productos={productos}
            mensaje={mensaje}
            loading={loading}
            modoEdicion={modoEdicion}
            form={form}
            fileInputRef={fileInputRef}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            iniciarEdicion={iniciarEdicion}
            cancelarEdicion={cancelarEdicion}
            handleEliminar={handleEliminar}
        />
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, crearUsuario, actualizarUsuario } from '../services/api';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
    const navigate = useNavigate();
    const adminActual = JSON.parse(localStorage.getItem('user'));

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBuscar] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    const [form, setForm] = useState({ 
        nombre: '', 
        apellido: '', 
        correo: '', 
        password: '', 
        password_confirmation: '', 
        rol: 'ventas' 
    });

    useEffect(() => {
        if (!adminActual || !['admin', 'super-admin'].includes(adminActual.rol)) {
            navigate('/login');
        } else {
            cargarUsuarios();
        }
    }, [busqueda, filtroRol]);

    const cargarUsuarios = async () => {
        try {
            const res = await getUsuarios({ buscar: busqueda, rol: filtroRol });
            if (res.success) setUsuarios(res.data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    const handleCrearEmpleado = async (e) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            setMensaje({ tipo: 'error', texto: '¡Las contraseñas no coinciden!' });
            return;
        }

        try {
            const res = await crearUsuario(form);
            setMensaje({ tipo: 'success', texto: res.message });
            setForm({ nombre: '', apellido: '', correo: '', password: '', password_confirmation: '', rol: 'ventas' });
            cargarUsuarios();
        } catch (err) {
            let errorTexto = 'Error al crear empleado. Revisa los datos.';
            if (err.errors) {
                errorTexto = Object.values(err.errors)[0][0];
            } else if (err.message) {
                errorTexto = err.message;
            }
            setMensaje({ tipo: 'error', texto: errorTexto });
        }
    };

    const handleCambiarEstado = async (usuario) => {
        try {
            const res = await actualizarUsuario(usuario.id_usuario, { estado: !usuario.estado });
            setMensaje({ tipo: 'success', texto: res.message });
            cargarUsuarios();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message || 'Error al actualizar' });
        }
    };

    const handleCambiarRol = async (usuario, nuevoRol) => {
        if (nuevoRol === usuario.rol) return;
        try {
            const res = await actualizarUsuario(usuario.id_usuario, { rol: nuevoRol });
            setMensaje({ tipo: 'success', texto: `Rol cambiado a ${nuevoRol}` });
            cargarUsuarios();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message || 'Error al cambiar rol' });
        }
    };

    return (
        <AdminDashboard
            adminActual={adminActual}
            usuarios={usuarios}
            busqueda={busqueda}
            filtroRol={filtroRol}
            mensaje={mensaje}
            form={form}
            showPassword={showPassword}
            setBuscar={setBuscar}
            setFiltroRol={setFiltroRol}
            setForm={setForm}
            setShowPassword={setShowPassword}
            handleCrearEmpleado={handleCrearEmpleado}
            handleCambiarEstado={handleCambiarEstado}
            handleCambiarRol={handleCambiarRol}
        />
    );
}

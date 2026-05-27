import { useState, useEffect } from 'react';
import { getUsuarios, crearUsuario, actualizarUsuario } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const adminActual = JSON.parse(localStorage.getItem('user'));

    // --- ESTADOS: Todos agrupados al inicio ---
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
        if (!adminActual || adminActual.rol !== 'admin') {
            navigate('/login');
        } else {
            cargarUsuarios();
        }
    }, [busqueda, filtroRol]);

    const cargarUsuarios = async () => {
        try {
            // Nota: Aquí se envía el filtroRol vacío si se selecciona "Todos los roles"
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

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                        <p className="text-sm text-gray-500">Gestión de usuarios y roles del sistema.</p>
                    </div>
                    <div className="text-right">
                        <span className="block font-semibold text-emerald-600">{adminActual?.nombre} {adminActual?.apellido}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Administrador</span>
                    </div>
                </header>

                {mensaje.texto && (
                    <div className={`mb-6 p-4 rounded-lg text-sm ${mensaje.tipo === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {mensaje.texto}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Formulario Crear Empleado */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Registrar Empleado</h2>
                        <form onSubmit={handleCrearEmpleado} className="space-y-4">
                            <input type="text" placeholder="Nombre" required className="w-full p-2 border rounded text-sm" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
                            <input type="text" placeholder="Apellido" required className="w-full p-2 border rounded text-sm" value={form.apellido} onChange={(e) => setForm({...form, apellido: e.target.value})} />
                            <input type="email" placeholder="Correo" required className="w-full p-2 border rounded text-sm" value={form.correo} onChange={(e) => setForm({...form, correo: e.target.value})} />
                            
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Contraseña" 
                                    required 
                                    className="w-full p-2 border rounded text-sm pr-10" 
                                    value={form.password} 
                                    onChange={(e) => setForm({...form, password: e.target.value})} 
                                />
                                <button type="button" className="absolute right-3 top-2.5 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>

                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Confirmar contraseña" 
                                required 
                                className="w-full p-2 border rounded text-sm" 
                                value={form.password_confirmation} 
                                onChange={(e) => setForm({...form, password_confirmation: e.target.value})} 
                            />

                            <select className="w-full p-2 border rounded text-sm bg-white" value={form.rol} onChange={(e) => setForm({...form, rol: e.target.value})}>
                                <option value="admin">Administrador</option>
                                <option value="ventas">Ventas</option>
                                <option value="inventario">Inventario</option>
                                <option value="produccion">Producción</option>
                                <option value="logistica">Logística</option>
                            </select>
                            
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded transition-colors text-sm">
                                Crear Empleado
                            </button>
                        </form>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Lista de Usuarios</h2>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Buscar..." className="p-2 border rounded text-sm w-full sm:w-48" value={busqueda} onChange={(e) => setBuscar(e.target.value)} />
                                <select className="p-2 border rounded text-sm bg-white" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                                    <option value="">Todos los roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="ventas">Ventas</option>
                                    <option value="inventario">Inventario</option>
                                    <option value="produccion">Producción</option>
                                    <option value="logistica">Logística</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                                        <th className="p-3 font-medium">Usuario</th>
                                        <th className="p-3 font-medium">Rol</th>
                                        <th className="p-3 font-medium">Estado</th>
                                        <th className="p-3 font-medium text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id_usuario} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="font-medium text-gray-800">{u.nombre} {u.apellido}</div>
                                                <div className="text-gray-500 text-xs">{u.correo}</div>
                                            </td>
                                            <td className="p-3 capitalize">{u.rol}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.estado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {u.id_usuario !== adminActual.id_usuario && (
                                                    <button 
                                                        onClick={() => handleCambiarEstado(u)}
                                                        className={`text-xs px-3 py-1 rounded font-medium transition-colors ${u.estado ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                    >
                                                        {u.estado ? 'Deshabilitar' : 'Habilitar'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
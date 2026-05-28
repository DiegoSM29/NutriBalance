import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPerfil, updatePerfil, uploadFoto } from '../services/api';

const API_URL = 'http://localhost:8000';

export default function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        password_confirmation: '',
        current_password: '',
    });
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        cargarPerfil();
    }, []);

    async function cargarPerfil() {
        try {
            const res = await getPerfil(user.id_usuario);
            if (res.success) {
                const u = res.data;
                setForm({
                    nombre: u.nombre || '',
                    apellido: u.apellido || '',
                    correo: u.correo || '',
                    password: '',
                    password_confirmation: '',
                    current_password: '',
                });
                if (u.foto) {
                    setFotoPreview(`${API_URL}/${u.foto}`);
                }
                setUltimaActualizacion(u.ultima_actualizacion);
            }
        } catch (err) {
            console.error('Error cargando perfil', err);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    }

    function handleFotoChange(e) {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    async function handleUploadFoto() {
        if (!foto) return;
        setUploadingFoto(true);
        try {
            const res = await uploadFoto(user.id_usuario, foto);
            if (res.success) {
                setMensaje({ tipo: 'success', texto: 'Foto actualizada correctamente.' });
                const updatedUser = { ...user, foto: res.data.foto };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setFoto(null);
                if (res.data.foto) {
                    setFotoPreview(`${API_URL}/${res.data.foto}?_=${Date.now()}`);
                }
            }
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.errors?.foto?.[0] || 'Error al subir foto.' });
        } finally {
            setUploadingFoto(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' });
        setErrors({});

        const clientErrors = {};
        if (!form.nombre.trim()) clientErrors.nombre = 'El nombre es obligatorio.';
        if (!form.apellido.trim()) clientErrors.apellido = 'El apellido es obligatorio.';
        if (form.password) {
            if (!form.current_password) clientErrors.current_password = 'Ingresa tu contraseña actual.';
            if (form.password.length < 8) clientErrors.password = 'Mínimo 8 caracteres.';
            else if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) clientErrors.password = 'Debe contener una letra y un número.';
            if (form.password !== form.password_confirmation) clientErrors.password_confirmation = 'Las contraseñas no coinciden.';
        }

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                nombre: form.nombre,
                apellido: form.apellido,
            };
            if (form.password) {
                payload.password = form.password;
                payload.password_confirmation = form.password_confirmation;
                payload.current_password = form.current_password;
            }

            const res = await updatePerfil(user.id_usuario, payload);
            if (res.success) {
                const updatedUser = {
                    ...user,
                    nombre: res.data.nombre,
                    apellido: res.data.apellido,
                    foto: res.data.foto,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUltimaActualizacion(res.data.ultima_actualizacion);
                setForm({ ...form, password: '', password_confirmation: '', current_password: '' });
                setMensaje({ tipo: 'success', texto: 'Perfil actualizado correctamente.' });
            }
        } catch (err) {
            if (err.errors) {
                const fieldErrors = {};
                for (const [key, msgs] of Object.entries(err.errors)) {
                    fieldErrors[key] = msgs[0];
                }
                setErrors(fieldErrors);
            } else {
                setMensaje({ tipo: 'error', texto: err.message || 'Error al actualizar.' });
            }
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full px-4 py-3 ps-11 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm";
    const iconClass = "absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg";

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
            <p className="text-gray-400 text-sm mb-6">Gestiona tu información personal</p>

            {mensaje.texto && (
                <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${mensaje.tipo === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill text-emerald-500' : 'bi-exclamation-circle-fill text-red-500'} text-lg`}></i>
                    {mensaje.texto}
                </div>
            )}

            {ultimaActualizacion && (
                <div className="mb-6 text-xs text-gray-400 flex items-center gap-1">
                    <i className="bi bi-clock-history"></i>
                    Última actualización: {new Date(ultimaActualizacion).toLocaleString('es-BO')}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Foto de perfil</h2>
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl overflow-hidden shrink-0">
                        {fotoPreview ? (
                            <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                            <i className="bi bi-person"></i>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer cursor-pointer"
                        />
                        {foto && (
                            <button
                                onClick={handleUploadFoto}
                                disabled={uploadingFoto}
                                className="mt-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors disabled:opacity-60"
                            >
                                {uploadingFoto ? 'Subiendo...' : 'Guardar foto'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Información personal</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                <i className="bi bi-person me-1.5"></i>Nombre
                            </label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-person-badge`}></i>
                                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className={inputClass} />
                            </div>
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                <i className="bi bi-person me-1.5"></i>Apellido
                            </label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-person-badge`}></i>
                                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className={inputClass} />
                            </div>
                            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            <i className="bi bi-envelope me-1.5"></i>Correo electrónico
                        </label>
                        <div className="relative">
                            <i className={`${iconClass} bi bi-envelope-at`}></i>
                            <input name="correo" value={form.correo} disabled className="w-full px-4 py-3 ps-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">El correo no se puede modificar.</p>
                    </div>

                    <hr className="border-gray-100" />

                    <h3 className="text-md font-semibold text-gray-700">Cambiar contraseña</h3>
                    <p className="text-xs text-gray-400 -mt-3">Deja los campos vacíos si no deseas cambiarla.</p>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            <i className="bi bi-lock me-1.5"></i>Contraseña actual
                        </label>
                        <div className="relative">
                            <i className={`${iconClass} bi bi-key`}></i>
                            <input name="current_password" type={showCurrentPassword ? 'text' : 'password'} value={form.current_password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm" />
                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                        {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                <i className="bi bi-lock me-1.5"></i>Nueva contraseña
                            </label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-lock`}></i>
                                <input name="password" type={showNewPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm" />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                    <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                <i className="bi bi-lock me-1.5"></i>Confirmar contraseña
                            </label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-lock`}></i>
                                <input name="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-400/30"
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg text-lg"></i>
                                Guardar cambios
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

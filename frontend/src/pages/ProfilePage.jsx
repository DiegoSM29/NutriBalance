import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPerfil, updatePerfil, uploadFoto } from '../services/api';
import Profile from '../components/Profile';
import fondoBg from '../assets/fondo3.webp';

export default function ProfilePage() {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }, []);

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
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

    const esCliente = user?.rol === 'cliente';
    const API_URL = 'http://localhost:8000';

    const cargarPerfil = useCallback(async () => {
        try {
            const res = await getPerfil(user.id_usuario);
            if (res.success) {
                const u = res.data;
                setForm({
                    nombre: u.nombre || '',
                    apellido: u.apellido || '',
                    correo: u.correo || '',
                    telefono: u.cliente?.telefono || '',
                    direccion: u.cliente?.direccion || '',
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
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarPerfil();
    }, [user, navigate, cargarPerfil]);

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
            const payload = { nombre: form.nombre, apellido: form.apellido };
            if (esCliente) {
                payload.telefono = form.telefono;
                payload.direccion = form.direccion;
            }
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
                if (esCliente) {
                    updatedUser.telefono = res.data.telefono;
                    updatedUser.direccion = res.data.direccion;
                }
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

    return (
        <div
            className="relative min-h-screen -m-4 md:-m-8 p-4 md:p-8"
            style={{ backgroundImage: `url(${fondoBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10">
                <Profile
                    form={form}
                    errors={errors}
                    mensaje={mensaje}
                    loading={loading}
                    uploadingFoto={uploadingFoto}
                    fotoPreview={fotoPreview}
                    foto={foto}
                    showCurrentPassword={showCurrentPassword}
                    showNewPassword={showNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    esCliente={esCliente}
                    ultimaActualizacion={ultimaActualizacion}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleFotoChange={handleFotoChange}
                    handleUploadFoto={handleUploadFoto}
                    setShowCurrentPassword={setShowCurrentPassword}
                    setShowNewPassword={setShowNewPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                />
            </div>
        </div>
    );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCliente } from '../services/api';
import Register from '../components/Register';

const initialForm = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    password_confirmation: '',
    telefono: '+591 ',
    direccion: '',
};

function validate(form) {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!form.apellido.trim()) errors.apellido = 'El apellido es obligatorio.';
    if (!form.correo.trim()) errors.correo = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) errors.correo = 'Correo inválido.';
    if (!form.password) errors.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 8) errors.password = 'Mínimo 8 caracteres.';
    else if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) errors.password = 'Debe contener una letra y un número.';
    if (form.password !== form.password_confirmation) errors.password_confirmation = 'Las contraseñas no coinciden.';
    return errors;
}

export default function RegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError('');
        setSuccess('');

        const clientErrors = validate(form);
        setErrors(clientErrors);
        if (Object.keys(clientErrors).length > 0) return;

        setLoading(true);
        try {
            const result = await registerCliente({
                nombre: form.nombre,
                apellido: form.apellido,
                correo: form.correo,
                password: form.password,
                telefono: form.telefono || undefined,
                direccion: form.direccion || undefined,
            });
            setSuccess(result.message || 'Registro exitoso.');
            setForm(initialForm);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            if (err.errors) {
                const fieldErrors = {};
                for (const [key, msgs] of Object.entries(err.errors)) {
                    fieldErrors[key] = msgs[0];
                }
                setErrors(fieldErrors);
            } else {
                setServerError(err.message || 'Error al registrar. Intente de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Register
            form={form}
            errors={errors}
            serverError={serverError}
            success={success}
            loading={loading}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
        />
    );
}

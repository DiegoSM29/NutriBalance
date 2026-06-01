import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import Login from '../components/Login';

const initialForm = {
    correo: '',
    password: '',
};

function validate(form) {
    const errors = {};
    if (!form.correo.trim()) {
        errors.correo = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
        errors.correo = 'Correo inválido.';
    }
    if (!form.password) {
        errors.password = 'La contraseña es obligatoria.';
    }
    return errors;
}

export default function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError('');

        const clientErrors = validate(form);
        setErrors(clientErrors);
        if (Object.keys(clientErrors).length > 0) return;

        setLoading(true);

        try {
            const result = await loginUser({
                correo: form.correo,
                password: form.password,
            });

            localStorage.setItem('user', JSON.stringify(result.data.usuario));

            navigate('/empresa');

        } catch (err) {
            setServerError(err.message || 'Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Login
            form={form}
            errors={errors}
            serverError={serverError}
            loading={loading}
            showPassword={showPassword}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowPassword={setShowPassword}
        />
    );
}

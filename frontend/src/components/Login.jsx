import { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const inputClass =
  "w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm";

const iconClass =
  "absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg";

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

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
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

      localStorage.setItem(
        'user',
        JSON.stringify(result.data.usuario)
      );

      const role = result.data.usuario.rol;

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'ventas') {
        navigate('/ventas');
      } else if (role === 'inventario') {
        navigate('/inventario');
      } else if (role === 'produccion') {
        navigate('/produccion');
      } else if (role === 'cliente') {
        navigate('/client');
      } else if (role === 'logistica') {
        navigate('/logistica');
      } else {
        navigate('/');
      }

    } catch (err) {
      setServerError(
        err.message || 'Credenciales incorrectas.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-gray-300/50 overflow-hidden flex flex-col md:flex-row">

        {/* Panel izquierdo */}
        <div className="md:w-5/12 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-8 md:p-10 flex flex-col justify-between text-white">

          <div>
            <div className="flex items-center gap-3 mb-8">
              <i className="bi bi-hexagon-fill text-emerald-400 text-3xl"></i>
              <span className="text-xl font-bold tracking-tight">
                NutriBalance
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-3 leading-tight">
              Bienvenido
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Inicia sesión para acceder a tu panel y gestionar pedidos, inventario y más.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <i className="bi bi-shield-check text-emerald-400 text-xl"></i>
                <span>Acceso seguro al sistema</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <i className="bi bi-box-seam text-emerald-400 text-xl"></i>
                <span>Control total de operaciones</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <i className="bi bi-people text-emerald-400 text-xl"></i>
                <span>Gestión por roles</span>
              </div>

            </div>
          </div>

          <div className="mt-8 text-xs text-gray-500">
            &copy; 2026 NutriBalance
          </div>

        </div>

        {/* Panel derecho */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center">

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Iniciar sesión
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Ingresa tus credenciales
            </p>
          </div>

          {serverError && (
            <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <i className="bi bi-exclamation-circle-fill text-red-500 text-lg"></i>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                <i className="bi bi-envelope me-1.5"></i>
                Correo electrónico
              </label>

              <div className="relative">
                <i className={`${iconClass} bi bi-envelope-at`}></i>

                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className={inputClass}
                />
              </div>

              {errors.correo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.correo}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                <i className="bi bi-lock me-1.5"></i>
                Contraseña
              </label>

              <div className="relative">
                <i className={`${iconClass} bi bi-key`}></i>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-400/30"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Ingresando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right text-lg"></i>
                  Iniciar sesión
                </>
              )}
            </button>

            <p className="text-center text-gray-400 text-xs mt-4">
              ¿No tienes cuenta?{' '}
              <a
                href="/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
import fondoVideo from '../assets/Fondo1.mp4';

const inputClass = "w-full px-4 py-3 ps-11 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm";
const iconClass = "absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg";

export default function Register({
    form,
    errors,
    serverError,
    success,
    loading,
    showPassword,
    showConfirmPassword,
    handleChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
}) {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">

            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src={fondoVideo} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-gray-300/50 overflow-hidden flex flex-col md:flex-row z-10">
                <div className="md:w-5/12 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-8 md:p-10 flex flex-col justify-between text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <i className="bi bi-hexagon-fill text-emerald-400 text-3xl"></i>
                            <span className="text-xl font-bold tracking-tight">NutriBalance</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-3 leading-tight">Crear cuenta</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Regístrate para acceder a pedidos, inventario y más. Completa tus datos y empieza hoy.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <i className="bi bi-shield-check text-emerald-400 text-xl"></i>
                                <span>Datos seguros y protegidos</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <i className="bi bi-truck text-emerald-400 text-xl"></i>
                                <span>Gestión de pedidos fácil</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <i className="bi bi-box-seam text-emerald-400 text-xl"></i>
                                <span>Control de inventario</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs text-gray-500">
                        &copy; 2026 NutriBalance
                    </div>
                </div>
                <div className="md:w-7/12 p-8 md:p-10">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">Registro</h3>
                        <p className="text-gray-400 text-sm mt-1">Ingresa tus datos personales</p>
                    </div>

                    {success && (
                        <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                            <i className="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
                            {success}
                        </div>
                    )}
                    {serverError && (
                        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg"></i>
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <i className="bi bi-person me-1.5"></i>Nombre
                                </label>
                                <div className="relative">
                                    <i className={`${iconClass} bi bi-person-badge`}></i>
                                    <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Alain" className={inputClass} />
                                </div>
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <i className="bi bi-person me-1.5"></i>Apellido
                                </label>
                                <div className="relative">
                                    <i className={`${iconClass} bi bi-person-badge`}></i>
                                    <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Vallejos" className={inputClass} />
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
                                <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="ejemplo@correo.com" className={inputClass} />
                            </div>
                            {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <i className="bi bi-lock me-1.5"></i>Contraseña
                                </label>
                                <div className="relative">
                                    <i className={`${iconClass} bi bi-key`}></i>
                                    <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <i className="bi bi-lock me-1.5"></i>Confirmar
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <i className="bi bi-telephone me-1.5"></i>Teléfono
                                </label>
                                <div className="relative">
                                    <i className={`${iconClass} bi bi-phone`}></i>
                                    <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+591 71234567" maxLength="16" className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <i className="bi bi-geo-alt me-1.5"></i>Dirección
                                </label>
                                <div className="relative">
                                    <i className={`${iconClass} bi bi-house-door`}></i>
                                    <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. Siempre Viva 123" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-400/30"
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-person-plus text-lg"></i>
                                    Crear cuenta
                                </>
                            )}
                        </button>

                        <p className="text-center text-gray-400 text-xs mt-4">
                            ¿Ya tienes cuenta?{' '}
                            <a href="login" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                Inicia sesión
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

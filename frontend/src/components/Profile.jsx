const inputClass = "w-full px-4 py-3 ps-11 rounded-xl border border-gray-300 bg-white/80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm";
const iconClass = "absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function Profile({
    form,
    errors,
    mensaje,
    loading,
    uploadingFoto,
    fotoPreview,
    foto,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    esCliente,
    ultimaActualizacion,
    handleChange,
    handleSubmit,
    handleFotoChange,
    handleUploadFoto,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
}) {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 p-6 md:p-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl overflow-hidden shadow-lg shadow-emerald-200/50">
                            {fotoPreview ? (
                                <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" />
                            ) : (
                                <i className="bi bi-person-fill"></i>
                            )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-all duration-200">
                            <i className="bi bi-camera-fill text-sm"></i>
                            <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                        </label>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-800">{form.nombre || 'Mi Perfil'} {form.apellido}</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Gestiona tu información personal</p>
                        {ultimaActualizacion && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100/80 rounded-lg px-3 py-1.5">
                                <i className="bi bi-clock-history"></i>
                                Última actualización: {new Date(ultimaActualizacion).toLocaleString('es-BO')}
                            </div>
                        )}
                    </div>
                </div>
                {foto && (
                    <div className="mt-4 text-center md:text-left">
                        <button
                            onClick={handleUploadFoto}
                            disabled={uploadingFoto}
                            className="inline-flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-md shadow-emerald-200/50"
                        >
                            {uploadingFoto ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-cloud-upload"></i>
                                    Guardar foto
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {mensaje.texto && (
                <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm shadow-sm ${mensaje.tipo === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill text-emerald-500' : 'bi-exclamation-circle-fill text-red-500'} text-lg shrink-0`}></i>
                    {mensaje.texto}
                </div>
            )}

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                        <i className="bi bi-person-gear text-white"></i>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Información personal</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nombre</label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-person-badge`}></i>
                                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputClass} />
                            </div>
                            {errors.nombre && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Apellido</label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-person-badge`}></i>
                                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tu apellido" className={inputClass} />
                            </div>
                            {errors.apellido && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.apellido}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Correo electrónico</label>
                        <div className="relative">
                            <i className={`${iconClass} bi bi-envelope-at`}></i>
                            <input name="correo" value={form.correo} disabled className="w-full px-4 py-3 ps-11 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-500 text-sm cursor-not-allowed" />
                            <div className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                                <i className="bi bi-lock-fill text-sm"></i>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1"><i className="bi bi-info-circle"></i>El correo no se puede modificar.</p>
                    </div>

                    {esCliente && (
                        <>
                            <hr className="border-gray-200/80" />
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                                    <i className="bi bi-telephone text-white"></i>
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Información de contacto</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Teléfono</label>
                                    <div className="relative">
                                        <i className={`${iconClass} bi bi-phone`}></i>
                                        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+591 71234567" maxLength="16" className={inputClass} />
                                    </div>
                                    {errors.telefono && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.telefono}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Dirección</label>
                                    <div className="relative">
                                        <i className={`${iconClass} bi bi-house-door`}></i>
                                        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Tu dirección" className={inputClass} />
                                    </div>
                                    {errors.direccion && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.direccion}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    <hr className="border-gray-200/80" />

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                            <i className="bi bi-shield-lock text-white"></i>
                        </div>
                        <h3 className="text-base font-bold text-gray-800">Cambiar contraseña</h3>
                    </div>
                    <p className="text-xs text-gray-400 -mt-3 flex items-center gap-1"><i className="bi bi-info-circle"></i>Deja los campos vacíos si no deseas cambiarla.</p>

                    <div>
                        <label className={labelClass}>Contraseña actual</label>
                        <div className="relative">
                            <i className={`${iconClass} bi bi-key`}></i>
                            <input name="current_password" type={showCurrentPassword ? 'text' : 'password'} value={form.current_password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white/80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm" />
                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                        {errors.current_password && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.current_password}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nueva contraseña</label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-lock`}></i>
                                <input name="password" type={showNewPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white/80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm" />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                    <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.password}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Confirmar contraseña</label>
                            <div className="relative">
                                <i className={`${iconClass} bi bi-lock`}></i>
                                <input name="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 ps-11 pe-12 rounded-xl border border-gray-300 bg-white/80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><i className="bi bi-exclamation-circle"></i>{errors.password_confirmation}</p>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-200/50"
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
                    </div>
                </form>
            </div>
        </div>
    );
}


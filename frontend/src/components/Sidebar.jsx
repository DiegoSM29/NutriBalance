import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = {
    admin: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Usuarios', path: '/admin', icon: 'bi-people' },
        { label: 'Productos', path: '/productos', icon: 'bi-box-seam' },
    ],
    ventas: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Ventas', path: '/ventas', icon: 'bi-cart' },
    ],
    inventario: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Productos', path: '/productos', icon: 'bi-box-seam' },
    ],
    produccion: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Producción', path: '/produccion', icon: 'bi-gear' },
    ],
    logistica: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Logística', path: '/logistica', icon: 'bi-truck' },
    ],
    pedidos: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Pedidos', path: '/pedidos', icon: 'bi-box-seam' },
    ],
    cliente: [
        { label: 'Mi Perfil', path: '/perfil', icon: 'bi-person-circle' },
        { label: 'Mi Tienda', path: '/client', icon: 'bi-shop' },
        { label: 'Mis Pedidos', path: '/mis-pedidos', icon: 'bi-box-seam' },
    ],
};

const roleLabels = {
    admin: 'Administrador',
    ventas: 'Ventas',
    inventario: 'Inventario',
    produccion: 'Producción',
    logistica: 'Logística',
    pedidos: 'Pedidos',
    cliente: 'Cliente',
};

export default function Sidebar({ user, isMobileOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = 'http://localhost:8000';

    const items = menuItems[user?.rol] || menuItems.cliente;

    function handleLogout() {
        localStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-700">
                <i className="bi bi-hexagon-fill text-emerald-400 text-2xl"></i>
                <span className="text-lg font-bold tracking-tight">NutriBalance</span>
            </div>

            <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                        {user?.foto ? (
                            <img src={`${API_URL}/${user.foto}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.nombre?.charAt(0)?.toUpperCase()
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{user?.nombre} {user?.apellido}</p>
                        <p className="text-xs text-gray-400 truncate">{roleLabels[user?.rol] || user?.rol}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {items.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => { navigate(item.path); if (onClose) onClose(); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${location.pathname === item.path ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <i className={`bi ${item.icon} text-lg`}></i>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="px-4 pb-4 border-t border-gray-700 pt-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
                >
                    <i className="bi bi-box-arrow-left text-lg"></i>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

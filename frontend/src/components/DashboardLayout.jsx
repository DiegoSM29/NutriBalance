import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch {
        user = null;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const publicRoutes = ['/login', '/register', '/'];
    if (publicRoutes.includes(location.pathname)) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                user={user}
                isMobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:ml-64">
                <header className="lg:hidden bg-white border-b px-4 h-14 flex items-center justify-between shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-xl">
                        <i className="bi bi-list"></i>
                    </button>
                    <span className="font-semibold text-gray-800">NutriBalance</span>
                    <div className="w-8"></div>
                </header>

                <main className="p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

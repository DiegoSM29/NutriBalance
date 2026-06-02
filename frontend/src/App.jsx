import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteVentas from './components/ProtectedRouteVentas';

const EmpresaPage = lazy(() => import('./pages/EmpresaPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ClientPage = lazy(() => import('./pages/ClientPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const MisPedidosPage = lazy(() => import('./pages/MisPedidosPage'));
const MisFacturasPage = lazy(() => import('./pages/MisFacturasPage'));
const GestionPedidosPage = lazy(() => import('./pages/GestionPedidosPage'));
const LogisticaPage = lazy(() => import('./pages/LogisticaPage'));
const NotificacionesPage = lazy(() => import('./pages/NotificacionesPage'));
const Ventas = lazy(() => import('./pages/Ventas'));
const MisVentasPage = lazy(() => import('./pages/MisVentasPage'));
const OrdenProduccionPage = lazy(() => import('./pages/OrdenProduccionPage'));
const ReportePage = lazy(() => import('./pages/ReportePage'));

function App() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
                <p className="text-emerald-600 font-medium animate-pulse">Cargando módulo...</p>
            </div>
        }>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<DashboardLayout />}>
                    <Route path="/empresa" element={<ProtectedRoute><EmpresaPage /></ProtectedRoute>} />
                    <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/client" element={<ProtectedRoute><ClientPage /></ProtectedRoute>} />
                    <Route path="/mis-pedidos" element={<ProtectedRoute><MisPedidosPage /></ProtectedRoute>} />
                    <Route path="/mis-facturas" element={<ProtectedRoute><MisFacturasPage /></ProtectedRoute>} />
                    <Route path="/pedidos" element={<ProtectedRoute><GestionPedidosPage /></ProtectedRoute>} />
                    <Route path="/logistica" element={<ProtectedRoute><LogisticaPage /></ProtectedRoute>} />
                    <Route path="/notificaciones" element={<ProtectedRoute><NotificacionesPage /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                    <Route path="/productos" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                    <Route path="/produccion" element={<ProtectedRoute><OrdenProduccionPage /></ProtectedRoute>} />
                    <Route path="/reportes" element={<ProtectedRoute><ReportePage /></ProtectedRoute>} />
                    
                    {/* Rutas con protección especial de Ventas */}
                    <Route path="/mis-ventas" element={<ProtectedRouteVentas><MisVentasPage /></ProtectedRouteVentas>} />
                    <Route path="/ventas" element={<ProtectedRouteVentas><Ventas /></ProtectedRouteVentas>} />
                    
                    <Route path="*" element={<Navigate to="/empresa" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
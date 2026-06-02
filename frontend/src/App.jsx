import { Routes, Route, Navigate } from 'react-router-dom';
import EmpresaPage from './pages/EmpresaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import MisPedidosPage from './pages/MisPedidosPage';
import MisFacturasPage from './pages/MisFacturasPage';
import GestionPedidosPage from './pages/GestionPedidosPage';
import LogisticaPage from './pages/LogisticaPage';
import NotificacionesPage from './pages/NotificacionesPage';
import DashboardLayout from './components/DashboardLayout';
import Ventas from './pages/Ventas';
import MisVentasPage from './pages/MisVentasPage';
import OrdenProduccionPage from './pages/OrdenProduccionPage';
import ReportePage from './pages/ReportePage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    return (
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
                <Route path="/mis-ventas" element={<ProtectedRoute><MisVentasPage /></ProtectedRoute>} />
                <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}

export default App;
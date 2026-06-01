import { Routes, Route } from 'react-router-dom';
import EmpresaPage from './pages/EmpresaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import MisPedidosPage from './pages/MisPedidosPage';
import GestionPedidosPage from './pages/GestionPedidosPage';
import DashboardLayout from './components/DashboardLayout';
import ProductDashboard from './components/ProductDashboard';
import Ventas from './pages/Ventas';
import MisVentasPage from './pages/MisVentasPage';
import OrdenProduccionPage from './pages/OrdenProduccionPage';
import ProtectedRouteVentas from './components/ProtectedRouteVentas';


function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<DashboardLayout />}>
                <Route path="/empresa" element={<EmpresaPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/client" element={<ClientPage />} />
                <Route path="/mis-pedidos" element={<MisPedidosPage />} />
                <Route path="/pedidos" element={<GestionPedidosPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/productos" element={<ProductPage />} />
                <Route path="/produccion" element={<OrdenProduccionPage />} />
                <Route
                    path="/mis-ventas"
                    element={
                        <ProtectedRouteVentas>
                            <MisVentasPage />
                        </ProtectedRouteVentas>
                    }
                />
                <Route
                    path="/ventas"
                    element={
                        <ProtectedRouteVentas>
                            <Ventas />
                        </ProtectedRouteVentas>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;

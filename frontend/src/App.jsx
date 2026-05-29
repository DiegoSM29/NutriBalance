import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ClienteDashboard from './components/Client';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import DashboardLayout from './components/DashboardLayout';
import ProductDashboard from './components/ProductDashboard';
import Ventas from './components/Ventas';
import ProtectedRouteVentas from './components/ProtectedRouteVentas';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<DashboardLayout />}>
                <Route path="/perfil" element={<Profile />} />
                <Route path="/client" element={<ClienteDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/productos" element={<ProductDashboard />} />
            </Route>
            <Route
                path="/ventas"
                element={
                    <ProtectedRouteVentas>
                        <Ventas />
                    </ProtectedRouteVentas>
                }
            />
        </Routes>
    );
}

export default App;
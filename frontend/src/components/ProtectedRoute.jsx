import { Navigate, useLocation } from 'react-router-dom';
import { isRouteAllowed, getDefaultRoute } from '../utils/rolePermissions';

export default function ProtectedRoute({ children }) {
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

    if (!isRouteAllowed(user.rol, location.pathname)) {
        return <Navigate to={getDefaultRoute(user.rol)} replace />;
    }

    return children;
}

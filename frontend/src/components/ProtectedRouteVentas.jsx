import { Navigate } from 'react-router-dom';

export default function ProtectedRouteVentas({ children }) {

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.rol !== 'ventas') {
    return <Navigate to="/" />;
  }

  return children;
}
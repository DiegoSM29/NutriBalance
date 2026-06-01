import { Navigate } from 'react-router-dom';

export default function ProtectedRouteVentas({ children }) {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.rol !== 'ventas') {
    return <Navigate to="/empresa" />;
  }

  return children;
}
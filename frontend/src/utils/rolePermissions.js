const roleRoutes = {
    'super-admin': ['/empresa', '/perfil', '/admin', '/productos', '/reportes'],
    admin: ['/empresa', '/perfil', '/admin', '/productos', '/reportes'],
    ventas: ['/empresa', '/perfil', '/ventas', '/mis-ventas'],
    inventario: ['/empresa', '/perfil', '/productos'],
    produccion: ['/empresa', '/perfil', '/produccion'],
    logistica: ['/empresa', '/perfil', '/logistica'],
    pedidos: ['/empresa', '/perfil', '/pedidos'],
    cliente: ['/empresa', '/perfil', '/client', '/mis-pedidos', '/mis-facturas', '/notificaciones'],
};

export function isRouteAllowed(rol, pathname) {
    const allowedRoutes = roleRoutes[rol];
    if (!allowedRoutes) return false;
    return allowedRoutes.includes(pathname);
}

export function getDefaultRoute(rol) {
    const routes = roleRoutes[rol];
    return routes ? routes[0] : '/login';
}

export default roleRoutes;

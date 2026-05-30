const API_URL = 'http://localhost:8000/api';

export async function registerCliente(data) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
        throw json;
    }
    return json;
}

export async function loginUser(data) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
        throw json;
    }

    return json;
}

export async function getUsuarios(filtros = {}) {
    // Construimos los parámetros de búsqueda de la URL (?buscar=...&rol=...)
    const query = new URLSearchParams(filtros).toString();
    const response = await fetch(`${API_URL}/usuarios?${query}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    return response.json();
}

export async function crearUsuario(data) {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

export async function getPerfil(id) {
    const response = await fetch(`${API_URL}/perfil/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    return response.json();
}

export async function updatePerfil(id, data) {
    const response = await fetch(`${API_URL}/perfil/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

export async function uploadFoto(id, file) {
    const formData = new FormData();
    formData.append('foto', file);
    const response = await fetch(`${API_URL}/perfil/${id}/foto`, {
        method: 'POST',
        body: formData,
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

export async function actualizarUsuario(id, data) {
    // Necesitamos pasar el ID del admin actual para la validación de no auto-deshabilitarse
    const adminActual = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-User-Id': adminActual.id_usuario
        },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

// Obtener productos disponibles en el catalogo
export async function getCatalogo() {
    const response = await fetch(`${API_URL}/catalogo`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    return response.json();
}

// Enviar el carrito para crear un pedido nuevo
export async function crearPedido(data, comprobante) {
    const clienteActual = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append('productos', JSON.stringify(data.productos));
    if (comprobante) {
        formData.append('comprobante', comprobante);
    }
    
    const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-User-Id': clienteActual.id_usuario
        },
        body: formData,
    });
    
    const json = await response.json();
    if (!response.ok) throw json;
    
    return json;
}

export async function getMisPedidos() {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await fetch(`${API_URL}/pedidos/cliente`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-User-Id': user.id_usuario
        },
    });

    return response.json();
}

// GESTION DE PRODUCTOS (ADMIN/INVENTARIO)
export async function getAdminProductos() {
    const response = await fetch(`${API_URL}/admin/productos`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    return response.json();
}

export async function crearAdminProducto(formData) {
    // Al enviar FormData, NO debes poner el header 'Content-Type'
    const response = await fetch(`${API_URL}/admin/productos`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

export async function actualizarAdminProducto(id, formData) {
    // Laravel requiere este "truco" para recibir archivos en una actualizacion (PUT)
    formData.append('_method', 'PUT'); 
    const response = await fetch(`${API_URL}/admin/productos/${id}`, {
        method: 'POST', // Se envía como POST por culpa de los archivos
        headers: { 'Accept': 'application/json' },
        body: formData,
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

export async function eliminarAdminProducto(id) {
    const response = await fetch(`${API_URL}/admin/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
    });
    const json = await response.json();
    if (!response.ok) throw json;
    return json;
}

export async function getClientes() {
    const response = await fetch(`${API_URL}/clientes`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    return response.json();
}

export async function getProductos() {

    const response = await fetch(`${API_URL}/productos/disponibles`);

    const json = await response.json();

    if (!response.ok) {
        throw json;
    }

    return json;
}

export async function registrarVenta(data) {

    const response = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
        throw json;
    }

    return json;
}
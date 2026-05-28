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
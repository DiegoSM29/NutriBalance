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

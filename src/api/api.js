const API_URL = 'http://localhost:3001/users';

export const loginApi = async ({ email, password }) => {
    const res = await fetch(`${API_URL}?email=${email}&password=${password}`);
        const users = await res.json()

        if(!res.ok || users.length === 0){
            throw new Error('Email o contraseña inválidos');
        }
        const user = users[0];
        const token = btoa(`${user.id}-${user.role}`);
        return { token, user };
    };

export const getAllUsers = async (token) => {
    const res = await fetch(`${API_URL}`);
    return await res.json();
    };

export const getUserById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return await res.json();
    };

export const createUser = async (userData) => {
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return await res.json();
}

export const updateUser = async (id, userData) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return await res.json();
}
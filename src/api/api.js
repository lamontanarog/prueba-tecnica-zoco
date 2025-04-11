const API_URL = 'http://localhost:3001/users';
const API_URL2 = 'http://localhost:3001/';

const validateToken = (token) => {
    const decoded = atob(token).split('-');
    if (!decoded || decoded.length !== 2) {
        throw new Error('Token inválido');
    }
    return { id: decoded[0], role: decoded[1] };
};

const validateAccess = (userId, token) => {
    const { id, role } = validateToken(token);
    if (role !== 'admin' && parseInt(id) !== parseInt(userId)) {
        throw new Error('Acceso denegado');
    }
};

export const loginApi = async ({ email, password }) => {
    const res = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
    const users = await res.json();
  
    if (users.length === 0) {
      throw new Error("Email o contraseña inválidos");
    }
  
    const user = users[0];
    const token = btoa(`${user.id}-${user.role}`);

    // Guardar token en sessionStorage
    sessionStorage.setItem('token', token);

    return { token, user };
  };

export const getAllUsers = async () => {
    try {
        const token = sessionStorage.getItem('token');
        validateToken(token);
        const res = await fetch(`${API_URL}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (!res.ok) {
            throw new Error('Error al cargar los usuarios');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al cargar los usuarios.');

    }
};

export const getUserById = async (id, token) => {
    try {
        validateToken(token);
        const res = await fetch(`${API_URL}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (!res.ok) {
            throw new Error('Error al cargar el usuario');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al cargar el usuario.');
    }
};

export const createUser = async (userData, token) => {
    try {
        validateToken(token);
        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            throw new Error('Error al crear el usuario');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al crear el usuario.');
    }
}

export const updateUser = async (id, userData, token) => {
    try {
        validateToken(token);
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al actualizar el usuario.');
    }
}

export const deleteUser = async (id, token) => {
    try {
        validateToken(token);
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error(error);
        alert('Error al eliminar el usuario.');
    }
}

//Estudios del usuario

export const getEstudiosByUserId = async (userId, token) => {
    try {
        validateToken(token);
        validateAccess(userId, token);
        const res = await fetch(`${API_URL2}estudios?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error('Error al cargar los estudios');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al cargar los estudios.');
    }
};

export const createEstudio = async (data, token) => {
    try {
        validateToken(token);
        const res = await fetch(`${API_URL2}/estudios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Error al crear el estudio');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al crear el estudio.');

    }
}


//Direcciones del usuario

export const getDireccionesByUserId = async (userId, token) => {
    try {
        validateToken(token);
        validateAccess(userId, token);
        const res = await fetch(`${API_URL2}direcciones?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error('Error al cargar las direcciones');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al cargar las direcciones.');
    }
};

export const createDireccion = async (data, token) => {
    try {
        validateToken(token);
        validateAccess(data.userId, token);
        const res = await fetch(`${API_URL2}direcciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Error al crear la dirección');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        alert('Error al crear la dirección.');
    }
};

export const logout = () => {
    sessionStorage.removeItem('token');
};
// src/api/mockUsersData.js

const LOCAL_STORAGE_KEY = 'mock_users';

const initialUsers = [
    {
        id: 1,
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin',
        estudios: [],
        direcciones: []
    },
    {
        id: 2,
        email: 'user@example.com',
        password: 'user',
        role: 'user',
        estudios: [],
        direcciones: []
    }
];

if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialUsers));
}

export const getUsersFromStorage = () => {
    const data = localStorage?.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : initialUsers;
};

export const saveUsersToStorage = (users) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
};

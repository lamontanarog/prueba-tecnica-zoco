import { getUsersFromStorage, saveUsersToStorage } from "./mockUsersData";

export const getAllUsers = (token) => {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === "fake-token-123") {
                const users = getUsersFromStorage();
                console.log(users);
                resolve(users);
            } else {
                reject("Invalid token");
            }
        }, 500);
    });
};

export const createUser = (newUser, token) => {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === "fake-token-123") {
                const users = getUsersFromStorage();
                const id = users.length + 1;
                const user = { ...newUser, id, estudios: [], direcciones: [] };
                const updatedUsers = [...users, user];
                saveUsersToStorage(updatedUsers);
                resolve(user);
            } else {
                reject("Unauthorized");
            }
        }, 500);
    });
};

export const loginApi = ({ email, password }) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log({email, password});
        const users = getUsersFromStorage();
        console.log(users);
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          const token = `fake-token-${user.id}-${user.role}`;
          resolve({ token, user: { id: user.id, email: user.email, role: user.role } });
        } else {
          reject("Email o contraseña inválidos");
        }
      }, 500);
    });
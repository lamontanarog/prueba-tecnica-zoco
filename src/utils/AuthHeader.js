// utils/authHeader.js
export const authHeader = () => {
    const token = sessionStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };
  
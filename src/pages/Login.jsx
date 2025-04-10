import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 
const Login = () => {
  const { login, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      await login({ email, password }); // Llama a la función login del contexto
      const userRole = sessionStorage.getItem('role'); // Obtener el rol del usuario
      if (userRole === 'admin') {
        navigate('/dashboard'); // Redirigir a dashboard si es admin
      } else {
        navigate('/profile'); // Redirigir a perfil si es usuario normal
      }
    } catch (err) {
      setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
    }
  };

  return (
    <div className='login-container'>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
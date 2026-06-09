import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { restablecerContraseña } from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../altaProducto/AltaProducto.css';

const ResetPassword = () => {
  const { token } = useParams(); // Leemos el token de la URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRepetirPassword, setMostrarRepetirPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    
    if (password.length < 6) {
      return setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (password !== repetirPassword) {
      return setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });
    }

    try {
      const respuesta = await restablecerContraseña(token, password);
      setMensaje({ tipo: 'exito', texto: respuesta.mensaje + ' Redirigiendo al login...' });
      
      // Esperamos 2.5 segundos para que lea el mensaje y lo mandamos al login
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.mensaje || 'El enlace es inválido o ha expirado.' 
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Nueva Contraseña</h2>

      {mensaje.texto && (
        <div style={{ 
          color: mensaje.tipo === 'exito' ? '#155724' : '#721c24', 
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
          padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' 
        }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="joya-form">
        <div className="form-group">
          <label>Nueva Contraseña:</label>
          <div className="password-input-container">
            <input
              type={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-password-btn" onClick={() => setMostrarPassword(!mostrarPassword)}>
              {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Repetir Nueva Contraseña:</label>
          <div className="password-input-container">
            <input
              type={mostrarRepetirPassword ? "text" : "password"}
              value={repetirPassword}
              onChange={(e) => setRepetirPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-password-btn" onClick={() => setMostrarRepetirPassword(!mostrarRepetirPassword)}>
              {mostrarRepetirPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save" disabled={mensaje.tipo === 'exito'}>
            Guardar Contraseña
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRestablecerContraseña } from '../../services/authService';
import '../altaProducto/AltaProducto.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const respuesta = await solicitarRestablecerContraseña(email);
      setMensaje({ tipo: 'exito', texto: respuesta.mensaje });
      setEmail(''); // Limpiamos el input
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al procesar la solicitud. Intentá de nuevo.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Recuperar Contraseña</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
        Ingresá tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.
      </p>

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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ingresá tu email registrado"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#5a189a', fontWeight: 'bold' }}>Volver al Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
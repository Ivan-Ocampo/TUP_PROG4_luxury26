import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../altaProducto/AltaProducto.css';

const Login = () => {
  const navigate = useNavigate();

  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [alertaStock, setAlertaStock] = useState([]);
  const [carritoExpirado, setCarritoExpirado] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUsuario(credenciales);

      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('authChange'));

      if (data.carritoExpirado) {
        setCarritoExpirado(true);
        return;
      }
      if (data.itemsEliminados && data.itemsEliminados.length > 0) {
        setAlertaStock(data.itemsEliminados);
        return;
      }

      navigate('/');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(error.response?.data?.mensaje || 'Hubo un error al iniciar sesión');
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

      {carritoExpirado && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px 16px', marginBottom: '15px', color: '#856404' }}>
          <strong>Tu carrito expiró.</strong> Los productos que habías seleccionado fueron eliminados porque no se confirmó la compra a tiempo.
          <div style={{ marginTop: '10px' }}>
            <button className="btn-save" onClick={() => navigate('/')}>Entendido, ir al catálogo</button>
          </div>
        </div>
      )}

      {alertaStock.length > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px 16px', marginBottom: '15px', color: '#856404' }}>
          <strong>Productos eliminados de tu carrito por falta de stock:</strong>{' '}
          {alertaStock.join(', ')}
          <div style={{ marginTop: '10px' }}>
            <button className="btn-save" onClick={() => navigate('/')}>Entendido, ir al inicio</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="joya-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="ejemplo@dominio.com"
            value={credenciales.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <div className="password-input-container">
            <input
              type={mostrarPassword ? "text" : "password"}
              name="password"
              value={credenciales.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-password-btn" onClick={togglePassword}>
              {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'left' }}>
          <Link to="/forgot-password" style={{ color: '#5a189a', fontSize: '0.9rem', textDecoration: 'underline' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Ingresar</button>
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">Cancelar</button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.95rem' }}>
          <span>¿No tenés cuenta? </span>
          <Link to="/registro" style={{ color: '#5a189a', fontWeight: 'bold', textDecoration: 'underline' }}>
            Registrate
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

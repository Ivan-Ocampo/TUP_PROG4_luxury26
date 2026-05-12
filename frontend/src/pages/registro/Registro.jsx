import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 1. Importamos tu nuevo servicio
import { crearUsuario } from '../../services/usuarioService'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import '../altaProducto/AltaProducto.css';

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. Usamos la función del usuarioService
      await crearUsuario(formData); 
      
      alert('¡Cuenta creada con éxito! Ahora podés iniciar sesión.');
      navigate('/login'); 
    } catch (error) {
      console.error("Error en el registro:", error);
      setError(error.response?.data?.mensaje || 'Hubo un error al crear la cuenta');
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Cuenta</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="joya-form">
        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="ejemplo@dominio.com"
            value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={togglePassword}
            >
              {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-save">Registrarse</button>
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">Cancelar</button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.95rem' }}>
          <span>¿Ya tenés cuenta? </span>
          <Link to="/login" style={{ color: '#5a189a', fontWeight: 'bold', textDecoration: 'underline' }}>
            Iniciá Sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registro;
import React, { useState, useEffect } from 'react';
import './MiPerfil.css';
import { obtenerPerfil, actualizarPerfil } from '../../services/usuarioService';
import Button from '../../components/button/Button';

const MiPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    passwordActual: '',
    nuevaPassword: '',
    repetirPassword: ''
  });

  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Simulamos la carga de datos del usuario logueado
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosUsuario = await obtenerPerfil();
        setFormData({ ...formData, nombre: datosUsuario.nombre, email: datosUsuario.email });
        
                
      } catch (error) {
        console.error("Error al cargar perfil", error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    // 1. Validación frontend: Si escribió una nueva contraseña, la repetición debe coincidir
    if (formData.nuevaPassword && formData.nuevaPassword !== formData.repetirPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    // 2. Validación frontend: Si quiere cambiar clave, DEBE poner la actual
    if (formData.nuevaPassword && !formData.passwordActual) {
      setMensaje({ tipo: 'error', texto: 'Debes ingresar tu contraseña actual para cambiarla.' });
      return;
    }

    try {
      await actualizarPerfil(formData);
      console.log("Datos a enviar al backend:", formData);
      setMensaje({ tipo: 'exito', texto: '¡Perfil actualizado correctamente!' });
      
      // Limpiamos los campos de contraseña por seguridad
      setFormData(prev => ({ ...prev, passwordActual: '', nuevaPassword: '', repetirPassword: '' }));
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Hubo un error al actualizar el perfil.' });
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Mi Perfil</h2>
        
        {mensaje.texto && (
          <div className={`mensaje-alerta ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="perfil-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="divisor"></div>

          <div className="form-group">
            <label>Contraseña actual</label>
            <input
              type="password"
              name="passwordActual"
              placeholder="Obligatoria para cambiar contraseña"
              value={formData.passwordActual}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              name="nuevaPassword"
              placeholder="Dejar en blanco para no cambiarla"
              value={formData.nuevaPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Repetir nueva contraseña</label>
            <input
              type="password"
              name="repetirPassword"
              placeholder="Repetí la nueva contraseña"
              value={formData.repetirPassword}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" texto="Guardar cambios" color="lila" size="grande" efecto="redondeado" />
          <Button type="submit" texto="Eliminar cuenta" color="rojo" size="grande" efecto="redondeado" />
        
        </form>
      </div>
    </div>
  );
};

export default MiPerfil;
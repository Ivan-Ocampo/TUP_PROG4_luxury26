import React, { useEffect, useState } from 'react';
import { getUsuarios, actualizarUsuarioAdmin, eliminarUsuarioAdmin } from '../../services/usuarioService'; // Acá después sumarás tus funciones de update/delete
import { FaPencilAlt, FaTrash, FaTimes } from 'react-icons/fa'; // Importamos los íconos
import '../altaProducto/AltaProducto.css'; // Reutilizamos estilos para mantener coherencia

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  // --- Estados para el Modal de Edición ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({
    _id: '',
    nombre: '',
    email: '',
    rol: '',
    activo: true
  });

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // --- FUNCIONES DEL MODAL DE EDICIÓN ---
  const handleAbrirModal = (usuario) => {
    setUsuarioForm({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo !== false // Por defecto true si no tiene el campo
    });
    setModalAbierto(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioForm({
      ...usuarioForm,
      // Si el campo es 'activo', convertimos el string a booleano
      [name]: name === 'activo' ? value === 'true' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarUsuarioAdmin(usuarioForm._id, usuarioForm);
      console.log("Datos a enviar para actualizar:", usuarioForm);
      
      // Actualizamos el estado local para ver el cambio instantáneo en la tabla
      setUsuarios(usuarios.map(u => u._id === usuarioForm._id ? { ...u, ...usuarioForm } : u));
      
      setModalAbierto(false);
      alert("¡Usuario actualizado correctamente!");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  // --- FUNCIÓN PARA ELIMINAR ---
  const handleEliminarClick = async (id, nombre) => {
    const confirmacion = window.confirm(`¿Estás seguro de que querés eliminar permanentemente al usuario "${nombre}"?`);
    
    if (confirmacion) {
      try {
        await eliminarUsuarioAdmin(id);
        console.log("Eliminando usuario con ID:", id);
        
        // Lo sacamos de la tabla
        setUsuarios(usuarios.filter(u => u._id !== id));
        
        alert("Usuario eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al intentar eliminar al usuario.");
      }
    }
  };

  if (cargando) return <div className="form-container"><h3>Cargando usuarios...</h3></div>;

  return (
    <div className="form-container" style={{ maxWidth: '800px', position: 'relative' }}>
      <h2>Gestión de Usuarios</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <table className="tabla-usuarios" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#5a189a', color: 'white' }}>
            <th style={{ padding: '12px' }}>Nombre</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Rol</th>
            <th style={{ padding: '12px' }}>Estado</th> 
            <th style={{ padding: '12px' }}>Acciones</th> {/* Columna agregada */}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>{u.nombre}</td>
              <td style={{ padding: '10px' }}>{u.email}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  backgroundColor: u.rol === 'administrador' ? '#ffd700' : '#e0e0e0',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {u.rol}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  backgroundColor: u.activo !== false ? '#4caf50' : '#f44336',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {u.activo !== false ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              
              {/* BOTONES DE LÁPIZ Y TACHITO */}
              <td style={{ padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button 
                  type="button" 
                  title="Editar"
                  onClick={() => handleAbrirModal(u)}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FaPencilAlt />
                </button>

                <button 
                  type="button" 
                  title="Eliminar"
                  onClick={() => handleEliminarClick(u._id, u.nombre)}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*  MODAL FLOTANTE DE EDICIÓN */}
      {modalAbierto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '25px', borderRadius: '12px',
            width: '100%', maxWidth: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Editar Usuario</h3>
              <button onClick={() => setModalAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#999', cursor: 'pointer' }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre</label>
                <input type="text" name="nombre" value={usuarioForm.nombre} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }} />
              </div>

              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                <input type="email" name="email" value={usuarioForm.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }} />
              </div>

              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rol</label>
                <select name="rol" value={usuarioForm.rol} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }}>
                  <option value="usuario">Usuario</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Estado de la cuenta</label>
                <select name="activo" value={usuarioForm.activo.toString()} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo (Baja Lógica)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ padding: '10px 15px', borderRadius: '6px', border: 'none', backgroundColor: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                <button type="submit" style={{ padding: '10px 15px', borderRadius: '6px', border: 'none', backgroundColor: '#5a189a', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
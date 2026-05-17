import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId, actualizarProducto } from '../../services/productoService';

// Reutilizamos el CSS que ya tenías para los formularios
import '../altaProducto/AltaProducto.css'; 

const EditarProducto = () => {
  const { id } = useParams(); // Id del producto sacado de la URL
  const navigate = useNavigate();

  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagenUrl: '',
    categoriaId: '',
    activo: true 
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  //Efecto para buscar los datos del producto cuando entramos a la página
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const producto = await obtenerProductoPorId(id);
        // Llenamos el formulario con los datos que trajo la base de datos
        setFormData({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagenUrl: producto.imagenUrl,
          // Si el populate trajo un objeto en categoriaId, sacamos solo el ID
          categoriaId: producto.categoriaId?._id || producto.categoriaId || '',
          activo: producto.activo !== undefined ? producto.activo : true 
        });
      } catch (err) {
        setError('Error al cargar los datos del producto.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id]);

  //Manejador para cuando escribimos en los inputs
  const handleChange = (e) => {
    // Verificamos si es un checkbox para usar 'checked' en lugar de 'value'
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: valor
    });
  };

  //Manejador para enviar los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarProducto(id, formData);
      alert('¡Producto actualizado con éxito!');
      navigate('/'); // Volvemos al catálogo
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError('Hubo un error al actualizar el producto.');
    }
  };

    
  if (cargando) return <div className="form-container"><h2>Cargando datos...</h2></div>;

  return (
    <div className="form-container">
      <h2>Editar Producto</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="joya-form">
        <div className="form-group">
          <label>Nombre del Producto:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL de la Imagen:</label>
          <input
            type="text"
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
{/* --- BAJA LÓGICA --- */}
        <div className="form-group" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '15px', 
          backgroundColor: formData.activo ? '#e6ffe6' : '#ffe6e6', 
          borderRadius: '8px',
          border: `1px solid ${formData.activo ? '#4caf50' : '#f44336'}`
        }}>
          <input
            type="checkbox"
            name="activo"
            id="activo"
            checked={formData.activo}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="activo" style={{ margin: 0, fontWeight: 'bold', cursor: 'pointer', color: '#333' }}>
            {formData.activo ? 'Producto Activo (Visible en catálogo)' : 'Producto Inactivo (Dado de baja)'}
          </label>
        </div>
        {/* ------------------- */}
        
        
        <div className="form-buttons">
          <button type="submit" className="btn-save">Guardar Cambios</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarProducto;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearProducto } from '../../services/productoService';
import { obtenerCategorias } from '../../services/categoriaService';
import './AltaProducto.css';
import Button from '../../components/button/Button';

const AltaProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagenUrl: '',
    categoriaId: '',
    stock: ''
  });

  const [categorias, setCategorias] = useState([]);

  // Cargar categorías al montar el componente  
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const categoriasData = await obtenerCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Actualiza solo el campo que cambió
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearProducto(formData);
      alert('¡Joya cargada con éxito!');
      navigate('/'); // Volver al catálogo para ver la nueva joya
    } catch (error) {
      console.error("Error al cargar:", error);
      alert('Hubo un error al cargar la joya.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cargar Nueva Joya</h2>
      <form onSubmit={handleSubmit} className="joya-form">

        <div className="form-group">
          <label>Nombre de la Joya:</label>
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
          <label>Categoría:</label>
          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} // Un poco de estilo base
          >
            {/* Opción por defecto deshabilitada para obligar a elegir una */}
            <option value="" disabled>-- Seleccionar una categoría --</option>

            {/* Mapeamos el estado de categorías para crear las opciones */}
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Stock Disponible:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-buttons">
          <Button type="submit" className="btn-save" texto="Guardar producto" size="grande" color="lila" efecto="redondeado" />
          <Link to="/">
          <Button type="button" className="btn-cancel" texto="Cancelar" size="grande" color="lila" efecto="redondeado" />
          </Link>
        </div>

      </form>
    </div>
  );
};

export default AltaProducto;
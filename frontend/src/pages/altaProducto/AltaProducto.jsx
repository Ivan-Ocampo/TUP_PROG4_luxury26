import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearProducto } from '../../services/productoService';
import { obtenerCategorias, crearCategoria } from '../../services/categoriaService';
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

  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [nombreNuevaCategoria, setNombreNuevaCategoria] = useState('');
  const [descripcionNuevaCategoria, setDescripcionNuevaCategoria] = useState('');

  const handleCategoriaChange = (e) => {
    const valorSeleccionado = e.target.value;

    if (valorSeleccionado === 'nueva_categoria') {
      //Abre el modal
      setModalCategoriaAbierto(true);
      //Resetea el select para que no quede trabado en "+ Nueva categoría"
      setFormData({ ...formData, categoria: '' });
    } else {
      // Si elige una categoría normal, usa tu handleChange de siempre
      handleChange(e);
    }
  };

const handleGuardarNuevaCategoria = async (e) => {
    e.preventDefault();
    try {
      
      const nuevaCategoriaCreada = await crearCategoria({ nombre: nombreNuevaCategoria, descripcion: descripcionNuevaCategoria }, localStorage.getItem('token'));
      
      //Agregamos la nueva categoría a la lista del select
      setCategorias([...categorias, nuevaCategoriaCreada]);
      
      //La dejamos ya seleccionada en el formulario del producto
      setFormData({ ...formData, categoria: nuevaCategoriaCreada._id });
      
      //Limpiamos y cerramos
      setNombreNuevaCategoria('');
      setDescripcionNuevaCategoria('');
      setModalCategoriaAbierto(false);
      alert("Categoría creada con éxito");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert("Hubo un error al crear la categoría.");
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
            onChange={handleCategoriaChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} // Un poco de estilo base
          >
            {/* Opción por defecto deshabilitada para obligar a elegir una */}
            <option value="">-- Seleccionar una categoría --</option>

            {/* Mapeamos el estado de categorías para crear las opciones */}
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
            <option value="nueva_categoria" style={{ fontWeight: 'bold', color: '#000000' }}>
              + Crear nueva categoría...
            </option>
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
    {/* MODAL FLOTANTE DE NUEVA CATEGORÍA*/}
      {modalCategoriaAbierto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '25px', borderRadius: '12px',
            width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Nueva Categoría</h3>
              <button onClick={() => setModalCategoriaAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#999', cursor: 'pointer' }}>
                ✖
              </button>
            </div>

            <form onSubmit={handleGuardarNuevaCategoria}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de la categoría</label>
                <input 
                  type="text" 
                  value={nombreNuevaCategoria} 
                  onChange={(e) => setNombreNuevaCategoria(e.target.value)} 
                  placeholder="Ej: Pulseras"
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }} 
                />
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' , marginTop:'10px' }}>Descripción</label>
                <input 
                  type="text" 
                  value={descripcionNuevaCategoria} 
                  onChange={(e) => setDescripcionNuevaCategoria(e.target.value)} 
                  placeholder="(OPCIONAL) Ej: Las que van en la muñeca"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                <button type="button" onClick={() => setModalCategoriaAbierto(false)} style={{ padding: '10px 15px', borderRadius: '6px', border: 'none', backgroundColor: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                <button type="submit" style={{ padding: '10px 15px', borderRadius: '6px', border: 'none', backgroundColor: '#5a189a', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Crear y Seleccionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    
    </div>
  );
};

export default AltaProducto;
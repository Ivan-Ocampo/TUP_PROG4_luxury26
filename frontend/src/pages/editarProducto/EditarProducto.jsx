import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId, actualizarProducto } from '../../services/productoService';
import { obtenerCategorias, crearCategoria } from '../../services/categoriaService'; 

import '../altaProducto/AltaProducto.css'; 

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    categoriaId: '',
    activo: true
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [modalStockAbierto, setModalStockAbierto] = useState(false);
  const [deltaStock, setDeltaStock] = useState('');
  const [operacion, setOperacion] = useState('+');

  // --- Estados para Categorías y el Modal ---
  const [categorias, setCategorias] = useState([]);
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [nombreNuevaCategoria, setNombreNuevaCategoria] = useState('');
  const [descripcionNuevaCategoria, setDescripcionNuevaCategoria] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Traemos el producto y la lista de categorías al mismo tiempo
        const [producto, categoriasData] = await Promise.all([
          obtenerProductoPorId(id),
          obtenerCategorias()
        ]);
        
        setCategorias(categoriasData);

        setFormData({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock ?? '',
          imagenUrl: producto.imagenUrl,
          categoriaId: producto.categoriaId?._id || producto.categoriaId || '',
          activo: producto.activo !== undefined ? producto.activo : true
        });
      } catch (err) {
        setError('Error al cargar los datos del producto o categorías.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: valor
    });
  };

  // --- Manejador específico para el Select de Categorías ---
  const handleCategoriaChange = (e) => {
    const valorSeleccionado = e.target.value;

    if (valorSeleccionado === 'nueva_categoria') {
      setModalCategoriaAbierto(true);
      setFormData({ ...formData, categoriaId: '' }); 
    } else {
      setFormData({ ...formData, categoriaId: valorSeleccionado });
    }
  };

  // --- Manejador para el Modal de Nueva Categoría ---
  const handleGuardarNuevaCategoria = async (e) => {
    e.preventDefault();
    try {
      await crearCategoria({ nombre: nombreNuevaCategoria, descripcion: descripcionNuevaCategoria });
      
      const nuevaCategoriaCreada = { _id: Date.now().toString(), nombre: nombreNuevaCategoria };
      
      setCategorias([...categorias, nuevaCategoriaCreada]);
      setFormData({ ...formData, categoriaId: nuevaCategoriaCreada._id });
      setNombreNuevaCategoria('');
      setModalCategoriaAbierto(false);
      alert("Categoría creada con éxito");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert("Hubo un error al crear la categoría.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarProducto(id, formData);
      setExito('¡Producto actualizado con éxito!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError('Hubo un error al actualizar el producto.');
    }
  };
    
  if (cargando) return <div className="form-container"><h2>Cargando datos...</h2></div>;

  return (
    <div className="form-container">
      <h2>Editar Producto</h2>
      
      {exito && (
        <div style={{ background: '#e8f5e9', border: '1.5px solid #4caf50', color: '#2e7d32', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', textAlign: 'center', fontWeight: '600', fontSize: '1rem' }}>
          ✓ {exito}
        </div>
      )}
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
          <label>Stock:</label>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '12px', width: '100%' }}>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              readOnly
              style={{ flex: 1, minWidth: 0, backgroundColor: '#ffffff', cursor: 'default' }}
            />
            <button
              type="button"
              onClick={() => { setDeltaStock(''); setOperacion('+'); setModalStockAbierto(true); }}
              style={{ padding: '14px 20px', background: '#61065b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* --- CAMPO DE CATEGORÍA AGREGADO --- */}
        <div className="form-group">
          <label>Categoría:</label>
          <select 
            name="categoriaId" 
            value={formData.categoriaId} 
            onChange={handleCategoriaChange} 
            required
          >
            <option value="">-- Seleccionar una categoría --</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))}
            <option value="nueva_categoria" style={{ fontWeight: 'bold', color: '#000000' }}>
              + Crear nueva categoría...
            </option>
          </select>
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

        {/* BAJA LÓGICA */}
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
        
        <div className="form-buttons">
          <button type="submit" className="btn-save">Guardar Cambios</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </form>

      {/* MODAL DE ACTUALIZACIÓN DE STOCK */}
      {modalStockAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '12px', width: '100%', maxWidth: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 6px', color: '#61065b' }}>Actualizar stock</h3>
            <p style={{ margin: '0 0 18px', color: '#555', fontSize: '0.9rem' }}>
              Stock actual: <strong>{formData.stock}</strong>
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setOperacion('+')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${operacion === '+' ? '#61065b' : '#333333'}`, background: operacion === '+' ? '#61065b' : '#e0e0e0', color: operacion === '+' ? '#fff' : '#333', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
              >
                + Agregar
              </button>
              <button
                type="button"
                onClick={() => setOperacion('-')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${operacion === '-' ? '#61065b' : '#333333'}`, background: operacion === '-' ? '#61065b' : '#e0e0e0', color: operacion === '-' ? '#fff' : '#333', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
              >
                − Restar
              </button>
            </div>

            <input
              type="number"
              min="1"
              placeholder="Cantidad"
              value={deltaStock}
              onChange={e => setDeltaStock(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333333', boxSizing: 'border-box', fontSize: '1rem', marginBottom: '8px', backgroundColor: '#ffffff', color: '#333333' }}
            />

            {deltaStock && Number(deltaStock) > 0 && (() => {
              const excede = operacion === '-' && Number(deltaStock) > Number(formData.stock);
              const resultado = operacion === '+' ? Number(formData.stock) + Number(deltaStock) : Number(formData.stock) - Number(deltaStock);
              return excede ? (
                <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#c0392b' }}>
                  No se puede restar {deltaStock} — el stock quedaría en {resultado}. Máximo a restar: <strong>{formData.stock}</strong>.
                </p>
              ) : (
                <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#61065b' }}>
                  Stock actualizado: <strong>{resultado}</strong>
                </p>
              );
            })()}

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                disabled={!deltaStock || Number(deltaStock) <= 0 || (operacion === '-' && Number(deltaStock) > Number(formData.stock))}
                onClick={() => {
                  const delta = Number(deltaStock);
                  const nuevoStock = operacion === '+' ? Number(formData.stock) + delta : Number(formData.stock) - delta;
                  setFormData({ ...formData, stock: nuevoStock });
                  setModalStockAbierto(false);
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#61065b', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '2px 2px 8px gray', opacity: (!deltaStock || Number(deltaStock) <= 0 || (operacion === '-' && Number(deltaStock) > Number(formData.stock))) ? 0.5 : 1 }}
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setModalStockAbierto(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d4af37', background: 'transparent', color: '#d4af37', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '2px 2px 8px gray' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FLOTANTE DE NUEVA CATEGORÍA */}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Nombre de la categoría</label>
                <input 
                  type="text" 
                  value={nombreNuevaCategoria} 
                  onChange={(e) => setNombreNuevaCategoria(e.target.value)} 
                  placeholder="Ej: Pulseras de Plata"
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }} 
                />
                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Descripción de la categoría</label>
                <input 
                  type="text" 
                  value={descripcionNuevaCategoria} 
                  onChange={(e) => setDescripcionNuevaCategoria(e.target.value)} 
                  placeholder="(OPCIONAL) Ej: Va en la muñeca, tobillo"
                  required 
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

export default EditarProducto;
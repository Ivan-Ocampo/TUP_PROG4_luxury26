import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId } from '../../services/productoService';
import { getToken } from '../../utils/auth';
import { useCart } from '../../context/CartContext';
import CantidadModal from '../../components/cantidadModal/CantidadModal';
import './DetalleProducto.css';
import Button from '../../components/button/Button';
import Spinner from '../../components/spinner/Spinner';

const DetalleProducto = () => {
  // 1. Extraemos el ID del producto directamente de la URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();

  // 2. Estados locales para manejar los datos y la pantalla de carga
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estados para el modal de cantidad y los mensajes de feedback
  const [modalAbierto, setModalAbierto] = useState(false);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  // 3. Efecto para buscar los datos cuando el componente se monta
  useEffect(() => {
    const cargarProducto = async () => {
      const data = await obtenerProductoPorId(id);
      setProducto(data);
      setCargando(false);
    };

    cargarProducto();
  }, [id]); // El efecto se vuelve a ejecutar si el ID de la URL cambia

  const handleAbrirModal = () => {
    // Si no está logueado, lo mandamos al login
    if (!getToken()) {
      navigate('/login');
      return;
    }
    setExito('');
    setError('');
    setModalAbierto(true);
  };

  const handleConfirmar = async (cantidad) => {
    try {
      await agregarAlCarrito(producto._id, cantidad);
      setModalAbierto(false);
      setExito('Producto agregado al carrito');
      setTimeout(() => setExito(''), 2500);
    } catch (err) {
      setModalAbierto(false);
      setError(err.response?.data?.mensaje || 'No se pudo agregar al carrito');
      setTimeout(() => setError(''), 3000);
    }
  };

  //Spinner para mostrar mientras se cargan los datos
  if (cargando) {
    return <Spinner color="violet" texto="Cargando detalles de la joya..." />;
  }

  // Si el backend responde pero el producto no existe (ej. alguien escribió mal la URL)
  if (!producto) return <Spinner color="red" texto="Producto no encontrado." />;

  // 5. Renderizado del detalle completo (Cumpliendo los requisitos de tu consigna)
  return (
    <div className="detalle-container">
      <div className="detalle-layout">
        
        {/* Columna Izquierda: Imagen */}
        <div className="detalle-imagen-container">
          <img 
            src={producto.imagenUrl || 'https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg'} 
            alt={`Imagen de ${producto.nombre}`} 
            className="detalle-imagen" 
          />
        </div>

        {/* Columna Derecha: Información requerida */}
        <div className="detalle-info">
          {/* Requisito: Nombre */}
          <h1 className="detalle-titulo">{producto.nombre}</h1>
          
          {/* Requisito: Categoría (con optional chaining por si falla el populate en Mongoose) */}
          <span className="detalle-categoria">Categoría: {producto.categoriaId?.nombre}</span>
          
          {/* Requisito: Precio */}
          <p className="detalle-precio">${producto.precio}</p>
          
          {/* Requisito: Descripción */}
          <div className="detalle-descripcion">
            <h3>Descripción:</h3>
            <p>{producto.descripcion}</p>
          </div>

          {exito && <div className="detalle-exito">{exito}</div>}
          {error && <div className="detalle-error">{error}</div>}

          <div className="detalle-acciones">
            {/* Botón que abre el modal de cantidad (ya no navega directo a /carrito) */}
            <div className='btn-carrito' onClick={handleAbrirModal}>
              <Button texto="Agregar al Carrito" color="lila" size="grande" efecto="redondeado" />
            </div>

            {/* Navegación de regreso al catálogo */}
            <Link to="/" className="btn-volver">
              <Button texto="Volver al Catálogo" color="lila" size="grande" efecto="redondeado" />
            </Link>
          </div>
        </div>

      </div>

      {modalAbierto && (
        <CantidadModal
          producto={producto}
          onConfirmar={handleConfirmar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
};

export default DetalleProducto;

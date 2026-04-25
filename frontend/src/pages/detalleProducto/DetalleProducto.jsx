import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorId } from '../../services/productoService';
import './DetalleProducto.css';
import Button from '../../components/button/Button';

const DetalleProducto = () => {
  // 1. Extraemos el ID del producto directamente de la URL
  const { id } = useParams(); 
  
  // 2. Estados locales para manejar los datos y la pantalla de carga
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 3. Efecto para buscar los datos cuando el componente se monta
  useEffect(() => {
    const cargarProducto = async () => {
      const data = await obtenerProductoPorId(id);
      setProducto(data);
      setCargando(false);
    };
    
    cargarProducto();
  }, [id]); // El efecto se vuelve a ejecutar si el ID de la URL cambia

  // 4. Renderizados condicionales mientras esperamos al backend
  if (cargando) return <h2 className="loading-text">Cargando detalles de la joya...</h2>;
  
  // Si el backend responde pero el producto no existe (ej. alguien escribió mal la URL)
  if (!producto) return <h2 className="error-text">La joya que buscas no se encuentra disponible.</h2>;

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

          <div className="detalle-acciones">
            {/* Botón mockeado (sin lógica de auth por ahora) */}
            <Link to="/carrito" className='btn-carrito'>
              <Button texto="Agregar al Carrito" color="lila" size="grande" efecto="redondeado" />
            </Link>

            {/* Navegación de regreso al catálogo */}
            <Link to="/" className="btn-volver">
              <Button texto="Volver al Catálogo" color="lila" size="grande" efecto="redondeado" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetalleProducto;
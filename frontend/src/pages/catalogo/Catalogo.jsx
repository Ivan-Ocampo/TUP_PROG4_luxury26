import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import { obtenerProductos } from '../../services/productoService';
import SkeletonCard from '../../components/skeleton/SkeletonCard';
import { Link } from 'react-router-dom';

import './Catalogo.css';
import Button from '../../components/button/Button';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);

      } catch (err) {
        setError("Error al cargar el catálogo. Por favor, inténtalo de nuevo más tarde.");
        console.error("Detalle del error:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarCatalogo();
  }, []);

  // 2. Si hay error, lo mostramos (esto queda igual)
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</h2>;

  return (
    <div className="catalogo-container">
      {/* Botón para agregar producto (solo para admin) */}
      <Link to ="/admin/altaProducto">
      <Button texto="Agregar producto" style={{position: 'absolute', top: '20px', left: '20px'}} color="lila" size="grande" efecto="redondeado" />
      </Link>
      <h1>Catálogo de Joyas</h1>
      
      {/* La misma grilla que usa el catálogo real */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        
        {cargando ? (
          // Si está cargando, generamos un arreglo falso de 6 elementos para dibujar 6 Skeletons
          [...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          // Si ya terminó de cargar, mapeamos los productos reales
          productos.map((producto) => (
            <ProductCard 
              key={producto._id}
              _id={producto._id}
              nombre={producto.nombre}
              imagenUrl={producto.imagenUrl}
              descripcion={producto.descripcion}
              precio={producto.precio}
              categoriaId={producto.categoriaId}
              onAddToCart={() => console.log('Agregar al carrito')}
            />
          ))
        )}

      </div>
    </div>
  );
};

export default Catalogo;
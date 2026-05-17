import React, { useState, useEffect } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { obtenerProductos } from "../../services/productoService";
import SkeletonCard from "../../components/skeleton/SkeletonCard";
import { Link } from "react-router-dom";
import { getUserRolFromToken } from "../../utils/auth";

import "./Catalogo.css";
import Button from "../../components/button/Button";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (err) {
        setError(
          "Error al cargar el catálogo. Por favor, inténtalo de nuevo más tarde.",
        );
        console.error("Detalle del error:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarCatalogo();
  }, []);

  const userRol = getUserRolFromToken();

  //Si el rol es admin, mostramos el botón de edición
  const esAdmin = userRol === "administrador";

  const productosFiltrados = productos.filter((producto) => {
    if (esAdmin && mostrarInactivos) {
      return true;
    }

    return producto.activo !== false;
  });

  //Si hay error, lo mostramos
  if (error)
    return (
      <h2 style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        {error}
      </h2>
    );

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Joyas</h1>
      {esAdmin && (
        <div style={{ textAlign: 'center', marginBottom: '25px', backgroundColor: '#f3e5f5', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
          <label style={{ cursor: 'pointer', fontWeight: 'bold', color: '#5a189a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={mostrarInactivos}
              onChange={(e) => setMostrarInactivos(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Ver productos dados de baja
          </label>
        </div>
      )}
      {/* La misma grilla que usa el catálogo real */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {cargando
          ? // Si está cargando, generamos un arreglo falso de 6 elementos para dibujar 6 Skeletons
            [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
          : // Si ya terminó de cargar, mapeamos los productos reales
            productosFiltrados.map((producto) => (
              <ProductCard
                key={producto._id}
                _id={producto._id}
                nombre={producto.nombre}
                imagenUrl={producto.imagenUrl}
                descripcion={producto.descripcion}
                precio={producto.precio}
                categoriaId={producto.categoriaId}
                onAddToCart={() => console.log("Agregar al carrito")}
                esAdmin={esAdmin}
                estaActivo={producto.activo !== false}
              />
            ))}
      </div>
    </div>
  );
};

export default Catalogo;

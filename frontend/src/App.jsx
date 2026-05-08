import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Importarmos los componentes globales (Navbar y Footer)
import Navbar from './components/navigation/Navbar';
import Footer from './components/footer/Footer';
import Button from './components/button/Button';

// Importamos las páginas desde su nueva ubicación
import Catalogo from './pages/catalogo/Catalogo';
import DetalleProducto from './pages/detalleProducto/DetalleProducto';
import AltaProducto from './pages/altaProducto/AltaProducto';

function App() {
 const enlacesDeNavegacion = [
    { name: 'Inicio', url: '/' },
    { name: 'Catálogo', url: '/' },
    { name: 'Carrito', url: '/carrito' }
  ];
  return (
    <BrowserRouter>
      {/* El BrowserRouter envuelve toda la app para habilitar la navegación.
        Todo lo que se ponga fuera de <Routes> (Navbar y Footer) se verá en todas las pantallas.
      */}
      <div className="app-container">
       
        <Navbar brandName="Luxury" links={enlacesDeNavegacion} />

        <Routes>
          {/* Ruta principal: Muestra el catálogo de joyas */}
          <Route path="/" element={<Catalogo />} />
          
          {/* Ruta para el detalle del producto (la usaremos más adelante) */}
          <Route path="/producto/:id" element={<DetalleProducto />} />
          {/* Ruta para dar de alta un nuevo producto (solo para admin) */}
          <Route path="/admin/altaProducto" element={<AltaProducto />} />
        </Routes>

        <Footer year={new Date().getFullYear()} companyName="Luxury" />

      </div>
    </BrowserRouter>
  );
}

export default App;
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useCart } from './context/CartContext';

import AdminRoute from './components/adminRoute/AdminRoute';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Navbar from './components/navigation/Navbar';
import Footer from './components/footer/Footer';
import { CartProvider } from './context/CartContext';
import { NotificacionProvider } from './context/NotificacionContext';

import Catalogo from './pages/catalogo/Catalogo';
import DetalleProducto from './pages/detalleProducto/DetalleProducto';
import AltaProducto from './pages/altaProducto/AltaProducto';
import Login from './pages/login/Login';
import Registro from './pages/registro/Registro';
import Usuarios from './pages/usuarios/Usuarios';
import EditarProducto from './pages/editarProducto/EditarProducto';
import MiPerfil from './pages/miPerfil/MiPerfil';
import Carrito from './pages/carrito/Carrito';
import ConfirmarCompra from './pages/confirmarCompra/ConfirmarCompra';
import Recibo from './pages/recibo/Recibo';
import MisCompras from './pages/misCompras/MisCompras';
import AdminOrdenes from './pages/adminOrdenes/AdminOrdenes';
import ForgotPassword from './pages/forgotpassword/Forgotpassword';
import ResetPassword from './pages/resetPassword/ResetPassword';

const RouteChangeHandler = () => {
  const location = useLocation();
  const { refrescarCarrito } = useCart();
  useEffect(() => { refrescarCarrito(); }, [location.pathname]);
  return null;
};

function App() {
  return (
    <CartProvider>
    <NotificacionProvider>
      <BrowserRouter>
        <div className="app-container">
          <RouteChangeHandler />
          <Navbar brandName="Luxury" />

          <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Catalogo />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Rutas que requieren usuario autenticado */}
            <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
            <Route path="/mi-Perfil" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
            <Route path="/confirmar-compra" element={<ProtectedRoute><ConfirmarCompra /></ProtectedRoute>} />
            <Route path="/recibo" element={<ProtectedRoute><Recibo /></ProtectedRoute>} />
            <Route path="/mis-compras" element={<ProtectedRoute><MisCompras /></ProtectedRoute>} />

            <Route
              path="/admin/altaProducto"
              element={<AdminRoute><AltaProducto /></AdminRoute>}
            />
            <Route
              path="/admin/usuarios"
              element={<AdminRoute><Usuarios /></AdminRoute>}
            />
            <Route
              path="/admin/editarProducto/:id"
              element={<AdminRoute><EditarProducto /></AdminRoute>}
            />
            <Route
              path="/admin/ordenes"
              element={<AdminRoute><AdminOrdenes /></AdminRoute>}
            />
          </Routes>
          </main>

          <Footer year={new Date().getFullYear()} companyName="Luxury" />
        </div>
      </BrowserRouter>
    </NotificacionProvider>
    </CartProvider>
  );
}

export default App;

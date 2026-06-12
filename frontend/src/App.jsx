import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AdminRoute from './components/adminRoute/AdminRoute';
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
import ForgotPassword from './pages/forgotpassword/Forgotpassword';
import ResetPassword from './pages/resetPassword/ResetPassword';

function App() {
  return (
    <CartProvider>
    <NotificacionProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar brandName="Luxury" />

          <main className="main-content">
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/mi-Perfil" element={<MiPerfil />} />
            <Route path="/confirmar-compra" element={<ConfirmarCompra />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

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

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserRolFromToken, getToken } from "../../utils/auth";
import { useCart } from "../../context/CartContext";
import { useNotificaciones } from "../../context/NotificacionContext";
import { FaUserCircle, FaSignOutAlt, FaShoppingCart, FaPlus, FaUsers, FaUser, FaBell, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const ICONOS_TIPO = {
  carrito_pendiente: '🛒',
  carrito_expirado:  '⏰',
  stock_eliminado:   '⚠️',
};

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [panelNotif, setPanelNotif] = useState(false);
  const [hamburgerAbierto, setHamburgerAbierto] = useState(false);
  const menuRef    = useRef(null);
  const notifRef   = useRef(null);
  const navbarRef  = useRef(null);

  const { cantidadTotal } = useCart();
  const { notificaciones, eliminar, eliminarTodas } = useNotificaciones();

  const estaLogueado = !!getToken();
  const rol = getUserRolFromToken();
  const esAdmin = rol === "administrador";
  const hayNotificaciones = notificaciones.length > 0;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    setMenuAbierto(false);
    setHamburgerAbierto(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickAfuera = (e) => {
      if (menuRef.current  && !menuRef.current.contains(e.target))  setMenuAbierto(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setPanelNotif(false);
      if (navbarRef.current && !navbarRef.current.contains(e.target)) setHamburgerAbierto(false);
    };
    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, []);

  // Cierra el hamburger al agrandar la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setHamburgerAbierto(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-left">
        <button
          className="hamburger-btn"
          onClick={() => setHamburgerAbierto(h => !h)}
          aria-label="Menú"
        >
          {hamburgerAbierto ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
        <div className="logo">
          <Link to="/">💎 Luxury</Link>
        </div>
      </div>

      <ul className={`nav-links${hamburgerAbierto ? " hamburger-open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setHamburgerAbierto(false)}>Inicio</Link>
        </li>

        {/* ── Carrito ── */}
        <li className="carrito-nav-item">
          <Link to="/carrito" onClick={() => setHamburgerAbierto(false)}>
            <FaShoppingCart size={22} />
            {cantidadTotal > 0 && <span className="carrito-badge">{cantidadTotal}</span>}
            <span className="nav-label">Carrito</span>
          </Link>
        </li>

        {/* ── Campana de notificaciones (solo logueado) ── */}
        {estaLogueado && (
          <li className="notif-nav-item" ref={notifRef}>
            <div
              className="notif-trigger"
              onClick={() => { setPanelNotif(p => !p); setMenuAbierto(false); }}
              title="Notificaciones"
            >
              <FaBell size={22} />
              {hayNotificaciones && <span className="notif-badge">{notificaciones.length}</span>}
              <span className="nav-label">Notificaciones</span>
            </div>

            {panelNotif && (
              <div className="notif-panel">
                <div className="notif-panel-header">
                  <span>Notificaciones</span>
                  {hayNotificaciones && (
                    <button className="notif-btn-limpiar" onClick={eliminarTodas}>
                      Limpiar todo
                    </button>
                  )}
                </div>

                {!hayNotificaciones ? (
                  <p className="notif-vacio">No tenés notificaciones.</p>
                ) : (
                  <ul className="notif-lista">
                    {notificaciones.map(n => (
                      <li key={n._id} className={`notif-item notif-item--${n.tipo}`}>
                        <span className="notif-icono">{ICONOS_TIPO[n.tipo]}</span>
                        <span className="notif-mensaje">{n.mensaje}</span>
                        <button
                          className="notif-btn-cerrar"
                          onClick={() => eliminar(n._id)}
                          title="Eliminar"
                        >✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        )}

        {/* ── Menú de usuario ── */}
        <li className="user-menu-container" ref={menuRef}>
          {estaLogueado ? (
            <>
              <div
                className="user-icon-trigger"
                onClick={() => { setMenuAbierto(m => !m); setPanelNotif(false); }}
              >
                <FaUserCircle size={26} />
                <span className="nav-label">Mi cuenta</span>
              </div>

              {menuAbierto && (
                <div className="dropdown-menu">
                  <Link to="/mi-Perfil" onClick={() => { setMenuAbierto(false); setHamburgerAbierto(false); }}>
                    <FaUser className="menu-icon" /> Mi Perfil
                  </Link>
                  {esAdmin && (
                    <>
                      <Link to="/admin/altaProducto" onClick={() => { setMenuAbierto(false); setHamburgerAbierto(false); }}>
                        <FaPlus className="menu-icon" /> Agregar Producto
                      </Link>
                      <Link to="/admin/usuarios" onClick={() => { setMenuAbierto(false); setHamburgerAbierto(false); }}>
                        <FaUsers className="menu-icon" /> Usuarios
                      </Link>
                      <hr />
                    </>
                  )}
                  <button onClick={cerrarSesion} className="btn-logout-menu">
                    <FaSignOutAlt className="menu-icon" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" title="Iniciar Sesión">
              <FaUserCircle size={26} />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

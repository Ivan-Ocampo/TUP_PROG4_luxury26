import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Carrito.css';

const Carrito = () => {
  const { items, cargando, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, total,
          itemsEliminados, limpiarItemsEliminados } = useCart();
  const navigate = useNavigate();

  // Mapa id -> valor del input, para editar la cantidad localmente sin pegarle al backend en cada tecla
  const [cantidades, setCantidades] = useState({});
  const [notificacion, setNotificacion] = useState('');
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);

  // Sincroniza las cantidades locales cuando cambian los items del carrito
  useEffect(() => {
    const mapa = {};
    items.forEach((item) => {
      mapa[item.productoId?._id] = item.cantidad;
    });
    setCantidades(mapa);
  }, [items]);

  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(''), 2000);
  };

  const handleCantidadChange = (productoId, valor) => {
    setCantidades((prev) => ({ ...prev, [productoId]: valor }));
  };

  const handleCantidadConfirm = (item) => {
    const productoId = item.productoId?._id;
    const stockMax = item.productoId?.stock ?? Infinity;
    let nueva = parseInt(cantidades[productoId], 10);

    if (isNaN(nueva) || nueva < 1) {
      // valor inválido: revertimos al valor actual
      setCantidades((prev) => ({ ...prev, [productoId]: item.cantidad }));
      return;
    }
    if (nueva > stockMax) {
      mostrarNotificacion(`Solo hay ${stockMax} unidades en stock`);
      setCantidades((prev) => ({ ...prev, [productoId]: item.cantidad }));
      return;
    }
    if (nueva !== item.cantidad) {
      actualizarCantidad(productoId, nueva);
    }
  };

  if (cargando) {
    return <div className="carrito-container"><p>Cargando carrito...</p></div>;
  }

  // Estado vacío
  if (!items || items.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <h2>Tu carrito está vacío</h2>
          <p>Aún no ha agregado items al carrito</p>
          <Link to="/" className="carrito-btn-link">Ir al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2 className="carrito-titulo">Mi Carrito</h2>

      {itemsEliminados.length > 0 && (
        <div className="carrito-alerta-stock">
          <strong>Productos eliminados por falta de stock:</strong>{' '}
          {itemsEliminados.join(', ')}
          <button className="carrito-alerta-cerrar" onClick={limpiarItemsEliminados}>✕</button>
        </div>
      )}

      {notificacion && <div className="carrito-notificacion">{notificacion}</div>}

      <div className="carrito-tabla-wrapper">
      <table className="carrito-tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const prod = item.productoId || {};
            const id = prod._id;
            return (
              <tr key={id}>
                <td>{prod.codigo || id?.slice(-6)}</td>
                <td>{prod.nombre}</td>
                <td>
                  <div className="carrito-cantidad-control">
                    <button
                      type="button"
                      className="carrito-btn-cantidad carrito-btn-menos"
                      onClick={() => {
                        const actual = parseInt(cantidades[id] ?? item.cantidad, 10) || 1;
                        if (actual > 1) actualizarCantidad(id, actual - 1);
                      }}
                    >
                      −
                    </button>
                    <input
                      className="carrito-input-cantidad"
                      type="number"
                      min="1"
                      value={cantidades[id] ?? item.cantidad}
                      onChange={(e) => handleCantidadChange(id, e.target.value)}
                      onBlur={() => handleCantidadConfirm(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.target.blur();
                      }}
                    />
                    <button
                      type="button"
                      className="carrito-btn-cantidad carrito-btn-mas"
                      onClick={() => {
                        const actual = parseInt(cantidades[id] ?? item.cantidad, 10) || 1;
                        const stockMax = prod.stock ?? Infinity;
                        if (actual < stockMax) {
                          actualizarCantidad(id, actual + 1);
                        } else {
                          mostrarNotificacion(`Solo hay ${stockMax} unidades en stock`);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${item.precioUnitario}</td>
                <td>${item.cantidad * item.precioUnitario}</td>
                <td>
                  <button
                    className="carrito-btn-eliminar"
                    onClick={() => eliminarDelCarrito(id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      <div className="carrito-footer-acciones">
        <span className="carrito-total"><strong>Total: ${total}</strong></span>
        <div className="carrito-footer-botones">
          <button className="carrito-btn-vaciar" onClick={() => setConfirmarVaciar(true)}>
            Vaciar Carrito
          </button>
          <Link to="/" className="carrito-btn-link">Seguir comprando</Link>
          <button className="carrito-btn-finalizar" onClick={() => navigate('/confirmar-compra')}>Finalizar Compra</button>
        </div>
      </div>

      {confirmarVaciar && (
        <div className="carrito-confirm-overlay" onClick={() => setConfirmarVaciar(false)}>
          <div className="carrito-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p>¿Está seguro que desea vaciar el carrito?</p>
            <div className="carrito-confirm-acciones">
              <button
                onClick={() => {
                  vaciarCarrito();
                  setConfirmarVaciar(false);
                }}
              >
                Sí
              </button>
              <button onClick={() => setConfirmarVaciar(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;

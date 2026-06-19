import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Carrito.css';

const Carrito = () => {
  const { items, cargando, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, total,
          itemsEliminados, limpiarItemsEliminados, refrescarCarrito } = useCart();
  const navigate = useNavigate();

  // Al entrar al carrito refrescamos el stock para mostrar el disponible actualizado
  useEffect(() => {
    refrescarCarrito();
  }, [refrescarCarrito]);

  // Mapa id -> valor del input, para editar la cantidad localmente sin pegarle al backend en cada tecla
  const [cantidades, setCantidades] = useState({});
  const [notificacion, setNotificacion] = useState('');
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);
  const [productosSinStock, setProductosSinStock] = useState([]); // popup al finalizar

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

  const handleFinalizar = () => {
    // Si algún item supera el stock disponible, mostramos el popup y NO avanzamos
    const faltantes = items
      .filter((it) => it.cantidad > (it.productoId?.stock ?? Infinity))
      .map((it) => ({
        productoId: it.productoId?._id,
        nombre: it.productoId?.nombre || 'Producto',
        solicitado: it.cantidad,
        disponible: it.productoId?.stock ?? 0,
      }));
    if (faltantes.length > 0) {
      setProductosSinStock(faltantes);
      return;
    }
    navigate('/confirmar-compra');
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

      {items.some((it) => it.cantidad > (it.productoId?.stock ?? Infinity)) && (
        <div className="carrito-alerta-stock">
          <strong>Algunas cantidades superan el stock disponible.</strong>{' '}
          Ajustá las cantidades resaltadas en amarillo para poder finalizar la compra.
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
            const stockDisp = prod.stock ?? Infinity;
            const excedeStock = item.cantidad > stockDisp;
            return (
              <tr key={id} className={excedeStock ? 'carrito-fila-sin-stock' : ''}>
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
                  {excedeStock && (
                    <div className="carrito-stock-aviso">
                      {stockDisp > 0 ? `Stock disponible: ${stockDisp}` : 'Sin stock disponible'}
                    </div>
                  )}
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
          <button className="carrito-btn-finalizar" onClick={handleFinalizar}>Finalizar Compra</button>
        </div>
      </div>

      {productosSinStock.length > 0 && (
        <div className="carrito-confirm-overlay" onClick={() => setProductosSinStock([])}>
          <div className="carrito-stock-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="carrito-stock-modal-titulo">Stock insuficiente</h3>
            <p>No podés finalizar la compra porque estos productos superan el stock disponible:</p>
            <ul className="carrito-stock-modal-lista">
              {productosSinStock.map((p) => (
                <li key={p.productoId}>
                  <strong>{p.nombre}</strong>: pediste {p.solicitado},{' '}
                  {p.disponible > 0 ? `solo quedan ${p.disponible}` : 'sin stock disponible'}
                </li>
              ))}
            </ul>
            <p>Ajustá las cantidades resaltadas en amarillo y volvé a intentar.</p>
            <div className="carrito-confirm-acciones">
              <button onClick={() => setProductosSinStock([])}>Entendido</button>
            </div>
          </div>
        </div>
      )}

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

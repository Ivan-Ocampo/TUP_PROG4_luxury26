import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fmtOrden } from '../../utils/formatOrden';
import './Recibo.css';

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatMetodo = (metodo) =>
  ({ efectivo: 'Efectivo', transferencia: 'Transferencia', debito: 'Tarjeta de débito', credito: 'Tarjeta de crédito' }[metodo] ?? metodo);

const Recibo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orden = state?.orden;

  if (!orden) {
    return (
      <div className="recibo-container">
        <p className="recibo-sin-datos">No hay datos de compra. <button onClick={() => navigate('/')}>Volver al inicio</button></p>
      </div>
    );
  }

  const { numeroOrden, fechaCreacion, items, total, datosFacturacion, pagos } = orden;
  const df = datosFacturacion || {};
  const dirF = df.direccionFacturacion || {};
  const dirE = df.direccionEntrega || {};

  return (
    <div className="recibo-container">
      <div className="recibo-card">
        <div className="recibo-header">
          <div className="recibo-logo">💎 Luxury</div>
          <div className="recibo-titulo-bloque">
            <h2 className="recibo-titulo">Comprobante de Compra</h2>
            <p className="recibo-nro">Orden N° <strong>{fmtOrden(numeroOrden)}</strong></p>
            <p className="recibo-fecha">Fecha: {formatFecha(fechaCreacion)}</p>
          </div>
        </div>

        <hr className="recibo-divisor" />

        {/* Datos del comprador */}
        <section className="recibo-seccion">
          <h3 className="recibo-seccion-titulo">Datos del comprador</h3>
          <div className="recibo-grid-2">
            <p><span>Nombre:</span> {df.nombre} {df.apellido}</p>
            <p><span>DNI:</span> {df.dni}</p>
            <p><span>Email:</span> {df.email}</p>
            <p><span>Teléfono:</span> {df.telefono}</p>
          </div>
        </section>

        <hr className="recibo-divisor" />

        {/* Direcciones */}
        <section className="recibo-seccion">
          <h3 className="recibo-seccion-titulo">Direcciones</h3>
          <div className="recibo-grid-2">
            <div>
              <p className="recibo-label-dir">Facturación</p>
              <p>{dirF.calle} {dirF.nro}{dirF.piso ? `, piso ${dirF.piso}` : ''}{dirF.depto ? ` dto. ${dirF.depto}` : ''}</p>
              <p>{dirF.ciudad}, {dirF.provincia}</p>
            </div>
            <div>
              <p className="recibo-label-dir">Entrega</p>
              <p>{dirE.calle} {dirE.nro}{dirE.piso ? `, piso ${dirE.piso}` : ''}{dirE.depto ? ` dto. ${dirE.depto}` : ''}</p>
              <p>{dirE.ciudad}, {dirE.provincia}</p>
            </div>
          </div>
        </section>

        <hr className="recibo-divisor" />

        {/* Items */}
        <section className="recibo-seccion">
          <h3 className="recibo-seccion-titulo">Detalle de productos</h3>
          <table className="recibo-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{it.nombre}</td>
                  <td className="recibo-center">{it.cantidad}</td>
                  <td className="recibo-right">${it.precioUnitario.toLocaleString('es-AR')}</td>
                  <td className="recibo-right">${(it.cantidad * it.precioUnitario).toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="recibo-total-row">
                <td colSpan={3} className="recibo-right"><strong>Total</strong></td>
                <td className="recibo-right"><strong>${total.toLocaleString('es-AR')}</strong></td>
              </tr>
            </tfoot>
          </table>
        </section>

        <hr className="recibo-divisor" />

        {/* Pagos */}
        <section className="recibo-seccion">
          <h3 className="recibo-seccion-titulo">Forma de pago</h3>
          {(pagos || []).map((p, i) => (
            <p key={i} className="recibo-pago">
              {formatMetodo(p.metodo)}: <strong>${p.monto.toLocaleString('es-AR')}</strong>
            </p>
          ))}
        </section>

        <div className="recibo-acciones">
          <button className="recibo-btn-imprimir" onClick={() => window.print()}>Imprimir</button>
          <button className="recibo-btn-compras" onClick={() => navigate('/mis-compras')}>Mis compras</button>
          <button className="recibo-btn-inicio" onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </div>
    </div>
  );
};

export default Recibo;

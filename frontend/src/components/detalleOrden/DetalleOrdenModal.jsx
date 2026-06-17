import React from 'react';
import { fmtOrden } from '../../utils/formatOrden';
import './DetalleOrdenModal.css';

const formatFecha = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const formatMetodo = (m) =>
  ({ efectivo: 'Efectivo', transferencia: 'Transferencia', debito: 'Tarjeta de débito', credito: 'Tarjeta de crédito' }[m] ?? m);

const DetalleOrdenModal = ({ orden, onClose }) => {
  if (!orden) return null;

  const { numeroOrden, fechaCreacion, estado, fechaEntrega, items, total, datosFacturacion, pagos, usuarioId } = orden;
  const df = datosFacturacion || {};
  const dirF = df.direccionFacturacion || {};
  const dirE = df.direccionEntrega || {};

  const dirLinea = (d) => [d.calle, d.nro, d.piso && `piso ${d.piso}`, d.depto && `dto. ${d.depto}`].filter(Boolean).join(' ');

  return (
    <div className="dom-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={e => e.stopPropagation()}>
        <button className="dom-cerrar" onClick={onClose} title="Cerrar">✕</button>

        {/* Encabezado */}
        <div className="dom-header">
          <div>
            <h2 className="dom-titulo">Detalle de Orden</h2>
            <p className="dom-nro">N° {fmtOrden(numeroOrden)}</p>
          </div>
          <span className={`dom-estado dom-estado--${estado ?? 'activa'}`}>{estado ?? 'activa'}</span>
        </div>

        <div className="dom-grid-2">
          <p><span>Fecha compra:</span> {formatFecha(fechaCreacion)}</p>
          {fechaEntrega && <p><span>Fecha entrega:</span> {formatFecha(fechaEntrega)}</p>}
          {/* Mostrar usuario si viene del panel admin */}
          {usuarioId?.nombre && <p><span>Cliente:</span> {usuarioId.nombre} {usuarioId.apellido}</p>}
          {usuarioId?.email  && <p><span>Email:</span> {usuarioId.email}</p>}
        </div>

        <hr className="dom-hr" />

        {/* Datos facturación */}
        {df.nombre && (
          <>
            <h3 className="dom-subtitulo">Datos de facturación</h3>
            <div className="dom-grid-2">
              <p><span>Nombre:</span> {df.nombre} {df.apellido}</p>
              <p><span>DNI:</span> {df.dni}</p>
              <p><span>Email:</span> {df.email}</p>
              <p><span>Teléfono:</span> {df.telefono || '—'}</p>
            </div>

            <div className="dom-grid-2" style={{ marginTop: '10px' }}>
              <div>
                <p className="dom-dir-label">Facturación</p>
                <p>{dirLinea(dirF)}</p>
                <p>{dirF.ciudad}, {dirF.provincia}</p>
                {dirF.comentario && <p className="dom-comentario">{dirF.comentario}</p>}
              </div>
              <div>
                <p className="dom-dir-label">Entrega</p>
                <p>{dirLinea(dirE)}</p>
                <p>{dirE.ciudad}, {dirE.provincia}</p>
                {dirE.comentario && <p className="dom-comentario">{dirE.comentario}</p>}
              </div>
            </div>
            <hr className="dom-hr" />
          </>
        )}

        {/* Productos */}
        <h3 className="dom-subtitulo">Productos</h3>
        <div className="dom-tabla-wrapper">
          <table className="dom-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map((it, i) => (
                <tr key={i}>
                  <td>{it.productoId?._id?.slice(-6) ?? it.productoId?.toString?.()?.slice(-6) ?? '—'}</td>
                  <td>{it.nombre}</td>
                  <td className="dom-center">{it.cantidad}</td>
                  <td className="dom-right">${it.precioUnitario?.toLocaleString('es-AR')}</td>
                  <td className="dom-right">${(it.cantidad * it.precioUnitario).toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="dom-total-row">
                <td colSpan={4} className="dom-right"><strong>Total</strong></td>
                <td className="dom-right"><strong>${total?.toLocaleString('es-AR')}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagos */}
        {pagos && pagos.length > 0 && (
          <>
            <hr className="dom-hr" />
            <h3 className="dom-subtitulo">Forma de pago</h3>
            {pagos.map((p, i) => (
              <p key={i} className="dom-pago">
                {formatMetodo(p.metodo)}: <strong>${p.monto?.toLocaleString('es-AR')}</strong>
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DetalleOrdenModal;

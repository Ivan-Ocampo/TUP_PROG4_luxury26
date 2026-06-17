import React, { useState, useEffect } from 'react';
import { obtenerOrdenesAdminApi, marcarEntregadaApi } from '../../services/ordenCompraService';
import DetalleOrdenModal from '../../components/detalleOrden/DetalleOrdenModal';
import { fmtOrden } from '../../utils/formatOrden';
import './AdminOrdenes.css';

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const descripcionItems = (items) =>
  items.map(it => `${it.nombre} x${it.cantidad}`).join('; ');

const AdminOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroNumero, setFiltroNumero] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  const [ordenDetalle, setOrdenDetalle] = useState(null);
  const [modalOrden, setModalOrden] = useState(null);
  const [marcando, setMarcando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError('');
    const filtros = {};
    if (filtroEstado)    filtros.estado      = filtroEstado;
    if (filtroNumero) {
      const soloNumero = parseInt(filtroNumero.replace(/\D/g, ''), 10);
      if (!isNaN(soloNumero)) filtros.numeroOrden = soloNumero;
    }
    if (filtroBusqueda)  filtros.busqueda     = filtroBusqueda;
    try {
      const data = await obtenerOrdenesAdminApi(filtros);
      setOrdenes(data);
    } catch {
      setError('Error al cargar las órdenes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleBuscar = (e) => { e.preventDefault(); cargar(); };

  const handleLimpiar = () => {
    setFiltroEstado('');
    setFiltroNumero('');
    setFiltroBusqueda('');
    setTimeout(cargar, 0);
  };

  const confirmarEntrega = async () => {
    if (!modalOrden) return;
    setMarcando(true);
    try {
      await marcarEntregadaApi(modalOrden._id);
      setModalOrden(null);
      await cargar();
    } catch {
      setError('Error al marcar como entregada.');
    } finally {
      setMarcando(false);
    }
  };

  return (
    <div className="ao-container">
      <h2 className="ao-titulo">Gestión de Órdenes</h2>

      {/* Filtros */}
      <form className="ao-filtros" onSubmit={handleBuscar}>
        <div className="ao-filtro-grupo">
          <label>Estado</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="activa">Activa</option>
            <option value="entregada">Entregada</option>
          </select>
        </div>
        <div className="ao-filtro-grupo">
          <label>N° Orden</label>
          <input
            type="text"
            placeholder="N° de orden (ej: 1)"
            value={filtroNumero}
            onChange={e => setFiltroNumero(e.target.value)}
          />
        </div>
        <div className="ao-filtro-grupo ao-filtro-grupo--wide">
          <label>Cliente </label>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={filtroBusqueda}
            onChange={e => setFiltroBusqueda(e.target.value)}
          />
        </div>
        <div className="ao-filtro-acciones">
          <button type="submit" className="ao-btn-buscar">Buscar</button>
          <button type="button" className="ao-btn-limpiar" onClick={handleLimpiar}>Limpiar</button>
        </div>
      </form>

      {cargando && <p className="ao-estado-txt">Cargando...</p>}
      {error    && <p className="ao-error">{error}</p>}
      {!cargando && ordenes.length === 0 && <p className="ao-estado-txt">No hay órdenes con esos filtros.</p>}

      {!cargando && ordenes.length > 0 && (
        <div className="ao-tabla-wrapper">
          <table className="ao-tabla">
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Cliente</th>
                <th>Descripción</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Detalle</th>
                <th>Entregada</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(orden => (
                <tr key={orden._id} className={orden.estado === 'entregada' ? 'ao-row-entregada' : ''}>
                  <td className="ao-nro">{fmtOrden(orden.numeroOrden)}</td>
                  <td className="ao-usuario">
                    {orden.usuarioId
                      ? <>
                          <span className="ao-usuario-nombre">{orden.usuarioId.nombre} {orden.usuarioId.apellido}</span>
                          <span className="ao-usuario-email">{orden.usuarioId.email}</span>
                        </>
                      : '—'}
                  </td>
                  <td className="ao-descripcion">{descripcionItems(orden.items)}</td>
                  <td className="ao-monto">${orden.total.toLocaleString('es-AR')}</td>
                  <td className="ao-fecha">{formatFecha(orden.fechaCreacion)}</td>
                  <td>
                    <span className={`ao-estado-badge ao-estado-badge--${orden.estado ?? 'activa'}`}>
                      {orden.estado ?? 'activa'}
                    </span>
                  </td>
                  <td className="ao-ver-cell">
                    <button className="ao-btn-ver" onClick={() => setOrdenDetalle(orden)}>
                      Ver
                    </button>
                  </td>
                  <td className="ao-checkbox-cell">
                    {(orden.estado ?? 'activa') === 'activa' ? (
                      <input
                        type="checkbox"
                        className="ao-checkbox"
                        title="Marcar como entregada"
                        onChange={() => setModalOrden(orden)}
                      />
                    ) : (
                      <span className="ao-entregada-fecha">
                        {orden.fechaEntrega ? formatFecha(orden.fechaEntrega) : '✓'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal detalle */}
      {ordenDetalle && (
        <DetalleOrdenModal orden={ordenDetalle} onClose={() => setOrdenDetalle(null)} />
      )}

      {/* Modal confirmación */}
      {modalOrden && (
        <div className="ao-modal-overlay" onClick={() => setModalOrden(null)}>
          <div className="ao-modal" onClick={e => e.stopPropagation()}>
            <h3 className="ao-modal-titulo">Confirmar entrega</h3>
            <p className="ao-modal-texto">
              ¿Marcás la orden N° <strong>{modalOrden.numeroOrden ?? '—'}</strong> como entregada?
            </p>
            <div className="ao-modal-acciones">
              <button className="ao-btn-cancelar" onClick={() => setModalOrden(null)} disabled={marcando}>
                Cancelar
              </button>
              <button className="ao-btn-confirmar" onClick={confirmarEntrega} disabled={marcando}>
                {marcando ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdenes;

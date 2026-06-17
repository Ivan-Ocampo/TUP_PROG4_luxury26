import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/auth';
import { obtenerOrdenesUsuarioApi, marcarEntregadaApi } from '../../services/ordenCompraService';
import DetalleOrdenModal from '../../components/detalleOrden/DetalleOrdenModal';
import { fmtOrden } from '../../utils/formatOrden';
import './MisCompras.css';

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const descripcionItems = (items) =>
  items.map(it => `${it.nombre} x${it.cantidad}`).join('; ');

const MisCompras = () => {
  const navigate = useNavigate();
  const usuarioId = getUserIdFromToken();

  const [tab, setTab] = useState('activas');
  const [activas, setActivas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [ordenDetalle, setOrdenDetalle] = useState(null);
  const [modalOrden, setModalOrden] = useState(null);
  const [marcando, setMarcando] = useState(false);

  useEffect(() => {
    if (!usuarioId) { navigate('/login'); return; }
    cargarOrdenes();
  }, [usuarioId]);

  const cargarOrdenes = async () => {
    setCargando(true);
    setError('');
    try {
      const [act, hist] = await Promise.all([
        obtenerOrdenesUsuarioApi(usuarioId, 'activa'),
        obtenerOrdenesUsuarioApi(usuarioId, 'entregada'),
      ]);
      setActivas(act);
      setHistorial(hist);
    } catch {
      setError('Error al cargar las compras.');
    } finally {
      setCargando(false);
    }
  };

  const confirmarEntrega = async () => {
    if (!modalOrden) return;
    setMarcando(true);
    try {
      await marcarEntregadaApi(modalOrden._id);
      setModalOrden(null);
      await cargarOrdenes();
    } catch {
      setError('Error al marcar como entregada.');
    } finally {
      setMarcando(false);
    }
  };

  const TablaOrdenes = ({ ordenes, mostrarCheckbox }) => (
    <div className="mc-tabla-wrapper">
      {ordenes.length === 0 ? (
        <div className="mc-vacio"><p>No hay órdenes en esta sección.</p></div>
      ) : (
        <table className="mc-tabla">
          <thead>
            <tr>
              <th>N° Orden</th>
              <th>Descripción</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Detalle</th>
              {mostrarCheckbox && <th>¿Entregado?</th>}
              {!mostrarCheckbox && <th>Fecha entrega</th>}
            </tr>
          </thead>
          <tbody>
            {ordenes.map(orden => (
              <tr key={orden._id}>
                <td className="mc-nro">{fmtOrden(orden.numeroOrden)}</td>
                <td className="mc-descripcion">{descripcionItems(orden.items)}</td>
                <td className="mc-monto">${orden.total.toLocaleString('es-AR')}</td>
                <td className="mc-fecha">{formatFecha(orden.fechaCreacion)}</td>
                <td className="mc-ver-cell">
                  <button className="mc-btn-ver" onClick={() => setOrdenDetalle(orden)}>
                    Ver
                  </button>
                </td>
                {mostrarCheckbox && (
                  <td className="mc-checkbox-cell">
                    <input
                      type="checkbox"
                      className="mc-checkbox"
                      title="Marcar como entregado"
                      onChange={() => setModalOrden(orden)}
                    />
                  </td>
                )}
                {!mostrarCheckbox && (
                  <td className="mc-fecha">{orden.fechaEntrega ? formatFecha(orden.fechaEntrega) : '—'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="mc-container">
      <h2 className="mc-titulo">Mis Compras</h2>

      <div className="mc-tabs">
        <button
          className={`mc-tab${tab === 'activas' ? ' mc-tab--activo' : ''}`}
          onClick={() => setTab('activas')}
        >
          Compras Activas {activas.length > 0 && <span className="mc-badge">{activas.length}</span>}
        </button>
        <button
          className={`mc-tab${tab === 'historial' ? ' mc-tab--activo' : ''}`}
          onClick={() => setTab('historial')}
        >
          Historial
        </button>
      </div>

      <div className="mc-contenido">
        {cargando && <p className="mc-cargando">Cargando...</p>}
        {error && <p className="mc-error">{error}</p>}

        {!cargando && tab === 'activas'   && <TablaOrdenes ordenes={activas}   mostrarCheckbox={true}  />}
        {!cargando && tab === 'historial' && <TablaOrdenes ordenes={historial} mostrarCheckbox={false} />}
      </div>

      {/* Modal detalle de orden */}
      {ordenDetalle && (
        <DetalleOrdenModal orden={ordenDetalle} onClose={() => setOrdenDetalle(null)} />
      )}

      {/* Modal confirmación entrega */}
      {modalOrden && (
        <div className="mc-modal-overlay" onClick={() => setModalOrden(null)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <h3 className="mc-modal-titulo">Confirmar entrega</h3>
            <p className="mc-modal-texto">
              ¿Confirmás que la orden N° <strong>{fmtOrden(modalOrden.numeroOrden)}</strong> fue entregada?
              Esta acción no se puede deshacer.
            </p>
            <div className="mc-modal-acciones">
              <button className="mc-btn-cancelar" onClick={() => setModalOrden(null)} disabled={marcando}>
                Cancelar
              </button>
              <button className="mc-btn-confirmar" onClick={confirmarEntrega} disabled={marcando}>
                {marcando ? 'Procesando...' : 'Confirmar entrega'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCompras;

import React, { useEffect, useState } from 'react';
import { getUsuarios, actualizarUsuarioAdmin, eliminarUsuarioAdmin } from '../../services/usuarioService';
import { FaPencilAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { PROVINCIAS } from '../../utils/argentina';
import '../altaProducto/AltaProducto.css'; // Reutilizamos estilos para mantener coherencia
import './Usuarios.css';

const dirVacia = () => ({
  pais: 'Argentina', provincia: '', ciudad: '', calle: '', nro: '', piso: '', depto: '', comentario: ''
});

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  // --- Filtros de búsqueda ---
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // --- Estados para el Modal de Edición ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalTab, setModalTab] = useState('datos');
  const [usuarioForm, setUsuarioForm] = useState({
    _id: '',
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    rol: 'cliente',
    activo: true,
    direccionFacturacion: dirVacia(),
    direccionEntrega: dirVacia()
  });

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // --- FUNCIONES DEL MODAL DE EDICIÓN ---
  const handleAbrirModal = (usuario) => {
    setModalTab('datos');
    setUsuarioForm({
      _id: usuario._id,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      dni: usuario.dni || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '',
      rol: usuario.rol || 'cliente',
      activo: usuario.activo !== false, // Por defecto true si no tiene el campo
      direccionFacturacion: { ...dirVacia(), ...(usuario.direccionFacturacion || {}) },
      direccionEntrega: { ...dirVacia(), ...(usuario.direccionEntrega || {}) }
    });
    setModalAbierto(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioForm({
      ...usuarioForm,
      // Si el campo es 'activo', convertimos el string a booleano
      [name]: name === 'activo' ? value === 'true' : value
    });
  };

  const handleDirChange = (tipo, campo, valor) => {
    setUsuarioForm(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valor }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Excluimos _id del body (es inmutable); se usa solo en la URL
      const { _id, ...payload } = usuarioForm;
      await actualizarUsuarioAdmin(_id, payload);

      // Actualizamos el estado local para ver el cambio instantáneo en la tabla
      setUsuarios(usuarios.map(u => u._id === _id ? { ...u, ...payload } : u));

      setModalAbierto(false);
      alert("¡Usuario actualizado correctamente!");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  // --- FUNCIÓN PARA ELIMINAR ---
  const handleEliminarClick = async (id, nombre) => {
    const confirmacion = window.confirm(`¿Estás seguro de que querés eliminar permanentemente al usuario "${nombre}"?`);

    if (confirmacion) {
      try {
        await eliminarUsuarioAdmin(id);
        setUsuarios(usuarios.filter(u => u._id !== id));
        alert("Usuario eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al intentar eliminar al usuario.");
      }
    }
  };

  // --- Aplicación de los filtros (en el cliente) ---
  // Normaliza: minúsculas y sin acentos, para que la búsqueda sea insensible a ambos.
  const normalizar = (s) =>
    (s ?? '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  const textoDireccion = (d) =>
    d ? [d.pais, d.provincia, d.ciudad, d.calle, d.nro, d.piso, d.depto, d.comentario].filter(Boolean).join(' ') : '';

  const coincideTexto = (u) => {
    const t = normalizar(filtroTexto.trim());
    if (!t) return true;
    const campos = normalizar([
      u.nombre, u.apellido, u.dni,
      textoDireccion(u.direccionFacturacion),
      textoDireccion(u.direccionEntrega)
    ].filter(Boolean).join(' '));
    return campos.includes(t);
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    if (!coincideTexto(u)) return false;
    if (filtroRol && u.rol !== filtroRol) return false;
    if (filtroEstado) {
      const estaActivo = u.activo !== false;
      if (filtroEstado === 'activo' && !estaActivo) return false;
      if (filtroEstado === 'inactivo' && estaActivo) return false;
    }
    return true;
  });

  const limpiarFiltros = () => {
    setFiltroTexto('');
    setFiltroRol('');
    setFiltroEstado('');
  };

  if (cargando) return <div className="form-container"><h3>Cargando usuarios...</h3></div>;

  return (
    <div className="form-container" style={{ maxWidth: '1100px', position: 'relative' }}>
      <h2>Gestión de Usuarios</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* FILTROS DE BÚSQUEDA */}
      <div className="usuarios-filtros">
        <div className="usuarios-filtro-grupo usuarios-filtro-grupo--wide">
          <label>Buscar</label>
          <input
            type="text"
            value={filtroTexto}
            onChange={e => setFiltroTexto(e.target.value)}
            placeholder="Nombre, apellido, DNI o dirección..."
          />
        </div>
        <div className="usuarios-filtro-grupo">
          <label>Rol</label>
          <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
            <option value="">Todos</option>
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <div className="usuarios-filtro-grupo">
          <label>Estado</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <button type="button" className="usuarios-btn-limpiar" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      <div className="usuarios-tabla-wrapper">
        <table className="usuarios-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="usuarios-sin-resultados">
                  No hay usuarios que coincidan con los filtros.
                </td>
              </tr>
            )}
            {usuariosFiltrados.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.apellido || '—'}</td>
                <td>{u.dni || '—'}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`usuarios-badge ${u.rol === 'administrador' ? 'usuarios-badge--rol-admin' : 'usuarios-badge--rol-cliente'}`}>
                    {u.rol}
                  </span>
                </td>
                <td>
                  <span className={`usuarios-badge ${u.activo !== false ? 'usuarios-badge--activo' : 'usuarios-badge--inactivo'}`}>
                    {u.activo !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* BOTONES DE LÁPIZ Y TACHITO */}
                <td>
                  <div className="usuarios-acciones">
                    <button
                      type="button"
                      title="Editar"
                      onClick={() => handleAbrirModal(u)}
                      className="usuarios-btn-accion usuarios-btn-editar"
                    >
                      <FaPencilAlt />
                    </button>

                    <button
                      type="button"
                      title="Eliminar"
                      onClick={() => handleEliminarClick(u._id, u.nombre)}
                      className="usuarios-btn-accion usuarios-btn-eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FLOTANTE DE EDICIÓN */}
      {modalAbierto && (
        <div className="usuarios-modal-overlay">
          <div className="usuarios-modal">
            <div className="usuarios-modal-header">
              <h3 className="usuarios-modal-titulo">Editar Usuario</h3>
              <button type="button" onClick={() => setModalAbierto(false)} className="usuarios-modal-cerrar">
                <FaTimes />
              </button>
            </div>

            {/* Tabs */}
            <div className="usuarios-modal-tabs">
              <button
                type="button"
                className={`usuarios-modal-tab${modalTab === 'datos' ? ' activa' : ''}`}
                onClick={() => setModalTab('datos')}
              >
                Datos personales
              </button>
              <button
                type="button"
                className={`usuarios-modal-tab${modalTab === 'facturacion' ? ' activa' : ''}`}
                onClick={() => setModalTab('facturacion')}
              >
                Dirección de facturación
              </button>
              <button
                type="button"
                className={`usuarios-modal-tab${modalTab === 'entrega' ? ' activa' : ''}`}
                onClick={() => setModalTab('entrega')}
              >
                Dirección de entrega
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* TAB: DATOS PERSONALES */}
              {modalTab === 'datos' && (
                <div className="usuarios-form-grid">
                  <div className="usuarios-form-grupo">
                    <label>Nombre</label>
                    <input name="nombre" value={usuarioForm.nombre} onChange={handleChange} required />
                  </div>
                  <div className="usuarios-form-grupo">
                    <label>Apellido</label>
                    <input name="apellido" value={usuarioForm.apellido} onChange={handleChange} />
                  </div>
                  <div className="usuarios-form-grupo">
                    <label>Email</label>
                    <input type="email" name="email" value={usuarioForm.email} onChange={handleChange} required />
                  </div>
                  <div className="usuarios-form-grupo">
                    <label>DNI</label>
                    <input name="dni" value={usuarioForm.dni} onChange={handleChange} />
                  </div>
                  <div className="usuarios-form-grupo usuarios-form-grupo--full">
                    <label>Teléfono</label>
                    <input name="telefono" value={usuarioForm.telefono} onChange={handleChange} />
                  </div>
                </div>
              )}

              {/* TAB: DIRECCIÓN DE FACTURACIÓN */}
              {modalTab === 'facturacion' && (
                <CamposDireccion
                  datos={usuarioForm.direccionFacturacion}
                  onChange={(campo, val) => handleDirChange('direccionFacturacion', campo, val)}
                />
              )}

              {/* TAB: DIRECCIÓN DE ENTREGA */}
              {modalTab === 'entrega' && (
                <CamposDireccion
                  datos={usuarioForm.direccionEntrega}
                  onChange={(campo, val) => handleDirChange('direccionEntrega', campo, val)}
                />
              )}

              {/* ROL Y ESTADO (fuera de los tabs) */}
              <div className="usuarios-rol-estado">
                <div className="usuarios-form-grupo">
                  <label>Rol</label>
                  <select name="rol" value={usuarioForm.rol} onChange={handleChange}>
                    <option value="cliente">Cliente</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div className="usuarios-form-grupo">
                  <label>Estado de la cuenta</label>
                  <select name="activo" value={usuarioForm.activo.toString()} onChange={handleChange}>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo (Baja Lógica)</option>
                  </select>
                </div>
              </div>

              <div className="usuarios-modal-acciones">
                <button type="button" onClick={() => setModalAbierto(false)} className="usuarios-modal-btn-cancelar">
                  Cancelar
                </button>
                <button type="submit" className="usuarios-modal-btn-guardar">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-componente: campos de una dirección ──────────────────────────────────
const CamposDireccion = ({ datos, onChange }) => (
  <div className="usuarios-form-grid">
    <div className="usuarios-form-grupo">
      <label>País</label>
      <input value={datos.pais} readOnly />
    </div>
    <div className="usuarios-form-grupo">
      <label>Provincia</label>
      <input
        list="usuarios-provincias"
        value={datos.provincia}
        onChange={e => onChange('provincia', e.target.value)}
        placeholder="Escribí para filtrar..."
      />
      <datalist id="usuarios-provincias">
        {PROVINCIAS.map(p => <option key={p} value={p} />)}
      </datalist>
    </div>
    <div className="usuarios-form-grupo">
      <label>Ciudad</label>
      <input value={datos.ciudad} onChange={e => onChange('ciudad', e.target.value)} />
    </div>
    <div className="usuarios-form-grupo">
      <label>Calle</label>
      <input value={datos.calle} onChange={e => onChange('calle', e.target.value)} />
    </div>
    <div className="usuarios-form-grupo">
      <label>Número</label>
      <input value={datos.nro} onChange={e => onChange('nro', e.target.value)} />
    </div>
    <div className="usuarios-form-grupo">
      <label>Piso</label>
      <input value={datos.piso} onChange={e => onChange('piso', e.target.value)} />
    </div>
    <div className="usuarios-form-grupo">
      <label>Depto</label>
      <input value={datos.depto} onChange={e => onChange('depto', e.target.value)} />
    </div>
    <div className="usuarios-form-grupo usuarios-form-grupo--full">
      <label>Comentario</label>
      <input
        value={datos.comentario}
        onChange={e => onChange('comentario', e.target.value)}
        placeholder='Ej: "Casa blanca con puerta roja"'
      />
    </div>
  </div>
);

export default Usuarios;

import React, { useState, useEffect } from 'react';
import './MiPerfil.css';
import { obtenerPerfil, actualizarPerfil, darDeBajaPerfil } from '../../services/usuarioService';
import Button from '../../components/button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PROVINCIAS } from '../../utils/argentina';

const direccionVacia = () => ({
  pais: 'Argentina',
  provincia: '',
  ciudad: '',
  calle: '',
  nro: '',
  piso: '',
  depto: '',
  comentario: '',
});

const MiPerfil = () => {
  const [tabActiva, setTabActiva] = useState('datos');

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    telefono: '',
    direccionFacturacion: direccionVacia(),
    direccionEntrega: direccionVacia(),
    passwordActual: '',
    nuevaPassword: '',
    repetirPassword: '',
  });

  const [entregaIgual, setEntregaIgual] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarRepetirPassword, setMostrarRepetirPassword] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const u = await obtenerPerfil();
        setFormData(prev => ({
          ...prev,
          nombre:   u.nombre   || '',
          apellido: u.apellido || '',
          email:    u.email    || '',
          dni:      u.dni      || '',
          telefono: u.telefono || '',
          direccionFacturacion: {
            pais:       u.direccionFacturacion?.pais       || 'Argentina',
            provincia:  u.direccionFacturacion?.provincia  || '',
            ciudad:     u.direccionFacturacion?.ciudad     || '',
            calle:      u.direccionFacturacion?.calle      || '',
            nro:        u.direccionFacturacion?.nro        || '',
            piso:       u.direccionFacturacion?.piso       || '',
            depto:      u.direccionFacturacion?.depto      || '',
            comentario: u.direccionFacturacion?.comentario || '',
          },
          direccionEntrega: {
            pais:       u.direccionEntrega?.pais       || 'Argentina',
            provincia:  u.direccionEntrega?.provincia  || '',
            ciudad:     u.direccionEntrega?.ciudad     || '',
            calle:      u.direccionEntrega?.calle      || '',
            nro:        u.direccionEntrega?.nro        || '',
            piso:       u.direccionEntrega?.piso       || '',
            depto:      u.direccionEntrega?.depto      || '',
            comentario: u.direccionEntrega?.comentario || '',
          },
        }));
      } catch (error) {
        console.error('Error al cargar perfil', error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDir = (tipo, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valor },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (formData.nuevaPassword && formData.nuevaPassword !== formData.repetirPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (formData.nuevaPassword && !formData.passwordActual) {
      setMensaje({ tipo: 'error', texto: 'Debés ingresar tu contraseña actual para cambiarla.' });
      return;
    }

    try {
      await actualizarPerfil({
        nombre:    formData.nombre,
        apellido:  formData.apellido,
        email:     formData.email,
        dni:       formData.dni,
        telefono:  formData.telefono,
        direccionFacturacion: formData.direccionFacturacion,
        direccionEntrega: entregaIgual
          ? formData.direccionFacturacion
          : formData.direccionEntrega,
        passwordActual: formData.passwordActual,
        nuevaPassword:  formData.nuevaPassword,
      });
      setMensaje({ tipo: 'exito', texto: '¡Perfil actualizado correctamente!' });
      setFormData(prev => ({ ...prev, passwordActual: '', nuevaPassword: '', repetirPassword: '' }));
      setMostrarPasswordActual(false);
      setMostrarNuevaPassword(false);
      setMostrarRepetirPassword(false);
    } catch (error) {
      console.error('Error al actualizar perfil', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Hubo un error al actualizar el perfil.' });
    }
  };

  const handleEliminarCuenta = async () => {
    const confirmacion = window.confirm('¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
      try {
        await darDeBajaPerfil();
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch (error) {
        console.error('Error al dar de baja la cuenta', error);
        setMensaje({ tipo: 'error', texto: 'Hubo un error al intentar dar de baja la cuenta.' });
      }
    }
  };

  const tabs = [
    { id: 'datos',       label: 'Datos personales' },
    { id: 'facturacion', label: 'Dirección de facturación' },
    { id: 'entrega',     label: 'Dirección de entrega' },
  ];

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Mi Perfil</h2>

        {mensaje.texto && (
          <div className={`mensaje-alerta ${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        {/* ── TABS ── */}
        <div className="perfil-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              className={`perfil-tab${tabActiva === t.id ? ' activa' : ''}`}
              onClick={() => setTabActiva(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="perfil-form">

          {/* ── TAB: DATOS PERSONALES ── */}
          {tabActiva === 'datos' && (
            <div className="perfil-tab-contenido">
              <div className="perfil-grid2">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>DNI *</label>
                  <input name="dni" value={formData.dni} onChange={handleChange} required />
                </div>
                <div className="form-group perfil-campo-full">
                  <label>Teléfono</label>
                  <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 011 1234-5678" />
                </div>
              </div>

              <div className="divisor" />

              <p className="perfil-subtitulo">Cambiar contraseña</p>

              <div className="form-group">
                <label>Contraseña actual</label>
                <div className="password-input-wrapper">
                  <input
                    type={mostrarPasswordActual ? 'text' : 'password'}
                    name="passwordActual"
                    placeholder="Obligatoria para cambiar contraseña"
                    value={formData.passwordActual}
                    onChange={handleChange}
                  />
                  <button type="button" className="btn-mostrar-password" onClick={() => setMostrarPasswordActual(!mostrarPasswordActual)}>
                    {mostrarPasswordActual ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={mostrarNuevaPassword ? 'text' : 'password'}
                    name="nuevaPassword"
                    placeholder="Dejar en blanco para no cambiarla"
                    value={formData.nuevaPassword}
                    onChange={handleChange}
                  />
                  <button type="button" className="btn-mostrar-password" onClick={() => setMostrarNuevaPassword(!mostrarNuevaPassword)}>
                    {mostrarNuevaPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Repetir nueva contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={mostrarRepetirPassword ? 'text' : 'password'}
                    name="repetirPassword"
                    placeholder="Repetí la nueva contraseña"
                    value={formData.repetirPassword}
                    onChange={handleChange}
                  />
                  <button type="button" className="btn-mostrar-password" onClick={() => setMostrarRepetirPassword(!mostrarRepetirPassword)}>
                    {mostrarRepetirPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="perfil-acciones">
                <Button type="submit" texto="Guardar cambios" color="lila" size="grande" efecto="redondeado" />
                <Button type="button" texto="Eliminar cuenta" color="rojo" size="grande" efecto="redondeado" onClick={handleEliminarCuenta} />
              </div>
            </div>
          )}

          {/* ── TAB: DIRECCIÓN DE FACTURACIÓN ── */}
          {tabActiva === 'facturacion' && (
            <div className="perfil-tab-contenido">
              <DireccionForm
                datos={formData.direccionFacturacion}
                onChange={(campo, val) => handleDir('direccionFacturacion', campo, val)}
                idDatalist="prov-fact"
              />
              <div className="perfil-acciones">
                <Button type="submit" texto="Guardar cambios" color="lila" size="grande" efecto="redondeado" />
              </div>
            </div>
          )}

          {/* ── TAB: DIRECCIÓN DE ENTREGA ── */}
          {tabActiva === 'entrega' && (
            <div className="perfil-tab-contenido">
              <label className="perfil-checkbox">
                <input
                  type="checkbox"
                  checked={entregaIgual}
                  onChange={e => setEntregaIgual(e.target.checked)}
                />
                ¿Tu dirección de entrega es la misma que la de facturación?
              </label>
              {!entregaIgual && (
                <DireccionForm
                  datos={formData.direccionEntrega}
                  onChange={(campo, val) => handleDir('direccionEntrega', campo, val)}
                  idDatalist="prov-ent"
                />
              )}
              <div className="perfil-acciones">
                <Button type="submit" texto="Guardar cambios" color="lila" size="grande" efecto="redondeado" />
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

const DireccionForm = ({ datos, onChange, idDatalist }) => (
  <div className="perfil-grid2">
    <div className="form-group">
      <label>País</label>
      <input value={datos.pais} readOnly className="perfil-input-readonly" />
    </div>
    <div className="form-group">
      <label>Provincia *</label>
      <input
        list={idDatalist}
        value={datos.provincia}
        onChange={e => onChange('provincia', e.target.value)}
        placeholder="Escribí para filtrar..."
        required
      />
      <datalist id={idDatalist}>
        {PROVINCIAS.map(p => <option key={p} value={p} />)}
      </datalist>
    </div>
    <div className="form-group">
      <label>Ciudad *</label>
      <input value={datos.ciudad} onChange={e => onChange('ciudad', e.target.value)} required />
    </div>
    <div className="form-group">
      <label>Calle *</label>
      <input value={datos.calle} onChange={e => onChange('calle', e.target.value)} required />
    </div>
    <div className="form-group">
      <label>Número *</label>
      <input value={datos.nro} onChange={e => onChange('nro', e.target.value)} required />
    </div>
    <div className="form-group">
      <label>Piso</label>
      <input value={datos.piso} onChange={e => onChange('piso', e.target.value)} />
    </div>
    <div className="form-group">
      <label>Departamento</label>
      <input value={datos.depto} onChange={e => onChange('depto', e.target.value)} />
    </div>
    <div className="form-group perfil-campo-full">
      <label>Comentario</label>
      <input
        value={datos.comentario}
        onChange={e => onChange('comentario', e.target.value)}
        placeholder='Ej: "Casa blanca con puerta roja"'
      />
    </div>
  </div>
);

export default MiPerfil;

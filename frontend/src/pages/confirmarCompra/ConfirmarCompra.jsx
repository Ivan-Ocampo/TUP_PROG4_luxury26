import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { obtenerPerfil } from '../../services/usuarioService';
import { generarOrdenApi } from '../../services/ordenCompraService';
import { getUserIdFromToken } from '../../utils/auth';
import { PROVINCIAS } from '../../utils/argentina';
import './ConfirmarCompra.css';

const METODOS = [
  { value: 'efectivo',       label: 'Efectivo' },
  { value: 'transferencia',  label: 'Transferencia' },
  { value: 'debito',         label: 'Tarjeta de débito' },
  { value: 'credito',        label: 'Tarjeta de crédito' },
];

const tarjetaVacia = () => ({ numero: '', titular: '', dniTitular: '', vencimiento: '', codigoSeguridad: '' });

const ConfirmarCompra = () => {
  const navigate = useNavigate();
  const { items, total, vaciarCarrito } = useCart();
  const usuarioId = getUserIdFromToken();

  // ── Datos del formulario ─────────────────────────────────────────────────
  const dirVacia = () => ({ pais: 'Argentina', provincia: '', ciudad: '', calle: '', nro: '', piso: '', depto: '', comentario: '' });

  const [form, setForm] = useState({
    apellido: '', nombre: '', email: '', dni: '', telefono: '',
    facturacion: dirVacia(),
    entrega:     dirVacia(),
  });
  const [entregaIgual, setEntregaIgual] = useState(true); // checkbox "misma que facturación"

  // ── Formas de pago ───────────────────────────────────────────────────────
  const [dosPagos, setDosPagos] = useState(false);
  const [pagos, setPagos] = useState([
    { metodo: 'efectivo', monto: '', tarjeta: tarjetaVacia() },
    { metodo: 'efectivo', monto: '', tarjeta: tarjetaVacia() },
  ]);

  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState('');

  // ── Autocompletar desde el perfil del usuario ────────────────────────────
  useEffect(() => {
    obtenerPerfil()
      .then(usuario => {
        const mapDir = (dir) => ({
          pais:       dir?.pais       || 'Argentina',
          provincia:  dir?.provincia  || '',
          ciudad:     dir?.ciudad     || '',
          calle:      dir?.calle      || '',
          nro:        dir?.nro        || '',
          piso:       dir?.piso       || '',
          depto:      dir?.depto      || '',
          comentario: dir?.comentario || '',
        });
        setForm(prev => ({
          ...prev,
          apellido: usuario.apellido || '',
          nombre:   usuario.nombre   || '',
          email:    usuario.email    || '',
          dni:      usuario.dni      || '',
          telefono: usuario.telefono || '',
          facturacion: mapDir(usuario.direccionFacturacion),
          entrega:     mapDir(usuario.direccionEntrega),
        }));
      })
      .catch(() => {}); // Si falla, el usuario completa manualmente
  }, []);

  // Cuando se activa "misma dirección" sincronizamos entrega con facturación
  useEffect(() => {
    if (entregaIgual) {
      setForm(prev => ({ ...prev, entrega: { ...prev.facturacion } }));
    }
  }, [entregaIgual, form.facturacion]);

  // ── Helpers de cambio de campo ───────────────────────────────────────────
  const handleField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDir = (tipo, campo, valor) => {
    setForm(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valor },
    }));
  };

  const handlePago = (idx, campo, valor) => {
    setPagos(prev => {
      const copia = prev.map(p => ({ ...p }));
      copia[idx][campo] = valor;
      // Si cambia a un método sin tarjeta, limpiamos los datos de tarjeta
      if (campo === 'metodo' && valor !== 'debito' && valor !== 'credito') {
        copia[idx].tarjeta = tarjetaVacia();
      }
      return copia;
    });
  };

  const handleTarjeta = (idx, campo, valor) => {
    setPagos(prev => {
      const copia = prev.map(p => ({ ...p, tarjeta: { ...p.tarjeta } }));
      copia[idx].tarjeta[campo] = valor;
      return copia;
    });
  };

  // ── Envío del formulario ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.apellido || !form.nombre || !form.email || !form.dni) {
      return setError('Completá los campos obligatorios de facturación.');
    }
    if (!form.facturacion.provincia || !form.facturacion.ciudad || !form.facturacion.calle || !form.facturacion.nro) {
      return setError('La dirección de facturación requiere provincia, ciudad, calle y número.');
    }
    if (!entregaIgual && (!form.entrega.provincia || !form.entrega.ciudad || !form.entrega.calle || !form.entrega.nro)) {
      return setError('La dirección de entrega requiere provincia, ciudad, calle y número.');
    }

    // Construimos el array de pagos para enviar al backend
    const pagosValidos = dosPagos ? pagos : [pagos[0]];
    for (const p of pagosValidos) {
      if (!p.monto || isNaN(Number(p.monto)) || Number(p.monto) <= 0) {
        return setError('Ingresá un monto válido para cada forma de pago.');
      }
    }
    const sumaPagos = pagosValidos.reduce((acc, p) => acc + Number(p.monto), 0);
    if (Math.abs(sumaPagos - total) > 0.01) {
      return setError(`Los montos deben sumar el total: $${total}`);
    }

    const pagosPayload = pagosValidos.map(p => ({
      metodo: p.metodo,
      monto:  Number(p.monto),
      ...(p.metodo === 'debito' || p.metodo === 'credito' ? { datosTarjeta: p.tarjeta } : {})
    }));

    const datosFacturacion = {
      apellido:  form.apellido,
      nombre:    form.nombre,
      email:     form.email,
      dni:       form.dni,
      telefono:  form.telefono,
      direccionFacturacion: form.facturacion,
      direccionEntrega:     entregaIgual ? form.facturacion : form.entrega,
    };

    try {
      setCargando(true);
      await generarOrdenApi(usuarioId, datosFacturacion, pagosPayload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al procesar la compra.');
    } finally {
      setCargando(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="checkout-container">
        <p>Tu carrito está vacío. <a href="/">Volver al catálogo</a></p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-titulo">Confirmar Compra</h2>

      <form onSubmit={handleSubmit} className="checkout-form">

        {/* ── DATOS PERSONALES ─────────────────────────────────────────── */}
        <section className="checkout-seccion">
          <h3 className="checkout-subtitulo">Datos de facturación</h3>
          <div className="checkout-grid2">
            <div className="checkout-campo">
              <label>Apellido *</label>
              <input name="apellido" value={form.apellido} onChange={handleField} required />
            </div>
            <div className="checkout-campo">
              <label>Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleField} required />
            </div>
            <div className="checkout-campo">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleField} required />
            </div>
            <div className="checkout-campo">
              <label>DNI *</label>
              <input name="dni" value={form.dni} onChange={handleField} required />
            </div>
            <div className="checkout-campo">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleField} placeholder="Ej: 011 1234-5678" />
            </div>
          </div>
        </section>

        {/* ── DIRECCIÓN DE FACTURACIÓN ─────────────────────────────────── */}
        <section className="checkout-seccion">
          <h3 className="checkout-subtitulo">Dirección de facturación</h3>
          <DireccionForm
            datos={form.facturacion}
            onChange={(campo, val) => handleDir('facturacion', campo, val)}
          />
        </section>

        {/* ── DIRECCIÓN DE ENTREGA ─────────────────────────────────────── */}
        <section className="checkout-seccion">
          <h3 className="checkout-subtitulo">Dirección de entrega</h3>
          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={entregaIgual}
              onChange={e => setEntregaIgual(e.target.checked)}
            />
            Igual a la dirección de facturación
          </label>
          {!entregaIgual && (
            <DireccionForm
              datos={form.entrega}
              onChange={(campo, val) => handleDir('entrega', campo, val)}
            />
          )}
        </section>

        {/* ── FORMAS DE PAGO ───────────────────────────────────────────── */}
        <section className="checkout-seccion">
          <h3 className="checkout-subtitulo">Forma de pago</h3>

          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={dosPagos}
              onChange={e => setDosPagos(e.target.checked)}
            />
            Pagar con 2 formas de pago
          </label>

          <PagoForm
            idx={0}
            pago={pagos[0]}
            label={dosPagos ? 'Pago 1' : ''}
            total={dosPagos ? null : total}
            onChange={handlePago}
            onTarjeta={handleTarjeta}
          />

          {dosPagos && (
            <PagoForm
              idx={1}
              pago={pagos[1]}
              label="Pago 2"
              total={null}
              onChange={handlePago}
              onTarjeta={handleTarjeta}
            />
          )}
        </section>

        {/* ── RESUMEN Y ENVÍO ──────────────────────────────────────────── */}
        <div className="checkout-resumen">
          <span className="checkout-total">Total: ${total}</span>
        </div>

        {error && <div className="checkout-error">{error}</div>}

        <div className="checkout-acciones">
          <button type="button" className="checkout-btn-volver" onClick={() => navigate('/carrito')}>
            Volver al carrito
          </button>
          <button type="submit" className="checkout-btn-confirmar" disabled={cargando}>
            {cargando ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>

      </form>
    </div>
  );
};

// ── Sub-componente: formulario de dirección ──────────────────────────────────
const DireccionForm = ({ datos, onChange }) => (
  <div className="checkout-grid4">
    <div className="checkout-campo">
      <label>País</label>
      <input value={datos.pais} readOnly style={{ background: '#f5f5f5', color: '#888' }} />
    </div>
    <div className="checkout-campo">
      <label>Provincia *</label>
      <input
        list="lista-provincias-checkout"
        value={datos.provincia}
        onChange={e => onChange('provincia', e.target.value)}
        placeholder="Escribí para filtrar..."
        required
      />
      <datalist id="lista-provincias-checkout">
        {PROVINCIAS.map(p => <option key={p} value={p} />)}
      </datalist>
    </div>
    <div className="checkout-campo checkout-campo--calle">
      <label>Ciudad *</label>
      <input value={datos.ciudad} onChange={e => onChange('ciudad', e.target.value)} required />
    </div>
    <div className="checkout-campo checkout-campo--calle">
      <label>Calle *</label>
      <input value={datos.calle} onChange={e => onChange('calle', e.target.value)} required />
    </div>
    <div className="checkout-campo checkout-campo--nro">
      <label>Número *</label>
      <input value={datos.nro} onChange={e => onChange('nro', e.target.value)} required />
    </div>
    <div className="checkout-campo">
      <label>Piso</label>
      <input value={datos.piso} onChange={e => onChange('piso', e.target.value)} />
    </div>
    <div className="checkout-campo">
      <label>Depto</label>
      <input value={datos.depto} onChange={e => onChange('depto', e.target.value)} />
    </div>
    <div className="checkout-campo checkout-campo--full">
      <label>Comentario</label>
      <input
        value={datos.comentario}
        onChange={e => onChange('comentario', e.target.value)}
        placeholder='Ej: "Casa blanca con puerta roja"'
      />
    </div>
  </div>
);

// ── Sub-componente: una forma de pago ────────────────────────────────────────
const PagoForm = ({ idx, pago, label, total, onChange, onTarjeta }) => {
  const esTarjeta = pago.metodo === 'debito' || pago.metodo === 'credito';

  return (
    <div className="checkout-pago">
      {label && <p className="checkout-pago-label">{label}</p>}

      <div className="checkout-radio-group">
        {METODOS.map(m => (
          <label key={m.value} className="checkout-radio">
            <input
              type="radio"
              name={`metodo-${idx}`}
              value={m.value}
              checked={pago.metodo === m.value}
              onChange={() => onChange(idx, 'metodo', m.value)}
            />
            {m.label}
          </label>
        ))}
      </div>

      {/* Monto solo si hay 2 pagos; si es pago único se fija al total */}
      {total !== null ? (
        <input type="hidden" value={total} />
      ) : (
        <div className="checkout-campo checkout-campo--monto">
          <label>Monto $</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pago.monto}
            onChange={e => onChange(idx, 'monto', e.target.value)}
            required
          />
        </div>
      )}

      {/* Datos de tarjeta (solo si el método es débito o crédito) */}
      {esTarjeta && (
        <div className="checkout-tarjeta">
          <div className="checkout-grid2">
            <div className="checkout-campo checkout-campo--full">
              <label>Número de tarjeta</label>
              <input
                maxLength={19}
                value={pago.tarjeta.numero}
                onChange={e => onTarjeta(idx, 'numero', e.target.value)}
              />
            </div>
            <div className="checkout-campo checkout-campo--full">
              <label>Titular</label>
              <input value={pago.tarjeta.titular} onChange={e => onTarjeta(idx, 'titular', e.target.value)} />
            </div>
            <div className="checkout-campo">
              <label>DNI del titular</label>
              <input value={pago.tarjeta.dniTitular} onChange={e => onTarjeta(idx, 'dniTitular', e.target.value)} />
            </div>
            <div className="checkout-campo">
              <label>Vencimiento (MM/AA)</label>
              <input
                maxLength={5}
                placeholder="MM/AA"
                value={pago.tarjeta.vencimiento}
                onChange={e => onTarjeta(idx, 'vencimiento', e.target.value)}
              />
            </div>
            <div className="checkout-campo">
              <label>Código de seguridad</label>
              <input
                maxLength={4}
                type="password"
                value={pago.tarjeta.codigoSeguridad}
                onChange={e => onTarjeta(idx, 'codigoSeguridad', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmarCompra;

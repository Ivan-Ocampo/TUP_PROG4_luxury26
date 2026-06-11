const mongoose = require('mongoose');

// Datos de una tarjeta (se guardan solo si el método de pago es tarjeta)
const datosTarjetaSchema = new mongoose.Schema({
  numero:        { type: String },
  titular:       { type: String },
  dniTitular:    { type: String },
  vencimiento:   { type: String }, // formato MM/AA
  codigoSeguridad: { type: String }
}, { _id: false });

// Cada pago: método + monto + datos de tarjeta si aplica
const pagoSchema = new mongoose.Schema({
  metodo: {
    type: String,
    enum: ['efectivo', 'transferencia', 'debito', 'credito'],
    required: true
  },
  monto:        { type: Number, required: true },
  datosTarjeta: { type: datosTarjetaSchema }   // solo presente si metodo es debito/credito
}, { _id: false });

// Dirección embebida en la orden (snapshot al momento de comprar)
const direccionOrdenSchema = new mongoose.Schema({
  pais: String, provincia: String, ciudad: String,
  calle: String, nro: String, piso: String, depto: String, comentario: String
}, { _id: false });

const ordenCompraSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },

  items: [{
    productoId:     { type: mongoose.Schema.Types.ObjectId },
    nombre:         { type: String, required: true },
    cantidad:       { type: Number, required: true },
    precioUnitario: { type: Number, required: true }
  }],

  total: { type: Number, required: true },

  // Snapshot de los datos de facturación al momento de confirmar la compra
  datosFacturacion: {
    apellido:            String,
    nombre:              String,
    email:               String,
    dni:                 String,
    telefono:            String,
    direccionFacturacion: { type: direccionOrdenSchema },
    direccionEntrega:     { type: direccionOrdenSchema }
  },

  // Hasta 2 formas de pago; sus montos deben sumar el total
  pagos: { type: [pagoSchema], validate: [v => v.length >= 1 && v.length <= 2, 'Entre 1 y 2 formas de pago'] },

  fechaCreacion: { type: Date, default: Date.now }
});

const OrdenCompra = mongoose.model('OrdenCompra', ordenCompraSchema);

module.exports = {OrdenCompra};

const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: {
    type: String,
    enum: ['carrito_pendiente', 'carrito_expirado', 'stock_eliminado'],
    required: true
  },
  mensaje: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);

module.exports = { Notificacion };

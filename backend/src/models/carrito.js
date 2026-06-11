const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  items: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true }
  }],
  total: { type: Number, default: 0 },
  // El carrito expira 15 minutos después de la última modificación.
  // Si expiraEn < Date.now() y el usuario intenta acceder, se vacía automáticamente.
  expiraEn: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) }
});

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = {Carrito};



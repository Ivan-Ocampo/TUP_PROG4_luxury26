const mongoose = require('mongoose');

const contadorSchema = new mongoose.Schema({
  nombre: { type: String, unique: true },
  valor:  { type: Number, default: 0 }
});

const Contador = mongoose.model('Contador', contadorSchema);
module.exports = { Contador };

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle:  { type: String, trim: true },
  nro:    { type: String, trim: true },
  piso:   { type: String, trim: true },
  depto:  { type: String, trim: true }
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true, trim: true },
  apellido: { type: String, trim: true },
  email:    { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  dni:      { type: String, trim: true },
  direccionFacturacion: { type: direccionSchema },
  direccionEntrega:     { type: direccionSchema },
  rol:    { type: String, enum: ['cliente', 'administrador'], default: 'cliente' },
  activo: { type: Boolean, default: true },
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date }
});

usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = { Usuario };

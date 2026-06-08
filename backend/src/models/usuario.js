const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'administrador'], default: 'cliente' },
  activo: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

// ==========================================
// Hook: Antes de guardar ('pre save')
// ==========================================
usuarioSchema.pre('save', async function() {
  // 'this' hace referencia al documento del usuario
  
  // Si la contraseña no fue modificada, simplemente retornamos para salir
  if (!this.isModified('password')) {
    return;
  }

  // Generamos el salt y hasheamos (Mongoose atrapará cualquier error automáticamente)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  

});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = {Usuario};
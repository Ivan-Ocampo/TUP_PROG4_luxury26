const crypto = require("crypto");
const {enviarMailRecuperacion} = require("../utils/mailer");
const { Usuario } = require("../models/usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (usuario.activo === false) {
      return res
        .status(403)
        .json({ mensaje: "Esta cuenta ha sido desactivada. Comunicate con el administrador.",
        });
    }
    
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
    );

    res.status(200).json({
      mensaje: "¡Login exitoso!",
      token: token,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", detalle: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(200).json({ mensaje: "Si el email existe, se enviará un mensaje con instrucciones para recuperar la contraseña." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    usuario.resetPasswordToken = hashedToken;

    usuario.resetPasswordExpires = Date.now() + 900000; // 15 minutos

    usuario.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await enviarMailRecuperacion(usuario.email, resetUrl);

    res.status(200).json({ mensaje: "Si el email existe, se enviará un mensaje con instrucciones para recuperar la contraseña." });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud", detalle: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if(!password || password.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const usuario = await Usuario.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }

    usuario.password = password;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;

    await usuario.save();

    res.status(200).json({ mensaje: "Contraseña restablecida correctamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud", detalle: error.message });
  }
};

module.exports = { login, forgotPassword, resetPassword };

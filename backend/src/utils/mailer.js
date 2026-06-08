const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const enviarMailRecuperacion = async (email, link) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `
            <h3>Solicitaste restablecer tu contraseña</h3>
            <p>Hacé clic en el siguiente enlace para crear una nueva contraseña:</p>
            <a href="${link}">Crear nueva contraseña</a>
            <p><strong>Nota:</strong> Este enlace vence en 15 minutos y es de único uso.</p>
            <p>Si no solicitaste este cambio, podes ignorar este mensaje.</p>
        `
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { enviarMailRecuperacion };
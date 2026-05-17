const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'No autorizado' });

    }


    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { id: decoded.id || decoded._id, rol: decoded.rol };
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
}

const adminMiddleware = (req, res, next) => {
    if (req.usuario.rol !== 'administrador') {
        return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol de administrador' });
    }
    next();
};


const isOwnerOrAdminMiddleware = (req, res, next) => {
    const id = req.params.id;
    if (req.usuario && (req.usuario.rol === 'administrador' || req.usuario.id === id)) {
        next();
    } else {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
};

module.exports = { authMiddleware, adminMiddleware, isOwnerOrAdminMiddleware };
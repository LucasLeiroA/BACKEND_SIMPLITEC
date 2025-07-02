const jwt = require('jsonwebtoken');

/**
 * Middleware que decodifica el JWT si está presente,
 * pero no bloquea el acceso si no hay token válido.
 *
 * Si el token es válido, agrega `req.user = { id, email, role, dealerId }`
 * Si no hay token o es inválido, continúa sin errores.
 */


const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        console.warn('Token JWT inválido (ignorado en ruta pública)');
    }

    next();
};

module.exports = optionalAuth;

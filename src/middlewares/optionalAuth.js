const jwt = require('jsonwebtoken');




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

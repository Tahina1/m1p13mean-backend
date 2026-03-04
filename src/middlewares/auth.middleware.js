const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        next();

    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authenticateToken;
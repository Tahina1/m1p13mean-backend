const authorize = (...allowedRoles) => {
    console.log('AUTHORIZE CALLED, roles:', allowedRoles);
    return (req, res, next) => {
        const hasRole = req.user.roles.some(role=> allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
        }
        next();
    }
}

module.exports = authorize;
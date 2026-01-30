const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const AppError = require("../utils/AppError");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Missing or invalid authorization header"));
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError.unauthorized("Insufficient permissions"));
    }
    next();
  };
};

module.exports = { authenticate, authorize };

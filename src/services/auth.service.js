const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");
const userRepository = require("../repositories/user.repository");
const AppError = require("../utils/AppError");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const register = async ({ email, password }) => {
  if (!email || !password) {
    throw AppError.badRequest("Email and password are required");
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw AppError.conflict("Email already in use");
  }

  const user = await userRepository.create({ email, password });
  const token = generateToken(user);

  return {
    user: { id: user._id, email: user.email, role: user.role },
    token,
  };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw AppError.badRequest("Email and password are required");
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    user: { id: user._id, email: user.email, role: user.role },
    token,
  };
};

module.exports = { register, login };

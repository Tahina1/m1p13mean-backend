const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, "User registered successfully", result, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, "Login successful", result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };

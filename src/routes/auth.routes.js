const router = require("express").Router();
const authController = require("../controllers/auth.controller");

// Route for user registration
router.post("/register", authController.register);
// Route for user login
router.post("/login", authController.login);

module.exports = router;
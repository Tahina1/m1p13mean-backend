const express = require("express");
const userController = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const router = express.Router();

// route to get all users
router.get("/", authenticateToken,  authorize("SHOP", "ADMIN"), userController.getAllUsers);

// route to create a new user
router.post("/", authenticateToken, authorize("SHOP", "ADMIN"),  userController.createUser);

module.exports = router;
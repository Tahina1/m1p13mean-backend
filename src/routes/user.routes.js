const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// route to get all users
router.get("/", userController.getAllUsers);

// route to create a new user
router.post("/", userController.createUser);

module.exports = router;
const User = require("../models/user.model");

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;
    const newUser = new User({ firstName, lastName, email, password, roles });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
  
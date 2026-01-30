const User = require("../models/user.model");

const findById = (id) => {
  return User.findById(id);
};

const findByEmail = (email) => {
  return User.findOne({ email }).select("+password");
};

const create = (data) => {
  return User.create(data);
};

const findAll = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [users, totalItems] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return { users, totalItems };
};

module.exports = { findById, findByEmail, create, findAll };

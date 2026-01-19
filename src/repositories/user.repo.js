const User = require('../models/user.model');

const findByEmail = (email) => {
  return User.findOne({ email });
};

const createUser = (data) => {
  return User.create(data);
};

const findById = (id) => {
  return User.findById(id);
};

module.exports = {
  findByEmail,
  createUser,
  findById,
};

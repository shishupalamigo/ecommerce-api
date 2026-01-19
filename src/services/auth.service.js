const userRepo = require('../repositories/user.repo');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const register = async ({ email, password, role }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepo.createUser({
    email,
    password: hashedPassword,
    role,
  });

  const token = generateToken({ userId: user._id, role: user.role });

  return { token };
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ userId: user._id, role: user.role });

  return { token };
};

module.exports = {
  register,
  login,
};

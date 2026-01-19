const Cart = require('../models/cart.model');

const findByUserId = (userId) => {
  return Cart.findOne({ userId });
};

const createCart = (data) => {
  return Cart.create(data);
};

const saveCart = (cart) => {
  return cart.save();
};

const deleteCart = (userId) => {
  return Cart.deleteOne({ userId });
};

module.exports = {
  findByUserId,
  createCart,
  saveCart,
  deleteCart,
};

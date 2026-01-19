const Order = require('../models/order.model');

const create = (data) => Order.create(data);

const findByUserId = (userId) =>
  Order.find({ userId }).sort({ createdAt: -1 });

module.exports = {
  create,
  findByUserId,
};

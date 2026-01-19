const orderService = require('../services/order.service');

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.user.userId);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getOrders,
};

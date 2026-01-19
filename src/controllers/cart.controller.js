const cartService = require('../services/cart.service');

const getCart = async (req, res, next) => {
  try {
    const result = await cartService.getCart(req.user.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const result = await cartService.addItem(
      req.user.userId,
      req.body
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const cart = await cartService.updateItemQuantity(
      userId,
      productId,
      quantity
    );

    res.json(cart);
  } catch (err) {
    next(err);
  }
}

const removeItem = async (req, res, next) => {
  try {
    await cartService.removeItem(
      req.user.userId,
      req.params.productId
    );
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addItem,
  updateCartItem,
  removeItem,
};

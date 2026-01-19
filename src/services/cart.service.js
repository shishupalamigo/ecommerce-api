const cartRepo = require('../repositories/cart.repo');
const productRepo = require('../repositories/product.repo');

const getCart = async (userId) => {
  let cart = await cartRepo.findByUserId(userId);

  if (!cart) {
    cart = await cartRepo.createCart({ userId, items: [] });
  }

  let subtotal = 0;

  cart.items.forEach((item) => {
    subtotal += item.quantity * item.priceAtAddTime;
  });

  return {
    items: cart.items,
    subtotal,
    total: subtotal,
  };
};

const addItem = async (userId, { productId, quantity }) => {
  const product = await productRepo.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  if (product.stockQuantity < quantity) {
    const err = new Error('Insufficient stock');
    err.statusCode = 400;
    throw err;
  }

  let cart = await cartRepo.findByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      priceAtAddTime: product.price,
    });
  }

  await cartRepo.saveCart(cart);
  return getCart(userId);
};

const updateItemQuantity = async (userId, productId, quantity) => {
  const cart = await cartRepo.findByUserId(userId);
  if (!cart) throw new Error('Cart not found');

  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  return cart;
};


const removeItem = async (userId, productId) => {
  const cart = await cartRepo.findByUserId(userId);
  if (!cart) return;

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cartRepo.saveCart(cart);
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
};

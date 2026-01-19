const productRepo = require('../repositories/product.repo');

const createProduct = async (data) => {
  return productRepo.create(data);
};

const getProductById = async (id) => {
  const product = await productRepo.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const updateProduct = async (id, data) => {
  const product = await productRepo.updateById(id, data);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await productRepo.deleteById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
};

const listProducts = async (query) => {
  const {
    page = 1,
    limit = 10,
    categoryId,
    minPrice,
    maxPrice,
  } = query;

  const filter = {};

  if (categoryId) filter.categoryId = categoryId;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    productRepo.findAll({ filter, skip, limit: Number(limit) }),
    productRepo.count(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
};

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProducts,
};

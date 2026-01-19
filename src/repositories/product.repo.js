const Product = require('../models/product.model');

const create = (data) => Product.create(data);

const findById = (id) => Product.findById(id);

const updateById = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

const deleteById = (id) => Product.findByIdAndDelete(id);

const findAll = ({ filter, skip, limit }) =>
  Product.find(filter).skip(skip).limit(limit);

const count = (filter) => Product.countDocuments(filter);

module.exports = {
  create,
  findById,
  updateById,
  deleteById,
  findAll,
  count,
};

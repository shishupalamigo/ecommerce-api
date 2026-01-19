    const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    categoryId: { type: String, index: true },
  },
  { timestamps: true }
);

productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);

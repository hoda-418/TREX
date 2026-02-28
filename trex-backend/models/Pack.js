const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  // Array of product IDs – references the Product collection
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  price: { type: Number, required:true },
  images: [String],                                  // Pack images
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pack', packSchema);
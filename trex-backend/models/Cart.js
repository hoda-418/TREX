const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: String,        // Could be phone number or a temporary ID
  customerName: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    qty: Number,
    image: String,
    category: String
  }],
  total: Number,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
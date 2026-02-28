const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // optional, for linking
    title: String,
    price: Number,
    qty: Number,
    image: String
  }],
  subtotal: Number,
  shipping: { type: Number, default: 5 },
  total: Number,
  status: {
    type: String,
    enum: [
      'pending',
      'call1_answered',
      'call1_not_answered',
      'call2_answered',
      'call2_not_answered',
      'approved',
      'disapproved'
    ],
    default: 'pending'
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
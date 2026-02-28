const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },           // Discount percentage
  image: String,                                     // Main image
  images: [String],                                  // Additional images (base64 or URLs)
  feedbacks: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Product', productSchema);
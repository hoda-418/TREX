const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// ------------------- Public routes -------------------

/**
 * GET /api/products
 * Get all products, sorted newest first.
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * GET /api/products/:id
 * Get a single product by its ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    // If ID is malformed, Mongoose throws CastError
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).send('Server error');
  }
});

// ------------------- Admin-only routes (protected by auth) -------------------

/**
 * POST /api/products
 * Create a new product. Admin only.
 * Body: { title, description, category, price, discount, image, images, feedbacks }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, price, discount, image, images, feedbacks } = req.body;
    const newProduct = new Product({
      title,
      description,
      category,
      price,
      discount,
      image,
      images,
      feedbacks
    });
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product. Admin only.
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, price, discount, image, images, feedbacks } = req.body;
    const productFields = { title, description, category, price, discount, image, images, feedbacks };

    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true } // return the updated document
    );
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product. Admin only.
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    await product.deleteOne();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).send('Server error');
  }
});

module.exports = router;
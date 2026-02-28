const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

/**
 * POST /api/carts
 * Save or update a customer's cart. Called when cart changes.
 * Body: { customerId, customerName, items, total }
 */
router.post('/', async (req, res) => {
  try {
    const { customerId, customerName, items, total } = req.body;
    // Try to find existing cart for this customer
    let cart = await Cart.findOne({ customerId });
    if (cart) {
      // Update existing
      cart.items = items;
      cart.total = total;
      cart.lastUpdated = Date.now();
      await cart.save();
      res.json(cart);
    } else {
      // Create new
      const newCart = new Cart({ customerId, customerName, items, total });
      const saved = await newCart.save();
      res.json(saved);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * GET /api/carts
 * Get all active carts (for admin). Admin only.
 */
router.get('/', auth, async (req, res) => {
  try {
    const carts = await Cart.find().sort({ lastUpdated: -1 });
    res.json(carts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /api/carts/:id
 * Delete a specific cart. Admin only.
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    await cart.deleteOne();
    res.json({ msg: 'Cart removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Cart not found' });
    res.status(500).send('Server error');
  }
});

module.exports = router;
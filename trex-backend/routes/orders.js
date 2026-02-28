const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * POST /api/orders
 * Place a new order (public – any customer can place an order).
 * Body: { customer, items, subtotal, shipping, total }
 */
router.post('/', async (req, res) => {
  try {
    const { customer, items, subtotal, shipping, total } = req.body;
    const newOrder = new Order({ customer, items, subtotal, shipping, total });
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * GET /api/orders
 * Get all orders, sorted by date (newest first). Admin only.
 */
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * PUT /api/orders/:id
 * Update an order's status. Admin only.
 * Body: { status }
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Order not found' });
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /api/orders/:id
 * Delete an order. Admin only.
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    await order.deleteOne();
    res.json({ msg: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Order not found' });
    res.status(500).send('Server error');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Pack = require('../models/Pack');
const auth = require('../middleware/auth');

// ------------------- Public -------------------

/**
 * GET /api/packs
 * Get all packs, populate the product details.
 */
router.get('/', async (req, res) => {
  try {
    const packs = await Pack.find()
      .populate('products', 'title price image') // only fetch these fields from products
      .sort({ createdAt: -1 });
    res.json(packs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * GET /api/packs/:id
 * Get a single pack by ID, populate all product fields.
 */
router.get('/:id', async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id).populate('products');
    if (!pack) return res.status(404).json({ msg: 'Pack not found' });
    res.json(pack);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Pack not found' });
    res.status(500).send('Server error');
  }
});

// ------------------- Admin only -------------------

/**
 * POST /api/packs
 * Create a new pack.
 * Body: { name, description, products (array of IDs), price, images }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, products, price, images } = req.body;
    const newPack = new Pack({ name, description, products, price, images });
    const pack = await newPack.save();
    res.json(pack);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * PUT /api/packs/:id
 * Update a pack.
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, products, price, images } = req.body;
    const packFields = { name, description, products, price, images };

    let pack = await Pack.findById(req.params.id);
    if (!pack) return res.status(404).json({ msg: 'Pack not found' });

    pack = await Pack.findByIdAndUpdate(req.params.id, { $set: packFields }, { new: true });
    res.json(pack);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Pack not found' });
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /api/packs/:id
 * Delete a pack.
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id);
    if (!pack) return res.status(404).json({ msg: 'Pack not found' });
    await pack.deleteOne();
    res.json({ msg: 'Pack removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Pack not found' });
    res.status(500).send('Server error');
  }
});

module.exports = router;
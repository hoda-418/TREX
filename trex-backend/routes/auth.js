const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/login
 * Authenticate an admin and return a JWT.
 * Expected body: { username, password }
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Create JWT payload
    const payload = { userId: user.id };
    // Sign token, expires in 7 days
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
console.error('Login error:', err.message); // ← add this if missing
    res.status(500).send('Server error');
  }
});

/**
 * POST /api/auth/register
 * Create a new admin user (optional – you may only need one).
 * Protected by auth middleware? Usually you'd protect this or disable it after first use.
 * Here we leave it open, but in production you might restrict it.
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user (password will be hashed by pre-save hook)
    user = new User({ username, password });
    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
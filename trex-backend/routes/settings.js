const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

/**
 * GET /api/settings
 * Get the current site settings (public).
 */
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings(); // ensures a document exists
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * PUT /api/settings
 * Update site settings. Admin only.
 * Body can contain any of the settings fields.
 */
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.getSettings();
    const {
      siteName,
      currency,
      email,
      phone,
      address,
      shippingFee,
      taxRate,
      maintenanceMode,
      logo
    } = req.body;

    // Update only the fields that were sent
    if (siteName !== undefined) settings.siteName = siteName;
    if (currency !== undefined) settings.currency = currency;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (address !== undefined) settings.address = address;
    if (shippingFee !== undefined) settings.shippingFee = shippingFee;
    if (taxRate !== undefined) settings.taxRate = taxRate;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (logo !== undefined) settings.logo = logo;

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
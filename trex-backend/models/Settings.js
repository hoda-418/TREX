const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'TREX Shop' },
  currency: { type: String, default: '$' },
  email: { type: String, default: 'support@trexshop.com' },
  phone: { type: String, default: '+213 555 123 456' },
  address: { type: String, default: 'Algiers, Algeria' },
  shippingFee: { type: Number, default: 5 },
  taxRate: { type: Number, default: 0 },
  maintenanceMode: { type: Boolean, default: false },
  logo: { type: String, default: '' }
}, { timestamps: true });

// Helper to ensure there is always exactly one settings document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
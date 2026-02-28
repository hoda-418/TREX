const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected for seeding');

    // Check if an admin already exists
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      // Create default admin (password will be hashed automatically)
      const admin = new User({ username: 'admin', password: 'admin123' });
      await admin.save();
      console.log('✅ Default admin created: admin / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Seeding error:', err));
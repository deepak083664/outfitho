const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Try deleting any existing user with this email first to ensure fresh state
    await User.deleteMany({ email: /outfithoo@gmail.com/i });

    const adminEmail = 'Outfithoo@gmail.com';
    const adminPassword = 'outfithoo123@';

    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log('Admin user created successfully with email: Outfithoo@gmail.com');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();

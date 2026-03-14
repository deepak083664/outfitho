require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected to DB: ${conn.connection.name} for seeding...`);

    // Try deleting any existing user with this email first to ensure fresh state
    await User.deleteMany({ email: /Outfithoo@gmail.com/i });

    const adminEmail = 'outfithoo@gmail.com';
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

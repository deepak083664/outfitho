const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const verifyUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const users = await User.find({}).select('email isAdmin');
    console.log('--- Current Users ---');
    users.forEach(u => {
      console.log(`Email: ${u.email}, Admin: ${u.isAdmin}`);
    });
    console.log('---------------------');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

verifyUsers();

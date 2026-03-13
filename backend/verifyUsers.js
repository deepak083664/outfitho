const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const verifyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ isAdmin: true });
    console.log('Admin Users found:', users.map(u => ({ email: u.email, isAdmin: u.isAdmin })));
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyUser();

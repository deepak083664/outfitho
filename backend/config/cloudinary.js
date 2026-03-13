const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: 'dbtqi5gs5',
  api_key: '266365162993881',
  api_secret: 'kGdHz6VIUrUApn6Bahs_z1DUBXA'
});

module.exports = cloudinary;

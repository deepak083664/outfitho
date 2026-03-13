const cloudinary = require('./config/cloudinary');
const dotenv = require('dotenv');
dotenv.config();

console.log('--- Env Vars ---');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

console.log('--- Cloudinary Config ---');
console.log('Configured Cloud Name:', cloudinary.config().cloud_name);

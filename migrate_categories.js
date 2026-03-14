const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from backend directory
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const Product = require('./backend/models/Product');

const migrateCategories = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for migration...');

    const products = await Product.find({ 
      $or: [
        { categories: { $exists: false } },
        { categories: { $size: 0 } }
      ]
    });

    console.log(`Found ${products.length} products to migrate.`);

    for (const product of products) {
      // Access the old category field (it might still be there in the doc even if not in schema)
      const oldCategory = product._doc.category || product.category;
      if (oldCategory) {
        product.categories = [oldCategory];
        await product.save();
        console.log(`Migrated product: ${product.name} (${oldCategory})`);
      }
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateCategories();

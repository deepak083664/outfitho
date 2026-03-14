const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    categories: { type: [String], required: true, default: [] },
    description: { type: String, required: true },
    materialCare: { type: String },
    shippingReturns: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    sizes: [{
      size: { type: String, required: true },
      price: { type: Number, required: true }
    }],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

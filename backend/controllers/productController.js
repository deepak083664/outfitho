const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'outfitho/products',
        transformation: [
          { width: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const NodeCache = require('node-cache');
const productCache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

// @desc    Fetch all products with optimization
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const keyword = req.query.keyword;
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 12;
    
    // Create cache key based on query params
    const cacheKey = `products_${category || 'all'}_${keyword || 'none'}_${page}_${pageSize}`;
    const cachedData = productCache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    let filter = {};
    if (category) filter.categories = category;
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .select('name price image categories countInStock brand createdAt')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })
      .lean(); // Return plain JS objects for better performance

    const response = { products, page, pages: Math.ceil(count / pageSize), total: count };
    
    productCache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      categories,
      countInStock,
      sizes,
      materialCare,
      shippingReturns
    } = req.body;

    let uploadedImages = [];
    
    // Handle multiple file uploads from multer
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
      uploadedImages = await Promise.all(uploadPromises);
    }

    const product = new Product({
      name: name || '',
      price: isNaN(Number(price)) ? 0 : Number(price),
      user: req.user._id,
      image: uploadedImages.length > 0 ? uploadedImages[0] : '/placeholder.jpg',
      images: uploadedImages.length > 0 ? uploadedImages : ['/placeholder.jpg'],
      brand: brand || 'OUTFITHO',
      categories: categories ? (typeof categories === 'string' ? JSON.parse(categories) : categories) : [],
      countInStock: isNaN(Number(countInStock)) ? 0 : Number(countInStock),
      numReviews: 0,
      description: description || 'No description provided.',
      materialCare: materialCare || '',
      shippingReturns: shippingReturns || '',
      sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [],
    });

    const createdProduct = await product.save();
    productCache.flushAll(); // Clear cache on change
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product Creation Error:', error);
    
    // Detailed validation error handling
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation failed: ' + messages.join(', '), 
        error: error.message,
        details: error.errors
      });
    }

    res.status(400).json({ 
      message: error.message || 'Invalid product data', 
      error: error.message 
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      categories,
      countInStock,
      sizes,
      materialCare,
      shippingReturns,
      existingImages // Images already on Cloudinary (sent from frontend)
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      let updatedImages = existingImages ? (typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages) : [];

      // Handle new file uploads
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const newUploadedImages = await Promise.all(uploadPromises);
        updatedImages = [...updatedImages, ...newUploadedImages];
      }

      product.name = name || product.name;
      product.price = price !== undefined ? (isNaN(Number(price)) ? product.price : Number(price)) : product.price;
      product.description = description || product.description;
      product.image = updatedImages.length > 0 ? updatedImages[0] : product.image;
      product.images = updatedImages.length > 0 ? updatedImages : product.images;
      product.brand = brand || product.brand;
      product.categories = categories ? (typeof categories === 'string' ? JSON.parse(categories) : categories) : product.categories;
      product.countInStock = countInStock !== undefined ? (isNaN(Number(countInStock)) ? product.countInStock : Number(countInStock)) : product.countInStock;
      product.materialCare = materialCare !== undefined ? materialCare : product.materialCare;
      product.shippingReturns = shippingReturns !== undefined ? shippingReturns : product.shippingReturns;
      product.sizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : product.sizes;

      const updatedProduct = await product.save();
      productCache.flushAll(); // Clear cache on change
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Product Update Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation failed: ' + messages.join(', '), 
        error: error.message 
      });
    }
    res.status(400).json({ message: error.message || 'Failed to update product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    productCache.flushAll(); // Clear cache on change
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };


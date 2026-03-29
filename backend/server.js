require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// 1. Basic Middlewares
app.use(express.json()); 
// Define explicit allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://www.outfitho.com',
  'https://outfitho.com',
  'https://outfitho-server.vercel.app'
];

// Production-ready CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Ensure no trailing slash issues in origin matching
    const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));
app.use(compression());

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/razorpay', require('./routes/razorpayRoutes'));

app.get('/', (req, res) => {
  res.send('API is running securely...');
});

// 2. Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

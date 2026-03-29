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
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',') 
  : ['*'];

app.use(cors({
  origin: function (origin, callback) {
    // Dynamically allow any origin to avoid blocked requests on Render
    callback(null, true);
  },
  credentials: true
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

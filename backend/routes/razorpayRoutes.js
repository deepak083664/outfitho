const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey
} = require('../controllers/razorpayController');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.get('/key', protect, getRazorpayKey);

module.exports = router;

const express = require('express');
const { getCoupons, createCoupon, deleteCoupon, toggleCouponStatus, validateCoupon, applyBulkDiscount } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

router.route('/:id/toggle')
  .put(protect, admin, toggleCouponStatus);

router.post('/validate', validateCoupon);
router.post('/bulk-discount', protect, admin, applyBulkDiscount);

module.exports = router;

const Coupon = require('../models/Coupon');
const Product = require('../models/Product');

// @desc    Fetch all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiresAt } = req.body;
    
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({ code, discountPercent, expiresAt });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: 'Invalid coupon data', error: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.deleteOne({ _id: coupon._id });
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle Coupon active status
// @route   PUT /api/coupons/:id/toggle
// @access  Private/Admin
const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    const expirationDate = new Date(coupon.expiresAt);
    expirationDate.setHours(23, 59, 59, 999);
    if (expirationDate < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    res.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Apply bulk discount to all products
// @route   POST /api/coupons/bulk-discount
// @access  Private/Admin
const applyBulkDiscount = async (req, res) => {
  try {
    const { discountPercent } = req.body;

    if (discountPercent === undefined || isNaN(Number(discountPercent))) {
      return res.status(400).json({ message: 'Invalid discount percentage' });
    }

    const discount = Number(discountPercent);

    // Update all products with the new discount percentage
    await Product.updateMany({}, { $set: { discount: discount } });

    res.json({ message: `Bulk discount of ${discount}% applied to all products successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { getCoupons, createCoupon, deleteCoupon, toggleCouponStatus, validateCoupon, applyBulkDiscount };

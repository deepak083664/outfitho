const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getBanners,
  getAdminBanners,
  createBanner,
  updateBannerStatus,
  deleteBanner,
} = require('../controllers/bannerController');

router.route('/').get(getBanners).post(protect, admin, upload.single('image'), createBanner);
router.route('/admin').get(protect, admin, getAdminBanners);
router.route('/:id').delete(protect, admin, deleteBanner);
router.route('/:id/status').put(protect, admin, updateBannerStatus);

module.exports = router;

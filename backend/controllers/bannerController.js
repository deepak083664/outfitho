const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Get all active banners (for frontend)
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all banners (for admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, desc } = req.body;
    let imageUrl = '';

    if (req.file) {
      // Upload image to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'banners' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Image upload failed' });
          }
          imageUrl = result.secure_url;
          
          const banner = new Banner({
            title: title || '',
            subtitle: subtitle || '',
            desc: desc || '',
            image: imageUrl,
          });

          const createdBanner = await banner.save();
          res.status(201).json(createdBanner);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      res.status(400).json({ message: 'No image file provided' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update banner status
// @route   PUT /api/banners/:id/status
// @access  Private/Admin
const updateBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.isActive = !banner.isActive;
      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      if (banner.image) {
        try {
          // Extract public_id from cloudinary url
          const urlParts = banner.image.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const folderName = urlParts[urlParts.length - 2];
          const publicId = `${folderName}/${publicIdWithExtension.split('.')[0]}`;
          
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Failed to delete image from cloudinary', err);
        }
      }
      
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getBanners,
  getAdminBanners,
  createBanner,
  updateBannerStatus,
  deleteBanner,
};

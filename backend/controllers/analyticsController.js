const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const NodeCache = require('node-cache');
const adminCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const cacheKey = 'admin_dashboard_stats';
    const cachedData = adminCache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // 1. Counters
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      Order.countDocuments({ status: { $ne: 'Cancelled' } }),
      Product.countDocuments(),
      User.countDocuments()
    ]);

    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. Daily Sales Data (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'Cancelled' }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill in gaps for days with zero sales
    const formattedDailySales = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayMatch = dailySales.find(s => s._id === dateStr);
        formattedDailySales.push({
            date: dateStr,
            label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            sales: dayMatch ? dayMatch.sales : 0
        });
    }

    // 3. Top Selling Products
    const topProductsData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalSold: { $sum: "$orderItems.qty" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 7 }
    ]);

    // 4. User Demographics (New vs Returning)
    // Definition: Returning = users with more than 1 order
    const userStats = await Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' }, user: { $exists: true } } },
        { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    const returningCount = userStats.filter(u => u.count > 1).length;
    const newCount = totalUsers - returningCount;

    const response = {
      counters: {
          totalRevenue,
          totalOrders,
          totalProducts, // Added for extra insight
          totalUsers
      },
      salesStats: {
          series: [{
              name: "Sales",
              data: formattedDailySales.map(d => d.sales)
          }],
          categories: formattedDailySales.map(d => d.label)
      },
      topProducts: {
          series: [{
              name: "Units Sold",
              data: topProductsData.map(p => p.totalSold)
          }],
          categories: topProductsData.map(p => p._id)
      },
      userDemographics: {
          series: [returningCount, Math.max(0, newCount)],
          labels: ["Returning Users", "New Users"]
      }
    };

    adminCache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnalytics };


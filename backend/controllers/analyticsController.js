const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total revenue from all non-cancelled orders
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 1. Monthly Sales Data (Last 12 months)
    const salesData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } }, 
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedSalesData = salesData.map(data => ({
      name: monthNames[data._id.month - 1],
      sales: data.sales,
      orders: data.orders
    }));

    // 2. Weekly Activity Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          orders: { $sum: 1 },
          date: { $first: "$createdAt" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedWeeklyData = weeklyData.map(data => ({
      name: dayNames[data._id - 1],
      orders: data.orders
    }));

    // Fill missing days with 0 if needed (Simple version: just return what we have)
    // To be robust, we could ensure all 7 days are present

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      salesData: formattedSalesData.length > 0 ? formattedSalesData : [{ name: monthNames[new Date().getMonth()], sales: 0, orders: 0 }],
      weeklyData: formattedWeeklyData.length > 0 ? formattedWeeklyData : dayNames.map(day => ({ name: day, orders: 0 }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnalytics };

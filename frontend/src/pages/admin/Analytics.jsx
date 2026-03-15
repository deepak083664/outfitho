import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const analyticsInfo = await analyticsService.getAnalyticsData();
      setData(analyticsInfo);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="text-black w-10 h-10" />
        </motion.div>
      </div>
    );
  }

  const { counters, salesStats, topProducts, userDemographics } = data;

  const lineChartOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Outfit, sans-serif'
    },
    stroke: { curve: 'smooth', width: 3, colors: ['#10B981'] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: salesStats.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#9CA3AF', fontSize: '12px' } }
    },
    yaxis: {
      labels: { 
        style: { colors: '#9CA3AF', fontSize: '12px' },
        formatter: (val) => `₹${(val / 1000).toFixed(0)}k`
      }
    },
    grid: { borderColor: '#F3F4FB', strokeDashArray: 4 },
    tooltip: { theme: 'dark' },
    colors: ['#10B981']
  };

  const barChartOptions = {
    chart: { toolbar: { show: false }, fontFamily: 'Outfit, sans-serif' },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        barHeight: '60%',
        distributed: true
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: topProducts.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#9CA3AF', fontSize: '12px' } }
    },
    grid: { show: false },
    legend: { show: false },
    colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF', '#F9FAFB']
  };

  const donutOptions = {
    chart: { fontFamily: 'Outfit, sans-serif' },
    labels: userDemographics.labels,
    colors: ['#3B82F6', '#E5E7EB'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Users',
              formatter: () => '12.4k'
            }
          }
        }
      }
    },
    legend: { position: 'bottom' },
    dataLabels: { enabled: false }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-10 space-y-10 bg-[#F9FAFB] min-h-screen"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Analytics</h1>
          <p className="text-gray-500 font-medium">Deep insights into your store performance</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? "Refreshing..." : "Fresh Sync"}</span>
        </button>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: `₹${(counters.totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, trend: "+12.5%", isUp: true },
          { label: "Total Orders", value: counters.totalOrders, icon: ShoppingCart, trend: "+5.2%", isUp: true },
          { label: "Total Customers", value: counters.totalUsers >= 1000 ? (counters.totalUsers / 1000).toFixed(1) + "k" : counters.totalUsers, icon: Users, trend: "+18.1%", isUp: true }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-gray-900">{stat.value}</span>
                <span className={`text-[10px] font-bold flex items-center ${stat.isUp ? "text-green-500" : "text-red-500"}`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Line Chart */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Revenue (30D)</h3>
              <p className="text-sm text-gray-500 font-medium">Daily gross sales volume</p>
            </div>
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Live Feed
            </div>
          </div>
          <Chart options={lineChartOptions} series={salesStats.series} type="area" height={300} />
        </motion.div>

        {/* Top Products Bar Chart */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900">Top Selling</h3>
            <p className="text-sm text-gray-500 font-medium">Most popular items by unit sales</p>
          </div>
          <Chart options={barChartOptions} series={topProducts.series} type="bar" height={300} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donut Chart */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900">Audience Split</h3>
            <p className="text-sm text-gray-500 font-medium">Customer retention analysis</p>
          </div>
          <Chart options={donutOptions} series={userDemographics.series} type="donut" height={250} />
        </motion.div>

        {/* Quick Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-black text-white p-8 rounded-3xl border border-black shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Performance Insight</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
              Your store is currently seeing a <span className="text-white font-bold">24% spike</span> in mobile traffic. We recommend optimizing your summer collection assets for faster mobile loading to capitalize on this trend.
            </p>
            <button className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center space-x-2 active:scale-95">
              <span>View Full Report</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <TrendingUp size={160} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;

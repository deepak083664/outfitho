import React, { useState, useEffect, useCallback } from 'react';
import { Package, ShoppingCart, Users, IndianRupee, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import api from '../../services/api';
import { toast } from 'react-toastify';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="w-12 h-4 bg-gray-100 rounded"></div>
    </div>
    <div className="w-24 h-4 bg-gray-100 rounded mb-2"></div>
    <div className="w-32 h-8 bg-gray-200 rounded"></div>
  </div>
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Dashboard Data Fetch Error:', error);
      setError('Failed to load dashboard data. Please check your connection.');
      toast.error('Dashboard sync failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, retryCount]);

  if (loading && !analytics) {
    return (
      <div className="space-y-8 pb-12">
        <div className="px-1 md:px-0">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-white rounded-xl border border-gray-100 animate-pulse"></div>
          <div className="h-[400px] bg-white rounded-xl border border-gray-100 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-2xl border border-dashed border-gray-200 p-12">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sync Error</h2>
        <p className="text-gray-500 text-center max-w-xs mb-8">{error}</p>
        <button 
          onClick={() => setRetryCount(prev => prev + 1)}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold active:scale-95"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Retrying...' : 'Try Again'}</span>
        </button>
      </div>
    );
  }

  const { 
    totalRevenue = 0, 
    totalOrders = 0, 
    totalProducts = 0, 
    totalUsers = 0, 
    salesData = [], 
    weeklyData = [] 
  } = analytics || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="px-1 md:px-0 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 tracking-tight">Store Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time performance metrics for your brand.</p>
        </div>
        <button 
          onClick={() => setRetryCount(prev => prev + 1)}
          className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
          title="Refresh Data"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} trend="up" trendValue="+12.5%" />
        <StatCard title="Total Orders" value={totalOrders.toLocaleString()} icon={ShoppingCart} trend="up" trendValue="+5.2%" />
        <StatCard title="Store Products" value={totalProducts.toLocaleString()} icon={Package} trend="neutral" trendValue="0.0%" />
        <StatCard title="Active Customers" value={totalUsers.toLocaleString()} icon={Users} trend="up" trendValue="+18.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analysis</h3>
              <p className="text-sm text-gray-500">Gross sales volume by month</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} tickFormatter={(v) => `₹${v >= 1000 ? v/1000 + 'k' : v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Orders</h3>
            <p className="text-sm text-gray-500">Sales velocity over 7 days</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="orders" fill="#000" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

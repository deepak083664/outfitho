import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, IndianRupee, Loader2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import api from '../../services/api';
import { toast } from 'react-toastify';

// No longer using hardcoded placeholder data for active charts

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/analytics');
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-gray-500 font-medium">Gathering Store Insights...</p>
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
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="px-1 md:px-0 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 tracking-tight">Store Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your brand.</p>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} trend="up" trendValue="+12.5%" />
        <StatCard title="Total Orders" value={totalOrders.toLocaleString()} icon={ShoppingCart} trend="up" trendValue="+5.2%" />
        <StatCard title="Store Products" value={totalProducts.toLocaleString()} icon={Package} trend="neutral" trendValue="0.0%" />
        <StatCard title="Active Customers" value={totalUsers.toLocaleString()} icon={Users} trend="up" trendValue="+18.1%" />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Over Time</h3>
              <p className="text-sm text-gray-500 text-xs md:text-sm">Monthly gross sales volume</p>
            </div>
            <select className="text-xs md:text-sm border-gray-200 rounded-md bg-gray-50 px-3 py-1.5 focus:ring-black focus:border-black outline-none cursor-pointer w-full sm:w-auto">
              <option>This Year</option>
              <option>Last 6 Months</option>
              <option>All Time</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{stroke: '#111827', strokeWidth: 1, strokeDasharray: '4 4'}}
                  contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: '8px', border: 'none', padding: '8px 12px' }}
                  itemStyle={{ color: '#fff', fontWeight: '500' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#111827" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Orders Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
            <p className="text-sm text-gray-500 text-xs md:text-sm">Orders placed per day</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="orders" fill="#111827" radius={[4, 4, 0, 0]} maxBarSize={40}>
                   {weeklyData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={index === weeklyData.length - 1 ? '#111827' : '#9CA3AF'} /> // highlight last bar
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Ticket } from 'lucide-react';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';

const Coupons = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ code: '', discountPercent: '', expiresAt: '' });
  const [bulkDiscount, setBulkDiscount] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setData(res.data.map(c => ({
        ...c,
        discount: c.discountPercent,
        expiryFormatted: c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'No Limit',
        status: new Date(c.expiresAt) < new Date() ? 'Expired' : (c.isActive ? 'Active' : 'Disabled')
      })));
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent || !formData.expiresAt) return;

    try {
      setIsSubmitting(true);
      const { data: newCoupon } = await api.post('/coupons', {
        code: formData.code.toUpperCase(),
        discountPercent: Number(formData.discountPercent),
        expiresAt: formData.expiresAt
      });
      
      const formattedNew = {
        ...newCoupon,
        discount: newCoupon.discountPercent,
        expiryFormatted: new Date(newCoupon.expiresAt).toLocaleDateString(),
        status: 'Active'
      };

      setData([...data, formattedNew]);
      setFormData({ code: '', discountPercent: '', expiresAt: '' });
      toast.success('Discount created');
    } catch (err) {
       toast.error(err.response?.data?.message || 'Failed to add discount');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCoupon = async (id) => {
    if(window.confirm('Delete this promo code permanently?')) {
      try {
        await api.delete(`/coupons/${id}`);
        setData(prev => prev.filter(c => c._id !== id));
        toast.success('Promo code deleted');
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleApplyBulkDiscount = async (e) => {
    e.preventDefault();
    if (bulkDiscount === '' || isNaN(Number(bulkDiscount))) return;

    if (!window.confirm(`This will apply a ${bulkDiscount}% discount to ALL products in your catalog. Proceed?`)) return;

    try {
      setIsBulkSubmitting(true);
      const { data } = await api.post('/coupons/bulk-discount', { discountPercent: bulkDiscount });
      toast.success(data.message);
      setBulkDiscount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply bulk discount');
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Promo Code', 
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
            <Ticket size={16} />
          </div>
          <span className="font-bold font-mono tracking-wider text-gray-900 border border-gray-200 px-2 py-1 rounded bg-gray-50">{row.code}</span>
        </div>
      )
    },
    { 
      header: 'Discount', 
      accessor: 'discount',
      render: (row) => <span className="font-semibold text-emerald-600">{row.discount}% OFF</span>
    },
    { 
      header: 'Valid Until', 
      accessor: 'expiryFormatted',
      render: (row) => <span className="text-gray-600 font-medium">{row.expiryFormatted}</span>
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: '', 
      render: (row) => (
        <button 
          onClick={() => deleteCoupon(row._id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto block"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Discounts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage promotional codes to drive sales.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side - Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
             <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Discount</h3>
             <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Promo Code</label>
                  <input 
                    type="text" 
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow uppercase font-mono"
                    placeholder="e.g. VIP20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({...formData, discountPercent: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="e.g. 20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center mt-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} className="mr-2" /> Activate Discount</>}
                </button>
             </form>
          </div>

          {/* Bulk Discount Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8 sticky top-[480px]">
             <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Discount</h3>
             <p className="text-xs text-gray-500 mb-6 font-medium">Apply a global discount percentage to all products (e.g., for festivals).</p>
             
             <form onSubmit={handleApplyBulkDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site-wide Discount (%)</label>
                  <div className="relative">
                     <input 
                       type="number" 
                       required
                       min="0"
                       max="100"
                       value={bulkDiscount}
                       onChange={(e) => setBulkDiscount(e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                       placeholder="e.g. 15"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isBulkSubmitting}
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center"
                >
                  {isBulkSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Apply to All Products'}
                </button>
                <p className="text-[10px] text-gray-400 text-center font-medium">Note: This overwrites individual product discounts.</p>
             </form>
          </div>
        </div>

        {/* Right Side - Table */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Loader2 className="animate-spin text-black" size={32} />
            </div>
          ) : (
            <ModernTable columns={columns} data={data} emptyMessage="No active discounts." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;

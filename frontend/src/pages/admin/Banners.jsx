import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';

const Banners = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/banners/admin');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error('Please select an image for the banner');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('subtitle', newSubtitle);
      formData.append('desc', newDesc);
      formData.append('image', newImage);

      const { data: newBanner } = await api.post('/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setData([newBanner, ...data]);
      setNewTitle('');
      setNewSubtitle('');
      setNewDesc('');
      setNewImage(null);
      // Reset file input
      document.getElementById('bannerImage').value = '';
      toast.success('Banner created successfully');
    } catch (err) {
       toast.error(err.response?.data?.message || 'Failed to add banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBanner = async (id) => {
    if(window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.delete(`/banners/${id}`);
        setData(prev => prev.filter(banner => banner._id !== id));
        toast.success('Banner removed');
      } catch (err) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(`/banners/${id}/status`);
      setData(prev => prev.map(banner => banner._id === id ? res.data : banner));
      toast.success('Banner status updated');
    } catch (err) {
      toast.error('Failed to update banner status');
    }
  };

  const columns = [
    { 
      header: 'Banner', 
      render: (row) => (
        <div className="flex items-center space-x-4">
          <div className="h-16 w-24 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
            <img src={row.image} alt={row.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.title || 'No Title'}</p>
            <p className="text-xs text-gray-500 line-clamp-1">{row.subtitle || 'No Subtitle'}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <button 
          onClick={() => toggleStatus(row._id)}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
            row.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {row.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {row.isActive ? 'Active' : 'Hidden'}
        </button>
      )
    },
    { 
      header: '', 
      render: (row) => (
        <button 
          onClick={() => deleteBanner(row._id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto block"
          title="Delete Banner"
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Homepage Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the hero slider banners on your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
             <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-gray-500" />
                Upload New Banner
             </h3>
             <form onSubmit={handleAddBanner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Image *</label>
                  <input 
                    type="file" 
                    id="bannerImage"
                    accept="image/*"
                    required
                    onChange={(e) => setNewImage(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="e.g. SUMMER SALE"
                  />
                  <p className="text-xs text-gray-400 mt-1">Use &lt;br /&gt; for line breaks if needed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                  <input 
                    type="text" 
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="e.g. Up to 50% Off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="Brief description..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center mt-6"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} className="mr-2" /> Upload Banner</>}
                </button>
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
            <ModernTable columns={columns} data={data} emptyMessage="No banners uploaded yet." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Banners;

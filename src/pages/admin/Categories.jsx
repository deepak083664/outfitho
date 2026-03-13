import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, LayoutGrid } from 'lucide-react';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setData(res.data.map(cat => ({
        ...cat,
        productsCount: Math.floor(Math.random() * 50) + 10 // Placeholder until Product aggregation exists
      })));
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;

    try {
      setIsSubmitting(true);
      const { data: newCategory } = await api.post('/categories', { name: newCat });
      setData([...data, { ...newCategory, productsCount: 0 }]);
      setNewCat('');
      toast.success('Category created');
    } catch (err) {
       toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
    if(window.confirm('Delete this category? Products inside it will NOT be deleted.')) {
      try {
        await api.delete(`/categories/${id}`);
        setData(prev => prev.filter(cat => cat._id !== id));
        toast.success('Category removed');
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  const columns = [
    { 
      header: 'Category Details', 
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
            <LayoutGrid size={18} />
          </div>
          <span className="font-semibold text-gray-900">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Products', 
      accessor: 'productsCount',
      render: (row) => <span className="text-gray-500">{row.productsCount} Items</span>
    },
    { 
      header: '', 
      render: (row) => (
        <button 
          onClick={() => deleteCategory(row._id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto block"
          title="Delete Category"
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your products into categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
             <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Collection</h3>
             <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                    placeholder="e.g. Summer Essentials"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} className="mr-2" /> Add Collection</>}
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
            <ModernTable columns={columns} data={data} emptyMessage="No collections found." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;

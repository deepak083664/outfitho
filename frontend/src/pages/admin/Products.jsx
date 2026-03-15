import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, PackageX } from 'lucide-react';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';

const TableSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="bg-gray-50 h-14 border-b border-gray-200"></div>
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex h-20 border-b border-gray-100 items-center px-6 space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-1/3"></div>
          <div className="h-3 bg-gray-50 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get('pageNumber') || 1;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products?pageNumber=${pageNumber}&pageSize=10`);
      setData(res.data.products || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (error) {
      setError('Unable to fetch product catalog.');
      toast.error('Sync failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProduct = async (id) => {
    if (window.confirm('Permanently delete this product from your inventory?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        // Re-fetch to ensure total count and pagination are correct
        fetchProducts();
      } catch (error) {
        toast.error('Delete operation failed');
      }
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'Product Details', 
      accessor: 'name',
      className: 'w-2/5',
      render: (row) => (
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 ring-4 ring-gray-50/50">
            <img 
              src={row.image} 
              alt={row.name} 
              className="h-full w-full object-cover transition-all group-hover:scale-110" 
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 group-hover:text-black transition-colors truncate">{row.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-black uppercase tracking-widest">{row.brand || 'OUTFITHO'}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Categories', 
      accessor: 'categories',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.categories && row.categories.length > 0 ? (
            row.categories.map((cat, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-600 border border-gray-200">
                {cat}
              </span>
            ))
          ) : (
            <span className="text-gray-400 italic text-[10px]">No Category</span>
          )}
        </div>
      )
    },
    { 
      header: 'Price', 
      accessor: 'price',
      render: (row) => <span className="font-black text-gray-900">₹{row.price.toLocaleString()}</span>
    },
    { 
      header: 'Stock Status', 
      accessor: 'countInStock',
      render: (row) => {
        const stock = row.countInStock || 0;
        return (
          <div className="flex items-center space-x-2.5">
            <div className={`h-2.5 w-2.5 rounded-full ring-4 ${stock > 10 ? 'bg-green-500 ring-green-50/50' : stock > 0 ? 'bg-orange-400 ring-orange-50/50' : 'bg-red-500 ring-red-50/50'}`}></div>
            <span className={`text-xs font-bold ${stock > 0 ? 'text-gray-700' : 'text-red-600 antialiased italic'}`}>{stock > 0 ? `${stock} available` : 'Out of Stock'}</span>
          </div>
        );
      }
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex items-center justify-end space-x-1">
          <Link to={`/admin/products/edit/${row._id}`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all">
            <Edit size={16} />
          </Link>
          <button 
            onClick={() => removeProduct(row._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [fetchProducts]);

  const handlePageChange = (newPage) => {
    setSearchParams({ pageNumber: newPage });
  };

  if (error && !data.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Inventory Sync Error</h2>
        <p className="text-gray-500 max-w-xs mb-8">We couldn't connect to the product database. Check your internet connection.</p>
        <button 
          onClick={fetchProducts}
          className="flex items-center space-x-2 bg-black text-white px-8 py-3.5 rounded-2xl hover:bg-gray-800 transition-all font-bold active:scale-95 shadow-xl shadow-black/10"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Retry Sync</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="px-1 md:px-0">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Found {total} unique items in your store collection.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
           <button 
            onClick={fetchProducts}
            className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-black rounded-xl transition-all hover:border-gray-300"
            title="Refresh List"
           >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
           <Link to="/admin/products/add" className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center shadow-xl shadow-black/10 transition-all active:scale-95">
             <Plus size={18} className="mr-2" />
             Add Product
           </Link>
        </div>
      </div>

      {loading && !data.length ? (
        <TableSkeleton />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <PackageX size={40} className="text-gray-300" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Yet</h3>
           <p className="text-gray-500 max-w-xs mb-8">Start building your catalog by adding your first product to the store.</p>
           <Link to="/admin/products/add" className="bg-black text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center">
             <Plus size={18} className="mr-2" /> Create First Product
           </Link>
        </div>
      ) : (
        <>
          <ModernTable columns={columns} data={data} emptyMessage="No products match your criteria." />
          
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-12">
              <button 
                onClick={() => handlePageChange(Number(pageNumber) - 1)}
                disabled={Number(pageNumber) === 1}
                className="w-12 h-12 rounded-xl border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center space-x-1.5 px-4 h-12 bg-gray-50/50 border border-gray-100 rounded-2xl">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`min-w-[36px] h-9 rounded-xl text-xs font-black transition-all ${
                      Number(pageNumber) === (i + 1) 
                      ? 'bg-black text-white shadow-lg scale-105' 
                      : 'text-gray-400 hover:text-black hover:bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(Number(pageNumber) + 1)}
                disabled={Number(pageNumber) === pages}
                className="w-12 h-12 rounded-xl border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(Products);


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get('pageNumber') || 1;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?pageNumber=${pageNumber}`);
      setData(res.data.products);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Unable to load products.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async (id) => {
    if (window.confirm('permanently delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setData(prev => prev.filter(p => p._id !== id));
        toast.success('Product removed permanently.');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'Product Info', 
      accessor: 'name',
      className: 'w-1/3',
      render: (row) => (
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
            {/* Lazy loaded image with Cloudinary optimization already in the URL from backend */}
            <img 
              src={row.image} 
              alt={row.name} 
              className="h-full w-full object-cover transition-transform hover:scale-110" 
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-black transition-colors">{row.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">ID: {row._id.slice(-8)}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium text-gray-600 border border-gray-200">{row.category}</span>
    },
    { 
      header: 'Price', 
      accessor: 'price',
      render: (row) => <span className="font-semibold text-gray-900">₹{row.price.toLocaleString()}</span>
    },
    { 
      header: 'Inventory', 
      accessor: 'countInStock',
      render: (row) => {
        const stock = row.countInStock || 0;
        return (
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-orange-400' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">{stock} in stock</span>
          </div>
        );
      }
    },
    { 
      header: '', 
      render: (row) => (
        <div className="flex items-center justify-end space-x-2 transition-opacity">
          <Link to={`/admin/products/edit/${row._id}`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
            <Edit size={16} />
          </Link>
          <button 
            onClick={() => deleteProduct(row._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], []);

  const handlePageChange = (newPage) => {
    setSearchParams({ pageNumber: newPage });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage {total} products in your inventory.</p>
        </div>
        <Link to="/admin/products/add" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors">
          <Plus size={16} className="mr-2" />
          Add Product
        </Link>
      </div>

      {/* Optimized Layout without search as requested earlier */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="text-sm text-gray-500 font-medium">
          Showing {data.length} items of {total}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-gray-500 font-medium animate-pulse">Loading optimized product data...</p>
        </div>
      ) : (
        <>
          <ModernTable columns={columns} data={data} emptyMessage="No products found." />
          
          {/* Simple Pagination Control */}
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button 
                onClick={() => handlePageChange(Number(pageNumber) - 1)}
                disabled={Number(pageNumber) === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all ${
                    Number(pageNumber) === (i + 1) 
                    ? 'bg-black text-white border-black shadow-md scale-110' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(Number(pageNumber) + 1)}
                disabled={Number(pageNumber) === pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
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

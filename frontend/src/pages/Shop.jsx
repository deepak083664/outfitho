import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Grid, List, ArrowDownWideNarrow, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { ProductSkeleton as LoadingSkeleton } from '../components/LoadingSkeleton';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('grid');
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const searchKeyword = searchParams.get('keyword');
  const pageNumber = searchParams.get('pageNumber') || 1;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/products?pageNumber=${pageNumber}`;
      if (activeCategory) url += `&category=${activeCategory}`;
      if (searchKeyword) url += `&keyword=${searchKeyword}`;
      
      const { data } = await api.get(url);
      
      console.log('Shop API Response:', data);
      
      // The API now returns { products, page, pages, total }
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
      
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchKeyword, pageNumber]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageNumber', newPage);
    setSearchParams(params);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Info - More Compact */}
      <div className="bg-surface py-5 lg:py-10 border-b border-border">
         <div className="container mx-auto px-4 lg:px-20">
            <div className="flex items-center space-x-2 text-[9px] uppercase font-black text-light tracking-[0.3em] mb-2">
              <span className="hover:text-dark cursor-pointer transition-colors">Home</span>
              <span>/</span>
              <span className="text-dark">Clothing</span>
            </div>
            <h1 className="text-xl lg:text-4xl font-black text-dark uppercase tracking-tight leading-tight">
               {searchKeyword ? `Search: ${searchKeyword}` : (activeCategory || 'Latest Collections')} <span className="text-secondary opacity-30 font-medium ml-1 lg:ml-2">- {total} Items</span>
            </h1>
         </div>
      </div>

      {/* Control Bar - Slim & Clean */}
      <div className="sticky top-[40px] lg:top-[48px] bg-white/95 backdrop-blur-md z-40 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-20 flex items-center justify-between py-2">
          
          <div></div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-[9px] font-black text-secondary uppercase tracking-[0.2em] space-x-4">
              <span>Sort By :</span>
              <div className="relative group flex items-center cursor-pointer text-dark hover:text-primary transition-colors">
                 <span>Newest</span>
                 <ChevronDown size={12} className="ml-1 group-hover:rotate-180 transition-transform" />
              </div>
            </div>
            
            <div className="flex items-center p-0.5 bg-surface rounded-md">
               <button 
                onClick={() => setViewType('grid')}
                className={`p-1.5 rounded-md transition-all ${viewType === 'grid' ? 'bg-white shadow-xs text-dark' : 'text-light'}`}
               >
                 <Grid size={16} />
               </button>
               <button 
                onClick={() => setViewType('list')}
                className={`p-1.5 rounded-md transition-all ${viewType === 'list' ? 'bg-white shadow-xs text-dark' : 'text-light'}`}
               >
                 <List size={16} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-20 py-10 flex gap-12">
        
        {/* No Sidebar */}

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
              {[...Array(8)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={`grid gap-4 lg:gap-x-8 lg:gap-y-12 ${viewType === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} viewType={viewType} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-16 pb-10">
                   <button 
                    onClick={() => handlePageChange(Number(pageNumber) - 1)}
                    disabled={Number(pageNumber) === 1}
                    className="w-10 h-10 rounded-full border border-surface flex items-center justify-center disabled:opacity-30 hover:bg-dark hover:text-white transition-all shadow-sm"
                   >
                     <ChevronLeft size={18} />
                   </button>
                   
                   {[...Array(pages)].map((_, i) => (
                     <button
                       key={i + 1}
                       onClick={() => handlePageChange(i + 1)}
                       className={`w-10 h-10 rounded-full text-xs font-black transition-all ${
                         Number(pageNumber) === (i + 1) 
                         ? 'bg-dark text-white scale-110 shadow-lg' 
                         : 'bg-surface text-secondary hover:bg-dark hover:text-white'
                       }`}
                     >
                       {i + 1}
                     </button>
                   ))}

                   <button 
                    onClick={() => handlePageChange(Number(pageNumber) + 1)}
                    disabled={Number(pageNumber) === pages}
                    className="w-10 h-10 rounded-full border border-surface flex items-center justify-center disabled:opacity-30 hover:bg-dark hover:text-white transition-all shadow-sm"
                   >
                     <ChevronRight size={18} />
                   </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
                  <X size={40} className="text-light opacity-30" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter text-dark mb-2">No Products Ready</h3>
               <p className="text-secondary text-sm max-w-xs font-medium opacity-70">We're currently updating our catalog. Please check back shortly for new arrivals.</p>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default Shop;

import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, X, ChevronDown, Grid, List, SlidersHorizontal, ArrowDownWideNarrow, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { ProductSkeleton as LoadingSkeleton } from '../components/LoadingSkeleton';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('grid');
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const pageNumber = searchParams.get('pageNumber') || 1;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = activeCategory 
        ? `/products?category=${activeCategory}&pageNumber=${pageNumber}` 
        : `/products?pageNumber=${pageNumber}`;
      
      const { data } = await api.get(url);
      
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
  }, [activeCategory, pageNumber]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isFilterOpen]);

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
               {activeCategory || 'Latest Collections'} <span className="text-secondary opacity-30 font-medium ml-1 lg:ml-2">- {total} Items</span>
            </h1>
         </div>
      </div>

      {/* Control Bar - Slim & Clean */}
      <div className="sticky top-[40px] lg:top-[48px] bg-white/95 backdrop-blur-md z-40 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-20 flex items-center justify-between py-2">
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest bg-dark text-white px-4 py-2 rounded-lg active:scale-95 transition-all"
            >
              <SlidersHorizontal size={12} />
              <span>Filters</span>
            </button>

            <div className="hidden lg:flex items-center text-[10px] font-black uppercase tracking-widest text-dark py-2 border-primary mr-4">
              <Filter size={14} className="mr-2" /> Filters
            </div>
          </div>

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
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-12">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-light">Categories</h3>
            <div className="space-y-4">
              {['T-Shirts', 'Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Dresses'].map((cat) => (
                <label key={cat} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-3">
                     <input type="checkbox" className="w-4 h-4 accent-dark rounded border-border" />
                     <span className="text-sm font-bold text-secondary group-hover:text-dark transition-colors">{cat}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-border">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-light">Price Range</h3>
            <div className="space-y-4">
               {['Below Rs. 499', 'Rs. 500 to Rs. 999', 'Rs. 1000 to Rs. 1999', 'Over Rs. 2000'].map((range) => (
                 <label key={range} className="flex items-center space-x-3 cursor-pointer group">
                   <div className="w-4 h-4 rounded-full border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                   </div>
                   <span className="text-sm font-bold text-secondary group-hover:text-dark transition-colors">{range}</span>
                 </label>
               ))}
            </div>
          </div>

          <div className="p-6 bg-surface rounded-2xl relative overflow-hidden group cursor-pointer">
             <div className="relative z-10">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-2">FLAT 50% OFF</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Limited Edition Drop</p>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                   Shop Exclusive <ChevronRight size={14} className="ml-1" />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
          </div>
        </aside>

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

      {/* Modern Filter Drawer */}
      <div className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-500 ${isFilterOpen ? 'visible' : 'invisible'}`}>
         {/* Overlay */}
         <div className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFilterOpen(false)}></div>
         
         {/* Footer Sheet */}
         <div 
          className={`absolute bottom-0 inset-x-0 bg-white rounded-t-3xl max-h-[90vh] flex flex-col transition-transform duration-500 ease-out ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
         >
            <div className="p-6 flex justify-between items-center border-b border-surface shrink-0">
              <div className="flex items-center space-x-3">
                 <h2 className="text-lg font-black uppercase tracking-widest text-dark underline decoration-primary decoration-4 underline-offset-8">Filters</h2>
                 <span className="text-[10px] font-black text-light uppercase tracking-widest mt-2">{products.length} Items Found</span>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-dark hover:scale-110 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar pb-32">
               <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-light mb-6">Refine By</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Popularity', 'Newest', 'Price: High-Low', 'Price: Low-High'].map((sort) => (
                      <button key={sort} className="px-4 py-3 border-2 border-surface rounded-xl text-xs font-bold text-secondary hover:border-dark hover:text-dark transition-all text-left flex justify-between items-center group">
                        {sort}
                        <div className="w-2 h-2 rounded-full border-2 border-border group-hover:bg-primary group-hover:border-primary"></div>
                      </button>
                    ))}
                  </div>
               </section>

               <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-light mb-6">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {['T-Shirts', 'Shirts', 'Jeans', 'Jackets', 'Dresses', 'Accessories'].map((cat) => (
                      <button key={cat} className="px-5 py-2.5 bg-surface rounded-full text-xs font-black uppercase tracking-widest text-secondary hover:bg-dark hover:text-white transition-all shadow-sm">
                        {cat}
                      </button>
                    ))}
                  </div>
               </section>

               <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-light mb-6">Size Selection</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                      <button key={size} className="aspect-square flex items-center justify-center border-2 border-surface rounded-xl text-xs font-black text-dark hover:border-primary hover:text-primary transition-all">
                        {size}
                      </button>
                    ))}
                  </div>
               </section>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full btn-primary !rounded-2xl !py-5 shadow-2xl animate-pulse font-black tracking-[0.3em] text-xs"
              >
                APPLY SELECTIONS
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Shop;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Heart, Star, ChevronRight, Share2, Sparkles, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlistItems: items, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const removeItem = (id) => {
    toggleWishlist({ _id: id });
    toast.info('Removed from favorites');
  };

  const moveToBag = (id) => {
    toast.success('Analyzing availability... Moved to bag!');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center mb-10 shadow-inner">
           <Heart size={56} className="text-light opacity-60" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Lonely Favorites</h2>
        <p className="text-secondary mb-12 max-w-sm mx-auto text-sm font-medium opacity-80 decoration-primary decoration-2">
          Your curated list is currently empty. <br className="hidden sm:block" /> Start exploring the latest drops to fill it up.
        </p>
        <Link to="/shop" className="btn-primary !rounded-full !px-16 !py-5 shadow-2xl hover:shadow-primary/40 active:scale-95 transition-all flex items-center space-x-3 group">
          <span className="font-black tracking-[0.2em] text-xs">EXPLORE COLLECTION</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 lg:py-20">
      <div className="container mx-auto px-4 lg:px-20 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-24 gap-8">
           <div className="space-y-4">
              <div className="flex items-center space-x-3">
                 <Heart size={20} className="text-primary animate-pulse" fill="currentColor" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-light">Curated Selection</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-dark leading-none">
                 My Favorites <span className="text-secondary opacity-30 font-medium ml-2">- {items.length} items</span>
              </h1>
           </div>
           
           <div className="flex items-center space-x-6">
              <button className="p-3 bg-surface hover:bg-dark hover:text-white rounded-full transition-all group active:scale-90">
                 <Share2 size={20} className="group-hover:scale-110" />
              </button>
              <Link to="/cart" className="flex items-center space-x-4 bg-dark text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl active:scale-95 group">
                 <ShoppingCart size={16} className="group-hover:rotate-12 transition-transform" />
                 <span>GO TO BAG</span>
              </Link>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
          {items.map((product) => (
            <div key={product._id} className="group relative transition-all duration-700">
              
              {/* Product Card Container */}
              <div className="relative aspect-[3/4] bg-surface rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] group-hover:-translate-y-4 transition-all duration-700">
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </Link>
                
                {/* Remove Icon */}
                <button 
                  onClick={() => removeItem(product._id)}
                  className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl text-secondary hover:text-red-500 transition-all z-10 active:scale-75 group/remove"
                >
                  <X size={18} className="group-hover/remove:rotate-90 transition-transform" />
                </button>

                {/* Rating Badge */}
                <div className="absolute top-6 left-6 flex items-center bg-dark text-white px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/10 shadow-2xl">
                   {product.rating} <Star size={10} fill="currentColor" className="ml-1.5 text-primary" />
                </div>

                {/* Quick Add Button - Desktop Only */}
                <div className="absolute bottom-8 inset-x-8 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                   <button 
                     onClick={() => moveToBag(product._id)}
                     className="w-full py-4 bg-white text-dark rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                   >
                     <ShoppingBag size={14} strokeWidth={3} />
                     <span>ADD TO BAG</span>
                   </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-8 px-2 space-y-3">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase text-secondary tracking-[0.3em] flex items-center">
                         {product.brand} <Sparkles size={10} className="ml-2 text-primary opacity-40" />
                      </h3>
                      <p className="text-lg text-dark font-black tracking-tighter uppercase leading-tight line-clamp-1">{product.name}</p>
                   </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-black text-dark tracking-tighter">Rs. {product.price}</span>
                  <span className="text-sm text-light line-through font-medium opacity-60">Rs. {product.mrp}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest">{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF</span>
                </div>

                <div className="md:hidden pt-4">
                   <button 
                     onClick={() => moveToBag(product._id)}
                     className="w-full py-3.5 bg-surface border-2 border-transparent hover:border-dark text-dark rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all active:scale-95"
                   >
                     <ShoppingBag size={14} strokeWidth={3} />
                     <span>MOVE TO BAG</span>
                   </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;

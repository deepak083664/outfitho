import React, { useState } from 'react';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// PREMIUM WISHLIST BUTTON
export const WishlistButton = ({ product, className = "" }) => {
  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = product?._id ? isInWishlist(product._id) : false;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Direct toggle for Guest Flow
    toggleWishlist(product);
  };

  return (
    <button 
      onClick={handleToggle}
      className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md active:scale-75
        ${isWishlisted 
          ? 'bg-primary text-white scale-110' 
          : 'bg-white/90 text-dark hover:bg-white hover:scale-110'
        } ${className}`}
    >
      <Heart 
        size={14} 
        className={`${isWishlisted ? 'fill-current' : ''}`} 
        strokeWidth={isWishlisted ? 0 : 2.5}
      />
    </button>
  );
};

// PREMIUM ADD TO CART BUTTON
export const AddToCartButton = ({ product, className = "" }) => {
  const { requireAuth } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      if (!product || !product._id) {
        throw new Error('Invalid product');
      }
      // Direct add for Guest Flow
      addToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      className={`relative group overflow-hidden !rounded-xl !py-1.5 lg:!py-2 w-full flex items-center justify-center space-x-2 transition-all duration-300 shadow-sm active:scale-[0.98] active:bg-[#333333] active:text-white
        ${loading 
          ? 'bg-gray-200 text-gray-400' 
          : 'bg-surface text-dark hover:bg-gray-200'
        } ${className}`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
      
      {loading ? (
        <Loader2 className="animate-spin" size={14} />
      ) : (
        <>
          <ShoppingBag size={14} strokeWidth={2.5} />
          <span className="font-bold text-[9px] uppercase tracking-[0.1em]">
            Add to Bag
          </span>
        </>
      )}
    </button>
  );
};

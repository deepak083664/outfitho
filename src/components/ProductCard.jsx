import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isWishlisted = isInWishlist(product._id);

  const images = product.images && product.images.length > 0 ? product.images : [product.image || '/placeholder-product.jpg'];
  const discount = product.discount || 30;
  const originalPrice = Math.round(product.price * (1 + discount / 100));

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-surface/50">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Link to={`/product/${product._id}`}>
          <img 
            src={images[currentImageIndex]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Image Navigation Arrows - Hidden by default, show on hover */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button 
              onClick={prevImage}
              className="p-1.5 rounded-full bg-white/80 backdrop-blur-md text-dark shadow-md hover:bg-white transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={16} strokeWidth={3} />
            </button>
            <button 
              onClick={nextImage}
              className="p-1.5 rounded-full bg-white/80 backdrop-blur-md text-dark shadow-md hover:bg-white transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Index Dots */}
        {images.length > 1 && (
           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60'}`}
                ></div>
              ))}
           </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md 
            ${isWishlisted 
              ? 'bg-primary text-white opacity-100 scale-100' 
              : 'bg-white/90 text-dark opacity-100 lg:opacity-0 group-hover:opacity-100 lg:translate-y-[-5px] group-hover:translate-y-0'
            }
            active:scale-75
          `}
        >
          <Heart 
            size={14} 
            className={`${isWishlisted ? 'fill-current' : ''}`} 
            strokeWidth={isWishlisted ? 0 : 2.5}
          />
        </button>

        {/* Add to Cart - Slide up on hover */}
        <div className="absolute inset-x-2 bottom-2 lg:translate-y-4 opacity-100 lg:opacity-0 lg:group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
           <button 
             onClick={handleAddToCart}
             className={`w-full py-2 rounded-lg font-black text-[9px] uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-95 ${
               isAdded 
               ? 'bg-secondary text-white' 
               : 'bg-white/95 text-dark hover:bg-dark hover:text-white'
             }`}
           >
              <ShoppingBag size={12} strokeWidth={2.5} />
              <span className="hidden sm:inline">{isAdded ? 'Added to Bag' : 'Add to Bag'}</span>
              <span className="sm:hidden">{isAdded ? 'Added' : 'Add'}</span>
           </button>
        </div>

        {/* Discount Badge */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center space-x-1.5 group-hover:opacity-0 transition-opacity duration-300">
           {discount > 0 && (
              <span className="bg-primary/95 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                {discount}% OFF
              </span>
           )}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-2 lg:p-2.5 space-y-0.5">
        <h3 className="text-[8px] font-black uppercase text-light tracking-widest opacity-70">
          {product.brand || 'OUTFITHO'}
        </h3>
        <Link to={`/product/${product._id}`}>
          <h2 className="text-[11px] lg:text-xs font-bold text-dark truncate hover:text-primary transition-colors cursor-pointer leading-tight">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-center space-x-2 pt-0.5">
          <span className="text-xs font-black text-dark">₹{product.price}</span>
          {originalPrice > product.price && (
            <span className="text-[9px] text-light line-through opacity-50 font-medium">₹{originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);

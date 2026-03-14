import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Ruler, ChevronRight, ChevronDown, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [expandedSection, setExpandedSection] = useState('description');
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].size);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, 1, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image || '/placeholder-product.jpg'];
  const discount = product.discount || Math.round(((product.mrp - product.price) / product.mrp) * 100) || 0;

  return (
    <div className="bg-white min-h-screen pb-32 lg:pb-20">
      {/* Header Navigation */}
      <div className="container mx-auto px-4 lg:px-20 py-4 lg:py-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-light">
             <Link to="/" className="hover:text-dark transition-colors">Home</Link>
             <ChevronRight size={10} />
             <Link to="/shop" className="hover:text-dark transition-colors">Clothing</Link>
             <ChevronRight size={10} className="hidden sm:block" />
             <span className="text-dark hidden sm:block truncate max-w-[150px]">{product.name}</span>
           </div>
           
           <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-bold tracking-widest text-dark hover:text-primary transition-colors">
              <ArrowLeft size={14} className="mr-2" /> Back
           </button>
        </div>
      </div>

      <div className="container mx-auto lg:px-20">
        <div className="flex flex-col lg:flex-row lg:gap-20">
          
          {/* Left: Gallery Section */}
          <div className="w-full lg:w-[55%] flex flex-col-reverse lg:flex-row gap-4">
            {/* Desktop Thumbnails */}
            <div className="hidden lg:flex flex-col gap-4 w-20 shrink-0">
               {images.map((img, idx) => (
                 <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${activeImage === idx ? 'border-primary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                   <img src={img} alt="thumb" className="w-full h-full object-cover" loading="lazy" />
                 </button>
               ))}
            </div>

            {/* Main Image View */}
            <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] lg:rounded-3xl overflow-hidden bg-surface group">
               {/* Mobile Slider Indicator Overlay */}
               <div className="lg:hidden absolute top-4 left-4 z-10 bg-dark/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest">
                  {activeImage + 1} / {images.length}
               </div>

               {/* Mobile: Horizontal Scroll Snap Slider */}
               <div 
                className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar h-full w-full"
                onScroll={(e) => {
                  const slideWidth = e.currentTarget.offsetWidth;
                  const newIdx = Math.round(e.currentTarget.scrollLeft / slideWidth);
                  setActiveImage(newIdx);
                }}
               >
                  {images.map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full h-full snap-center">
                       <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
               </div>

               {/* Desktop: Active Image */}
               <img 
                 src={images[activeImage]} 
                 alt={product.name} 
                 className="hidden lg:block w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 loading="lazy"
               />

               {/* Floating Actions */}
               <div className="absolute top-6 right-6 flex flex-col space-y-4 z-10">
                  <button 
                    onClick={toggleWishlist}
                    className={`w-12 h-12 rounded-full shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 ${isWishlisted ? 'bg-primary text-white scale-110 shadow-primary/40' : 'bg-white/80 text-dark hover:bg-white'}`}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={isWishlisted ? 0 : 2} />
                  </button>
                  <button className="w-12 h-12 bg-white/80 text-dark rounded-full shadow-2xl backdrop-blur-md flex items-center justify-center hover:bg-white transition-all duration-300">
                    <Share2 size={20} />
                  </button>
               </div>

               {/* Mobile Dots */}
               <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                    <div key={idx} className={`h-1.5 transition-all duration-300 rounded-full ${activeImage === idx ? 'w-8 bg-primary' : 'w-1.5 bg-white/50'}`}></div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] px-4 lg:px-0 py-10 lg:py-0">
            <div className="lg:sticky lg:top-32">
               <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[11px] font-bold tracking-widest text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">New Arrival</span>
                     <div className="flex items-center space-x-1 bg-surface px-3 py-1.5 rounded-full">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-black text-dark">{product.rating || '4.5'}</span>
                     </div>
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-bold text-dark font-luxury tracking-tight leading-tight mb-4 text-balance">
                    {product.name}
                  </h1>
                  <p className="text-secondary text-sm lg:text-lg font-medium tracking-wide mb-8 opacity-80">
                    {product.brand || 'OUTFITHO'}
                  </p>
                  
                  <div className="flex items-baseline space-x-6">
                    <span className="text-4xl lg:text-5xl font-black text-dark">
                      ₹{selectedSize ? product.sizes.find(s => s.size === selectedSize)?.price : product.price}
                    </span>
                    {product.mrp > product.price && (
                      <>
                        <span className="text-xl text-light line-through font-medium">₹{product.mrp}</span>
                        <span className="text-xl text-primary font-black animate-pulse">-{discount}%</span>
                      </>
                    )}
                  </div>
               </div>

               {/* Size Picker */}
               {product.sizes && product.sizes.length > 0 && (
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-bold text-light tracking-widest">Select Size</h3>
                      <button className="flex items-center text-[11px] font-bold text-primary tracking-widest hover:underline">
                        <Ruler size={14} className="mr-2" /> Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.sizes.map((s) => (
                        <button 
                          key={s.size}
                          onClick={() => setSelectedSize(s.size)}
                          className={`w-16 h-16 rounded-2xl border-2 font-black text-sm transition-all flex items-center justify-center ${
                            selectedSize === s.size 
                            ? 'border-dark bg-dark text-white shadow-xl -translate-y-1' 
                            : 'border-surface text-secondary hover:border-dark hover:text-dark bg-surface/50'
                          }`}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                </div>
               )}

               {/* Desktop CTA */}
               <div className="hidden lg:flex gap-4 mb-12">
                    <button 
                    onClick={handleAddToCart}
                    className={`flex-1 !rounded-2xl flex items-center justify-center space-x-4 py-6 shadow-2xl transition-all active:scale-95 group ${
                      isAdded 
                      ? 'bg-secondary text-white' 
                      : 'bg-dark text-white hover:bg-primary shadow-primary/20'
                    }`}
                  >
                    <ShoppingBag size={24} strokeWidth={3} className={isAdded ? '' : 'group-hover:rotate-12 transition-transform'} />
                    <span className="text-xl font-bold tracking-widest">{isAdded ? 'Added' : 'Add to Bag'}</span>
                  </button>
               </div>

               {/* Features Accordion */}
               <div className="space-y-4 border-t border-surface pt-10">
                  {[
                    { id: 'description', label: 'Product Details', content: product.description },
                    { id: 'specifications', label: 'Material & Care', content: product.materialCare || 'Premium quality fabric. Hand wash or gentle machine wash recommended.' },
                    { id: 'delivery', label: 'Shipping & Returns', content: product.shippingReturns || 'Free delivery on orders over ₹1000. Easy 7-day returns.' }
                  ].map((section) => (
                    <div key={section.id} className="bg-surface/30 rounded-2xl overflow-hidden border border-border/50">
                       <button 
                        onClick={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
                        className="w-full px-6 py-5 flex justify-between items-center group"
                       >
                         <span className="text-xs font-bold text-dark group-hover:text-primary transition-colors">{section.label}</span>
                         <ChevronDown size={16} className={`text-light transition-transform duration-500 ${expandedSection === section.id ? 'rotate-180 text-primary' : ''}`} />
                       </button>
                       <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === section.id ? 'max-h-64' : 'max-h-0'}`}>
                          <div className="px-6 pb-6 text-sm text-secondary leading-relaxed font-medium opacity-80">
                             {section.content}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-border/60 p-4 z-[100] flex gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] items-center">
         <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
               <span className="text-xs font-black text-dark">
                 ₹{(selectedSize ? product.sizes.find(s => s.size === selectedSize)?.price : product.price).toLocaleString()}
               </span>
               {product.mrp > product.price && (
                <span className="text-[10px] font-bold text-light line-through opacity-50">₹{product.mrp.toLocaleString()}</span>
               )}
            </div>
            {discount > 0 && (
              <p className="text-[9px] font-bold text-primary tracking-tight mt-0.5">Save {discount}% OFF</p>
            )}
         </div>
          <button 
          onClick={handleAddToCart}
          className={`flex-[2] rounded-xl flex items-center justify-center space-x-3 py-3.5 shadow-xl active:scale-95 transition-all ${
            isAdded 
            ? 'bg-secondary text-white' 
            : 'bg-dark text-white'
          }`}
         >
           <ShoppingBag size={18} strokeWidth={3} />
           <span className="text-xs font-bold tracking-widest">{isAdded ? 'Added' : 'Add to Bag'}</span>
          </button>
      </div>
    </div>
  );
};

export default ProductDetails;

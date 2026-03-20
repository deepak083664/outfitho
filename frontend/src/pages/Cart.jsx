import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, X, ShieldCheck, ChevronRight, Info, Plus, Minus, Tag, Truck, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    navigate('/checkout', { state: { appliedCoupon } });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      setIsValidating(true);
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(data);
      toast.success(`Coupon "${data.code}" applied!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalMrp = cartItems.reduce((acc, item) => {
    const discount = item.discount || 0;
    const mrp = discount > 0 ? item.price / (1 - discount / 100) : item.price;
    return acc + mrp * item.qty;
  }, 0);
  const bagDiscount = totalMrp - subtotal;
  
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  
  const shipping = 0;
  const total = subtotal - couponDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 lg:py-40 text-center min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-surface rounded-full flex items-center justify-center mb-8 lg:mb-10 shadow-inner overflow-hidden border border-border/10">
           <ShoppingBag size={42} lg:size={56} className="text-light opacity-50" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter mb-4">Your Bag is Empty</h2>
        <p className="text-secondary mb-10 lg:mb-12 max-w-sm mx-auto text-xs lg:text-sm font-medium opacity-80 decoration-primary decoration-2 leading-relaxed px-6">
          "The best way to find your style is to start curating." <br className="hidden sm:block" /> Add some essentials to get started.
        </p>
        <Link to="/shop" className="btn-primary !rounded-full !px-12 lg:!px-16 !py-4 lg:!py-5 shadow-2xl hover:shadow-primary/40 active:scale-95 transition-all flex items-center space-x-3 group">
          <span className="font-black tracking-[0.2em] text-[10px] lg:text-xs">EXPLORE SHOP</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-20 max-w-7xl pt-8 lg:pt-16">
        <div className="mb-8 lg:mb-14 text-center lg:text-left">
           <h1 className="text-3xl lg:text-6xl font-black uppercase tracking-tighter text-dark leading-none inline-flex items-end">
              My Bag
              <span className="text-primary text-sm lg:text-lg font-black bg-primary/5 px-3 py-1 rounded-full ml-4 tracking-normal transform -translate-y-2 lg:-translate-y-4">
                {cartItems.length}
              </span>
           </h1>
           <p className="mt-4 text-[10px] lg:text-xs font-bold text-light uppercase tracking-[0.3em] lg:ml-1">Home / Bag</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">
          
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-8">
             <div className="space-y-4 lg:space-y-6">
                {cartItems.map((item) => (
                   <div key={`${item._id}-${item.size}`} className="group relative flex flex-row items-center p-3 lg:p-6 bg-surface/20 rounded-[2rem] border border-transparent hover:border-border/50 hover:bg-white hover:shadow-2xl hover:shadow-dark/5 transition-all duration-500 overflow-hidden">
                      {/* Compact Image */}
                      <Link to={`/product/${item._id}`} className="w-28 lg:w-44 aspect-[4/5] bg-surface rounded-2xl overflow-hidden shrink-0 shadow-sm border border-border/10">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </Link>
                      
                      <div className="flex-1 ml-4 lg:ml-10 flex flex-col justify-between py-2 min-w-0">
                         <div>
                            <div className="flex justify-between items-start mb-1 lg:mb-2">
                               <div className="space-y-1">
                                  <h3 className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-primary">{item.brand}</h3>
                                  <h2 className="text-sm lg:text-2xl font-bold text-dark pr-4 leading-tight font-luxury lg:font-heading">{item.name}</h2>
                               </div>
                               <button 
                                onClick={() => removeFromCart(item._id, item.size)} 
                                className="w-8 h-8 lg:w-10 lg:h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-light hover:text-red-500 transition-all border border-border/50 active:scale-90"
                               >
                                  <X size={16} />
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 lg:gap-5 mt-4 lg:mt-6">
                               <div className="flex items-center space-x-2 bg-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border border-border/30 shadow-sm">
                                  <span className="text-[9px] lg:text-[10px] font-black text-light uppercase tracking-widest">Size:</span>
                                  <span className="text-[10px] lg:text-xs font-black text-dark">{item.size}</span>
                               </div>
                               
                               <div className="flex items-center bg-white rounded-xl border border-border/30 shadow-sm overflow-hidden">
                                  <button onClick={() => updateQty(item._id, item.size, -1)} className="px-3 py-1.5 lg:px-4 lg:py-2 hover:bg-surface transition-colors active:bg-border"><Minus size={12} /></button>
                                  <span className="px-3 text-xs lg:text-sm font-black text-dark min-w-[20px] text-center">{item.qty}</span>
                                  <button onClick={() => updateQty(item._id, item.size, 1)} className="px-3 py-1.5 lg:px-4 lg:py-2 hover:bg-surface transition-colors active:bg-border"><Plus size={12} /></button>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-end justify-between mt-6 lg:mt-10">
                            <div className="flex flex-col lg:flex-row lg:items-baseline lg:space-x-3">
                               <span className="text-lg lg:text-3xl font-black text-dark tracking-tighter">₹{(item.price * item.qty).toLocaleString()}</span>
                               {item.discount > 0 && (
                                 <span className="text-[10px] lg:text-sm text-light line-through font-bold opacity-40">₹{Math.round((item.price / (1 - item.discount / 100)) * item.qty).toLocaleString()}</span>
                               )}
                            </div>
                            {item.discount > 0 && (
                               <span className="hidden sm:inline-block text-[9px] lg:text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full border border-green-100/50">
                                 Save ₹{Math.round(((item.price / (1 - item.discount / 100)) - item.price) * item.qty).toLocaleString()}
                               </span>
                            )}
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             {/* Safety & Logistics Info */}
             <div className="grid grid-cols-2 gap-4 lg:gap-8 pt-6">
                <div className="p-4 lg:p-8 bg-surface/10 rounded-[2rem] flex items-center space-x-4 border border-border/30 group">
                   <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform duration-500">
                      <ShieldCheck size={20} lg:size={28} />
                   </div>
                   <div>
                      <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-dark">SECURE</h4>
                      <p className="text-[9px] lg:text-[10px] text-secondary font-medium tracking-tight mt-1 opacity-60">Verified Payment</p>
                   </div>
                </div>
                <div className="p-4 lg:p-8 bg-surface/10 rounded-[2rem] flex items-center space-x-4 border border-border/30 group">
                   <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform duration-500">
                      <CreditCard size={20} lg:size={28} />
                   </div>
                   <div>
                      <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-dark">EASY</h4>
                      <p className="text-[9px] lg:text-[10px] text-secondary font-medium tracking-tight mt-1 opacity-60">Instant Checkout</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-[420px]">
             <div className="lg:sticky lg:top-32 space-y-8">
                {/* Promo Code Box */}
                <div className="p-5 lg:p-8 bg-dark rounded-[2rem] text-white shadow-2xl shadow-dark/20 relative overflow-hidden group">
                   <Sparkles className="absolute top-0 right-0 w-32 h-32 text-white/5 -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-1000" />
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 inline-flex items-center">
                     <Tag size={14} className="mr-2" /> Apply Coupon
                   </h3>
                   <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="e.g. SUMMER20" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs font-bold placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-all uppercase"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isValidating}
                        className="px-6 py-3 bg-white text-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center min-w-[80px]"
                      >
                        {isValidating ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                      </button>
                   </div>
                </div>

                {/* Summary Table */}
                <div className="p-6 lg:p-10 bg-white border border-border/50 rounded-[2.5rem] shadow-xl shadow-dark/[0.02]">
                   <h2 className="text-[11px] lg:text-xs font-black uppercase tracking-[0.5em] text-light border-b border-border/50 pb-6 mb-8 text-center">Checkout Summary</h2>
                   
                   <div className="space-y-6">
                      <div className="flex justify-between items-center text-xs lg:text-sm">
                         <span className="font-bold text-secondary">Base Amount</span>
                         <span className="font-black text-dark">₹{Math.round(totalMrp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs lg:text-sm">
                         <span className="font-bold text-secondary">Bag Discount</span>
                         <span className="font-black text-green-600">− ₹{Math.round(bagDiscount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs lg:text-sm">
                         <div className="flex items-center space-x-2">
                           <span className="font-bold text-secondary">Logistics</span>
                           <Info size={12} className="text-light opacity-50" />
                         </div>
                         <span className={`font-black ${shipping === 0 ? 'text-green-600 uppercase text-[10px] tracking-widest' : 'text-dark'}`}>
                           {shipping === 0 ? 'FREE' : `₹${shipping}`}
                         </span>
                      </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-dashed border-dark/10">
                      <div className="flex justify-between items-end mb-10">
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-light uppercase tracking-widest">Grand Total</span>
                            <p className="text-[9px] text-green-600 font-bold uppercase tracking-[0.1em]">Tax & Duties Included</p>
                         </div>
                         <span className="text-3xl lg:text-5xl font-black text-dark tracking-tighter">₹{Math.round(total).toLocaleString()}</span>
                      </div>

                      <button 
                       onClick={handleCheckout}
                       className="hidden lg:flex w-full bg-dark text-white rounded-2xl py-6 items-center justify-center space-x-4 shadow-2xl hover:bg-primary transition-all duration-500 group active:scale-[0.98]"
                      >
                        <span className="text-base font-black tracking-[0.3em] uppercase">SECURE CHECKOUT</span>
                        <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                   </div>
                </div>

                {/* Shipping Promise */}
                <div className="flex items-center justify-center space-x-3 text-light opacity-50">
                   <div className="h-[1px] w-8 bg-border"></div>
                   <Truck size={14} />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Free Shipping for Members</span>
                   <div className="h-[1px] w-8 bg-border"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-border/60 px-6 py-5 z-[100] flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-light uppercase tracking-widest leading-none">Price Total</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-dark tracking-tighter">₹{Math.round(total).toLocaleString()}</span>
              <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">FREE SHIP</span>
            </div>
         </div>
         <button 
          onClick={handleCheckout}
          className="bg-dark text-white pl-8 pr-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-dark/20 active:scale-95 transition-all flex items-center space-x-3 group"
         >
           <span>CONTINUE</span>
           <ChevronRight size={18} className="translate-y-[0.5px]" />
         </button>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, ShieldCheck, Truck, CreditCard, Smartphone, ChevronRight, Lock, MapPin, Package, MoreHorizontal, Sparkles, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const appliedCoupon = location.state?.appliedCoupon || null;
  const [loading, setLoading] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 1500 ? 0 : 99;
  const total = subtotal - couponDiscount + shipping;

  useEffect(() => {
    if (cartItems.length === 0 && !isOrdered) {
      navigate('/shop');
    }
  }, [cartItems, navigate, isOrdered]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    try {
      setLoading(true);
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.images?.[0] || item.image,
          price: item.price,
          size: item.size,
          color: item.color || 'Default',
          product: item._id
        })),
        shippingAddress: {
          ...shippingAddress,
          fullName,
          name: fullName, // Try both formats
          phone: contactNo
        },
        fullName,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        shippingPrice: shipping,
        taxPrice: 0,
        totalPrice: total,
        couponCode: appliedCoupon?.code,
        couponDiscount: couponDiscount
      };

      const { data } = await api.post('/orders', orderData);
      toast.success('Order placed successfully!');
      
      // Persist orderId and Name for the success page
      localStorage.setItem('lastOrderId', data._id);
      localStorage.setItem('lastOrderCustomerName', fullName);
      
      setIsOrdered(true);
      clearCart();
      
      // Delay navigation slightly to ensure state is cleared and toasts are visible
      setTimeout(() => {
        navigate('/order-success', { state: { orderId: data._id } });
      }, 300);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-6 lg:py-16">
      <div className="container mx-auto px-4 lg:px-20 max-w-7xl">
        
        {/* Modern Stepper - Compact */}
        <div className="mb-8 lg:mb-20 flex flex-col items-center">
           <div className="flex items-center w-full max-w-lg relative px-4">
              <div className="absolute top-[16px] sm:top-[20px] lg:top-1/2 left-4 right-4 h-0.5 bg-surface -translate-y-1/2 -z-10"></div>
              <div 
               className="absolute top-[16px] sm:top-[20px] lg:top-1/2 left-4 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-700 ease-out"
               style={{ width: `calc(${step === 1 ? '0%' : step === 2 ? '50%' : '100%'} - 32px)` }}
              ></div>
              
              {[
                { n: 1, label: 'BAG', icon: Package },
                { n: 2, label: 'ADDRESS', icon: MapPin },
                { n: 3, label: 'PAYMENT', icon: CreditCard }
              ].map((s, i) => (
                <div key={s.n} className="flex-1 flex flex-col items-center relative">
                   <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl border-2 lg:border-4 transition-all duration-500 flex items-center justify-center ${
                      step >= s.n ? 'bg-dark border-primary shadow-lg scale-110 text-white' : 'bg-white border-surface text-light'
                   }`}>
                      {step > s.n ? <Check size={14} className="text-primary" /> : <s.icon size={14} />}
                   </div>
                   <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] mt-2 sm:mt-3 transition-colors ${step >= s.n ? 'text-dark' : 'text-light'}`}>
                      {s.label}
                   </span>
                </div>
              ))}
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24">
           
           {/* Left: Input Sections */}
           <div className="flex-1">
              <form onSubmit={handlePlaceOrder}>
                 {step === 1 && (
                    <div className="animate-fade-in space-y-8">
                       <div className="flex items-center justify-between">
                          <h2 className="text-xl lg:text-3xl font-black uppercase tracking-tighter text-dark leading-none">
                             Delivery Details
                          </h2>
                          <Link to="/cart" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center">
                             <ArrowLeft size={12} className="mr-1.5" /> Modify Bag
                          </Link>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-light tracking-[0.2em] flex items-center">Full Name</label>
                             <input 
                                type="text" 
                                required 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-surface/40 border-2 border-transparent focus:border-dark focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold" 
                                placeholder="E.g. John Doe" 
                              />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-light tracking-[0.2em]">Contact No</label>
                             <input 
                                type="tel" 
                                required 
                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}
                                className="w-full bg-surface/40 border-2 border-transparent focus:border-dark focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold" 
                                placeholder="+91 0000 000 000" 
                              />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                             <label className="text-[9px] font-black uppercase text-light tracking-[0.2em]">Full Address</label>
                             <input 
                                type="text" 
                                required 
                                value={shippingAddress.address}
                                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                className="w-full bg-surface/40 border-2 border-transparent focus:border-dark focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold" 
                                placeholder="House No, Street, Locality" 
                              />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-light tracking-[0.2em]">City</label>
                             <input 
                                type="text" 
                                required 
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                className="w-full bg-surface/40 border-2 border-transparent focus:border-dark focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold" 
                                placeholder="New Delhi" 
                              />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-light tracking-[0.2em]">Pincode</label>
                             <input 
                                type="text" 
                                required 
                                value={shippingAddress.postalCode}
                                onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                                className="w-full bg-surface/40 border-2 border-transparent focus:border-dark focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold" 
                                placeholder="110001" 
                              />
                          </div>
                       </div>

                       <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        className="w-full lg:w-max px-12 btn-primary !rounded-xl !py-4 flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all group"
                       >
                          <span className="font-black tracking-[0.2em] text-[10px]">CONTINUE TO PAYMENT</span>
                          <ChevronRight size={16} />
                       </button>
                    </div>
                 )}

                 {step === 2 && (
                    <div className="animate-fade-in space-y-8">
                       <h2 className="text-xl lg:text-3xl font-black uppercase tracking-tighter text-dark leading-none">
                          Payment Mode
                       </h2>
                       
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                          {[
                             { id: 'card', name: 'Card', icon: CreditCard, subtitle: 'Secure' },
                             { id: 'upi', name: 'UPI', icon: Smartphone, subtitle: 'Instant' },
                             { id: 'cod', name: 'COD', icon: Truck, subtitle: 'Cash' },
                          ].map((method) => (
                             <button 
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`flex flex-col items-center p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300 ${
                                 paymentMethod === method.id ? 'border-dark bg-dark text-white shadow-xl' : 'border-surface bg-surface/20 text-secondary'
                              }`}
                             >
                                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center mb-3 lg:mb-4 ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-white text-dark shadow-sm'}`}>
                                   <method.icon size={16} lg:size={20} />
                                </div>
                                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.15em] mb-1">{method.name}</span>
                                {paymentMethod === method.id && <Check size={12} strokeWidth={4} className="text-primary mt-1" />}
                             </button>
                          ))}
                       </div>

                       <div className="mt-10 flex flex-col sm:flex-row gap-4">
                          <button 
                           type="button" 
                           onClick={() => setStep(1)}
                           className="flex-1 px-6 py-4 rounded-xl border-2 border-surface font-black text-[9px] uppercase tracking-[0.2em] text-secondary hover:border-dark hover:text-dark transition-all"
                          >
                             BACK TO ADDRESS
                          </button>
                          <button 
                           type="submit"
                           disabled={loading}
                           className="flex-[2] btn-primary !rounded-xl !py-4 flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all group disabled:opacity-50"
                          >
                             {loading ? <MoreHorizontal className="animate-pulse" /> : <Lock size={18} strokeWidth={3} />}
                             <span className="font-black tracking-[0.2em] text-sm uppercase">{loading ? 'PROCESSING...' : 'PAY NOW'}</span>
                          </button>
                       </div>
                    </div>
                 )}
              </form>
           </div>

            {/* Right: Tiny Order Summary */}
           <div className="w-full lg:w-[400px]">
              <div className="lg:sticky lg:top-24 space-y-6">
                 <div className="bg-surface/30 border border-border/50 rounded-2xl p-4 lg:p-8">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-light mb-6 lg:mb-8 flex items-center">
                       <Package size={14} className="mr-2" /> Summary
                    </h3>
                    
                    <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                       {cartItems.map((item) => (
                         <div key={`${item._id}-${item.size}`} className="flex gap-4 group">
                           <div className="w-16 h-20 bg-white rounded-lg overflow-hidden shadow-sm shrink-0">
                              <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 flex flex-col justify-center min-w-0">
                              <h4 className="text-[10px] font-bold text-dark truncate leading-tight mb-2">{item.name}</h4>
                              <div className="flex items-center justify-between text-[10px] font-black text-secondary">
                                 <span className="opacity-60 uppercase">{item.size} | {item.qty.toString().padStart(2, '0')}</span>
                                 <span className="text-dark">₹{item.price.toLocaleString()}</span>
                              </div>
                           </div>
                         </div>
                       ))}
                     </div>

                    <div className="space-y-3 pt-6 border-t border-border/50">
                       <div className="flex justify-between items-center text-[10px] font-bold text-secondary">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold text-green-600">
                          <span>Delivery</span>
                          <span>FREE</span>
                       </div>
                       
                       <div className="flex justify-between items-end pt-6 mt-2 border-t border-dashed border-border/50">
                          <span className="text-[10px] font-black text-light uppercase tracking-widest">Total</span>
                          <span className="text-2xl font-black text-dark tracking-tighter leading-none">₹{total.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default Checkout;

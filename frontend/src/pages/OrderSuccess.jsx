import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, Loader2, Package, MapPin, Sparkles, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../services/api';

const OrderSuccess = () => {
  const invoiceRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || localStorage.getItem('lastOrderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const idToFetch = orderId;
      if (!idToFetch) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get(`/orders/${idToFetch}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 1000 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 40 * (timeLeft / duration);
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff3366', '#ffdf00', '#000000']
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff3366', '#ffdf00', '#000000']
      });
    }, 250);

    return () => clearInterval(interval);
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current || !order) return;
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const all = clonedDoc.getElementsByTagName('*');
          for (let el of all) {
            const style = clonedDoc.defaultView.getComputedStyle(el);
            if (style.color.includes('oklch')) el.style.color = '#000000';
            if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = '#ffffff';
            if (style.borderColor.includes('oklch')) el.style.borderColor = '#dddddd';
            if (style.boxShadow.includes('oklch') || style.boxShadow.includes('rgba(0, 0, 0, 0)')) {
              el.style.boxShadow = 'none';
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OUTFITHO-Invoice-${String(order._id).slice(-6)}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Invoice generation error. Please try again.');
    }
  };

  const customerName = order?.shippingAddress?.fullName || order?.shippingAddress?.name || localStorage.getItem('lastOrderCustomerName') || 'Valued Customer';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <Loader2 className="animate-spin text-black" size={64} strokeWidth={1} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-[#ff3366] animate-pulse" size={24} />
          </div>
        </motion.div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#bbbbbb] animate-pulse">Finalizing your order</p>
      </div>
    );
  }

  if (!order || !order._id) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-surface rounded-[2rem] flex items-center justify-center mb-8">
          <ShoppingBag size={48} className="text-[#bbbbbb]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Order Found</h2>
        <p className="text-xs text-[#666666] font-medium tracking-widest uppercase mb-8 opacity-60">We couldn't retrieve your order. Return to store.</p>
        <Link to="/shop" className="px-12 py-4 bg-black text-white rounded-xl font-black tracking-widest text-[10px] uppercase">Back to Store</Link>
      </div>
    );
  }

  const safeOrderId = String(order._id).slice(-8).toUpperCase();
  const safeOrderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '--';
  const safeTotalPrice = Number(order.totalPrice || 0);

  return (
    <div className="bg-white min-h-screen pt-10 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 lg:mb-24">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 lg:w-32 lg:h-32 bg-black rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check className="text-white w-10 h-10 lg:w-16 lg:h-16" strokeWidth={3} />
          </motion.div>
          <span className="text-[#ff3366] font-black uppercase tracking-[0.6em] text-[10px] block mb-4">Congratulations!</span>
          <h1 className="text-4xl lg:text-7xl font-bold tracking-tighter text-[#000000] uppercase mb-6 leading-none">Order <span className="text-[#ff3366]">Captured</span></h1>
          <p className="text-[#666666] font-medium text-xs lg:text-base opacity-70">Style upgrade in motion.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          <div className="w-full lg:w-[40%] space-y-6">
            <div className="bg-[#fcfcfc] rounded-[2rem] p-8 border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#999999] mb-8 flex items-center"><Package size={14} className="mr-3" /> Quick Details</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-[#666666] uppercase tracking-widest">Order ID</span><span className="text-xs font-black text-[#000000]">#{safeOrderId}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-[#666666] uppercase tracking-widest">Date</span><span className="text-xs font-black text-[#000000]">{safeOrderDate}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-[#666666] uppercase tracking-widest">Status</span><span className="text-[10px] font-black text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase">Success</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-[#666666] uppercase tracking-widest">Method</span><span className="text-xs font-black text-[#000000] uppercase">{order?.paymentMethod}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-[#666666] uppercase tracking-widest">Payment</span><span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${order?.isPaid ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{order?.isPaid ? 'PAID' : 'UNPAID'}</span></div>
              </div>
            </div>

            <div className="bg-[#fcfcfc] rounded-[2rem] p-8 border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#999999] mb-8 flex items-center"><MapPin size={14} className="mr-3" /> Shipping to</h3>
              <p className="text-sm font-black text-[#000000] uppercase mb-2">{customerName}</p>
              <p className="text-xs text-[#666666] font-medium leading-relaxed">
                {order?.shippingAddress?.address}, <br />
                {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode} <br />
                <span className="block mt-4 text-[#000000] font-black">Ph: {order?.shippingAddress?.phone || '--'}</span>
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button onClick={handleDownloadInvoice} className="w-full bg-black text-white rounded-2xl py-5 px-8 font-black tracking-[0.2em] text-[11px] uppercase flex items-center justify-center space-x-3 shadow-2xl hover:bg-[#ff3366] transition-all"><Download size={18} /><span>Download Invoice</span></button>
              <Link to="/shop" className="w-full bg-white border-2 border-gray-200 text-dark rounded-2xl py-5 px-8 font-black tracking-[0.2em] text-[11px] uppercase flex items-center justify-center space-x-3 hover:border-black transition-all active:scale-95"><ShoppingBag size={18} /><span>Continue Shopping</span></Link>
            </div>
          </div>

          <div className="w-full lg:w-[60%]">
            <div className="bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
              <div className="p-6 lg:p-14" ref={invoiceRef} id="invoice-container" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6 pb-6 border-b-2 border-gray-50">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase mb-2" style={{ color: '#000000' }}>OUTFITHO<span style={{ color: '#ff3366' }}>.</span></h2>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: '#000000' }}>Precision Fit | Modern Luxe</p>
                      <p className="text-[8px] font-black uppercase tracking-widest mt-1" style={{ color: '#ff3366' }}>outfithoo8@gmail.com</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <h4 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: '#bbbbbb' }}>Tax Invoice</h4>
                    <p className="text-sm font-black" style={{ color: '#000000' }}>#{safeOrderId}</p>
                    <p className="text-[9px] font-bold mt-0.5 uppercase tracking-widest" style={{ color: '#666666' }}>{safeOrderDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h5 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: '#bbbbbb' }}>Bill To / Ship To</h5>
                    <div className="space-y-1">
                       <p className="text-xs font-black uppercase" style={{ color: '#000000' }}>{customerName}</p>
                       <div className="text-[10px] font-medium leading-relaxed" style={{ color: '#444444' }}>
                          <p>{order?.shippingAddress?.address || '--'}</p>
                          <p>{order?.shippingAddress?.city || '--'}, {order?.shippingAddress?.postalCode || '--'}</p>
                          <p>{order?.shippingAddress?.country || 'India'}</p>
                       </div>
                       <p className="text-[10px] font-black mt-2" style={{ color: '#000000' }}><span className="text-[#bbbbbb] font-bold mr-2 uppercase tracking-tighter">Mobile:</span>{order?.shippingAddress?.phone || '--'}</p>
                    </div>
                  </div>
                  <div className="md:text-right flex flex-col justify-end">
                    <div className="space-y-1">
                       <div className="flex justify-between md:justify-end gap-10 items-center"><span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#bbbbbb' }}>Status</span><span className="text-[9px] font-black uppercase" style={{ color: order?.isPaid ? '#16a34a' : '#ef4444' }}>{order?.isPaid ? 'PAID - SUCCESS' : 'UNPAID - COD'}</span></div>
                       <div className="flex justify-between md:justify-end gap-10 items-center"><span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#bbbbbb' }}>Method</span><span className="text-[9px] font-black uppercase" style={{ color: '#000000' }}>{order?.paymentMethod || '--'}</span></div>
                       <div className="flex justify-between md:justify-end gap-10 items-center"><span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#bbbbbb' }}>Currency</span><span className="text-[9px] font-black uppercase" style={{ color: '#000000' }}>INR (₹)</span></div>
                    </div>
                  </div>
                </div>

                <div className="mb-10 overflow-x-auto">
                   <table className="w-full border-collapse min-w-[400px]">
                      <thead>
                         <tr style={{ borderBottom: '2px solid #000000' }}>
                            <th className="text-left text-[9px] font-black uppercase tracking-[0.1rem] pb-4" style={{ color: '#000000' }}>Description</th>
                            <th className="text-center text-[9px] font-black uppercase tracking-[0.1rem] pb-4" style={{ color: '#000000' }}>Rate</th>
                            <th className="text-center text-[9px] font-black uppercase tracking-[0.1rem] pb-4" style={{ color: '#000000' }}>Qty</th>
                            <th className="text-right text-[9px] font-black uppercase tracking-[0.1rem] pb-4" style={{ color: '#000000' }}>Amount</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {order?.orderItems?.map((item, idx) => {
                           const itemPrice = Number(item?.price || 0);
                           const itemQty = Number(item?.qty || 0);
                           const itemSku = String(item?._id || item?.product || 'ITEM').slice(-6).toUpperCase();
                           return (
                             <tr key={idx}>
                                <td className="py-4 pr-4">
                                   <p className="text-[10px] font-black uppercase mb-0.5" style={{ color: '#000000' }}>{item?.name || 'PRODUCT'}</p>
                                   <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#999999' }}>SKU: {itemSku} | Sz: {item?.size || '--'}</p>
                                </td>
                                <td className="py-4 text-center text-[10px] font-bold" style={{ color: '#000000' }}>₹{itemPrice.toLocaleString()}</td>
                                <td className="py-4 text-center text-[10px] font-bold" style={{ color: '#000000' }}>{itemQty}</td>
                                <td className="py-4 text-right text-[10px] font-black" style={{ color: '#000000' }}>₹{(itemPrice * itemQty).toLocaleString()}</td>
                             </tr>
                           );
                         })}
                      </tbody>
                   </table>
                </div>

                <div className="flex justify-end pt-6">
                  <div className="w-full sm:w-1/2 space-y-3">
                     <div className="flex justify-between items-center text-[10px]"><span className="font-bold text-[#bbbbbb] uppercase tracking-widest">Sub-Total</span><span className="font-black" style={{ color: '#000000' }}>₹{safeTotalPrice.toLocaleString()}</span></div>
                     <div className="flex justify-between items-center text-[10px]"><span className="font-bold text-[#bbbbbb] uppercase tracking-widest">Logistics</span><span className="font-black uppercase tracking-widest text-[8px]" style={{ color: '#16a34a' }}>Free</span></div>
                     <div className="flex justify-between items-center pt-4 border-t-2" style={{ borderColor: '#000000' }}><span className="text-xs font-black uppercase tracking-[0.1rem]" style={{ color: '#000000' }}>Grand Total</span><span className="text-xl font-black tracking-tighter" style={{ color: '#000000' }}>₹{safeTotalPrice.toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="mt-20 pt-6 border-t border-gray-100">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-1">
                         <h6 className="text-[8px] font-black uppercase tracking-widest" style={{ color: '#000000' }}>Return Policy</h6>
                         <p className="text-[7px] font-medium leading-relaxed" style={{ color: '#999999' }}>Eligible items can be returned within 7 days of delivery.</p>
                      </div>
                      <div className="sm:text-right space-y-1">
                         <h6 className="text-[8px] font-black uppercase tracking-widest" style={{ color: '#000000' }}>Disclaimer</h6>
                         <p className="text-[7px] font-medium leading-relaxed" style={{ color: '#999999' }}>This is a computer generated document. No signature required.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

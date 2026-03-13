import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag, MapPin, ReceiptText } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const OrderSuccess = () => {
  const invoiceRef = useRef(null);

  useEffect(() => {
    // Launch confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    
    try {
      const element = invoiceRef.current;
      
      // Use higher scale for better quality
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OUTFITHO-Invoice-${Math.floor(Math.random() * 100000)}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-[80vh] py-12 lg:py-24 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-sm border border-green-100">
           <CheckCircle className="text-green-600 w-8 h-8 lg:w-10 lg:h-10" />
        </div>

        <div className="mb-8 lg:mb-12 px-2">
           <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-2">Order Confirmed!</p>
           <h1 className="text-2xl lg:text-4xl font-black uppercase tracking-tight text-dark mb-3">Thank you for your purchase</h1>
           <p className="text-secondary font-medium text-xs lg:text-sm leading-relaxed max-w-lg mx-auto opacity-70">
              Your order is being processed and will be delivered soon.
           </p>
        </div>

        {/* Visible Invoice Container */}
        <div className="mb-12 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-100 shadow-2xl bg-white group">
          <div className="overflow-x-auto no-scrollbar scroll-smooth">
            <div ref={invoiceRef} className="p-4 sm:p-6 lg:p-12 bg-white w-full min-w-[320px] md:min-w-[600px] text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-dark pb-6 sm:pb-8 mb-6 sm:mb-8 gap-4 sm:gap-0">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase">OUTFITHO<span className="text-primary">.</span></span>
                  </div>
                  <p className="text-[7px] sm:text-[8px] font-black text-secondary tracking-[0.2em] uppercase opacity-60">Engineered Luxury | Modern Fashion</p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-widest mb-1 text-dark">TAX INVOICE</h2>
                  <p className="text-[9px] sm:text-[10px] font-bold text-secondary uppercase leading-none">#INV-{Math.floor(Math.random() * 1000000)}</p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-secondary uppercase mt-1 opacity-60">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
                <div>
                  <h3 className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-light mb-2 sm:mb-3">Billing & Shipping:</h3>
                  <p className="text-xs sm:text-sm font-black uppercase mb-1">Deepak Kumar</p>
                  <p className="text-[10px] sm:text-[11px] text-secondary font-medium leading-relaxed opacity-80">
                    Avenue Park, MG Road,<br />
                    New Delhi, India, PIN: 110001
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <h3 className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-light mb-2 sm:mb-3">Order Summary:</h3>
                  <div className="space-y-1 max-w-[150px] sm:ml-auto">
                    <p className="text-[9px] sm:text-[10px] font-bold text-secondary flex justify-between"><span>Status:</span> <span className="text-green-600 font-black">PAID</span></p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-secondary flex justify-between"><span>Delivery:</span> <span className="text-dark font-black">EXPRESS</span></p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full mb-8 sm:mb-10 border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-y border-gray-100 text-left bg-gray-50/50">
                      <th className="py-3 px-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-dark">DESCRIPTION</th>
                      <th className="py-3 px-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-dark text-center">QTY</th>
                      <th className="py-3 px-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-dark text-right">UNIT</th>
                      <th className="py-3 px-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-dark text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-4 sm:py-6 px-2">
                        <p className="text-[10px] sm:text-[11px] font-black uppercase mb-1">Premium Heavyweight Cotton Tee</p>
                        <p className="text-[7px] sm:text-[8px] font-bold text-light uppercase tracking-widest">Size: L | Color: Vintage Black</p>
                      </td>
                      <td className="py-4 sm:py-6 px-2 text-[10px] sm:text-[11px] font-bold text-center">01</td>
                      <td className="py-4 sm:py-6 px-2 text-[10px] sm:text-[11px] font-bold text-right">₹1,499</td>
                      <td className="py-4 sm:py-6 px-2 text-[10px] sm:text-[11px] font-black text-right">₹1,499</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 sm:pt-6">
                <div className="w-full sm:w-64 space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-secondary">
                    <span>Subtotal:</span>
                    <span className="text-dark">₹1,499.00</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-green-600">
                    <span>Delivery:</span>
                    <span className="uppercase tracking-widest">Free</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-black border-t-2 border-dark pt-3 mt-4">
                    <span>TOTAL:</span>
                    <span>₹1,499.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-gray-50 text-center">
                 <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.5em] text-light mb-2 opacity-50">Authorized Invoice copy by OUTFITHO</p>
                 <p className="text-[9px] sm:text-[10px] font-serif italic text-secondary opacity-40">"Personal Style is Eternal."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button 
           onClick={handleDownloadInvoice}
           className="flex-1 sm:flex-none p-4 lg:px-12 bg-dark text-white rounded-xl font-black tracking-widest flex items-center justify-center space-x-3 group hover:bg-primary transition-all shadow-xl active:scale-95"
          >
             <ReceiptText size={18} />
             <span className="text-[10px] uppercase">Download Invoice</span>
          </button>
          <Link to="/shop" className="flex-1 sm:flex-none p-4 lg:px-12 bg-white border-2 border-dark text-dark rounded-xl font-black tracking-widest flex items-center justify-center space-x-3 group hover:bg-gray-50 transition-all active:scale-95">
             <ShoppingBag size={18} />
             <span className="text-[10px] uppercase">Continue Shopping</span>
          </Link>
        </div>

        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-light opacity-50">
           A copy of this invoice has been sent to your email
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;

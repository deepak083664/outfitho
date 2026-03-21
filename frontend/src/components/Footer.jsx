import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#eaeaec] text-dark pt-6 lg:pt-10 pb-20 md:pb-6 border-t border-border">
      <div className="container mx-auto px-4 lg:px-10">
        
        {/* Features / Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-8 border-b border-border">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm"><ShieldCheck size={24} className="text-primary" /></div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest">100% ORIGINAL</h4>
                 <p className="text-[11px] text-secondary font-medium mt-0.5">guarantee for all products at outfitho.com</p>
              </div>
           </div>
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm"><RefreshCw size={24} className="text-primary" /></div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Return facility available</h4>
                 <p className="text-[11px] text-secondary font-medium mt-0.5">Easy returns on all orders</p>
              </div>
           </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm"><Truck size={24} className="text-primary" /></div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest">24*7 available</h4>
                 <p className="text-[11px] text-secondary font-medium mt-0.5">Customer support at your service</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Online Shopping</h3>
            <ul className="space-y-3 text-[13px] text-secondary font-medium">
              <li><Link to="/shop?category=men" className="hover:text-primary transition-colors">Men</Link></li>
              <li><Link to="/shop?category=women" className="hover:text-primary transition-colors">Women</Link></li>
              <li><Link to="/shop?category=kids" className="hover:text-primary transition-colors">Kids</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?category=sale" className="hover:text-primary transition-colors text-primary">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div className="col-span-1">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Customer Policies</h3>
            <ul className="space-y-3 text-[13px] text-secondary font-medium">
              <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/refund-policy" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Track Orders</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Contact Us</h3>
            <ul className="space-y-4 text-[13px] text-secondary font-medium">
              <li className="flex items-start">
                 <MapPin size={16} className="mr-3 mt-0.5 shrink-0 text-dark" />
                  <span>Pardih, Barki Pona, Ramgarh, Jharkhand, India</span>
               </li>
               <li className="flex items-center">
                  <Phone size={16} className="mr-3 shrink-0 text-dark" />
                  <span>+91 6209970552</span>
               </li>
               <li className="flex items-center">
                  <Mail size={16} className="mr-3 shrink-0 text-dark" />
                  <span>Outfitoo@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-2 lg:col-span-2 flex flex-col items-start lg:items-end">
             <div className="w-full lg:max-w-xs">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4">Follow Us</h3>
                <div className="flex space-x-6 mb-6">
                  <a href="#" className="p-3 bg-white rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all duration-300">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-3 bg-white rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all duration-300">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="p-3 bg-white rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all duration-300">
                    <Facebook size={20} />
                  </a>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] font-black uppercase tracking-widest text-light gap-4 border-t border-border">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} OUTFITHO. All rights reserved.</p>
            <p className="mt-2 normal-case font-medium text-secondary">
              Powered by <a href="https://launchliftx.com" target="_blank" rel="noopener noreferrer" className="text-[13px] font-black hover:text-primary transition-colors">launchliftx</a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-dark transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-dark transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-dark transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

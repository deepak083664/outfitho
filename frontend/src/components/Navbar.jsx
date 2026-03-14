import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, Settings } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { wishlistItems } = useWishlist();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = (e) => {
    const newClicks = logoClicks + 1;
    if (newClicks >= 5) {
      e.preventDefault();
      setLogoClicks(0);
      navigate('/admin');
    } else {
      setLogoClicks(newClicks);
      const timer = setTimeout(() => setLogoClicks(0), 2000);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'unset';
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-border/10 shadow-sm py-0.5">
        <div className="w-full px-4 lg:px-8 flex items-center justify-between h-9 lg:h-11">
          
          <div className="flex items-center">
            <Link 
              to="/"
              onClick={handleLogoClick}
              className="flex items-center group space-x-1 lg:space-x-1.5 cursor-pointer"
            >
              <img 
                src="/logo.jpeg" 
                alt="Logo" 
                className="h-7 lg:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-dark font-brand-classic flex items-baseline">
                OUTFITHO<span className="text-primary ml-0.5">.</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-12 text-[11px] font-black text-dark uppercase tracking-[0.2em]">
            <Link to="/shop?category=Men" className="hover:text-primary transition-colors relative group">
               Men
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/shop?category=Women" className="hover:text-primary transition-colors relative group">
               Women
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/shop?category=Kids" className="hover:text-primary transition-colors relative group">
               Kids
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/shop?category=Accessories" className="hover:text-primary transition-colors relative group">
               Accessories
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/shop?sale=true" className="text-primary hover:opacity-80 transition-colors relative group">
               Sale
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-8">
            <button 
              className="lg:hidden flex flex-col items-center group text-dark hover:text-primary transition-all"
              onClick={toggleMobileMenu}
            >
              <Menu size={20} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Menu</span>
            </button>

            <Link to="/wishlist" className="flex flex-col items-center group text-dark hover:text-primary transition-all relative">
              <Heart size={20} className={`mb-1 lg:w-5 lg:h-5 ${wishlistItems.length > 0 ? 'text-primary fill-primary' : ''}`} />
              <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="flex flex-col items-center group text-dark hover:text-primary transition-all relative">
              <ShoppingBag size={20} className="mb-1 lg:w-5 lg:h-5" />
              <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-dark text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none group-hover:bg-primary transition-colors">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={toggleMobileMenu}></div>
        
        <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white transition-transform duration-500 ease-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center border-b border-surface">
            <Link 
              to="/"
              onClick={(e) => {
                handleLogoClick(e);
                if (logoClicks + 1 < 5) toggleMobileMenu();
              }} 
              className="flex items-center space-x-1.5 cursor-pointer"
            >
              <img src="/logo.jpeg" alt="Logo" className="h-8 w-auto object-contain" />
              <span className="text-lg font-bold tracking-tight text-dark font-brand-classic flex items-baseline">
                OUTFITHO<span className="text-primary ml-0.5">.</span>
              </span>
            </Link>
            <button onClick={toggleMobileMenu} className="p-2 bg-surface rounded-full text-dark"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
             <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-light block mb-2">Shop Categories</span>
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Men', path: '/shop?category=Men' },
                  { name: 'Women', path: '/shop?category=Women' },
                  { name: 'Kids', path: '/shop?category=Kids' },
                  { name: 'Accessories', path: '/shop?category=Accessories' },
                  { name: 'New Arrivals', path: '/shop' },
                  { name: 'Sale', path: '/shop?sale=true', primary: true }
                ].map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`block text-lg font-black uppercase tracking-tight ${link.primary ? 'text-primary' : 'text-dark'}`}
                  >
                    {link.name}
                  </Link>
                ))}
             </div>

             <div className="pt-6 border-t border-surface space-y-5">
                {[
                  { icon: Heart, label: 'My Wishlist', path: '/wishlist' },
                ].map((item) => (
                  <Link key={item.label} to={item.path} className="flex items-center space-x-4 text-secondary hover:text-dark transition-colors">
                     <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center"><item.icon size={18} /></div>
                     <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                  </Link>
                ))}
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

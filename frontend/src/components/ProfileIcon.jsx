import React, { useState, useRef, useEffect } from 'react';
import { User, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProfileIcon = () => {
  const { user, logout, setShowLoginModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIconClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleIconClick}
        className="flex flex-col items-center group transition-all"
      >
        <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 
          ${user 
            ? 'bg-dark border-dark text-white shadow-lg' 
            : 'bg-surface border-transparent text-secondary group-hover:bg-white group-hover:border-border group-hover:text-dark'
          }`}
        >
          {user ? (
            <span className="text-[8px] lg:text-[10px] font-black tracking-tighter">{getInitials(user.name)}</span>
          ) : (
            <User size={16} strokeWidth={2.5} />
          )}
        </div>
        <span className="mt-1 text-[9px] font-black uppercase tracking-widest hidden lg:block text-dark group-hover:text-primary transition-colors">
          {user ? 'Profile' : 'Login'}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {user && isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-surface overflow-hidden z-50 origin-top-right"
          >
            <div className="p-5 bg-surface/50 border-b border-surface">
              <p className="text-[10px] font-black uppercase tracking-widest text-light mb-1">Welcome back</p>
              <p className="text-sm font-black text-dark truncate">{user.name}</p>
            </div>
            
            <div className="p-2">
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-surface transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-white transition-colors">
                   <ShoppingBag size={16} className="text-secondary group-hover:text-primary" />
                </div>
                <span className="text-xs font-bold text-dark">My Orders</span>
              </Link>
              
              <Link 
                to="/wishlist" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-surface transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-white transition-colors">
                   <Heart size={16} className="text-secondary group-hover:text-primary" />
                </div>
                <span className="text-xs font-bold text-dark">Wishlist</span>
              </Link>

              <div className="my-1 border-t border-surface"></div>

              <button 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white transition-colors">
                   <LogOut size={16} className="text-red-500" />
                </div>
                <span className="text-xs font-bold">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileIcon;

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopHeader = ({ onMenuClick, adminName }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 shrink-0 shadow-sm">
      {/* Left side */}
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="text-gray-500 hover:text-black mr-4 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <span className="text-lg font-bold text-gray-900 mr-8 hidden lg:block whitespace-nowrap">Admin Panel</span>
        <span className="text-base font-bold text-gray-900 lg:hidden truncate pr-4">Admin Panel</span>

        {/* Search Bar Removed */}
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">

        <div className="flex items-center border-l border-gray-200 pl-4 relative" ref={menuRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 focus:outline-none group"
          >
            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
              {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-900 leading-none">{adminName || 'Admin'}</span>
              <span className="text-xs text-gray-500 mt-1">Super Admin</span>
            </div>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-black transition-colors hidden sm:block ml-1" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="origin-top-right absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
              <div className="px-4 py-3">
                <p className="text-sm">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 truncate">{adminName}</p>
              </div>
              <div className="py-1">
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                  Your Profile
                </a>
              </div>
              <div className="py-1">
                <button 
                  onClick={handleLogout}
                  className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-700" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;

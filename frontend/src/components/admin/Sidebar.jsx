import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Tags, 
  Ticket, 
  Settings, 
  X,
  Store,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/users', icon: Users },
  ];

  const bottomNav = [
    { name: 'Live Store', href: '/', icon: Store },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black text-white shrink-0 flex flex-col
        transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
        <Link 
          to="/admin" 
          onClick={() => setIsOpen(false)}
          className="text-xl font-heading font-bold tracking-widest text-white flex items-center space-x-2"
        >
          <span>OUTFITHO<span className="text-gray-400 italic">.</span></span>
        </Link>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
          Management
        </div>
        {navigation.map((item) => {
          // Exact match for dashboard, startswith for others
          const isActive = item.href === '/admin' 
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon 
                className={`mr-3 shrink-0 h-5 w-5 transition-colors ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
         {bottomNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-500 transition-all"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
            Logout
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;

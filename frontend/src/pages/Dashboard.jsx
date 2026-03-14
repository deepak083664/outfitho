import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Package, MapPin, Heart, LogOut, ChevronRight, Settings, CreditCard, Bell } from 'lucide-react';

const Dashboard = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Guest', email: '', memberSince: '2025' };
    const user = { 
      name: userInfo.name || 'User', 
      email: userInfo.email || '', 
      memberSince: userInfo.createdAt ? new Date(userInfo.createdAt).getFullYear() : '2025' 
    };
    
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/login');
    };
  
  const orders = [
    { _id: 'ORD-88291', date: '05 Mar 2026', total: 1499, status: 'Delivered', items: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200' },
    { _id: 'ORD-99102', date: '01 Mar 2026', total: 4599, status: 'In Transit', items: 2, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Profile Header */}
      <div className="bg-dark text-white pt-10 pb-20 lg:pt-20 lg:pb-32 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="container mx-auto px-4 lg:px-20 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-10">
             <div className="w-20 h-20 lg:w-32 lg:h-32 bg-surface rounded-full flex items-center justify-center text-dark text-2xl lg:text-3xl font-black border-4 border-white/10 shrink-0">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
             </div>
            <div className="text-center md:text-left flex-1 min-w-0">
               <h1 className="text-xl lg:text-4xl font-black uppercase tracking-widest mb-1 lg:mb-2 truncate">{user.name}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-3 lg:gap-4 text-[9px] lg:text-xs font-bold text-light uppercase tracking-widest opacity-80">
                  <span className="flex items-center"><UserIcon size={12} className="mr-1.5" /> Platinum</span>
                  <span className="flex items-center"><Package size={12} className="mr-1.5" /> 12 Orders</span>
               </div>
            </div>
            <button className="md:ml-auto flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all border border-white/5 active:scale-95">
               <Settings size={14} />
               <span>Settings</span>
            </button>
         </div>
      </div>

      <div className="container mx-auto px-4 lg:px-20 -mt-10 lg:-mt-16 pb-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
             <div className="bg-white rounded-xl shadow-card border border-border p-1 lg:p-2 overflow-hidden">
                <nav className="flex lg:flex-col overflow-x-auto no-scrollbar lg:space-y-1">
                   {[
                      { icon: Package, label: 'My Orders', active: true },
                      { icon: Heart, label: 'Wishlist', active: false },
                      { icon: MapPin, label: 'Saved Addresses', active: false },
                      { icon: CreditCard, label: 'Payments', active: false },
                      { icon: Bell, label: 'Notifications', active: false }
                   ].map((item) => (
                      <button 
                        key={item.label}
                        className={`flex-shrink-0 flex items-center justify-between p-3 lg:p-4 rounded-lg transition-all ${
                           item.active 
                            ? 'bg-primary/5 text-primary border-b-2 lg:border-b-0 lg:border-l-4 border-primary' 
                            : 'text-secondary hover:bg-surface hover:text-dark'
                        }`}
                      >
                         <div className="flex items-center font-black uppercase text-[10px] lg:text-[11px] tracking-widest whitespace-nowrap">
                            <item.icon size={16} className="mr-3 lg:mr-4" />
                            {item.label}
                         </div>
                         <ChevronRight size={14} className="hidden lg:block ml-2" />
                      </button>
                   ))}
                   <div className="hidden lg:block h-px bg-border mx-4 my-2"></div>
                   <button 
                    onClick={handleSignOut}
                    className="flex-shrink-0 flex items-center p-3 lg:p-4 rounded-lg text-red-500 font-black uppercase text-[10px] lg:text-[11px] tracking-widest hover:bg-red-50 transition-all whitespace-nowrap"
                   >
                      <LogOut size={16} className="mr-3 lg:mr-4" />
                      Sign Out
                   </button>
                </nav>
             </div>
          </aside>

          {/* Main Content: Orders History */}
          <main className="flex-1">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-dark flex items-center">
                   Recent Orders <span className="ml-2 h-1 w-8 bg-primary rounded-full"></span>
                </h2>
                <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-secondary outline-none cursor-pointer">
                   <option>Last 6 Months</option>
                   <option>Year 2025</option>
                   <option>All Time</option>
                </select>
             </div>

             {orders.length === 0 ? (
                 <div className="py-20 text-center bg-surface border-2 border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <Package size={24} className="text-light" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-2">No orders yet</h3>
                    <p className="text-[11px] text-secondary font-medium mb-8 max-w-[200px] mx-auto">
                       Looks like you haven't discovered your style yet!
                    </p>
                    <Link to="/shop" className="btn-primary !rounded-full !px-8">Browse Shop</Link>
                 </div>
             ) : (
                <div className="space-y-6">
                   {orders.map((order) => (
                      <div key={order._id} className="bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-xl transition-all group">
                         <div className="flex flex-row">
                            <div className="w-24 sm:w-32 lg:w-40 aspect-[4/5] sm:aspect-square overflow-hidden bg-surface shrink-0">
                               <img src={order.image} alt="order" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            
                            <div className="flex-1 p-3 lg:p-6 flex flex-col justify-between">
                               <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3 lg:mb-4">
                                  <div className="min-w-0">
                                     <div className="flex items-center space-x-2 mb-1.5">
                                        <span className={`text-[8px] lg:text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                                           order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                           {order.status}
                                        </span>
                                        <span className="text-[8px] lg:text-[10px] font-bold text-light truncate">ID: {order._id}</span>
                                     </div>
                                     <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-dark truncate pr-2">Premium Item Selection</h3>
                                  </div>
                                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-1 sm:mt-0">
                                     <p className="text-[8px] lg:text-[10px] font-black text-light uppercase mb-0 sm:mb-1">Total Amount</p>
                                     <p className="text-base lg:text-lg font-black text-dark tracking-tighter">₹{order.total}</p>
                                  </div>
                               </div>

                               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-border/50 pt-3 lg:pt-4">
                                  <div className="flex items-center text-[8px] lg:text-[10px] font-bold text-secondary uppercase tracking-widest">
                                     Ordered: <span className="text-dark font-black ml-2">{order.date}</span>
                                  </div>
                                  <div className="flex space-x-2 w-full sm:w-auto">
                                     <button className="flex-1 sm:flex-none px-4 lg:px-6 py-2 border border-border rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest hover:border-dark transition-all active:scale-95 shadow-sm">
                                        Track
                                     </button>
                                     <button className="flex-1 sm:flex-none px-4 lg:px-6 py-2 bg-dark text-white rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-md">
                                        Details
                                     </button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

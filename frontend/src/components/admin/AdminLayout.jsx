import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Basic Auth Protection (Assuming userInfo is correctly structured and has isAdmin)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-gray-900 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} adminName={userInfo.name} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

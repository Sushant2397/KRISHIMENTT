import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';

export default function MainLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // Default open on desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On desktop, keep sidebar state; on mobile, close it
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        // On desktop, you can toggle it manually
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onMenuClick={() => {
          console.log('MainLayout: Toggling sidebar from', isSidebarOpen, 'to', !isSidebarOpen);
          setIsSidebarOpen(!isSidebarOpen);
        }} 
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className={cn(
          "flex-1 p-6 transition-all duration-300",
          isSidebarOpen && "lg:ml-64"
        )}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

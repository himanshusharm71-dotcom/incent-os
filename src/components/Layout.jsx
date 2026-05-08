import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Menu, X } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isMobile && sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        className={isMobile && sidebarOpen ? 'sidebar-open' : ''}
        onNavClick={() => isMobile && setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Topbar />
        <main style={{ 
          padding: isMobile ? '1.5rem' : '2.5rem', 
          paddingTop: isMobile ? '5rem' : '2rem',
          flex: 1 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
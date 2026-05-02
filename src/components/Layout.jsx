import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Menu, X } from 'lucide-react';

function Layout({ children }) {
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

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [window.location.pathname]);

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
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        className={isMobile && sidebarOpen ? 'sidebar-open' : ''}
        onNavClick={() => isMobile && setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : '260px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        <Topbar />
        <main style={{
          padding: isMobile ? '1rem' : '2rem',
          paddingTop: isMobile ? '4.5rem' : '2rem',
          flex: 1,
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
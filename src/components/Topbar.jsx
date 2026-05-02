import React, { useState } from 'react';
import { Search, Bell, Plus, Calendar, CheckCircle, MessageSquare, FileText, ChevronDown, Monitor } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [showQuickAction, setShowQuickAction] = useState(false);
  
  // OS Page Titles
  const titles = {
    '/': 'System Dashboard',
    '/team': 'Directory & Hierarchy',
    '/tasks': 'Task Processor',
    '/leaderboard': 'Performance Index',
    '/meetings': 'In-App Video Bridge',
    '/files': 'Cloud Drive',
    '/communication': 'Central Chat',
    '/analytics': 'Kernel Analytics',
    '/approvals': 'Access Control'
  };

  const title = titles[path] || 'INCENT OS';

  return (
    <header style={{
      height: '64px',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 30px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          padding: '6px',
          background: 'rgba(249, 115, 22, 0.1)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Monitor size={18} color="var(--accent-primary)" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
          {title}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Global Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', transition: 'all 0.3s' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search OS..." 
            style={{
              paddingLeft: '36px',
              width: '200px',
              height: '36px',
              fontSize: '0.85rem',
              borderRadius: '18px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => { e.target.style.width = '300px'; e.target.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e) => { e.target.style.width = '200px'; e.target.style.borderColor = 'var(--border-light)'; }}
          />
        </div>

        {/* Global Action Menu */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowQuickAction(!showQuickAction)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={16} /> New <ChevronDown size={14} />
          </button>

          {showQuickAction && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: 0,
              width: '200px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-light)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease'
            }}>
              {[
                { label: 'New Task', icon: CheckCircle, path: '/tasks', color: '#10B981' },
                { label: 'Schedule Meeting', icon: Calendar, path: '/meetings', color: '#6366F1' },
                { label: 'Upload File', icon: FileText, path: '/files', color: '#F59E0B' },
                { label: 'Create Group', icon: MessageSquare, path: '/communication', color: 'var(--accent-primary)' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => { navigate(item.path); setShowQuickAction(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)',
                    transition: 'all 0.1s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <item.icon size={16} color={item.color} /> {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.03)', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
        >
          <Bell size={18} color="var(--text-primary)" />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--status-danger)',
            borderRadius: '50%',
            border: '2px solid #fff'
          }}></span>
        </div>
      </div>
    </header>
  );
}

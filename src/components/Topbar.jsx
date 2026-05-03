import React, { useState } from 'react';
import { Search, Bell, Plus, Calendar, CheckCircle, MessageSquare, FileText, ChevronDown, Monitor, Settings, LogOut, Shield, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Avatar } from './ui/Avatar';

export function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const titles = {
    '/': 'System Dashboard',
    '/team': 'Directory & Hierarchy',
    '/tasks': 'Task Processor',
    '/leaderboard': 'Performance Index',
    '/meetings': 'In-App Video Bridge',
    '/files': 'Cloud Drive',
    '/communication': 'Central Chat',
    '/analytics': 'Kernel Analytics',
    '/approvals': 'Access Control',
    '/calendar': 'Deadline Calendar',
    '/settings': 'System Settings'
  };

  const title = titles[path] || 'INCENT OS';

  const notifications = [
    { id: 1, text: "New Task Assigned: 'Update PR Strategy'", time: '10m ago', icon: CheckCircle, color: '#10B981' },
    { id: 2, text: "Meeting starting in 5 minutes: 'Core Sync'", time: '5m ago', icon: Calendar, color: '#6366F1' },
    { id: 3, text: "Admin approved your file upload.", time: '1h ago', icon: FileText, color: '#F59E0B' },
  ];

  return (
    <header style={{
      height: '64px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)',
      position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 30px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ padding: '6px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Monitor size={18} color="var(--accent-primary)" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Quick Action */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowQuickAction(!showQuickAction)} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', border: 'none',
            background: 'var(--accent-primary)', color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)'
          }}><Plus size={16} /> New <ChevronDown size={14} /></button>

          {showQuickAction && (
            <div style={{ position: 'absolute', top: '45px', right: 0, width: '200px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 1000 }}>
              {[
                { label: 'New Task', icon: CheckCircle, path: '/tasks', color: '#10B981' },
                { label: 'Schedule Meeting', icon: Calendar, path: '/meetings', color: '#6366F1' },
                { label: 'Upload File', icon: FileText, path: '/files', color: '#F59E0B' },
              ].map((item, i) => (
                <div key={i} onClick={() => { navigate(item.path); setShowQuickAction(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <item.icon size={16} color={item.color} /> {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
            <Bell size={18} color="var(--text-primary)" />
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: 'var(--status-danger)', borderRadius: '50%', border: '2px solid #fff' }}></span>
          </div>

          {showNotifications && (
            <div style={{ position: 'absolute', top: '50px', right: '-50px', width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 15px 50px rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', padding: '1.25rem', zIndex: 1000 }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}>Notifications <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', cursor: 'pointer' }}>Mark all as read</span></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}>
                    <div style={{ padding: '8px', background: `${n.color}15`, borderRadius: '8px', height: 'fit-content' }}><n.icon size={14} color={n.color} /></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>{n.text}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '25px', border: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.01)' }}>
            <Avatar src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.Name || 'U')}&background=F97316&color=fff`} size="sm" />
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {showProfileMenu && (
            <div style={{ position: 'absolute', top: '50px', right: 0, width: '220px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)', padding: '8px', zIndex: 1000 }}>
              <div style={{ padding: '10px', borderBottom: '1px solid var(--border-light)', marginBottom: '5px' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{user?.Name || 'User'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role === 'super_admin' ? 'Chair' : user?.role === 'admin' ? 'Coordinator' : 'Team Member'}</p>
              </div>
              {[
                { label: 'My Profile', icon: User, path: '/settings' },
                { label: 'OS Settings', icon: Settings, path: '/settings' },
              ].map((item, i) => (
                <div key={i} onClick={() => { navigate(item.path); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <item.icon size={16} /> {item.label}
                </div>
              ))}
              <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#EF4444', marginTop: '5px', borderTop: '1px solid var(--border-light)' }}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

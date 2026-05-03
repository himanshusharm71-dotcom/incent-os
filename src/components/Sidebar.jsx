import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, Trophy, Calendar, FileText, MessageSquare, Settings, LogOut, Shield } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { useAuth } from '../context/AuthProvider';
import logoImg from '../assets/incent_logo.jpg';
import himanshuImg from '../assets/himanshu_sharma.jpg';
import pratishImg from '../assets/pratish_rawat.jpg';
import adityaImg from '../assets/aditya_kapoor.jpg';

export function Sidebar({ className = '', onNavClick }) {
  const { user, logout } = useAuth();
  
  const getLeadershipImage = (name) => {
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('himanshu')) return himanshuImg;
    if (lowerName.includes('pratish')) return pratishImg;
    if (lowerName.includes('aditya')) return adityaImg;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=F97316&color=fff`;
  };

  const role = user?.role || 'member';
  const isAdmin = role === 'super_admin' || role === 'admin';
  const isLeaderOrAbove = isAdmin || role === 'leader' || role === 'deputy_leader';

  // Common pages — everyone can see
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Meetings', path: '/meetings', icon: Calendar },
    { name: 'Files', path: '/files', icon: FileText },
    { name: 'Communication', path: '/communication', icon: MessageSquare },
  ];

  // Admin-only pages
  const adminItems = [
    { name: 'User Management', path: '/approvals', icon: Shield },
    { name: 'System Analytics', path: '/analytics', icon: Settings },
    { name: 'Audit Log', path: '/audit', icon: FileText },
  ];

  return (
    <aside className={className} style={{
      width: '260px',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backdropFilter: 'blur(10px)',
      zIndex: 10
    }}>
      {/* Logo Area */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logoImg} alt="INCENT Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          INCENT OS
        </h2>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', marginTop: '1rem', letterSpacing: '1px' }}>Menu</div>
        
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontWeight: isActive ? '600' : '500',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
            })}
          >
            <item.icon size={18} color="currentColor" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', marginTop: '1.5rem', letterSpacing: '1px' }}>Admin</div>
            {adminItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path}
                onClick={() => { if(onNavClick) onNavClick(); }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? '600' : '500',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
                })}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={getLeadershipImage(user?.Name || user?.name)}
          alt={user?.Name || 'User'}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.Name || 'U')}&background=F97316&color=fff`; }}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.Name || user?.name || 'User'}
          </p>
          <Badge variant={user?.role === 'super_admin' ? 'danger' : 'primary'} style={{ marginTop: '4px', fontSize: '0.65rem', textTransform: 'uppercase' }}>
            {user?.role?.replace('_', ' ') || 'member'}
          </Badge>
        </div>
        <LogOut onClick={logout} size={18} color="var(--text-muted)" style={{ cursor: 'pointer', flexShrink: 0 }} title="Logout" />
      </div>
    </aside>
  );
}

export default Sidebar;

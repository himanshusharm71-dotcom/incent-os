import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CheckSquare, Trophy, Calendar, 
  FileText, MessageSquare, Settings, LogOut, Shield, Video, 
  Zap, FolderOpen 
} from 'lucide-react';
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

  const navItems = [
    { name: isAdmin ? 'Dashboard' : 'Team Portal', path: '/', icon: LayoutDashboard },
    { name: 'Wing Directory', path: '/team', icon: Users },
    { name: 'Task Board', path: '/tasks', icon: CheckSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Meetings', path: '/meetings', icon: Video },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Cloud Drive', path: '/files', icon: FolderOpen },
    { name: 'Communication', path: '/communication', icon: MessageSquare },
  ];

  const adminItems = [
    { name: 'Kernel Analytics', path: '/analytics', icon: Zap },
    { name: 'Access Control', path: '/approvals', icon: Shield },
    { name: 'Audit Logs', path: '/audit', icon: FileText },
  ];

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.5rem' }}>
        <img src={logoImg} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>INCENT OS</h1>
          <Badge variant="primary" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>v3.0.4</Badge>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-section-title">SYSTEM MENU</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {isAdmin && (
          <div className="nav-section" style={{ marginTop: '1.5rem' }}>
            <p className="nav-section-title">ADMINISTRATOR</p>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={({ isActive }) => `nav-item admin ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px' }}>
          <Avatar src={getLeadershipImage(user?.Name)} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.Name || 'User'}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{user?.role?.replace('_', ' ') || 'Member'}</p>
          </div>
          <button onClick={logout} className="logout-btn" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { User, Shield, Key, Bell, HelpCircle, Info, Star, Users } from 'lucide-react';

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System Info', icon: Info },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Account Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your INCENT OS profile and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                transition: 'all 0.2s', textAlign: 'left'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                  <Avatar 
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.Name || 'U')}&background=F97316&color=fff`} 
                    size="xl" 
                    style={{ border: '4px solid rgba(249,115,22,0.1)' }} 
                  />
                  <div>
                    <h2 style={{ margin: '0 0 5px 0' }}>{user?.Name || 'User'}</h2>
                    <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>{user?.email}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Badge variant="primary">{(user?.role?.replace('_', ' ') || 'member').toUpperCase()}</Badge>
                      <Badge variant="info">{user?.team || 'Core'}</Badge>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name</label>
                    <input value={user?.Name || ''} readOnly style={{ background: 'rgba(0,0,0,0.02)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                    <input value={user?.email || ''} readOnly style={{ background: 'rgba(0,0,0,0.02)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Team Wing</label>
                    <input value={user?.team || ''} readOnly style={{ background: 'rgba(0,0,0,0.02)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Role</label>
                    <input value={(user?.role?.replace('_', ' ') || 'member').toUpperCase()} readOnly style={{ background: 'rgba(0,0,0,0.02)' }} />
                  </div>
                </div>
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '12px', background: 'rgba(249,115,22,0.1)', borderRadius: '12px' }}><Star color="var(--accent-primary)" /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Performance Points</p>
                    <h3 style={{ margin: 0 }}>{user?.points || 0} PTS</h3>
                  </div>
                </Card>
                <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}><Users color="#6366F1" /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Membership Status</p>
                    <h3 style={{ margin: 0 }}>{(user?.status || 'ACTIVE').toUpperCase()}</h3>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <Card style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 8px 0' }}><Key size={18} inline /> Security Settings</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Update your password and manage account security.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>New Password</label>
                  <input type="password" placeholder="Min. 8 characters" />
                </div>
                <Button variant="primary" style={{ width: 'fit-content' }}>Update Password</Button>
              </div>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 8px 0' }}><Info size={18} inline /> System Environment</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>INCENT OS Version Information</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600' }}>OS Version</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>v3.0.4 - "Quantum"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Build Date</span>
                  <span style={{ color: 'var(--text-muted)' }}>May 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Kernel Mode</span>
                  <Badge variant="success">PRODUCTION</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Cloud Connector</span>
                  <span style={{ color: 'var(--text-muted)' }}>Supabase Real-time API v2</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;

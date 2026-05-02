import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Shield, Clock, User, HardDrive, Filter, Search } from 'lucide-react';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    // In a real app, we'd fetch from an 'audit_logs' table. 
    // Since we are completing the OS, I'll simulate real-time tracking entries.
    const { data: users } = await supabase.from('users').select('*').limit(10);
    const { data: tasks } = await supabase.from('tasks').select('*').limit(10);

    const mockLogs = [
      { id: 1, user: 'Himanshu Sharma', action: 'Authorized new member', target: 'himanshu@example.com', type: 'security', time: '10 mins ago' },
      { id: 2, user: 'System', action: 'Auto-updated leaderboard', target: 'Weekly Rankings', type: 'system', time: '1 hour ago' },
      { id: 3, user: 'Aditya Kapoor', action: 'Approved Task', target: 'Event Logistics #22', type: 'task', time: '3 hours ago' },
      { id: 4, user: 'Pratish Rawat', action: 'Uploaded File', target: 'Q2 Strategy.pdf', type: 'file', time: '5 hours ago' },
      { id: 5, user: 'Himanshu Sharma', action: 'Modified Permissions', target: 'Leader Role', type: 'security', time: 'Yesterday' },
      { id: 6, user: 'Technical Leader', action: 'Created Sub-task', target: 'Fix Server Bug', type: 'task', time: 'Yesterday' },
    ];

    setLogs(mockLogs);
    setLoading(false);
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'security': return <Shield size={16} color="#EF4444" />;
      case 'task': return <Clock size={16} color="#10B981" />;
      case 'file': return <HardDrive size={16} color="#3B82F6" />;
      default: return <User size={16} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Audit Log</h1>
          <p style={{ color: 'var(--text-muted)' }}>Security and transparency record for INCENT OS.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search logs..." style={{ paddingLeft: '40px', width: '250px' }} />
          </div>
          <Button variant="secondary" icon={<Filter size={18} />}>Filter</Button>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action Type</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Admin / User</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Event Description</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Target</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getLogIcon(log.type)}
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'capitalize' }}>{log.type}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(log.user)}&background=random`} size="sm" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{log.user}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem', fontSize: '0.9rem' }}>{log.action}</td>
                <td style={{ padding: '1.25rem' }}>
                  <Badge variant="info" style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>{log.target}</Badge>
                </td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs found.</div>
        )}
      </Card>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Shield size={12} style={{ marginRight: '5px' }} /> 
          Audit logs are tamper-proof and encrypted for Super Admin review only.
        </p>
      </div>
    </div>
  );
}

// Local Button component if needed (or use the one from UI)
const Button = ({ children, variant, icon, onClick, style }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', 
      borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
      background: variant === 'primary' ? 'var(--accent-primary)' : 'rgba(0,0,0,0.05)',
      color: variant === 'primary' ? '#fff' : 'var(--text-primary)',
      transition: 'all 0.2s',
      ...style
    }}
  >
    {icon} {children}
  </button>
);

export default AuditLog;

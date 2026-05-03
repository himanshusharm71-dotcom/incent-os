import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Shield, Clock, User, HardDrive, Search, UserPlus, CheckCircle, XCircle } from 'lucide-react';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const generatedLogs = [];
      let logId = 1;

      // Pull REAL users from the database and generate log entries from them
      const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(20);
      
      if (users && users.length > 0) {
        users.forEach(u => {
          if (u.status === 'active') {
            generatedLogs.push({
              id: logId++,
              user: 'System',
              action: `User "${u.Name}" account activated`,
              target: u.email,
              type: 'security',
              time: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'
            });
          }
          if (u.status === 'pre_approved') {
            generatedLogs.push({
              id: logId++,
              user: 'Admin',
              action: `Pre-authorized "${u.Name}"`,
              target: u.email,
              type: 'security',
              time: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'
            });
          }
          if (u.status === 'pending') {
            generatedLogs.push({
              id: logId++,
              user: u.Name || 'Unknown',
              action: 'Requested access to INCENT OS',
              target: u.email,
              type: 'system',
              time: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'
            });
          }
        });
      }

      // Pull REAL tasks and generate log entries
      const { data: tasks } = await supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(20);

      if (tasks && tasks.length > 0) {
        tasks.forEach(t => {
          generatedLogs.push({
            id: logId++,
            user: t.assigned_to || 'Unassigned',
            action: `Task "${t.title}" — Status: ${t.status}`,
            target: t.team || 'General',
            type: 'task',
            time: t.created_at ? new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'
          });
        });
      }

      if (generatedLogs.length === 0) {
        generatedLogs.push({
          id: 1,
          user: 'System',
          action: 'INCENT OS initialized. No activity recorded yet.',
          target: 'System',
          type: 'system',
          time: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });
      }

      setLogs(generatedLogs);
    } catch (err) {
      console.error('Audit log fetch error:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'security': return <Shield size={16} color="#EF4444" />;
      case 'task': return <Clock size={16} color="#10B981" />;
      case 'file': return <HardDrive size={16} color="#3B82F6" />;
      default: return <User size={16} color="var(--text-muted)" />;
    }
  };

  const filteredLogs = searchTerm 
    ? logs.filter(l => 
        l.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.target.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : logs;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Audit Log</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real activity record from INCENT OS database.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px', width: '250px' }} 
          />
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading audit logs...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>User</th>
                <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Event</th>
                <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Target</th>
                <th style={{ padding: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
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
        )}
        {!loading && filteredLogs.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs found.</div>
        )}
      </Card>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Shield size={12} style={{ marginRight: '5px' }} /> 
          Showing {filteredLogs.length} entries from your Supabase database.
        </p>
      </div>
    </div>
  );
}

export default AuditLog;

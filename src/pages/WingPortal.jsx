import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { 
  ExternalLink, Users, CheckSquare, MessageSquare, 
  Video, FolderOpen, Star, Zap, Clock, Rocket, Target, Globe, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEAM_CONFIG = {
  'Technical Support': { color: '#3B82F6', icon: Zap, drive: 'https://drive.google.com/drive/folders/tech', desc: 'Managing the organization\'s digital backbone.' },
  'Event Management': { color: '#8B5CF6', icon: Calendar, drive: 'https://drive.google.com/drive/folders/events', desc: 'Executing world-class events and experiences.' },
  'Startup & Innovation': { color: '#10B981', icon: Rocket, drive: 'https://drive.google.com/drive/folders/startup', desc: 'Incubating the next big ideas.' },
  'Corporate Relations': { color: '#F59E0B', icon: Target, drive: 'https://drive.google.com/drive/folders/corporate', desc: 'Building bridges with the industry.' },
  'Public Relations': { color: '#EC4899', icon: Globe, drive: 'https://drive.google.com/drive/folders/pr', desc: 'Managing global communications.' },
  'Social Media & Branding': { color: '#06B6D4', icon: MessageSquare, drive: 'https://drive.google.com/drive/folders/branding', desc: 'Crafting the INCENT visual identity.' }
};

function WingPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tasks: [], members: [], nextMeeting: null });
  const [loading, setLoading] = useState(true);

  const config = TEAM_CONFIG[user?.team] || { color: '#F97316', icon: Users, drive: '#', desc: 'Organization Core Wing.' };

  useEffect(() => {
    if (user?.team) fetchPortalData();
  }, [user]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const { data: members } = await supabase.from('users').select('*').eq('team', user.team).eq('status', 'active');
      const { data: tasks } = await supabase.from('tasks').select('*').eq('team', user.team).order('created_at', { ascending: false }).limit(4);
      const { data: meetings } = await supabase.from('meetings').select('*').eq('team', user.team).gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(1);

      setStats({ members: members || [], tasks: tasks || [], nextMeeting: meetings?.[0] || null });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const leader = stats.members.find(m => m.role === 'leader');
  const deputy = stats.members.find(m => m.role === 'deputy_leader');

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: config.color, fontWeight: '700' }}>LOADING {user?.team?.toUpperCase()} KERNEL...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      {/* Dynamic Header */}
      <div style={{ 
        padding: '3rem', 
        background: `linear-gradient(135deg, ${config.color} 0%, #1e1e1e 100%)`, 
        borderRadius: '30px', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 20px 40px ${config.color}20`
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Badge variant="primary" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}>
            Official Wing Portal
          </Badge>
          <h1 style={{ margin: '0 0 10px', fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px' }}>{user?.team}</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.2rem', maxWidth: '600px' }}>{config.desc}</p>
          
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={config.drive} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button style={{ background: '#fff', color: config.color, fontWeight: '700', padding: '14px 28px' }} icon={<FolderOpen size={20} />}>
                Team Google Drive
              </Button>
            </a>
            <Button variant="secondary" onClick={() => navigate('/communication')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} icon={<MessageSquare size={18} />}>
              Wing Chatroom
            </Button>
          </div>
        </div>
        <config.icon size={250} color="#fff" style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, transform: 'rotate(-10deg)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Management Widget */}
        <Card style={{ borderLeft: `6px solid ${config.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <Users size={20} color={config.color} />
            <h3 style={{ margin: 0 }}>Wing Commanders</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leader ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=${config.color.replace('#','')}&color=fff`} size="lg" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{leader.Name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wing Leader</p>
                  <Badge style={{ marginTop: '5px', background: `${config.color}15`, color: config.color }}>{leader.points || 0} pts</Badge>
                </div>
              </div>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Leader not assigned.</p>}
            
            {deputy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', opacity: 0.8 }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(deputy.Name)}&background=666&color=fff`} size="md" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{deputy.Name}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deputy Leader</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Task Board Widget */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckSquare size={20} color="#10B981" /> Current Operations
            </h3>
            <Button size="sm" variant="secondary" onClick={() => navigate('/tasks')}>Go to Board</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.tasks.map(t => (
              <div key={t.id} style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{t.title}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to: {t.assignedTo}</span>
                </div>
                <Badge variant={t.priority === 'High' ? 'danger' : 'warning'}>{t.priority}</Badge>
              </div>
            ))}
            {stats.tasks.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>All operations complete.</div>}
          </div>
        </Card>

        {/* Sync Center Widget */}
        <Card style={{ background: stats.nextMeeting ? `${config.color}05` : 'transparent' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={20} color={config.color} /> Sync Center
          </h3>
          {stats.nextMeeting ? (
            <div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ padding: '12px', background: config.color, color: '#fff', borderRadius: '12px', textAlign: 'center', minWidth: '65px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{new Date(stats.nextMeeting.date).toLocaleString('default', { month: 'short' })}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900' }}>{new Date(stats.nextMeeting.date).getDate()}</div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px' }}>{stats.nextMeeting.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {stats.nextMeeting.time}
                  </p>
                </div>
              </div>
              <Button style={{ width: '100%', background: config.color, color: '#fff' }} onClick={() => navigate('/meetings')}>Enter Video Bridge</Button>
            </div>
          ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No syncs scheduled.</p>}
        </Card>
      </div>

      {/* Analytics Snapshot */}
      <Card style={{ background: '#f8f9fa', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '1.5rem', fontWeight: '800', color: config.color }}>{stats.members.length}</h4>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Personnel</span>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '1.5rem', fontWeight: '800', color: '#10B981' }}>{stats.tasks.filter(t => t.status === 'completed').length}</h4>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tasks Completed</span>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '1.5rem', fontWeight: '800', color: '#6366F1' }}>{stats.members.reduce((acc, m) => acc + (m.points || 0), 0)}</h4>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Wing Points</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default WingPortal;

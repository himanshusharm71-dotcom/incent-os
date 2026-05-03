import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { 
  ExternalLink, Users, CheckSquare, MessageSquare, 
  Video, FolderOpen, Star, Zap, Clock, Rocket, Target, Globe, Calendar, Box
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEAM_CONFIG = {
  'Technical Support': { color: '#3B82F6', icon: Zap, drive: 'https://drive.google.com/drive/folders/tech', desc: 'Digital Core & Systems Management' },
  'Event Management': { color: '#8B5CF6', icon: Calendar, drive: 'https://drive.google.com/drive/folders/events', desc: 'Experience Orchestration & Execution' },
  'Startup & Innovation': { color: '#10B981', icon: Rocket, drive: 'https://drive.google.com/drive/folders/startup', desc: 'Innovation Lab & Future Labs' },
  'Corporate Relations': { color: '#F59E0B', icon: Target, drive: 'https://drive.google.com/drive/folders/corporate', desc: 'Strategic Partnerships & Industry' },
  'Public Relations': { color: '#EC4899', icon: Globe, drive: 'https://drive.google.com/drive/folders/pr', desc: 'Global Communication & Narrative' },
  'Social Media & Branding': { color: '#06B6D4', icon: MessageSquare, drive: 'https://drive.google.com/drive/folders/branding', desc: 'Creative Vision & Visual Identity' }
};

function WingPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tasks: [], members: [], nextMeeting: null });
  const [loading, setLoading] = useState(true);

  const config = TEAM_CONFIG[user?.team] || { color: '#F97316', icon: Users, drive: '#', desc: 'Central Operations Hub' };

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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const leader = stats.members.find(m => m.role === 'leader');

  if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, fontWeight: '900', letterSpacing: '2px' }}>ACCESSING {user?.team?.toUpperCase()} WING...</div>;

  return (
    <div className="animate-fade-in perspective-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
      
      {/* 3D Wing Header (Light Mode) */}
      <div className="card-3d floating" style={{ 
        padding: '4rem 2.5rem', 
        background: `linear-gradient(135deg, #fff 0%, ${config.color}08 100%)`, 
        borderRadius: '32px', 
        border: `1px solid ${config.color}20`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Badge variant="primary" style={{ marginBottom: '1.25rem', background: config.color, color: '#fff', border: 'none', padding: '6px 14px' }}>
            {user?.team?.toUpperCase()} WING
          </Badge>
          <h1 style={{ margin: '0 0 8px', fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-2.5px' }}>
            {user?.team?.split(' ')[0]} <span style={{ color: config.color }}>Portal</span>
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', color: 'var(--text-secondary)' }}>{config.desc}</p>
          
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={config.drive} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button style={{ background: config.color, color: '#fff', fontWeight: '800', padding: '14px 28px' }} icon={<FolderOpen size={20} />}>
                Team Drive
              </Button>
            </a>
            <Button variant="secondary" onClick={() => navigate('/communication')} style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }} icon={<MessageSquare size={18} />}>
              Wing Chat
            </Button>
          </div>
        </div>
        <config.icon size={250} color={config.color} style={{ position: 'absolute', right: '-40px', top: '-40px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Personnel Card */}
        <Card className="card-3d" style={{ background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color={config.color} /> Personnel Command
          </h3>
          {leader ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'rgba(0,0,0,0.015)', borderRadius: '20px' }}>
              <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=${config.color.replace('#','')}&color=fff`} size="lg" />
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{leader.Name}</h4>
                <p style={{ margin: '2px 0 8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wing Leader</p>
                <Badge style={{ background: `${config.color}15`, color: config.color }}>{leader.points || 0} pts</Badge>
              </div>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>Leader not assigned.</p>}
        </Card>

        {/* Operations Card */}
        <Card className="card-3d" style={{ background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box size={20} color="#10B981" /> Task Matrix
            </h3>
            <Button size="sm" variant="secondary" onClick={() => navigate('/tasks')}>All Tasks</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.tasks.map(t => (
              <div key={t.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{t.title}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.assignedTo}</span>
                </div>
                <Badge variant={t.priority === 'High' ? 'danger' : 'warning'} size="sm">{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Sync Center Card */}
        <Card className="card-3d" style={{ background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={20} color={config.color} /> Sync Center
          </h3>
          {stats.nextMeeting ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: config.color, color: '#fff', borderRadius: '15px', textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '900' }}>{new Date(stats.nextMeeting.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{new Date(stats.nextMeeting.date).getDate()}</div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{stats.nextMeeting.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {stats.nextMeeting.time}
                  </p>
                </div>
              </div>
              <Button style={{ width: '100%', background: config.color, color: '#fff', fontWeight: '700' }} onClick={() => navigate('/meetings')}>Initialize Call</Button>
            </div>
          ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No syncs scheduled.</p>}
        </Card>
      </div>
    </div>
  );
}

export default WingPortal;

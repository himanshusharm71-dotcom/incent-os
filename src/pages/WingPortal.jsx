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

  if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, fontWeight: '900', letterSpacing: '4px' }}>ACCESSING {user?.team?.toUpperCase()} WING...</div>;

  return (
    <div className="animate-fade-in perspective-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '6rem' }}>
      
      {/* 3D Wing Header */}
      <div className="card-3d floating" style={{ 
        padding: '5rem 3rem', 
        background: `linear-gradient(135deg, ${config.color}30 0%, rgba(15,23,42,0.8) 100%)`, 
        borderRadius: '40px', 
        border: `1px solid ${config.color}40`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 30px 60px ${config.color}15`
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Badge variant="primary" style={{ marginBottom: '1.5rem', background: config.color, color: '#fff', border: 'none', padding: '6px 14px' }}>
            PRIVATE SECTOR: {user?.team?.toUpperCase()}
          </Badge>
          <h1 style={{ margin: '0 0 10px', fontSize: '4rem', fontWeight: '900', color: '#fff', letterSpacing: '-3px' }}>
            {user?.team?.split(' ')[0]} <span style={{ color: config.color }}>Portal</span>
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.3rem', maxWidth: '600px', color: 'var(--text-secondary)' }}>{config.desc}</p>
          
          <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href={config.drive} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button style={{ background: config.color, color: '#fff', fontWeight: '800', padding: '16px 32px', fontSize: '1rem', border: 'none', boxShadow: `0 10px 30px ${config.color}40` }} icon={<FolderOpen size={22} />}>
                Launch Team Drive
              </Button>
            </a>
            <Button variant="secondary" onClick={() => navigate('/communication')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px' }} icon={<MessageSquare size={20} />}>
              Wing Comms
            </Button>
          </div>
        </div>
        <config.icon size={350} color={config.color} style={{ position: 'absolute', right: '-80px', top: '-50px', opacity: 0.15, transform: 'rotate(-15deg)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Leadership 3D Card */}
        <Card className="card-3d" style={{ borderTop: `6px solid ${config.color}`, padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
            <Users size={24} color={config.color} /> Personnel Command
          </h3>
          {leader ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=${config.color.replace('#','')}&color=fff`} size="xl" style={{ border: `4px solid ${config.color}`, boxShadow: `0 0 20px ${config.color}40` }} />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{leader.Name}</h4>
                <p style={{ margin: '5px 0 15px', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Wing Leader</p>
                <Badge style={{ background: config.color, color: '#fff' }}><Star size={12} /> {leader.points || 0} pts</Badge>
              </div>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>Awaiting commander assignment...</p>}
        </Card>

        {/* Task Dashboard Card */}
        <Card className="card-3d" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box size={24} color="#10B981" /> Task Matrix
            </h3>
            <Button size="sm" variant="secondary" onClick={() => navigate('/tasks')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>All Files</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stats.tasks.map(t => (
              <div key={t.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{t.title}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Personnel: {t.assignedTo}</span>
                </div>
                <Badge style={{ background: t.priority === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)', color: t.priority === 'High' ? '#EF4444' : '#F59E0B' }}>{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Sync Center Card */}
        <Card className="card-3d" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Video size={24} color={config.color} /> Live Bridge
          </h3>
          {stats.nextMeeting ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ padding: '15px', background: config.color, color: '#fff', borderRadius: '20px', textAlign: 'center', minWidth: '75px', boxShadow: `0 10px 25px ${config.color}30` }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase' }}>{new Date(stats.nextMeeting.date).toLocaleString('default', { month: 'short' })}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{new Date(stats.nextMeeting.date).getDate()}</div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px', fontSize: '1.2rem', color: '#fff' }}>{stats.nextMeeting.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> {stats.nextMeeting.time}
                  </p>
                </div>
              </div>
              <Button style={{ width: '100%', background: config.color, color: '#fff', padding: '16px', fontWeight: '800' }} onClick={() => navigate('/meetings')}>Initialize Bridge</Button>
            </div>
          ) : <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>No active syncs.</div>}
        </Card>
      </div>
    </div>
  );
}

export default WingPortal;

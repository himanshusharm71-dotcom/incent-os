import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { 
  ExternalLink, Users, CheckSquare, MessageSquare, 
  Video, FolderOpen, Star, Zap, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEAM_DRIVE_LINKS = {
  'Technical Support': 'https://drive.google.com/drive/folders/tech-support',
  'Event Management': 'https://drive.google.com/drive/folders/events',
  'Startup & Innovation': 'https://drive.google.com/drive/folders/startup',
  'Corporate Relations': 'https://drive.google.com/drive/folders/corporate',
  'Public Relations': 'https://drive.google.com/drive/folders/pr',
  'Social Media & Branding': 'https://drive.google.com/drive/folders/social-media'
};

function WingPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tasks: [], members: [], nextMeeting: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.team) fetchPortalData();
  }, [user]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Team Members
      const { data: members } = await supabase.from('users').select('*').eq('team', user.team).eq('status', 'active');
      
      // 2. Fetch Team Tasks
      const { data: tasks } = await supabase.from('tasks').select('*').eq('team', user.team).order('created_at', { ascending: false }).limit(4);
      
      // 3. Fetch Next Meeting
      const { data: meetings } = await supabase.from('meetings').select('*').eq('team', user.team).gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(1);

      setStats({
        members: members || [],
        tasks: tasks || [],
        nextMeeting: meetings?.[0] || null
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const leader = stats.members.find(m => m.role === 'leader');
  const deputy = stats.members.find(m => m.role === 'deputy_leader');
  const driveLink = TEAM_DRIVE_LINKS[user?.team] || '#';

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-primary)' }}>Loading Team Portal...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      {/* Team Welcome Banner */}
      <div style={{ 
        padding: '2.5rem', 
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)', 
        borderRadius: '24px', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Badge variant="primary" style={{ marginBottom: '1rem', background: 'rgba(249,115,22,0.2)', color: 'var(--accent-primary)' }}>{user?.team} Wing</Badge>
          <h1 style={{ margin: '0 0 10px', fontSize: '2.5rem', fontWeight: '800' }}>{user?.team} Portal</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '1.1rem' }}>Welcome to your specialized team command center.</p>
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={driveLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="primary" icon={<FolderOpen size={18} />} style={{ padding: '12px 24px' }}>
                Open Team Drive
              </Button>
            </a>
            <Button variant="secondary" icon={<MessageSquare size={18} />} onClick={() => navigate('/communication')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              Team Chat
            </Button>
          </div>
        </div>
        <Users size={200} color="var(--accent-primary)" style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Leadership Widget */}
        <Card style={{ borderLeft: '5px solid var(--accent-primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--accent-primary)" /> Team Leadership
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {leader && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=F97316&color=fff`} size="lg" />
                <div>
                  <h4 style={{ margin: 0 }}>{leader.Name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Team Leader</p>
                  <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
                    <Badge variant="primary" size="sm"><Star size={10} /> {leader.points || 0} pts</Badge>
                  </div>
                </div>
              </div>
            )}
            {deputy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(deputy.Name)}&background=6366F1&color=fff`} size="lg" />
                <div>
                  <h4 style={{ margin: 0 }}>{deputy.Name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deputy Leader</p>
                  <Badge variant="info" size="sm" style={{ marginTop: '5px' }}>{deputy.points || 0} pts</Badge>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Task Widget */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckSquare size={20} color="#10B981" /> Active Tasks
            </h3>
            <Button size="sm" variant="secondary" onClick={() => navigate('/tasks')}>View All</Button>
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
            {stats.tasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pending tasks!</p>}
          </div>
        </Card>

        {/* Meeting Widget */}
        <Card style={{ background: stats.nextMeeting ? 'rgba(249,115,22,0.03)' : 'transparent' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={20} color="#6366F1" /> Next Meeting
          </h3>
          {stats.nextMeeting ? (
            <div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ padding: '10px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{new Date(stats.nextMeeting.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{new Date(stats.nextMeeting.date).getDate()}</div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px' }}>{stats.nextMeeting.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {stats.nextMeeting.time}
                  </p>
                </div>
              </div>
              <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/meetings')}>Join Video Call</Button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No meetings scheduled.</p>
          )}
        </Card>
      </div>

      {/* Quick Action Bar */}
      <Card style={{ display: 'flex', justifyContent: 'space-around', padding: '1.5rem', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/calendar')}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Zap size={20} color="#F59E0B" /></div>
          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Deadlines</span>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/leaderboard')}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Star size={20} color="#10B981" /></div>
          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Leaderboard</span>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/team')}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Users size={20} color="#6366F1" /></div>
          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Members</span>
        </div>
      </Card>
    </div>
  );
}

export default WingPortal;

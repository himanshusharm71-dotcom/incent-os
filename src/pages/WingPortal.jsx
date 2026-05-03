import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { 
  ExternalLink, Users, CheckSquare, MessageSquare, 
  Video, FolderOpen, Star, Zap, Clock, Rocket, Target, Globe, Calendar, Box, Megaphone, Shield, FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TEAM_CONFIG = {
  'Core': { color: '#F97316', icon: Shield, drive: '#', desc: 'Central Command & Strategy' },
  'Technical Support': { color: '#3B82F6', icon: Zap, drive: '#', desc: 'Digital Core & Systems Management' },
  'Event Management': { color: '#8B5CF6', icon: Calendar, drive: '#', desc: 'Experience Orchestration & Execution' },
  'Startup & Innovation': { color: '#10B981', icon: Rocket, drive: '#', desc: 'Innovation Lab & Future Research' },
  'Corporate Relations': { color: '#F59E0B', icon: Target, drive: '#', desc: 'Strategic Partnerships & Industry' },
  'Public Relations': { color: '#EC4899', icon: Globe, drive: '#', desc: 'Global Communication & Narrative' },
  'Social Media & Branding': { color: '#06B6D4', icon: MessageSquare, drive: '#', desc: 'Creative Vision & Visual Identity' },
  'Academic & Research': { color: '#6366F1', icon: FileText, drive: '#', desc: 'Knowledge Base & Scholarly Excellence' },
  'Cultural & Creative': { color: '#F43F5E', icon: Star, drive: '#', desc: 'Arts, Culture & Creative Expression' }
};

function WingPortal({ preview = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teamName } = useParams();
  const [stats, setStats] = useState({ tasks: [], members: [], nextMeeting: null });
  const [announcement, setAnnouncement] = useState("System operational. Welcome to your wing.");
  const [loading, setLoading] = useState(true);

  const targetTeam = preview ? teamName : (user?.team || 'General');
  const config = TEAM_CONFIG[targetTeam] || { color: '#F97316', icon: Users, drive: '#', desc: 'Central Operations Hub' };

  useEffect(() => {
    if (targetTeam) fetchPortalData();
    const saved = localStorage.getItem('chair_announcement');
    if (saved) setAnnouncement(saved);
  }, [targetTeam]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const { data: members } = await supabase.from('users').select('*').eq('team', targetTeam).eq('status', 'active');
      const { data: tasks } = await supabase.from('tasks').select('*').eq('team', targetTeam).order('created_at', { ascending: false }).limit(4);
      const { data: meetings } = await supabase.from('meetings').select('*').eq('team', targetTeam).gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(1);

      setStats({ members: members || [], tasks: tasks || [], nextMeeting: meetings?.[0] || null });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const leader = stats.members.find(m => m.role === 'leader');

  if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, fontWeight: '900', letterSpacing: '2px' }}>ACCESSING {targetTeam.toUpperCase()}...</div>;

  return (
    <div className="animate-fade-in perspective-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
      
      {/* ADMIN PREVIEW HEADER */}
      {preview && (
        <div style={{ background: '#1e1e1e', color: '#fff', padding: '12px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--accent-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>ADMIN PREVIEW MODE: <span style={{ color: config.color }}>{targetTeam}</span></span>
          </div>
          <Button size="sm" onClick={() => navigate('/')} style={{ background: 'var(--accent-primary)', color: '#fff' }}>Return to Mission Control</Button>
        </div>
      )}

      {/* GLOBAL CHAIR ANNOUNCEMENT FOR WING MEMBERS */}
      <div style={{ background: 'var(--accent-primary)', color: '#fff', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 8px 25px rgba(249,115,22,0.15)' }}>
        <Megaphone size={18} color="#fff" style={{ flexShrink: 0 }} />
        <marquee style={{ fontSize: '0.9rem', fontWeight: '700' }}>{announcement}</marquee>
      </div>

      <div className="card-3d floating" style={{ 
        padding: '3rem 2.5rem', 
        background: `linear-gradient(135deg, #fff 0%, ${config.color}08 100%)`, 
        borderRadius: '32px', 
        border: `1px solid ${config.color}20`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Badge variant="primary" style={{ marginBottom: '1.25rem', background: config.color, color: '#fff', border: 'none', padding: '6px 14px' }}>
            {targetTeam.toUpperCase()} COMMAND
          </Badge>
          <h1 style={{ margin: '0 0 8px', fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-2.5px' }}>
            {targetTeam.split(' ')[0]} <span style={{ color: config.color }}>Portal</span>
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', color: 'var(--text-secondary)' }}>{config.desc}</p>
        </div>
        <config.icon size={250} color={config.color} style={{ position: 'absolute', right: '-40px', top: '-40px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <Card className="card-3d" style={{ background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color={config.color} /> Personnel Command
          </h3>
          {leader ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'rgba(0,0,0,0.015)', borderRadius: '20px' }}>
              <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=${config.color.replace('#','')}&color=fff`} size="lg" />
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{leader.Name}</h4>
                <Badge style={{ background: `${config.color}15`, color: config.color }}>{leader.points || 0} pts</Badge>
              </div>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>Leader not assigned.</p>}
        </Card>

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
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{t.title}</p>
                <Badge variant={t.priority === 'High' ? 'danger' : 'warning'} size="sm">{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default WingPortal;

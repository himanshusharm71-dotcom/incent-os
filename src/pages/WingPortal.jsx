import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { 
  Users, CheckSquare, MessageSquare, Video,
  Star, Zap, Clock, Rocket, Target, Globe, Calendar,
  Box, Megaphone, Shield, FileText, Plus, X, CheckCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TEAM_CONFIG = {
  'Core':                   { color: '#F97316', icon: Shield,      desc: 'Central Command & Strategy' },
  'Technical Support':      { color: '#3B82F6', icon: Zap,         desc: 'Digital Core & Systems Management' },
  'Event Management':       { color: '#8B5CF6', icon: Calendar,    desc: 'Experience Orchestration & Execution' },
  'Startup & Innovation':   { color: '#10B981', icon: Rocket,      desc: 'Innovation Lab & Future Research' },
  'Corporate Relations':    { color: '#F59E0B', icon: Target,      desc: 'Strategic Partnerships & Industry' },
  'Public Relations':       { color: '#EC4899', icon: Globe,       desc: 'Global Communication & Narrative' },
  'Social Media & Branding':{ color: '#06B6D4', icon: MessageSquare, desc: 'Creative Vision & Visual Identity' },
  'Academic & Research':    { color: '#6366F1', icon: FileText,    desc: 'Knowledge Base & Scholarly Excellence' },
  'Cultural & Creative':    { color: '#F43F5E', icon: Star,        desc: 'Arts, Culture & Creative Expression' }
};

function WingPortal({ preview = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teamName } = useParams();
  const [stats, setStats]           = useState({ tasks: [], members: [], meetings: [] });
  const [announcement, setAnnouncement] = useState('System operational. Welcome to your wing.');
  const [loading, setLoading]       = useState(true);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState({ title: '', date: '', time: '', agenda: '' });

  const targetTeam = preview ? decodeURIComponent(teamName || '') : (user?.team || 'Core');
  const config     = TEAM_CONFIG[targetTeam] || { color: '#F97316', icon: Users, desc: 'Central Operations Hub' };
  const isAdmin    = user?.role === 'super_admin' || user?.role === 'admin';
  const canCreate  = isAdmin || user?.role === 'leader';

  useEffect(() => {
    if (targetTeam) fetchPortalData();
    const saved = localStorage.getItem('chair_announcement');
    if (saved) setAnnouncement(saved);
  }, [targetTeam]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const { data: members }  = await supabase.from('users').select('*').eq('team', targetTeam).eq('status', 'active');
      const { data: tasks }    = await supabase.from('tasks').select('*').eq('team', targetTeam).order('created_at', { ascending: false }).limit(5);
      const { data: meetings } = await supabase
        .from('meetings').select('*')
        .or(`team.eq.${targetTeam},team.eq.All Hands (Full Team)`)
        .order('date', { ascending: true }).limit(5);
      setStats({ members: members || [], tasks: tasks || [], meetings: meetings || [] });
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      const roomName = `incent-os-${slug}-${Date.now().toString().slice(-6)}`;
      const meetingDate = new Date(`${form.date}T${form.time || '00:00'}`);
      const status = meetingDate > new Date() ? 'upcoming' : 'completed';

      const { error } = await supabase.from('meetings').insert([{
        title: form.title, date: form.date, time: form.time,
        team: targetTeam, agenda: form.agenda, status,
        platform: 'Built-in Video Call', meeting_link: roomName,
        created_by: user?.Name || user?.email
      }]);
      if (error) throw error;
      setShowMeetingModal(false);
      setForm({ title: '', date: '', time: '', agenda: '' });
      fetchPortalData();
      alert('Meeting scheduled successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally { setSaving(false); }
  };

  const leader   = stats.members.find(m => m.role === 'leader');
  const deputies = stats.members.filter(m => m.role === 'deputy_leader');
  const upcoming = stats.meetings.filter(m => {
    if (!m.date) return false;
    return new Date(`${m.date}T${m.time || '00:00'}`) >= new Date();
  });

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, border: `4px solid ${config.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: config.color, fontWeight: '900', letterSpacing: '2px', fontSize: '0.9rem' }}>ACCESSING {targetTeam.toUpperCase()}...</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '6rem' }}>

      {/* ADMIN PREVIEW HEADER */}
      {preview && (
        <div style={{ background: '#1e1e1e', color: '#fff', padding: '12px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} color="var(--accent-primary)" />
            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>ADMIN PREVIEW: <span style={{ color: config.color }}>{targetTeam}</span></span>
          </div>
          <Button size="sm" onClick={() => navigate('/')} style={{ background: 'var(--accent-primary)', color: '#fff' }}>← Mission Control</Button>
        </div>
      )}

      {/* CHAIR ANNOUNCEMENT MARQUEE */}
      <div style={{ background: config.color, color: '#fff', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Megaphone size={18} color="#fff" style={{ flexShrink: 0 }} />
        <marquee style={{ fontSize: '0.9rem', fontWeight: '700' }}>{announcement}</marquee>
      </div>

      {/* PORTAL HERO */}
      <div style={{ padding: '2.5rem', background: `linear-gradient(135deg, #fff 0%, ${config.color}08 100%)`, borderRadius: '24px', border: `1px solid ${config.color}25`, position: 'relative', overflow: 'hidden' }}>
        <Badge style={{ marginBottom: '1rem', background: config.color, color: '#fff', border: 'none', padding: '6px 14px' }}>
          {targetTeam.toUpperCase()} PORTAL
        </Badge>
        <h1 style={{ margin: '0 0 8px', fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          {targetTeam.split(' ')[0]} <span style={{ color: config.color }}>Portal</span>
        </h1>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>{config.desc}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {canCreate && (
            <Button onClick={() => setShowMeetingModal(true)} style={{ background: config.color, color: '#fff', border: 'none' }} icon={<Plus size={16} />}>
              Schedule Meeting
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/meetings')} icon={<Video size={16} />}>
            All Meetings
          </Button>
          <Button variant="secondary" onClick={() => navigate('/tasks')} icon={<CheckSquare size={16} />}>
            Task Board
          </Button>
        </div>
        <config.icon size={200} color={config.color} style={{ position: 'absolute', right: '-30px', top: '-30px', opacity: 0.04 }} />
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Members',  value: stats.members.length,  icon: Users,        color: config.color },
          { label: 'Tasks',    value: stats.tasks.length,    icon: CheckSquare,  color: '#10B981' },
          { label: 'Meetings', value: upcoming.length,       icon: Calendar,     color: '#6366F1' },
          { label: 'Active',   value: stats.members.filter(m => (m.points || 0) > 0).length, icon: Star, color: '#F59E0B' },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

        {/* LEADERSHIP CARD */}
        <Card>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <Users size={18} color={config.color} /> Wing Leadership
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leader ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: `${config.color}08`, borderRadius: '16px', border: `1px solid ${config.color}20` }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=${config.color.replace('#','')}&color=fff&size=80`}
                  alt={leader.Name}
                  style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${config.color}` }}
                />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1rem' }}>{leader.Name}</div>
                  <Badge style={{ background: config.color, color: '#fff', border: 'none', fontSize: '0.65rem' }}>Wing Leader</Badge>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{leader.points || 0} pts</div>
                </div>
              </div>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Leader not assigned yet.</p>}

            {deputies.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.Name)}&background=6366F1&color=fff&size=60`}
                  alt={d.Name}
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{d.Name}</div>
                  <Badge variant="info" style={{ fontSize: '0.6rem' }}>Deputy Leader</Badge>
                </div>
              </div>
            ))}

            {stats.members.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No members found in database for this team yet.</p>}

            <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>ALL MEMBERS ({stats.members.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {stats.members.slice(0, 8).map((m, i) => (
                  <img key={i} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.Name)}&background=random&size=40`} alt={m.Name} title={m.Name} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
                ))}
                {stats.members.length > 8 && <div style={{ width: 32, height: 32, borderRadius: '50%', background: config.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '900' }}>+{stats.members.length - 8}</div>}
              </div>
            </div>
          </div>
        </Card>

        {/* UPCOMING MEETINGS */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Calendar size={18} color="#6366F1" /> Upcoming Meetings
            </h3>
            {canCreate && (
              <Button size="sm" onClick={() => setShowMeetingModal(true)} style={{ background: config.color, color: '#fff', border: 'none' }}>
                + New
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcoming.length > 0 ? upcoming.map((m, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.03)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center', minWidth: '45px', background: '#6366F1', borderRadius: '10px', padding: '6px', color: '#fff' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: '700', opacity: 0.8 }}>{m.date ? new Date(m.date + 'T00:00:00').toLocaleString('default', { month: 'short' }) : ''}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{m.date ? new Date(m.date + 'T00:00:00').getDate() : ''}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🕐 {m.time || 'TBD'} &nbsp;|&nbsp; {m.team}</div>
                  {m.agenda && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.agenda}</div>}
                  <Button size="sm" variant="primary" style={{ marginTop: '8px', fontSize: '0.7rem', padding: '4px 10px', background: '#6366F1', border: 'none', color: '#fff' }} onClick={() => navigate('/meetings')} icon={<Video size={12} />}>Join / View</Button>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <Calendar size={40} style={{ opacity: 0.1, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No upcoming meetings.</p>
                {canCreate && <Button size="sm" onClick={() => setShowMeetingModal(true)} style={{ marginTop: '0.75rem', background: config.color, color: '#fff', border: 'none' }}>Schedule One Now</Button>}
              </div>
            )}
          </div>
        </Card>

        {/* TASK MATRIX */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <CheckSquare size={18} color="#10B981" /> Task Matrix
            </h3>
            <Button size="sm" variant="secondary" onClick={() => navigate('/tasks')}>View All</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.tasks.length > 0 ? stats.tasks.map(t => (
              <div key={t.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `3px solid ${t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981'}` }}>
                <div>
                  <p style={{ margin: '0 0 3px', fontWeight: '700', fontSize: '0.9rem' }}>{t.title}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.assignedTo}</p>
                </div>
                <Badge variant={t.status === 'completed' ? 'success' : t.status === 'in-progress' ? 'warning' : 'default'} style={{ fontSize: '0.65rem' }}>
                  {t.status === 'completed' ? '✓ Done' : t.status === 'in-progress' ? '⚡ Active' : '⏳ Pending'}
                </Badge>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <CheckSquare size={36} style={{ opacity: 0.1, marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>No tasks yet.</p>
                <Button size="sm" onClick={() => navigate('/tasks')} style={{ marginTop: '0.75rem', background: config.color, color: '#fff', border: 'none' }}>Create Task</Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {showMeetingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📅 Schedule Meeting</h2>
              <button onClick={() => setShowMeetingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>MEETING TITLE *</label>
                <input placeholder="e.g. Weekly Team Sync" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>DATE *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>TIME *</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>AGENDA</label>
                <textarea rows={3} placeholder="What will be discussed?" value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.05)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                📌 This meeting will be visible to all <strong>{targetTeam}</strong> members in their portal.
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="button" onClick={() => setShowMeetingModal(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', border: 'none' }}>Cancel</Button>
                <Button type="submit" disabled={saving} style={{ flex: 1, background: config.color, color: '#fff', border: 'none' }}>{saving ? 'Saving...' : '🎥 Schedule Meeting'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default WingPortal;

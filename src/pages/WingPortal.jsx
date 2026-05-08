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

// Specialized Modules
import StartupIncubation from '../components/modules/StartupIncubation';
import TechDev from '../components/modules/TechDev';
import CorporateRelations from '../components/modules/CorporateRelations';
import EventsOperations from '../components/modules/EventsOperations';
import HiringPlacement from '../components/modules/HiringPlacement';
import PublicityMarketing from '../components/modules/PublicityMarketing';
import DesignCreative from '../components/modules/DesignCreative';
import ResearchStrategy from '../components/modules/ResearchStrategy';
import DataAnalytics from '../components/modules/DataAnalytics';
import HackathonMatrix from '../components/modules/HackathonMatrix';
import OutreachExpansion from '../components/modules/OutreachExpansion';
import DocumentationVault from '../components/modules/DocumentationVault';
import AmbassadorNetwork from '../components/modules/AmbassadorNetwork';
import ExecutiveCommand from '../components/modules/ExecutiveCommand';
import GeneralModule from '../components/modules/GeneralModule';
const TEAM_CONFIG = {
  'Core':                         { color: '#F97316', icon: Shield,      desc: 'Central Command, Strategy & Executive Governance' },
  'Startup & Incubation':         { color: '#10B981', icon: Rocket,      desc: 'Nurturing Innovation & Scaling Future Ventures' },
  'Research & Strategy':          { color: '#6366F1', icon: Target,      desc: 'Intelligence Gathering & Strategic Planning' },
  'Corporate Relations & MOU':    { color: '#F59E0B', icon: Target,   desc: 'Industry Partnerships & Formal Alliances' },
  'Outreach & Expansion':         { color: '#EC4899', icon: Globe,       desc: 'Global Network Growth & External Relations' },
  'Tech & Development':           { color: '#3B82F6', icon: Zap,    desc: 'Digital Architecture & Software Ecosystems' },
  'Data Analytics & Insights':    { color: '#06B6D4', icon: Target,   desc: 'Numerical Intelligence & Performance Metrics' },
  'Public Relations (PR)':        { color: '#8B5CF6', icon: Megaphone,   desc: 'Brand Narrative & Media Communications' },
  'Marketing & Media':            { color: '#F97316', icon: MessageSquare,      desc: 'Digital Growth, Content & Social Presence' },
  'Design & Creative':            { color: '#F43F5E', icon: Star,     desc: 'Visual Identity, UX & Aesthetic Excellence' },
  'Events & Operations':          { color: '#84CC16', icon: Calendar,    desc: 'Logistics, Orchestration & Live Execution' },
  'Competitions & Hackathon':     { color: '#EAB308', icon: Trophy,      desc: 'Competitive Excellence & Talent Scouting' },
  'Documentation':                { color: '#64748B', icon: FileText,    desc: 'Archival Integrity & Knowledge Management' },
  'Campus Ambassadors':           { color: '#A855F7', icon: Users,       desc: 'Institutional Network & Student Leadership' },
  'Placement & Startup Hiring':   { color: '#14B8A6', icon: Target,   desc: 'Career Pathways & Talent Acquisition' }
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
    if (targetTeam) {
        fetchPortalData();
        
        // 🛰️ REALTIME SUBSCRIPTIONS
        const usersSub = supabase.channel(`portal-users-${targetTeam}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `team=eq.${targetTeam}` }, fetchPortalData)
            .subscribe();

        const tasksSub = supabase.channel(`portal-tasks-${targetTeam}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `team=eq.${targetTeam}` }, fetchPortalData)
            .subscribe();

        const meetingsSub = supabase.channel(`portal-meetings-${targetTeam}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, fetchPortalData)
            .subscribe();

        return () => {
            supabase.removeChannel(usersSub);
            supabase.removeChannel(tasksSub);
            supabase.removeChannel(meetingsSub);
        };
    }
    const saved = localStorage.getItem('chair_announcement');
    if (saved) setAnnouncement(saved);
  }, [targetTeam]);

  const fetchPortalData = async () => {
    try {
      const { data: members }  = await supabase.from('users').select('*').eq('team', targetTeam).eq('status', 'active');
      const { data: tasks }    = await supabase.from('tasks').select('*').eq('team', targetTeam).order('created_at', { ascending: false }).limit(5);
      const { data: meetings } = await supabase
        .from('meetings').select('*')
        .or(`team.eq."${targetTeam}",team.eq."All Hands (Full Team)"`)
        .order('date', { ascending: true }).limit(5);
      
      setStats({ members: members || [], tasks: tasks || [], meetings: meetings || [] });
    } catch (err) { 
        console.error("Portal Data Sync Error:", err); 
    } finally { 
        setLoading(false); 
    }
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
      alert('Meeting scheduled successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally { setSaving(false); }
  };

  const leader   = stats.members.find(m => m.role === 'leader');
  const deputies = stats.members.filter(m => m.role === 'deputy_leader');
  const upcoming = stats.meetings.filter(m => {
    if (!m.date) return false;
    const now = new Date();
    const meetTime = new Date(`${m.date}T${m.time || '00:00'}`);
    return meetTime >= now || m.status === 'upcoming';
  });

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, border: `4px solid ${config.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: config.color, fontWeight: '900', letterSpacing: '2px', fontSize: '0.9rem' }}>ACCESSING {targetTeam.toUpperCase()}...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '6rem' }}>

      {/* ADMIN PREVIEW HEADER */}
      {preview && (
        <div style={{ background: '#1e1e1e', color: '#fff', padding: '12px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} color="var(--accent-primary)" />
            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>ADMIN PREVIEW: <span style={{ color: config.color }}>{targetTeam}</span></span>
          </div>
          <Button size="sm" onClick={() => navigate('/')} style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px' }}>← Mission Control</Button>
        </div>
      )}

      {/* CHAIR ANNOUNCEMENT MARQUEE */}
      <div style={{ background: config.color, color: '#fff', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: `0 8px 20px ${config.color}20` }}>
        <Megaphone size={18} color="#fff" style={{ flexShrink: 0 }} />
        <marquee style={{ fontSize: '0.9rem', fontWeight: '700' }}>{announcement}</marquee>
      </div>

      {/* PORTAL HERO */}
      <div className="card-3d bg-gradient-4d" style={{ padding: '3rem', background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${config.color}15 100%)`, borderRadius: '28px', border: `1px solid ${config.color}20`, position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
        <Badge style={{ marginBottom: '1.25rem', background: config.color, color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '0.65rem' }}>
          {targetTeam.toUpperCase()} WING CORE
        </Badge>
        <h1 style={{ margin: '0 0 10px', fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>
          {targetTeam} <span style={{ color: config.color }}>Hub</span>
        </h1>
        <p style={{ margin: '0 0 2rem', color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.5 }}>{config.desc}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {canCreate && (
            <Button onClick={() => setShowMeetingModal(true)} style={{ background: config.color, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px' }} icon={<Plus size={16} />}>
              Schedule Meeting
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/meetings')} icon={<Video size={16} />} style={{ borderRadius: '14px', padding: '12px 24px' }}>
            Meeting Logs
          </Button>
          <Button variant="secondary" onClick={() => navigate('/tasks')} icon={<CheckSquare size={16} />} style={{ borderRadius: '14px', padding: '12px 24px' }}>
            Task Matrix
          </Button>
        </div>
        <config.icon size={280} color={config.color} className="floating-4d" style={{ position: 'absolute', right: '-40px', top: '-40px', opacity: 0.06, transform: 'rotate(-10deg)' }} />
      </div>

      {(() => {
        switch(targetTeam) {
          case 'Core': return <ExecutiveCommand team={targetTeam} />;
          case 'Startup & Incubation': return <StartupIncubation team={targetTeam} />;
          case 'Tech & Development': return <TechDev team={targetTeam} />;
          case 'Corporate Relations & MOU': return <CorporateRelations team={targetTeam} />;
          case 'Events & Operations': return <EventsOperations team={targetTeam} />;
          case 'Placement & Startup Hiring': return <HiringPlacement team={targetTeam} />;
          case 'Public Relations (PR)': 
          case 'Marketing & Media': return <PublicityMarketing team={targetTeam} />;
          case 'Design & Creative': return <DesignCreative team={targetTeam} />;
          case 'Research & Strategy': return <ResearchStrategy team={targetTeam} />;
          case 'Data Analytics & Insights': return <DataAnalytics team={targetTeam} />;
          case 'Competitions & Hackathon': return <HackathonMatrix team={targetTeam} />;
          case 'Outreach & Expansion': return <OutreachExpansion team={targetTeam} />;
          case 'Documentation': return <DocumentationVault team={targetTeam} />;
          case 'Campus Ambassadors': return <AmbassadorNetwork team={targetTeam} />;
          default: return <GeneralModule team={targetTeam} />;
        }
      })()}

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Wing Personnel', value: stats.members.length, icon: Users, color: config.color },
          { label: 'Pending Tasks', value: stats.tasks.filter(t => t.status !== 'completed').length, icon: CheckSquare, color: '#10B981' },
          { label: 'Upcoming Syncs', value: upcoming.length, icon: Calendar, color: '#6366F1' },
          { label: 'Top Performers', value: stats.members.filter(m => (m.points || 0) > 50).length, icon: Star, color: '#F59E0B' },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '24px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

        {/* LEADERSHIP CARD */}
        <Card style={{ borderRadius: '28px' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '800' }}>
            <Shield size={20} color={config.color} /> Wing Leadership
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leader ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: `${config.color}08`, borderRadius: '20px', border: `1px solid ${config.color}15` }}>
                <div style={{ position: 'relative' }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.Name)}&background=${config.color.replace('#','')}&color=fff&size=100`}
                        alt={leader.Name}
                        style={{ width: 64, height: 64, borderRadius: '50%', border: `4px solid #fff`, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                    />
                    <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#10B981', width: 14, height: 14, borderRadius: '50%', border: '3px solid #fff' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{leader.Name}</div>
                  <Badge style={{ background: config.color, color: '#fff', border: 'none', fontSize: '0.6rem', padding: '2px 10px', borderRadius: '10px' }}>WING COMMANDER</Badge>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '700' }}>⭐ {leader.points || 0} POINTS</div>
                </div>
              </div>
            ) : <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px dashed var(--border-light)' }}>Leader not assigned.</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {deputies.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '16px', border: '1px solid var(--border-light)', background: '#fff' }}>
                    <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.Name)}&background=6366F1&color=fff&size=60`}
                    alt={d.Name}
                    style={{ width: 36, height: 36, borderRadius: '50%' }}
                    />
                    <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.Name}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700' }}>DEPUTY</div>
                    </div>
                </div>
                ))}
            </div>

            <div style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '20px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Personnel ({stats.members.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {stats.members.slice(0, 10).map((m, i) => (
                  <img key={i} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.Name)}&background=random&size=40`} alt={m.Name} title={m.Name} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
                ))}
                {stats.members.length > 10 && <div style={{ width: 36, height: 36, borderRadius: '50%', background: config.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '900' }}>+{stats.members.length - 10}</div>}
              </div>
            </div>
          </div>
        </Card>

        {/* UPCOMING MEETINGS */}
        <Card style={{ borderRadius: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '800' }}>
              <Video size={20} color="#6366F1" /> Wing Syncs
            </h3>
            {canCreate && (
              <Button size="sm" onClick={() => setShowMeetingModal(true)} style={{ background: config.color, color: '#fff', border: 'none', borderRadius: '8px' }}>
                + Schedule
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcoming.length > 0 ? upcoming.map((m, i) => (
              <div key={i} style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.15)', background: 'linear-gradient(to right, rgba(99,102,241,0.05), transparent)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center', minWidth: '50px', background: '#6366F1', borderRadius: '12px', padding: '8px', color: '#fff', boxShadow: '0 8px 15px rgba(99,102,241,0.2)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.9, textTransform: 'uppercase' }}>{m.date ? new Date(m.date + 'T00:00:00').toLocaleString('default', { month: 'short' }) : ''}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{m.date ? new Date(m.date + 'T00:00:00').getDate() : ''}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '900', fontSize: '1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>🕐 {m.time || 'TBD'} &nbsp;•&nbsp; {m.team === 'All Hands (Full Team)' ? '🌍 Global' : '👥 Wing Only'}</div>
                  {m.agenda && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>"{m.agenda}"</div>}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                    <Button size="sm" variant="primary" style={{ fontSize: '0.75rem', padding: '6px 14px', background: '#6366F1', border: 'none', color: '#fff', borderRadius: '10px' }} onClick={() => navigate('/meetings')} icon={<Video size={14} />}>Join Call</Button>
                    <Button size="sm" variant="secondary" style={{ fontSize: '0.75rem', padding: '6px 14px', borderRadius: '10px' }} onClick={() => navigate('/meetings')}>Details</Button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.01)', borderRadius: '24px', border: '1px dashed var(--border-light)' }}>
                <Calendar size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>No active syncs scheduled.</p>
                {canCreate && <Button size="sm" onClick={() => setShowMeetingModal(true)} style={{ marginTop: '1rem', background: config.color, color: '#fff', border: 'none', borderRadius: '10px' }}>Host a Meeting</Button>}
              </div>
            )}
          </div>
        </Card>

        {/* TASK MATRIX */}
        <Card style={{ borderRadius: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '800' }}>
              <CheckSquare size={20} color="#10B981" /> Task Matrix
            </h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/tasks')} style={{ fontSize: '0.75rem', fontWeight: '700' }}>Open Board →</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.tasks.length > 0 ? stats.tasks.map(t => (
              <div key={t.id} style={{ 
                padding: '14px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '16px', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                borderLeft: `5px solid ${t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981'}`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t.assignedTo}</p>
                  </div>
                </div>
                <Badge variant={t.status === 'completed' ? 'success' : t.status === 'in-progress' ? 'warning' : 'default'} style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '8px' }}>
                  {t.status === 'completed' ? 'COMPLETED' : t.status === 'in-progress' ? 'IN PROGRESS' : 'PENDING'}
                </Badge>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.01)', borderRadius: '24px', border: '1px dashed var(--border-light)' }}>
                <CheckSquare size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>Task matrix is clear.</p>
                <Button size="sm" onClick={() => navigate('/tasks')} style={{ marginTop: '1rem', background: config.color, color: '#fff', border: 'none', borderRadius: '10px' }}>Deploy New Task</Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {showMeetingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <Card style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}><Calendar size={24} color="#6366F1" /></div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Schedule Sync</h2>
              </div>
              <button onClick={() => setShowMeetingModal(false)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>MEETING AGENDA/TITLE *</label>
                <input placeholder="e.g. Critical Performance Review" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '14px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>DATE *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '14px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>TIME *</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '14px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>KEY DISCUSSION POINTS</label>
                <textarea rows={3} placeholder="What needs to be addressed?" value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '14px', resize: 'none' }} />
              </div>
              <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.05)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.1)', fontSize: '0.85rem', color: '#4338CA', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>This session will be broadcasted to all <strong>{targetTeam}</strong> members. Links will be generated automatically.</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Button type="button" onClick={() => setShowMeetingModal(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', border: 'none', borderRadius: '14px', padding: '14px' }}>Discard</Button>
                <Button type="submit" disabled={saving} style={{ flex: 1, background: config.color, color: '#fff', border: 'none', borderRadius: '14px', padding: '14px', fontWeight: '800' }}>{saving ? 'PROVISIONING...' : 'CONFIRM SYNC'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Minimal Info Icon for internal use
const Info = ({ size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default WingPortal;

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { 
  CheckCircle, Clock, Users, Activity, Crown, Star, Award, 
  Shield, Calendar, FileText, MessageSquare, Terminal, 
  Settings, Zap, AlertCircle, BarChart3, Rocket, Target, Globe, Box, Megaphone, Send, ArrowRight, LayoutDashboard, Database
} from 'lucide-react';
import himanshuImg from '../assets/himanshu_sharma.jpg';
import pratishImg from '../assets/pratish_rawat.jpg';
import adityaImg from '../assets/aditya_kapoor.jpg';

const getLeadershipImage = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('himanshu')) return himanshuImg;
  if (n.includes('pratish'))  return pratishImg;
  if (n.includes('aditya'))   return adityaImg;
  return null;
};

const getLeadershipTitle = (name, role) => {
  const n = (name || '').toLowerCase();
  if (n.includes('himanshu')) return 'Chair (Super Admin)';
  if (n.includes('pratish'))  return 'Incubation Head (Admin)';
  if (n.includes('aditya'))   return 'Chief Coordinator (Admin)';
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'admin')       return 'Admin';
  if (role === 'leader')      return 'Team Leader';
  if (role === 'deputy_leader') return 'Deputy Leader';
  return role || 'Member';
};

function PersonCard({ person, size = 'md', badgeVariant = 'primary' }) {
  const imgSrc = getLeadershipImage(person.Name);
  const avatarSize = size === 'lg' ? 110 : size === 'md' ? 80 : 60;

  return (
    <div className="card-3d floating" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
      padding: '2rem 1.5rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
      borderRadius: '28px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.4)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden',
        border: `4px solid ${badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)'}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 2, background: '#fff'
      }}>
        {imgSrc
          ? <img src={imgSrc} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.Name || 'U')}&background=F97316&color=fff&size=128`} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        }
      </div>
      <div style={{ zIndex: 2 }}>
        <p style={{ margin: '0 0 4px', fontWeight: '900', fontSize: size === 'lg' ? '1.25rem' : '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{person.Name}</p>
        <Badge variant={badgeVariant} style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '0.65rem' }}>{getLeadershipTitle(person.Name, person.role).toUpperCase()}</Badge>
      </div>
      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.03 }}>
        <Shield size={80} color="var(--accent-primary)" />
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, tasksCompleted: 0, pendingTasks: 0, avgPerformance: 0, activeMeetings: 0 });
  const [announcement, setAnnouncement] = useState("System online. Organizational core operational.");
  const [newMsg, setNewMsg] = useState("");
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  useEffect(() => {
    fetchDashboardData();
    const saved = localStorage.getItem('chair_announcement');
    if (saved) setAnnouncement(saved);
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: tasks } = await supabase.from('tasks').select('status');
      const { data: meetings } = await supabase.from('meetings').select('id');

      const completed = tasks?.filter(t => t.status === 'completed').length || 0;
      const pending = tasks?.filter(t => t.status === 'pending').length || 0;

      setStats({
        totalMembers: userCount || 0,
        tasksCompleted: completed,
        pendingTasks: pending,
        avgPerformance: userCount > 0 ? Math.round((completed / (completed + pending || 1)) * 100) : 0,
        activeMeetings: meetings?.length || 0
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleBroadcast = () => {
    if (!newMsg) return;
    setAnnouncement(newMsg);
    localStorage.setItem('chair_announcement', newMsg);
    setNewMsg("");
    alert("Global Broadcast Updated!");
  };

  const executiveTeam = [
    { Name: 'Himanshu Sharma', role: 'super_admin' },
    { Name: 'Pratish Rawat', role: 'admin' },
    { Name: 'Aditya Kapoor', role: 'admin' }
  ];

  const wings = [
    { name: 'Technical Support', color: '#3B82F6', icon: Zap, desc: 'Systems & Infrastructure' },
    { name: 'Event Management', color: '#8B5CF6', icon: Calendar, desc: 'Planning & Execution' },
    { name: 'Startup & Innovation', color: '#10B981', icon: Rocket, desc: 'Research & Development' },
    { name: 'Corporate Relations', color: '#F59E0B', icon: Target, desc: 'B2B & Partnerships' },
    { name: 'Public Relations', color: '#EC4899', icon: Globe, desc: 'Media & Communications' },
    { name: 'Social Media & Branding', color: '#06B6D4', icon: MessageSquare, desc: 'Identity & Growth' }
  ];

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
       <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #F97316', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
       <p style={{ color: 'var(--accent-primary)', fontWeight: '900', letterSpacing: '4px', fontSize: '0.8rem' }}>INITIALIZING COMMAND CENTER</p>
       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>
      
      {/* ── TOP HUD (Live Marquee) ── */}
      <div style={{ 
        background: '#1e1e1e', color: '#fff', padding: '10px 20px', borderRadius: '18px', 
        display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px', flexShrink: 0 }}>
          <Activity size={16} /> LIVE TELEMETRY
        </div>
        <marquee style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
          {announcement} • SYSTEM HEALTH: 99.9% • ACTIVE SESSIONS: {stats.totalMembers} • PENDING OPERATIONS: {stats.pendingTasks}
        </marquee>
      </div>

      {/* ── HERO COMMAND CENTER ── */}
      <div className="card-3d" style={{ 
        padding: '4rem 3rem', background: 'linear-gradient(145deg, #ffffff 0%, #fffbf0 100%)', 
        borderRadius: '40px', border: '1px solid rgba(249,115,22,0.15)', position: 'relative', overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(249,115,22,0.08)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Badge variant="primary" style={{ marginBottom: '1.5rem', padding: '8px 18px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: '800' }}>
            ORGANIZATIONAL CORE V3.0
          </Badge>
          <h1 style={{ margin: '0 0 12px', fontSize: '4.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-3px', lineHeight: 0.9 }}>
            Command <br /> <span style={{ color: 'var(--accent-primary)' }}>Center</span>
          </h1>
          <p style={{ margin: '1rem 0 2rem', color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', fontWeight: '500', lineHeight: 1.6 }}>
            Seamlessly managing <strong>{stats.totalMembers} team members</strong> across 9 wings. Real-time operations and executive monitoring active.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => navigate('/communication')} variant="primary" style={{ padding: '15px 30px', borderRadius: '16px' }} icon={<MessageSquare size={18} />}>Join Discussion</Button>
            <Button onClick={() => navigate('/analytics')} variant="secondary" style={{ padding: '15px 30px', borderRadius: '16px' }} icon={<BarChart3 size={18} />}>View Telemetry</Button>
          </div>
        </div>
        <LayoutDashboard size={400} color="var(--accent-primary)" style={{ position: 'absolute', right: '-80px', top: '-50px', opacity: 0.03, transform: 'rotate(-10deg)' }} />
      </div>

      {/* ── QUICK STATS MATRIX ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'TOTAL PERSONNEL', value: stats.totalMembers, icon: Users, color: '#6366F1', desc: 'Active members registered' },
          { label: 'TASKS COMPLETED', value: stats.tasksCompleted, icon: CheckCircle, color: '#10B981', desc: 'Operations finalized' },
          { label: 'PENDING OPS', value: stats.pendingTasks, icon: Clock, color: '#F59E0B', desc: 'Currently in progress' },
          { label: 'WING MEETINGS', value: stats.activeMeetings, icon: Calendar, color: '#F43F5E', desc: 'Scheduled syncs' },
        ].map((s, i) => (
          <Card key={i} className="card-3d" style={{ padding: '2rem', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '18px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={26} color={s.color} />
              </div>
              <Badge style={{ background: `${s.color}10`, color: s.color, border: 'none', fontSize: '0.6rem' }}>LIVE</Badge>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{s.value}</h3>
            <p style={{ margin: '0 0 10px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.8 }}>{s.desc}</p>
          </Card>
        ))}
      </div>

      {/* ── CHAIR'S BROADCAST (ADMIN CONTROL) ── */}
      {isAdmin && (
        <Card style={{ 
          padding: '2.5rem', border: '2px solid var(--accent-primary)', borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.05) 0%, #fff 100%)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ padding: '10px', background: 'var(--accent-primary)', borderRadius: '12px', color: '#fff' }}>
               <Megaphone size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Global Executive Broadcast</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Announce updates to all {stats.totalMembers} members instantly.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', background: '#fff', padding: '8px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-light)' }}>
            <input 
              type="text" 
              placeholder={`Communicate with your ${stats.totalMembers} members...`} 
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '15px 20px', fontSize: '1rem', outline: 'none' }}
            />
            <Button onClick={handleBroadcast} style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '14px', padding: '0 30px' }} icon={<Send size={18} />}>Broadcast</Button>
          </div>
        </Card>
      )}

      {/* ── WING PORTALS ACCESS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px' }}><Database size={20} color="var(--text-primary)" /></div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Wing Portals</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate('/team')} style={{ fontSize: '0.85rem' }}>See All Wings <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {wings.map((wing, i) => (
            <Card key={i} className="card-3d" style={{ 
              padding: '2rem', borderRadius: '32px', background: '#fff', border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ width: 50, height: 50, borderRadius: '14px', background: `${wing.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <wing.icon size={24} color={wing.color} />
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '800' }}>{wing.name}</h4>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{wing.desc}</p>
                <button 
                  style={{ 
                    background: 'var(--text-primary)', color: '#fff', width: '100%', padding: '12px', 
                    border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem',
                    transition: 'all 0.3s'
                  }} 
                  onMouseOver={(e) => e.target.style.background = wing.color}
                  onMouseOut={(e) => e.target.style.background = 'var(--text-primary)'}
                  onClick={() => navigate(`/portal/${wing.name}`)}
                >
                  ACCESS PORTAL
                </button>
              </div>
              <wing.icon size={120} color={wing.color} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.03 }} />
            </Card>
          ))}
        </div>
      </div>

      {/* ── EXECUTIVE LEADERSHIP MATRIX ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'rgba(249,115,22,0.1)', borderRadius: '12px' }}><Crown size={22} color="var(--accent-primary)" /></div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Executive Command</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {executiveTeam.map((person, i) => (
            <PersonCard key={i} person={person} size={i === 0 ? 'lg' : 'md'} badgeVariant={i === 0 ? 'danger' : 'primary'} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
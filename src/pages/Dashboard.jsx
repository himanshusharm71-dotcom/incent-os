import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { CheckCircle, Clock, Users, Activity, Crown, Star, Award, Shield, Calendar, FileText, MessageSquare } from 'lucide-react';
import himanshuImg from '../assets/himanshu_sharma.jpg';
import pratishImg from '../assets/pratish_rawat.jpg';
import adityaImg from '../assets/aditya_kapoor.jpg';

// ── helpers ───────────────────────────────────────────────
const getLeadershipImage = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('himanshu')) return himanshuImg;
  if (n.includes('pratish'))  return pratishImg;
  if (n.includes('aditya'))   return adityaImg;
  return null; // fallback to Avatar initials
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

// ── reusable "person card" ─────────────────────────────────
function PersonCard({ person, size = 'md', badgeVariant = 'primary', badgeLabel }) {
  const imgSrc = getLeadershipImage(person.Name);
  const label = badgeLabel || getLeadershipTitle(person.Name, person.role);

  const avatarSize = size === 'lg' ? 96 : size === 'md' ? 72 : 56;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      padding: '1.25rem 1rem',
      background: 'rgba(249,115,22,0.04)',
      border: '1px solid rgba(249,115,22,0.15)',
      borderRadius: '16px',
      transition: 'box-shadow 0.2s, transform 0.2s',
      minWidth: size === 'lg' ? '160px' : '130px',
      textAlign: 'center',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(249,115,22,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: avatarSize, height: avatarSize,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)'}`,
        flexShrink: 0,
        boxShadow: '0 4px 15px rgba(249,115,22,0.25)',
      }}>
        {imgSrc
          ? <img src={imgSrc} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.Name || 'U')}&background=F97316&color=fff&size=128`}
              alt={person.Name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        }
      </div>
      <p style={{ margin: 0, fontWeight: '700', fontSize: size === 'lg' ? '1rem' : '0.875rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
        {person.Name}
      </p>
      <span style={{
        fontSize: '0.7rem', fontWeight: '600', padding: '3px 10px',
        borderRadius: '20px', letterSpacing: '0.3px',
        background: badgeVariant === 'danger' ? 'rgba(239,68,68,0.12)' : 'rgba(249,115,22,0.12)',
        color: badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)',
        border: badgeVariant === 'danger' ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(249,115,22,0.25)',
      }}>
        {label}
      </span>
      {person.points !== undefined && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Star size={10} color="#F59E0B" /> {person.points || 0} pts
        </span>
      )}
    </div>
  );
}

// ── section title ─────────────────────────────────────────
function SectionTitle({ icon: Icon, label, color = 'var(--accent-primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid rgba(249,115,22,0.12)' }}>
      <div style={{ padding: '6px', background: 'rgba(249,115,22,0.1)', borderRadius: '8px' }}>
        <Icon size={18} color={color} />
      </div>
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{label}</h2>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    tasksCompleted: 0,
    pendingTasks: 0,
    avgPerformance: 0,
    recentUsers: []
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const isTeamRestricted = user?.role !== 'super_admin' && user?.role !== 'admin';
      
      // 1. Members count
      let userQuery = supabase.from('users').select('*', { count: 'exact', head: true });
      if (isTeamRestricted) userQuery = userQuery.eq('team', user.team);
      const { count: userCount } = await userQuery;
      
      // 2. Tasks stats
      let taskQuery = supabase.from('tasks').select('status, team');
      if (isTeamRestricted) taskQuery = taskQuery.eq('team', user.team);
      const { data: tasks } = await taskQuery;
      
      const completed = tasks?.filter(t => t.status === 'completed').length || 0;
      const pending = tasks?.filter(t => t.status === 'pending').length || 0;

      // 3. All Users for leadership display
      const { data: allUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });

      setStats({
        totalMembers: userCount || 0,
        tasksCompleted: completed,
        pendingTasks: pending,
        avgPerformance: userCount > 0 ? Math.round((completed / (completed + pending || 1)) * 100) : 0,
        recentUsers: allUsers || []
      });

      // 4. Recent activity filtered
      let actQuery = supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(5);
      if (isTeamRestricted) actQuery = actQuery.eq('team', user.team);
      const { data: recentTasks } = await actQuery;

      const recent = (recentTasks || []).map((t, i) => ({
        id: i + 1,
        text: `Task "${t.title}" — ${t.status} (${t.assigned_to || 'Unassigned'})`,
        time: t.created_at ? new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Unknown'
      }));
      if (recent.length === 0) {
        recent.push({ id: 1, text: 'No recent activity in your team.', time: 'Now' });
      }
      setRecentActivity(recent);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      // Ensure stats don't stay null
      setStats(prev => ({ ...prev, recentUsers: [] }));
    }
  };

  const getUserPoints = (name) => {
    const u = stats.recentUsers.find(user => user.Name?.toLowerCase().includes(name.toLowerCase()));
    return u ? (u.points || 0) : 0;
  };

  const executiveTeam = [
    { Name: 'Himanshu Sharma', role: 'super_admin', points: getUserPoints('himanshu') },
    { Name: 'Pratish Rawat', role: 'admin', points: getUserPoints('pratish') },
    { Name: 'Aditya Kapoor', role: 'admin', points: getUserPoints('aditya') }
  ];

  const teamLeaders = stats.recentUsers.filter(u => u.role === 'leader').slice(0, 4);
  const deputies = stats.recentUsers.filter(u => u.role === 'deputy_leader').slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Welcome ── */}
      <div style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.02) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(249,115,22,0.15)',
      }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.9rem', fontWeight: '800' }}>
          Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.Name || user?.name || 'Leader'}</span> 👋
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Here's what's happening across all INCENT teams today.</p>
      </div>

      {/* ── App Launchpad (OS Feel) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        {[
          { name: 'Directory', icon: Users, path: '/team', color: '#6366F1' },
          { name: 'Tasks', icon: CheckCircle, path: '/tasks', color: '#10B981' },
          { name: 'Meetings', icon: Calendar, path: '/meetings', color: '#F59E0B' },
          { name: 'Drive', icon: FileText, path: '/files', color: '#3B82F6' },
          { name: 'Chat', icon: MessageSquare, path: '/communication', color: 'var(--accent-primary)' },
          { name: 'Analytics', icon: Activity, path: '/analytics', color: '#EC4899' },
        ].map((app, i) => (
          <div 
            key={i} 
            onClick={() => navigate(app.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              padding: '1.25rem 1rem', background: 'var(--bg-card)', borderRadius: '16px',
              border: '1px solid var(--border-light)', cursor: 'pointer',
              transition: 'all 0.2s', textAlign: 'center'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '12px', background: `${app.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <app.icon size={22} color={app.color} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{app.name}</span>
          </div>
        ))}
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Members',    value: stats.totalMembers,    icon: Users,         bg: 'rgba(249,115,22,0.1)',  color: 'var(--accent-primary)' },
          { label: 'Tasks Completed',  value: stats.tasksCompleted,  icon: CheckCircle,  bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
          { label: 'Pending Tasks',    value: stats.pendingTasks,    icon: Clock,         bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
          { label: 'Avg. Performance', value: `${stats.avgPerformance}%`, icon: Activity, bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
        ].map((s, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '0.875rem', background: s.bg, borderRadius: '12px', flexShrink: 0 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>{s.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Core Leadership ── */}
      <Card>
        <SectionTitle icon={Crown} label="Core Leadership" color="#F59E0B" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {executiveTeam.map((m, i) => (
            <PersonCard key={i} person={m} size="lg" badgeVariant={m.role === 'super_admin' ? 'danger' : 'primary'} />
          ))}
        </div>
      </Card>

      {/* ── Team Leaders ── */}
      <Card>
        <SectionTitle icon={Award} label="Team Leaders" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {teamLeaders.length > 0 ? teamLeaders.map((m, i) => (
            <PersonCard key={i} person={m} size="md" />
          )) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Leaders will appear once assigned from the Approval Queue.</p>
          )}
        </div>
      </Card>

      {/* ── Deputy Leaders ── */}
      <Card>
        <SectionTitle icon={Shield} label="Deputy Leaders" color="#6366F1" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
          {deputies.length > 0 ? deputies.map((m, i) => (
            <PersonCard key={i} person={m} size="sm" badgeVariant="info" />
          )) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Deputy leaders will appear once assigned.</p>
          )}
        </div>
      </Card>

    </div>
  );
}

export default Dashboard;
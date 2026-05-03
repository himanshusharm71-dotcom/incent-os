import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { 
  CheckCircle, Clock, Users, Activity, Crown, Star, Award, 
  Shield, Calendar, FileText, MessageSquare, Terminal, 
  Settings, Zap, AlertCircle, BarChart3
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

function PersonCard({ person, size = 'md', badgeVariant = 'primary', badgeLabel }) {
  const imgSrc = getLeadershipImage(person.Name);
  const label = badgeLabel || getLeadershipTitle(person.Name, person.role);
  const avatarSize = size === 'lg' ? 96 : size === 'md' ? 72 : 56;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      padding: '1.25rem 1rem', background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)',
      borderRadius: '16px', minWidth: size === 'lg' ? '160px' : '130px', textAlign: 'center'
    }}>
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden',
        border: `3px solid ${badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)'}`,
        boxShadow: '0 4px 15px rgba(249,115,22,0.25)',
      }}>
        {imgSrc
          ? <img src={imgSrc} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.Name || 'U')}&background=F97316&color=fff&size=128`} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        }
      </div>
      <p style={{ margin: 0, fontWeight: '700', fontSize: size === 'lg' ? '1rem' : '0.875rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{person.Name}</p>
      <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: badgeVariant === 'danger' ? 'rgba(239,68,68,0.12)' : 'rgba(249,115,22,0.12)', color: badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)' }}>{label}</span>
      {person.points !== undefined && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Star size={10} color="#F59E0B" /> {person.points || 0} pts
        </span>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, label, color = 'var(--accent-primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid rgba(249,115,22,0.12)' }}>
      <div style={{ padding: '6px', background: 'rgba(249,115,22,0.1)', borderRadius: '8px' }}><Icon size={18} color={color} /></div>
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{label}</h2>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, tasksCompleted: 0, pendingTasks: 0, avgPerformance: 0, recentUsers: [] });
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const isTeamRestricted = !isAdmin;
      
      let userQuery = supabase.from('users').select('*', { count: 'exact', head: true });
      if (isTeamRestricted && user?.team) userQuery = userQuery.eq('team', user.team);
      const { count: userCount } = await userQuery;
      
      let taskQuery = supabase.from('tasks').select('status, team');
      if (isTeamRestricted && user?.team) taskQuery = taskQuery.eq('team', user.team);
      const { data: tasks } = await taskQuery;
      
      const completed = (tasks || []).filter(t => t.status === 'completed').length || 0;
      const pending = (tasks || []).filter(t => t.status === 'pending').length || 0;

      const { data: allUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });

      setStats({
        totalMembers: userCount || 0,
        tasksCompleted: completed,
        pendingTasks: pending,
        avgPerformance: userCount > 0 ? Math.round((completed / (completed + pending || 1)) * 100) : 0,
        recentUsers: allUsers || []
      });

    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-primary)', fontWeight: '700' }}>INITIALIZING INCENT OS KERNEL...</div>;

  const getUserPoints = (name) => {
    const u = stats.recentUsers.find(user => user.Name?.toLowerCase().includes(name.toLowerCase()));
    return u ? (u.points || 0) : 0;
  };

  const executiveTeam = [
    { Name: 'Himanshu Sharma', role: 'super_admin', points: getUserPoints('himanshu') },
    { Name: 'Pratish Rawat', role: 'admin', points: getUserPoints('pratish') },
    { Name: 'Aditya Kapoor', role: 'admin', points: getUserPoints('aditya') }
  ];

  const teamLeaders = stats.recentUsers
    .filter(u => u.role === 'leader')
    .filter(u => isAdmin ? true : u.team === user?.team)
    .slice(0, 6);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      {/* Welcome & Banner */}
      <div style={{ 
        padding: '2.5rem', 
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)', 
        borderRadius: '24px', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Badge variant="primary" style={{ marginBottom: '1rem', background: 'rgba(249,115,22,0.2)', color: 'var(--accent-primary)' }}>System Operational</Badge>
          <h1 style={{ margin: '0 0 8px', fontSize: '2.2rem', fontWeight: '800' }}>Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.Name?.split(' ')[0] || 'Leader'}</span></h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '1.1rem' }}>{isAdmin ? "INCENT OS Executive Command active." : `Accessing ${user?.team} Portal.`}</p>
        </div>
        <Zap size={150} color="var(--accent-primary)" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
      </div>

      {/* Admin Command Center (Exclusive to Chair/Admins) */}
      {isAdmin && (
        <Card style={{ border: '2.5px solid var(--accent-primary)', background: 'rgba(249,115,22,0.02)' }}>
          <SectionTitle icon={Shield} label="Super Admin Command Center" color="var(--accent-primary)" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kernel Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: '700', fontSize: '0.9rem' }}>
                <Activity size={14} /> Database Online
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: '700', fontSize: '0.9rem' }}>
                <Zap size={14} /> Latency: 24ms
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', gridColumn: 'span 2' }}>
              {[
                { label: 'Broadcast Message', icon: MessageSquare, path: '/communication', color: 'var(--accent-primary)' },
                { label: 'Approval Queue', icon: AlertCircle, path: '/approvals', color: '#F59E0B' },
                { label: 'Reset Points', icon: BarChart3, path: '/analytics', color: '#EF4444' },
                { label: 'OS Settings', icon: Settings, path: '/settings', color: '#6366F1' },
              ].map((btn, i) => (
                <button key={i} onClick={() => navigate(btn.path)} style={{ 
                  flex: 1, minWidth: '160px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', 
                  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
                  fontSize: '0.85rem', fontWeight: '600', transition: '0.2s' 
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <btn.icon size={16} color={btn.color} /> {btn.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Total Members', value: stats.totalMembers, icon: Users, color: '#6366F1' },
          { label: 'Tasks Done', value: stats.tasksCompleted, icon: CheckCircle, color: '#10B981' },
          { label: 'Pending', value: stats.pendingTasks, icon: Clock, color: '#F59E0B' },
          { label: 'Efficiency', value: `${stats.avgPerformance}%`, icon: Activity, color: '#3B82F6' },
        ].map((s, i) => (
          <Card key={i} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 50, height: 50, borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={24} color={s.color} /></div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.7rem', fontWeight: '800' }}>{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Leadership View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card>
            <SectionTitle icon={Crown} label="Core Leadership" color="#F59E0B" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
              {executiveTeam.map((m, i) => <PersonCard key={i} person={m} size="lg" badgeVariant={m.role === 'super_admin' ? 'danger' : 'primary'} />)}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={Award} label={isAdmin ? "Top Performers (Global)" : `Team Leaders: ${user?.team}`} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              {teamLeaders.length > 0 ? teamLeaders.map((m, i) => <PersonCard key={i} person={m} size="md" />) : <p style={{ color: 'var(--text-muted)' }}>No data in this wing.</p>}
            </div>
          </Card>
        </div>

        {/* Quick Launch & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card>
            <SectionTitle icon={Zap} label="System Launch" color="var(--accent-primary)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { name: 'Directory', path: '/team', icon: Users, color: '#6366F1' },
                { name: 'Task Board', path: '/tasks', icon: CheckCircle, color: '#10B981' },
                { name: 'Calendar', path: '/calendar', icon: Calendar, color: '#F59E0B' },
                { name: 'Files', path: '/files', icon: FileText, color: '#3B82F6' },
              ].map((app, i) => (
                <div key={i} onClick={() => navigate(app.path)} style={{ 
                  padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '600' 
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <app.icon size={16} color={app.color} /> {app.name}
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ flex: 1 }}>
            <SectionTitle icon={Activity} label="Live Feed" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed var(--border-light)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Monitoring real-time kernel activity...
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
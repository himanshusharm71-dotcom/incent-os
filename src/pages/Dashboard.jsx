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
  Settings, Zap, AlertCircle, BarChart3, Rocket, Target, Globe, Box
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
  const avatarSize = size === 'lg' ? 96 : size === 'md' ? 72 : 56;

  return (
    <div className="card-3d" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', textAlign: 'center',
      minWidth: size === 'lg' ? '180px' : '150px'
    }}>
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden',
        border: `3px solid ${badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)'}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        {imgSrc
          ? <img src={imgSrc} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.Name || 'U')}&background=F97316&color=fff&size=128`} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        }
      </div>
      <p style={{ margin: 0, fontWeight: '800', fontSize: size === 'lg' ? '1.1rem' : '0.9rem', color: '#fff' }}>{person.Name}</p>
      <Badge variant={badgeVariant} size="sm">{getLeadershipTitle(person.Name, person.role)}</Badge>
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
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: tasks } = await supabase.from('tasks').select('status');
      const { data: allUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });

      const completed = tasks?.filter(t => t.status === 'completed').length || 0;
      const pending = tasks?.filter(t => t.status === 'pending').length || 0;

      setStats({
        totalMembers: userCount || 0,
        tasksCompleted: completed,
        pendingTasks: pending,
        avgPerformance: userCount > 0 ? Math.round((completed / (completed + pending || 1)) * 100) : 0,
        recentUsers: allUsers || []
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const executiveTeam = [
    { Name: 'Himanshu Sharma', role: 'super_admin' },
    { Name: 'Pratish Rawat', role: 'admin' },
    { Name: 'Aditya Kapoor', role: 'admin' }
  ];

  const wings = [
    { name: 'Technical Support', color: '#3B82F6', icon: Zap },
    { name: 'Event Management', color: '#8B5CF6', icon: Calendar },
    { name: 'Startup & Innovation', color: '#10B981', icon: Rocket },
    { name: 'Corporate Relations', color: '#F59E0B', icon: Target },
    { name: 'Public Relations', color: '#EC4899', icon: Globe },
    { name: 'Social Media & Branding', color: '#06B6D4', icon: MessageSquare }
  ];

  if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '4px' }}>ACCESSING KERNEL...</div>;

  return (
    <div className="animate-fade-in perspective-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>
      
      {/* 3D Hero Section */}
      <div className="card-3d floating" style={{ 
        padding: '4rem 3rem', background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(15,23,42,0) 100%)', 
        borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Badge variant="primary" style={{ marginBottom: '1.5rem', padding: '6px 16px', fontSize: '0.7rem' }}>CHAIR EXECUTIVE COMMAND</Badge>
          <h1 style={{ margin: '0 0 10px', fontSize: '3.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-2px' }}>
            Mission <span style={{ color: 'var(--accent-primary)' }}>Control</span>
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
            Overseeing the digital architecture of INCENT. Real-time telemetry and 3D portal access active.
          </p>
        </div>
        <Box size={300} color="var(--accent-primary)" style={{ position: 'absolute', right: '-50px', top: '-50px', opacity: 0.1, transform: 'rotate(20deg)' }} />
      </div>

      {/* Admin Portal Switcher - THE "SEPERATE PORTALS" */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(249,115,22,0.1)', borderRadius: '10px' }}><Shield size={20} color="var(--accent-primary)" /></div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Preview Team Portals</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {wings.map((wing, i) => (
            <Card key={i} className="card-3d" style={{ borderBottom: `4px solid ${wing.color}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ padding: '12px', background: `${wing.color}20`, borderRadius: '14px' }}>
                  <wing.icon size={28} color={wing.color} />
                </div>
                <h4 style={{ margin: 0, color: '#fff' }}>{wing.name}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time team portal view</p>
                <Button size="sm" style={{ background: wing.color, color: '#fff', width: '100%', marginTop: '10px' }} onClick={() => navigate('/')}>
                  Enter Portal
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Global Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        {[
          { label: 'Personnel', value: stats.totalMembers, icon: Users, color: '#6366F1' },
          { label: 'Operations', value: stats.tasksCompleted, icon: CheckCircle, color: '#10B981' },
          { label: 'Pending', value: stats.pendingTasks, icon: Clock, color: '#F59E0B' },
          { label: 'System Health', value: '98%', icon: Activity, color: '#3B82F6' },
        ].map((s, i) => (
          <Card key={i} style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: '15px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <s.icon size={24} color={s.color} />
            </div>
            <p style={{ margin: '0 0 5px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{s.label}</p>
            <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '900', color: '#fff' }}>{s.value}</h3>
          </Card>
        ))}
      </div>

      {/* Leadership 3D View */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <Crown size={24} color="#F59E0B" />
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Global Command</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {executiveTeam.map((m, i) => <PersonCard key={i} person={m} size="lg" badgeVariant={m.role === 'super_admin' ? 'danger' : 'primary'} />)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
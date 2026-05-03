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
  Settings, Zap, AlertCircle, BarChart3, Rocket, Target, Globe, Box, Megaphone, Send
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
      padding: '1.5rem', background: '#fff', borderRadius: '24px', textAlign: 'center',
      minWidth: size === 'lg' ? '180px' : '150px', border: '1px solid var(--border-light)'
    }}>
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden',
        border: `3px solid ${badgeVariant === 'danger' ? '#EF4444' : 'var(--accent-primary)'}`,
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      }}>
        {imgSrc
          ? <img src={imgSrc} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.Name || 'U')}&background=F97316&color=fff&size=128`} alt={person.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        }
      </div>
      <p style={{ margin: 0, fontWeight: '800', fontSize: size === 'lg' ? '1.1rem' : '0.9rem', color: 'var(--text-primary)' }}>{person.Name}</p>
      <Badge variant={badgeVariant} size="sm">{getLeadershipTitle(person.Name, person.role)}</Badge>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, tasksCompleted: 0, pendingTasks: 0, avgPerformance: 0, recentUsers: [] });
  const [announcement, setAnnouncement] = useState("Welcome to INCENT OS. Access granted to all wings.");
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
    { name: 'Technical Support', color: '#3B82F6', icon: Zap },
    { name: 'Event Management', color: '#8B5CF6', icon: Calendar },
    { name: 'Startup & Innovation', color: '#10B981', icon: Rocket },
    { name: 'Corporate Relations', color: '#F59E0B', icon: Target },
    { name: 'Public Relations', color: '#EC4899', icon: Globe },
    { name: 'Social Media & Branding', color: '#06B6D4', icon: MessageSquare }
  ];

  if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '2px' }}>LOADING SYSTEM...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '6rem' }}>
      
      {/* GLOBAL ANNOUNCEMENT MARQUEE */}
      <div style={{ background: 'var(--accent-primary)', color: '#fff', padding: '12px', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 30px rgba(249,115,22,0.2)' }}>
        <Badge variant="primary" style={{ background: '#fff', color: 'var(--accent-primary)', border: 'none', fontWeight: '900', flexShrink: 0 }}>CHAIR'S BROADCAST</Badge>
        <marquee style={{ fontSize: '1rem', fontWeight: '700' }}>{announcement}</marquee>
      </div>

      <div className="card-3d floating" style={{ 
        padding: '3.5rem 2.5rem', background: 'linear-gradient(135deg, #fff 0%, rgba(249,115,22,0.05) 100%)', 
        borderRadius: '32px', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Badge variant="primary" style={{ marginBottom: '1.25rem', padding: '6px 16px' }}>CHAIR EXECUTIVE COMMAND</Badge>
          <h1 style={{ margin: '0 0 10px', fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>
            Mission <span style={{ color: 'var(--accent-primary)' }}>Control</span>
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
            Overseeing the organization's digital architecture. Real-time telemetry and wing portal access active.
          </p>
        </div>
        <Box size={200} color="var(--accent-primary)" style={{ position: 'absolute', right: '0', top: '-20px', opacity: 0.05, transform: 'rotate(20deg)' }} />
      </div>

      {/* CHAIR'S BROADCAST CONTROL (ADMIN ONLY) */}
      {isAdmin && (
        <Card style={{ border: '2px solid var(--accent-primary)', background: 'rgba(249,115,22,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Megaphone size={20} color="var(--accent-primary)" />
            <h3 style={{ margin: 0 }}>Update Global Broadcast</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Type your announcement for all 71 members..." 
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button onClick={handleBroadcast} icon={<Send size={18} />} style={{ background: 'var(--accent-primary)', color: '#fff' }}>Broadcast Now</Button>
          </div>
        </Card>
      )}

      {/* Admin Portal Switcher */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(249,115,22,0.1)', borderRadius: '10px' }}><Shield size={20} color="var(--accent-primary)" /></div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Preview Wing Portals</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {wings.map((wing, i) => (
            <Card key={i} className="card-3d" style={{ borderBottom: `4px solid ${wing.color}`, background: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ padding: '10px', background: `${wing.color}10`, borderRadius: '12px' }}>
                  <wing.icon size={24} color={wing.color} />
                </div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{wing.name}</h4>
                <button 
                  style={{ background: wing.color, color: '#fff', width: '100%', marginTop: '10px', padding: '8px', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }} 
                  onClick={() => navigate(`/portal/${wing.name}`)}
                >
                  Enter Portal Preview
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Personnel', value: stats.totalMembers, icon: Users, color: '#6366F1' },
          { label: 'Operations', value: stats.tasksCompleted, icon: CheckCircle, color: '#10B981' },
          { label: 'Pending', value: stats.pendingTasks, icon: Clock, color: '#F59E0B' },
          { label: 'Health', value: '99%', icon: Activity, color: '#3B82F6' },
        ].map((s, i) => (
          <Card key={i} style={{ padding: '1.5rem', textAlign: 'center', background: '#fff' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <s.icon size={20} color={s.color} />
            </div>
            <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>{s.label}</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>{s.value}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
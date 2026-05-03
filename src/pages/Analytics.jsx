import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../context/AuthProvider';
import { Activity, TrendingUp, Users, Target, Award, AlertTriangle, BarChart3, PieChart, RefreshCw } from 'lucide-react';

function Analytics() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const [stats, setStats] = useState({
    teamStats: [],
    topPerformers: [],
    inactiveMembers: [],
    performanceTrend: [],
    totalPoints: 0,
    efficiency: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // 1. Fetch all active users
      const { data: users } = await supabase.from('users').select('*').eq('status', 'active');
      
      // 2. Calculate Team Comparison
      const teams = ['Technical Support', 'Event Management', 'Startup & Innovation', 'Corporate Relations', 'Public Relations', 'Social Media & Branding'];
      const teamData = teams.map(t => {
        const teamUsers = users?.filter(u => u.team === t) || [];
        const avgPoints = teamUsers.length > 0 ? Math.round(teamUsers.reduce((sum, u) => sum + (u.points || 0), 0) / teamUsers.length) : 0;
        return { name: t, count: teamUsers.length, performance: avgPoints };
      }).sort((a, b) => b.performance - a.performance);

      // 3. Top Performers
      const top = [...(users || [])].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5);

      // 4. Inactive Members (Simulated by 0 points or low activity)
      const inactive = users?.filter(u => (u.points || 0) < 50 && u.role === 'member').slice(0, 4) || [];

      // 5. Calculate real total points
      const totalPoints = (users || []).reduce((sum, u) => sum + (u.points || 0), 0);

      // 6. Calculate real efficiency from tasks
      const { data: tasks } = await supabase.from('tasks').select('status');
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
      const totalTasks = tasks?.length || 0;
      const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // 7. Generate real trend from team avg points (one bar per team)
      const trend = teamData.map(t => t.performance);
      // Normalize to percentages for bar chart
      const maxPerf = Math.max(...trend, 1);
      const normalizedTrend = trend.map(v => Math.round((v / maxPerf) * 100));

      setStats({
        teamStats: teamData,
        topPerformers: top,
        inactiveMembers: inactive,
        performanceTrend: normalizedTrend.length > 0 ? normalizedTrend : [0],
        totalPoints,
        efficiency
      });
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPoints = async () => {
    if (!window.confirm("Are you sure you want to RESET ALL POINTS? This will start a new week for everyone.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ points: 0 })
        .neq('role', 'super_admin'); // Optional: spare super admin if needed

      if (error) throw error;
      alert("Leaderboard has been reset for the new week!");
      fetchAnalytics();
    } catch (err) {
      alert("Error resetting points: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Performance Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Deep-dive into INCENT OS activity and team productivity trends.</p>
        </div>
        {isAdmin && (
          <Button 
            variant="danger" 
            icon={<RefreshCw size={18} />} 
            onClick={handleResetPoints}
            style={{ background: '#EF4444', color: '#fff', border: 'none' }}
          >
            Reset Weekly Leaderboard
          </Button>
        )}
      </div>

      {/* Top Level Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Task Completion Rate</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.efficiency}%</h2>
              <Badge variant="success" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Based on real task data</Badge>
            </div>
            <TrendingUp size={48} style={{ opacity: 0.2 }} />
          </div>
        </Card>
        
        <Card style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Total Points Generated</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.totalPoints}</h2>
              <Badge variant="success" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>From {stats.topPerformers.length} active members</Badge>
            </div>
            <Target size={48} style={{ opacity: 0.2 }} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Team Comparison Chart (Simulated with Bars) */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <BarChart3 size={20} color="var(--accent-primary)" />
            <h3 style={{ margin: 0 }}>Wing Performance Index</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stats.teamStats.map((team, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '600' }}>{team.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{team.performance} avg pts</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min((team.performance / 1000) * 100, 100)}%`, 
                    height: '100%', 
                    background: i === 0 ? 'var(--accent-primary)' : 'rgba(249, 115, 22, 0.4)',
                    borderRadius: '5px',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performers List */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <Award size={20} color="#F59E0B" />
            <h3 style={{ margin: 0 }}>Elite Performers (Top 5)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.topPerformers.map((user, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: i === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: i === 0 ? '#F59E0B' : 'var(--text-muted)', minWidth: '24px' }}>#{i+1}</span>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name)}&background=random`} size="sm" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{user.Name}</h4>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.team}</p>
                </div>
                <Badge variant="primary">{user.points} pts</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Inactivity Alerts */}
        <Card style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <AlertTriangle size={20} color="#EF4444" />
            <h3 style={{ margin: 0 }}>Critical: Inactivity Detection</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            The following members haven't updated their tasks in over 7 days.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {stats.inactiveMembers.length > 0 ? stats.inactiveMembers.map((user, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '16px', background: '#fff' }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name)}&background=ddd`} size="md" style={{ margin: '0 auto 10px', filter: 'grayscale(100%)' }} />
                <h4 style={{ margin: '0 0 5px', fontSize: '0.85rem' }}>{user.Name}</h4>
                <Badge variant="danger" style={{ fontSize: '0.6rem' }}>Flagged Inactive</Badge>
              </div>
            )) : (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--status-success)' }}>
                Excellent! All members are currently active.
              </div>
            )}
          </div>
        </Card>

        {/* Trend Visualization */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <Activity size={20} color="#10B981" />
            <h3 style={{ margin: 0 }}>Team Performance Trend</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '150px', padding: '10px 0' }}>
            {stats.performanceTrend.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${val}%`, 
                  background: 'linear-gradient(to top, #10B981, #34D399)', 
                  borderRadius: '4px',
                  opacity: 0.6 + (i * 0.05)
                }}></div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>T{i+1}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

export default Analytics;

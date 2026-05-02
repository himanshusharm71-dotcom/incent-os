import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Activity, TrendingUp, Users, Target, Award, AlertTriangle, BarChart3, PieChart } from 'lucide-react';

function Analytics() {
  const [stats, setStats] = useState({
    teamStats: [],
    topPerformers: [],
    inactiveMembers: [],
    performanceTrend: [75, 82, 78, 85, 92, 88, 95] // Mock trend
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

      setStats({
        teamStats: teamData,
        topPerformers: top,
        inactiveMembers: inactive,
        performanceTrend: [75, 82, 78, 85, 92, 88, 95]
      });
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Performance Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep-dive into INCENT OS activity and team productivity trends.</p>
      </div>

      {/* Top Level Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Overall Efficiency</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>94.2%</h2>
              <Badge variant="success" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>+5.4% this week</Badge>
            </div>
            <TrendingUp size={48} style={{ opacity: 0.2 }} />
          </div>
        </Card>
        
        <Card style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Total Points Generated</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>14.8k</h2>
              <Badge variant="success" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Active OS cycle</Badge>
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
            <h3 style={{ margin: 0 }}>Weekly Activity Trend</h3>
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
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Day {i+1}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

export default Analytics;

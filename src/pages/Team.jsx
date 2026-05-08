import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Crown, Star, Users, Shield, Award } from 'lucide-react';
import himanshuImg from '../assets/himanshu_sharma.jpg';
import pratishImg from '../assets/pratish_rawat.jpg';
import adityaImg from '../assets/aditya_kapoor.jpg';

function Team() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const allTeams = [
    'Startup & Incubation', 'Research & Strategy', 'Corporate Relations & MOU', 
    'Outreach & Expansion', 'Tech & Development', 'Data Analytics & Insights', 
    'Public Relations (PR)', 'Marketing & Media', 'Design & Creative', 
    'Events & Operations', 'Competitions & Hackathon', 'Documentation', 
    'Campus Ambassadors', 'Placement & Startup Hiring'
  ];

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Fetch only the relevant data
      let query = supabase.from('users').select('*').eq('status', 'active');
      
      // Strict Filter: Non-admins only see their team members
      if (!isAdmin && user?.team) {
        query = query.or(`team.eq."${user.team}",role.eq.super_admin,role.eq.admin`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLeadershipTitle = (name, role) => {
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('himanshu')) return 'Chair (Super Admin)';
    if (lowerName.includes('pratish')) return 'Incubation Head (Admin)';
    if (lowerName.includes('aditya')) return 'Chief Coordinator (Admin)';
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    if (role === 'leader') return 'Team Leader';
    if (role === 'deputy_leader') return 'Deputy Leader';
    return 'Member';
  };

  const getLeadershipImage = (name) => {
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('himanshu')) return himanshuImg;
    if (lowerName.includes('pratish')) return pratishImg;
    if (lowerName.includes('aditya')) return adityaImg;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Leader')}&background=F97316&color=fff`;
  };

  const getUserPoints = (name) => {
    if (!name) return 0;
    const u = members.find(m => m.Name?.toLowerCase().includes(name.toLowerCase()));
    return u ? (u.points || 0) : 0;
  };

  const executiveTeam = members.filter(m => m.role === 'super_admin' || m.role === 'admin')
    .sort((a, b) => (a.role === 'super_admin' ? -1 : 1));

  // Determine which teams to show
  const visibleTeams = isAdmin 
    ? allTeams.filter(t => t !== 'Core')
    : allTeams.filter(t => t === user?.team && t !== 'Core');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '3rem 1rem', background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, transparent 100%)', borderRadius: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>The <span style={{ color: 'var(--accent-primary)' }}>Commanders</span></h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Leadership and structure of the {isAdmin ? "Organization" : `${user?.team} Wing`}.
        </p>
      </div>

      <div style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', justifyContent: 'center' }}>
          <Crown size={32} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Core Leadership</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {executiveTeam.map((leader, i) => (
            <Card key={i} style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(249,115,22,0.2)' }}>
              <Avatar src={getLeadershipImage(leader.Name)} size="xl" style={{ margin: '0 auto 1.5rem', border: '4px solid var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{leader.Name}</h3>
              <Badge variant={leader.role === 'super_admin' ? 'danger' : 'primary'}>{getLeadershipTitle(leader.Name, leader.role)}</Badge>
              <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Star size={14} color="#F59E0B" inline /> {leader.points || 0} pts
              </div>
            </Card>
          ))}
        </div>
      </div>

      {visibleTeams.map(team => {
        const teamMembers = members.filter(m => m.team === team);
        const leader = teamMembers.find(m => m.role === 'leader');
        const deputy = teamMembers.find(m => m.role === 'deputy_leader');
        const regularMembers = teamMembers.filter(m => m.role === 'member');

        return (
          <div key={team} style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <Users size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>{team} Wing</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {leader && (
                <Card style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Avatar src={getLeadershipImage(leader.Name)} size="lg" />
                    <div><h4 style={{ margin: 0 }}>{leader.Name}</h4><Badge variant="primary" size="sm">Leader</Badge></div>
                  </div>
                </Card>
              )}
              {deputy && (
                <Card style={{ borderLeft: '4px solid #6366F1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Avatar src={getLeadershipImage(deputy.Name)} size="lg" />
                    <div><h4 style={{ margin: 0 }}>{deputy.Name}</h4><Badge variant="info" size="sm">Deputy Leader</Badge></div>
                  </div>
                </Card>
              )}
              {regularMembers.length > 0 && (
                <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {regularMembers.slice(0, 6).map((m, i) => (
                      <Avatar key={i} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.Name)}&background=random`} size="sm" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{regularMembers.length} Members</span>
                </Card>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Team;
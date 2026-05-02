import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Crown, Star, Users, Shield, Award } from 'lucide-react';
import himanshuImg from '../assets/himanshu_sharma.jpg';
import pratishImg from '../assets/pratish_rawat.jpg';
import adityaImg from '../assets/aditya_kapoor.jpg';

function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const teams = ['Core', 'Technical Support', 'Event Management', 'Startup & Innovation', 'Corporate Relations', 'Public Relations', 'Social Media & Branding'];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('status', 'active');
        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Helper to determine specific titles
  const getLeadershipTitle = (name, role) => {
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('himanshu')) return 'Chair (Super Admin)';
    if (lowerName.includes('pratish')) return 'Incubation Head (Admin)';
    if (lowerName.includes('aditya')) return 'Chief Coordinator (Admin)';
    return role === 'super_admin' ? 'Super Admin' : 'Admin';
  };

  // Helper to determine leadership photo
  const getLeadershipImage = (name) => {
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('himanshu')) return himanshuImg;
    if (lowerName.includes('pratish')) return pratishImg;
    if (lowerName.includes('aditya')) return adityaImg;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Leader')}&background=F97316&color=fff`;
  };

  const executiveTeam = [
    { Name: 'Himanshu Sharma', role: 'super_admin', points: 9999 },
    { Name: 'Pratish Rawat', role: 'admin', points: 8500 },
    { Name: 'Aditya Kapoor', role: 'admin', points: 8200 }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Introduction Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '4rem', 
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, transparent 100%)',
        borderRadius: '30px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Meet the <span style={{ color: 'var(--accent-primary)' }}>Commanders</span></h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          The elite leadership driving innovation and excellence across all INCENT OS wings.
        </p>
      </div>

      {/* 1. Executive Leadership Section */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', justifyContent: 'center' }}>
          <Crown size={32} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Core Leadership</h2>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {executiveTeam.map((leader, i) => (
            <Card key={i} style={{ 
              padding: '2rem', 
              textAlign: 'center',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(249,115,22,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {leader.role === 'super_admin' && (
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  <Shield size={24} color="var(--accent-primary)" />
                </div>
              )}
              <Avatar 
                src={getLeadershipImage(leader.Name)} 
                size="xl" 
                alt={leader.Name}
                style={{ margin: '0 auto 1.5rem', border: '4px solid var(--accent-primary)', boxShadow: '0 10px 25px rgba(249,115,22,0.3)' }}
              />
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>{leader.Name}</h3>
              <Badge variant={leader.role === 'super_admin' ? 'danger' : 'primary'} style={{ marginBottom: '1rem' }}>
                {getLeadershipTitle(leader.Name, leader.role)}
              </Badge>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={16} color="#F59E0B" /> {leader.points} pts</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Award size={16} color="var(--accent-primary)" /> Elite Status</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. Team Wing Sections */}
      {teams.filter(t => t !== 'Core').map(team => {
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Leader Card */}
              {leader ? (
                <Card style={{ borderLeft: '4px solid var(--accent-primary)', background: 'linear-gradient(to right, rgba(249,115,22,0.05), transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Avatar src={getLeadershipImage(leader.Name)} size="lg" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>{leader.Name}</h4>
                      <Badge variant="primary" style={{ fontSize: '0.65rem' }}>Team Leader</Badge>
                    </div>
                  </div>
                </Card>
              ) : (
                <div style={{ padding: '1rem', border: '1px dashed var(--border-light)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Leader Assigned</div>
              )}

              {/* Deputy Card */}
              {deputy && (
                <Card style={{ borderLeft: '4px solid #6366F1', background: 'linear-gradient(to right, rgba(99,102,241,0.05), transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Avatar src={getLeadershipImage(deputy.Name)} size="lg" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>{deputy.Name}</h4>
                      <Badge variant="info" style={{ fontSize: '0.65rem' }}>Deputy Leader</Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Members Preview */}
              {regularMembers.length > 0 && (
                <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {regularMembers.slice(0, 5).map((m, i) => (
                      <Avatar key={i} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.Name)}&background=random`} size="sm" />
                    ))}
                    {regularMembers.length > 5 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '5px' }}>+{regularMembers.length - 5} more</div>}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>{regularMembers.length} Members</span>
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
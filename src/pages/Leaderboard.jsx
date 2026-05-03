import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Trophy, TrendingUp } from 'lucide-react';

function Leaderboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('status', 'active');
        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Deduplicate users by email — keep the one with highest points
  const uniqueMembers = members.reduce((acc, current) => {
    const existing = acc.find(item => item.email === current.email);
    if (!existing) {
      acc.push(current);
    } else if ((current.points || 0) > (existing.points || 0)) {
      const idx = acc.indexOf(existing);
      acc[idx] = current;
    }
    return acc;
  }, []);

  const sorted = [...uniqueMembers].sort((a, b) => (b.points || 0) - (a.points || 0));
  
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          <Trophy color="#F59E0B" size={32} /> Performance Index
        </h1>
        <p>Rankings based on real task completion points.</p>
      </div>

      {/* PODIUM */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', height: '250px', marginBottom: '4rem' }}>
        {/* Rank 2 */}
        {podium[1] && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
            <Avatar fallback={podium[1].Name.charAt(0)} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(podium[1].Name)}&background=random`} style={{ marginBottom: '10px', border: '3px solid silver' }} />
            <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center', color: 'var(--text-primary)' }}>{podium[1].Name}</div>
            <div style={{ fontWeight: 'bold', color: 'silver', fontSize: '1.2rem', marginBottom: '10px' }}>#{2}</div>
            <div style={{ width: '100%', height: '100px', background: 'linear-gradient(to top, rgba(192,192,192,0.2), rgba(192,192,192,0.8))', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#000' }}>
              {podium[1].points || 0} pts
            </div>
          </div>
        )}

        {/* Rank 1 */}
        {podium[0] && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px', zIndex: 2 }}>
            <Trophy color="#F59E0B" size={28} style={{ marginBottom: '10px' }} />
            <Avatar fallback={podium[0].Name.charAt(0)} size="lg" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(podium[0].Name)}&background=random`} style={{ marginBottom: '10px', border: '4px solid gold' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center', color: 'var(--text-primary)' }}>{podium[0].Name}</div>
            <div style={{ fontWeight: 'bold', color: 'gold', fontSize: '1.5rem', marginBottom: '10px' }}>#{1}</div>
            <div style={{ width: '100%', height: '140px', background: 'linear-gradient(to top, rgba(255,215,0,0.2), rgba(255,215,0,0.8))', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#000', fontSize: '1.2rem' }}>
              {podium[0].points || 0} pts
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {podium[2] && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
            <Avatar fallback={podium[2].Name.charAt(0)} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(podium[2].Name)}&background=random`} style={{ marginBottom: '10px', border: '3px solid #CD7F32' }} />
            <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center', color: 'var(--text-primary)' }}>{podium[2].Name}</div>
            <div style={{ fontWeight: 'bold', color: '#CD7F32', fontSize: '1.2rem', marginBottom: '10px' }}>#{3}</div>
            <div style={{ width: '100%', height: '70px', background: 'linear-gradient(to top, rgba(205,127,50,0.2), rgba(205,127,50,0.8))', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#000' }}>
              {podium[2].points || 0} pts
            </div>
          </div>
        )}
      </div>

      {/* FULL LIST */}
      <Card>
        <h3 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>Rankings</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading rankings...</div> : sorted.map((m, i) => (
            <div key={m.email || i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem', 
              background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
              borderRadius: '8px'
            }}>
              <div style={{ width: '40px', fontWeight: 'bold', color: i < 3 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>#{i + 1}</div>
              <Avatar size="sm" fallback={m.Name.charAt(0)} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.Name)}&background=random`} />
              <div style={{ flex: 1, marginLeft: '1rem' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{m.Name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.team} • {m.role}</div>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', background: 'var(--bg-card)', padding: '5px 15px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                {m.points || 0} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PTS</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Leaderboard;
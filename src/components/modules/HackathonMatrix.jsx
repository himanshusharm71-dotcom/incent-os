import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Trophy, Zap, Users, Target, Globe, Calendar, 
  Plus, Search, Filter, Rocket, Award, 
  Flag, Timer, Cpu, Code
} from 'lucide-react';

export default function HackathonMatrix() {
  const [activeTab, setActiveTab] = useState('events');

  const competitions = [
    { name: 'CyberQuest 2026', type: 'Hackathon', prize: '$5,000', entrants: 450, status: 'Active' },
    { name: 'Neural Logic UI', type: 'Design Challenge', prize: '$2,500', entrants: 120, status: 'Judging' },
    { name: 'Blockchain Sprint', type: 'Speed Coding', prize: '$1,200', entrants: 85, status: 'Upcoming' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── COMPETITION HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'TOTAL ENTRANTS', val: '655', icon: Users, color: '#3B82F6' },
          { label: 'PRIZE POOL', val: '$8.7k', icon: Trophy, color: '#F59E0B' },
          { label: 'ACTIVE EVENTS', val: 3, icon: Rocket, color: '#10B981' },
          { label: 'REGISTRATION VELOCITY', val: 'HIGH', icon: Zap, color: '#F43F5E' }
        ].map((m, i) => (
          <Card key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ padding: '12px', background: `${m.color}15`, borderRadius: '14px' }}>
                <m.icon size={22} color={m.color} />
             </div>
             <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '0.5px' }}>{m.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{m.val}</div>
             </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        
        {/* ── HACKATHON TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'events', label: 'EVENT TRACKER', icon: Flag },
            { id: 'judging', label: 'JUDGING PANEL', icon: Award },
            { id: 'dev', label: 'DEV SANDBOX', icon: Code },
            { id: 'timer', label: 'EVENT CLOCK', icon: Timer }
          ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                borderRadius: '16px', border: 'none', background: activeTab === tool.id ? 'var(--accent-primary)' : 'rgba(0,0,0,0.03)',
                color: activeTab === tool.id ? '#fff' : 'var(--text-primary)', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s',
                textAlign: 'left'
              }}
            >
              <tool.icon size={18} /> {tool.label}
            </button>
          ))}
        </div>

        {/* ── TOOL VIEW ── */}
        <Card className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
          
          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Competitive Matrix</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Launch Event</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {competitions.map((c, i) => (
                  <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'rgba(249,115,22,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={22} /></div>
                       <div>
                          <h4 style={{ margin: '0 0 4px', fontWeight: '800' }}>{c.name}</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <Badge variant="default" style={{ fontSize: '0.6rem' }}>{c.type}</Badge>
                             <Badge variant="success" style={{ fontSize: '0.6rem' }}>{c.prize}</Badge>
                          </div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>REGISTRATIONS</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.2rem' }}>{c.entrants}</span>
                          <Badge variant={c.status === 'Active' ? 'success' : 'info'}>{c.status}</Badge>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

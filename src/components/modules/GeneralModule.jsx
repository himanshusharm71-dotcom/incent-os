import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Layers, FileText, Share2, Users, Target, Activity, 
  Cpu, Shield, Zap, Globe, Database, Network
} from 'lucide-react';

export default function GeneralModule({ team, stats }) {
  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  const tools = [
    { name: 'Core Documentation', icon: FileText, desc: 'Centralized Knowledge Vault' },
    { name: 'Strategic Roadmap', icon: Target, desc: 'Mission Milestones & Objectives' },
    { name: 'External Outreach', icon: Globe, desc: 'Network Connectivity Logs' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* ── SECTOR HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Ops Command */}
        <Card className="glass-card card-hover" style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.02)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>
            <Layers size={24} color="var(--accent-primary)" /> SECTOR OPS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {tools.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.25rem', background: 'rgba(0,0,0,0.03)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '12px', background: 'rgba(249,115,22,0.1)', borderRadius: '14px' }}>
                   <t.icon size={20} color="var(--accent-primary)" />
                </div>
                <div>
                   <div style={{ fontWeight: '900', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{t.name}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Telemetry Log */}
        <Card className="glass-card card-hover" style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.02)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>
            <Activity size={24} color="#10B981" /> TELEMETRY
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {[
               { t: 'Personnel sync complete', d: `${memberCount} Members`, s: 'STABLE' },
               { t: 'Active Task Matrix', d: `${taskCount} Tasks`, s: 'ACTIVE' },
               { t: 'Sector handshake', d: 'SUCCESS', s: 'SECURE' }
             ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(0,0,0,0.02)', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.03)' }}>
                   <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>{item.t}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>{item.d}</div>
                   </div>
                   <Badge style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '0.55rem', border: 'none' }}>{item.s}</Badge>
                </div>
             ))}
          </div>
          <Button variant="secondary" style={{ width: '100%', marginTop: '2rem', padding: '15px', borderRadius: '16px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>FULL SYSTEM LOG</Button>
        </Card>

        {/* Neural Network */}
        <Card className="glass-card card-hover" style={{ padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid rgba(249,115,22,0.2)' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>
            <Network size={24} color="var(--accent-primary)" /> NEURAL NET
           </h3>
           <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6, fontWeight: '500' }}>
            Managing <strong>{memberCount} personnel</strong> and <strong>{taskCount} tasks</strong> for the <strong>{team}</strong> sector. Data integrity verified.
           </p>
           <div style={{ position: 'relative', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: 60, height: 60, border: '2px solid var(--accent-primary)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <Cpu size={30} color="var(--accent-primary)" />
           </div>
           <button className="primary" style={{ width: '100%', marginTop: '2.5rem', fontSize: '0.85rem' }}>SYNC SECTOR DIRECTORY</button>
        </Card>

      </div>
    </div>
  );
}

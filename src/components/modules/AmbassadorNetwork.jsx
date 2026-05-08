import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Users, MapPin, Award, Zap, Search, Plus, 
  Target, TrendingUp, Star, PhoneCall,
  MessageSquare, Globe, ShieldCheck, Shield
} from 'lucide-react';

export default function AmbassadorNetwork({ stats }) {
  const [activeTab, setActiveTab] = useState('campuses');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING PERSONNEL', val: memberCount, icon: Users, color: '#A855F7' },
          { label: 'CAMPUS NODES', val: 'Active', icon: Globe, color: '#3B82F6' },
          { label: 'ACTIVE CAMPAIGNS', val: taskCount, icon: Zap, color: '#F59E0B' },
          { label: 'NETWORK HEALTH', val: '98%', icon: Shield, color: '#10B981' }
        ].map((m, i) => (
          <Card key={i} className="glass-card mouse-glow" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'network', label: 'NETWORK MATRIX', icon: Globe },
            { id: 'points', label: 'LEADERBOARD', icon: Award },
            { id: 'tasks', label: 'CAMPAIGN TASKS', icon: Target },
            { id: 'vetting', label: 'VETTING HUB', icon: ShieldCheck }
          ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                borderRadius: '16px', 
                background: activeTab === tool.id ? 'var(--accent-primary)' : 'rgba(0,0,0,0.03)',
                color: activeTab === tool.id ? '#fff' : 'var(--text-primary)', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s',
                textAlign: 'left', border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <tool.icon size={18} /> {tool.label}
            </button>
          ))}
        </div>

        <Card className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Institutional Network</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Appoint CA</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                 {[
                   { name: 'IIT Delhi', count: 12, growth: '+15%', status: 'Elite' },
                   { name: 'NSUT Delhi', count: 8, growth: '+20%', status: 'Rising' },
                   { name: 'Poornima Uni', count: 24, growth: '+45%', status: 'Alpha' }
                 ].map((inst, i) => (
                   <div key={i} className="card-hover" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                      <h4 style={{ margin: '0 0 5px', fontWeight: '800' }}>{inst.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                         <Badge size="sm" style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7' }}>{inst.status}</Badge>
                         <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10B981' }}>{inst.growth}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                         <Users size={14} /> {inst.count} Ambassadors
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

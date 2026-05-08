import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Globe, Map, Users, Share2, Plus, Search, 
  ExternalLink, TrendingUp, Zap, Target,
  MessageCircle, Building, Handshake
} from 'lucide-react';

export default function OutreachExpansion({ stats }) {
  const [activeTab, setActiveTab] = useState('regions');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING PERSONNEL', val: memberCount, icon: Users, color: '#EC4899' },
          { label: 'NODAL CENTERS', val: 'Active', icon: Map, color: '#3B82F6' },
          { label: 'OUTREACH TASKS', val: taskCount, icon: Target, color: '#8B5CF6' },
          { label: 'GROWTH RATE', val: 'STABLE', icon: TrendingUp, color: '#10B981' }
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
            { id: 'regions', label: 'REGIONAL NODES', icon: Map },
            { id: 'partners', label: 'STRATEGIC ALLIES', icon: Handshake },
            { id: 'growth', label: 'EXPANSION RADAR', icon: Zap },
            { id: 'community', label: 'COMMUNITY HUB', icon: MessageCircle }
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
          {activeTab === 'regions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Global Expansion Matrix</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Add Region</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                 {['North America', 'EMEA', 'Asia Pacific', 'LATAM'].map(reg => (
                   <div key={reg} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <h4 style={{ margin: '0 0 10px', fontWeight: '800' }}>{reg}</h4>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Active nodes and partnerships in the region.</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Badge variant="success" size="sm">ACTIVE</Badge>
                         <ExternalLink size={14} color="var(--text-muted)" />
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

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Target, Search, BarChart2, Globe, Database, BookOpen, 
  TrendingUp, Compass, PieChart, Layers, Zap, Plus,
  FileSearch, Lightbulb, Microscope
} from 'lucide-react';

export default function ResearchStrategy({ stats }) {
  const [activeTab, setActiveTab] = useState('insights');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  const insights = [
    { title: 'Market Saturation Alpha', type: 'Competitor Analysis', confidence: 92, date: 'May 05' },
    { title: 'Next-Gen UI Trends', type: 'User Research', confidence: 85, date: 'May 07' },
    { title: 'Global Startup Velocity', type: 'Macro Trends', confidence: 78, date: 'May 08' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── STRATEGY HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING PERSONNEL', val: memberCount, icon: Layers, color: '#6366F1' },
          { label: 'MARKET COVERAGE', val: 'Active', icon: Globe, color: '#10B981' },
          { label: 'PENDING TASKS', val: taskCount, icon: Zap, color: '#F59E0B' },
          { label: 'KNOWLEDGE BASE', val: 'SECURE', icon: BookOpen, color: '#8B5CF6' }
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
        
        {/* ── STRATEGY TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'insights', label: 'STRATEGIC INSIGHTS', icon: Microscope },
            { id: 'market', label: 'MARKET ARCHITECT', icon: PieChart },
            { id: 'reports', label: 'INTELLIGENCE VAULT', icon: Database },
            { id: 'trends', label: 'TREND RADAR', icon: TrendingUp }
          ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                borderRadius: '16px', border: 'none', background: activeTab === tool.id ? 'var(--accent-primary)' : 'rgba(0,0,0,0.05)',
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
          
          {activeTab === 'insights' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Intelligence Stream</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Deploy Research</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {insights.map((s, i) => (
                  <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'rgba(99,102,241,0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileSearch size={22} /></div>
                       <div>
                          <h4 style={{ margin: '0 0 4px', fontWeight: '800' }}>{s.title}</h4>
                          <Badge variant="info" style={{ fontSize: '0.6rem' }}>{s.type}</Badge>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>CONFIDENCE LEVEL</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '80px', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>
                             <div style={{ width: `${s.confidence}%`, height: '100%', background: '#10B981', borderRadius: '3px' }}></div>
                          </div>
                          <span style={{ fontWeight: '900', color: '#10B981', fontSize: '0.9rem' }}>{s.confidence}%</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center', padding: '3rem' }}>
               <Compass size={60} color="var(--accent-primary)" style={{ margin: '0 auto', opacity: 0.5 }} />
               <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.5rem' }}>Market Architecture Engine</h3>
               <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Select sector parameters to initialize 3D market projection and competitor overlay.</p>
               <Button variant="primary" style={{ width: 'fit-content', margin: '1rem auto' }}>Initialize Projection</Button>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

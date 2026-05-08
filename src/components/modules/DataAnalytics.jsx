import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  BarChart3, LineChart, PieChart, Activity, Cpu, Database, 
  TrendingUp, Zap, Search, Plus, Filter, Download,
  Target, Globe, MousePointer2, Layers
} from 'lucide-react';

export default function DataAnalytics({ stats }) {
  const [activeTab, setActiveTab] = useState('metrics');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  const kpis = [
    { label: 'Wing Personnel', val: memberCount, status: 'optimal' },
    { label: 'Pending Operations', val: taskCount, status: 'optimal' },
    { label: 'System Integrity', val: '99.9%', status: 'optimal' },
    { label: 'Data Latency', val: '12ms', status: 'optimal' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── ANALYTICS HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {kpis.map((k, i) => (
          <Card key={i} className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
             <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>{k.label}</div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: k.status === 'optimal' ? '#10B981' : '#F59E0B' }}>{k.val}</div>
                <div style={{ padding: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px' }}>
                   {i % 2 === 0 ? <TrendingUp size={18} color="#10B981" /> : <Activity size={18} color="#3B82F6" />}
                </div>
             </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        
        {/* ── ANALYTICS TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'metrics', label: 'KPI DASHBOARD', icon: BarChart3 },
            { id: 'visualizer', label: '3D DATA MAP', icon: Globe },
            { id: 'query', label: 'QUANTUM QUERY', icon: Search },
            { id: 'export', label: 'DATA EXPORT', icon: Download }
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

        {/* ── TOOL VIEW ── */}
        <Card className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
          
          {activeTab === 'metrics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Operational Metrics Matrix</h3>
                <Button variant="secondary" size="sm" icon={<Plus size={16} />}>Custom Metric</Button>
              </div>
              
              {/* Simulated Chart */}
              <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', height: '250px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                 {[40, 60, 30, 80, 55, 90, 45, 70, 85, 50, 95, 65].map((h, i) => (
                   <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--accent-primary), #3B82F6)', height: `${h}%`, borderRadius: '6px', opacity: 0.4 + (i * 0.05), animation: 'metricPulse 2s infinite alternate' }}></div>
                 ))}
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                 <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '10px' }}>PREDICTIVE MODEL</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#10B981' }}>94.2% ACCURACY</div>
                 </div>
                 <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '10px' }}>DATA THROUGHPUT</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#3B82F6' }}>1.4 TB / DAY</div>
                 </div>
              </div>
            </div>
          )}

          <style>{`
            @keyframes metricPulse { from { transform: scaleY(0.95); opacity: 0.4; } to { transform: scaleY(1); opacity: 0.8; } }
          `}</style>

        </Card>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Rocket, Target, PieChart, Users, DollarSign, ArrowUpRight, 
  Lightbulb, Briefcase, TrendingUp, Search, Plus, Filter,
  CheckCircle2, AlertCircle, BarChart, ChevronRight
} from 'lucide-react';

export default function StartupIncubation() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [valuation, setValuation] = useState({ preMoney: '', investment: '' });

  const calculatePostMoney = () => {
    const pre = parseFloat(valuation.preMoney) || 0;
    const inv = parseFloat(valuation.investment) || 0;
    return { post: pre + inv, equity: inv > 0 ? ((inv / (pre + inv)) * 100).toFixed(2) : 0 };
  };

  const startups = [
    { name: 'EcoSync AI', stage: 'Seed', health: 92, sectors: ['CleanTech', 'AI'] },
    { name: 'HealthGrid', stage: 'Pre-Seed', health: 75, sectors: ['HealthTech'] },
    { name: 'FinFlow', stage: 'Series A', health: 88, sectors: ['FinTech'] }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── INCUBATION METRICS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'ACTIVE STARTUPS', val: 14, icon: Rocket, color: '#10B981' },
          { label: 'AVG EQUITY HELD', val: '12.5%', icon: PieChart, color: '#3B82F6' },
          { label: 'PIPELINE VALUE', val: '$2.4M', icon: DollarSign, color: '#F59E0B' },
          { label: 'EXIT VELOCITY', val: 'HIGH', icon: TrendingUp, color: '#F43F5E' }
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
        
        {/* ── INCUBATOR TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'pipeline', label: 'STARTUP PIPELINE', icon: Target },
            { id: 'calculator', label: 'VALUATION TOOL', icon: DollarSign },
            { id: 'deck', label: 'DECK EVALUATOR', icon: Lightbulb },
            { id: 'investors', label: 'INVESTOR MATRIX', icon: Users }
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
          
          {activeTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Incubation Matrix</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Onboard Startup</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {startups.map((s, i) => (
                  <div key={i} className="card-hover" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(249,115,22,0.2)' }}>{s.name[0]}</div>
                       <div>
                          <h4 style={{ margin: '0 0 4px', fontWeight: '800' }}>{s.name}</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             {s.sectors.map(sec => <Badge key={sec} style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.6rem' }}>{sec.toUpperCase()}</Badge>)}
                          </div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '6px' }}>HEALTH CORE</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '100px', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>
                             <div style={{ width: `${s.health}%`, height: '100%', background: '#10B981', borderRadius: '3px', boxShadow: '0 0 10px #10B981' }}></div>
                          </div>
                          <span style={{ fontWeight: '900', color: '#10B981', fontSize: '0.9rem' }}>{s.health}%</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Valuation Architect</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>PRE-MONEY VALUATION ($)</label>
                        <input 
                            type="number" placeholder="500000" 
                            value={valuation.preMoney} 
                            onChange={e => setValuation({...valuation, preMoney: e.target.value})}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-primary)', outline: 'none' }} 
                        />
                     </div>
                     <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>INVESTMENT AMOUNT ($)</label>
                        <input 
                            type="number" placeholder="100000" 
                            value={valuation.investment} 
                            onChange={e => setValuation({...valuation, investment: e.target.value})}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-primary)', outline: 'none' }} 
                        />
                     </div>
                  </div>
                  <div style={{ padding: '2.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                     <p style={{ margin: 0, fontSize: '0.75rem', color: '#10B981', fontWeight: '900', letterSpacing: '1px' }}>POST-MONEY ANALYSIS</p>
                     <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', margin: '15px 0', letterSpacing: '-2px' }}>${calculatePostMoney().post.toLocaleString()}</div>
                     <Badge style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '0.85rem', padding: '8px 20px', border: 'none', margin: '0 auto' }}>{calculatePostMoney().equity}% EQUITY RATIO</Badge>
                  </div>
               </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

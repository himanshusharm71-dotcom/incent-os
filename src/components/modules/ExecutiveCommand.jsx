import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Shield, Zap, Activity, Users, Globe, Target, 
  BarChart3, PieChart, TrendingUp, AlertTriangle,
  Lock, Key, Eye, CheckCircle
} from 'lucide-react';

export default function ExecutiveCommand({ stats }) {
  const [activeTab, setActiveTab] = useState('overview');

  const memberCount = stats?.members?.length || 0;
  const completedTasks = stats?.tasks?.filter(t => t.status === 'completed').length || 0;
  const pendingTasks = stats?.tasks?.filter(t => t.status !== 'completed').length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING STABILITY', val: '99.9%', icon: Shield, color: '#F97316' },
          { label: 'ACTIVE PERSONNEL', val: `${memberCount} Members`, icon: Users, color: '#3B82F6' },
          { label: 'OPERATIONS COMPLETED', val: completedTasks, icon: CheckCircle, color: '#10B981' },
          { label: 'PENDING TASKS', val: pendingTasks, icon: Activity, color: '#F43F5E' }
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
          {['overview', 'analytics', 'governance', 'risk'].map(id => (
            <Button 
              key={id}
              onClick={() => setActiveTab(id)}
              variant={activeTab === id ? 'primary' : 'secondary'}
              style={{
                justifyContent: 'flex-start', padding: '15px 20px', borderRadius: '16px', fontSize: '0.85rem'
              }}
              icon={{
                overview: <Eye size={18} />, 
                analytics: <BarChart3 size={18} />, 
                governance: <Lock size={18} />, 
                risk: <AlertTriangle size={18} />
              }[id]}
            >
              {id.toUpperCase()}
            </Button>
          ))}
        </div>

        <Card className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Executive Command Center</h3>
                <Badge variant="primary" style={{ padding: '8px 15px', borderRadius: '12px' }}>ROOT ACCESS</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                 <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                       <Target size={20} color="var(--accent-primary)" />
                       <span style={{ fontWeight: '900', fontSize: '1rem' }}>Quarterly Objectives</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {[
                         { t: 'Portal Stabilization', p: 100 },
                         { t: 'Ambassador Expansion', p: 85 },
                         { t: 'Corporate Outreach', p: 60 }
                       ].map(obj => (
                         <div key={obj.t}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px', fontWeight: '700' }}>
                               <span>{obj.t}</span>
                               <span>{obj.p}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>
                               <div style={{ width: `${obj.p}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px' }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <PieChart size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <div style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '5px' }}>Resource Allocation</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organization-wide budget and manpower distribution analysis.</div>
                    <Button variant="secondary" size="sm" style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.05)' }}>View Report</Button>
                 </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

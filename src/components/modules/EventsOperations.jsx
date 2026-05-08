import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Calendar, MapPin, Package, Users, Clock, Zap, 
  Plus, CheckSquare, ListChecks, ArrowRight,
  ClipboardList, Truck, AlertTriangle, ChevronRight, Activity
} from 'lucide-react';

export default function EventsOperations({ stats }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  const events = [
    { title: 'Incent Summit 2026', date: 'May 24', location: 'Main Auditorium', status: 'Planning', progress: 65 },
    { title: 'Tech Pioneer Workshop', date: 'May 12', location: 'Conference Hall B', status: 'Confirmed', progress: 90 },
    { title: 'Founder\'s Night', date: 'June 05', location: 'Open Grounds', status: 'Ideation', progress: 20 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── OPERATIONS HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING PERSONNEL', val: memberCount, icon: Users, color: '#8B5CF6' },
          { label: 'ACTIVE PROJECTS', val: 'Active', icon: ClipboardList, color: '#F59E0B' },
          { label: 'PENDING TASKS', val: taskCount, icon: ListChecks, color: '#3B82F6' },
          { label: 'RESOURCE LEVEL', val: '85%', icon: Package, color: '#10B981' }
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
        
        {/* ── OPS TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'upcoming', label: 'EVENT TIMELINE', icon: Calendar },
            { id: 'logistics', label: 'LOGISTICS SYNC', icon: Truck },
            { id: 'checklist', label: 'OPS CHECKLIST', icon: ListChecks },
            { id: 'venues', label: 'VENUE MATRIX', icon: MapPin }
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
          
          {activeTab === 'upcoming' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Operational Timeline</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Draft Event</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {events.map((e, i) => (
                  <div key={i} className="card-hover" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                       <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                          <div style={{ padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '70px' }}>
                             <div style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{e.date.split(' ')[0].toUpperCase()}</div>
                             <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>{e.date.split(' ')[1]}</div>
                          </div>
                          <div>
                             <h4 style={{ margin: '0 0 6px', fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{e.title}</h4>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {e.location}</div>
                                <Badge style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--accent-primary)', border: 'none', fontSize: '0.6rem' }}>{e.status.toUpperCase()}</Badge>
                             </div>
                          </div>
                       </div>
                       <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}><ChevronRight size={24} /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${e.progress}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px', boxShadow: '0 0 10px rgba(249,115,22,0.3)' }}></div>
                       </div>
                       <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>{e.progress}% READY</span>
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

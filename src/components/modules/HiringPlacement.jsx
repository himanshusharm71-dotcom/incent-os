import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Building2, Users, Briefcase, GraduationCap, Search, Plus, 
  Calendar, CheckCircle2, XCircle, Clock, FileText, Send,
  UserPlus, Mail, Phone, ExternalLink, ChevronRight, Activity
} from 'lucide-react';

export default function HiringPlacement({ stats }) {
  const [activeTab, setActiveTab] = useState('hiring');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  const jobs = [
    { title: 'Frontend Lead', company: 'Neural Systems', type: 'Full-time', applicants: 12, status: 'Active' },
    { title: 'AI Research Intern', company: 'Incent Labs', type: 'Internship', applicants: 45, status: 'Active' },
    { title: 'Operations Manager', company: 'Global Core', type: 'Full-time', applicants: 8, status: 'Reviewing' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── PLACEMENT HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING PERSONNEL', val: memberCount, icon: Users, color: '#3B82F6' },
          { label: 'ACTIVE LISTINGS', val: 'Active', icon: Briefcase, color: '#F59E0B' },
          { label: 'PENDING TASKS', val: taskCount, icon: CheckCircle2, color: '#10B981' },
          { label: 'OPEN SECTORS', val: 5, icon: GraduationCap, color: '#8B5CF6' }
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
        
        {/* ── PLACEMENT TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'hiring', label: 'TALENT MATRIX', icon: Users },
            { id: 'listings', label: 'JOB VAULT', icon: Briefcase },
            { id: 'interviews', label: 'SYNC SESSIONS', icon: Calendar },
            { id: 'stats', label: 'HIRING ANALYTICS', icon: Activity }
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
          
          {activeTab === 'hiring' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Talent Matrix</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Deploy Listing</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {jobs.map((j, i) => (
                  <div key={i} className="card-hover" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={22} color="var(--accent-primary)" /></div>
                       <div>
                          <h4 style={{ margin: '0 0 4px', fontWeight: '800' }}>{j.title}</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <Badge style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.6rem' }}>{j.company.toUpperCase()}</Badge>
                             <Badge style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--accent-primary)', fontSize: '0.6rem' }}>{j.type.toUpperCase()}</Badge>
                          </div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                       <div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '900' }}>APPLICANTS</div>
                          <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>{j.applicants}</div>
                       </div>
                       <Badge variant={j.status === 'Active' ? 'success' : 'warning'}>{j.status.toUpperCase()}</Badge>
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

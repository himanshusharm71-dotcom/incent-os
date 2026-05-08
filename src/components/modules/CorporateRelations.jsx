import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Building2, Handshake, Mail, FileCheck, PhoneCall, Globe, 
  Search, Plus, TrendingUp, Users, Zap, ExternalLink,
  ShieldCheck, Briefcase, BarChart
} from 'lucide-react';

export default function CorporateRelations() {
  const [activeTab, setActiveTab] = useState('crm');

  const partners = [
    { name: 'Google Cloud', status: 'Signed', type: 'Technology', value: 'Enterprise' },
    { name: 'Amazon AWS', status: 'Pending', type: 'Infrastructure', value: 'Startup tier' },
    { name: 'HDFC Bank', status: 'Review', type: 'Financial', value: 'Investment' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── PARTNERSHIP HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'ACTIVE MOUS', val: '24', icon: FileCheck, color: '#10B981' },
          { label: 'PIPELINE VALUE', val: '$45k', icon: TrendingUp, color: '#F59E0B' },
          { label: 'LEAD CONVERSION', val: '68%', icon: Zap, color: '#3B82F6' },
          { label: 'RELATIONSHIP NODES', val: '120+', icon: Users, color: '#8B5CF6' }
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
        
        {/* ── CRM TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'crm', label: 'PARTNER MATRIX', icon: Building2 },
            { id: 'mou', label: 'MOU VAULT', icon: ShieldCheck },
            { id: 'outreach', label: 'OUTREACH HUB', icon: Handshake },
            { id: 'analytics', label: 'ROI TRACKER', icon: BarChart }
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
          
          {activeTab === 'crm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Partner Matrix</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>New Lead</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {partners.map((p, i) => (
                  <div key={i} className="card-hover" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={22} color="var(--accent-primary)" /></div>
                       <div>
                          <h4 style={{ margin: '0 0 4px', fontWeight: '800' }}>{p.name}</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <Badge style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', fontSize: '0.6rem' }}>{p.type}</Badge>
                             <Badge style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--accent-primary)', fontSize: '0.6rem' }}>{p.value}</Badge>
                          </div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <Badge variant={p.status === 'Signed' ? 'success' : 'warning'}>{p.status.toUpperCase()}</Badge>
                       <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ExternalLink size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'outreach' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Outreach Hub</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ padding: '2rem', background: 'rgba(249,115,22,0.1)', borderRadius: '28px', border: '1px solid rgba(249,115,22,0.2)', textAlign: 'center' }}>
                     <Mail size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                     <h4 style={{ margin: '0 0 10px', fontWeight: '900' }}>Email Campaigns</h4>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Initialize automated outreach sequences for tier-1 partners.</p>
                     <Button variant="primary" style={{ width: '100%' }}>Launch Sequence</Button>
                  </div>
                  <div style={{ padding: '2rem', background: 'rgba(59,130,246,0.1)', borderRadius: '28px', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
                     <Globe size={40} color="#3B82F6" style={{ marginBottom: '1rem' }} />
                     <h4 style={{ margin: '0 0 10px', fontWeight: '900' }}>Global Leads</h4>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Analyze geographic partnership distribution and market reach.</p>
                     <Button variant="secondary" style={{ width: '100%', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>Open Lead Map</Button>
                  </div>
               </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Megaphone, Share2, TrendingUp, BarChart3, Globe, Zap, 
  Calendar, Camera, MousePointer2, Users, Target, Plus,
  Instagram, Twitter, Linkedin, Facebook, BarChart, ExternalLink,
  ChevronRight, Activity
} from 'lucide-react';

export default function PublicityMarketing({ stats }) {
  const [activeTab, setActiveTab] = useState('analytics');

  const memberCount = stats?.members?.length || 0;
  const taskCount = stats?.tasks?.length || 0;

  const campaigns = [
    { name: 'INCENT Launch 2026', platform: 'Instagram', reach: '24.5k', engagement: '8.2%', status: 'Active' },
    { name: 'Tech Pioneer Webinar', platform: 'LinkedIn', reach: '12.1k', engagement: '12.4%', status: 'Scheduled' },
    { name: 'Cyber Week Promo', platform: 'Twitter', reach: '8.4k', engagement: '5.1%', status: 'Completed' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── MARKETING HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'WING PERSONNEL', val: memberCount, icon: Users, color: '#3B82F6' },
          { label: 'ACTIVE CAMPAIGNS', val: 'Active', icon: Megaphone, color: '#F59E0B' },
          { label: 'PENDING TASKS', val: taskCount, icon: Target, color: '#10B981' },
          { label: 'TOTAL REACH', val: 'Global', icon: Globe, color: '#8B5CF6' }
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
        
        {/* ── MARKETING TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'analytics', label: 'CAMPAIGN INSIGHTS', icon: BarChart3 },
            { id: 'scheduler', label: 'POST SCHEDULER', icon: Calendar },
            { id: 'ads', label: 'AD SPEND TRACKER', icon: Target },
            { id: 'channels', label: 'CHANNEL MATRIX', icon: Share2 }
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
          
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Marketing Intelligence</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Launch Campaign</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {campaigns.map((c, i) => (
                  <div key={i} className="card-hover" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {c.platform === 'Instagram' && <Instagram size={22} color="#E1306C" />}
                          {c.platform === 'LinkedIn' && <Linkedin size={22} color="#0077B5" />}
                          {c.platform === 'Twitter' && <Twitter size={22} color="#1DA1F2" />}
                       </div>
                       <div>
                          <h4 style={{ margin: '0 0 4px', fontWeight: '800' }}>{c.name}</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <Badge style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.6rem' }}>{c.platform.toUpperCase()}</Badge>
                             <Badge style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '0.6rem' }}>{c.engagement} ENGAGEMENT</Badge>
                          </div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                       <div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '900' }}>REACH</div>
                          <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>{c.reach}</div>
                       </div>
                       <Badge variant={c.status === 'Active' ? 'success' : 'info'}>{c.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scheduler' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Narrative Architect</h3>
               <div style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>POST CONTENT PROTOCOL</label>
                  <textarea rows={5} placeholder="Define the campaign narrative..." style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-primary)', outline: 'none', resize: 'none', fontSize: '1rem' }} />
                  <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem' }}>
                     <Button variant="secondary" icon={<Camera size={18} />} style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>Attach Visuals</Button>
                     <Button variant="primary" style={{ flex: 1 }}>Sync & Deploy</Button>
                  </div>
               </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

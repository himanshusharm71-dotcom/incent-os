import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Palette, Image, Layout, PenTool, Layers, Eye, 
  Download, Share2, Plus, Filter, Grid, List,
  Contrast, CheckCircle, RefreshCw, Zap, ExternalLink
} from 'lucide-react';

export default function DesignCreative() {
  const [activeTab, setActiveTab] = useState('library');

  const assets = [
    { name: 'Incent Logo V2', type: 'SVG', date: 'May 04', preview: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=300&fit=crop' },
    { name: 'Campaign Banner', type: 'PNG', date: 'May 06', preview: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=300&fit=crop' },
    { name: 'UI Icon Set', type: 'FIGMA', date: 'May 07', preview: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=300&fit=crop' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── DESIGN HUD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'TOTAL ASSETS', val: 128, icon: Layers, color: '#F43F5E' },
          { label: 'PENDING REVIEWS', val: 5, icon: Eye, color: '#3B82F6' },
          { label: 'STORAGE USED', val: '2.4 GB', icon: Image, color: '#8B5CF6' },
          { label: 'TEAM VELOCITY', val: 'HIGH', icon: Zap, color: '#10B981' }
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
        
        {/* ── DESIGN TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'library', label: 'ASSET VAULT', icon: Image },
            { id: 'palette', label: 'COLOR MATRIX', icon: Palette },
            { id: 'review', label: 'CREATIVE AUDIT', icon: Eye },
            { id: 'guidelines', label: 'BRAND SYSTEM', icon: Layout }
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
          
          {activeTab === 'library' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Central Asset Vault</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Upload Asset</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {assets.map((a, i) => (
                  <div key={i} className="card-hover" style={{ padding: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', cursor: 'pointer' }}>
                     <img src={a.preview} alt={a.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '16px', marginBottom: '15px' }} />
                     <div style={{ padding: '0 10px 10px' }}>
                        <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Badge style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.6rem', border: 'none' }}>{a.type}</Badge>
                           <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>{a.date}</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'palette' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Color Architecture</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  {[
                    { name: 'INCENT Orange', hex: '#F97316', label: 'Primary' },
                    { name: 'Cyber Blue', hex: '#3B82F6', label: 'Secondary' },
                    { name: 'Void Black', hex: '#020617', label: 'Deep' },
                    { name: 'Neural White', hex: '#F8FAFC', label: 'Accent' }
                  ].map((c, i) => (
                    <div key={i} style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                       <div style={{ width: '70px', height: '70px', background: c.hex, borderRadius: '50%', margin: '0 auto 20px', border: '4px solid rgba(0,0,0,0.1)', boxShadow: `0 15px 30px ${c.hex}30` }}></div>
                       <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{c.name}</div>
                       <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.hex}</div>
                    </div>
                  ))}
               </div>
               <Button variant="secondary" icon={<RefreshCw size={18} />} style={{ width: 'fit-content', margin: '2rem auto 0', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>Regenerate Matrix</Button>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

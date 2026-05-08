import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  FileText, Folder, Shield, Search, Plus, 
  Download, Eye, Lock, Clock, Book,
  HardDrive, Database, Archive
} from 'lucide-react';

export default function DocumentationVault() {
  const [activeTab, setActiveTab] = useState('archives');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'TOTAL DOCS', val: '1,240', icon: FileText, color: '#64748B' },
          { label: 'ARCHIVED', val: '850', icon: Archive, color: '#3B82F6' },
          { label: 'STORAGE', val: '4.2 GB', icon: HardDrive, color: '#F59E0B' },
          { label: 'SECURITY', val: 'L3', icon: Shield, color: '#10B981' }
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
            { id: 'archives', label: 'MASTER ARCHIVE', icon: Database },
            { id: 'templates', label: 'DOC TEMPLATES', icon: Book },
            { id: 'security', label: 'ACCESS CONTROL', icon: Lock },
            { id: 'history', label: 'REVISION LOG', icon: Clock }
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
          {activeTab === 'archives' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Knowledge Repository</h3>
                <Button variant="primary" size="sm" icon={<Plus size={16} />}>Index New Doc</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {[
                   { name: 'Annual Strategy 2024', type: 'PDF', size: '2.4 MB', status: 'Locked' },
                   { name: 'Onboarding Manual', type: 'DOCX', size: '1.1 MB', status: 'Public' },
                   { name: 'Partner Agreements', type: 'ZIP', size: '45 MB', status: 'Encrypted' }
                 ].map((doc, i) => (
                   <div key={i} className="card-hover" style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <div style={{ padding: '10px', background: 'rgba(100,116,139,0.1)', borderRadius: '12px' }}><FileText size={20} color="#64748B" /></div>
                         <div>
                            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.type} • {doc.size}</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                         <Badge size="sm" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>{doc.status}</Badge>
                         <Button size="sm" variant="secondary" style={{ padding: '6px' }}><Download size={14} /></Button>
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

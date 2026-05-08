import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Terminal, Cpu, HardDrive, Wifi, Shield, Zap, Search, 
  Code, Bug, Activity, Server, Database, Globe, Play, Trash2,
  ChevronRight, Lock, Network
} from 'lucide-react';

export default function TechDev() {
  const [activeTab, setActiveTab] = useState('health');
  const [logs, setLogs] = useState([
    { time: '20:45:12', type: 'INFO', msg: 'Neural Link Synchronized' },
    { time: '20:46:05', type: 'WARN', msg: 'Latency spike detected in AP-South region' },
    { time: '20:48:33', type: 'INFO', msg: 'Encryption protocols updated to v5.2' }
  ]);
  const [apiPing, setApiPing] = useState('');
  const [pingResult, setPingResult] = useState(null);

  const handlePing = () => {
    if (!apiPing) return;
    setPingResult('PROBING...');
    setTimeout(() => {
        setPingResult(`STATUS: 200 OK | LATENCY: ${Math.floor(Math.random() * 50 + 10)}ms`);
    }, 800);
  };

  const serverMetrics = [
    { label: 'Uptime', val: '99.99%', icon: Activity, color: '#10B981' },
    { label: 'Latency', val: '24ms', icon: Wifi, color: '#3B82F6' },
    { label: 'Memory', val: '4.2GB / 8GB', icon: HardDrive, color: '#F59E0B' },
    { label: 'Load', val: '12%', icon: Cpu, color: '#8B5CF6' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── TECH COMMAND CENTER HEADER ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {serverMetrics.map((m, i) => (
          <Card key={i} className="glass-card mouse-glow" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
             <m.icon size={28} color={m.color} style={{ marginBottom: '15px', filter: `drop-shadow(0 0 10px ${m.color}40)` }} />
             <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '2px' }}>{m.label.toUpperCase()}</div>
             <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>{m.val}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        
        {/* ── SIDEBAR TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'health', label: 'SYSTEM HEALTH', icon: Server },
            { id: 'tester', label: 'API PROBE', icon: Zap },
            { id: 'logs', label: 'KERNEL LOGS', icon: Terminal },
            { id: 'security', label: 'SECURITY AUDIT', icon: Shield }
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
        <Card className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-card)', minHeight: '450px' }}>
          
          {activeTab === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.4rem' }}>Infrastructure Monitor</h3>
                <Badge variant="success" style={{ padding: '6px 15px', borderRadius: '10px' }}>LIVE TELEMETRY</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.05)' }}>
                   <h4 style={{ fontSize: '0.7rem', fontWeight: '900', marginBottom: '2rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>DATABASE SYNC VELOCITY</h4>
                   <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px' }}>
                      {[40, 70, 45, 90, 65, 80, 50, 75, 85, 60, 95, 70].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: 'var(--accent-primary)', height: `${h}%`, borderRadius: '6px', opacity: 0.2 + (i * 0.06), boxShadow: '0 0 15px rgba(249,115,22,0.3)' }}></div>
                      ))}
                   </div>
                </div>
                <div style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#10B981' }}>
                      <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '24px' }}>
                         <Lock size={40} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--text-primary)' }}>ENCRYPTION ACTIVE</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>TLS 1.3 | QUANTUM SECURE</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Kernel Runtime Logs</h3>
                  <Button variant="secondary" size="sm" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>CLEAR CACHE</Button>
               </div>
               <div className="custom-scrollbar" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.05)', padding: '2rem', borderRadius: '28px', fontFamily: 'monospace', fontSize: '0.9rem', height: '350px', overflowY: 'auto' }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '12px', display: 'flex', gap: '20px', borderBottom: '1px solid rgba(0,0,0,0.02)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
                      <span style={{ color: log.type === 'WARN' ? '#F59E0B' : '#10B981', fontWeight: '900' }}>{log.type}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{log.msg}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '20px', animation: 'pulse 1s infinite' }}>
                      <span style={{ color: 'var(--text-muted)' }}>[{new Date().toLocaleTimeString()}]</span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>RUNNING</span>
                      <span style={{ color: 'var(--text-muted)' }}>Awaiting telemetry stream...</span>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'tester' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>Neural Probe Tool</h3>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginBottom: '12px', letterSpacing: '1px' }}>TARGET ENDPOINT ARCHITECTURE</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input 
                    placeholder="https://api.incent.os/v1/sync" 
                    value={apiPing} 
                    onChange={e => setApiPing(e.target.value)}
                    style={{ flex: 1, padding: '18px', borderRadius: '18px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'monospace', outline: 'none' }} 
                  />
                  <Button variant="primary" onClick={handlePing} style={{ padding: '0 30px' }}>INITIATE PROBE</Button>
                </div>
                {pingResult && (
                  <div style={{ marginTop: '2rem', padding: '20px', background: 'rgba(0,0,0,0.6)', color: '#10B981', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {'>'} {pingResult}
                  </div>
                )}
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

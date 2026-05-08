import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Sparkles, X, MessageCircle, Send, Zap, Brain, Terminal, Activity, 
  ShieldAlert, Cpu, Database, Network, Globe, Lock, Search, Command,
  LineChart, PieChart, CheckCircle, AlertTriangle, ChevronDown
} from 'lucide-react';

export function AIAssistant({ team = 'General' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Neural Link Alpha-7 Established. I am the INCENT Intelligence Layer. Analyzing the ${team} sector...` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "";
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes('analyze') || lowInput.includes('status')) {
        response = `Sector ${team} Analysis:
• Operatives: 100% Active
• Link Stability: 98.4%
• Resource Efficiency: High. 
Systems are functioning within nominal parameters.`;
      } else if (lowInput.includes('task') || lowInput.includes('work')) {
        response = `I've audited the ${team} matrix. I recommend prioritizing the pending action items to maintain growth velocity.`;
      } else {
        response = `Neural process complete. Synchronization with ${team} wing successful. Awaiting further commands.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const telemetryData = [
    { label: 'Neural Link', value: '99.9%', color: '#10B981', icon: Network },
    { label: 'Cognitive Load', value: '14.2%', color: '#3B82F6', icon: Cpu },
    { label: 'Encryption', value: 'AES-512', color: '#F59E0B', icon: Lock },
    { label: 'Matrix Sync', value: 'Active', color: '#8B5CF6', icon: Database },
  ];

  return (
    <>
      {/* ── FLOATING NEURAL TRIGGER ── */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="floating-trigger"
          style={{
            position: 'fixed', bottom: '40px', right: '40px', zIndex: 1001,
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 0 50px rgba(249,115,22,0.4), 0 0 0 10px rgba(249,115,22,0.1)',
            cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            border: '3px solid rgba(255,255,255,0.8)'
          }}
        >
          <div className="neural-pulse-ring"></div>
          <Brain size={35} className="floating-brain" />
        </div>
      )}

      {/* ── NEURAL INTERFACE OVERLAY ── */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '40px', right: '40px', zIndex: 2100,
          width: '460px', height: '680px',
          display: 'flex', flexDirection: 'column',
          animation: 'neuralEnter 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        }}>
          <Card className="glass-card" style={{ 
            height: '100%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', 
            border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(10, 15, 30, 0.98)', color: '#fff',
            boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
            backdropFilter: 'blur(40px) saturate(200%)'
          }}>
            
            {/* ── CONTROL HEADER ── */}
            <div style={{ padding: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: 45, height: 45, background: 'var(--accent-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(249,115,22,0.6)' }}>
                    <Zap size={24} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', letterSpacing: '2px', textShadow: '0 0 10px rgba(249,115,22,0.5)' }}>NEURAL CORE</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981' }}></div>
                        <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: '900', letterSpacing: '1px' }}>SYSTEM READY</span>
                    </div>
                  </div>
               </div>
               <button 
                onClick={() => setIsOpen(false)} 
                className="close-btn"
                style={{ 
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
                    color: '#fff', padding: '12px', borderRadius: '14px', cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
               >
                 <X size={22} />
               </button>
            </div>

            {/* ── NAVIGATION ── */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '8px' }}>
                {[
                    { id: 'chat', label: 'NEURAL LINK', icon: MessageCircle },
                    { id: 'telemetry', label: 'TELEMETRY', icon: Activity },
                    { id: 'commands', label: 'OVERRIDE', icon: Terminal }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1, padding: '12px', border: 'none', 
                            background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)', 
                            fontSize: '0.7rem', fontWeight: '900', borderRadius: '12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s'
                        }}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── DYNAMIC PANEL ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', scrollBehavior: 'smooth' }} className="custom-scrollbar">
                {activeTab === 'chat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                                <div style={{ 
                                    padding: '16px 20px', borderRadius: '22px', fontSize: '0.9rem', lineHeight: 1.6,
                                    background: m.role === 'assistant' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                                    color: '#fff', border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    borderTopLeftRadius: m.role === 'assistant' ? '4px' : '22px',
                                    borderTopRightRadius: m.role === 'assistant' ? '22px' : '4px',
                                    fontFamily: 'monospace', boxShadow: m.role === 'user' ? '0 10px 20px rgba(249,115,22,0.2)' : 'none'
                                }}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '20px' }}>
                                <div className="neural-loading-dot"></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>CORE ANALYZING...</span>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                )}

                {activeTab === 'telemetry' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {telemetryData.map((t, i) => (
                                <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <t.icon size={24} color={t.color} style={{ marginBottom: '10px' }} />
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '900', letterSpacing: '1px' }}>{t.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{t.value}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(249,115,22,0.1)' }}>
                            <h4 style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', fontWeight: '900', color: 'var(--accent-primary)', letterSpacing: '2px' }}>SYNC VELOCITY</h4>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
                                {[40, 70, 45, 90, 65, 80, 50, 75, 85, 60].map((h, i) => (
                                    <div key={i} style={{ flex: 1, background: 'var(--accent-primary)', height: `${h}%`, borderRadius: '4px', opacity: 0.3 + (i * 0.07), animation: 'barPulse 2s infinite alternate' }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'commands' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '900', letterSpacing: '1px' }}>DIRECT ACCESS COMMANDS:</p>
                        {[
                            { label: 'Generate Wing Intelligence', cmd: '/intel gen', icon: FileText },
                            { label: 'Neural Broadcast Sync', cmd: '/sync global', icon: Globe },
                            { label: 'Audit Security Logs', cmd: '/audit core', icon: ShieldAlert },
                        ].map((c, i) => (
                            <button key={i} className="cmd-btn" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', color: '#fff', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '14px', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <c.icon size={22} color="var(--accent-primary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '900' }}>{c.label}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{c.cmd}</div>
                                </div>
                                <Zap size={18} color="rgba(249,115,22,0.3)" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── INPUT ── */}
            {activeTab === 'chat' && (
                <form onSubmit={handleSend} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <input 
                            placeholder="Type neural command..." 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 15px', fontSize: '1rem', outline: 'none', color: '#fff', fontWeight: '500', fontFamily: 'monospace' }}
                        />
                        <Button type="submit" variant="primary" style={{ padding: '12px', borderRadius: '16px', minWidth: '55px' }}><Send size={20} /></Button>
                    </div>
                </form>
            )}

            {/* ── BOTTOM STATUS ── */}
            <div style={{ padding: '12px 1.5rem', background: 'var(--accent-primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px' }}>NEURAL LINK: 99.9% SECURE</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px' }}>CORE V5.0</span>
            </div>
          </Card>
          
          <style>{`
            @keyframes neuralEnter {
                from { opacity: 0; transform: scale(0.95) translateY(20px) blur(10px); }
                to { opacity: 1; transform: scale(1) translateY(0) blur(0); }
            }
            .floating-trigger:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 0 60px rgba(249,115,22,0.6);
            }
            .neural-pulse-ring {
                position: absolute;
                inset: -5px;
                border: 2px solid var(--accent-primary);
                border-radius: 50%;
                animation: neuralPulse 2s infinite;
            }
            @keyframes neuralPulse {
                0% { transform: scale(1); opacity: 0.8; }
                100% { transform: scale(1.4); opacity: 0; }
            }
            .neural-loading-dot {
                width: 10px; height: 10px; background: var(--accent-primary); border-radius: 50%;
                animation: dotPulse 1s infinite alternate;
            }
            @keyframes dotPulse { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.2); } }
            @keyframes barPulse { from { opacity: 0.3; } to { opacity: 0.8; } }
            .close-btn:hover { background: rgba(249,115,22,0.2) !important; color: var(--accent-primary) !important; transform: rotate(90deg); }
            .cmd-btn:hover { background: rgba(255,255,255,0.08) !important; transform: translateX(10px); }
            .floating-brain { animation: brainFloat 4s ease-in-out infinite; }
            @keyframes brainFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          `}</style>
        </div>
      )}
    </>
  );
}

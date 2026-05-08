import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Send, Hash, Megaphone, Users, Shield, Lock, Search } from 'lucide-react';

// Local Crown icon definition
const Crown = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M5 20h14" />
  </svg>
);

function Communication() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('Main');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const channels = [
    { 
      id: 'Main', 
      name: 'Main Group', 
      icon: Megaphone, 
      color: '#F97316', 
      access: 'all', 
      canPost: ['super_admin', 'admin'] 
    },
    { 
      id: 'Leaders', 
      name: 'Leaders Group', 
      icon: Crown, 
      color: '#F59E0B', 
      access: ['super_admin', 'admin', 'leader'],
      canPost: ['super_admin', 'admin', 'leader'] 
    },
    { 
      id: 'Deputies', 
      name: 'Deputy Leaders Group', 
      icon: Shield, 
      color: '#6366F1', 
      access: ['super_admin', 'admin', 'leader', 'deputy_leader'],
      canPost: ['super_admin', 'admin', 'leader', 'deputy_leader']
    },
    { 
      id: 'Volunteers', 
      name: 'Volunteers Group', 
      icon: Users, 
      color: '#10B981', 
      access: 'all', 
      canPost: 'all' 
    },
  ];

  const currentChannel = channels.find(c => c.id === activeChannel) || channels[0];
  const canIWrite = currentChannel.canPost === 'all' || (Array.isArray(currentChannel.canPost) && currentChannel.canPost.includes(user?.role));
  const hasAccess = currentChannel.access === 'all' || (Array.isArray(currentChannel.access) && currentChannel.access.includes(user?.role));

  useEffect(() => {
    if (hasAccess) {
      fetchMessages();

      // 🛰️ REALTIME SUBSCRIPTION
      const channel = supabase
        .channel(`public:messages:channel=${activeChannel}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel=eq.${activeChannel}`
        }, (payload) => {
          // Add new message if it's not from us (we already added it optimistically)
          setMessages(prev => {
            const exists = prev.find(m => m.id === payload.new.id);
            return exists ? prev : [...prev, payload.new];
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel', activeChannel)
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !canIWrite) return;

    const tempId = Date.now();
    const msgData = {
      channel: activeChannel,
      user_id: user?.uid,
      user_name: user?.Name || user?.email,
      role: user?.role,
      text: newMessage,
      created_at: new Date().toISOString()
    };

    // Optimistic Update
    setMessages(prev => [...prev, { ...msgData, id: tempId }]);
    setNewMessage('');

    const { error } = await supabase.from('messages').insert([msgData]);
    if (error) {
        console.error("Send error:", error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== tempId));
        alert("Failed to send message.");
    }
  };

  if (!hasAccess) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <Lock size={64} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.2 }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)' }}>Only authorized personnel can access this channel.</p>
        <Button variant="primary" onClick={() => setActiveChannel('Volunteers')} style={{ marginTop: '1rem' }}>Switch to General Chat</Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 160px)', minHeight: '500px' }} className="animate-fade-in">
      
      {/* Sidebar (Channels) */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Card style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
            Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {channels.map(ch => {
              const chAccess = ch.access === 'all' || ch.access.includes(user?.role);
              return (
                <div 
                  key={ch.id}
                  onClick={() => chAccess && setActiveChannel(ch.id)}
                  onMouseDown={(e) => chAccess && (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => chAccess && (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => chAccess && (e.currentTarget.style.transform = 'scale(1)')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '12px',
                    cursor: chAccess ? 'pointer' : 'not-allowed',
                    background: activeChannel === ch.id ? `${ch.color}15` : 'transparent',
                    border: activeChannel === ch.id ? `1px solid ${ch.color}30` : '1px solid transparent',
                    color: activeChannel === ch.id ? ch.color : 'var(--text-primary)',
                    opacity: chAccess ? 1 : 0.5,
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                >
                  <ch.icon size={18} />
                  <span style={{ fontWeight: activeChannel === ch.id ? '700' : '500', fontSize: '0.95rem' }}>{ch.name}</span>
                  {!chAccess && <Lock size={12} style={{ marginLeft: 'auto' }} />}
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.Name || 'Online'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', position: 'relative' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: `${currentChannel.color}15`, borderRadius: '10px' }}>
              <currentChannel.icon size={20} color={currentChannel.color} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{currentChannel.name}</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{canIWrite ? 'Active discussion' : 'Read-only'}</p>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Syncing encrypted messages...</div> : 
           messages.length === 0 ? <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No messages yet in #{activeChannel}. Be the first to start!</div> :
           messages.map((msg) => {
            const isMe = msg.user_id === user?.uid || (msg.user_name || '').toLowerCase().includes('himanshu');
            return (
              <div key={msg.id} style={{ display: 'flex', gap: '12px', maxWidth: '85%', alignSelf: isMe ? 'flex-end' : 'flex-start', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user_name)}&background=random`} size="sm" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{msg.user_name}</span>
                    <Badge size="sm" style={{ fontSize: '0.55rem' }}>{msg.role?.toUpperCase()}</Badge>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ 
                    padding: '10px 14px', 
                    borderRadius: '16px', 
                    borderTopLeftRadius: isMe ? '16px' : '4px',
                    borderTopRightRadius: isMe ? '4px' : '16px',
                    background: isMe ? 'var(--accent-primary)' : 'rgba(0,0,0,0.05)',
                    color: isMe ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.9rem',
                    boxShadow: isMe ? '0 4px 12px rgba(249, 115, 22, 0.2)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canIWrite && (
          <form onSubmit={sendMessage} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)', background: '#fff' }}>
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <input 
                type="text" 
                placeholder={`Message #${activeChannel.toLowerCase()}...`}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 15px', outline: 'none', fontSize: '0.95rem' }}
              />
              <Button type="submit" variant="primary" icon={<Send size={18} />} style={{ borderRadius: '12px' }}>Send</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Communication;

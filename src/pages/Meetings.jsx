import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import JitsiRoom from '../components/JitsiRoom';
import {
  Plus, Clock, Users, X, Calendar,
  Video, Mic, MonitorUp, PhoneCall
} from 'lucide-react';

const TEAMS = [
  'All Hands (Full Team)', 'Core', 'Technical Support', 'Event Management',
  'Startup & Innovation', 'Corporate Relations',
  'Public Relations', 'Social Media & Branding'
];

// Generate a clean Jitsi room name from meeting title
const makeRoomName = (title, id) => {
  const slug = (title || 'meeting')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
  return `incent-os-${slug}-${(id || Date.now()).toString().slice(-6)}`;
};

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: '600',
  color: 'var(--text-muted)', marginBottom: '6px',
};

function Meetings() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const canCreate = isAdmin || user?.role === 'leader';

  const [meetings, setMeetings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [activeRoom, setActiveRoom] = useState(null); // { roomName, meetingTitle }

  const [form, setForm] = useState({
    title: '', date: '', time: '',
    team: user?.team || 'Core',
    attendees_count: '',
    agenda: '',
  });

  useEffect(() => { fetchMeetings(); }, [user]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: false });

      if (user && !isAdmin) {
        query = query.or(`team.eq."${user.team}",team.eq."All Hands (Full Team)"`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMeetings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const meetingDate = new Date(`${form.date}T${form.time || '00:00'}`);
      const status = meetingDate > new Date() ? 'upcoming' : 'completed';

      // Auto-generate Jitsi room name
      const tempId = Date.now();
      const roomName = makeRoomName(form.title, tempId);

      const { error } = await supabase.from('meetings').insert([{
        ...form,
        status,
        platform: 'Built-in Video Call',
        meeting_link: roomName,    // store the Jitsi room name
        created_by: user?.Name || user?.email,
      }]);
      if (error) throw error;

      setShowModal(false);
      setForm({ title: '', date: '', time: '', team: user?.team || 'Core', attendees_count: '', agenda: '' });
      fetchMeetings();
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const isUpcoming = (m) => {
    if (!m.date) return false;
    return new Date(`${m.date}T${m.time || '00:00'}`) > new Date();
  };

  // If inside a call, show the full-screen Jitsi room
  if (activeRoom) {
    return (
      <JitsiRoom
        roomName={activeRoom.roomName}
        displayName={user?.Name || user?.email || 'Participant'}
        onClose={() => { setActiveRoom(null); fetchMeetings(); }}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Meetings</h1>
          <p style={{ margin: 0 }}>Video meetings happen right here — no external app needed.</p>
        </div>
        {canCreate && (
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
            Schedule Meeting
          </Button>
        )}
      </div>

      {/* Feature Badges */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[
          { icon: <Video size={14} />, label: 'HD Video' },
          { icon: <Mic size={14} />, label: 'Crystal Audio' },
          { icon: <MonitorUp size={14} />, label: 'Screen Share' },
          { icon: <PhoneCall size={14} />, label: 'Built-in — No App Needed' },
        ].map((f, i) => (
          <span key={i} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600',
            background: 'rgba(249,115,22,0.08)', color: 'var(--accent-primary)',
            border: '1px solid rgba(249,115,22,0.2)',
          }}>
            {f.icon} {f.label}
          </span>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(5px)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>📅 Schedule Meeting</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Meeting Title *</label>
                <input placeholder="e.g. Weekly Sync — Tech Team"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Time *</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Team</label>
                <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} disabled={!isAdmin}>
                  {TEAMS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Expected Attendees</label>
                <input type="number" min="1" placeholder="Number of people"
                  value={form.attendees_count} onChange={e => setForm({ ...form, attendees_count: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Agenda (optional)</label>
                <textarea rows={3} placeholder="Topics to discuss…"
                  value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div style={{
                padding: '12px', borderRadius: '10px',
                background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)',
                fontSize: '0.82rem', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Video size={16} color="var(--accent-primary)" />
                A video room will be created automatically — anyone can join from within INCENT OS.
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                  {saving ? 'Creating…' : '🎥 Schedule & Create Room'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Meetings List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading meetings…</div>
      ) : meetings.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '2px dashed var(--border-light)', borderRadius: '16px' }}>
          <Calendar size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
          <p>No meetings yet. Schedule one to start a video call!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {meetings.map(m => {
            const upcoming = isUpcoming(m);
            return (
              <Card key={m.id} style={{
                display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap',
                padding: '1.5rem',
                borderLeft: upcoming ? '4px solid var(--accent-primary)' : '4px solid var(--border-light)',
              }}>
                {/* Date Box */}
                <div style={{
                  textAlign: 'center', minWidth: '72px', padding: '0.875rem',
                  background: upcoming ? 'rgba(249,115,22,0.08)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '12px', border: upcoming ? '1px solid rgba(249,115,22,0.25)' : '1px solid var(--border-light)',
                  flexShrink: 0,
                }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px' }}>
                    {m.date ? new Date(m.date + 'T00:00:00').toLocaleString('default', { month: 'short' }) : '—'}
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: upcoming ? 'var(--accent-primary)' : 'var(--text-primary)', lineHeight: 1 }}>
                    {m.date ? new Date(m.date + 'T00:00:00').getDate() : '—'}
                  </div>
                  {m.time && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{m.time}</div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <Badge variant={upcoming ? 'primary' : 'default'}>{upcoming ? '🟢 Upcoming' : '✅ Done'}</Badge>
                    <Badge variant="info">{m.team}</Badge>
                    <span style={{
                      fontSize: '0.72rem', padding: '2px 10px', borderRadius: '20px',
                      background: 'rgba(249,115,22,0.1)', color: 'var(--accent-primary)',
                      border: '1px solid rgba(249,115,22,0.2)', fontWeight: '600',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <Video size={11} /> Built-in Video
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '700' }}>{m.title}</h3>

                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '8px' }}>
                    {m.attendees_count && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> {m.attendees_count} Expected</span>}
                    {m.created_by && <span>Scheduled by {m.created_by}</span>}
                  </div>

                  {m.agenda && (
                    <p style={{
                      margin: 0, fontSize: '0.83rem', color: 'var(--text-secondary)',
                      borderLeft: '3px solid rgba(249,115,22,0.3)', paddingLeft: '10px', fontStyle: 'italic',
                    }}>
                      {m.agenda}
                    </p>
                  )}
                </div>

                {/* Join Button */}
                {m.meeting_link && (
                  <div style={{ flexShrink: 0, alignSelf: 'center' }}>
                    <button
                      onClick={() => setActiveRoom({ roomName: m.meeting_link, meetingTitle: m.title })}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px 24px', borderRadius: '12px', border: 'none',
                        background: upcoming
                          ? 'linear-gradient(135deg, #F97316, #EA580C)'
                          : 'rgba(0,0,0,0.06)',
                        color: upcoming ? '#fff' : 'var(--text-muted)',
                        fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer',
                        boxShadow: upcoming ? '0 4px 20px rgba(249,115,22,0.35)' : 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (upcoming) e.currentTarget.style.transform = 'scale(1.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Video size={18} />
                      {upcoming ? 'Join Meeting' : 'Rejoin Room'}
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Meetings;

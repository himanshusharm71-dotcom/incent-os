import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import JitsiRoom from '../components/JitsiRoom';
import {
  Plus, Clock, Users, X, Calendar,
  Video, Mic, MonitorUp, PhoneCall, FileText, Save
} from 'lucide-react';

const TEAMS = [
  'All Hands (Full Team)', 'Core', 'Technical Support', 'Event Management',
  'Startup & Innovation', 'Corporate Relations',
  'Public Relations', 'Social Media & Branding'
];

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
  const [showNotesModal, setShowNotesModal] = useState(null); // stores the meeting object
  const [saving, setSaving]         = useState(false);
  const [activeRoom, setActiveRoom] = useState(null); 

  const [form, setForm] = useState({
    title: '', date: '', time: '',
    team: user?.team || 'Core',
    attendees_count: '',
    agenda: '',
  });

  const [notesForm, setNotesForm] = useState({
    notes: '',
    decisions: '',
    action_items: ''
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
      const roomName = makeRoomName(form.title, Date.now());

      const { error } = await supabase.from('meetings').insert([{
        ...form,
        status,
        platform: 'Built-in Video Call',
        meeting_link: roomName,
        created_by: user?.Name || user?.email,
      }]);
      if (error) throw error;

      setShowModal(false);
      setForm({ title: '', date: '', time: '', team: user?.team || 'Core', attendees_count: '', agenda: '' });
      fetchMeetings();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          notes: notesForm.notes,
          decisions: notesForm.decisions,
          action_items: notesForm.action_items
        })
        .eq('id', showNotesModal.id);

      if (error) throw error;
      setShowNotesModal(null);
      fetchMeetings();
    } catch (err) {
      alert('Error saving notes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const isUpcoming = (m) => {
    if (!m.date) return false;
    return new Date(`${m.date}T${m.time || '00:00'}`) > new Date();
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Meetings & Logs</h1>
          <p style={{ margin: 0 }}>Video meetings and historical logs in one place.</p>
        </div>
        {canCreate && (
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
            Schedule Meeting
          </Button>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>📅 Schedule Meeting</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Meeting Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
              </div>
              <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} disabled={!isAdmin}>
                {TEAMS.map(t => <option key={t}>{t}</option>)}
              </select>
              <textarea rows={3} placeholder="Agenda…" value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
              <Button type="submit" disabled={saving} variant="primary">{saving ? 'Creating…' : '🎥 Schedule Meeting'}</Button>
            </form>
          </Card>
        </div>
      )}

      {showNotesModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>📝 Meeting Logs: {showNotesModal.title}</h2>
              <button onClick={() => setShowNotesModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveNotes} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Meeting Notes / Summary</label>
                <textarea rows={5} value={notesForm.notes} onChange={e => setNotesForm({ ...notesForm, notes: e.target.value })} placeholder="What happened in the meeting?" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={labelStyle}>Key Decisions</label>
                <textarea rows={3} value={notesForm.decisions} onChange={e => setNotesForm({ ...notesForm, decisions: e.target.value })} placeholder="List major decisions made..." style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={labelStyle}>Action Items / Assigned Tasks</label>
                <textarea rows={3} value={notesForm.action_items} onChange={e => setNotesForm({ ...notesForm, action_items: e.target.value })} placeholder="What needs to be done next?" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <Button type="submit" disabled={saving} variant="primary" icon={<Save size={18} />}>
                {saving ? 'Saving...' : 'Save Meeting Logs'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Meetings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {meetings.map(m => {
          const upcoming = isUpcoming(m);
          return (
            <Card key={m.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', borderLeft: upcoming ? '4px solid var(--accent-primary)' : '4px solid #10B981' }}>
              <div style={{ textAlign: 'center', minWidth: '70px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>{m.date ? new Date(m.date + 'T00:00:00').toLocaleString('default', { month: 'short' }) : '—'}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{m.date ? new Date(m.date + 'T00:00:00').getDate() : '—'}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Badge variant={upcoming ? 'primary' : 'success'}>{upcoming ? 'Upcoming' : 'Completed'}</Badge>
                  <Badge variant="info">{m.team}</Badge>
                </div>
                <h3 style={{ margin: '0 0 8px' }}>{m.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.agenda}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  {upcoming && (
                    <Button variant="primary" size="sm" icon={<Video size={14} />} onClick={() => setActiveRoom({ roomName: m.meeting_link, meetingTitle: m.title })}>Join Call</Button>
                  )}
                  <Button variant="secondary" size="sm" icon={<FileText size={14} />} onClick={() => {
                    setNotesForm({ notes: m.notes || '', decisions: m.decisions || '', action_items: m.action_items || '' });
                    setShowNotesModal(m);
                  }}>Logs & Notes</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Meetings;

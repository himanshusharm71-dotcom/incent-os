import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../services/supabase';
import { CheckCircle, XCircle, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { sendAutomatedEmail } from '../services/emailService';

function ApprovalQueue() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'member', team: 'Technical Support' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or('status.eq.pending,status.eq.pre_approved')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  const handlePreAuthorize = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('users').insert([{
      Name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      team: newUser.team,
      status: 'pre_approved',
      points: 0
    }]);

    if (!error) {
      const inviteUrl = `${window.location.origin}/login?invite=true&email=${encodeURIComponent(newUser.email)}`;
      navigator.clipboard.writeText(inviteUrl);

      // AUTOMATED EMAIL CALL
      const sent = await sendAutomatedEmail(newUser.email, newUser.name, 'invite', inviteUrl);
      
      if (sent) {
        alert(`🚀 FULL SUCCESS! \n\n1. ${newUser.email} authorized.\n2. Automated invite email SENT.\n3. Link also copied to clipboard.`);
      } else {
        alert(`✅ Authorized! \n\nLink copied to clipboard. (Automated email failed - please send the link manually).`);
      }

      setNewUser({ name: '', email: '', role: 'member', team: 'Technical Support' });
      setShowAddForm(false);
      fetchRequests();
    } else {
      alert("Error: " + (error.message || "Failed to authorize user. Check Supabase connection."));
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const roleToAssign = selectedRoles[id] || 'member';
    const { error } = await supabase
      .from('users')
      .update({ status: 'active', role: roleToAssign })
      .eq('id', id);
      
    if (!error) {
      const user = requests.find(r => r.id === id);
      setRequests(requests.filter(req => req.id !== id));
      
      // AUTOMATED APPROVAL EMAIL
      sendAutomatedEmail(user.email, user.Name, 'approve');
      alert(`✅ User Approved! An automated confirmation has been sent to ${user.email}.`);
    } else {
      alert("Error approving user: " + error.message);
    }
  };

  const handleReject = async (id) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    // Note: We'd also need to delete from Auth, which requires a backend function or Service Key.
    // For now, removing them from the public table will deny them access.
    if (!error) {
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>User Management</h1>
          <p>Authorize members and manage access requests.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Authorize Member'}
        </Button>
      </div>

      {showAddForm && (
        <Card style={{ marginBottom: '2rem', background: 'rgba(249, 115, 22, 0.05)', border: '1px solid var(--accent-primary)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>➕ Pre-Authorize New Member</h2>
          <form onSubmit={handlePreAuthorize} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input 
              placeholder="Full Name" 
              value={newUser.name} 
              onChange={e => setNewUser({...newUser, name: e.target.value})} 
              required 
            />
            <input 
              placeholder="Email Address" 
              type="email" 
              value={newUser.email} 
              onChange={e => setNewUser({...newUser, email: e.target.value})} 
              required 
            />
            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="member">Member</option>
              <option value="leader">Team Leader</option>
              <option value="deputy_leader">Deputy Leader</option>
              <option value="admin">Admin</option>
            </select>
            <select value={newUser.team} onChange={e => setNewUser({...newUser, team: e.target.value})}>
              {['Technical Support', 'Event Management', 'Startup & Innovation', 'Corporate Relations', 'Public Relations', 'Social Media & Branding', 'Core'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Button type="submit" variant="primary" style={{ gridColumn: 'span 1' }}>Authorize & Generate Link</Button>
          </form>
          
          {/* Quick Share Options (Visible after a link is generated or if you want to share manually) */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-light)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%', marginBottom: '5px' }}>Quick Share Options:</span>
            <Button 
              variant="outline" 
              icon={<Mail size={16} />} 
              onClick={() => {
                const email = prompt("Enter user email:");
                if(email) window.location.href = `mailto:${email}?subject=Invitation&body=Join here: ${window.location.origin}/login?invite=true`;
              }}
            >
              Share via Email
            </Button>
            <Button 
              variant="outline" 
              style={{ borderColor: '#25D366', color: '#25D366' }}
              onClick={() => {
                const text = encodeURIComponent(`Join INCENT OS: ${window.location.origin}/login?invite=true`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
            >
              Share via WhatsApp
            </Button>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
            No pending requests at the moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map(req => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{req.Name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Requested Team: <Badge variant="info" style={{ marginLeft: '5px' }}>{req.team}</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select 
                    value={selectedRoles[req.id] || 'member'} 
                    onChange={(e) => setSelectedRoles({...selectedRoles, [req.id]: e.target.value})}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="member">Member</option>
                    <option value="leader">Leader</option>
                    <option value="deputy_leader">Deputy Leader</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button variant="danger" icon={<XCircle size={16} />} onClick={() => handleReject(req.id)}>Reject</Button>
                  <Button variant="success" icon={<CheckCircle size={16} />} onClick={() => handleApprove(req.id)} style={{ background: 'var(--status-success)' }}>Approve</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default ApprovalQueue;

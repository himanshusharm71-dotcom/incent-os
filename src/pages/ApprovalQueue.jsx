import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../services/supabase';
import { CheckCircle, XCircle, UserPlus, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';

function ApprovalQueue() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addedUser, setAddedUser] = useState(null); // Shows credentials after adding
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    team: 'Technical Support'
  });

  const teams = ['Core', 'Technical Support', 'Event Management', 'Startup & Innovation', 'Corporate Relations', 'Public Relations', 'Social Media & Branding'];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setMembers(data);
    setLoading(false);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    setNewUser(prev => ({ ...prev, password: pass }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all fields including password.');
      return;
    }
    setSubmitting(true);

    try {
      // Step 1: Create Supabase Auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
            team: newUser.team
          }
        }
      });

      if (authError) {
        // If user already exists in Auth, just insert/update DB record
        if (authError.message.includes('already registered')) {
          alert(`⚠️ This email is already registered in Supabase Auth.\n\nPlease check your Supabase Dashboard > Authentication > Users to see if this user exists.`);
          setSubmitting(false);
          return;
        }
        throw authError;
      }

      // Step 2: Insert user profile into users table
      const userId = authData.user?.id;
      if (!userId) {
        // Supabase may require email confirmation - insert without ID for now
        const { error: dbError } = await supabase.from('users').insert([{
          Name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          team: newUser.team,
          status: 'active', // Directly active - no waiting
          points: 0
        }]);
        if (dbError && !dbError.message.includes('duplicate')) {
          console.error('DB insert error:', dbError);
        }
      } else {
        const { error: dbError } = await supabase.from('users').insert([{
          id: userId,
          Name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          team: newUser.team,
          status: 'active',
          points: 0
        }]);
        if (dbError && !dbError.message.includes('duplicate')) {
          console.error('DB insert error:', dbError);
        }
      }

      // Step 3: Show credentials to admin
      setAddedUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        team: newUser.team
      });

      setNewUser({ name: '', email: '', password: '', role: 'member', team: 'Technical Support' });
      setShowAddForm(false);
      fetchMembers();

    } catch (err) {
      console.error('Add user error:', err);
      alert('Error adding user: ' + (err.message || 'Unknown error. Check console.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, newRole) => {
    const { error } = await supabase
      .from('users')
      .update({ status: newStatus, ...(newRole ? { role: newRole } : {}) })
      .eq('id', id);

    if (!error) {
      fetchMembers();
    } else {
      alert('Error updating user: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) fetchMembers();
    else alert('Error deleting user: ' + error.message);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {
      window.prompt('Copy this:', text);
    });
  };

  const getStatusColor = (status) => {
    if (status === 'active') return '#10B981';
    if (status === 'pending') return '#F59E0B';
    if (status === 'pre_approved') return '#6366F1';
    return '#EF4444';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Add members and manage access.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" icon={<RefreshCw size={16} />} onClick={fetchMembers}>Refresh</Button>
          <Button variant="primary" icon={<UserPlus size={16} />} onClick={() => { setShowAddForm(!showAddForm); setAddedUser(null); }}>
            {showAddForm ? 'Cancel' : 'Add Member'}
          </Button>
        </div>
      </div>

      {/* SUCCESS CARD — shown after adding user */}
      {addedUser && (
        <Card style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '2px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ color: '#065F46', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={24} color="#10B981" /> User Added Successfully!
              </h2>
              <p style={{ color: '#047857', margin: '0 0 1rem', fontSize: '0.9rem' }}>
                Share these login credentials with <strong>{addedUser.name}</strong>:
              </p>
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #A7F3D0', display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '600' }}>LOGIN URL:</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.85rem', background: '#F3F4F6', padding: '4px 8px', borderRadius: '6px' }}>{window.location.origin}/login</code>
                    <button onClick={() => copyToClipboard(`${window.location.origin}/login`)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6366F1' }}><Copy size={14} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '600' }}>EMAIL:</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.85rem', background: '#F3F4F6', padding: '4px 8px', borderRadius: '6px' }}>{addedUser.email}</code>
                    <button onClick={() => copyToClipboard(addedUser.email)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6366F1' }}><Copy size={14} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '600' }}>PASSWORD:</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.85rem', background: '#FEF3C7', padding: '4px 8px', borderRadius: '6px', color: '#92400E', fontWeight: '700' }}>{addedUser.password}</code>
                    <button onClick={() => copyToClipboard(addedUser.password)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6366F1' }}><Copy size={14} /></button>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '10px', background: '#FEF9C3', borderRadius: '8px', fontSize: '0.8rem', color: '#713F12' }}>
                  ⚠️ <strong>Important:</strong> If Supabase email confirmation is ON, the user must first click the confirmation email before logging in. To disable this, go to Supabase Dashboard → Auth → Settings → Disable "Enable email confirmations".
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => {
                    const text = `INCENT OS Login Credentials\n\nName: ${addedUser.name}\nLogin URL: ${window.location.origin}/login\nEmail: ${addedUser.email}\nPassword: ${addedUser.password}\n\nPlease change your password after first login.`;
                    copyToClipboard(text);
                    alert('Full credentials copied to clipboard!');
                  }}
                  style={{ background: '#10B981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Copy size={16} /> Copy All Credentials
                </button>
              </div>
            </div>
            <button onClick={() => setAddedUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '1.5rem' }}>×</button>
          </div>
        </Card>
      )}

      {/* ADD USER FORM */}
      {showAddForm && (
        <Card style={{ marginBottom: '2rem', border: '2px solid var(--accent-primary)' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem' }}>➕ Add New Member</h2>
          <form onSubmit={handleAddUser}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Full Name *</label>
                <input
                  placeholder="e.g. Rahul Sharma"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
                  Temporary Password * 
                  <button type="button" onClick={generatePassword} style={{ marginLeft: '8px', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                    🎲 Auto-generate
                  </button>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Set a password for this user"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    minLength={6}
                    style={{ width: '100%', boxSizing: 'border-box', paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }}>
                  <option value="member">Member</option>
                  <option value="leader">Team Leader</option>
                  <option value="deputy_leader">Deputy Leader</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Team</label>
                <select value={newUser.team} onChange={e => setNewUser({ ...newUser, team: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }}>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Adding User...' : '✅ Add Member'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* MEMBERS TABLE */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>All Members ({members.length})</h3>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading members...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No members yet. Click "Add Member" to get started.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Team</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Points</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{m.Name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={m.role}
                        onChange={e => handleUpdateStatus(m.id, m.status, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'transparent', fontSize: '0.8rem', color: 'var(--text-primary)' }}
                      >
                        <option value="member">Member</option>
                        <option value="leader">Leader</option>
                        <option value="deputy_leader">Deputy Leader</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{m.team}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: `${getStatusColor(m.status)}20`, color: getStatusColor(m.status) }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '700' }}>{m.points || 0}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {m.status !== 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'active', null)}
                            style={{ padding: '4px 10px', background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                          >
                            ✓ Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(m.id)}
                          style={{ padding: '4px 10px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* IMPORTANT NOTICE */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#FEF9C3', borderRadius: '12px', border: '1px solid #FDE68A' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#713F12' }}>
          <strong>⚠️ Important for Login to Work:</strong> Go to your <strong>Supabase Dashboard → Authentication → Settings → Disable "Enable email confirmations"</strong>. Otherwise users cannot login until they confirm their email.
        </p>
      </div>
    </div>
  );
}

export default ApprovalQueue;

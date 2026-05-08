import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ExternalLink, FileText, Folder, Link as LinkIcon, Plus, Search, Trash2, Globe, Shield, Lock } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

// ── CONFIG: Real Google Drive Links Integrated ──────────
const TEAM_DRIVE_LINKS = {
  'Core': 'https://drive.google.com/drive/folders/1pX_xS_...', // Admin Only
  'Startup & Incubation': 'https://drive.google.com/drive/folders/1yBORyZ5eLn5nfaBx7lrniCpYe4Z3cFik',
  'Tech & Development': 'https://drive.google.com/drive/folders/19awLJSNAyL6JGwCefNIKH1oTSpdFGCDM',
  'Corporate Relations & MOU': 'https://drive.google.com/drive/folders/1fGgSxBhmc3yKxeYbWC8fu1NgBIG6sN_V',
  'Events & Operations': 'https://drive.google.com/drive/folders/1MfIAXwa_33oSmTW1PtCkfl9WZ4FKcK3l',
  'Placement & Startup Hiring': 'https://drive.google.com/drive/folders/1fGgSxBhmc3yKxeYbWC8fu1NgBIG6sN_V',
  'Public Relations (PR)': 'https://drive.google.com/drive/folders/1Fm0JtQmHB_hwNFK7WCFSzFnhKxtTCLzv',
  'Marketing & Media': 'https://drive.google.com/drive/folders/1UWQjUBBnJZZ2I7X3Ta_a8ZMi3tIEIBxV',
  'Design & Creative': 'https://drive.google.com/drive/folders/1UWQjUBBnJZZ2I7X3Ta_a8ZMi3tIEIBxV',
  'Research & Strategy': 'https://drive.google.com/drive/folders/1Fm0JtQmHB_hwNFK7WCFSzFnhKxtTCLzv',
  'Data Analytics & Insights': 'https://drive.google.com/drive/folders/19awLJSNAyL6JGwCefNIKH1oTSpdFGCDM',
  'Competitions & Hackathon': 'https://drive.google.com/drive/folders/1MfIAXwa_33oSmTW1PtCkfl9WZ4FKcK3l',
  'Outreach & Expansion': 'https://drive.google.com/drive/folders/1yBORyZ5eLn5nfaBx7lrniCpYe4Z3cFik',
  'Documentation': 'https://drive.google.com/drive/folders/1Fm0JtQmHB_hwNFK7WCFSzFnhKxtTCLzv',
  'Campus Ambassadors': 'https://drive.google.com/drive/folders/1pX_xS_...'
};

function Files() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isLeader = user?.role === 'leader' || user?.role === 'deputy_leader';
  const canAccessDrive = isAdmin || isLeader;

  // Non-admins are locked to their own team folder
  const userTeam = user?.team || 'Core';
  const [selectedTeam, setSelectedTeam] = useState(isAdmin ? userTeam : userTeam);
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newFile, setNewFile] = useState({
    name: '',
    url: '',
    type: 'Document'
  });

  useEffect(() => {
    fetchFiles();
  }, [selectedTeam, userTeam]);

  const fetchFiles = async () => {
    setLoading(true);
    const targetTeam = isAdmin ? selectedTeam : userTeam;
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('team', targetTeam)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFiles(data);
    }
    setLoading(false);
  };

  const handleAddFile = async (e) => {
    e.preventDefault();
    if (!newFile.url.includes('drive.google.com')) {
      alert("Please provide a valid Google Drive link.");
      return;
    }

    try {
      const targetTeam = isAdmin ? selectedTeam : userTeam;
      const { error } = await supabase.from('files').insert([{
        name: newFile.name,
        url: newFile.url,
        type: newFile.type,
        uploader_name: user?.Name || user?.email,
        team: targetTeam,
        size: 0 
      }]);

      if (error) throw error;
      
      setShowAddModal(false);
      setNewFile({ name: '', url: '', type: 'Document' });
      fetchFiles();
    } catch (err) {
      alert("Error adding file link: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this file record from OS?")) return;
    await supabase.from('files').delete().eq('id', id);
    fetchFiles();
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeTeam = isAdmin ? selectedTeam : userTeam;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>INCENT Cloud Drive</h1>
          <p style={{ margin: 0 }}>
            {isAdmin ? `Admin Management Layer` : `Team Resource Center: ${activeTeam}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '35px', borderRadius: '10px', width: '200px' }}
            />
          </div>
          {canAccessDrive && (
            <Button 
              variant="primary" 
              icon={<Plus size={18} />} 
              onClick={() => setShowAddModal(true)}
            >
              Register Asset
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Sidebar: Admin Control Panel */}
        {isAdmin && (
          <Card style={{ width: '280px', height: 'fit-content', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} /> Master Registry
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.keys(TEAM_DRIVE_LINKS).map((team) => (
                <div 
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: selectedTeam === team ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                    color: selectedTeam === team ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedTeam === team ? '600' : '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {team === 'Core' ? <Shield size={18} color="#EF4444" /> : <Folder size={18} fill={selectedTeam === team ? "var(--accent-primary)" : "none"} />}
                  <span style={{ fontSize: '0.9rem' }}>{team}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main Drive View */}
        <div style={{ flex: 1, minWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* External Drive Access Card */}
          {canAccessDrive ? (
            <Card style={{ 
              background: activeTeam === 'Core' 
                ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' // Red for Core/Admin
                : 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 2rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.25rem' }}>
                  {activeTeam === 'Core' ? 'Private Admin Drive' : `${activeTeam} Google Drive`}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem' }}>
                  {activeTeam === 'Core' ? 'Restricted to Chair & Coordinators.' : 'Leadership Access Active.'}
                </p>
              </div>
              <a href={TEAM_DRIVE_LINKS[activeTeam]} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
                <button style={{
                  background: '#fff', color: activeTeam === 'Core' ? '#EF4444' : '#4285F4', border: 'none',
                  padding: '12px 24px', borderRadius: '12px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                  <Globe size={18} /> Open Drive
                </button>
              </a>
              {activeTeam === 'Core' ? <Shield size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: '#fff' }} /> : <Folder size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: '#fff' }} />}
            </Card>
          ) : (
            <Card style={{ 
              background: 'rgba(249, 115, 22, 0.03)', 
              border: '1px dashed rgba(249, 115, 22, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '1.5rem 2rem'
            }}>
              <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%' }}>
                <Lock size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Standard Member Access</h3>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>You can view assets below. Direct Drive access is restricted.</p>
              </div>
            </Card>
          )}

          {/* Asset Registry */}
          <Card style={{ flex: 1 }}>
            <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Registered Assets ({activeTeam})</h3>
              <Badge variant="info">Synced Registry</Badge>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching registry...</div>
            ) : filteredFiles.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <LinkIcon size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p>No links registered for {activeTeam}.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <th style={{ padding: '10px 16px' }}>Asset Name</th>
                      <th style={{ padding: '10px 16px' }}>Type</th>
                      <th style={{ padding: '10px 16px' }}>Registered By</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr key={file.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                        <td style={{ padding: '1rem 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: activeTeam === 'Core' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(66, 133, 244, 0.1)', borderRadius: '8px' }}>
                              <FileText size={18} color={activeTeam === 'Core' ? '#EF4444' : '#4285F4'} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{file.name}</p>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(file.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 16px' }}>
                          <Badge variant="default" style={{ fontSize: '0.7rem' }}>{file.type}</Badge>
                        </td>
                        <td style={{ padding: '1rem 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{file.uploader_name}</td>
                        <td style={{ padding: '1rem 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <a href={file.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                              <Button variant="ghost" style={{ padding: '8px', color: activeTeam === 'Core' ? '#EF4444' : '#4285F4' }} title="View in Drive">
                                <ExternalLink size={16} />
                              </Button>
                            </a>
                            {(isAdmin || user?.Name === file.uploader_name) && (
                              <button 
                                onClick={() => handleDelete(file.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-danger)', padding: '8px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>🔗 Register Drive Link</h2>
            <form onSubmit={handleAddFile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>File/Folder Name</label>
                <input 
                  placeholder="e.g. Budget 2026" 
                  value={newFile.name} 
                  onChange={e => setNewFile({...newFile, name: e.target.value})} 
                  required 
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>Google Drive URL</label>
                <input 
                  placeholder="https://drive.google.com/..." 
                  value={newFile.url} 
                  onChange={e => setNewFile({...newFile, url: e.target.value})} 
                  required 
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>Asset Type</label>
                <select 
                  value={newFile.type} 
                  onChange={e => setNewFile({...newFile, type: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option>Document</option>
                  <option>Spreadsheet</option>
                  <option>Presentation</option>
                  <option>Image/Asset</option>
                  <option>Folder</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>Cancel</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>Register Link</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Files;

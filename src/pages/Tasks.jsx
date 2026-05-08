import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { createTask, getTasks, updateTaskStatus } from "../services/taskService";
import { useAuth } from "../context/AuthProvider";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Plus, Clock, AlertCircle, CheckSquare, ListTodo, Calendar as CalIcon, Trash2, Search, Filter } from "lucide-react";

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState({ 
    title: '', 
    priority: 'Medium', 
    assignedTo: '', 
    team: user?.team || 'Core', 
    deadline: '',
    subtasks: '' 
  });

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  useEffect(() => {
    fetchTasks();

    // 🛰️ REALTIME SYNC
    const taskSub = supabase.channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchTasks)
      .subscribe();

    return () => supabase.removeChannel(taskSub);
  }, [user]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks(user);
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (task, status) => {
    try {
      await updateTaskStatus(task.id, status, task.assignedTo);
      // Realtime listener will trigger fetchTasks
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this task?")) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) alert("Delete failed: " + error.message);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const subtaskList = newTask.subtasks ? newTask.subtasks.split(',').map(s => s.trim()) : [];
      await createTask({ ...newTask, subtasks: subtaskList });
      setShowModal(false);
      setNewTask({ title: '', priority: 'Medium', assignedTo: '', team: user?.team || 'Core', deadline: '', subtasks: '' });
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create task.");
    }
  };

  const columns = [
    { id: 'pending', title: 'To Do', color: '#6366F1' },
    { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
    { id: 'completed', title: 'Completed', color: '#10B981' }
  ];

  const filteredTasks = tasks.filter(t => 
    (t.title || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (t.assignedTo || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px' }}>Task Matrix</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
            {isAdmin ? "Overseeing global organizational operations." : `Operational tasks for ${user?.team} wing.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '12px', width: '250px', background: '#fff' }} 
            />
          </div>
          <Button variant="primary" style={{ padding: '12px 24px', borderRadius: '14px' }} icon={<Plus size={18} />} onClick={() => setShowModal(true)}>Deploy Task</Button>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <Card style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: '900' }}>🚀 Create New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>TASK DESCRIPTION</label>
                <input placeholder="e.g. Audit Cloud Infrastructure" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                   <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>ASSIGN TO</label>
                   <input placeholder="Member Name" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} required style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                   <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>DEADLINE</label>
                   <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} required style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>SUB-TASKS (COMMA SEPARATED)</label>
                <textarea placeholder="Step 1, Step 2, Step 3..." value={newTask.subtasks} onChange={e => setNewTask({...newTask, subtasks: e.target.value})} rows={2} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '12px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <select value={newTask.team} onChange={e => setNewTask({...newTask, team: e.target.value})} disabled={!isAdmin} style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>
                  {['Core', 'Technical Support', 'Event Management', 'Startup & Innovation', 'Corporate Relations', 'Public Relations', 'Social Media & Branding'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: '#000', borderRadius: '14px' }}>Cancel</Button>
                <Button type="submit" variant="primary" style={{ flex: 1, borderRadius: '14px' }}>Confirm Deployment</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
             <div style={{ width: 40, height: 40, border: '3px solid #F97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
             <p style={{ fontWeight: '800', letterSpacing: '2px', fontSize: '0.8rem' }}>SYNCING GLOBAL MATRIX</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {columns.map(col => (
            <div key={col.id} style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderRadius: '28px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', minHeight: '600px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.01)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: '900' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: col.color, boxShadow: `0 0 10px ${col.color}80` }}></div>
                {col.title.toUpperCase()}
                <Badge style={{ marginLeft: 'auto', background: `${col.color}15`, color: col.color, border: 'none', padding: '2px 10px' }}>{filteredTasks.filter(t => t.status === col.id).length}</Badge>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredTasks.filter(t => t.status === col.id).map(t => (
                  <Card key={t.id} style={{ 
                    padding: '1.5rem', 
                    borderRadius: '24px', 
                    borderLeft: `6px solid ${t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981'}`,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                    position: 'relative',
                    transition: 'transform 0.2s'
                  }} className="card-hover">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                      <Badge variant={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'success'} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>{(t.priority || 'Medium').toUpperCase()}</Badge>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}><CalIcon size={12}/> {t.deadline}</span>
                        {isAdmin && (
                            <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.2)', padding: 0 }} onMouseOver={e => e.currentTarget.style.color = '#EF4444'} onMouseOut={e => e.currentTarget.style.color = 'rgba(0,0,0,0.2)'}>
                                <Trash2 size={14} />
                            </button>
                        )}
                      </div>
                    </div>
                    
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: '800', lineHeight: 1.3, color: 'var(--text-primary)' }}>{t.title}</h4>
                    
                    {t.subtasks && t.subtasks.length > 0 && (
                      <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ListTodo size={12} /> Execution Checklist
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {t.subtasks.map((st, si) => (
                            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.1)', borderRadius: '4px', flexShrink: 0 }}></div>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st}</span>
                            </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900', boxShadow: '0 5px 15px rgba(249,115,22,0.3)' }}>
                          {t.assignedTo?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{t.assignedTo}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t.team}</span>
                        </div>
                      </div>
                      
                      {col.id === 'pending' && <Button variant="secondary" size="sm" onClick={() => handleStatus(t, 'in-progress')} style={{ borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700' }}>START</Button>}
                      {col.id === 'in-progress' && <Button variant="success" size="sm" onClick={() => handleStatus(t, 'completed')} style={{ borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700' }}>FINALIZE</Button>}
                      {col.id === 'completed' && <div style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckSquare size={14}/> VERIFIED</div>}
                    </div>
                  </Card>
                ))}
                {filteredTasks.filter(t => t.status === col.id).length === 0 && (
                    <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '20px' }}>
                        No {col.title.toLowerCase()} tasks.
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .card-hover:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
}

export default Tasks;
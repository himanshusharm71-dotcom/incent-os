import React, { useEffect, useState } from "react";
import { createTask, getTasks, updateTaskStatus } from "../services/taskService";
import { useAuth } from "../context/AuthProvider";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Plus, Clock, AlertCircle, CheckSquare, ListTodo, Calendar as CalIcon } from "lucide-react";

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    priority: 'Medium', 
    assignedTo: '', 
    team: user?.team || 'Core', 
    deadline: '',
    subtasks: '' // Comma separated string
  });

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
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
      fetchTasks();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      // Split subtasks into array if any
      const subtaskList = newTask.subtasks ? newTask.subtasks.split(',').map(s => s.trim()) : [];
      await createTask({ ...newTask, subtasks: subtaskList });
      setShowModal(false);
      setNewTask({ title: '', priority: 'Medium', assignedTo: '', team: user?.team || 'Core', deadline: '', subtasks: '' });
      fetchTasks();
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const columns = [
    { id: 'pending', title: 'To Do', color: '#6366F1' },
    { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
    { id: 'completed', title: 'Completed', color: '#10B981' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>Task Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>{user?.role === 'admin' || user?.role === 'super_admin' ? "Managing all organization tasks." : `Team tasks for: ${user?.team}`}</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowModal(true)}>Create Task</Button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>🚀 New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input placeholder="Assigned To Name" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} required />
                <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} required />
              </div>
              <textarea placeholder="Sub-tasks (comma separated, e.g. Design UI, Fix Bugs, Deploy)" value={newTask.subtasks} onChange={e => setNewTask({...newTask, subtasks: e.target.value})} rows={2} style={{ width: '100%', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <select value={newTask.team} onChange={e => setNewTask({...newTask, team: e.target.value})} disabled={user?.role !== 'super_admin' && user?.role !== 'admin'}>
                  <option value="Core">Core Team</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Startup & Innovation">Startup & Innovation</option>
                  <option value="Corporate Relations">Corporate Relations</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Social Media & Branding">Social Media & Branding</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: '#000' }}>Cancel</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>Create Task</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Syncing with INCENT database...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {columns.map(col => (
            <div key={col.id} style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '20px', padding: '1.25rem', border: '1px solid var(--border-light)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: col.color }}></div>
                {col.title}
                <Badge variant="default" style={{ marginLeft: 'auto' }}>{tasks.filter(t => t.status === col.id).length}</Badge>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.filter(t => t.status === col.id).map(t => (
                  <Card key={t.id} style={{ padding: '1.25rem', borderLeft: `4px solid ${t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <Badge variant={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'success'}>{t.priority}</Badge>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><CalIcon size={12}/> {t.deadline}</span>
                    </div>
                    
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', lineHeight: 1.4 }}>{t.title}</h4>
                    
                    {t.subtasks && t.subtasks.length > 0 && (
                      <div style={{ marginBottom: '15px', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '10px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <ListTodo size={12} /> Checklist
                        </p>
                        {t.subtasks.map((st, si) => (
                          <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <div style={{ width: 12, height: 12, border: '1.5px solid var(--border-light)', borderRadius: '3px' }}></div>
                            {st}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>
                          {t.assignedTo?.charAt(0) || '?'}
                        </div>
                        <span style={{ fontSize: '0.85rem' }}>{t.assignedTo}</span>
                      </div>
                      
                      {col.id === 'pending' && <Button variant="secondary" size="sm" onClick={() => handleStatus(t, 'in-progress')}>Start</Button>}
                      {col.id === 'in-progress' && <Button variant="success" size="sm" onClick={() => handleStatus(t, 'completed')}>Complete</Button>}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
import React, { useEffect, useState } from "react";
import { createTask, getTasks, updateTaskStatus } from "../services/taskService";
import { useAuth } from "../context/AuthProvider";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Plus, Clock, AlertCircle } from "lucide-react";

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', assignedTo: '', team: user?.team || 'Core', deadline: '' });

  // MOCK FETCH
  useEffect(() => {
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

    fetchTasks();
  }, [user]);

  const handleStatus = async (task, status) => {
    try {
      await updateTaskStatus(task.id, status, task.assignedTo);
      const data = await getTasks(user);
      setTasks(data || []);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setShowModal(false);
      setNewTask({ title: '', priority: 'Medium', assignedTo: '', team: user?.team || 'Core', deadline: '' });
      const data = await getTasks(user);
      setTasks(data || []);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const columns = [
    { id: 'pending', title: 'To Do', color: 'var(--status-info)' },
    { id: 'in-progress', title: 'In Progress', color: 'var(--status-warning)' },
    { id: 'completed', title: 'Completed', color: 'var(--status-success)' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Task Management</h1>
          <p>Assign, track, and complete team tasks.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowModal(true)}>Create Task</Button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              <input placeholder="Assigned To (Name)" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} required />
              <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} required />
              <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <select 
                value={newTask.team} 
                onChange={e => setNewTask({...newTask, team: e.target.value})}
                disabled={user?.role !== 'super_admin' && user?.role !== 'admin'}
              >
                <option value="Core">Core Team</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Event Management">Event Management</option>
                <option value="Startup & Innovation">Startup & Innovation</option>
                <option value="Corporate Relations">Corporate Relations</option>
                <option value="Public Relations">Public Relations</option>
                <option value="Social Media & Branding">Social Media & Branding</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'var(--border-light)', color: 'var(--text-primary)' }}>Cancel</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>Create</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading tasks...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {columns.map(col => (
            <div key={col.id} style={{ 
              background: 'rgba(0,0,0,0.02)', 
              borderRadius: '16px', 
              padding: '1rem',
              border: '1px solid var(--border-light)'
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontSize: '1rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }}></span>
                {col.title}
                <span style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.08)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.filter(t => t.status === col.id).map(t => (
                  <Card key={t.id} style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <Badge variant={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'success'}>
                        {t.priority}
                      </Badge>
                      <Badge variant="default">{t.team}</Badge>
                    </div>
                    
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{t.title}</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '15px' }}>
                      <Clock size={14} /> Due: {t.deadline}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff' }}>
                          {t.assignedTo ? t.assignedTo.charAt(0) : '?'}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t.assignedTo}</span>
                      </div>
                      
                      {col.id === 'pending' && (
                        <Button variant="secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleStatus(t, 'in-progress')}>Start</Button>
                      )}
                      {col.id === 'in-progress' && (
                        <Button variant="success" style={{ background: 'var(--status-success)', padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleStatus(t, 'completed')}>Done</Button>
                      )}
                    </div>
                  </Card>
                ))}
                
                {tasks.filter(t => t.status === col.id).length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
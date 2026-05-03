import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthProvider';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

function Calendar() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*');
    if (user?.role !== 'super_admin' && user?.role !== 'admin') {
      query = query.eq('team', user.team);
    }
    const { data } = await query;
    setTasks(data || []);
    setLoading(false);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  // Padding for first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.deadline === dateStr);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Calendar View</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track all task deadlines and milestones.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}><ChevronLeft size={20} /></button>
          <h3 style={{ margin: 0, minWidth: '150px', textAlign: 'center' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}><ChevronRight size={20} /></button>
        </div>
      </div>

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-light)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '600px' }}>
          {days.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            
            return (
              <div 
                key={i} 
                style={{ 
                  borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border-light)', 
                  borderBottom: '1px solid var(--border-light)',
                  padding: '10px',
                  background: isToday ? 'rgba(249, 115, 22, 0.03)' : 'transparent',
                  minHeight: '120px'
                }}
              >
                {day && (
                  <>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      fontSize: '0.9rem', 
                      fontWeight: isToday ? '700' : '500',
                      background: isToday ? 'var(--accent-primary)' : 'transparent',
                      color: isToday ? '#fff' : 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {dayTasks.map(t => (
                        <div 
                          key={t.id} 
                          title={t.title}
                          style={{ 
                            fontSize: '0.7rem', 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            background: t.priority === 'High' ? '#FEE2E2' : t.priority === 'Medium' ? '#FEF3C7' : '#D1FAE5',
                            color: t.priority === 'High' ? '#991B1B' : t.priority === 'Medium' ? '#92400E' : '#065F46',
                            borderLeft: `3px solid ${t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981'}`,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#EF4444' }}></div> High Priority
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#F59E0B' }}></div> Medium Priority
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#10B981' }}></div> Low Priority
        </div>
      </div>
    </div>
  );
}

export default Calendar;

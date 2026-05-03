import { supabase } from './supabase';

export const createTask = async (data) => {
  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert([{ ...data, status: 'pending' }])
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }
  return newTask;
};

export const getTasks = async (user) => {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  // Role-based filtering: Super Admin & Admin see all, others see only their team's tasks
  if (user && user.role !== 'super_admin' && user.role !== 'admin') {
    query = query.eq('team', user.team);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
  return data;
};

export const updateTaskStatus = async (id, status, assignedToName) => {
  // 1. Fetch the task to check deadline
  const { data: task, error: fetchErr } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr) throw fetchErr;

  // 2. Update the task status
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating task status:", error);
    throw error;
  }

  // 3. AUTOMATED POINTS SYSTEM (Only when status moves to 'completed')
  if (status === 'completed' && assignedToName) {
    try {
      // Find the user by Name
      const { data: userData } = await supabase
        .from('users')
        .select('id, points')
        .eq('Name', assignedToName)
        .single();
        
      if (userData) {
        const now = new Date();
        const deadline = new Date(task.deadline);
        let pointChange = 10; // Default: On-time

        // Check if Late
        if (now > deadline) {
          pointChange = -5; // Late completion penalty
        }

        // Apply points
        await supabase
          .from('users')
          .update({ points: (userData.points || 0) + pointChange })
          .eq('id', userData.id);
      }
    } catch (err) {
      console.error("Error updating points:", err);
    }
  }
};
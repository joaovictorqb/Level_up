import { supabase } from '@/lib/supabase';
import { Habit, Task, Goal, Profile } from '@/types';
import { IHabitRepository, ITaskRepository, IGoalRepository, IProfileRepository } from './types';

export class SupabaseHabitRepository implements IHabitRepository {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Habit[];
  }

  async create(habit: Omit<Habit, 'id' | 'created_at' | 'streak'>) {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habit, streak: 0 }])
      .select()
      .single();
    if (error) throw error;
    return data as Habit;
  }

  async update(id: string, updates: Partial<Habit>) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Habit;
  }

  async delete(id: string) {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) throw error;
  }

  async complete(id: string) {
    const { data: habit, error: fetchError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    const now = new Date().toISOString();
    const newStreak = (habit.streak || 0) + 1;

    const { data, error } = await supabase
      .from('habits')
      .update({ 
        last_completed_at: now,
        streak: newStreak
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    // Log activity
    await supabase.from('activity_logs').insert([{
      user_id: habit.user_id,
      type: 'habit',
      action: `Hábito "${habit.title}" concluído`,
      xp_gained: 10
    }]);

    // Update profile XP
    const { data: profile } = await supabase.from('profiles').select('xp').eq('id', habit.user_id).single();
    if (profile) {
      const newXP = (profile.xp || 0) + 10;
      const newLevel = Math.floor(newXP / 1000) + 1;
      await supabase.from('profiles').update({ xp: newXP, level: newLevel }).eq('id', habit.user_id);
    }

    return data as Habit;
  }
}

export class SupabaseTaskRepository implements ITaskRepository {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Task[];
  }

  async create(task: Omit<Task, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    if (error) throw error;
    return data as Task;
  }

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Task;
  }

  async delete(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  }

  async toggle(id: string, currentStatus: 'todo' | 'done') {
    const newStatus = currentStatus === 'todo' ? 'done' : 'todo';
    const completedAt = newStatus === 'done' ? new Date().toISOString() : null;
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus, completed_at: completedAt })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    const task = data as Task;
    if (newStatus === 'done') {
      // Log activity
      await supabase.from('activity_logs').insert([{
        user_id: task.user_id,
        type: 'task',
        action: `Tarefa "${task.title}" concluída`,
        xp_gained: 20
      }]);

      // Update profile XP
      const { data: profile } = await supabase.from('profiles').select('xp').eq('id', task.user_id).single();
      if (profile) {
        const newXP = (profile.xp || 0) + 20;
        const newLevel = Math.floor(newXP / 1000) + 1;
        await supabase.from('profiles').update({ xp: newXP, level: newLevel }).eq('id', task.user_id);
      }
    }

    return task;
  }
}

export class SupabaseGoalRepository implements IGoalRepository {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Goal[];
  }

  async create(goal: Omit<Goal, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goal])
      .select()
      .single();
    if (error) throw error;
    return data as Goal;
  }

  async update(id: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Goal;
  }

  async delete(id: string) {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
  }
}

export class SupabaseProfileRepository implements IProfileRepository {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data as Profile;
  }

  async update(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  }

  async addXP(userId: string, amount: number) {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', userId)
      .single();
    if (fetchError) throw fetchError;

    const newXP = (profile.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;

    const { data, error } = await supabase
      .from('profiles')
      .update({ xp: newXP, level: newLevel })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  }
}

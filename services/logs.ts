import { supabase } from '@/lib/supabase';

export interface ActivityLog {
  id: string;
  user_id: string;
  type: 'habit' | 'task' | 'goal' | 'focus';
  action: string;
  xp_gained: number;
  created_at: string;
}

export const logService = {
  async getRecentActivity(userId: string, limit = 5) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) return [];
    return data as ActivityLog[];
  },

  async addLog(log: Omit<ActivityLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data as ActivityLog;
  },

  async getTodayXP(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('activity_logs')
      .select('xp_gained')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());
    
    if (error) return 0;
    return data.reduce((acc, curr) => acc + (curr.xp_gained || 0), 0);
  }
};

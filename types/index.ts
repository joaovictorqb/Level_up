export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  xp: number;
  level: number;
  streak: number;
  last_activity_at?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  last_completed_at?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed_at?: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  created_at: string;
}

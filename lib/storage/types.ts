import { Habit, Task, Goal, Profile } from '@/types';

export interface IHabitRepository {
  getAll(userId: string): Promise<Habit[]>;
  create(habit: Omit<Habit, 'id' | 'created_at' | 'streak'>): Promise<Habit>;
  update(id: string, updates: Partial<Habit>): Promise<Habit>;
  delete(id: string): Promise<void>;
  complete(id: string): Promise<Habit>;
}

export interface ITaskRepository {
  getAll(userId: string): Promise<Task[]>;
  create(task: Omit<Task, 'id' | 'created_at'>): Promise<Task>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  toggle(id: string, currentStatus: 'todo' | 'done'): Promise<Task>;
}

export interface IGoalRepository {
  getAll(userId: string): Promise<Goal[]>;
  create(goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal>;
  update(id: string, updates: Partial<Goal>): Promise<Goal>;
  delete(id: string): Promise<void>;
}

export interface IProfileRepository {
  get(userId: string): Promise<Profile>;
  update(userId: string, updates: Partial<Profile>): Promise<Profile>;
  addXP(userId: string, amount: number): Promise<Profile>;
}

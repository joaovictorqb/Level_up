import { 
  SupabaseHabitRepository, 
  SupabaseTaskRepository, 
  SupabaseGoalRepository, 
  SupabaseProfileRepository 
} from './supabase-adapter';
import { 
  IHabitRepository, 
  ITaskRepository, 
  IGoalRepository, 
  IProfileRepository 
} from './types';

// This factory can be easily extended to return a SQLite/Local adapter in the future
export const RepositoryFactory = {
  getHabitRepository(): IHabitRepository {
    return new SupabaseHabitRepository();
  },
  getTaskRepository(): ITaskRepository {
    return new SupabaseTaskRepository();
  },
  getGoalRepository(): IGoalRepository {
    return new SupabaseGoalRepository();
  },
  getProfileRepository(): IProfileRepository {
    return new SupabaseProfileRepository();
  }
};

export const habitRepository = RepositoryFactory.getHabitRepository();
export const taskRepository = RepositoryFactory.getTaskRepository();
export const goalRepository = RepositoryFactory.getGoalRepository();
export const profileRepository = RepositoryFactory.getProfileRepository();

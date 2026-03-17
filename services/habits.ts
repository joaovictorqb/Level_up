import { habitRepository } from '@/lib/storage';
import { Habit } from '@/types';

export const habitService = {
  async getHabits(userId: string) {
    return habitRepository.getAll(userId);
  },

  async createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'streak'>) {
    return habitRepository.create(habit);
  },

  async completeHabit(habitId: string) {
    return habitRepository.complete(habitId);
  },

  async deleteHabit(habitId: string) {
    return habitRepository.delete(habitId);
  }
};

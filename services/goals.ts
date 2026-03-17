import { goalRepository } from '@/lib/storage';
import { Goal } from '@/types';

export const goalService = {
  async getGoals(userId: string) {
    return goalRepository.getAll(userId);
  },

  async createGoal(goal: Omit<Goal, 'id' | 'created_at'>) {
    return goalRepository.create(goal);
  },

  async updateGoal(goalId: string, updates: Partial<Goal>) {
    return goalRepository.update(goalId, updates);
  },

  async deleteGoal(goalId: string) {
    return goalRepository.delete(goalId);
  }
};

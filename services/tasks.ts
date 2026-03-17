import { taskRepository } from '@/lib/storage';
import { Task } from '@/types';

export const taskService = {
  async getTasks(userId: string) {
    return taskRepository.getAll(userId);
  },

  async createTask(task: Omit<Task, 'id' | 'created_at'>) {
    return taskRepository.create(task);
  },

  async toggleTask(taskId: string, currentStatus: 'todo' | 'done') {
    return taskRepository.toggle(taskId, currentStatus);
  },

  async deleteTask(taskId: string) {
    return taskRepository.delete(taskId);
  }
};

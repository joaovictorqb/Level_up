'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { taskService } from '@/services/tasks';
import { useAuth } from './use-auth';
import toast from 'react-hot-toast';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await taskService.getTasks(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const createTask = async (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!user) return;
    try {
      setActionLoading(true);
      const newTask = await taskService.createTask({
        user_id: user.id,
        title,
        priority,
        status: 'todo'
      });
      setTasks(prev => [newTask, ...prev]);
      toast.success('Tarefa criada!');
    } catch (error) {
      toast.error('Erro ao criar tarefa');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: 'todo' | 'done') => {
    try {
      setActionLoading(true);
      const updatedTask = await taskService.toggleTask(taskId, currentStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.status === 'done' ? 'Tarefa concluída! +5 XP' : 'Tarefa reaberta');
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setActionLoading(true);
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Tarefa removida');
    } catch (error) {
      toast.error('Erro ao remover tarefa');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    tasks,
    loading,
    actionLoading,
    createTask,
    toggleTask,
    deleteTask,
    refresh: fetchTasks
  };
}

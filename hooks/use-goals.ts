'use client';

import { useState, useEffect } from 'react';
import { Goal } from '@/types';
import { goalService } from '@/services/goals';
import { useAuth } from './use-auth';
import toast from 'react-hot-toast';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await goalService.getGoals(user.id);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Erro ao carregar objetivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const createGoal = async (title: string, target_value: number, unit: string) => {
    if (!user) return;
    try {
      setActionLoading(true);
      const newGoal = await goalService.createGoal({
        user_id: user.id,
        title,
        target_value,
        current_value: 0,
        unit
      });
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Objetivo criado!');
    } catch (error) {
      toast.error('Erro ao criar objetivo');
    } finally {
      setActionLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, current_value: number) => {
    try {
      setActionLoading(true);
      const updatedGoal = await goalService.updateGoal(goalId, { current_value });
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      toast.success('Progresso atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar progresso');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      setActionLoading(true);
      await goalService.deleteGoal(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      toast.success('Objetivo removido');
    } catch (error) {
      toast.error('Erro ao remover objetivo');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    goals,
    loading,
    actionLoading,
    createGoal,
    updateGoalProgress,
    deleteGoal,
    refresh: fetchGoals
  };
}

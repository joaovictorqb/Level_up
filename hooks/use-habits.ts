'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types';
import { habitService } from '@/services/habits';
import { useAuth } from './use-auth';
import toast from 'react-hot-toast';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchHabits = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await habitService.getHabits(user.id);
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Erro ao carregar hábitos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const createHabit = async (title: string, frequency: 'daily' | 'weekly') => {
    if (!user) return;
    try {
      setActionLoading(true);
      const newHabit = await habitService.createHabit({
        user_id: user.id,
        title,
        frequency
      });
      setHabits(prev => [newHabit, ...prev]);
      toast.success('Hábito criado!');
    } catch (error) {
      toast.error('Erro ao criar hábito');
    } finally {
      setActionLoading(false);
    }
  };

  const completeHabit = async (habitId: string) => {
    try {
      setActionLoading(true);
      const updatedHabit = await habitService.completeHabit(habitId);
      setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
      toast.success('Hábito concluído! +10 XP');
    } catch (error) {
      toast.error('Erro ao concluir hábito');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      setActionLoading(true);
      await habitService.deleteHabit(habitId);
      setHabits(prev => prev.filter(h => h.id !== habitId));
      toast.success('Hábito removido');
    } catch (error) {
      toast.error('Erro ao remover hábito');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    habits,
    loading,
    actionLoading,
    createHabit,
    completeHabit,
    deleteHabit,
    refresh: fetchHabits
  };
}

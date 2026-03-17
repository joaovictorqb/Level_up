'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, Habit } from '@/types';
import toast from 'react-hot-toast';

export function useNotifications() {
  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for pending tasks every 5 minutes
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch pending tasks
      const { data: tasks } = await supabase.from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'todo');

      if (tasks && tasks.length > 0) {
        const pendingCount = tasks.length;
        if (Notification.permission === 'granted') {
          new Notification('Tarefas Pendentes', {
            body: `Você tem ${pendingCount} tarefas esperando por você!`,
            icon: '/favicon.ico'
          });
        } else {
          toast(`Você tem ${pendingCount} tarefas pendentes!`, {
            icon: '📝',
            style: {
              borderRadius: '12px',
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b'
            },
          });
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}

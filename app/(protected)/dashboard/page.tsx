'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/app-layout';
import { Flame, Trophy, Zap, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { XpChart } from '@/components/xp-chart';
import { supabase } from '@/lib/supabase';
import { logService, ActivityLog } from '@/services/logs';
import { goalService } from '@/services/goals';
import { Goal } from '@/types';

export default function DashboardPage() {
  const { profile, loading, user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState(0);
  const [todayXP, setTodayXP] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      const [tasksCount, xpToday, activity, goals] = await Promise.all([
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'done'),
        logService.getTodayXP(user.id),
        logService.getRecentActivity(user.id),
        goalService.getGoals(user.id)
      ]);
      
      setCompletedTasks(tasksCount.count || 0);
      setTodayXP(xpToday);
      setRecentActivity(activity);
      setActiveGoals(goals.slice(0, 1)); // Show only one for now
    }
    
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-slate-200 rounded-3xl" />
            <div className="h-40 bg-slate-200 rounded-3xl" />
            <div className="h-40 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  const xpProgress = (profile?.xp || 0) % 1000;
  const xpPercentage = (xpProgress / 1000) * 100;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <header>
          <h1 className="text-3xl font-bold text-white">
            Olá, {profile?.display_name || 'Guerreiro'}! 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Pronto para subir de nível hoje?
          </p>
        </header>

        {/* Level Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-900/20">
                  <Trophy size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Nível {profile?.level || 1}</p>
                  <h2 className="text-2xl font-black text-white">{profile?.xp || 0} XP Total</h2>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-400">Próximo Nível</p>
                <p className="text-lg font-bold text-white">{1000 - xpProgress} XP restante</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-500 uppercase tracking-tighter">
                <span>Progresso do Nível</span>
                <span>{Math.round(xpPercentage)}%</span>
              </div>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute -right-8 -top-8 text-slate-800 opacity-20 pointer-events-none">
            <Trophy size={200} />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            href="/habits"
            icon={<Flame className="text-orange-500" />}
            label="Streak Atual"
            value={`${profile?.streak || 0} Dias`}
            color="orange"
          />
          <StatCard 
            href="/profile"
            icon={<Zap className="text-yellow-500" />}
            label="XP Hoje"
            value={`+${todayXP}`}
            color="yellow"
          />
          <StatCard 
            href="/tasks"
            icon={<CheckCircle2 className="text-emerald-500" />}
            label="Tarefas Concluídas"
            value={completedTasks.toString()}
            color="emerald"
          />
        </div>

        {/* XP Chart */}
        <XpChart />

        {/* Quick Actions / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link href="/goals" className="block group">
            <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl group-hover:border-red-500/30 transition-all h-full">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target size={20} className="text-red-500" />
                Objetivos Ativos
              </h3>
              <div className="space-y-4">
                {activeGoals.length > 0 ? (
                  activeGoals.map(goal => {
                    const progress = (goal.current_value / goal.target_value) * 100;
                    return (
                      <div key={goal.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <p className="font-semibold text-white">{goal.title}</p>
                        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                        <p className="text-xs text-emerald-500 mt-2 font-bold">
                          {goal.current_value} de {goal.target_value} {goal.unit} ({Math.round(progress)}%)
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                    <p className="text-slate-500 text-sm">Nenhum objetivo ativo</p>
                  </div>
                )}
              </div>
            </section>
          </Link>

          <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={20} className="text-red-500" />
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{log.action}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="ml-auto text-xs font-bold text-emerald-500">+{log.xp_gained} XP</span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-500 text-sm">
                  Nenhuma atividade recente
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon, label, value, color, href }: { icon: React.ReactNode, label: string, value: string, color: string, href: string }) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -4, borderColor: 'rgba(239, 68, 68, 0.5)' }}
        className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4 h-full transition-all"
      >
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          color === 'orange' && "bg-orange-900/30",
          color === 'yellow' && "bg-yellow-900/30",
          color === 'emerald' && "bg-emerald-900/30",
        )}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-black text-white">{value}</p>
        </div>
      </motion.div>
    </Link>
  );
}

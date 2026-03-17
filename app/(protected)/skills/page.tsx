'use client';

import { motion } from 'motion/react';
import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { profileService } from '@/services/profile';
import { Zap, Lock, Unlock, Star, Shield, ZapIcon, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const skills = [
  {
    id: 'morning-warrior',
    title: 'Guerreiro da Manhã',
    description: '+10% XP para hábitos concluídos antes das 9h.',
    cost: 500,
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    id: 'deep-focus',
    title: 'Foco Profundo',
    description: 'Modo Foco dura 20% a mais e concede XP dobrado.',
    cost: 1000,
    icon: ZapIcon,
    color: 'text-yellow-500',
    bg: 'bg-yellow-900/20',
  },
  {
    id: 'resilience',
    title: 'Resiliência',
    description: 'Não perde streak se falhar um dia (1x por semana).',
    cost: 1500,
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'master-planner',
    title: 'Mestre do Planejamento',
    description: 'Visualiza tarefas da próxima semana com bônus de XP.',
    cost: 2000,
    icon: Star,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export default function SkillTreePage() {
  const { profile, user, refreshProfile } = useAuth();

  const handleUnlock = async (skillTitle: string, cost: number) => {
    if (!profile || !user) return;
    
    if ((profile.xp || 0) < cost) {
      toast.error('XP insuficiente para desbloquear esta habilidade!');
      return;
    }

    try {
      await profileService.addXP(user.id, -cost);
      await refreshProfile();
      toast.success(`Habilidade "${skillTitle}" desbloqueada!`);
    } catch (error) {
      toast.error('Erro ao desbloquear habilidade');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Star className="text-yellow-500 fill-current" />
            Árvore de Habilidades
          </h1>
          <p className="text-slate-400 mt-1">
            Gaste seu XP para desbloquear poderes passivos.
          </p>
        </header>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Seu XP Disponível</p>
            <p className="text-3xl font-black text-white">{profile?.xp || 0} XP</p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
            <Zap size={24} className="fill-current" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            const isLocked = true; // Mocked for now

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group relative overflow-hidden",
                  !isLocked && "border-emerald-500/50"
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", skill.bg)}>
                      <Icon size={28} className={skill.color} />
                    </div>
                    {isLocked ? (
                      <div className="flex items-center gap-1 text-slate-500 font-bold text-sm uppercase">
                        <Lock size={14} />
                        <span>Bloqueado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm uppercase">
                        <Unlock size={14} />
                        <span>Ativo</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{skill.title}</h3>
                  <p className="text-slate-400 text-sm mb-6">{skill.description}</p>
                </div>

                <button
                  onClick={() => handleUnlock(skill.title, skill.cost)}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold transition-all relative z-10",
                    isLocked 
                      ? "bg-slate-800 text-white hover:bg-red-600 shadow-lg shadow-red-900/20" 
                      : "bg-emerald-500/10 text-emerald-500 cursor-default"
                  )}
                >
                  {isLocked ? `Desbloquear (${skill.cost} XP)` : 'Habilidade Adquirida'}
                </button>

                {/* Decorative background */}
                <div className="absolute -right-4 -bottom-4 text-slate-800/20 group-hover:text-red-500/5 transition-colors">
                  <Icon size={120} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

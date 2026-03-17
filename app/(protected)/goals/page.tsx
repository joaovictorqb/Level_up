'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Target, Plus, Trash2, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGoals } from '@/hooks/use-goals';
import { cn } from '@/lib/utils';

export default function GoalsPage() {
  const { goals, loading, actionLoading, createGoal, updateGoalProgress, deleteGoal } = useGoals();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(10);
  const [newUnit, setNewUnit] = useState('livros');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createGoal(newTitle, newTarget, newUnit);
    setNewTitle('');
    setNewTarget(10);
    setNewUnit('livros');
    setIsAdding(false);
  };

  const handleProgress = async (goalId: string, current: number, target: number) => {
    if (current >= target) return;
    await updateGoalProgress(goalId, current + 1);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Meus Objetivos</h1>
            <p className="text-slate-400 mt-1">Defina metas de longo prazo e acompanhe sua jornada.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </header>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 p-6 rounded-3xl border-2 border-red-900/30 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Novo Objetivo</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-400 mb-2">Título</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Ler 10 livros"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Meta (Valor)</label>
                    <input 
                      type="number" 
                      value={newTarget}
                      onChange={(e) => setNewTarget(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Unidade</label>
                  <input 
                    type="text" 
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="Ex: livros, km, horas"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={actionLoading || !newTitle.trim()}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-700 disabled:opacity-50 transition-all"
                  >
                    {actionLoading ? 'Criando...' : 'Criar Objetivo'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [1, 2].map(i => (
              <div key={i} className="h-48 bg-slate-900 rounded-[2.5rem] animate-pulse border border-slate-800" />
            ))
          ) : goals.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700 border border-slate-800">
                <Target size={40} />
              </div>
              <h3 className="text-xl font-bold text-white">Nenhum objetivo ainda</h3>
              <p className="text-slate-400">Defina sua primeira meta!</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="mt-4 text-red-500 font-bold hover:underline"
              >
                Começar agora
              </button>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
              return (
                <motion.div 
                  layout
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-900/30 rounded-2xl flex items-center justify-center text-red-500">
                        <Target size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                        <p className="text-sm text-slate-500">Meta: {goal.target_value} {goal.unit}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-400 uppercase tracking-wider">Progresso</span>
                      <span className={cn(progress === 100 ? "text-emerald-500" : "text-red-500")}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full transition-all", progress === 100 ? "bg-emerald-500" : "bg-red-600")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">{goal.current_value} de {goal.target_value} {goal.unit}</p>
                      <button 
                        onClick={() => handleProgress(goal.id, goal.current_value, goal.target_value)}
                        disabled={actionLoading || progress === 100}
                        className="text-xs font-bold text-red-500 hover:text-red-400 disabled:opacity-50 disabled:text-slate-600"
                      >
                        {progress === 100 ? 'Concluído!' : '+ Adicionar Progresso'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}

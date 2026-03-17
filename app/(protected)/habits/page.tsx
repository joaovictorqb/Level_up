'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '@/components/app-layout';
import { useHabits } from '@/hooks/use-habits';
import { Flame, Plus, Trash2, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HabitsPage() {
  const { habits, loading, actionLoading, createHabit, completeHabit, deleteHabit } = useHabits();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createHabit(newTitle, newFrequency);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Meus Hábitos</h1>
            <p className="text-slate-400 mt-1">Construa consistência, suba de nível.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </header>

        {/* Add Habit Modal/Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 p-6 rounded-3xl border-2 border-red-900/30 shadow-2xl"
            >
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Nome do Hábito</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Beber 2L de água"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Frequência</label>
                  <div className="flex gap-2">
                    {(['daily', 'weekly'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setNewFrequency(f)}
                        className={cn(
                          "flex-1 py-2 rounded-xl border font-semibold transition-all",
                          newFrequency === f 
                            ? "bg-red-600 text-white border-red-600" 
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:border-red-900/50"
                        )}
                      >
                        {f === 'daily' ? 'Diário' : 'Semanal'}
                      </button>
                    ))}
                  </div>
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
                    {actionLoading ? 'Criando...' : 'Criar Hábito'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-900 rounded-3xl animate-pulse border border-slate-800" />
            ))
          ) : habits.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700 border border-slate-800">
                <Flame size={40} />
              </div>
              <h3 className="text-xl font-bold text-white">Nenhum hábito ainda</h3>
              <p className="text-slate-400">Comece criando seu primeiro hábito!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <motion.div 
                layout
                key={habit.id}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl hover:border-red-900/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500">
                      <Flame size={24} className={habit.streak > 0 ? "fill-current" : ""} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{habit.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {habit.frequency === 'daily' ? <Clock size={12} /> : <Calendar size={12} />}
                        {habit.frequency === 'daily' ? 'Diário' : 'Semanal'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">{habit.streak}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dias</span>
                  </div>
                  <button 
                    onClick={() => completeHabit(habit.id)}
                    disabled={actionLoading}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all",
                      habit.last_completed_at && new Date(habit.last_completed_at).toDateString() === new Date().toDateString()
                        ? "bg-emerald-900/30 text-emerald-500 cursor-default"
                        : "bg-red-600 text-white shadow-lg shadow-red-900/20 hover:bg-red-700 active:scale-95 disabled:opacity-50"
                    )}
                  >
                    <CheckCircle2 size={20} />
                    {habit.last_completed_at && new Date(habit.last_completed_at).toDateString() === new Date().toDateString()
                      ? 'Concluído'
                      : 'Concluir'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

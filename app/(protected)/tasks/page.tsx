'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '@/components/app-layout';
import { useTasks } from '@/hooks/use-tasks';
import { Task } from '@/types';
import { Plus, Trash2, CheckCircle2, Circle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const { tasks, loading, actionLoading, createTask, toggleTask, deleteTask } = useTasks();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createTask(newTitle, newPriority);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleToggle = async (task: Task) => {
    await toggleTask(task.id, task.status);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Tarefas</h1>
            <p className="text-slate-400 mt-1">Organize seu dia e ganhe recompensas.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </header>

        {/* Add Task Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900 p-6 rounded-3xl border-2 border-red-900/30 shadow-2xl"
            >
              <form onSubmit={handleAdd} className="space-y-4">
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="O que precisa ser feito?"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  autoFocus
                />
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={cn(
                          "flex-1 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all",
                          newPriority === p 
                            ? "bg-red-600 text-white border-red-600" 
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:border-red-900/50"
                        )}
                      >
                        {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={actionLoading || !newTitle.trim()}
                      className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : 'Adicionar'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-900 rounded-2xl animate-pulse border border-slate-800" />
            ))
          ) : tasks.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700 border border-slate-800">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-bold text-white">Tudo limpo por aqui!</h3>
              <p className="text-slate-400">Crie uma tarefa para começar a ganhar XP.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div 
                layout
                key={task.id}
                className={cn(
                  "bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-4 group transition-all",
                  task.status === 'done' && "opacity-40"
                )}
              >
                <button 
                  onClick={() => handleToggle(task)}
                  className={cn(
                    "transition-colors",
                    task.status === 'done' ? "text-emerald-500" : "text-slate-700 hover:text-red-500"
                  )}
                >
                  {task.status === 'done' ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-bold text-white truncate",
                    task.status === 'done' && "line-through text-slate-600"
                  )}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                      task.priority === 'high' ? "bg-red-900/30 text-red-500" :
                      task.priority === 'medium' ? "bg-amber-900/30 text-amber-500" :
                      "bg-blue-900/30 text-blue-500"
                    )}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 uppercase tracking-wider">
                      <Clock size={10} />
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

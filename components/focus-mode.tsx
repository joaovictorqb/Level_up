'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, X, Zap, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function FocusMode() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    toast.success('Modo Foco Ativado! Notificações silenciadas.');
    
    // Request notification permission for when it ends
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    toast.success('Sessão de Foco concluída! +50 XP');
    
    if (Notification.permission === 'granted') {
      new Notification('Foco Concluído!', {
        body: 'Sua sessão de foco terminou. Bom trabalho!',
        icon: '/favicon.ico'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <button
        onClick={() => setIsActive(true)}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-600/10 hover:text-red-500 rounded-xl transition-all w-full text-left"
      >
        <Timer size={20} />
        <span>Modo Foco</span>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-6"
          >
            <div className="absolute top-8 right-8">
              <button 
                onClick={() => setIsActive(false)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-red-900/40 animate-pulse">
                  <Zap size={48} className="fill-current" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Foco Profundo</h2>
                <div className="flex items-center justify-center gap-2 text-red-500 font-bold uppercase tracking-widest text-sm">
                  <BellOff size={16} />
                  <span>Notificações Silenciadas</span>
                </div>
              </div>

              <div className="text-8xl font-black text-white font-mono tabular-nums">
                {formatTime(timeLeft)}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl border border-slate-800 hover:border-red-500 transition-all"
                >
                  {isPaused ? 'Retomar' : 'Pausar'}
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setTimeLeft(25 * 60);
                  }}
                  className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all"
                >
                  Desistir
                </button>
              </div>

              <p className="text-slate-500 max-w-xs mx-auto text-sm">
                "O foco é a chave para o sucesso. Mantenha-se disciplinado."
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

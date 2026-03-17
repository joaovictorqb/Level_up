'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Bem-vindo de volta!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-red-600 font-black text-3xl tracking-tighter mb-6">
            <Zap className="fill-current" />
            <span>LEVEL UP</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta!</h1>
          <p className="text-slate-500 mt-2">Entre para continuar sua evolução.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">Senha</label>
              <Link href="/forgot-password" title="Esqueceu a senha?" className="text-xs font-bold text-red-600 hover:underline">Esqueceu?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Não tem uma conta? <Link href="/register" className="text-red-600 font-bold hover:underline">Criar conta</Link>
        </p>
      </motion.div>
    </div>
  );
}

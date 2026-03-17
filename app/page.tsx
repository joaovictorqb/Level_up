'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { Zap, ArrowRight, CheckCircle2, Flame, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 size={48} className="text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-900/30">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-500 font-black text-2xl tracking-tighter">
          <Zap className="fill-current" />
          <span>LEVEL UP</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-bold text-slate-400 hover:text-red-500 transition-colors">Entrar</Link>
          <Link href="/register" className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all">Começar Grátis</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-8">
              SUBA DE NÍVEL NA <span className="text-red-500">VIDA REAL.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
              Transforme seus hábitos e tarefas em uma jornada épica. Ganhe XP, suba de nível e conquiste seus objetivos com Level Up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 group">
                Começar Jornada
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-400 hover:bg-slate-900 transition-all border border-slate-800">
                Ver Como Funciona
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-red-600/10 rounded-[3rem] p-8 lg:p-12 relative z-10 border border-red-600/20">
              <div className="bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-6 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-500 uppercase">Nível 12</p>
                      <p className="font-black text-xl text-white">12.450 XP</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-orange-950 rounded-full flex items-center justify-center text-orange-500">
                    <Flame size={20} className="fill-current" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <CheckCircle2 className="text-emerald-500" />
                    <span className="font-bold text-white">Beber 2L de água</span>
                    <span className="ml-auto text-xs font-bold text-emerald-500">+10 XP</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl opacity-50 border border-slate-800">
                    <CheckCircle2 className="text-slate-600" />
                    <span className="font-bold text-white">Treino de perna</span>
                    <span className="ml-auto text-xs font-bold text-slate-600">+50 XP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-600/20 rounded-full blur-3xl opacity-30 -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl opacity-30 -z-10" />
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-slate-900 py-32 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 text-white">Tudo o que você precisa para evoluir.</h2>
            <p className="text-slate-400 text-lg">Simples, rápido e focado no que importa: sua evolução.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              href="/register"
              icon={<Flame className="text-orange-500" />}
              title="Hábitos"
              description="Crie rotinas consistentes e acompanhe seu streak diário."
            />
            <FeatureCard 
              href="/register"
              icon={<CheckCircle2 className="text-emerald-500" />}
              title="Tarefas"
              description="Gerencie seus afazeres e ganhe recompensas ao concluir."
            />
            <FeatureCard 
              href="/register"
              icon={<Trophy className="text-red-500" />}
              title="Gamificação"
              description="Suba de nível, ganhe medalhas e veja seu progresso real."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-sm group-hover:border-red-600/50 transition-all h-full">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { profileService } from '@/services/profile';
import { User, Mail, Shield, Calendar, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await profileService.updateProfile(user.id, {
        display_name: displayName,
        username: username
      });
      await refreshProfile();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
          <p className="text-slate-400 mt-1">Gerencie suas informações e conquistas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl text-center">
              <div className="w-24 h-24 bg-red-900/30 rounded-3xl flex items-center justify-center text-red-500 font-black text-3xl mx-auto mb-4 border border-red-900/50">
                {profile?.display_name?.[0] || 'U'}
              </div>
              <h2 className="text-xl font-bold text-white">{profile?.display_name || 'Usuário'}</h2>
              <p className="text-slate-500 text-sm">@{profile?.username || 'usuario'}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-600 uppercase">Nível</p>
                  <p className="text-xl font-black text-red-500">{profile?.level || 1}</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-600 uppercase">Streak</p>
                  <p className="text-xl font-black text-orange-500">{profile?.streak || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={18} className="text-slate-600" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Shield size={18} className="text-slate-600" />
                <span className="text-sm">Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '...'}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Editar Informações</h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Nome de Exibição</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Username</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

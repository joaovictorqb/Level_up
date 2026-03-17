'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Flame, 
  Target, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap,
  Star,
  Timer
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { FocusMode } from './focus-mode';
import { useNotifications } from '@/hooks/use-notifications';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/habits', label: 'Hábitos', icon: Flame },
  { href: '/tasks', label: 'Tarefas', icon: CheckSquare },
  { href: '/goals', label: 'Objetivos', icon: Target },
  { href: '/skills', label: 'Habilidades', icon: Star },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-red-500 font-bold text-xl">
              <Zap className="fill-current" />
              <span>LEVEL UP</span>
            </Link>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-red-600/10 text-red-500 font-semibold" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-red-500"
                  )}
                >
                  <Icon size={20} className={cn(
                    "transition-colors",
                    isActive ? "text-red-500" : "text-slate-500 group-hover:text-red-500"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <FocusMode />
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 font-bold">
                {profile?.display_name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {profile?.display_name || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Nível {profile?.level || 1}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-600/10 hover:text-red-500 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Mobile Header */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center px-4 lg:hidden">
          <button onClick={toggleSidebar} className="p-2 text-slate-400">
            <Menu size={24} />
          </button>
          <div className="flex-1 text-center font-bold text-red-500">
            LEVEL UP
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

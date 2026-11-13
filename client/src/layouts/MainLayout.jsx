import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Projects', path: '/projects', icon: FolderKanban },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      <div className="mesh-bg" />
      
      <Toaster position="bottom-right" toastOptions={{ 
        className: 'dark:bg-slate-800 dark:text-slate-100 bg-white text-slate-900 shadow-xl'
      }} />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-black/20 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">
            <FolderKanban size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">Sprintify</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-violet-500/10 dark:bg-violet-500/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} className={`relative z-10 ${isActive ? 'text-violet-600 dark:text-violet-300' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className={`relative z-10 ${isActive ? 'text-violet-700 dark:text-violet-200 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-100/50 dark:bg-white/[0.02] rounded-xl border border-slate-200/50 dark:border-white/[0.04]">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff&rounded=true`} 
              alt="avatar" 
              className="w-9 h-9 rounded-full ring-2 ring-white/50 dark:ring-white/10 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

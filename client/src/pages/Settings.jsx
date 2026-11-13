import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Palette, Loader2, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', { name, email });
      updateUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    
    setPasswordLoading(true);
    try {
      await axios.put('http://localhost:5000/api/auth/password', { currentPassword, newPassword });
      toast.success("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-violet-500/10 text-violet-600 dark:text-violet-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-xl p-8"
        >
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-white/[0.08]">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff&rounded=true&size=80`} 
                  alt="avatar" 
                  className="w-20 h-20 rounded-full shadow-lg"
                />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{user?.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={profileLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors shadow-lg shadow-violet-900/20 disabled:opacity-50">
                    {profileLoading && <Loader2 size={16} className="animate-spin" />} Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-2">Change Password</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Ensure your account is using a long, random password to stay secure.</p>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={passwordLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors shadow-lg shadow-violet-900/20 disabled:opacity-50">
                    {passwordLoading && <Loader2 size={16} className="animate-spin" />} Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-2">Appearance</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Customize how Sprintify looks on your device.</p>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-black/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300">
                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Theme Preference</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Currently using {theme} mode</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

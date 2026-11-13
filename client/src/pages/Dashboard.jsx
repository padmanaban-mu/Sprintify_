import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, FolderKanban, ListChecks, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isToday } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [projRes, upcomingRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects'),
          axios.get('http://localhost:5000/api/tasks/upcoming')
        ]);
        setProjects(projRes.data);
        setUpcomingTasks(upcomingRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-violet-500" size={32} /></div>;

  const data = projects.map(p => ({
    name: p.name,
    tasks: Math.floor(Math.random() * 20) + 1,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Here's what's happening across your projects today.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-xl flex items-center gap-4 hover:border-violet-500/30 transition-colors">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/10 shadow-inner">
            <FolderKanban size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">{projects.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-xl flex items-center gap-4 hover:border-sky-500/30 transition-colors">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-500/10 shadow-inner">
            <ListChecks size={28} className="text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">{upcomingTasks.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming Deadlines</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-xl flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 shadow-inner">
            <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">---</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tasks Completed</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-xl"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 font-display">Tasks Overview</h2>
          <div className="h-72">
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(100,116,139,0.1)'}} contentStyle={{backgroundColor: 'var(--tw-colors-slate-800)', border: 'none', borderRadius: '12px', color: '#f8fafc'}} />
                  <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p>No projects yet.</p>
                <Link to="/projects" className="text-violet-500 dark:text-violet-400 hover:underline mt-2">Create your first project</Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-xl flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-display text-xl font-semibold">
            <Clock size={20} className="text-amber-500 dark:text-amber-400" />
            Upcoming Deadlines
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {upcomingTasks.length > 0 ? upcomingTasks.map(task => {
              const isDueToday = isToday(new Date(task.dueDate));
              return (
                <Link to={`/projects/${task.project._id}`} key={task._id} className="block group">
                  <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-violet-500/30 transition-all shadow-sm">
                    <h3 className="font-medium text-slate-900 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">{task.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-500 truncate max-w-[120px]">{task.project.name}</p>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-medium flex items-center gap-1 ${isDueToday ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-slate-100 text-slate-600 dark:bg-white/[0.05] dark:text-slate-400 border border-slate-200 dark:border-white/[0.05]'}`}>
                        <Calendar size={10} />
                        {isDueToday ? 'Today' : format(new Date(task.dueDate), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            }) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 pb-10">
                <CheckCircle2 size={32} className="text-emerald-500/30 mb-3" />
                <p>No upcoming deadlines!</p>
                <p className="text-xs mt-1">You're all caught up.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

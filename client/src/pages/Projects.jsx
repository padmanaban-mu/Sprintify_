import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Project name required");
    
    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/projects', { name, description });
      setProjects([res.data, ...projects]);
      setIsModalOpen(false);
      setName('');
      setDescription('');
      toast.success("Project created!");
    } catch (err) {
      toast.error('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-violet-500" size={32} /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">My Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your workspaces and boards.</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 transition-all hover:brightness-110"
        >
          <Plus size={18} strokeWidth={2.5} />
          New Project
        </motion.button>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <AnimatePresence>
          {projects.map(project => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Link 
                to={`/projects/${project._id}`}
                className="group bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] hover:border-violet-500/50 hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-300 block relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.05] group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 group-hover:text-violet-600 dark:group-hover:text-violet-300 text-slate-500 dark:text-slate-400 transition-colors shadow-inner">
                    <FolderKanban size={26} />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, project._id)}
                    className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 truncate font-display">{project.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.description || 'No description provided.'}</p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {projects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 border border-slate-200 dark:border-white/[0.08] rounded-3xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border-dashed shadow-2xl"
        >
          <FolderKanban size={56} className="mx-auto text-slate-400 dark:text-slate-600 mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">No projects yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create your first project to get started.</p>
        </motion.div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm" 
              onClick={submitting ? undefined : () => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#12151f]/90 backdrop-blur-2xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">Create new project</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Project Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none h-28"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-br from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/30">
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

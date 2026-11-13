import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-2xl p-12 max-w-lg w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white font-display mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Page not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

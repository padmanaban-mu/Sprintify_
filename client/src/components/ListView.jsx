import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Calendar, User } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const PRIORITY_STYLES = { 
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/30", 
  Medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/30", 
  High: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/30" 
};
const TAG_STYLES = { 
  Frontend: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:border-sky-400/30", 
  Backend: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/30", 
  Bug: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/30", 
  "UI/UX": "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-400/10 dark:text-pink-300 dark:border-pink-400/30", 
  General: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/30" 
};
const STATUS_LABELS = { Backlog: "Backlog", Todo: "To Do", Inprogress: "In Progress", Review: "Review", Done: "Done" };

function getAvatarUrl(name) {
  if (!name) return null;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&rounded=true&size=32`;
}

export default function ListView({ tasks, openEditModal, handleDelete, confirmDeleteId, setConfirmDeleteId, deletingId }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.05]">
        <p>No tasks match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-white/[0.02] text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08]">
            <tr>
              <th className="px-6 py-4 font-medium">Task</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Tag</th>
              <th className="px-6 py-4 font-medium">Assignee</th>
              <th className="px-6 py-4 font-medium">Due Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {tasks.map((task, index) => {
              const isConfirming = confirmDeleteId === task._id;
              let isOverdue = false;
              if (task.dueDate) {
                const dateObj = new Date(task.dueDate);
                isOverdue = isPast(dateObj) && !isToday(dateObj) && task.status !== "Done";
              }

              return (
                <motion.tr 
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{task.title}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.05] px-2.5 py-1 rounded-md text-xs border border-slate-200 dark:border-white/[0.05]">
                      {STATUS_LABELS[task.status] || task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${TAG_STYLES[task.tag] || TAG_STYLES.General}`}>
                      {task.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center gap-2" title={task.assignee.name}>
                        <img src={getAvatarUrl(task.assignee.name)} alt="assignee" className="h-6 w-6 rounded-full" />
                        <span>{task.assignee.name.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 dark:text-slate-500 flex items-center gap-2"><User size={14}/> Unassigned</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {task.dueDate ? (
                      <span className={`inline-flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        <Calendar size={14} />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    ) : <span className="text-slate-300 dark:text-slate-600">-</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isConfirming ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(task._id)} disabled={deletingId === task._id} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-semibold">Confirm</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEditModal(task)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition"><Pencil size={16} /></button>
                        <button onClick={() => setConfirmDeleteId(task._id)} className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

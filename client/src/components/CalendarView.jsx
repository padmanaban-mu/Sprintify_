import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PRIORITY_DOT = { Low: "bg-emerald-500", Medium: "bg-amber-500", High: "bg-rose-500" };

export default function CalendarView({ tasks, openEditModal }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Find tasks for this day
      const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), cloneDay));

      days.push(
        <div
          key={day}
          className={`min-h-[120px] p-2 border-r border-b border-slate-200 dark:border-white/[0.05] transition-colors ${
            !isSameMonth(day, monthStart)
              ? "bg-slate-50/50 dark:bg-white/[0.01] text-slate-400 dark:text-slate-600"
              : isSameDay(day, new Date())
              ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
              : "bg-white/50 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
          }`}
        >
          <span className={`block text-right text-xs font-medium mb-1 ${isSameDay(day, new Date()) ? 'bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center ml-auto' : ''}`}>
            {formattedDate}
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[85px] custom-scrollbar">
            {dayTasks.map((t, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={t._id}
                onClick={() => openEditModal(t)}
                className={`text-[10px] p-1.5 rounded bg-white dark:bg-[#12151f] border border-slate-200 dark:border-white/[0.08] truncate cursor-pointer hover:border-violet-500 dark:hover:border-violet-500/50 transition-colors flex items-center gap-1.5 shadow-sm`}
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[t.priority] || PRIORITY_DOT.Medium}`} />
                <span className={t.status === 'Done' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}>{t.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
        <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-300 transition shadow-sm"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-300 transition shadow-sm"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-white/[0.05] last:border-0">
            {d}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {rows}
      </div>
    </div>
  );
}

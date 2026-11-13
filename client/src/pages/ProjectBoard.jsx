import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Plus, X, Trash2, Pencil, Search, Loader2, Inbox, Calendar, User, GripVertical, ArrowLeft, LayoutGrid, List as ListIcon, CalendarDays
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format, isPast, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import ListView from "../components/ListView";
import CalendarView from "../components/CalendarView";

const API_URL = "http://localhost:5000/api/tasks";

const STATUSES = ["Backlog", "Todo", "Inprogress", "Review", "Done"];
const STATUS_LABELS = { Backlog: "Backlog", Todo: "To Do", Inprogress: "In Progress", Review: "Review", Done: "Done" };
const PRIORITIES = ["Low", "Medium", "High"];
const TAGS = ["Frontend", "Backend", "Bug", "UI/UX", "General"];

const PRIORITY_STYLES = { 
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/30", 
  Medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/30", 
  High: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/30" 
};
const PRIORITY_DOT = { Low: "bg-emerald-500", Medium: "bg-amber-500", High: "bg-rose-500" };
const TAG_STYLES = { 
  Frontend: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:border-sky-400/30", 
  Backend: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/30", 
  Bug: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/30", 
  "UI/UX": "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-400/10 dark:text-pink-300 dark:border-pink-400/30", 
  General: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/30" 
};
const COLUMN_ACCENT = { Backlog: "before:bg-slate-500", Todo: "before:bg-sky-500", Inprogress: "before:bg-amber-500", Review: "before:bg-violet-500", Done: "before:bg-emerald-500" };

const EMPTY_FORM = { title: "", description: "", status: "Backlog", priority: "Medium", tag: "General", dueDate: "", assignee: "" };

function getAvatarUrl(name) {
  if (!name) return null;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&rounded=true&size=32`;
}

export default function ProjectBoard() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewType, setViewType] = useState('board');
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/${projectId}`),
        axios.get(`${API_URL}?projectId=${projectId}`),
        axios.get(`http://localhost:5000/api/auth/search?search=`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error("Couldn't load project data.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => { setEditingTask(null); setFormData(EMPTY_FORM); setIsModalOpen(true); };
  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || "", description: task.description || "", status: task.status || "Backlog", priority: task.priority || "Medium", tag: task.tag || "General",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      assignee: task.assignee?._id || "",
    });
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingTask(null); setFormData(EMPTY_FORM); };
  const handleFormChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Give the task a title.");
    setSubmitting(true);
    
    const payload = { ...formData, projectId };
    if (!payload.dueDate) payload.dueDate = null;
    if (!payload.assignee) delete payload.assignee;

    const loadingToast = toast.loading(editingTask ? "Saving..." : "Creating...");
    try {
      if (editingTask) {
        const res = await axios.put(`${API_URL}/${editingTask._id}`, payload);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.data : t)));
        toast.success("Task updated!", { id: loadingToast });
      } else {
        const res = await axios.post(API_URL, payload);
        setTasks((prev) => [...prev, res.data]);
        toast.success("Task created!", { id: loadingToast });
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save the task.", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    setDeletingId(taskId);
    const loadingToast = toast.loading("Deleting task...");
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted", { id: loadingToast });
    } catch (err) {
      toast.error("Couldn't delete that task.", { id: loadingToast });
    } finally {
      setDeletingId(null); setConfirmDeleteId(null);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startStatus = source.droppableId;
    const finishStatus = destination.droppableId;
    const startTasks = tasksByStatus[startStatus] || [];
    const finishTasks = tasksByStatus[finishStatus] || [];
    
    const newTasks = Array.from(tasks);
    
    if (startStatus === finishStatus) {
      const reorderedColumnTasks = Array.from(startTasks);
      const [movedTask] = reorderedColumnTasks.splice(source.index, 1);
      reorderedColumnTasks.splice(destination.index, 0, movedTask);
      reorderedColumnTasks.forEach((t, i) => { t.order = i; });
      const globalUpdatedTasks = newTasks.map(t => {
        const updatedInCol = reorderedColumnTasks.find(ct => ct._id === t._id);
        return updatedInCol ? updatedInCol : t;
      });
      setTasks(globalUpdatedTasks);
      try {
        await axios.put(`${API_URL}/reorder`, { tasks: reorderedColumnTasks.map(t => ({ _id: t._id, status: t.status, order: t.order })) });
      } catch (err) { toast.error("Failed to save new order."); }
    } else {
      const startColumnTasks = Array.from(startTasks);
      const [movedTask] = startColumnTasks.splice(source.index, 1);
      movedTask.status = finishStatus;
      const finishColumnTasks = Array.from(finishTasks);
      finishColumnTasks.splice(destination.index, 0, movedTask);
      startColumnTasks.forEach((t, i) => { t.order = i; });
      finishColumnTasks.forEach((t, i) => { t.order = i; });
      const globalUpdatedTasks = newTasks.map(t => {
        const updatedInStart = startColumnTasks.find(ct => ct._id === t._id);
        const updatedInFinish = finishColumnTasks.find(ct => ct._id === t._id);
        if (updatedInStart) return updatedInStart;
        if (updatedInFinish) return updatedInFinish;
        return t;
      });
      setTasks(globalUpdatedTasks);
      try {
        await axios.put(`${API_URL}/reorder`, { tasks: [...startColumnTasks, ...finishColumnTasks].map(t => ({ _id: t._id, status: t.status, order: t.order })) });
      } catch (err) { toast.error("Failed to save new order."); }
    }
  };

  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sorted = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sorted.filter((task) => {
      const matchesSearch = term ? (task.title || "").toLowerCase().includes(term) : true;
      const matchesPriority = priorityFilter === "All" ? true : task.priority === priorityFilter;
      const matchesTag = tagFilter === "All" ? true : task.tag === tagFilter;
      return matchesSearch && matchesPriority && matchesTag;
    });
  }, [tasks, searchTerm, priorityFilter, tagFilter]);

  const tasksByStatus = useMemo(() => {
    const grouped = {};
    STATUSES.forEach((status) => { grouped[status] = filteredTasks.filter((t) => t.status === status); });
    return grouped;
  }, [filteredTasks]);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-violet-500" size={32} /></div>;

  return (
    <div className="flex flex-col h-full font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-white/[0.08] bg-white/70 dark:bg-black/40 backdrop-blur-xl shrink-0">
        <div className="px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link to="/projects" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition bg-slate-100 dark:bg-white/[0.05] p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.1]"><ArrowLeft size={18} /></Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{project?.name}</h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 ml-[3.25rem]">{project?.description}</p>
            </div>
            
            <div className="flex items-center bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
              <button onClick={() => setViewType('board')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewType === 'board' ? 'bg-white text-slate-900 dark:bg-white/10 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><LayoutGrid size={16} /> Board</button>
              <button onClick={() => setViewType('list')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewType === 'list' ? 'bg-white text-slate-900 dark:bg-white/10 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><ListIcon size={16} /> List</button>
              <button onClick={() => setViewType('calendar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewType === 'calendar' ? 'bg-white text-slate-900 dark:bg-white/10 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><CalendarDays size={16} /> Calendar</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-8 pt-6 custom-scrollbar">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tasks..." className="w-full rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white/50 dark:bg-black/20 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-white/[0.04]" />
          </div>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500">
            <option value="All" className="dark:bg-[#12151f]">All priorities</option>
            {PRIORITIES.map((p) => (<option key={p} value={p} className="dark:bg-[#12151f]">{p}</option>))}
          </select>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500">
            <option value="All" className="dark:bg-[#12151f]">All tags</option>
            {TAGS.map((t) => (<option key={t} value={t} className="dark:bg-[#12151f]">{t}</option>))}
          </select>
          <button onClick={openCreateModal} className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110">
            <Plus size={16} strokeWidth={2.5} /> Add task
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {viewType === 'list' && (
              <ListView 
                tasks={filteredTasks} 
                openEditModal={openEditModal} 
                handleDelete={handleDelete} 
                confirmDeleteId={confirmDeleteId} 
                setConfirmDeleteId={setConfirmDeleteId} 
                deletingId={deletingId} 
              />
            )}
            
            {viewType === 'calendar' && (
              <CalendarView 
                tasks={filteredTasks} 
                openEditModal={openEditModal} 
              />
            )}

            {viewType === 'board' && (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full items-start min-w-max pb-8">
                  {STATUSES.map((status) => {
                    const columnTasks = tasksByStatus[status] || [];
                    return (
                      <div key={status} className="flex min-w-[320px] w-[320px] flex-col max-h-full">
                        <div className={`relative mb-3 flex items-center justify-between rounded-lg pl-3 before:absolute before:left-0 before:top-1 before:h-4 before:w-[3px] before:rounded-full ${COLUMN_ACCENT[status]}`}>
                          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{STATUS_LABELS[status]}</h2>
                          <span className="rounded-full bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 backdrop-blur-sm">{columnTasks.length}</span>
                        </div>

                        <Droppable droppableId={status}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] p-3 min-h-[150px] transition-all backdrop-blur-xl ${snapshot.isDraggingOver ? "bg-slate-50 dark:bg-white/[0.04] shadow-inner border-violet-500/30" : "bg-white/50 dark:bg-black/20"}`}>
                              {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center"><Inbox size={20} className="text-slate-400 dark:text-slate-600" /><p className="text-xs text-slate-400 dark:text-slate-600">Drop tasks here</p></div>
                              )}
                              {columnTasks.map((task, index) => {
                                const isConfirming = confirmDeleteId === task._id;
                                let isOverdue = false;
                                if (task.dueDate) {
                                  const dateObj = new Date(task.dueDate);
                                  isOverdue = isPast(dateObj) && !isToday(dateObj) && task.status !== "Done";
                                }

                                return (
                                  <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} className={`group rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-transparent p-4 transition ${snapshot.isDragging ? "ring-2 ring-violet-500/50 shadow-2xl opacity-90 backdrop-blur-xl" : "hover:border-slate-300 dark:hover:border-white/[0.15] shadow-sm hover:shadow-lg dark:bg-[#12151f]/80 backdrop-blur-md"}`}>
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                          <div className="flex items-start gap-2">
                                            <div {...provided.dragHandleProps} className="mt-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-grab active:cursor-grabbing"><GripVertical size={14} /></div>
                                            <h3 className="text-[15px] font-medium leading-snug text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-100 transition-colors">{task.title}</h3>
                                          </div>
                                          <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                            <button onClick={() => openEditModal(task)} className="rounded-md p-1.5 bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:text-slate-700 dark:hover:text-white transition"><Pencil size={13} /></button>
                                            <button onClick={() => setConfirmDeleteId(task._id)} className="rounded-md p-1.5 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-300 transition"><Trash2 size={13} /></button>
                                          </div>
                                        </div>

                                        {task.description && (
                                          <div className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 prose dark:prose-invert prose-p:my-1 prose-h1:text-sm max-w-none line-clamp-3">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.description}</ReactMarkdown>
                                          </div>
                                        )}

                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                          <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[task.priority]}`}><span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />{task.priority}</span>
                                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${TAG_STYLES[task.tag]}`}>{task.tag}</span>
                                          {task.dueDate && (
                                            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${isOverdue ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/[0.03] dark:text-slate-400 dark:border-white/[0.08]'}`}>
                                              <Calendar size={10} />{format(new Date(task.dueDate), 'MMM d')}
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/[0.06] pt-3">
                                          <div className="flex items-center gap-2">
                                            {task.assignee ? (
                                              <div className="flex items-center gap-2" title={`Assigned to ${task.assignee.name}`}>
                                                <img src={getAvatarUrl(task.assignee.name)} alt="assignee" className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-black/40 shadow-sm" />
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{task.assignee.name.split(' ')[0]}</span>
                                              </div>
                                            ) : (
                                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-white/[0.05] ring-2 ring-white dark:ring-black/40 text-slate-400 dark:text-slate-500 shadow-sm" title="Unassigned"><User size={12} /></div>
                                            )}
                                          </div>
                                          {isConfirming && (
                                            <div className="flex items-center gap-1.5">
                                              <button onClick={() => handleDelete(task._id)} disabled={deletingId === task._id} className="rounded-md bg-rose-100 dark:bg-rose-500/15 px-2 py-1 text-[10px] font-semibold text-rose-700 dark:text-rose-400 transition hover:bg-rose-200 dark:hover:bg-rose-500/25 border border-rose-200 dark:border-rose-500/20">Confirm</button>
                                              <button onClick={() => setConfirmDeleteId(null)} className="rounded-md px-2 py-1 text-[10px] text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]">Cancel</button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>
              </DragDropContext>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Add / Edit Modal - Animated */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-md" 
              onClick={submitting ? undefined : closeModal} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#12151f]/95 backdrop-blur-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">{editingTask ? "Edit task" : "Add a new task"}</h2>
                <button onClick={closeModal} className="rounded-xl p-2 bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:text-slate-700 dark:hover:text-white transition"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g. Fix login redirect bug" autoFocus className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Description (Markdown)</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Add more detail..." rows={4} className="w-full resize-y rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Assignee</label>
                    <select name="assignee" value={formData.assignee} onChange={handleFormChange} className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all">
                      <option value="" className="dark:bg-[#12151f]">Unassigned</option>
                      {users.map(u => <option key={u._id} value={u._id} className="dark:bg-[#12151f]">{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Due Date</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleFormChange} className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Status</label>
                    <select name="status" value={formData.status} onChange={handleFormChange} className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all">
                      {STATUSES.map((s) => (<option key={s} value={s} className="dark:bg-[#12151f]">{STATUS_LABELS[s]}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleFormChange} className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all">
                      {PRIORITIES.map((p) => (<option key={p} value={p} className="dark:bg-[#12151f]">{p}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-400">Tag</label>
                    <select name="tag" value={formData.tag} onChange={handleFormChange} className="w-full rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all">
                      {TAGS.map((t) => (<option key={t} value={t} className="dark:bg-[#12151f]">{t}</option>))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 shadow-lg shadow-violet-900/30">
                    {submitting && <Loader2 size={16} className="animate-spin" />} {editingTask ? "Save changes" : "Create task"}
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

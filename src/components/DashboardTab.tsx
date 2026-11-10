import React, { useState, useEffect } from 'react';
import {
  Plus,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  Circle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Briefcase,
  Heart,
  Calendar,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { sortTasks, generateMicroSteps } from '../bloomEngine.js';

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  category: 'school' | 'work' | 'life' | 'health';
  estimatedTime?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: number;
  microSteps?: string[];
  isAiGenerated?: boolean;
}

interface DashboardTabProps {
  onOpenDestress: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onOpenDestress }) => {
  // Start with blank priorities so new users don't see someone else's business
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy demo tasks ('t1', 't2', 't3', 't4') so priority board is clean
        const userOnly = parsed.filter((t: any) => !['t1', 't2', 't3', 't4'].includes(t.id));
        return userOnly;
      }
    } catch (e) {}
    return [];
  });

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newCategory, setNewCategory] = useState<'school' | 'work' | 'life' | 'health'>('school');
  const [newEstTime, setNewEstTime] = useState('15 min');
  const [newDueDate, setNewDueDate] = useState('');

  // Filter state
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'school' | 'work' | 'life'>('all');

  // Expanded micro-steps accordion
  const [expandedMicroStepId, setExpandedMicroStepId] = useState<string | null>(null);

  // Micro-step AI loading state
  const [loadingAiTaskId, setLoadingAiTaskId] = useState<string | null>(null);

  // 5-Minute Procrastination Buster Sprint Timer
  const [sprintSeconds, setSprintSeconds] = useState(300); // 5 minutes
  const [isSprintRunning, setIsSprintRunning] = useState(false);
  const [sprintTaskTitle, setSprintTaskTitle] = useState<string>('Your current task');

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bloom_tasks', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  // Sprint timer loop
  useEffect(() => {
    let interval: any = null;
    if (isSprintRunning && sprintSeconds > 0) {
      interval = setInterval(() => {
        setSprintSeconds((sec) => sec - 1);
      }, 1000);
    } else if (sprintSeconds === 0) {
      setIsSprintRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSprintRunning, sprintSeconds]);

  // Request Gemini AI to break down a task into 3 tailored micro-steps
  const generateAiMicroSteps = async (taskId: string, title: string, category: string, priority: string) => {
    setLoadingAiTaskId(taskId);
    setExpandedMicroStepId(taskId);

    try {
      const res = await fetch('/api/micro-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: title, category, priority }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.steps) && data.steps.length >= 3) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? { ...t, microSteps: data.steps, isAiGenerated: true }
                : t
            )
          );
          return;
        }
      }
    } catch (err) {
      console.warn('AI micro-steps fetch fallback:', err);
    } finally {
      setLoadingAiTaskId(null);
    }

    // Local fallback if network issue
    const localFallback = generateMicroSteps(title, category);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, microSteps: localFallback, isAiGenerated: false } : t
      )
    );
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const initialTitle = newTitle.trim();
    const taskId = 't_' + Date.now();
    const immediateFallbackSteps = generateMicroSteps(initialTitle, newCategory);

    const newTask: Task = {
      id: taskId,
      title: initialTitle,
      priority: newPriority,
      category: newCategory,
      estimatedTime: newEstTime,
      dueDate: newDueDate || 'Today',
      completed: false,
      createdAt: Date.now(),
      microSteps: immediateFallbackSteps,
      isAiGenerated: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setExpandedMicroStepId(taskId);

    // Call Gemini AI asynchronously to enhance with custom micro-steps
    generateAiMicroSteps(taskId, initialTitle, newCategory, newPriority);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const start5MinSprint = (taskTitle: string) => {
    setSprintTaskTitle(taskTitle);
    setSprintSeconds(300);
    setIsSprintRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sorted tasks
  const sortedTasks = sortTasks(tasks);

  // Filtered tasks
  const filteredTasks = sortedTasks.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const highPriorityIncompleteCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const completedTodayCount = tasks.filter((t) => t.completed).length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      
      {/* 5-Minute Procrastination Buster Sprint Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/75 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-heading">
                5-Minute Procrastination Buster
              </h3>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Just start, don't finish</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-md">
              Focusing on: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{sprintTaskTitle}</span>
            </p>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="font-mono text-2xl font-bold text-neutral-900 dark:text-white tabular-nums px-3 py-1 bg-white/80 dark:bg-neutral-800/80 rounded-lg border border-white/40 dark:border-white/10 shadow-xs backdrop-blur-md">
            {formatTimer(sprintSeconds)}
          </div>

          <button
            onClick={() => setIsSprintRunning(!isSprintRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isSprintRunning
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
            }`}
          >
            {isSprintRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start 5 Min</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsSprintRunning(false);
              setSprintSeconds(300);
            }}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Reset timer to 5 minutes"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Input Section */}
      <div className="bg-white/75 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/40 dark:border-white/10 shadow-lg">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What do you need to get done? (e.g. Finish Math homework, text manager)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Quick Options Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Priority Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-medium">Priority:</span>
                <select
                  value={newPriority}
                  onChange={(e: any) => setNewPriority(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="high">High Priority (Urgent)</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority (Later)</option>
                </select>
              </div>

              {/* Category Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-medium">Category:</span>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="school">School</option>
                  <option value="work">Job / Shift</option>
                  <option value="life">Personal / Life</option>
                  <option value="health">Rest / Health</option>
                </select>
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-medium">Estimated:</span>
                <select
                  value={newEstTime}
                  onChange={(e) => setNewEstTime(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="5 min">5 min (Quick)</option>
                  <option value="15 min">15 min</option>
                  <option value="30 min">30 min</option>
                  <option value="1 hour">1 hour</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>BloomAI will automatically generate 3 actionable micro-steps.</span>
            </span>
          </div>
        </form>
      </div>

      {/* Task Filters & Counts */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Priority Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterPriority === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Priorities
          </button>
          <button
            onClick={() => setFilterPriority('high')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterPriority === 'high'
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            High Priority {highPriorityIncompleteCount > 0 && `(${highPriorityIncompleteCount})`}
          </button>
          <button
            onClick={() => setFilterPriority('medium')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterPriority === 'medium'
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilterPriority('low')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterPriority === 'low'
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Low
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-md ${
              filterCategory === 'all' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-500'
            }`}
          >
            All
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <button
            onClick={() => setFilterCategory('school')}
            className={`px-2.5 py-1 rounded-md ${
              filterCategory === 'school' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-500'
            }`}
          >
            School
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <button
            onClick={() => setFilterCategory('work')}
            className={`px-2.5 py-1 rounded-md ${
              filterCategory === 'work' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-500'
            }`}
          >
            Job
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <button
            onClick={() => setFilterCategory('life')}
            className={`px-2.5 py-1 rounded-md ${
              filterCategory === 'life' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-500'
            }`}
          >
            Life
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-white/40 dark:border-white/10 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white font-heading">
              {tasks.length === 0 ? 'Your priority board is clean' : 'No tasks match this filter'}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
              {tasks.length === 0
                ? "No clutter or someone else's business here. Type whatever you need to get done in the box above, and BloomAI will break it down into 3 easy micro-steps for you."
                : 'Try switching filters above or add a task to see it here.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedMicroStepId === task.id;
            const isAiLoading = loadingAiTaskId === task.id;
            const steps = task.microSteps || generateMicroSteps(task.title, task.category);

            return (
              <div
                key={task.id}
                className={`group rounded-2xl border transition-all backdrop-blur-xl ${
                  task.completed
                    ? 'bg-white/40 dark:bg-neutral-900/40 border-white/20 dark:border-white/5 opacity-70'
                    : task.priority === 'high'
                    ? 'bg-white/80 dark:bg-neutral-900/65 border-rose-300/60 dark:border-rose-900/40 shadow-md shadow-rose-950/5'
                    : task.priority === 'medium'
                    ? 'bg-white/80 dark:bg-neutral-900/65 border-amber-300/60 dark:border-amber-900/40 shadow-md shadow-amber-950/5'
                    : 'bg-white/80 dark:bg-neutral-900/65 border-white/40 dark:border-white/10 shadow-md'
                }`}
              >
                <div className="p-4 flex items-start justify-between gap-3">
                  
                  {/* Complete checkbox & details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Priority Badge */}
                        <span
                          className={`text-2xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            task.priority === 'high'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {task.priority === 'high' ? 'High Priority' : task.priority === 'medium' ? 'Medium' : 'Low'}
                        </span>

                        {/* Category & Time */}
                        <span className="text-xs text-neutral-500 capitalize flex items-center gap-1">
                          {task.category === 'school' && <BookOpen className="w-3 h-3 text-indigo-500" />}
                          {task.category === 'work' && <Briefcase className="w-3 h-3 text-amber-500" />}
                          {task.category === 'life' && <Heart className="w-3 h-3 text-rose-500" />}
                          <span>{task.category}</span>
                        </span>

                        {task.estimatedTime && (
                          <>
                            <span className="text-neutral-300 dark:text-neutral-700">·</span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedTime}</span>
                            </span>
                          </>
                        )}

                        {task.dueDate && (
                          <>
                            <span className="text-neutral-300 dark:text-neutral-700">·</span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </span>
                          </>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'line-through text-neutral-400 dark:text-neutral-500'
                            : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  {/* Actions: 5-min sprint, micro-steps, delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!task.completed && (
                      <button
                        onClick={() => start5MinSprint(task.title)}
                        className="px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1"
                        title="Start 5-minute timer for this task"
                      >
                        <Play className="w-3 h-3" />
                        <span className="hidden sm:inline">5 Min</span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedMicroStepId(isExpanded ? null : task.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        isExpanded
                          ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200'
                          : 'bg-white/60 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                      title="View BloomAI 3 micro-steps"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-3 h-3 text-teal-500 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-teal-500" />
                      )}
                      <span className="hidden sm:inline">AI Steps</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete task ${task.title}`}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white/50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Micro-Steps Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-2 border-t border-white/20 dark:border-white/10 bg-white/40 dark:bg-neutral-950/40 rounded-b-2xl">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
                        <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                        <span>BloomAI Micro-Steps (Do just the first 1):</span>
                        {task.isAiGenerated && (
                          <span className="text-3xs px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono">
                            Gemini AI
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => generateAiMicroSteps(task.id, task.title, task.category, task.priority)}
                        disabled={isAiLoading}
                        className="flex items-center gap-1 text-2xs text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
                        title="Regenerate steps with Gemini AI"
                      >
                        <RefreshCw className={`w-3 h-3 ${isAiLoading ? 'animate-spin' : ''}`} />
                        <span>Regenerate with AI</span>
                      </button>
                    </div>

                    {isAiLoading ? (
                      <div className="py-3 flex items-center justify-center gap-2 text-xs text-neutral-500">
                        <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                        <span>BloomAI is breaking this down into 3 easy steps...</span>
                      </div>
                    ) : (
                      <ol className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 pl-4 list-decimal">
                        {steps.map((step: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Encouragement Footer without toxic scorecards */}
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        <div>
          <span>Today's Progress: </span>
          <strong className="text-neutral-900 dark:text-white font-mono">{completedTodayCount}</strong> tasks completed
        </div>
        <span className="italic">"You don't have to carry the whole week right now. Just move the next stone."</span>
      </div>
    </div>
  );
};

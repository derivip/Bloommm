import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Heart,
  Activity,
  Sparkles,
  Play,
  ArrowRight,
  Clock,
  CheckCircle,
  X,
  Search,
} from 'lucide-react';
import { LEARNING_ITEMS, LearningItem } from '../data/learningContent';

interface LearningTabProps {
  onOpenDestressActivity: (activity: 'breathing' | 'grounding' | 'braindump') => void;
}

export const LearningTab: React.FC<LearningTabProps> = ({ onOpenDestressActivity }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingItem, setReadingItem] = useState<LearningItem | null>(null);
  const [watchingItem, setWatchingItem] = useState<LearningItem | null>(null);

  // Filter items
  const filteredItems = LEARNING_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCardClick = (item: LearningItem) => {
    if (item.type === 'activity') {
      if (item.id === 'd1') onOpenDestressActivity('breathing');
      else if (item.id === 'd2') onOpenDestressActivity('grounding');
      else onOpenDestressActivity('braindump');
    } else if (item.type === 'video') {
      setWatchingItem(item);
    } else {
      setReadingItem(item);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Topics
          </button>

          <button
            onClick={() => setSelectedCategory('careers')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'careers'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Careers & Jobs</span>
          </button>

          <button
            onClick={() => setSelectedCategory('personal')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'personal'
                ? 'bg-teal-600 text-white font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Personal Life</span>
          </button>

          <button
            onClick={() => setSelectedCategory('emotional')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'emotional'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Emotional Struggles</span>
          </button>

          <button
            onClick={() => setSelectedCategory('physical')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'physical'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Physical Health</span>
          </button>

          <button
            onClick={() => setSelectedCategory('destress')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'destress'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destressing</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, advice..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Media Type Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-500 font-medium">Format:</span>
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            selectedType === 'all'
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          All Formats
        </button>
        <button
          onClick={() => setSelectedType('article')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            selectedType === 'article'
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          Articles
        </button>
        <button
          onClick={() => setSelectedType('activity')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            selectedType === 'activity'
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          Interactive Activities
        </button>
        <button
          onClick={() => setSelectedType('video')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            selectedType === 'video'
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Grid of Learning Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group cursor-pointer flex flex-col bg-white/75 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 shadow-md hover:shadow-xl hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all overflow-hidden"
          >
            {/* Visual Thumbnail */}
            {item.image ? (
              <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/40 dark:to-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.category}
                  </span>
                  <span>{item.readTime}</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata separator */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                  <span className="capitalize font-medium text-emerald-700 dark:text-emerald-400">
                    {item.category}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{item.type}</span>
                  <span>·</span>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{item.type === 'activity' ? 'Start Activity' : item.type === 'video' ? 'Watch Guide' : 'Read Advice'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">{readingItem.category}</span>
                <span>·</span>
                <span>{readingItem.readTime}</span>
              </div>
              <button
                onClick={() => setReadingItem(null)}
                aria-label="Close article"
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-heading">
                {readingItem.title}
              </h2>

              {readingItem.image && (
                <div className="rounded-xl overflow-hidden aspect-16/9 max-h-56 w-full">
                  <img
                    src={readingItem.image}
                    alt={readingItem.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {readingItem.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {readingItem.takeaways && (
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
                    Action Takeaways:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    {readingItem.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setReadingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {watchingItem && watchingItem.videoData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Interactive Video Session · {watchingItem.videoData.duration}
              </span>
              <button
                onClick={() => setWatchingItem(null)}
                aria-label="Close video player"
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Simulated video playback frame */}
              <div className="relative aspect-16/9 bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center group">
                <img
                  src={watchingItem.image}
                  alt={watchingItem.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-neutral-950/40">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-3">
                    <Play className="w-7 h-7 ml-1 fill-current" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {watchingItem.title}
                  </span>
                  <span className="text-xs text-neutral-300 mt-1">
                    Instructor: {watchingItem.videoData.instructor}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2">
                  Session Timestamps & Key Chapters:
                </h4>
                <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  {watchingItem.videoData.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{h.split(' - ')[0]}</span>
                      <span>—</span>
                      <span>{h.split(' - ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {watchingItem.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

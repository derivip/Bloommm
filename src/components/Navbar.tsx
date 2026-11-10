import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  CheckSquare,
  BookOpen,
  MessageSquare,
  Palette,
  Check,
} from 'lucide-react';
import { GRADIENT_THEMES } from '../bloomEngine.js';

interface NavbarProps {
  activeTab: 'dashboard' | 'learning' | 'companion';
  setActiveTab: (tab: 'dashboard' | 'learning' | 'companion') => void;
  isDark: boolean;
  toggleTheme: () => void;
  isLofiPlaying: boolean;
  toggleLofi: () => void;
  onOpenDestress: () => void;
  currentThemeKey: string;
  setThemeKey: (themeKey: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  isLofiPlaying,
  toggleLofi,
  onOpenDestress,
  currentThemeKey,
  setThemeKey,
}) => {
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const themeList = Object.values(GRADIENT_THEMES);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-neutral-950/75 border-b border-white/30 dark:border-white/10 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Brand Zone: Flower icon in upper left + Bloom title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            aria-label="Bloom Homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              {/* Blooming Flower Logo */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="12" cy="7" r="3" fill="#ffffff" fillOpacity="0.95" />
                <circle cx="16.3" cy="9.5" r="3" fill="#ffffff" fillOpacity="0.95" />
                <circle cx="16.3" cy="14.5" r="3" fill="#ffffff" fillOpacity="0.95" />
                <circle cx="12" cy="17" r="3" fill="#ffffff" fillOpacity="0.95" />
                <circle cx="7.7" cy="14.5" r="3" fill="#ffffff" fillOpacity="0.95" />
                <circle cx="7.7" cy="9.5" r="3" fill="#ffffff" fillOpacity="0.95" />
                <circle cx="12" cy="12" r="2.5" fill="#FDE047" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent font-heading">
              Bloom
            </span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium" aria-label="Main Navigation">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'dashboard'
                ? 'bg-white/80 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold shadow-xs border border-white/50 dark:border-white/10 backdrop-blur-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('learning')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'learning'
                ? 'bg-white/80 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold shadow-xs border border-white/50 dark:border-white/10 backdrop-blur-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-500" />
            <span>Learning Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('companion')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'companion'
                ? 'bg-white/80 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold shadow-xs border border-white/50 dark:border-white/10 backdrop-blur-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-emerald-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="2.8" fill="#10B981" fillOpacity="0.9" />
              <circle cx="16.3" cy="9.5" r="2.8" fill="#10B981" fillOpacity="0.9" />
              <circle cx="16.3" cy="14.5" r="2.8" fill="#10B981" fillOpacity="0.9" />
              <circle cx="12" cy="17" r="2.8" fill="#10B981" fillOpacity="0.9" />
              <circle cx="7.7" cy="14.5" r="2.8" fill="#10B981" fillOpacity="0.9" />
              <circle cx="7.7" cy="9.5" r="2.8" fill="#10B981" fillOpacity="0.9" />
              <circle cx="12" cy="12" r="2.2" fill="#FDE047" />
            </svg>
            <span>BloomAI</span>
          </button>
        </nav>

        {/* Top Right Controls: Theme Gradient Selector, Lo-fi music toggle & Day/Night toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Dynamic Gradient Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPaletteMenu(!showPaletteMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-200 transition-all shadow-xs backdrop-blur-md"
              title="Change Dynamic Gradient Theme"
              aria-label="Change Dynamic Gradient Theme"
            >
              <Palette className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="hidden md:inline capitalize font-semibold">
                {GRADIENT_THEMES[currentThemeKey as keyof typeof GRADIENT_THEMES]?.name || 'Gradient'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showPaletteMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPaletteMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-xl z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-2xs font-bold uppercase tracking-wider text-neutral-400">
                    Dynamic Gradient Themes
                  </div>
                  <div className="space-y-1">
                    {themeList.map((t) => {
                      const isSelected = t.id === currentThemeKey;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setThemeKey(t.id);
                            setShowPaletteMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                            isSelected
                              ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white'
                              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Color preview dot */}
                            <span
                              className={`w-3.5 h-3.5 rounded-full shadow-xs ${
                                t.id === 'aurora'
                                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400'
                                  : t.id === 'twilight'
                                  ? 'bg-gradient-to-tr from-violet-600 to-indigo-400'
                                  : t.id === 'sunset'
                                  ? 'bg-gradient-to-tr from-rose-500 to-amber-400'
                                  : 'bg-gradient-to-tr from-blue-600 to-cyan-400'
                              }`}
                            />
                            <div>
                              <div>{t.name}</div>
                              <div className="text-3xs text-neutral-400 font-normal">{t.description}</div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Destress shortcut button */}
          <button
            onClick={onOpenDestress}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800/60 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap shadow-xs backdrop-blur-md"
            title="Open 4-7-8 Breathing & Quick Destress"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Calm Down</span>
          </button>

          {/* Lo-fi Soft Background Music Toggle */}
          <button
            onClick={toggleLofi}
            aria-label={isLofiPlaying ? 'Mute soft lo-fi music' : 'Play soft lo-fi background music'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all backdrop-blur-md ${
              isLofiPlaying
                ? 'bg-amber-50/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 shadow-xs'
                : 'bg-white/60 dark:bg-white/10 border-white/40 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-white/15'
            }`}
            title={isLofiPlaying ? 'Lo-Fi Music playing softly (click to stop)' : 'Play soothing soft lo-fi music'}
          >
            {isLofiPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="hidden sm:inline">Lo-Fi On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline">Lo-Fi Music</span>
              </>
            )}
          </button>

          {/* Day / Night Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
            className="p-2 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 backdrop-blur-md shadow-xs"
            title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroQuote } from './components/HeroQuote';
import { DashboardTab } from './components/DashboardTab';
import { LearningTab } from './components/LearningTab';
import { CompanionTab } from './components/CompanionTab';
import { DestressModal } from './components/DestressModal';
import { getRandomQuote, lofiPlayer, GRADIENT_THEMES } from './bloomEngine.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'learning' | 'companion'>('dashboard');

  // Dynamic gradient theme state (aurora | twilight | sunset | ocean)
  const [themeKey, setThemeKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bloom_gradient_theme');
      if (saved && GRADIENT_THEMES[saved as keyof typeof GRADIENT_THEMES]) return saved;
    } catch (e) {}
    return 'aurora';
  });

  // Day / Night mode state (defaults to dark mode for cozy late night aesthetic)
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('bloom_theme');
      if (savedTheme !== null) return savedTheme === 'dark';
    } catch (e) {}
    return true;
  });

  // Soft lo-fi music state
  const [isLofiPlaying, setIsLofiPlaying] = useState<boolean>(false);

  // Motivational quote that randomizes on load and auto-refreshes every 30s
  const [currentQuote, setCurrentQuote] = useState(() => getRandomQuote());
  const [quoteSecondsLeft, setQuoteSecondsLeft] = useState(30);

  // Auto-refresh quote every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteSecondsLeft((prev) => {
        if (prev <= 1) {
          setCurrentQuote((current) => getRandomQuote(current.index));
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Destress sanctuary modal
  const [isDestressOpen, setIsDestressOpen] = useState<boolean>(false);
  const [destressActivity, setDestressActivity] = useState<'breathing' | 'grounding' | 'braindump'>('breathing');

  // Sync theme to document.documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('bloom_theme', isDark ? 'dark' : 'light');
    } catch (e) {}
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('bloom_gradient_theme', themeKey);
    } catch (e) {}
  }, [themeKey]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleLofi = async () => {
    const playing = await lofiPlayer.toggle();
    setIsLofiPlaying(playing);
  };

  const handleOpenDestress = (activity: 'breathing' | 'grounding' | 'braindump' = 'breathing') => {
    setDestressActivity(activity);
    setIsDestressOpen(true);
  };

  const activeTheme = GRADIENT_THEMES[themeKey as keyof typeof GRADIENT_THEMES] || GRADIENT_THEMES.aurora;
  const currentPalette = isDark ? activeTheme.dark : activeTheme.light;

  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-500">
      
      {/* Dynamic Animated Gradient Background System */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Base Dynamic Canvas Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentPalette.bg} transition-all duration-1000 ease-in-out`}
        />

        {/* Ambient Floating Gradient Mesh Orbs */}
        <div
          className={`absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full ${currentPalette.orb1} blur-[90px] filter animate-orb-1 transition-all duration-1000`}
        />
        <div
          className={`absolute top-1/3 -right-24 w-[34rem] h-[34rem] rounded-full ${currentPalette.orb2} blur-[95px] filter animate-orb-2 transition-all duration-1000`}
        />
        <div
          className={`absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] rounded-full ${currentPalette.orb3} blur-[90px] filter animate-orb-3 transition-all duration-1000`}
        />

        {/* Subtle luminous glass texture */}
        <div className="absolute inset-0 bg-radial-gradient from-white/10 dark:from-white/5 via-transparent to-black/15 dark:to-black/35 pointer-events-none" />
      </div>

      {/* Top Bar with brand mark, navigation tabs, and top-right audio & theme toggles */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isLofiPlaying={isLofiPlaying}
        toggleLofi={toggleLofi}
        onOpenDestress={() => handleOpenDestress('breathing')}
        currentThemeKey={themeKey}
        setThemeKey={setThemeKey}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Motivational Pop Culture Quote Hero - Present on opening page */}
        <HeroQuote
          quote={currentQuote}
          secondsRemaining={quoteSecondsLeft}
          onOpenDestress={() => handleOpenDestress('breathing')}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardTab onOpenDestress={() => handleOpenDestress('breathing')} />
        )}

        {activeTab === 'learning' && (
          <LearningTab onOpenDestressActivity={handleOpenDestress} />
        )}

        {activeTab === 'companion' && (
          <CompanionTab />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/20 dark:border-white/10 backdrop-blur-md py-6 text-center text-xs text-neutral-600 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 dark:text-white">Bloom</span>
            <span>·</span>
            <span>Built with human-centered empathy for young minds balancing school and life.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenDestress('breathing')}
              className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Breathing Pacer
            </button>
            <button
              onClick={toggleLofi}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              {isLofiPlaying ? 'Mute Lo-Fi' : 'Play Lo-Fi'}
            </button>
            <button
              onClick={toggleTheme}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {isDark ? 'Day Mode' : 'Night Mode'}
            </button>
          </div>
        </div>
      </footer>

      {/* De-stress Activity Sanctuary Modal */}
      <DestressModal
        isOpen={isDestressOpen}
        onClose={() => setIsDestressOpen(false)}
        initialActivity={destressActivity}
      />
    </div>
  );
}

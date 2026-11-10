import React, { useState, useEffect } from 'react';
import { X, Wind, Eye, FileText, Check, Flame, RotateCcw } from 'lucide-react';

interface DestressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialActivity?: 'breathing' | 'grounding' | 'braindump';
}

export const DestressModal: React.FC<DestressModalProps> = ({
  isOpen,
  onClose,
  initialActivity = 'breathing',
}) => {
  const [activeActivity, setActiveActivity] = useState<'breathing' | 'grounding' | 'braindump'>(initialActivity);

  // 4-7-8 Breathing state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // 5-4-3-2-1 Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingPrompts = [
    { count: 5, sense: 'SEE', prompt: 'Look around. Name 5 specific things you can see (e.g., your desk lamp, your shoes, shadows on the wall).' },
    { count: 4, sense: 'TOUCH', prompt: 'Feel 4 physical sensations (e.g., your feet against the floor, fabric of your shirt, cool air on your skin).' },
    { count: 3, sense: 'HEAR', prompt: 'Listen carefully. Name 3 sounds you can hear right now (e.g., computer fan, traffic outside, your breathing).' },
    { count: 2, sense: 'SMELL', prompt: 'Notice 2 scents in the air (e.g., freshly washed laundry, pencil wood, morning/evening air).' },
    { count: 1, sense: 'TASTE', prompt: 'Notice 1 taste or sensation in your mouth, or take a sip of cold water.' },
  ];

  // Brain Dump state
  const [brainDumpText, setBrainDumpText] = useState('');
  const [isBurned, setIsBurned] = useState(false);

  useEffect(() => {
    setActiveActivity(initialActivity);
  }, [initialActivity]);

  // Breathing timer loop
  useEffect(() => {
    if (!isOpen || activeActivity !== 'breathing' || !isBreathingActive) return;

    const timer = setInterval(() => {
      setBreathSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (breathPhase === 'Inhale') {
          setBreathPhase('Hold');
          return 7;
        } else if (breathPhase === 'Hold') {
          setBreathPhase('Exhale');
          return 8;
        } else {
          setBreathPhase('Inhale');
          setCycleCount((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeActivity, isBreathingActive, breathPhase]);

  if (!isOpen) return null;

  const handleBurn = () => {
    setIsBurned(true);
    setTimeout(() => {
      setBrainDumpText('');
      setIsBurned(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
              De-stress Sanctuary
            </span>
            <span className="text-xs text-neutral-500">·</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Reset your nervous system</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-2 gap-2">
          <button
            onClick={() => setActiveActivity('breathing')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeActivity === 'breathing'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            <span>4-7-8 Breathing</span>
          </button>

          <button
            onClick={() => setActiveActivity('grounding')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeActivity === 'grounding'
                ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-teal-600" />
            <span>5-4-3-2-1 Grounding</span>
          </button>

          <button
            onClick={() => setActiveActivity('braindump')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeActivity === 'braindump'
                ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Midnight Brain Dump</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {/* ACTIVITY 1: 4-7-8 Breathing */}
          {activeActivity === 'breathing' && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="relative w-52 h-52 flex items-center justify-center my-4">
                {/* Visual pulse rings */}
                <div
                  className={`absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 transition-all duration-1000 ease-in-out ${
                    breathPhase === 'Inhale'
                      ? 'scale-110 opacity-100'
                      : breathPhase === 'Hold'
                      ? 'scale-105 opacity-90'
                      : 'scale-75 opacity-40'
                  }`}
                />
                <div
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out shadow-lg ${
                    breathPhase === 'Inhale'
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 scale-105 text-white'
                      : breathPhase === 'Hold'
                      ? 'bg-gradient-to-tr from-teal-500 to-indigo-500 scale-100 text-white'
                      : 'bg-gradient-to-tr from-emerald-600 to-emerald-700 scale-85 text-white'
                  }`}
                >
                  <span className="text-xl font-bold uppercase tracking-wider">{breathPhase}</span>
                  <span className="text-3xl font-extrabold tabular-nums font-mono mt-1">
                    {breathSecondsLeft}s
                  </span>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mt-2">
                {breathPhase === 'Inhale' && 'Breathe in slowly through your nose, filling your belly.'}
                {breathPhase === 'Hold' && 'Hold gently. No tension in your shoulders or jaw.'}
                {breathPhase === 'Exhale' && 'Release slowly through your mouth, letting all weight drop.'}
              </p>

              <div className="flex items-center gap-4 mt-6 text-xs text-neutral-500">
                <span>Completed Cycles: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{cycleCount}</strong></span>
                <span>·</span>
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-200"
                >
                  {isBreathingActive ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITY 2: 5-4-3-2-1 Grounding */}
          {activeActivity === 'grounding' && (
            <div className="py-2">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400">
                  Step {groundingStep + 1} of 5
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  Find {groundingPrompts[groundingStep].count} things you can {groundingPrompts[groundingStep].sense}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/40 text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed mb-6">
                {groundingPrompts[groundingStep].prompt}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setGroundingStep(0)}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>

                {groundingStep < 4 ? (
                  <button
                    onClick={() => setGroundingStep((s) => s + 1)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                  >
                    <span>I Found Them</span>
                    <span>→</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>You're grounded in the present. Well done.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVITY 3: Midnight Brain Dump */}
          {activeActivity === 'braindump' && (
            <div className="py-2">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                Everything stays 100% private in your browser. Write whatever feels heavy, disorganized, or unfair. You don't have to keep it.
              </p>

              <div className="relative">
                <textarea
                  value={brainDumpText}
                  onChange={(e) => setBrainDumpText(e.target.value)}
                  placeholder="I have a test tomorrow, my shift ended late, I feel like nobody understands how tired I am..."
                  rows={6}
                  className={`w-full p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isBurned ? 'opacity-0 scale-95 duration-1000' : 'opacity-100'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-neutral-400 font-mono">
                  {brainDumpText.length} characters
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBurn}
                    disabled={!brainDumpText.trim() || isBurned}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-100 disabled:opacity-40 transition-colors"
                    title="Clear and release this thought"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Burn & Let Go</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

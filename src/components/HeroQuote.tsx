import React, { useEffect, useState } from 'react';
import { Clapperboard, Quote, Sparkles, Timer } from 'lucide-react';

interface HeroQuoteProps {
  quote: {
    quote: string;
    source: string;
    category: string;
  };
  onOpenDestress: () => void;
  secondsRemaining?: number;
}

export const HeroQuote: React.FC<HeroQuoteProps> = ({ quote, onOpenDestress, secondsRemaining = 30 }) => {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 mb-8 transition-all backdrop-blur-xl">
      {/* Background with cozy atmospheric study image & deep measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_bloom_ambience_1794323918364.jpg"
          alt="Cozy ambient study window with warm lamp and rain"
          className="w-full h-full object-cover object-center filter brightness-60 contrast-105"
          referrerPolicy="no-referrer"
        />
        {/* Scrim gradient ensures 100% readable bold white text */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-900/85 to-neutral-950/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-6 sm:px-10 py-10 md:py-14 max-w-4xl">
        {/* Editorial Subtitle & Pop Culture Kicker */}
        <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-emerald-400 mb-4">
          <Clapperboard className="w-4 h-4 text-emerald-400" />
          <span>Cinematic Inspiration</span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-300 normal-case font-normal">{quote.category}</span>
          <span className="text-neutral-500">·</span>
          <span className="text-emerald-300/80 normal-case font-mono text-2xs flex items-center gap-1">
            <Timer className="w-3 h-3 animate-spin [animation-duration:8s]" />
            <span>Refreshes every 30s ({secondsRemaining}s)</span>
          </span>
        </div>

        {/* The Motivational Quote in Bold White Text */}
        <div className="relative mb-5 min-h-[90px] flex items-center">
          <Quote className="absolute -top-3 -left-2 w-8 h-8 text-white/20 -z-1 pointer-events-none" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-snug drop-shadow-sm font-heading transition-opacity duration-500">
            "{quote.quote}"
          </h1>
        </div>

        {/* Source attribution & action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
          <div className="text-sm md:text-base font-medium text-emerald-300">
            — {quote.source}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDestress}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Take a Breather</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

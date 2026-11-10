/**
 * Bloom Engine - Core JavaScript logic for Bloom
 * Handles:
 * 1. Pop-culture & movie motivational quotes
 * 2. Pure Web Audio API Lo-Fi procedural chill music synth (zero-bandwidth, works on any connection speed)
 * 3. Task priority sorting and micro-step procrastination decomposition
 * 4. Offline supportive wisdom companion
 */

export const GRADIENT_THEMES = {
  aurora: {
    id: 'aurora',
    name: 'Aurora Glow',
    description: 'Emerald, teal & deep night cyan',
    dark: {
      bg: 'from-slate-950 via-teal-950/80 to-emerald-950/90',
      orb1: 'bg-emerald-500/30',
      orb2: 'bg-teal-500/30',
      orb3: 'bg-cyan-500/25',
      accent: 'emerald',
    },
    light: {
      bg: 'from-emerald-50 via-teal-50 to-sky-100',
      orb1: 'bg-emerald-300/45',
      orb2: 'bg-teal-200/50',
      orb3: 'bg-cyan-200/45',
      accent: 'emerald',
    },
  },
  twilight: {
    id: 'twilight',
    name: 'Twilight Dusk',
    description: 'Deep violet, indigo & midnight plum',
    dark: {
      bg: 'from-neutral-950 via-indigo-950/80 to-purple-950/90',
      orb1: 'bg-violet-600/30',
      orb2: 'bg-indigo-500/30',
      orb3: 'bg-fuchsia-500/25',
      accent: 'indigo',
    },
    light: {
      bg: 'from-violet-50 via-indigo-50 to-pink-50',
      orb1: 'bg-violet-200/55',
      orb2: 'bg-indigo-200/50',
      orb3: 'bg-pink-200/45',
      accent: 'indigo',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm rose, amber & evening coral',
    dark: {
      bg: 'from-neutral-950 via-rose-950/80 to-amber-950/80',
      orb1: 'bg-rose-500/30',
      orb2: 'bg-amber-500/30',
      orb3: 'bg-orange-500/25',
      accent: 'rose',
    },
    light: {
      bg: 'from-rose-50 via-orange-50 to-amber-100',
      orb1: 'bg-rose-200/55',
      orb2: 'bg-amber-200/50',
      orb3: 'bg-orange-200/45',
      accent: 'rose',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Cosmic Ocean',
    description: 'Marine sapphire, cobalt & seafoam',
    dark: {
      bg: 'from-slate-950 via-blue-950/80 to-cyan-950/80',
      orb1: 'bg-blue-600/30',
      orb2: 'bg-cyan-500/30',
      orb3: 'bg-sky-500/25',
      accent: 'cyan',
    },
    light: {
      bg: 'from-sky-50 via-blue-50 to-cyan-100',
      orb1: 'bg-sky-200/55',
      orb2: 'bg-blue-200/50',
      orb3: 'bg-cyan-200/45',
      accent: 'cyan',
    },
  },
};

export const POP_CULTURE_QUOTES = [
  {
    quote: "That's all it is, Miles. A leap of faith.",
    source: "Spider-Man: Into the Spider-Verse",
    category: "Courage",
  },
  {
    quote: "You'll have bad times, but it'll always wake you up to the good stuff you weren't paying attention to.",
    source: "Good Will Hunting",
    category: "Perspective",
  },
  {
    quote: "When I choose to see the good side of things, I'm not being naive. It is strategic and necessary.",
    source: "Everything Everywhere All At Once",
    category: "Resilience",
  },
  {
    quote: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.",
    source: "Rocky Balboa",
    category: "Grit",
  },
  {
    quote: "Don't ever let somebody tell you you can't do something. You got a dream, you gotta protect it.",
    source: "The Pursuit of Happyness",
    category: "Belief",
  },
  {
    quote: "We each need to find our own inspiration. Sometimes it's not easy, but you will get through this.",
    source: "Kiki's Delivery Service (Studio Ghibli)",
    category: "Growth",
  },
  {
    quote: "Taking on a challenge is a lot like riding a horse. If you're comfortable while doing it, you're probably doing it wrong.",
    source: "Ted Lasso",
    category: "Courage",
  },
  {
    quote: "No matter what anybody tells you, words and ideas can change the world.",
    source: "Dead Poets Society",
    category: "Purpose",
  },
  {
    quote: "You are not on your own. You never were.",
    source: "Spider-Man: No Way Home",
    category: "Belonging",
  },
  {
    quote: "There's some good in this world, and it's worth fighting for.",
    source: "The Lord of the Rings: The Two Towers",
    category: "Hope",
  },
  {
    quote: "Your focus determines your reality. Take it one breath and one moment at a time.",
    source: "Star Wars: The Phantom Menace",
    category: "Focus",
  },
  {
    quote: "You don't have to carry the whole mountain all at once. Just move the next stone.",
    source: "Modern Folklore & Cinema",
    category: "Calm",
  },
];

/**
 * Returns a random pop-culture quote
 */
export function getRandomQuote(excludeIndex = -1) {
  let index = Math.floor(Math.random() * POP_CULTURE_QUOTES.length);
  if (excludeIndex >= 0 && POP_CULTURE_QUOTES.length > 1 && index === excludeIndex) {
    index = (index + 1) % POP_CULTURE_QUOTES.length;
  }
  return { ...POP_CULTURE_QUOTES[index], index };
}

/**
 * Priority sorting: High > Medium > Low, then by completion status, then timestamp
 */
export const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    // Incomplete tasks come before completed tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // High priority before medium before low
    const weightA = PRIORITY_WEIGHTS[a.priority] || 1;
    const weightB = PRIORITY_WEIGHTS[b.priority] || 1;
    if (weightA !== weightB) {
      return weightB - weightA;
    }
    // Newest first
    return b.createdAt - a.createdAt;
  });
}

/**
 * Procrastination Buster: breaks any daunting task into 3 micro 5-minute action steps
 */
export function generateMicroSteps(taskTitle, category = 'general') {
  const cleanTitle = (taskTitle || 'Task').trim();
  const lower = cleanTitle.toLowerCase();

  if (lower.includes('study') || lower.includes('homework') || lower.includes('read') || lower.includes('exam') || lower.includes('essay')) {
    return [
      `Open your book or doc and write just 1 sentence or read 1 page.`,
      `Set a 5-minute timer and jot down 3 bullet points with no self-judgment.`,
      `Highlight 2 key facts, then pause and celebrate the momentum.`,
    ];
  }

  if (lower.includes('work') || lower.includes('shift') || lower.includes('job') || lower.includes('boss') || lower.includes('schedule')) {
    return [
      `Check your start time and set out your clothes/gear so you don't rush.`,
      `Draft a quick 1-sentence note for what needs attention today.`,
      `Take 3 slow breaths before walking in—remind yourself you are doing this for your future.`,
    ];
  }

  if (lower.includes('clean') || lower.includes('room') || lower.includes('laundry') || lower.includes('desk')) {
    return [
      `Pick up exactly 3 items from your desk or floor right now.`,
      `Clear one small 12-inch square of space where your laptop rests.`,
      `Throw away 1 piece of trash or empty 1 cup. Done for now.`,
    ];
  }

  return [
    `Spend 60 seconds setting up your environment (water bottle, clear screen).`,
    `Do the easiest first 5 minutes of "${cleanTitle}" without worrying about perfection.`,
    `Stop or continue: give yourself permission to step away if exhausted.`,
  ];
}

/**
 * Procedural Web Audio Lo-Fi Synth
 * Zero network requests, 0kb bandwidth! Works offline and on 2G/3G connections.
 * Generates warm, dusty, vinyl-filtered electric piano chords with gentle tape flutter.
 */
class LofiAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.35;
    this.timerId = null;
    this.masterGain = null;
    this.noiseNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // Master volume gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  // Generate continuous soft vinyl crackle / rain texture
  startVinylNoise() {
    if (!this.ctx || this.noiseNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink/brown noise filter for soft vinyl warmth
      lastOut = (lastOut * 0.95) + (white * 0.05);
      // Occasional gentle crackle
      const crackle = Math.random() > 0.999 ? (Math.random() - 0.5) * 0.3 : 0;
      data[i] = (lastOut * 0.08) + crackle;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 1200;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.12;

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
    this.noiseNode = noise;
  }

  // Play a lush, detuned lo-fi chord
  playChord(frequencies, duration = 3.6) {
    if (!this.ctx || !this.isPlaying) return;

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Triangle waves have natural warm overtones similar to vintage Rhodes/Wurlitzer
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      // Slight tape wow & flutter pitch drift
      const flutter = (Math.random() - 0.5) * 2.5;
      osc.frequency.setValueAtTime(freq + flutter, this.ctx.currentTime);

      // Lowpass filter to simulate vintage cassette tape warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + Math.random() * 100, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + duration);

      // Gentle attack and long soothing decay
      const now = this.ctx.currentTime;
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.12 / frequencies.length, now + 0.35);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // Chords progression: Ebmaj7 -> Cm7 -> Fm9 -> Bb13 (classic relaxing lo-fi progression)
  startSequence() {
    const progressions = [
      [155.56, 196.0, 233.08, 293.66], // Ebmaj7 (Eb3, G3, Bb3, D4)
      [130.81, 196.0, 233.08, 261.63], // Cm7 (C3, G3, Bb3, C4)
      [174.61, 207.65, 261.63, 311.13], // Fm7/9 (F3, Ab3, C4, Eb4)
      [116.54, 174.61, 233.08, 293.66], // Bb7/9 (Bb2, F3, Bb3, D4)
    ];

    let chordStep = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      this.playChord(progressions[chordStep], 3.8);
      chordStep = (chordStep + 1) % progressions.length;
      this.timerId = window.setTimeout(playNext, 4000);
    };

    playNext();
  }

  async toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.isPlaying = true;
      this.startVinylNoise();
      this.startSequence();
      return true;
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
      } catch (e) {}
      this.noiseNode = null;
    }
  }

  setVolumeLevel(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const lofiPlayer = new LofiAudioPlayer();

/**
 * Curated offline fallback replies for the companion
 */
export const OFFLINE_COMPANION_KNOWLEDGE = {
  general: "I'm right here with you. When you have school, a job, and no time to breathe, life feels impossibly loud. Remember: you don't have to carry the whole week right now. What's the one thing making you feel most stuck at this exact moment?",
  lateNight: "Late nights are when everything feels 10x heavier than it actually is. Your brain is running on fumes. If you have an essay or shift tomorrow, do one micro-step right now, then let yourself rest. You're human, not a machine.",
  burnout: "Burnout isn't laziness—it's your body's emergency brake. Balancing classes and shifts while feeling like adults don't get you is exhausting. It's okay to feel tired. Let's find one small pressure you can take off your shoulders tonight.",
  counselor: "A lot of counselors give generic advice like 'just buy a planner' because they don't understand what it's like clocking out at 10 PM on a school night. Your feelings are 100% valid. Here, no one is grading you or lecturing you.",
};

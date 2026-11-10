/**
 * Bloom - Standalone JavaScript Logic Engine
 * Includes: Pop Culture Quote Rotator (30s), Task Manager with Priority Sorting,
 * Web Audio Procedural Lo-Fi Synth, and BloomAI Empathetic Chat Engine.
 */

// 1. Pop Culture Quotes Collection
const BLOOM_QUOTES = [
  { text: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.", source: "Rocky Balboa", theme: "Grit" },
  { text: "That's all it is, Miles. A leap of faith.", source: "Spider-Man: Into the Spider-Verse", theme: "Courage" },
  { text: "You don't have to carry the whole mountain all at once. Just move the next stone.", source: "Modern Folklore & Cinema", theme: "Calm" },
  { text: "You are not on your own. You never were.", source: "Spider-Man: No Way Home", theme: "Belonging" },
  { text: "Your focus determines your reality. Take it one breath and one moment at a time.", source: "Star Wars: The Phantom Menace", theme: "Focus" },
  { text: "We each need to find our own inspiration. Sometimes it's not easy, but you will get through this.", source: "Kiki's Delivery Service (Studio Ghibli)", theme: "Growth" },
  { text: "No matter what anybody tells you, words and ideas can change the world.", source: "Dead Poets Society", theme: "Purpose" }
];

// Quote State
let quoteIndex = 0;
let quoteCountdown = 30;

function rotateQuote() {
  quoteIndex = (quoteIndex + 1) % BLOOM_QUOTES.length;
  const quote = BLOOM_QUOTES[quoteIndex];
  const textEl = document.getElementById('quote-text');
  const sourceEl = document.getElementById('quote-source');
  if (textEl && sourceEl) {
    textEl.textContent = `"${quote.text}"`;
    sourceEl.textContent = `— ${quote.source}`;
  }
  quoteCountdown = 30;
}

// 30-Second Quote Auto-Refresh Interval
setInterval(() => {
  quoteCountdown--;
  const cdEl = document.getElementById('quote-countdown');
  if (cdEl) {
    cdEl.textContent = `Refreshes in ${quoteCountdown}s`;
  }
  if (quoteCountdown <= 0) {
    rotateQuote();
  }
}, 1000);

// 2. Task Management & Priority Sorting
let tasks = [];
let currentFilter = 'all';

function generateMicroSteps(title) {
  const lower = (title || '').toLowerCase();
  if (lower.includes('essay') || lower.includes('write') || lower.includes('paper') || lower.includes('dbq')) {
    return [
      "Open your doc and write just 1 rough sentence—even if it feels messy.",
      "Jot down 3 quick bullet points for what each paragraph will discuss.",
      "Skim the rubric for 2 minutes to spot the easiest points to grab, then take a deep breath."
    ];
  }
  if (lower.includes('math') || lower.includes('calc') || lower.includes('physics') || lower.includes('problem')) {
    return [
      "Look at problem #1, write down the formula, and solve only the first line.",
      "Check your notes or a quick example video for 3 minutes if you feel stuck.",
      "Finish that single problem, put a star next to it, and celebrate starting."
    ];
  }
  if (lower.includes('work') || lower.includes('shift') || lower.includes('boss') || lower.includes('manager')) {
    return [
      "Check your work schedule app and calendar to confirm your exact shift times.",
      "Lay out your work uniform or clothes right now so you don't panic later.",
      "Draft a quick 1-sentence note to your manager if you need an exam week adjustment."
    ];
  }
  return [
    `Spend 60 seconds setting up your environment for "${title}".`,
    `Set a 5-minute timer and do the easiest first 10% without aiming for perfection.`,
    `Stop or continue: you broke the procrastination freeze, which is 80% of the battle.`
  ];
}

function handleAddTask(event) {
  event.preventDefault();
  const input = document.getElementById('task-input');
  const prioritySelect = document.getElementById('task-priority');
  const categorySelect = document.getElementById('task-category');

  if (!input || !input.value.trim()) return;

  const newTask = {
    id: 't_' + Date.now(),
    title: input.value.trim(),
    priority: prioritySelect.value,
    category: categorySelect.value,
    completed: false,
    microSteps: generateMicroSteps(input.value.trim())
  };

  tasks.unshift(newTask);
  input.value = '';
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function setPriorityFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks();
}

function renderTasks() {
  const listEl = document.getElementById('task-list');
  if (!listEl) return;

  // Sort: Incomplete first, then High -> Medium -> Low
  const priorityWeights = { high: 100, medium: 50, low: 10 };
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityWeights[b.priority] - priorityWeights[a.priority];
  });

  const filtered = sorted.filter(t => currentFilter === 'all' || t.priority === currentFilter);

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <p><strong>Your priority board is clean</strong></p>
        <p style="font-size: 0.8rem; margin-top: 0.4rem;">Type any task in the box above to break it down with BloomAI.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(t => `
    <div class="task-card ${t.priority}-priority ${t.completed ? 'completed' : ''}">
      <div class="task-top">
        <div class="task-title-group">
          <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask('${t.id}')" />
          <span class="task-badge ${t.priority}">${t.priority} priority</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: capitalize;">${t.category}</span>
          <strong>${t.title}</strong>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="deleteTask('${t.id}')">✕</button>
      </div>
      <div class="micro-steps-box">
        <div style="font-size: 0.75rem; color: #34d399; font-weight: 700; margin-bottom: 0.25rem;">
          🌸 BloomAI Micro-Steps:
        </div>
        <ol>
          ${t.microSteps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    </div>
  `).join('');
}

// 3. 5-Minute Sprint Timer
let sprintSeconds = 300;
let isSprintRunning = false;
let sprintInterval = null;

function toggleSprintTimer() {
  isSprintRunning = !isSprintRunning;
  const btn = document.getElementById('sprint-toggle-btn');
  if (isSprintRunning) {
    if (btn) btn.textContent = 'Pause';
    sprintInterval = setInterval(() => {
      sprintSeconds--;
      updateSprintDisplay();
      if (sprintSeconds <= 0) {
        clearInterval(sprintInterval);
        isSprintRunning = false;
        if (btn) btn.textContent = 'Start 5 Min';
      }
    }, 1000);
  } else {
    clearInterval(sprintInterval);
    if (btn) btn.textContent = 'Start 5 Min';
  }
}

function resetSprintTimer() {
  clearInterval(sprintInterval);
  isSprintRunning = false;
  sprintSeconds = 300;
  updateSprintDisplay();
  const btn = document.getElementById('sprint-toggle-btn');
  if (btn) btn.textContent = 'Start 5 Min';
}

function updateSprintDisplay() {
  const el = document.getElementById('sprint-digits');
  if (el) {
    const mins = Math.floor(sprintSeconds / 60);
    const secs = sprintSeconds % 60;
    el.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

// 4. Tab Switching
function switchTab(tab) {
  document.querySelectorAll('.tab-view').forEach(v => {
    v.classList.remove('active-view');
    v.classList.add('hidden-view');
  });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  if (tab === 'dashboard') {
    document.getElementById('dashboard-view').classList.add('active-view');
    document.getElementById('dashboard-view').classList.remove('hidden-view');
    document.getElementById('tab-dashboard-btn').classList.add('active');
  } else if (tab === 'bloomai') {
    document.getElementById('bloomai-view').classList.add('active-view');
    document.getElementById('bloomai-view').classList.remove('hidden-view');
    document.getElementById('tab-bloomai-btn').classList.add('active');
  }
}

// 5. BloomAI Companion Chat
let chatMessages = [
  { role: 'bot', text: "Hey! I'm BloomAI. I'm right here with you—whether you need to vent about a brutal shift, figure out how to tackle an overdue assignment, or just talk through things without being lectured. What's currently on your mind?" }
];

function renderChat() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = chatMessages.map(m => `
    <div class="chat-bubble ${m.role}">
      ${m.text}
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

function getBloomAIResponse(userText) {
  const lower = (userText || '').toLowerCase();
  if (lower.includes('counselor') || lower.includes('guidance') || lower.includes('planner') || lower.includes('adults')) {
    return "A lot of counselors and adults give advice like 'just buy a planner' because they operate on a 1990s playbook. They don't understand what it's like clocking out at 10 PM on a Tuesday, having homework waiting, and feeling constantly exhausted.\n\nTheir inability to understand your reality does NOT mean you're failing. Balancing a job and high school requires serious grit. Here at BloomAI, nobody is grading you or lecturing you.";
  }
  if (lower.includes('shift') || lower.includes('boss') || lower.includes('manager') || lower.includes('work') || lower.includes('job') || lower.includes('exam')) {
    return "Balancing a job outside of school is tough. Remember: You are a student first. Your high school diploma stays with you forever; an hourly shift does not.\n\nWhen asking to cut hours for exams, use this script:\n'Hi [Manager], my midterm exams are scheduled next week. To make sure I keep my grades up while performing well here, could I swap my shift or cap my hours at 12 this week?'\nGiving 10-14 days notice makes it very hard for them to say no.";
  }
  if (lower.includes('late') || lower.includes('night') || lower.includes('sleep') || lower.includes('exhausted') || lower.includes('tired')) {
    return "Late nights are when everything feels 10x heavier than it actually is. Your brain is running on fumes right now.\n\nHere is our emergency late-night plan:\n• Pick just ONE minimum thing to secure passing credit tomorrow (e.g., write 1 rough paragraph or do 2 problems).\n• If it's truly too late, send a brief, polite email to your teacher before midnight.\n• Give yourself full permission to sleep. Sleep is fuel, not a reward.";
  }
  return "I hear you loud and clear. When you're managing school, a job, and personal struggles all at once, carrying all of that alone feels suffocating.\n\n1. Don't try to solve your whole future tonight. You only need to handle the next 15 minutes.\n2. Pick the single smallest action you can take to relieve pressure.\n3. Be kind to yourself: you are working harder than most adults realize.\n\nTell me a little more about what's feeling heaviest right now.";
}

function handleSendChatMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  chatMessages.push({ role: 'user', text });
  input.value = '';
  renderChat();

  setTimeout(() => {
    const reply = getBloomAIResponse(text);
    chatMessages.push({ role: 'bot', text: reply });
    renderChat();
  }, 400);
}

function sendQuickPrompt(promptText) {
  chatMessages.push({ role: 'user', text: promptText });
  renderChat();
  setTimeout(() => {
    const reply = getBloomAIResponse(promptText);
    chatMessages.push({ role: 'bot', text: reply });
    renderChat();
  }, 400);
}

function clearBloomChat() {
  chatMessages = [
    { role: 'bot', text: "Clean slate. I'm right here whenever you need a listening ear, a sanity check, or quick advice. What's on your mind?" }
  ];
  renderChat();
}

// 6. Day / Night Mode Toggle
function toggleDayNight() {
  const html = document.documentElement;
  html.classList.toggle('light');
  html.classList.toggle('dark');
}

// 7. Procedural Lo-Fi Music Synthesizer (Web Audio API)
let audioCtx = null;
let isLofiPlaying = false;
let lofiTimer = null;

function toggleLofiMusic() {
  if (isLofiPlaying) {
    if (lofiTimer) clearInterval(lofiTimer);
    isLofiPlaying = false;
    document.getElementById('lofi-text').textContent = 'Lo-Fi';
    return;
  }

  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isLofiPlaying = true;
  document.getElementById('lofi-text').textContent = 'Lo-Fi On';

  // Play peaceful jazzy chords
  const chords = [
    [261.63, 311.13, 392.00, 466.16], // Cm7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];
  let chordIdx = 0;

  function playChord() {
    if (!isLofiPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const freqs = chords[chordIdx % chords.length];
    chordIdx++;

    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 4);
    });
  }

  playChord();
  lofiTimer = setInterval(playChord, 3800);
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  renderChat();
});

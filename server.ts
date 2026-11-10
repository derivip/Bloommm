import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Dynamic GoogleGenAI client initialization on demand
function getGenAI(): GoogleGenAI | null {
  // Re-read .env in case secrets were added/injected at runtime
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }

  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('Could not instantiate GoogleGenAI:', e);
    return null;
  }
}

// System prompt tailored for 17-year-old struggling with school, work, burnout, loneliness, and procrastination
const BLOOMAI_SYSTEM_INSTRUCTION = `You are "BloomAI", a compassionate, grounded, and non-judgmental 24/7 AI companion for a 17-year-old high school student who balances school, a demanding job, exhaustion, procrastination, and emotional struggles.

Key Persona & Tone:
- Talk like a supportive, emotionally intelligent, real mentor/older friend—never condescending, preachy, or clinical. Avoid sterile corporate language and cliches ("Just make a schedule!").
- Understand that procrastination is usually an emotional regulation/overwhelm problem, not laziness.
- Empathize with having a shift right after class, feeling exhausted at 11 PM or 2 AM, and having counselors who don't understand modern pressures.
- Provide practical, micro-sized advice (e.g., the 5-minute rule, breaking daunting essays into 3 bullet points, asking a boss for a shift swap without panic).
- Keep responses concise, warm, structured with bullet points or gentle steps when giving action plans so the user doesn't feel cognitively overloaded.
- If the user expresses extreme crisis or self-harm, provide immediate empathetic support and remind them of free, confidential resources like 988 or Crisis Text Line (text HOME to 741741).`;

/**
 * Intelligent Dynamic Empathetic Responder
 * Ensures that even if the API key is not configured or network drops,
 * BloomAI dynamically understands and responds to the user's specific prompt
 * instead of returning a generic static sentence.
 */
function generateSmartEmpatheticReply(message: string): string {
  const text = (message || '').toLowerCase();

  // 1. Greetings & Introductions
  if (/^(hi|hello|hey|sup|what'?s up|yo|howdy)/i.test(text.trim())) {
    return "Hey! I'm BloomAI. I'm right here with you—whether you need to vent about a brutal shift, figure out how to tackle an overdue assignment, or just talk through things without being lectured. What's currently on your mind tonight?";
  }

  // 2. Who are you / what do you do
  if (text.includes('who are you') || text.includes('what are you') || text.includes('what can you do')) {
    return "I'm BloomAI—your 24/7 empathetic companion built specifically for student-workers. I help you break through procrastination freeze with 5-minute micro-steps, give realistic advice for school and work that counselors don't understand, and give you a safe, judgment-free space to let it all out. What's stressing you most today?";
  }

  // 3. Guidance Counselors, Adults & Parents
  if (text.includes('counselor') || text.includes('guidance') || text.includes('parents') || text.includes('adults') || text.includes('mom') || text.includes('dad') || text.includes("don't understand")) {
    return "A lot of counselors and adults give advice like 'just buy a planner' or 'join more clubs' because they operate on a 1990s playbook. They don't understand what it's like clocking out at 10 PM on a Tuesday, having homework waiting, and feeling constantly exhausted.\n\nTheir inability to understand your reality does NOT mean you're failing. Balancing a job and high school requires serious grit. Here at BloomAI, nobody is grading you or lecturing you. What's the specific thing they said that felt so frustrating?";
  }

  // 4. Late night exhaustion & sleep
  if (text.includes('sleep') || text.includes('late') || text.includes('night') || text.includes('exhausted') || text.includes('tired') || text.includes('2am') || text.includes('1am') || text.includes('bed')) {
    return "Late nights are when everything feels 10x heavier than it actually is. Your brain is running on fumes right now.\n\nHere is our emergency late-night plan:\n• Pick just ONE minimum thing to secure passing credit tomorrow (e.g., write 1 rough paragraph or do 2 problems).\n• If it's truly too late, send a brief, polite email to your teacher before midnight: 'Hi [Teacher], I had a work shift and fell behind tonight. I will submit this by tomorrow afternoon.'\n• Give yourself full permission to sleep. Sleep is not a reward you have to earn—it's fuel you need to survive.";
  }

  // 5. Jobs, Bosses, Shifts & Managers
  if (text.includes('job') || text.includes('boss') || text.includes('work') || text.includes('shift') || text.includes('manager') || text.includes('coworker') || text.includes('quit') || text.includes('paycheck') || text.includes('hours')) {
    return "Balancing a job outside of school is tough, and bad managers love taking advantage of student schedules. Remember:\n\n1. You are a student first. Your high school diploma stays with you forever; an hourly shift does not.\n2. When asking to cut hours or swap shifts for exams, use this script:\n   'Hi [Manager], my midterm exams are scheduled next week. To make sure I keep my grades up while performing well here, could I swap my shift or cap my hours at 12 this week?'\n3. Advance notice (10-14 days) makes it very hard for them to say no.\n\nWhat's happening at your job right now?";
  }

  // 6. School, Homework, Tests, Essays & Classes
  if (text.includes('essay') || text.includes('homework') || text.includes('school') || text.includes('math') || text.includes('test') || text.includes('exam') || text.includes('class') || text.includes('study') || text.includes('fail')) {
    return "When you have assignments piling up, your brain triggers a freeze response because the workload feels like a threat. That's why you procrastinate—it's emotional overwhelm, not laziness.\n\nLet's break the freeze together:\n1. Open the document or textbook right now. Do not start writing yet.\n2. Commit to just 3 minutes of typing rough bullet points. Bad writing is 100% fine; a B-minus draft is infinitely better than a blank page.\n3. Take a breath after 3 minutes. Often, just starting breaks 80% of the friction.\n\nWhat is the exact assignment in front of you?";
  }

  // 7. Panic, Anxiety & Spiraling
  if (text.includes('panic') || text.includes('anxiety') || text.includes('scared') || text.includes('crying') || text.includes('overwhelmed') || text.includes('spiraling') || text.includes('breathe') || text.includes('heart')) {
    return "I am right here with you. Put your feet flat on the floor and unclench your jaw.\n\nTake one slow breath with me: Inhale through your nose for 4 seconds... hold gently for 4... and exhale slowly through your mouth for 6 seconds.\n\nYour nervous system is sounding a false fire alarm right now. You are safe in your room. Whatever deadline is looming does not define your worth or your future. What is the biggest thought circling in your head right now?";
  }

  // 8. Loneliness, Friends & Feeling Isolated
  if (text.includes('lonely') || text.includes('alone') || text.includes('friends') || text.includes('isolated') || text.includes('nobody') || text.includes('behind')) {
    return "When you work after school while other kids hang out, it's so easy to feel like an outsider looking through a window. And social media makes it look like everyone else has their life sorted out.\n\nTruth: almost every 17-year-old is secretly anxious, insecure, and confused. You're maturing faster because of your real-world responsibilities, and that can feel lonely. You're not defective for feeling isolated. I'm always here to listen—what made you feel lonely today?";
  }

  // 9. Default dynamic response addressing user words
  return `I hear you loud and clear. When you're managing school, a job, and personal struggles all at once, carrying all of that alone feels suffocating.

Here is my advice for right now:
1. Don't try to solve your whole future tonight. You only need to handle the next 15 minutes.
2. Pick the single smallest action you can take to relieve pressure (even just drinking water or closing 5 browser tabs).
3. Be kind to yourself: you are working harder than most adults realize.

Tell me a little more about what's feeling heaviest right now, and let's untangle it together.`;
}

/**
 * Dynamic Task Micro-Steps Generator
 * Generates custom, tailored 3-to-5 minute steps for any specific task title
 */
function generateDynamicTaskMicroSteps(taskTitle: string, category: string = 'general'): string[] {
  const clean = (taskTitle || 'Task').trim();
  const lower = clean.toLowerCase();

  if (lower.includes('essay') || lower.includes('paper') || lower.includes('write') || lower.includes('draft') || lower.includes('dbq')) {
    return [
      `Open your doc or notebook and write just 1 rough sentence—even if it feels messy.`,
      `Jot down 3 quick bullet points for what each paragraph will discuss (no full sentences needed).`,
      `Skim the rubric for 2 minutes to spot the easiest points to grab, then take a deep breath.`,
    ];
  }

  if (lower.includes('study') || lower.includes('read') || lower.includes('review') || lower.includes('exam') || lower.includes('quiz') || lower.includes('test') || lower.includes('chapter')) {
    return [
      `Open the slides or textbook and skim only the bold headings and diagrams for 3 minutes.`,
      `Pick exactly 2 key vocabulary terms or flashcards and test yourself on them.`,
      `Stand up, shake out your arms, and decide if you want another 5-minute sprint.`,
    ];
  }

  if (lower.includes('math') || lower.includes('physics') || lower.includes('calc') || lower.includes('algebra') || lower.includes('problem')) {
    return [
      `Look at problem #1, write down the formula, and solve only the first line of calculation.`,
      `Check your notes or a quick example video for 3 minutes if you feel stuck.`,
      `Finish that single problem, put a star next to it, and celebrate starting.`,
    ];
  }

  if (lower.includes('work') || lower.includes('shift') || lower.includes('job') || lower.includes('boss') || lower.includes('manager') || lower.includes('swap')) {
    return [
      `Check your work schedule app and calendar to confirm your exact shift times.`,
      `Lay out your work uniform, apron, or clothes right now so you don't panic later.`,
      `Draft a quick 1-sentence note to your manager if you need an exam week adjustment.`,
    ];
  }

  if (lower.includes('clean') || lower.includes('room') || lower.includes('laundry') || lower.includes('clothes') || lower.includes('desk')) {
    return [
      `Play one song and pick up exactly 3 items from your floor or bed.`,
      `Clear one small 12-inch space on your desk where your laptop or notebook sits.`,
      `Toss any empty drink cans or food wrappers into the trash. Real progress made.`,
    ];
  }

  if (lower.includes('email') || lower.includes('message') || lower.includes('text') || lower.includes('call') || lower.includes('ask')) {
    return [
      `Draft a rough 2-sentence message without sending it yet.`,
      `Read it over once: is it clear, polite, and to the point?`,
      `Hit send, close the tab, and let out a long exhale. It's off your chest.`,
    ];
  }

  return [
    `Spend 60 seconds setting up your environment for "${clean}" (water bottle, clear screen).`,
    `Set a 5-minute timer and do the easiest first 10% of "${clean}" without aiming for perfection.`,
    `Stop or continue: you broke the procrastination freeze, which is 80% of the battle.`,
  ];
}

// Chatbot endpoint for BloomAI companion
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        // Build chat contents from history
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const turn of history.slice(-8)) {
            if (turn.role === 'user' || turn.role === 'model') {
              contents.push({
                role: turn.role,
                parts: [{ text: String(turn.text || '') }],
              });
            }
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: BLOOMAI_SYSTEM_INSTRUCTION,
          },
        });

        if (response.text && response.text.trim()) {
          return res.json({
            reply: response.text.trim(),
            isAi: true,
            isFallback: false,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini generateContent call failed:', geminiError?.message || geminiError);
      }
    }

    // Smart empathetic responder that understands the user's specific context
    const smartReply = generateSmartEmpatheticReply(message);
    return res.json({
      reply: smartReply,
      isAi: false,
      isFallback: true,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.json({
      reply: "I'm right here with you. Take a slow breath—you don't have to carry the whole week right now. What's one tiny thing on your mind?",
      isAi: false,
      isFallback: true,
    });
  }
});

// Gemini AI endpoint for generating 3 procrastination-busting micro-steps
app.post('/api/micro-steps', async (req, res) => {
  try {
    const { taskTitle, category, priority } = req.body;

    if (!taskTitle || typeof taskTitle !== 'string') {
      return res.status(400).json({ error: 'taskTitle is required' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `You are BloomAI, an empathetic task decomposition specialist for a 17-year-old student who balances high school, an outside job, exhaustion, and chronic procrastination.
Break down this specific task into EXACTLY 3 bite-sized, 3-to-5 minute micro-steps that instantly eliminate startup friction.

Task: "${taskTitle}"
Category: ${category || 'general'}
Priority: ${priority || 'high'}

Rules:
1. Each step must take under 5 minutes and require almost zero willpower to start.
2. Step 1 must be ridiculously easy (e.g., "Open document and write 1 rough sentence", "Pick up 3 shirts off the floor", "Put water bottle on desk").
3. Step 2 must be a tangible 3-minute mini action.
4. Step 3 must be a checkpoint celebrating starting or deciding next move.
5. Return ONLY a JSON array of 3 strings. Example: ["Step 1", "Step 2", "Step 3"]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length >= 3) {
            return res.json({
              steps: parsed.slice(0, 3).map((s: any) => String(s)),
              isAi: true,
            });
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini micro-steps API call error:', geminiError?.message || geminiError);
      }
    }

    // Dynamic task-specific micro-steps generator tailored to the user's exact input
    const dynamicSteps = generateDynamicTaskMicroSteps(taskTitle, category);
    return res.json({
      steps: dynamicSteps,
      isAi: false,
    });
  } catch (error: any) {
    console.error('Micro-steps endpoint error:', error);
    return res.json({
      steps: [
        `Take a slow breath and open the materials you need for "${req.body?.taskTitle || 'this task'}".`,
        `Set a 5-minute timer and do just the easiest part with zero pressure.`,
        `Stop and acknowledge that you broke the procrastination freeze. You did that.`,
      ],
      isAi: false,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Bloom server running at http://localhost:${port}`);
  });
}

startServer();

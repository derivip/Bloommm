export interface LearningItem {
  id: string;
  title: string;
  category: 'careers' | 'personal' | 'emotional' | 'physical' | 'destress';
  type: 'article' | 'activity' | 'video';
  readTime: string;
  summary: string;
  image?: string;
  content: string[];
  takeaways?: string[];
  videoData?: {
    duration: string;
    instructor: string;
    highlights: string[];
  };
}

export const LEARNING_ITEMS: LearningItem[] = [
  {
    id: 'c1',
    title: 'How to Build a Resume When You Only Have Fast Food or No Experience',
    category: 'careers',
    type: 'article',
    readTime: '4 min read',
    image: '/src/assets/images/career_learning_art_1794323919596.jpg',
    summary: 'Turn shift work, school projects, and everyday reliability into real hiring advantages.',
    content: [
      'Most high school advice tells you to list internships or extracurricular clubs you never had time for because you were working or helping at home. That advice is outdated.',
      'Employers looking at 17-20 year olds care about three core traits above everything: punctuality, ability to handle chaos under pressure, and coachability.',
      'If you worked retail or fast food: you did inventory management, customer de-escalation, cash handling, and multivariable time prioritization during rushes.',
      'Frame your experience quantitatively: "Handled 60+ customer transactions per hour during peak shifts with 99% accuracy" or "Trained 2 new team members on closing procedures."'
    ],
    takeaways: [
      'Focus on reliability and composure under pressure',
      'Translate shift duties into business-impact metrics',
      'Highlight self-taught digital skills (Canva, spreadsheet basics, social media)'
    ]
  },
  {
    id: 'c2',
    title: 'How to Tell Your Boss You Can’t Work During Midterms (Without Panic)',
    category: 'careers',
    type: 'article',
    readTime: '3 min read',
    summary: 'A word-for-word script to ask for adjusted shift hours without feeling guilty or risking your job.',
    content: [
      'It is normal to feel terrified that your manager will cut your hours or fire you if you say no to a shift. But good managers respect advance notice far more than a last-minute call-out.',
      'Give at least 10 to 14 days notice before exam week begins. Managers make schedules ahead of time; springing it on them 24 hours prior causes friction.',
      'The Script: "Hi [Manager Name], I wanted to give you advance notice that my school midterm exams are scheduled from [Date] to [Date]. I want to ensure I stay on top of my grades while maintaining my performance here. Could I trade my Wednesday shift for a Saturday shift, or cap my hours at 12 that week?"',
      'Notice: You are offering solutions (trading shifts or giving a clear cap) rather than just saying "I can\'t come in."'
    ],
    takeaways: [
      'Give 10-14 days advance written notice',
      'Offer a shift trade or Saturday compensation',
      'Keep it professional and solution-oriented'
    ]
  },
  {
    id: 'e1',
    title: 'Why School Guidance Counselors Don’t Understand (And What to Do)',
    category: 'emotional',
    type: 'article',
    readTime: '5 min read',
    image: '/src/assets/images/hero_bloom_ambience_1794323918364.jpg',
    summary: 'Why generic adult advice feels invalidating when you are exhausted from real-world responsibilities.',
    content: [
      'Most school counselors went to school 20+ years ago and operate on a 1990s playbook: join 5 clubs, study 4 hours a night, and take AP classes without worrying about rent, car insurance, or working until 10 PM.',
      'When you tell them you are stressed, they hand you a colored paper planner or tell you to "budget your time better." That does not fix real bone-deep fatigue.',
      'Recognize this: Their inability to understand your reality does NOT mean you are failing. It means their framework is too narrow for your life.',
      'Build your own support network: Seek mentors in your workplace who survived similar grinds, connect with peers who also work, and use tools like Bloom that meet you at midnight.'
    ],
    takeaways: [
      'Stop expecting people who never worked teen night shifts to understand your exhaustion',
      'Acknowledge your grit: balancing a job and high school is serious resilience',
      'Focus on high-leverage minimums: passing grades > burning out for perfection'
    ]
  },
  {
    id: 'e2',
    title: 'Breaking the 11 PM Procrastination Panic Loop',
    category: 'emotional',
    type: 'activity',
    readTime: 'Interactive Exercise',
    image: '/src/assets/images/destress_nature_calm_1794323919050.jpg',
    summary: 'A fast mental reset when you have 3 assignments due tomorrow and your brain is frozen in dread.',
    content: [
      'Procrastination is not laziness. It is a biological threat response. Your brain views the massive stack of unfinished tasks as a predator, so it triggers "freeze" mode (scrolling TikTok or staring at a wall).',
      'To unfreeze your nervous system, you must lower the stakes to near zero.',
      'Step 1: Write down the single easiest thing on your plate. Not the biggest.',
      'Step 2: Commit to only 3 minutes of work. If you still want to stop after 3 minutes, you have full permission to stop.',
      'Step 3: Breathe in for 4 seconds, exhale for 8 seconds to deactivate the adrenaline surge.'
    ],
    takeaways: [
      'Recognize freeze mode as fear, not laziness',
      'Lower the barrier to entry until it feels ridiculous not to do it',
      'Aim for a "B-minus draft" rather than an impossible A-plus masterpiece'
    ]
  },
  {
    id: 'p1',
    title: 'Sleep Optimization When Your Schedule is Completely Erratic',
    category: 'physical',
    type: 'article',
    readTime: '4 min read',
    summary: 'How to recover cognitive energy when you bounce between 7:30 AM first period and late closing shifts.',
    content: [
      'When your sleep schedule varies by 3 to 4 hours between weekdays and weekends, your circadian rhythm gets jetlagged without you ever leaving your bedroom.',
      'Hack 1: The Anchor Wakeup. Try not to let your wakeup time drift more than 90 minutes, even after a late shift.',
      'Hack 2: Sunlight within 15 minutes of waking. Natural photons hitting your retina reset your cortisol clock and help you fall asleep 14 hours later.',
      'Hack 3: The 20-minute Napuccino. If you crash between school and your job, drink a green tea or small coffee and immediately close your eyes for 20 minutes. The caffeine takes 20 minutes to hit your adenosine receptors, waking you right as light sleep ends.'
    ],
    takeaways: [
      'Avoid 3-hour weekend sleep swings',
      'Use morning natural light to lock your circadian clock',
      'Keep midday emergency naps under 25 minutes'
    ]
  },
  {
    id: 'd1',
    title: '4-7-8 Breathing Calming Pacer',
    category: 'destress',
    type: 'activity',
    readTime: '2 min exercise',
    summary: 'A clinically proven autonomic reset that forces your heart rate to slow down within 90 seconds.',
    content: [
      'Inhale quietly through your nose for 4 seconds.',
      'Hold your breath comfortably for 7 seconds.',
      'Exhale slowly and completely through your mouth for 8 seconds.',
      'Repeating this 4 times stimulates the vagus nerve, reducing racing heart and chest tightness.'
    ],
    takeaways: [
      'Activates parasympathetic relaxation system',
      'Immediate physical relief during anxiety spikes',
      'Zero equipment needed'
    ]
  },
  {
    id: 'd2',
    title: '5-4-3-2-1 Sensory Grounding for Dissociation & Overwhelm',
    category: 'destress',
    type: 'activity',
    readTime: '3 min exercise',
    summary: 'Ground yourself back into the present moment when thoughts are spiraling uncontrollably.',
    content: [
      '5 Things you can SEE: Look around your room. Name 5 specific objects with distinct colors.',
      '4 Things you can TOUCH: Feel the texture of your jeans, your desk surface, or a water bottle.',
      '3 Things you can HEAR: Listen for the hum of the fridge, traffic outside, or your own breathing.',
      '2 Things you can SMELL: Notice the scent of your hoodie, soap, or fresh air from a window.',
      '1 Thing you can TASTE: Take a sip of cold water or notice the aftertaste of mint.'
    ],
    takeaways: [
      'Brings nervous system back into physical reality',
      'Interrupts mental panic and racing thoughts',
      'Can be done silently anywhere'
    ]
  },
  {
    id: 'v1',
    title: 'Late-Night Emergency Focus & Brain Uncluttering',
    category: 'personal',
    type: 'video',
    readTime: '6 min watch',
    image: '/src/assets/images/hero_bloom_ambience_1794323918364.jpg',
    summary: 'Visual guide to triaging 5 overdue assignments into a manageable 45-minute sprint.',
    content: [
      'In this interactive breakdown, we walk through how to triage panic when midnight strikes and deadlines loom.',
      'We demonstrate the "Triage Matrix": 1 Must-Do (passes the class), 1 Quick-Win (under 10 minutes), and 1 Deferral (asking teacher for extension with template).'
    ],
    videoData: {
      duration: '6:12',
      instructor: 'Alex Rivera, Youth Resilience Coach',
      highlights: [
        '0:45 - The Freeze Response Explained',
        '2:15 - The 10-Minute Triage Matrix',
        '4:30 - Pre-Written Email Templates to Teachers',
        '5:45 - Permission to Sleep at 1 AM'
      ]
    },
    takeaways: [
      'Turn panic into a written 3-item list',
      'Always secure passing grade minimums first',
      'Draft polite emails before teacher class begins'
    ]
  }
];

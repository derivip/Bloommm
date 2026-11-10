import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles, AlertCircle, RefreshCw, HeartHandshake, Shield } from 'lucide-react';
import { OFFLINE_COMPANION_KNOWLEDGE } from '../bloomEngine.js';

// Reusable Blooming Flower Logo for BloomAI
const BloomFlowerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
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
);

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

export const CompanionTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 'm1',
        role: 'model',
        text: "Hey. It's late, or maybe your schedule has been completely nonstop today. I'm BloomAI—your 24/7 space to vent, figure out what to tackle next, or just talk through work, school, and exhaustion without anyone judging or lecturing you. What's on your mind right now?",
        timestamp: 'Just now',
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      localStorage.setItem('bloom_chat', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  const quickPrompts = [
    "I have a shift in 2 hours and haven't touched my essay.",
    "My guidance counselor told me to 'just buy a planner'. Why don't adults get it?",
    "I'm completely exhausted and can't focus on anything.",
    "How do I ask my boss for fewer hours during exams without getting fired?",
    "I feel like everyone else has their life together and I'm falling behind."
  ];

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }

      const data = await res.json();
      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        role: 'model',
        text: data.reply || OFFLINE_COMPANION_KNOWLEDGE.general,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Using client-side offline fallback for chat:', err);
      // Determine best offline response based on user keywords
      let fallback = OFFLINE_COMPANION_KNOWLEDGE.general;
      const lower = text.toLowerCase();
      if (lower.includes('counselor') || lower.includes('adult') || lower.includes('teacher')) {
        fallback = OFFLINE_COMPANION_KNOWLEDGE.counselor;
      } else if (lower.includes('night') || lower.includes('late') || lower.includes('tomorrow') || lower.includes('sleep')) {
        fallback = OFFLINE_COMPANION_KNOWLEDGE.lateNight;
      } else if (lower.includes('burnout') || lower.includes('tired') || lower.includes('exhausted') || lower.includes('freeze')) {
        fallback = OFFLINE_COMPANION_KNOWLEDGE.burnout;
      }

      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        role: 'model',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm_reset',
        role: 'model',
        text: "Clean slate. I'm still right here whenever you need advice, a sanity check, or a listening ear. What's going on?",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[700px] max-h-[80vh] bg-white/80 dark:bg-neutral-900/65 backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-white/10 shadow-xl overflow-hidden">
      
      {/* Top Companion Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <BloomFlowerIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white font-heading">
                BloomAI
              </h2>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">24/7 Gemini Companion</span>
            </div>
            <p className="text-xs text-neutral-500">
              Safe, non-judgmental guidance for late nights and hard moments
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Clear conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-6 py-2.5 bg-neutral-50/40 dark:bg-neutral-950/40 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-neutral-400 shrink-0 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-500" />
          <span>Quick ask:</span>
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <BloomFlowerIcon className="w-4.5 h-4.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-xs border border-neutral-200/60 dark:border-neutral-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-3xs mt-1.5 flex items-center gap-1.5 ${
                    isUser ? 'text-emerald-100 justify-end' : 'text-neutral-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isFallback && <span>(offline comfort)</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BloomFlowerIcon className="w-4.5 h-4.5" />
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-xs px-4 py-3 text-neutral-500 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Thinking with you...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border-t border-white/20 dark:border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type anything on your mind—no need to filter yourself..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-2xs text-neutral-400 mt-2 px-1">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Encrypted in-session · No judgment, 100% private</span>
          </span>
          <span>Crisis? Text HOME to 741741 or call 988</span>
        </div>
      </div>
    </div>
  );
};

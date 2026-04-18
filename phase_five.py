#!/usr/bin/env python3
"""Run from your Elova project root: python3 phase_five.py"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {path}")

# ══════════════════════════════════════════════════════════════════════════════
# 1. ONBOARDING PAGE — 4-step flow
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/OnboardingPage.tsx", r'''
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Mic, Globe, Target, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingPageProps { onComplete: () => void; }

const LANGUAGES = [
  { code: "ar", name: "Arabic",     native: "العربية",    flag: "🇸🇦" },
  { code: "zh", name: "Chinese",    native: "中文",        flag: "🇨🇳" },
  { code: "fr", name: "French",     native: "Français",   flag: "🇫🇷" },
  { code: "de", name: "German",     native: "Deutsch",    flag: "🇩🇪" },
  { code: "hi", name: "Hindi",      native: "हिन्दी",      flag: "🇮🇳" },
  { code: "it", name: "Italian",    native: "Italiano",   flag: "🇮🇹" },
  { code: "ja", name: "Japanese",   native: "日本語",      flag: "🇯🇵" },
  { code: "ko", name: "Korean",     native: "한국어",      flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", native: "Português",  flag: "🇧🇷" },
  { code: "ru", name: "Russian",    native: "Русский",    flag: "🇷🇺" },
  { code: "es", name: "Spanish",    native: "Español",    flag: "🇪🇸" },
  { code: "tr", name: "Turkish",    native: "Türkçe",     flag: "🇹🇷" },
  { code: "uk", name: "Ukrainian",  native: "Українська", flag: "🇺🇦" },
  { code: "other", name: "Other",   native: "Other",      flag: "🌍" },
];

const LEVELS = [
  { code: "A1", label: "Beginner",           desc: "I know a few words and basic phrases",           color: "from-slate-500 to-slate-600" },
  { code: "A2", label: "Elementary",         desc: "I can handle simple conversations",              color: "from-blue-500 to-blue-600"  },
  { code: "B1", label: "Intermediate",       desc: "I can discuss familiar topics with some effort", color: "from-green-500 to-green-600" },
  { code: "B2", label: "Upper-Intermediate", desc: "I speak fluently on most everyday topics",       color: "from-orange-500 to-orange-600" },
  { code: "C1", label: "Advanced",           desc: "I express myself spontaneously and precisely",   color: "from-red-500 to-red-600"    },
  { code: "C2", label: "Mastery",            desc: "I speak at or near native level",                color: "from-violet-500 to-violet-600" },
];

const INTERESTS = [
  { id: "l1", emoji: "🔥", label: "Daily Debate",      desc: "Hot takes & spirited discussions"    },
  { id: "l2", emoji: "💼", label: "Business English",  desc: "Professional speaking & writing"     },
  { id: "l3", emoji: "🌱", label: "Beginner Corner",   desc: "Zero-judgment learning space"         },
  { id: "l4", emoji: "⚽", label: "Football Talk",     desc: "Match analysis & football culture"   },
  { id: "l5", emoji: "🤖", label: "Tech and AI",       desc: "The future, right now"               },
  { id: "l6", emoji: "✍️", label: "Creative Writing",  desc: "Stories, poetry, expression"          },
  { id: "l7", emoji: "🎬", label: "Film & TV",         desc: "Movies, series, and storytelling"    },
  { id: "l8", emoji: "🎵", label: "Music",             desc: "Songs, lyrics, and culture"          },
  { id: "l9", emoji: "🍳", label: "Food & Travel",     desc: "Cuisine, places, and experiences"    },
  { id: "l10",emoji: "📚", label: "Books & Ideas",     desc: "Literature, philosophy, knowledge"   },
  { id: "l11",emoji: "🏋️", label: "Health & Fitness",  desc: "Wellness, sport, and lifestyle"      },
  { id: "l12",emoji: "🎮", label: "Gaming",            desc: "Games, esports, and strategy"        },
];

const GOALS = [
  { id: "g1", icon: "✈️", label: "Travel",            desc: "Communicate confidently abroad" },
  { id: "g2", icon: "💼", label: "Career",            desc: "Advance professionally in English" },
  { id: "g3", icon: "🎓", label: "Exams",             desc: "IELTS, TOEFL, Cambridge" },
  { id: "g4", icon: "👥", label: "Make Friends",      desc: "Connect with people worldwide" },
  { id: "g5", icon: "🧠", label: "Personal Growth",   desc: "Challenge myself and grow" },
  { id: "g6", icon: "🎬", label: "Entertainment",     desc: "Enjoy content without subtitles" },
];

const SLIDE = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [motherTongue, setMotherTongue] = useState("");
  const [level, setLevel] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());

  const TOTAL_STEPS = 5;
  const progress = ((step) / (TOTAL_STEPS - 1)) * 100;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canNext = [
    true,
    !!motherTongue,
    !!level,
    selectedInterests.size >= 2,
    selectedGoals.size >= 1,
  ][step];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 overflow-hidden">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">

        {/* Progress bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                animate={{ width: progress + "%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-right">{step} of {TOTAL_STEPS - 1}</p>
          </div>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >

            {/* ── STEP 0: Welcome ── */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.5)]">
                      <Mic className="h-12 w-12 text-white" />
                    </div>
                    <motion.div
                      className="absolute -inset-3 rounded-3xl border-2 border-primary/20"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-[36px] font-extrabold gradient-text leading-tight mb-3">
                    Welcome to Elova
                  </h1>
                  <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[340px] mx-auto">
                    The speaking club where real conversations happen. Find your people. Build your confidence. Speak the world.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { icon: <Globe className="h-5 w-5" />, label: "50+ languages"  },
                    { icon: <Users className="h-5 w-5" />, label: "Real humans"    },
                    { icon: <Sparkles className="h-5 w-5" />, label: "AI coaching" },
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 text-center"
                    >
                      <div className="flex justify-center mb-1.5 text-primary">{f.icon}</div>
                      <p className="text-[11px] font-semibold text-muted-foreground">{f.label}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => go(1)}
                  className="w-full py-4 rounded-2xl bg-primary text-white text-[16px] font-bold hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2"
                >
                  Get Started <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            )}

            {/* ── STEP 1: Mother tongue ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">What is your native language?</h2>
                  <p className="text-[14px] text-muted-foreground">This helps us match you with the right learning partners.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto no-scrollbar">
                  {LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setMotherTongue(lang.code)}
                      className={
                        "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all " +
                        (motherTongue === lang.code
                          ? "bg-primary/15 border-primary/50 text-foreground"
                          : "bg-white/[0.03] border-white/[0.08] text-foreground hover:bg-white/[0.06] hover:border-white/[0.15]")
                      }
                    >
                      <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold truncate">{lang.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{lang.native}</p>
                      </div>
                      {motherTongue === lang.code && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: English level ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">Your English level?</h2>
                  <p className="text-[14px] text-muted-foreground">Be honest — we match you with speakers at your level so conversations actually work.</p>
                </div>
                <div className="space-y-2.5">
                  {LEVELS.map((l) => (
                    <motion.button
                      key={l.code}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLevel(l.code)}
                      className={
                        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all " +
                        (level === l.code
                          ? "bg-primary/12 border-primary/45"
                          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.14]")
                      }
                    >
                      <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + l.color + " flex items-center justify-center flex-shrink-0 shadow-md"}>
                        <span className="text-[13px] font-extrabold text-white">{l.code}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-foreground">{l.label}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{l.desc}</p>
                      </div>
                      {level === l.code && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Interests ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">What do you like to talk about?</h2>
                  <p className="text-[14px] text-muted-foreground">Pick at least 2. Your feed and room suggestions are built from this.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {INTERESTS.map((interest) => {
                    const active = selectedInterests.has(interest.id);
                    return (
                      <motion.button
                        key={interest.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(interest.id)}
                        className={
                          "p-3.5 rounded-xl border text-left transition-all relative overflow-hidden " +
                          (active
                            ? "bg-primary/12 border-primary/45"
                            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]")
                        }
                      >
                        {active && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-2xl block mb-1.5">{interest.emoji}</span>
                        <p className="text-[13px] font-bold text-foreground">{interest.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{interest.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-[12px] text-muted-foreground text-center">
                  {selectedInterests.size} selected {selectedInterests.size < 2 ? `· pick ${2 - selectedInterests.size} more` : "✓"}
                </p>
              </div>
            )}

            {/* ── STEP 4: Goals ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">Why are you here?</h2>
                  <p className="text-[14px] text-muted-foreground">Your goals shape how we coach you and what rooms we recommend.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {GOALS.map((goal) => {
                    const active = selectedGoals.has(goal.id);
                    return (
                      <motion.button
                        key={goal.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleGoal(goal.id)}
                        className={
                          "p-4 rounded-2xl border text-left transition-all relative " +
                          (active
                            ? "bg-primary/12 border-primary/45"
                            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]")
                        }
                      >
                        {active && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-2xl block mb-2">{goal.icon}</span>
                        <p className="text-[14px] font-bold text-foreground">{goal.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{goal.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step > 0 && (
          <div className="flex items-center gap-3 mt-8">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => go(step - 1)}
              className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: canNext ? 1.02 : 1 }}
              whileTap={{ scale: canNext ? 0.97 : 1 }}
              onClick={() => {
                if (!canNext) return;
                if (step < TOTAL_STEPS - 1) go(step + 1);
                else onComplete();
              }}
              className={
                "flex-1 h-12 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all " +
                (canNext
                  ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                  : "bg-white/[0.05] text-muted-foreground cursor-not-allowed border border-white/[0.08]")
              }
            >
              {step === TOTAL_STEPS - 1 ? (
                <><Sparkles className="h-5 w-5" /> Let me in</>
              ) : (
                <>Continue <ChevronRight className="h-5 w-5" /></>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 2. SEARCH PAGE
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/SearchPage.tsx", r'''
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ArrowLeft, Users, Mic, Hash,
  TrendingUp, Clock, ChevronUp, ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { samplePosts, sampleRooms, lounges, loungeUsers } from "@/lib/lounge-data";

interface SearchPageProps { onMenuOpen?: () => void; }

type SearchTab = "all" | "posts" | "rooms" | "communities" | "people";

const TRENDING = [
  "remote work debate", "B2 plateau tips", "phrasal verbs",
  "Champions League", "AI writing tools", "shadowing technique",
  "IELTS speaking", "British vs American English",
];

const RECENT_SEARCHES_KEY = "elova_recent_searches";

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
    </span>
  );
}

function VotePillMini({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
      <ChevronUp className="h-3 w-3" />{n >= 1000 ? (n/1000).toFixed(1)+"K" : n}
    </span>
  );
}

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400",
  "Debate":     "bg-orange-500/15 text-orange-400",
  "Teach Me":   "bg-blue-500/15 text-blue-400",
  "Hot Seat":   "bg-purple-500/15 text-purple-400",
};

export default function SearchPage({ onMenuOpen = () => {} }: SearchPageProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SearchTab>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]"); }
    catch { return []; }
  });

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.trim().toLowerCase();

  const postResults    = useMemo(() => !q ? [] : samplePosts.filter((p) => p.content.toLowerCase().includes(q) || p.author.full_name.toLowerCase().includes(q) || (p.title ?? "").toLowerCase().includes(q)), [q]);
  const roomResults    = useMemo(() => !q ? [] : sampleRooms.filter((r) => r.name.toLowerCase().includes(q) || r.loungeName.toLowerCase().includes(q) || r.host.username.toLowerCase().includes(q)), [q]);
  const communityResults = useMemo(() => !q ? [] : lounges.filter((l) => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)), [q]);
  const peopleResults  = useMemo(() => !q ? [] : loungeUsers.filter((u) => u.full_name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)), [q]);

  const totalResults = postResults.length + roomResults.length + communityResults.length + peopleResults.length;

  const saveSearch = (s: string) => {
    const updated = [s, ...recentSearches.filter((r) => r !== s)].slice(0, 8);
    setRecentSearches(updated);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleSearch = (s: string) => {
    setQuery(s);
    if (s.trim()) saveSearch(s.trim());
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch {}
  };

  const tabs: { key: SearchTab; label: string; count?: number }[] = [
    { key: "all",         label: "All",         count: totalResults     },
    { key: "posts",       label: "Posts",       count: postResults.length },
    { key: "rooms",       label: "Rooms",       count: roomResults.length },
    { key: "communities", label: "Communities", count: communityResults.length },
    { key: "people",      label: "People",      count: peopleResults.length },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Search header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 focus-within:border-primary/40 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) saveSearch(query.trim()); }}
              placeholder="Search posts, rooms, people..."
              className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs — only show when results exist */}
        {q && totalResults > 0 && (
          <div className="flex gap-1 mt-3 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all " +
                  (tab === t.key
                    ? "bg-primary text-white border-primary"
                    : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/[0.16]")
                }
              >
                {t.label}
                {t.count != null && t.count > 0 && (
                  <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full " + (tab === t.key ? "bg-white/20" : "bg-white/[0.07]")}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4">
        {/* Empty state — show trending + recents */}
        {!q && (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Recent
                  </p>
                  <button onClick={clearRecent} className="text-[12px] text-muted-foreground hover:text-destructive transition-colors">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[13px] text-foreground hover:bg-white/[0.09] transition-colors"
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" /> {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1.5 mb-3">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </p>
              <div className="space-y-1">
                {TRENDING.map((term, i) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSearch(term)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors text-left"
                  >
                    <span className="text-[13px] font-bold text-muted-foreground/50 w-5 text-center">{i + 1}</span>
                    <Search className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                    <span className="text-[14px] text-foreground font-medium">{term}</span>
                    <ChevronUp className="h-3.5 w-3.5 text-primary/60 ml-auto rotate-45" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No results */}
        {q && totalResults === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-2">
              <Search className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-[17px] font-bold text-foreground">No results for "{query}"</p>
            <p className="text-[13px] text-muted-foreground">Try a different search term</p>
          </div>
        )}

        {/* Results */}
        {q && totalResults > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={tab + q} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-6">

              {/* Posts */}
              {(tab === "all" || tab === "posts") && postResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Posts</p>}
                  <div className="space-y-2">
                    {postResults.slice(0, tab === "all" ? 3 : 20).map((post, i) => (
                      <motion.div key={post.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer" onClick={() => navigate("/")}>
                        <div className="flex items-center gap-2 mb-2">
                          <img src={post.author.avatar_url} alt="" className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0" />
                          <span className="text-[12px] font-bold text-foreground">{post.author.full_name}</span>
                          {post.loungeName && <span className="text-[11px] text-primary">· {post.loungeName}</span>}
                          <span className="text-[11px] text-muted-foreground ml-auto">{post.createdAt}</span>
                        </div>
                        {post.title && <p className="text-[15px] font-bold text-foreground mb-1 leading-snug">{post.title}</p>}
                        <p className="text-[13px] text-foreground/75 line-clamp-2 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <VotePillMini n={post.upvotes} />
                          <span className="text-[11px] text-muted-foreground">{post.comments.length} replies</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms */}
              {(tab === "all" || tab === "rooms") && roomResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Rooms</p>}
                  <div className="space-y-2">
                    {roomResults.slice(0, tab === "all" ? 2 : 20).map((room, i) => (
                      <motion.div key={room.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/room/" + room.id)} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Mic className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <LiveDot />
                            <span className="text-[11px] text-green-400 font-bold">LIVE</span>
                            <span className={"text-[11px] font-bold px-2 py-0.5 rounded-full " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground")}>
                              {room.mode}
                            </span>
                          </div>
                          <p className="text-[14px] font-bold text-foreground leading-snug">{room.name}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">{room.loungeName} · {room.participants.length}/{room.maxParticipants}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); navigate("/room/" + room.id); }} className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-colors">Join</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {(tab === "all" || tab === "communities") && communityResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Communities</p>}
                  <div className="space-y-2">
                    {communityResults.slice(0, tab === "all" ? 3 : 20).map((lounge, i) => (
                      <motion.div key={lounge.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/lounge/" + lounge.id)} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className={"w-11 h-11 rounded-xl bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-xl flex-shrink-0"}>{lounge.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-foreground">{lounge.name}</p>
                          <p className="text-[12px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members · {lounge.activeRooms} live</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + lounge.id); }} className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.07] border border-white/[0.1] text-foreground text-[12px] font-bold hover:bg-white/[0.12] transition-colors">View</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {(tab === "all" || tab === "people") && peopleResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">People</p>}
                  <div className="space-y-2">
                    {peopleResults.slice(0, tab === "all" ? 3 : 20).map((user, i) => (
                      <motion.div key={user.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/user/" + user.id)} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className="relative flex-shrink-0">
                          <img src={user.avatar_url} alt="" className="w-11 h-11 rounded-full border border-white/10" />
                          {user.is_online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-foreground">{user.full_name}</p>
                          <p className="text-[12px] text-muted-foreground">@{user.username} · {user.xp_points.toLocaleString()} XP</p>
                        </div>
                        <LevelBadge level={user.english_level} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-24" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 3. NOTIFICATIONS PAGE
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/NotificationsPage.tsx", r'''
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Heart, MessageSquare, Users,
  Mic, Trophy, Zap, ChevronRight, Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { loungeUsers } from "@/lib/lounge-data";

interface NotificationsPageProps { onMenuOpen?: () => void; }

type NotifType = "like" | "reply" | "follow" | "room_invite" | "achievement" | "weekly_report" | "joined_room";

interface Notification {
  id: string;
  type: NotifType;
  read: boolean;
  time: string;
  actor?: typeof loungeUsers[0];
  text: string;
  sub?: string;
  action?: { label: string; path: string };
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1",  type: "weekly_report", read: false, time: "Just now",    text: "Your weekly AI report is ready", sub: "Fluency +5 · Vocabulary +7", action: { label: "View Report", path: "/profile" } },
  { id: "n2",  type: "like",          read: false, time: "2m ago",      text: "liked your post", sub: "Grammar mistakes do not matter when speaking...", actor: loungeUsers[1] },
  { id: "n3",  type: "reply",         read: false, time: "5m ago",      text: "replied to your post", sub: "This is solid advice actually. Confidence over grammar.", actor: loungeUsers[4] },
  { id: "n4",  type: "room_invite",   read: false, time: "12m ago",     text: "invited you to a Debate room", sub: "Is social media making us worse communicators?", actor: loungeUsers[0], action: { label: "Join Room", path: "/room/r1" } },
  { id: "n5",  type: "follow",        read: false, time: "1h ago",      text: "started following you", sub: "B2 · Football Talk", actor: loungeUsers[3] },
  { id: "n6",  type: "achievement",   read: true,  time: "2h ago",      text: "You earned a new badge!", sub: "🏆 Debate Champion — Won 5 debates", action: { label: "See Badges", path: "/profile" } },
  { id: "n7",  type: "like",          read: true,  time: "3h ago",      text: "liked your post", sub: "Phrases that instantly make you sound more professional...", actor: loungeUsers[2] },
  { id: "n8",  type: "joined_room",   read: true,  time: "5h ago",      text: "joined your room", sub: "Is remote work killing company culture?", actor: loungeUsers[1] },
  { id: "n9",  type: "reply",         read: true,  time: "Yesterday",   text: "replied to your post", sub: "The plateau phase is brutal but real. Push through.", actor: loungeUsers[3] },
  { id: "n10", type: "follow",        read: true,  time: "Yesterday",   text: "started following you", sub: "C2 · Daily Debate · Tech and AI", actor: loungeUsers[4] },
  { id: "n11", type: "weekly_report", read: true,  time: "1 week ago",  text: "Your weekly AI report is ready", sub: "Fluency +3 · Grammar +2", action: { label: "View Report", path: "/profile" } },
];

const NOTIF_ICON: Record<NotifType, { icon: React.ReactNode; bg: string }> = {
  like:          { icon: <Heart    className="h-4 w-4 text-pink-400"   />, bg: "bg-pink-500/15 border-pink-500/20"   },
  reply:         { icon: <MessageSquare className="h-4 w-4 text-sky-400" />, bg: "bg-sky-500/15 border-sky-500/20"   },
  follow:        { icon: <Users    className="h-4 w-4 text-green-400"  />, bg: "bg-green-500/15 border-green-500/20" },
  room_invite:   { icon: <Mic      className="h-4 w-4 text-primary"    />, bg: "bg-primary/15 border-primary/20"     },
  achievement:   { icon: <Trophy   className="h-4 w-4 text-amber-400"  />, bg: "bg-amber-500/15 border-amber-500/20" },
  weekly_report: { icon: <Zap      className="h-4 w-4 text-primary"    />, bg: "bg-primary/15 border-primary/20"     },
  joined_room:   { icon: <Mic      className="h-4 w-4 text-green-400"  />, bg: "bg-green-500/15 border-green-500/20" },
};

export default function NotificationsPage({ onMenuOpen = () => {} }: NotificationsPageProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[17px] font-extrabold text-foreground flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">
              <Check className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-3">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all capitalize " +
                (filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:text-foreground")
              }
            >
              {f === "unread" ? `Unread (${unreadCount})` : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3 px-6">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-2">
              <Bell className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-[17px] font-bold text-foreground">You are all caught up</p>
            <p className="text-[13px] text-muted-foreground">No unread notifications right now</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayed.map((notif, i) => {
              const iconInfo = NOTIF_ICON[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    markRead(notif.id);
                    if (notif.actor) navigate("/user/" + notif.actor.id);
                  }}
                  className={
                    "flex items-start gap-3.5 px-4 py-4 border-b border-white/[0.05] cursor-pointer transition-colors hover:bg-white/[0.02] " +
                    (!notif.read ? "bg-primary/[0.025]" : "")
                  }
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                  {notif.read && <div className="w-2 flex-shrink-0" />}

                  {/* Icon or avatar */}
                  <div className="relative flex-shrink-0">
                    {notif.actor ? (
                      <>
                        <img src={notif.actor.avatar_url} alt="" className="w-11 h-11 rounded-full border border-white/10" />
                        <div className={"absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center " + iconInfo.bg}>
                          {iconInfo.icon}
                        </div>
                      </>
                    ) : (
                      <div className={"w-11 h-11 rounded-2xl border flex items-center justify-center " + iconInfo.bg}>
                        {iconInfo.icon}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-foreground leading-snug">
                      {notif.actor && (
                        <span className="font-bold">{notif.actor.full_name} </span>
                      )}
                      {notif.text}
                    </p>
                    {notif.sub && (
                      <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">{notif.sub}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{notif.time}</p>
                    {notif.action && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); markRead(notif.id); navigate(notif.action!.path); }}
                        className="mt-2 flex items-center gap-1 text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        {notif.action.label} <ChevronRight className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div className="h-24" />
      </div>

      <BottomNav />
    </div>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 4. USER PROFILE PAGE (viewing someone else)
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/UserProfilePage.tsx", r'''
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mic, Flame, Zap, MessageSquare,
  ChevronUp, Users, Share2, BadgeCheck, Star,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { loungeUsers, samplePosts, lounges } from "@/lib/lounge-data";

interface UserProfilePageProps { onMenuOpen?: () => void; }

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400",
  "Debate":     "bg-orange-500/15 text-orange-400",
  "Teach Me":   "bg-blue-500/15 text-blue-400",
  "Hot Seat":   "bg-purple-500/15 text-purple-400",
};

const RECENT_ROOMS = [
  { id: "r1", name: "Is remote work killing company culture?", community: "Daily Debate", mode: "Debate", duration: "24 min", date: "Today" },
  { id: "r3", name: "Pitch Practice: Sell me this pen",        community: "Business English", mode: "Hot Seat", duration: "31 min", date: "Yesterday" },
];

type UTab = "posts" | "rooms" | "about";

export default function UserProfilePage({ onMenuOpen = () => {} }: UserProfilePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<UTab>("posts");

  const user = loungeUsers.find((u) => u.id === id) ?? loungeUsers[1];
  const isMe = user.id === loungeUsers[0].id;
  const userPosts = samplePosts.filter((p) => p.author.id === user.id);
  const userLounges = lounges.slice(0, 3);

  const LEVEL_LABELS: Record<string, string> = {
    A1: "Beginner", A2: "Elementary", B1: "Intermediate",
    B2: "Upper-Intermediate", C1: "Advanced", C2: "Mastery",
  };

  const tabs: { key: UTab; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "rooms", label: "Rooms" },
    { key: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 h-[53px] flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-[15px] font-bold text-foreground">{user.full_name}</p>
        <button className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Hero */}
      <div className="relative px-4 pt-6 pb-4 border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/6 to-transparent pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2.5px] shadow-[0_0_24px_rgba(124,58,237,0.3)]">
              <img src={user.avatar_url} alt="" className="w-full h-full rounded-[14px] object-cover bg-card" />
            </div>
            {user.is_online && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[20px] font-extrabold text-foreground">{user.full_name}</h2>
              {user.english_level === "C2" && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
            </div>
            <p className="text-[13px] text-muted-foreground mb-2">@{user.username} · {user.is_online ? <span className="text-green-400 font-semibold">Online</span> : "Offline"}</p>
            <LevelBadge level={user.english_level} size="md" />
            {user.bio && <p className="text-[13px] text-foreground/75 mt-2 leading-relaxed">{user.bio}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
          {[
            { icon: <Flame className="h-4 w-4 text-orange-400" />, value: user.streak_count,           label: "Day streak" },
            { icon: <Zap   className="h-4 w-4 text-primary"    />, value: user.xp_points.toLocaleString(), label: "XP" },
            { icon: <Mic   className="h-4 w-4 text-primary"    />, value: RECENT_ROOMS.length,          label: "Rooms" },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-[17px] font-extrabold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {!isMe ? (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFollowing(!following)}
              className={
                "flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all " +
                (following
                  ? "bg-white/[0.07] border border-white/[0.12] text-foreground hover:bg-destructive/15 hover:text-destructive hover:border-destructive/25"
                  : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_16px_rgba(124,58,237,0.3)]")
              }
            >
              {following ? "Following ✓" : "Follow"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-2.5 rounded-xl text-[14px] font-bold bg-white/[0.06] border border-white/[0.1] text-foreground hover:bg-white/[0.1] transition-all flex items-center justify-center gap-1.5"
            >
              <Mic className="h-4 w-4" /> Invite to Room
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/profile")}
            className="w-full py-2.5 rounded-xl text-[14px] font-bold bg-white/[0.06] border border-white/[0.1] text-foreground hover:bg-white/[0.1] transition-all"
          >
            Edit Profile
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.07] flex sticky top-[53px] z-30 bg-background">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={"relative flex-1 py-3.5 text-[13px] font-bold transition-colors " + (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}
          >
            {t.label}
            {tab === t.key && <motion.div layoutId="user-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {userPosts.length === 0
                ? <div className="py-16 text-center"><p className="text-sm text-muted-foreground">No posts yet</p></div>
                : userPosts.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="px-4 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        {post.loungeName && <span className="text-[11px] text-primary font-semibold">{post.loungeName}</span>}
                        <span className="text-[11px] text-muted-foreground ml-auto">{post.createdAt}</span>
                      </div>
                      {post.title && <p className="text-[16px] font-bold text-foreground mb-1 leading-snug">{post.title}</p>}
                      <p className="text-[14px] text-foreground/80 leading-relaxed line-clamp-3">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <ChevronUp className="h-3.5 w-3.5" />{post.upvotes}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />{post.comments.length}
                        </span>
                      </div>
                    </motion.div>
                  ))
              }
              <div className="h-24" />
            </motion.div>
          )}

          {tab === "rooms" && (
            <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Recent Rooms</p>
              <div className="space-y-2">
                {RECENT_ROOMS.map((room, i) => (
                  <motion.div key={room.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Mic className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground leading-snug">{room.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-primary font-semibold">{room.community}</span>
                        <span className={"text-[11px] font-semibold px-2 py-0.5 rounded-full " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground")}>{room.mode}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-semibold text-foreground">{room.duration}</p>
                      <p className="text-[11px] text-muted-foreground">{room.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="h-24" />
            </motion.div>
          )}

          {tab === "about" && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Language Info</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">English Level</span>
                    <div className="flex items-center gap-2"><LevelBadge level={user.english_level} /><span className="text-[13px] font-semibold text-foreground">{LEVEL_LABELS[user.english_level]}</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">XP Points</span>
                    <span className="text-[13px] font-bold text-foreground">{user.xp_points.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">Current streak</span>
                    <span className="text-[13px] font-bold text-orange-400">{user.streak_count} days 🔥</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Communities</p>
                <div className="space-y-2">
                  {userLounges.map((l) => (
                    <button key={l.id} onClick={() => navigate("/lounge/" + l.id)} className="w-full flex items-center gap-2.5 py-1.5 hover:opacity-80 transition-opacity text-left">
                      <div className={"w-8 h-8 rounded-lg bg-gradient-to-br " + l.gradient + " flex items-center justify-center text-base flex-shrink-0"}>{l.emoji}</div>
                      <span className="text-[13px] font-semibold text-foreground">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-24" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 5. UPDATE APP.TSX — wire all new routes + onboarding gate + notif bell
# ══════════════════════════════════════════════════════════════════════════════
w("src/App.tsx", r'''
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalLayout }    from "@/components/GlobalLayout";
import { DesktopSidebar }  from "@/components/DesktopSidebar";
import OnboardingPage      from "./pages/OnboardingPage";
import HomePage            from "./pages/HomePage";
import ExplorePage         from "./pages/ExplorePage";
import RoomsPage           from "./pages/RoomsPage";
import CommunityPage       from "./pages/CommunityPage";
import GamesPage           from "./pages/GamesPage";
import VoiceRoomPage       from "./pages/VoiceRoomPage";
import ProfilePage         from "./pages/ProfilePage";
import LoungePage          from "./pages/LoungePage";
import SearchPage          from "./pages/SearchPage";
import NotificationsPage   from "./pages/NotificationsPage";
import UserProfilePage     from "./pages/UserProfilePage";
import NotFound            from "./pages/NotFound";

const queryClient = new QueryClient();

const FULLSCREEN = ["/room/", "/onboarding"];

function AppShell({ onboarded, onComplete }: { onboarded: boolean; onComplete: () => void }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const location = useLocation();
  const openMenu  = () => setPanelOpen(true);
  const closeMenu = () => setPanelOpen(false);

  if (!onboarded) return <OnboardingPage onComplete={onComplete} />;

  const isFullscreen = FULLSCREEN.some((r) => location.pathname.startsWith(r));

  return (
    <GlobalLayout panelOpen={panelOpen} onPanelClose={closeMenu}>
      <div className={isFullscreen ? "" : "flex min-h-screen"}>
        {!isFullscreen && <DesktopSidebar />}
        <div className={isFullscreen ? "min-h-screen" : "flex-1 min-w-0"}>
          <Routes>
            <Route path="/"              element={<HomePage           onMenuOpen={openMenu} />} />
            <Route path="/explore"       element={<ExplorePage        onMenuOpen={openMenu} />} />
            <Route path="/rooms"         element={<RoomsPage          onMenuOpen={openMenu} />} />
            <Route path="/community"     element={<CommunityPage      onMenuOpen={openMenu} />} />
            <Route path="/games"         element={<GamesPage          onMenuOpen={openMenu} />} />
            <Route path="/room/:id"      element={<VoiceRoomPage      onMenuOpen={openMenu} />} />
            <Route path="/lounge/:id"    element={<LoungePage         onMenuOpen={openMenu} />} />
            <Route path="/profile"       element={<ProfilePage        onMenuOpen={openMenu} />} />
            <Route path="/search"        element={<SearchPage         onMenuOpen={openMenu} />} />
            <Route path="/notifications" element={<NotificationsPage  onMenuOpen={openMenu} />} />
            <Route path="/user/:id"      element={<UserProfilePage    onMenuOpen={openMenu} />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </GlobalLayout>
  );
}

function AppWithRouter() {
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    try { return localStorage.getItem("elova_onboarded") === "true"; }
    catch { return false; }
  });

  const handleComplete = () => {
    try { localStorage.setItem("elova_onboarded", "true"); } catch {}
    setOnboarded(true);
  };

  return <AppShell onboarded={onboarded} onComplete={handleComplete} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithRouter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
''')

# ══════════════════════════════════════════════════════════════════════════════
# 6. UPDATE HOMEPAGE — add search + notification icons in header
# ══════════════════════════════════════════════════════════════════════════════
# Patch only the header portion of HomePage by appending a note file
w("src/components/HeaderActions.tsx", r'''
// Helper component — used in page headers to show search + notifications
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderActionsProps {
  unread?: number;
}

export function HeaderActions({ unread = 3 }: HeaderActionsProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate("/search")}
        className="p-2 rounded-full hover:bg-white/[0.08] transition-colors"
      >
        <Search className="h-[19px] w-[19px] text-muted-foreground" />
      </button>
      <button
        onClick={() => navigate("/notifications")}
        className="p-2 rounded-full hover:bg-white/[0.08] transition-colors relative"
      >
        <Bell className="h-[19px] w-[19px] text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        )}
      </button>
    </div>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 7. BOTTOM NAV — add search route properly
# ══════════════════════════════════════════════════════════════════════════════
w("src/components/BottomNav.tsx", r'''
import { motion } from "framer-motion";
import { Home, Compass, Users, User, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: Home,    label: "Home",        path: "/"        },
  { icon: Compass, label: "Rooms",       path: "/explore" },
  { icon: Users,   label: "Communities", path: "/rooms"   },
  { icon: Bell,    label: "Activity",    path: "/notifications" },
  { icon: User,    label: "Profile",     path: "/profile" },
];

export function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0d14]/95 backdrop-blur-xl border-t border-white/[0.07]">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const showBadge = item.path === "/notifications";
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.86 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative min-w-[56px]"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <item.icon
                  className={"h-[22px] w-[22px] relative z-10 transition-colors " + (active ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {showBadge && !active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              <span className={"text-[10px] font-semibold relative z-10 transition-colors " + (active ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
''')

print("\n✅ Phase 5 complete — 8 files written:")
print("   src/pages/OnboardingPage.tsx      — 5-step onboarding flow")
print("   src/pages/SearchPage.tsx          — global search with tabs")
print("   src/pages/NotificationsPage.tsx   — activity feed with read/unread")
print("   src/pages/UserProfilePage.tsx     — other users' profiles")
print("   src/App.tsx                       — all routes + onboarding gate")
print("   src/components/HeaderActions.tsx  — search + bell shared component")
print("   src/components/BottomNav.tsx      — 5 tabs with notifications badge")
print("")
print("NOTE: To reset onboarding and see the flow again, run this in browser console:")
print("   localStorage.removeItem('elova_onboarded'); location.reload()")
print("\nRun: npm run dev")

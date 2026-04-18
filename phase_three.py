#!/usr/bin/env python3
"""Run from your Elova project root: python3 phase_three.py"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {path}")

# ══════════════════════════════════════════════════════════════════════════════
# 1. PROFILE PAGE
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/ProfilePage.tsx", r'''
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Flame, Zap, Mic, MessageSquare, Trophy,
  TrendingUp, Star, Calendar, ChevronRight, Settings,
  BadgeCheck, Menu, Lock, Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { loungeUsers, lounges, samplePosts, sampleRooms } from "@/lib/lounge-data";

interface ProfilePageProps { onMenuOpen?: () => void; }

const currentUser = loungeUsers[0];

const LEVEL_ORDER = ["A1","A2","B1","B2","C1","C2"];
const LEVEL_LABELS: Record<string, string> = {
  A1: "Beginner", A2: "Elementary", B1: "Intermediate",
  B2: "Upper-Intermediate", C1: "Advanced", C2: "Mastery",
};
const LEVEL_XP: Record<string, number> = {
  A1: 0, A2: 500, B1: 1500, B2: 3000, C1: 5000, C2: 8000,
};
const NEXT_LEVEL: Record<string, string | null> = {
  A1: "A2", A2: "B1", B1: "B2", B2: "C1", C1: "C2", C2: null,
};

const ACHIEVEMENTS = [
  { id: "a1", icon: "🎙️", label: "First Room",      desc: "Joined your first voice room",          earned: true  },
  { id: "a2", icon: "🔥", label: "7-Day Streak",    desc: "Spoke 7 days in a row",                  earned: true  },
  { id: "a3", icon: "🏆", label: "Debate Champion", desc: "Won 5 debates",                          earned: true  },
  { id: "a4", icon: "👥", label: "Community Pillar", desc: "Joined 3 communities",                  earned: true  },
  { id: "a5", icon: "⭐", label: "Top Speaker",      desc: "Reached top 10 in a community",         earned: false },
  { id: "a6", icon: "🎓", label: "C2 Master",        desc: "Reached C2 level",                      earned: false },
  { id: "a7", icon: "💎", label: "30-Day Streak",    desc: "Spoke 30 days in a row",                earned: false },
  { id: "a8", icon: "🌍", label: "Global Citizen",   desc: "Spoke with people from 10 countries",   earned: false },
];

// Mock weekly assessment data
const WEEKLY_ASSESSMENT = {
  week: "April 7 – 13",
  overallScore: 78,
  categories: [
    { label: "Vocabulary Range",   score: 82, prev: 75, tip: "You introduced 14 new words this week. Keep using them in context." },
    { label: "Grammar Accuracy",   score: 71, prev: 68, tip: "Watch your use of past perfect. It appeared incorrectly 6 times." },
    { label: "Fluency",            score: 85, prev: 80, tip: "Your pauses between sentences shortened significantly. Great progress." },
    { label: "Pronunciation",      score: 74, prev: 74, tip: "Work on the 'th' sound. It was mispronounced in 40% of occurrences." },
  ],
  topMistake: "Incorrect past perfect usage (had + past participle)",
  topStrength: "Expanding vocabulary through context",
  roomsAttended: 4,
  totalMinutes: 87,
};

// Mock conversation history
const RECENT_ROOMS = [
  { id: "r1", name: "Is remote work killing company culture?", community: "Daily Debate",      date: "Today",      duration: "24 min", mode: "Debate"     },
  { id: "r3", name: "Pitch Practice: Sell me this pen",        community: "Business English",   date: "Yesterday",  duration: "31 min", mode: "Hot Seat"   },
  { id: "r4", name: "Tell me about your week",                 community: "Beginner Corner",    date: "Apr 11",     duration: "18 min", mode: "Open Floor" },
  { id: "r5", name: "Champions League semi-final breakdown",   community: "Football Talk",      date: "Apr 10",     duration: "42 min", mode: "Open Floor" },
];

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400",
  "Debate":     "bg-orange-500/15 text-orange-400",
  "Teach Me":   "bg-blue-500/15 text-blue-400",
  "Hot Seat":   "bg-purple-500/15 text-purple-400",
};

type ProfileTab = "overview" | "assessment" | "history" | "achievements";

function ScoreBar({ score, prev, color = "bg-primary" }: { score: number; prev: number; color?: string }) {
  const delta = score - prev;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/[0.07] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: score + "%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={"h-full rounded-full " + color}
        />
      </div>
      <div className="flex items-center gap-1.5 w-16 justify-end flex-shrink-0">
        <span className="text-[13px] font-bold text-foreground">{score}</span>
        {delta !== 0 && (
          <span className={"text-[11px] font-semibold " + (delta > 0 ? "text-green-400" : "text-destructive")}>
            {delta > 0 ? "+" : ""}{delta}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage({ onMenuOpen = () => {} }: ProfilePageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>("overview");

  const level = currentUser.english_level;
  const nextLevel = NEXT_LEVEL[level];
  const currentLevelXP = LEVEL_XP[level];
  const nextLevelXP = nextLevel ? LEVEL_XP[nextLevel] : currentUser.xp_points;
  const xpInLevel = currentUser.xp_points - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = nextLevel ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;

  const joinedLounges = lounges.slice(0, 3);

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "overview",    label: "Overview"    },
    { key: "assessment",  label: "AI Report"   },
    { key: "history",     label: "History"     },
    { key: "achievements",label: "Badges"      },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07] flex items-center gap-3 px-4 h-[53px]">
        <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-[17px] font-extrabold text-foreground flex-1">Profile</h1>
        <button className="p-2 rounded-full hover:bg-white/8 transition-colors">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Profile hero */}
      <div className="relative px-4 pt-6 pb-4 border-b border-white/[0.07]">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-[0_0_24px_rgba(124,58,237,0.35)]">
              <img src={currentUser.avatar_url} alt="" className="w-full h-full rounded-[14px] object-cover bg-card" />
            </div>
            {currentUser.is_online && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-[20px] font-extrabold text-foreground tracking-tight">{currentUser.full_name}</h2>
              {level === "C2" && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
            </div>
            <p className="text-[13px] text-muted-foreground mb-2">@{currentUser.username}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <LevelBadge level={currentUser.english_level} size="md" />
              <span className="text-[12px] text-muted-foreground">{LEVEL_LABELS[level]}</span>
            </div>
            {currentUser.bio && (
              <p className="text-[13px] text-foreground/75 mt-2 leading-relaxed">{currentUser.bio}</p>
            )}
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold text-muted-foreground">Progress to {nextLevel ?? "Max"}</span>
            <span className="text-[12px] font-bold text-foreground">{currentUser.xp_points.toLocaleString()} XP</span>
          </div>
          <div className="h-2.5 bg-white/[0.07] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: xpProgress + "%" }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_rgba(124,58,237,0.5)]"
            />
          </div>
          {nextLevel && (
            <p className="text-[11px] text-muted-foreground mt-1">{(xpNeeded - xpInLevel).toLocaleString()} XP to {nextLevel}</p>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: <Flame className="h-4 w-4 text-orange-400" />, value: currentUser.streak_count, label: "Day streak" },
            { icon: <Mic className="h-4 w-4 text-primary" />,       value: RECENT_ROOMS.length,      label: "Rooms this week" },
            { icon: <Trophy className="h-4 w-4 text-amber-400" />,  value: ACHIEVEMENTS.filter((a) => a.earned).length, label: "Badges earned" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center"
            >
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-[18px] font-extrabold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.07] flex flex-shrink-0 sticky top-[53px] z-30 bg-background">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={"relative flex-1 py-3 text-[13px] font-bold transition-colors " + (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}
          >
            {t.label}
            {tab === t.key && <motion.div layoutId="profile-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              {/* Communities */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Communities</p>
                <div className="space-y-2">
                  {joinedLounges.map((lounge) => (
                    <button
                      key={lounge.id}
                      onClick={() => navigate("/lounge/" + lounge.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-left"
                    >
                      <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-xl flex-shrink-0"}>{lounge.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground">{lounge.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent posts */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Recent Posts</p>
                {samplePosts.filter((p) => p.author.id === currentUser.id).slice(0, 2).map((post) => (
                  <div key={post.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] mb-2">
                    {post.title && <p className="text-[14px] font-bold text-foreground mb-1">{post.title}</p>}
                    <p className="text-[13px] text-foreground/75 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                      <span className="text-[11px] flex items-center gap-1"><TrendingUp className="h-3 w-3" />{post.upvotes} upvotes</span>
                      <span className="text-[11px]">{post.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-24" />
            </motion.div>
          )}

          {/* AI ASSESSMENT */}
          {tab === "assessment" && (
            <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              {/* Week header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-foreground">Weekly AI Report</p>
                  <p className="text-[12px] text-muted-foreground">{WEEKLY_ASSESSMENT.week}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                  <span className="text-[18px] font-extrabold text-white">{WEEKLY_ASSESSMENT.overallScore}</span>
                </div>
              </div>

              {/* Activity summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-center">
                  <p className="text-[22px] font-extrabold text-foreground">{WEEKLY_ASSESSMENT.roomsAttended}</p>
                  <p className="text-[11px] text-muted-foreground">Rooms attended</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-center">
                  <p className="text-[22px] font-extrabold text-foreground">{WEEKLY_ASSESSMENT.totalMinutes}</p>
                  <p className="text-[11px] text-muted-foreground">Minutes spoken</p>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-4">
                <p className="text-[13px] font-bold text-foreground">Score Breakdown</p>
                {WEEKLY_ASSESSMENT.categories.map((cat, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] text-foreground/80">{cat.label}</span>
                    </div>
                    <ScoreBar score={cat.score} prev={cat.prev} />
                    <p className="text-[11px] text-muted-foreground/70 mt-1.5 leading-relaxed">{cat.tip}</p>
                  </div>
                ))}
              </div>

              {/* Highlight cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-2xl bg-green-500/8 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-green-400" />
                    <p className="text-[13px] font-bold text-green-400">Top Strength</p>
                  </div>
                  <p className="text-[14px] text-foreground leading-snug">{WEEKLY_ASSESSMENT.topStrength}</p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-500/8 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-orange-400" />
                    <p className="text-[13px] font-bold text-orange-400">Focus Area</p>
                  </div>
                  <p className="text-[14px] text-foreground leading-snug">{WEEKLY_ASSESSMENT.topMistake}</p>
                </div>
              </div>

              {/* AI note */}
              <div className="p-4 rounded-2xl bg-primary/8 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-[13px] font-bold text-primary">Elova AI Note</p>
                </div>
                <p className="text-[13px] text-foreground/80 leading-relaxed">
                  Your fluency score jumped 5 points this week — the biggest weekly gain you have had in a month.
                  Your confidence in debate rooms is clearly paying off. Try one Teach Me room next week to work on your explanatory vocabulary.
                </p>
              </div>
              <div className="h-24" />
            </motion.div>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Recent Rooms</p>
              <div className="space-y-2">
                {RECENT_ROOMS.map((room, i) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Mic className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground leading-snug mb-1">{room.name}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-primary font-semibold">{room.community}</span>
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <span className={"text-[11px] font-semibold px-2 py-0.5 rounded-full " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground")}>
                          {room.mode}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-semibold text-foreground">{room.duration}</p>
                      <p className="text-[11px] text-muted-foreground">{room.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center">
                <p className="text-[13px] text-muted-foreground">Total: <span className="font-bold text-foreground">87 minutes</span> spoken this week across <span className="font-bold text-foreground">4 rooms</span></p>
              </div>
              <div className="h-24" />
            </motion.div>
          )}

          {/* ACHIEVEMENTS */}
          {tab === "achievements" && (
            <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">
                {ACHIEVEMENTS.filter((a) => a.earned).length} of {ACHIEVEMENTS.length} earned
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={"p-4 rounded-2xl border transition-all " + (a.earned ? "bg-white/[0.04] border-white/[0.1]" : "bg-white/[0.01] border-white/[0.04] opacity-50")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{a.earned ? a.icon : "🔒"}</span>
                      {a.earned && <Star className="h-3.5 w-3.5 text-amber-400" />}
                    </div>
                    <p className={"text-[13px] font-bold mb-1 " + (a.earned ? "text-foreground" : "text-muted-foreground")}>{a.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{a.desc}</p>
                  </motion.div>
                ))}
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
# 2. COMMUNITIES BROWSER (RoomsPage = Dens list)
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/RoomsPage.tsx", r'''
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mic, Plus, Menu, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { lounges, sampleRooms } from "@/lib/lounge-data";

interface RoomsPageProps { onMenuOpen?: () => void; }

function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={"relative flex flex-shrink-0 " + s}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={"relative inline-flex rounded-full bg-green-500 " + s} />
    </span>
  );
}

export default function RoomsPage({ onMenuOpen = () => {} }: RoomsPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set(["l1", "l2", "l3"]));

  const filtered = lounges.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) ||
           l.description.toLowerCase().includes(search.toLowerCase())
  );

  const joinedList = filtered.filter((l) => joined.has(l.id));
  const suggestedList = filtered.filter((l) => !joined.has(l.id));

  const toggleJoin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJoined((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalLive = lounges.reduce((a, l) => a + l.activeRooms, 0);
  const totalMembers = lounges.reduce((a, l) => a + l.memberCount, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="flex items-center gap-3 px-4 h-[53px]">
          <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-[17px] font-extrabold text-foreground flex-1">Communities</h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-primary/40 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search communities..." className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Hero stats */}
      <div className="px-4 py-4 border-b border-white/[0.07] bg-gradient-to-r from-primary/8 via-transparent to-transparent">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-[13px] font-bold text-foreground">{lounges.length} communities</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[13px]">{totalMembers.toLocaleString()} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-400">
            <LiveDot sm />
            <span className="text-[13px] font-semibold">{totalLive} live now</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-6">

        {/* Joined */}
        {joinedList.length > 0 && !search && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Your Communities</p>
            <div className="space-y-2">
              {joinedList.map((lounge, i) => {
                const liveRooms = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive);
                return (
                  <motion.div
                    key={lounge.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate("/lounge/" + lounge.id)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-primary/20 transition-all cursor-pointer group"
                  >
                    <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-2xl flex-shrink-0 shadow-md"}>{lounge.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">{lounge.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members</span>
                        {liveRooms.length > 0 && (
                          <>
                            <span className="text-muted-foreground/30 text-xs">·</span>
                            <span className="flex items-center gap-1 text-[11px] text-green-400 font-semibold">
                              <LiveDot sm />{liveRooms.length} live
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleJoin(lounge.id, e)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/[0.07] border border-white/[0.1] text-foreground hover:bg-destructive/15 hover:text-destructive hover:border-destructive/25 transition-all"
                    >
                      Joined
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Discover */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">
            {search ? "Results" : "Discover"}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {(search ? filtered : suggestedList).map((lounge, i) => {
              const liveRooms = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive);
              const isJoined = joined.has(lounge.id);
              return (
                <motion.div
                  key={lounge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate("/lounge/" + lounge.id)}
                  className="rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer group bg-white/[0.02]"
                >
                  {/* Gradient banner */}
                  <div className={"h-20 bg-gradient-to-br " + lounge.gradient + " relative"}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    {liveRooms.length > 0 && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <LiveDot sm />
                        <span className="text-[10px] text-green-300 font-bold">{liveRooms.length} live</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 left-3 text-3xl drop-shadow-lg">{lounge.emoji}</span>
                  </div>
                  {/* Info */}
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">{lounge.name}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => toggleJoin(lounge.id, e)}
                        className={"flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border " + (isJoined ? "bg-white/[0.07] border-white/[0.1] text-foreground" : "bg-primary border-primary text-white hover:bg-primary/90")}
                      >
                        {isJoined ? "Joined" : "+ Join"}
                      </motion.button>
                    </div>
                    <p className="text-[12px] text-muted-foreground mb-2 leading-snug">{lounge.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{lounge.memberCount.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{lounge.activeRooms} rooms</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-foreground">No communities found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}

        <div className="h-24" />
      </div>

      <BottomNav />
    </div>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 3. VOICE ROOM PAGE
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/VoiceRoomPage.tsx", r'''
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneOff, Mic, MicOff, Hand, MessageSquare,
  Users, Settings, ChevronDown, Send, Share2,
  Volume2, VolumeX, Crown, BadgeCheck, Menu,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";
import { sampleRooms, loungeUsers } from "@/lib/lounge-data";

interface VoiceRoomPageProps { onMenuOpen?: () => void; }

const currentUser = loungeUsers[0];

const MODE_INFO: Record<string, { label: string; color: string; desc: string }> = {
  "Open Floor": { label: "Open Floor", color: "text-green-400",  desc: "Anyone can unmute and speak" },
  "Debate":     { label: "Debate",     color: "text-orange-400", desc: "Structured debate with turn timer" },
  "Teach Me":   { label: "Teach Me",   color: "text-blue-400",   desc: "One speaker, others ask questions" },
  "Hot Seat":   { label: "Hot Seat",   color: "text-purple-400", desc: "One person answers room questions" },
};

interface ChatMessage {
  id: string;
  content: string;
  author: typeof loungeUsers[0];
  time: string;
}

const INITIAL_CHAT: ChatMessage[] = [
  { id: "c1", content: "Great topic today!", author: loungeUsers[1], time: "9:15 AM" },
  { id: "c2", content: "Agreed. I have been thinking about this a lot.", author: loungeUsers[4], time: "9:16 AM" },
  { id: "c3", content: "Can we also discuss the impact on mental health?", author: loungeUsers[3], time: "9:17 AM" },
];

function SpeakerAvatar({
  user, isSpeaking, isMuted, isHost, size = "md",
}: {
  user: typeof loungeUsers[0];
  isSpeaking?: boolean;
  isMuted?: boolean;
  isHost?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const s = size === "lg" ? "w-20 h-20" : size === "md" ? "w-14 h-14" : "w-10 h-10";
  const ring = size === "lg" ? "p-[3px]" : "p-[2px]";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        {/* Speaking ring */}
        <div className={"rounded-full " + ring + " " + (isSpeaking ? "bg-gradient-to-br from-primary to-accent shadow-[0_0_16px_rgba(124,58,237,0.5)]" : "bg-white/10")}>
          <img
            src={user.avatar_url}
            alt=""
            className={"rounded-full object-cover bg-card " + s + (isMuted ? " opacity-60 grayscale" : "")}
          />
        </div>
        {/* Speaking animation */}
        {isSpeaking && !isMuted && (
          <motion.div
            className="absolute -inset-1.5 rounded-full border-2 border-primary/40"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {/* Host crown */}
        {isHost && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <Crown className="h-4 w-4 text-amber-400 drop-shadow" />
          </div>
        )}
        {/* Muted icon */}
        {isMuted && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
            <MicOff className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <p className="text-[11px] font-semibold text-foreground text-center max-w-[72px] truncate">{user.full_name.split(" ")[0]}</p>
      <LevelBadge level={user.english_level} />
    </div>
  );
}

export default function VoiceRoomPage({ onMenuOpen = () => {} }: VoiceRoomPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [speakingUser, setSpeakingUser] = useState<string | null>("u2");
  const [elapsed, setElapsed] = useState(0);
  const [deaf, setDeaf] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Find room from sampleRooms or use a default
  const room = sampleRooms.find((r) => r.id === id) ?? {
    id: id ?? "r1",
    name: "Is remote work killing company culture?",
    loungeId: "l1",
    loungeName: "Daily Debate",
    host: loungeUsers[0],
    participants: loungeUsers.slice(0, 4),
    maxParticipants: 8,
    mode: "Debate" as const,
    topic: "Remote work",
    isLive: true,
  };

  const modeInfo = MODE_INFO[room.mode] ?? MODE_INFO["Open Floor"];

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate random speaker switching
  useEffect(() => {
    const t = setInterval(() => {
      const speakers = room.participants.map((p) => p.id);
      setSpeakingUser(speakers[Math.floor(Math.random() * speakers.length)]);
    }, 3500);
    return () => clearInterval(t);
  }, [room.participants]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const sendChat = () => {
    if (!chatText.trim()) return;
    setChatMessages((prev) => [...prev, { id: "c" + Date.now(), content: chatText, author: currentUser, time: "Now" }]);
    setChatText("");
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const meInRoom = room.participants[0];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Room info */}
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-[11px] text-green-400 font-bold uppercase tracking-wide">Live · {fmt(elapsed)}</span>
              <span className={"text-[11px] font-bold " + modeInfo.color}>· {modeInfo.label}</span>
            </div>
            <p className="text-[14px] font-bold text-foreground leading-tight line-clamp-1">{room.name}</p>
            <p className="text-[11px] text-muted-foreground">{room.loungeName} · {room.participants.length}/{room.maxParticipants} speakers</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setChatOpen(!chatOpen)} className={"p-2 rounded-full transition-colors relative " + (chatOpen ? "bg-primary/20 text-primary" : "hover:bg-white/8 text-muted-foreground")}>
              <MessageSquare className="h-5 w-5" />
              {chatMessages.length > 0 && !chatOpen && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
            </button>
            <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Stage */}
        <div className="flex-1 px-4 pt-6 pb-4">

          {/* Mode badge */}
          <div className="flex justify-center mb-6">
            <div className={"px-4 py-2 rounded-full bg-white/5 border border-white/[0.08] flex items-center gap-2"}>
              <span className={"text-[12px] font-bold " + modeInfo.color}>{modeInfo.label}</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-[12px] text-muted-foreground">{modeInfo.desc}</span>
            </div>
          </div>

          {/* Current speaker — prominent center */}
          <AnimatePresence mode="wait">
            {speakingUser && (() => {
              const speaker = room.participants.find((p) => p.id === speakingUser) ?? room.participants[0];
              return (
                <motion.div
                  key={speakingUser}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center mb-8"
                >
                  <div className="relative mb-3">
                    {/* Outer pulse */}
                    <motion.div
                      className="absolute -inset-4 rounded-full bg-primary/10"
                      animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-primary/15"
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                    />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] shadow-[0_0_32px_rgba(124,58,237,0.5)]">
                      <img src={speaker.avatar_url} alt="" className="w-full h-full rounded-full object-cover bg-card" />
                      {speaker.id === room.host.id && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Crown className="h-5 w-5 text-amber-400 drop-shadow" /></div>
                      )}
                    </div>
                  </div>
                  <p className="text-[17px] font-extrabold text-foreground">{speaker.full_name}</p>
                  <p className="text-[12px] text-muted-foreground mb-2">@{speaker.username} · Speaking now</p>
                  <LevelBadge level={speaker.english_level} size="md" />

                  {/* Sound wave */}
                  <div className="flex items-center gap-1 mt-4">
                    {[3, 5, 8, 5, 3, 6, 9, 6, 3].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{ height: [h, h * 2.5, h] }}
                        transition={{ duration: 0.5 + i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* All participants grid */}
          <div className="flex flex-wrap justify-center gap-5">
            {room.participants.map((participant) => (
              <SpeakerAvatar
                key={participant.id}
                user={participant}
                isSpeaking={speakingUser === participant.id}
                isMuted={participant.id === currentUser.id && muted}
                isHost={participant.id === room.host.id}
                size="sm"
              />
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, room.maxParticipants - room.participants.length - 1) }).slice(0, 3).map((_, i) => (
              <div key={"empty-" + i} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white/20" />
                </div>
                <p className="text-[11px] text-muted-foreground/40">Empty</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTROLS ── */}
        <div className="px-4 pb-6 pt-2">
          {/* Hand raised banner */}
          <AnimatePresence>
            {handRaised && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="mb-4 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center gap-2"
              >
                <Hand className="h-4 w-4 text-amber-400" />
                <p className="text-[13px] text-amber-300 font-semibold">Your hand is raised — waiting to speak</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-5">
            {/* Deaf toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setDeaf(!deaf)}
              className={"w-12 h-12 rounded-full border flex items-center justify-center transition-all " + (deaf ? "bg-destructive/20 border-destructive/30 text-destructive" : "bg-white/[0.07] border-white/[0.1] text-muted-foreground hover:text-foreground")}
            >
              {deaf ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.button>

            {/* Mic toggle — primary action */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setMuted(!muted)}
              className={"w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg " + (muted ? "bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-primary shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:bg-primary/90")}
            >
              {muted ? <MicOff className="h-7 w-7 text-white" /> : <Mic className="h-7 w-7 text-white" />}
            </motion.button>

            {/* Hand raise */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setHandRaised(!handRaised)}
              className={"w-12 h-12 rounded-full border flex items-center justify-center transition-all " + (handRaised ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-white/[0.07] border-white/[0.1] text-muted-foreground hover:text-foreground")}
            >
              <Hand className="h-5 w-5" />
            </motion.button>

            {/* Leave */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/25 flex items-center justify-center text-destructive hover:bg-destructive/25 transition-colors"
            >
              <PhoneOff className="h-5 w-5" />
            </motion.button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground/50 mt-3">
            {muted ? "You are muted" : "You are live"} · {fmt(elapsed)}
          </p>
        </div>
      </div>

      {/* ── CHAT DRAWER ── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[#0d1117] border-t border-white/[0.1] rounded-t-3xl shadow-2xl"
            style={{ maxHeight: "65vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.07]">
              <p className="text-[14px] font-bold text-foreground">Room Chat</p>
              <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-full hover:bg-white/8 text-muted-foreground transition-colors">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: "calc(65vh - 130px)" }}>
              {chatMessages.map((msg) => {
                const isMe = msg.author.id === currentUser.id;
                return (
                  <div key={msg.id} className={"flex gap-2.5 " + (isMe ? "flex-row-reverse" : "")}>
                    <img src={msg.author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0" />
                    <div className={"max-w-[75%] " + (isMe ? "items-end" : "items-start") + " flex flex-col gap-0.5"}>
                      {!isMe && <p className="text-[11px] font-bold text-muted-foreground px-1">{msg.author.full_name.split(" ")[0]}</p>}
                      <div className={"px-3 py-2 rounded-2xl text-[13px] leading-relaxed " + (isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white/[0.07] border border-white/[0.08] text-foreground/90 rounded-tl-sm")}>
                        {msg.content}
                      </div>
                      <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat input */}
            <div className="px-4 py-3 border-t border-white/[0.07] flex items-center gap-2">
              <img src={currentUser.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0" />
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/40 transition-colors">
                <input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                  placeholder="Message the room..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={sendChat}
                  disabled={!chatText.trim()}
                  className={"w-7 h-7 rounded-full flex items-center justify-center transition-all " + (chatText.trim() ? "bg-primary text-white" : "bg-white/5 text-muted-foreground cursor-not-allowed")}
                >
                  <Send className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
''')

print("\n✅ All 3 files written:")
print("   src/pages/ProfilePage.tsx")
print("   src/pages/RoomsPage.tsx")
print("   src/pages/VoiceRoomPage.tsx")
print("\nRun: npm run dev")


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

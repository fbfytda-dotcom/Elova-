import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Zap, Mic, MessageSquare, Trophy, TrendingUp, Star,
  Calendar, ChevronRight, Settings, BadgeCheck, Menu, Lock,
  Target, Crown, Gem, Globe, BookOpen, Headphones, Sparkles,
  ArrowUpRight, Clock, MapPin, Award, BarChart3, BrainCircuit,
  Volume2, PenTool, Hash, Heart, Share2, Bookmark, MoreHorizontal,
  CircleDot, Waves, ChevronDown, RotateCcw, Activity, Radio, Users
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

/* ═══════════════════════════════════════════════════════════════════
   ENHANCED ACHIEVEMENTS WITH RARITY TIERS
   ═══════════════════════════════════════════════════════════════════ */

const ACHIEVEMENTS = [
  { id: "a1", icon: "🎙️", label: "First Room",      desc: "Joined your first voice room",          earned: true,  rarity: "common",    xp: 50  },
  { id: "a2", icon: "🔥", label: "7-Day Streak",    desc: "Spoke 7 days in a row",                  earned: true,  rarity: "common",    xp: 100 },
  { id: "a3", icon: "🏆", label: "Debate Champion", desc: "Won 5 debates",                          earned: true,  rarity: "rare",      xp: 250 },
  { id: "a4", icon: "👥", label: "Community Pillar", desc: "Joined 3 communities",                  earned: true,  rarity: "common",    xp: 75  },
  { id: "a5", icon: "⭐", label: "Top Speaker",      desc: "Reached top 10 in a community",         earned: false, rarity: "epic",      xp: 500 },
  { id: "a6", icon: "🎓", label: "C2 Master",        desc: "Reached C2 level",                      earned: false, rarity: "legendary", xp: 1000 },
  { id: "a7", icon: "💎", label: "30-Day Streak",    desc: "Spoke 30 days in a row",                earned: false, rarity: "epic",      xp: 750 },
  { id: "a8", icon: "🌍", label: "Global Citizen",   desc: "Spoke with people from 10 countries",   earned: false, rarity: "rare",      xp: 300 },
  { id: "a9", icon: "🧠", label: "AI Explorer",      desc: "Completed 10 AI assessments",            earned: true,  rarity: "rare",      xp: 200 },
  { id: "a10", icon: "🎯", label: "Perfect Pitch",   desc: "Got 100% in a Hot Seat session",        earned: false, rarity: "legendary", xp: 800 },
];

const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string; label: string }> = {
  common:    { border: "border-white/[0.08]",  bg: "bg-white/[0.03]",  glow: "",                                           label: "Common"    },
  rare:      { border: "border-sky-500/20",     bg: "bg-sky-500/5",     glow: "shadow-[0_0_12px_rgba(14,165,233,0.15)]",      label: "Rare"      },
  epic:      { border: "border-purple-500/20", bg: "bg-purple-500/5",  glow: "shadow-[0_0_16px_rgba(168,85,247,0.2)]",       label: "Epic"      },
  legendary: { border: "border-amber-500/25",  bg: "bg-amber-500/8",   glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",      label: "Legendary" },
};

/* ═══════════════════════════════════════════════════════════════════
   WEEKLY AI ASSESSMENT DATA
   ═══════════════════════════════════════════════════════════════════ */

const WEEKLY_ASSESSMENT = {
  week: "April 7 – 13",
  overallScore: 78,
  categories: [
    { label: "Vocabulary Range",   score: 82, prev: 75, tip: "You introduced 14 new words this week. Keep using them in context." },
    { label: "Grammar Accuracy",   score: 71, prev: 68, tip: "Watch your use of past perfect. It appeared incorrectly 6 times." },
    { label: "Fluency",            score: 85, prev: 80, tip: "Your pauses between sentences shortened significantly. Great progress." },
    { label: "Pronunciation",      score: 74, prev: 74, tip: "Work on the 'th' sound. It was mispronounced in 40% of occurrences." },
    { label: "Confidence",         score: 79, prev: 72, tip: "You spoke first in 3 out of 4 rooms this week. Leadership growth." },
  ],
  topMistake: "Incorrect past perfect usage (had + past participle)",
  topStrength: "Expanding vocabulary through context",
  roomsAttended: 4,
  totalMinutes: 87,
  wordsLearned: 14,
  accuracyDelta: +3,
};

/* ═══════════════════════════════════════════════════════════════════
   ENHANCED ROOM HISTORY
   ═══════════════════════════════════════════════════════════════════ */

const RECENT_ROOMS = [
  { id: "r1", name: "Is remote work killing company culture?", community: "Daily Debate",      communityId: "l1", date: "Today",      duration: "24 min", mode: "Debate",     participants: 5, role: "Speaker"    },
  { id: "r3", name: "Pitch Practice: Sell me this pen",        community: "Business English",   communityId: "l2", date: "Yesterday",  duration: "31 min", mode: "Hot Seat",   participants: 3, role: "Host"       },
  { id: "r4", name: "Tell me about your week",                 community: "Beginner Corner",    communityId: "l3", date: "Apr 11",     duration: "18 min", mode: "Open Floor", participants: 4, role: "Listener"   },
  { id: "r5", name: "Champions League semi-final breakdown",   community: "Football Talk",      communityId: "l4", date: "Apr 10",     duration: "42 min", mode: "Open Floor", participants: 8, role: "Speaker"    },
  { id: "r6", name: "AI ethics in education",                community: "Tech and AI",        communityId: "l5", date: "Apr 9",      duration: "28 min", mode: "Debate",     participants: 6, role: "Moderator"  },
];

const MODE_COLORS: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  "Open Floor": { bg: "bg-emerald-500/12", text: "text-emerald-400", border: "border-emerald-500/20", icon: <Volume2 className="h-3.5 w-3.5" /> },
  "Debate":     { bg: "bg-orange-500/12",  text: "text-orange-400",  border: "border-orange-500/20",  icon: <Zap className="h-3.5 w-3.5" />      },
  "Teach Me":   { bg: "bg-sky-500/12",     text: "text-sky-400",     border: "border-sky-500/20",     icon: <BookOpen className="h-3.5 w-3.5" />  },
  "Hot Seat":   { bg: "bg-violet-500/12",  text: "text-violet-400",  border: "border-violet-500/20",  icon: <Crown className="h-3.5 w-3.5" />     },
};

const ROLE_BADGES: Record<string, { color: string; label: string }> = {
  "Host":      { color: "bg-primary/15 text-primary border-primary/25",       label: "Host"      },
  "Speaker":   { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Speaker"   },
  "Moderator": { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Moderator" },
  "Listener":  { color: "bg-white/5 text-muted-foreground border-white/10",   label: "Listener"  },
};

type ProfileTab = "overview" | "assessment" | "history" | "achievements";

/* ═══════════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function CircularProgress({ value, size = 56, strokeWidth = 4, color = "#7C3AED" }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ strokeDasharray: circumference, filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[13px] font-extrabold text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, prev, delay = 0 }: { score: number; prev: number; delay?: number }) {
  const delta = score - prev;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: score + "%" }}
          transition={{ duration: 0.9, ease: "easeOut", delay }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
      <div className="flex items-center gap-1.5 w-[52px] justify-end flex-shrink-0">
        <span className="text-[14px] font-bold text-foreground">{score}</span>
        {delta !== 0 && (
          <span className={"text-[11px] font-bold px-1.5 py-0.5 rounded-full " + (delta > 0 ? "bg-green-500/15 text-green-400" : "bg-destructive/15 text-destructive")}>
            {delta > 0 ? "+" : ""}{delta}
          </span>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, delay = 0, color = "text-primary" }: { icon: React.ReactNode; value: string | number; label: string; delay?: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-3.5 text-center hover:border-white/[0.14] hover:bg-white/[0.05] transition-all cursor-default"
    >
      <div className={`flex justify-center mb-1.5 ${color}`}>{icon}</div>
      <p className="text-[20px] font-extrabold text-foreground tracking-tight">{value}</p>
      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{label}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */

function ProfileHero() {
  const level = currentUser.english_level;
  const nextLevel = NEXT_LEVEL[level];
  const currentLevelXP = LEVEL_XP[level];
  const nextLevelXP = nextLevel ? LEVEL_XP[nextLevel] : currentUser.xp_points;
  const xpInLevel = currentUser.xp_points - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = nextLevel ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;

  return (
    <div className="relative px-4 pt-8 pb-5 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/15 rounded-full blur-[60px]"
        />
      </div>

      <div className="relative">
        {/* Avatar + Info row */}
        <div className="flex items-start gap-4 mb-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex-shrink-0"
          >
            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-[2.5px] shadow-[0_0_30px_rgba(124,58,237,0.4)]">
              <img src={currentUser.avatar_url} alt="" className="w-full h-full rounded-[13px] object-cover bg-card" />
            </div>
            {currentUser.is_online && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[2.5px] border-background"
              />
            )}
          </motion.div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-[22px] font-extrabold text-foreground tracking-tight">{currentUser.full_name}</h2>
              {level === "C2" && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
            </div>
            <p className="text-[13px] text-muted-foreground mb-2">@{currentUser.username}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <LevelBadge level={currentUser.english_level} size="md" />
              <span className="text-[12px] text-muted-foreground">{LEVEL_LABELS[level]}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[13px] text-foreground/70 leading-relaxed mb-5"
          >
            {currentUser.bio}
          </motion.p>
        )}

        {/* XP Arc + Stats */}
        <div className="flex items-center gap-4 mb-1">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-muted-foreground">Level Progress</span>
              <span className="text-[12px] font-bold text-foreground">{currentUser.xp_points.toLocaleString()} <span className="text-muted-foreground font-normal">/ {nextLevelXP.toLocaleString()} XP</span></span>
            </div>
            <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: xpProgress + "%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_12px_rgba(124,58,237,0.5)]"
              />
            </div>
            {nextLevel && (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                <span className="text-primary font-semibold">{(xpNeeded - xpInLevel).toLocaleString()} XP</span> to reach {nextLevel}
              </p>
            )}
          </div>

          <CircularProgress value={Math.round(xpProgress)} size={52} strokeWidth={4} color="#7C3AED" />
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-2.5 mt-5">
          <StatCard icon={<Flame className="h-4 w-4 text-orange-400" />} value={currentUser.streak_count} label="Streak" delay={0.1} color="text-orange-400" />
          <StatCard icon={<Mic className="h-4 w-4 text-primary" />} value={RECENT_ROOMS.length} label="Rooms" delay={0.18} color="text-primary" />
          <StatCard icon={<Trophy className="h-4 w-4 text-amber-400" />} value={ACHIEVEMENTS.filter((a) => a.earned).length} label="Badges" delay={0.26} color="text-amber-400" />
          <StatCard icon={<Clock className="h-4 w-4 text-sky-400" />} value={"87m"} label="This week" delay={0.34} color="text-sky-400" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════════════════ */

function OverviewTab() {
  const navigate = useNavigate();
  const joinedLounges = lounges.slice(0, 4);
  const myPosts = samplePosts.filter((p) => p.author.id === currentUser.id);

  return (
    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">

      {/* Speaking Activity Mini-Dashboard */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <p className="text-[13px] font-bold text-foreground">This Week</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/15">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Rooms</span>
            </div>
            <p className="text-[28px] font-extrabold text-foreground">{RECENT_ROOMS.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">+1 from last week</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/15">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">Minutes</span>
            </div>
            <p className="text-[28px] font-extrabold text-foreground">87</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">+23 from last week</p>
          </div>
        </div>
      </section>

      {/* Communities */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-[13px] font-bold text-foreground">Communities</p>
          </div>
          <button onClick={() => navigate("/rooms")} className="text-[12px] text-primary font-semibold hover:underline">
            See all
          </button>
        </div>
        <div className="space-y-2.5">
          {joinedLounges.map((lounge, i) => {
            const liveCount = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive).length;
            return (
              <motion.button
                key={lounge.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate("/lounge/" + lounge.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all text-left group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}>
                  {lounge.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{lounge.name}</p>
                  <p className="text-[11px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members</p>
                </div>
                <div className="flex items-center gap-2">
                  {liveCount > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full bg-green-500 h-1.5 w-1.5" />
                      </span>
                      {liveCount} live
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Recent Posts */}
      {myPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PenTool className="h-4 w-4 text-primary" />
              <p className="text-[13px] font-bold text-foreground">Recent Posts</p>
            </div>
            <span className="text-[12px] text-muted-foreground">{myPosts.length} total</span>
          </div>
          <div className="space-y-3">
            {myPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer"
                onClick={() => navigate("/")}
              >
                {post.title && <p className="text-[14px] font-bold text-foreground mb-1.5 leading-snug">{post.title}</p>}
                <p className="text-[13px] text-foreground/65 line-clamp-2 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {post.upvotes} upvotes
                  </span>
                  <span className="text-[11px] text-muted-foreground">{post.createdAt}</span>
                  {post.loungeName && (
                    <span className="text-[11px] text-primary font-semibold ml-auto">{post.loungeName}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AI ASSESSMENT TAB
   ═══════════════════════════════════════════════════════════════════ */

function AssessmentTab() {
  return (
    <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-5">

      {/* Overall Score Hero */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-br from-primary/15 via-background to-background border border-primary/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-primary mb-1">Weekly AI Report</p>
            <p className="text-[24px] font-extrabold text-foreground">{WEEKLY_ASSESSMENT.overallScore}<span className="text-[14px] text-muted-foreground font-normal">/100</span></p>
            <p className="text-[11px] text-muted-foreground mt-1">{WEEKLY_ASSESSMENT.week}</p>
          </div>
          <div className="relative">
            <CircularProgress value={WEEKLY_ASSESSMENT.overallScore} size={72} strokeWidth={5} color="#7C3AED" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Radio className="h-4 w-4 text-primary" />, value: WEEKLY_ASSESSMENT.roomsAttended, label: "Rooms", sub: "+1 vs last week" },
          { icon: <Clock className="h-4 w-4 text-accent" />, value: WEEKLY_ASSESSMENT.totalMinutes, label: "Minutes", sub: "+23 vs last week" },
          { icon: <BookOpen className="h-4 w-4 text-green-400" />, value: WEEKLY_ASSESSMENT.wordsLearned, label: "Words", sub: "New this week" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center"
          >
            <div className="flex justify-center mb-1.5">{s.icon}</div>
            <p className="text-[20px] font-extrabold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
            <p className="text-[9px] text-green-400/70 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Score Breakdown */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.07] space-y-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <p className="text-[14px] font-bold text-foreground">Score Breakdown</p>
        </div>
        {WEEKLY_ASSESSMENT.categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-foreground/80">{cat.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-foreground">{cat.score}</span>
                {cat.score - cat.prev !== 0 && (
                  <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full " + (cat.score > cat.prev ? "bg-green-500/15 text-green-400" : "bg-destructive/15 text-destructive")}>
                    {cat.score > cat.prev ? "+" : ""}{cat.score - cat.prev}
                  </span>
                )}
              </div>
            </div>
            <ScoreBar score={cat.score} prev={cat.prev} delay={0.2 + i * 0.1} />
            <p className="text-[11px] text-muted-foreground/60 mt-2 leading-relaxed pl-1 border-l-2 border-primary/20">{cat.tip}</p>
          </motion.div>
        ))}
      </div>

      {/* Strength & Focus */}
      <div className="grid grid-cols-1 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-green-500/8 to-transparent border border-green-500/15"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Star className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-[13px] font-bold text-green-400">Top Strength</p>
          </div>
          <p className="text-[15px] font-semibold text-foreground leading-snug">{WEEKLY_ASSESSMENT.topStrength}</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">Keep leveraging this in Open Floor rooms</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/8 to-transparent border border-orange-500/15"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Target className="h-4 w-4 text-orange-400" />
            </div>
            <p className="text-[13px] font-bold text-orange-400">Focus Area</p>
          </div>
          <p className="text-[15px] font-semibold text-foreground leading-snug">{WEEKLY_ASSESSMENT.topMistake}</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">Try a Teach Me room this week to practice</p>
        </motion.div>
      </div>

      {/* AI Note */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <BrainCircuit className="h-4 w-4 text-primary" />
          </div>
          <p className="text-[13px] font-bold text-primary">Elova AI Insight</p>
        </div>
        <p className="text-[13px] text-foreground/80 leading-relaxed">
          Your fluency score jumped <span className="text-primary font-bold">5 points</span> this week — the biggest weekly gain you have had in a month.
          Your confidence in debate rooms is clearly paying off. Try one <span className="text-accent font-semibold">Teach Me</span> room next week to work on your explanatory vocabulary.
        </p>
      </motion.div>

      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HISTORY TAB — TIMELINE STYLE
   ═══════════════════════════════════════════════════════════════════ */

function HistoryTab() {
  const navigate = useNavigate();

  return (
    <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-primary" />
        <p className="text-[14px] font-bold text-foreground">Speaking History</p>
        <span className="text-[11px] text-muted-foreground ml-auto">{RECENT_ROOMS.length} sessions</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        <div className="space-y-4">
          {RECENT_ROOMS.map((room, i) => {
            const modeStyle = MODE_COLORS[room.mode] ?? MODE_COLORS["Open Floor"];
            const roleStyle = ROLE_BADGES[room.role] ?? ROLE_BADGES["Listener"];
            const lounge = lounges.find((l) => l.id === room.communityId);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex items-start gap-3 pl-1"
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-xl ${modeStyle.bg} border ${modeStyle.border} flex items-center justify-center z-10 relative`}>
                    <Mic className={`h-4 w-4 ${modeStyle.text}`} />
                  </div>
                  {i === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-xl ${modeStyle.bg}`}
                    />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 min-w-0 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer group"
                  onClick={() => navigate("/lounge/" + room.communityId)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-[14px] font-bold text-foreground leading-snug group-hover:text-primary/90 transition-colors">{room.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${roleStyle.color}`}>
                      {room.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-2.5">
                    {lounge && (
                      <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                        <div className={`w-3.5 h-3.5 rounded-sm bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-[8px]`}>
                          {lounge.emoji}
                        </div>
                        {room.community}
                      </span>
                    )}
                    <span className="text-muted-foreground/40">·</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
                      {room.mode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {room.duration}
                    </span>
                    <span className="text-[11px] flex items-center gap-1">
                      <Users className="h-3 w-3" /> {room.participants} people
                    </span>
                    <span className="text-[11px] ml-auto">{room.date}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-primary/8 to-accent/5 border border-primary/15 text-center"
      >
        <p className="text-[13px] text-foreground/80">
          Total: <span className="font-bold text-foreground">87 minutes</span> spoken across <span className="font-bold text-foreground">{RECENT_ROOMS.length} rooms</span> this week
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-400" /> 14-day streak
          </span>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-400" /> +23% vs last week
          </span>
        </div>
      </motion.div>

      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ACHIEVEMENTS / BADGES TAB
   ═══════════════════════════════════════════════════════════════════ */

function AchievementsTab() {
  const earned = ACHIEVEMENTS.filter((a) => a.earned);
  const unearned = ACHIEVEMENTS.filter((a) => !a.earned);
  const totalXP = earned.reduce((sum, a) => sum + a.xp, 0);

  return (
    <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">

      {/* Stats header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            {earned.length} of {ACHIEVEMENTS.length} unlocked
          </p>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            <span className="text-primary font-bold">{totalXP.toLocaleString()}</span> XP earned from badges
          </p>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Gem className="h-4 w-4" />
          <span className="text-[13px] font-bold">{Math.round((earned.length / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(earned.length / ACHIEVEMENTS.length) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
        />
      </div>

      {/* Earned badges */}
      {earned.length > 0 && (
        <section>
          <p className="text-[13px] font-bold text-foreground mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" /> Unlocked
          </p>
          <div className="grid grid-cols-2 gap-3">
            {earned.map((a, i) => {
              const rarity = RARITY_STYLES[a.rarity];
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={`p-4 rounded-2xl border ${rarity.border} ${rarity.bg} ${rarity.glow} transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{a.icon}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400">{a.xp} XP</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-bold text-foreground mb-1">{a.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{a.desc}</p>
                  <span className={`inline-block mt-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.border} border`}>
                    {rarity.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Locked badges */}
      {unearned.length > 0 && (
        <section>
          <p className="text-[13px] font-bold text-foreground mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" /> Locked
          </p>
          <div className="grid grid-cols-2 gap-3">
            {unearned.map((a, i) => {
              const rarity = RARITY_STYLES[a.rarity];
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`p-4 rounded-2xl border ${rarity.border} ${rarity.bg} opacity-40 hover:opacity-60 transition-opacity`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl grayscale">{a.icon}</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-[13px] font-bold text-muted-foreground mb-1">{a.label}</p>
                  <p className="text-[11px] text-muted-foreground/60 leading-snug">{a.desc}</p>
                  <span className={`inline-block mt-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.border} border`}>
                    {rarity.label} · {a.xp} XP
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function ProfilePage({ onMenuOpen = () => {} }: ProfilePageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>("overview");

  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview",     label: "Overview",     icon: <Activity className="h-3.5 w-3.5" />     },
    { key: "assessment",   label: "AI Report",    icon: <BrainCircuit className="h-3.5 w-3.5" /> },
    { key: "history",      label: "History",      icon: <Clock className="h-3.5 w-3.5" />      },
    { key: "achievements", label: "Badges",       icon: <Award className="h-3.5 w-3.5" />      },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07] flex items-center gap-3 px-4 h-[53px]">
        <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-[17px] font-extrabold text-foreground flex-1">Profile</h1>
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-full hover:bg-white/8 transition-colors"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Hero */}
      <ProfileHero />

      {/* Tabs */}
      <div className="border-b border-white/[0.07] flex flex-shrink-0 sticky top-[53px] z-30 bg-background/95 backdrop-blur-md px-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "relative flex-1 py-3.5 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-colors " +
              (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")
            }
          >
            {t.icon}
            {t.label}
            {tab === t.key && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-gradient-to-r from-primary to-accent rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tab === "overview" && <OverviewTab />}
          {tab === "assessment" && <AssessmentTab />}
          {tab === "history" && <HistoryTab />}
          {tab === "achievements" && <AchievementsTab />}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Mic, Users, Search, SlidersHorizontal, X, Menu, Globe,
  Flame, Zap, Clock, ChevronRight, Bell, Play, TrendingUp,
  Sparkles, ArrowRight, Radio, Volume2, Star, Hash, Crown,
  Heart, Share2, Bookmark, CircleDot, Waves, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { sampleRooms, loungeUsers, lounges } from "@/lib/lounge-data";
import type { LoungeRoom, Lounge } from "@/lib/lounge-data";

interface ExplorePageProps { onMenuOpen?: () => void; }

const currentUser = loungeUsers[0];

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA EXTENSIONS
   ═══════════════════════════════════════════════════════════════════ */

const EXTRA_ROOMS: LoungeRoom[] = [
  { id: "r7",  name: "Pronunciation clinic — fix your accent in 30 mins", loungeId: "l3", loungeName: "Beginner Corner",    host: loungeUsers[4], participants: [loungeUsers[4], loungeUsers[2]], maxParticipants: 6,  mode: "Teach Me",   topic: "Pronunciation", isLive: true },
  { id: "r8",  name: "Hot take: grammar rules are made to be broken",     loungeId: "l1", loungeName: "Daily Debate",       host: loungeUsers[1], participants: [loungeUsers[1], loungeUsers[0], loungeUsers[3]], maxParticipants: 10, mode: "Debate",     topic: "Grammar",      isLive: true },
  { id: "r9",  name: "Startup pitch feedback session",                    loungeId: "l2", loungeName: "Business English",   host: loungeUsers[3], participants: [loungeUsers[3]], maxParticipants: 5,  mode: "Hot Seat",   topic: "Business",     isLive: true },
  { id: "r10", name: "Creative writing prompts — live collab",            loungeId: "l6", loungeName: "Creative Writing",   host: loungeUsers[2], participants: [loungeUsers[2], loungeUsers[4]], maxParticipants: 8,  mode: "Open Floor", topic: "Writing",      isLive: true },
  { id: "r11", name: "Transfer window debate — who should your club buy?",loungeId: "l4", loungeName: "Football Talk",      host: loungeUsers[0], participants: [loungeUsers[0], loungeUsers[1], loungeUsers[2], loungeUsers[3]], maxParticipants: 12, mode: "Open Floor", topic: "Football", isLive: true },
  { id: "r12", name: "GPT-5 predictions — what changes?",                 loungeId: "l5", loungeName: "Tech and AI",        host: loungeUsers[4], participants: [loungeUsers[4], loungeUsers[0], loungeUsers[3]], maxParticipants: 8,  mode: "Debate",     topic: "AI",           isLive: true },
  { id: "r13", name: "Ask a native speaker anything",                     loungeId: "l3", loungeName: "Beginner Corner",    host: loungeUsers[4], participants: [loungeUsers[4]], maxParticipants: 6,  mode: "Hot Seat",   topic: "General",      isLive: true },
  { id: "r14", name: "IELTS Speaking Part 2 — practice cue cards",       loungeId: "l2", loungeName: "Business English",   host: loungeUsers[3], participants: [loungeUsers[3], loungeUsers[2]], maxParticipants: 6,  mode: "Teach Me",   topic: "Exams",        isLive: true },
];

const ALL_ROOMS = [...sampleRooms, ...EXTRA_ROOMS];

const STARTING_SOON: LoungeRoom[] = [
  { id: "r15", name: "Friday Fluency Jam — open mic night",               loungeId: "l1", loungeName: "Daily Debate",       host: loungeUsers[2], participants: [], maxParticipants: 15, mode: "Open Floor", topic: "Casual",       isLive: false },
  { id: "r16", name: "Mock Interview: Product Manager role",              loungeId: "l2", loungeName: "Business English",   host: loungeUsers[4], participants: [], maxParticipants: 4,  mode: "Hot Seat",   topic: "Interviews",   isLive: false },
  { id: "r17", name: "Poetry reading & feedback circle",                  loungeId: "l6", loungeName: "Creative Writing",   host: loungeUsers[1], participants: [], maxParticipants: 10, mode: "Open Floor", topic: "Poetry",       isLive: false },
];

const RECENTLY_ENDED = [
  { id: "re1", name: "Is AI art real art? — heated debate",               loungeId: "l1", loungeName: "Daily Debate",       host: loungeUsers[0], participants: 8,  maxParticipants: 10, mode: "Debate",     duration: "42 min", endedAt: "12 min ago" },
  { id: "re2", name: "How to negotiate your salary",                      loungeId: "l2", loungeName: "Business English",   host: loungeUsers[3], participants: 5,  maxParticipants: 6,  mode: "Teach Me",   duration: "28 min", endedAt: "34 min ago" },
  { id: "re3", name: "Premier League weekend review",                     loungeId: "l4", loungeName: "Football Talk",      host: loungeUsers[2], participants: 11, maxParticipants: 12, mode: "Open Floor", duration: "55 min", endedAt: "1 hr ago"   },
];

const TRENDING_TOPICS = [
  "Remote Work", "AI & Future", "Grammar", "Pronunciation", "Business",
  "Football", "Creative Writing", "IELTS", "Debates", "Culture"
];

const MODE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  "Open Floor": { bg: "bg-emerald-500/12", text: "text-emerald-400", border: "border-emerald-500/25", glow: "shadow-[0_0_12px_rgba(16,185,129,0.2)]" },
  "Debate":     { bg: "bg-orange-500/12",  text: "text-orange-400",  border: "border-orange-500/25",  glow: "shadow-[0_0_12px_rgba(249,115,22,0.2)]"  },
  "Teach Me":   { bg: "bg-sky-500/12",     text: "text-sky-400",     border: "border-sky-500/25",     glow: "shadow-[0_0_12px_rgba(14,165,233,0.2)]"  },
  "Hot Seat":   { bg: "bg-violet-500/12",  text: "text-violet-400",  border: "border-violet-500/25",  glow: "shadow-[0_0_12px_rgba(139,92,246,0.2)]"  },
};

const LEVELS = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
const MODES  = ["All", "Open Floor", "Debate", "Teach Me", "Hot Seat"];

/* ═══════════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function LiveDot({ sm = false, className = "" }: { sm?: boolean; className?: string }) {
  const size = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={`relative flex flex-shrink-0 ${size} ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={`relative inline-flex rounded-full bg-green-500 ${size}`} />
    </span>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   FILTER CHIP
   ═══════════════════════════════════════════════════════════════════ */

function FilterChip({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={
        "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-200 " +
        (active
          ? "bg-primary text-white border-primary shadow-[0_0_16px_rgba(124,58,237,0.35)]"
          : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-white/20 hover:text-foreground hover:bg-white/[0.07]")
      }
    >
      {icon}
      {label}
      {active && <X className="h-3 w-3 ml-0.5 opacity-70" />}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURED ROOM HERO
   ═══════════════════════════════════════════════════════════════════ */

function FeaturedRoom({ room, onJoin }: { room: LoungeRoom; onJoin: () => void }) {
  const lounge = lounges.find((l) => l.id === room.loungeId);
  const spotsLeft = room.maxParticipants - room.participants.length;
  const fillRatio = room.participants.length / room.maxParticipants;
  const isHot = fillRatio >= 0.7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-primary/20 via-background to-background group cursor-pointer"
      onClick={onJoin}
    >
      {/* Animated background mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-[60px]" />
      </div>

      <div className="relative p-5">
        {/* Top row: badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-full px-3 py-1">
              <LiveDot sm />
              <span className="text-[11px] font-bold text-green-400 uppercase tracking-wider">Live Now</span>
            </div>
            {isHot && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/30 rounded-full px-3 py-1"
              >
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-[11px] font-bold text-orange-400">Hot</span>
              </motion.div>
            )}
          </div>
          {lounge && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-[10px]`}>
                {lounge.emoji}
              </div>
              <span className="text-[11px] font-semibold">{lounge.name}</span>
            </div>
          )}
        </div>

        {/* Room title */}
        <h2 className="text-[22px] font-extrabold text-foreground leading-tight mb-3 group-hover:text-primary/90 transition-colors">
          {room.name}
        </h2>

        {/* Topic tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] text-muted-foreground bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 flex items-center gap-1">
            <Hash className="h-3 w-3" /> {room.topic}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${MODE_COLORS[room.mode]?.bg} ${MODE_COLORS[room.mode]?.text} ${MODE_COLORS[room.mode]?.border}`}>
            {room.mode}
          </span>
        </div>

        {/* Host & participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={room.host.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-primary/50" />
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-[2px]">
                <Crown className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">{room.host.full_name}</p>
              <p className="text-[11px] text-muted-foreground">@{room.host.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {room.participants.slice(0, 4).map((p) => (
                <img key={p.id} src={p.avatar_url} alt="" className="w-7 h-7 rounded-full border-2 border-background" />
              ))}
              {room.participants.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-background flex items-center justify-center">
                  <span className="text-[9px] font-bold text-foreground">+{room.participants.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar + CTA */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-muted-foreground">
              {room.participants.length} of {room.maxParticipants} speakers
            </span>
            <span className={`text-[11px] font-bold ${spotsLeft <= 2 ? "text-orange-400" : "text-green-400"}`}>
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </span>
          </div>
          <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillRatio * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className={`h-full rounded-full ${isHot ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-primary to-accent"}`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); onJoin(); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(124,58,237,0.5)] transition-shadow"
          >
            <Radio className="h-5 w-5 animate-pulse" />
            Join Room Now
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRENDING TOPICS
   ═══════════════════════════════════════════════════════════════════ */

function TrendingTopics({ onSelect, activeTopic }: { onSelect: (t: string) => void; activeTopic: string | null }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-3 px-1">
        <TrendingUp className="h-4 w-4 text-orange-400" />
        <p className="text-[13px] font-bold text-foreground">Trending Topics</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
        {TRENDING_TOPICS.map((topic, i) => (
          <motion.button
            key={topic}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onSelect(activeTopic === topic ? "" : topic)}
            className={
              "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-200 " +
              (activeTopic === topic
                ? "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_16px_rgba(249,115,22,0.2)]"
                : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-white/20 hover:text-foreground")
            }
          >
            <Hash className="h-3.5 w-3.5" />
            {topic}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMUNITY SPOTLIGHT
   ═══════════════════════════════════════════════════════════════════ */

function CommunitySpotlight({ onSelect }: { onSelect: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-[13px] font-bold text-foreground">Communities</p>
        </div>
        <button onClick={() => navigate("/rooms")} className="text-[12px] text-primary font-semibold hover:underline">
          See all
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 px-1 no-scrollbar">
        {lounges.map((lounge, i) => {
          const liveCount = ALL_ROOMS.filter((r) => r.loungeId === lounge.id && r.isLive).length;
          return (
            <motion.button
              key={lounge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(lounge.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.06] transition-all min-w-[88px]"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {lounge.emoji}
              </div>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight max-w-[72px]">{lounge.name}</span>
              {liveCount > 0 && (
                <div className="flex items-center gap-1">
                  <LiveDot sm />
                  <span className="text-[10px] font-bold text-green-400">{liveCount}</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ENHANCED ROOM CARD
   ═══════════════════════════════════════════════════════════════════ */

function EnhancedRoomCard({ room, index }: { room: LoungeRoom; index: number }) {
  const navigate = useNavigate();
  const spotsLeft = room.maxParticipants - room.participants.length;
  const fillRatio = room.participants.length / room.maxParticipants;
  const isHot = fillRatio >= 0.7;
  const isFull = spotsLeft === 0;
  const lounge = lounges.find((l) => l.id === room.loungeId);
  const modeStyle = MODE_COLORS[room.mode] ?? MODE_COLORS["Open Floor"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: "easeOut" }}
      className={
        "relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group bg-white/[0.02] " +
        (isHot && !isFull
          ? "border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.1)]"
          : "border-white/[0.08] hover:border-primary/30 hover:shadow-[0_0_24px_rgba(124,58,237,0.1)]")
      }
      onClick={() => navigate("/room/" + room.id)}
    >
      {/* Top gradient strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${lounge?.gradient ?? "from-primary to-accent"} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="p-4">
        {/* Header row: community + badges */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + room.loungeId); }}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            {lounge && (
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-[10px]`}>
                {lounge.emoji}
              </div>
            )}
            <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              {room.loungeName}
            </span>
          </button>

          <div className="flex items-center gap-2">
            {isHot && !isFull && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5"
              >
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400">Hot</span>
              </motion.div>
            )}
            <div className="flex items-center gap-1">
              <LiveDot sm />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-foreground leading-snug mb-2 group-hover:text-primary/90 transition-colors">
          {room.name}
        </h3>

        {/* Topic & mode */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
            {room.mode}
          </span>
          <span className="text-[11px] text-muted-foreground bg-white/5 rounded-full px-2 py-0.5 flex items-center gap-1">
            <Hash className="h-3 w-3" /> {room.topic}
          </span>
        </div>

        {/* Participants row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {room.participants.slice(0, 4).map((p) => (
                <img key={p.id} src={p.avatar_url} alt="" className="w-7 h-7 rounded-full border-2 border-background" />
              ))}
              {room.participants.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-background flex items-center justify-center">
                  <span className="text-[9px] font-bold text-foreground">+{room.participants.length - 4}</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-foreground truncate">
                Hosted by <span className="text-primary font-semibold">@{room.host.username}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                {room.participants.length} speaking
                {!isFull ? (
                  <span className={spotsLeft <= 2 ? "text-orange-400 font-semibold" : "text-green-400"}>
                    {" "}· {spotsLeft} left
                  </span>
                ) : (
                  <span className="text-destructive/70"> · Full</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              disabled={isFull}
              onClick={(e) => { e.stopPropagation(); navigate("/room/" + room.id); }}
              className={
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all " +
                (isFull
                  ? "bg-white/10 text-muted-foreground cursor-not-allowed"
                  : isHot
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.35)] hover:shadow-[0_0_24px_rgba(249,115,22,0.5)]"
                    : "bg-primary text-white shadow-[0_0_16px_rgba(124,58,237,0.3)] hover:shadow-[0_0_24px_rgba(124,58,237,0.45)]")
              }
            >
              <Mic className="h-3.5 w-3.5" />
              {isFull ? "Full" : "Join"}
            </motion.button>
            <LevelBadge level={room.host.english_level} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STARTING SOON CARD
   ═══════════════════════════════════════════════════════════════════ */

function StartingSoonCard({ room, index }: { room: LoungeRoom; index: number }) {
  const navigate = useNavigate();
  const [notified, setNotified] = useState(false);
  const lounge = lounges.find((l) => l.id === room.loungeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      className="flex-shrink-0 w-[280px] p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-primary/25 transition-all"
    >
      <div className="flex items-center gap-2 mb-2.5">
        {lounge && (
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-xs`}>
            {lounge.emoji}
          </div>
        )}
        <span className="text-[11px] font-semibold text-muted-foreground">{room.loungeName}</span>
        <span className="ml-auto text-[11px] font-bold text-amber-400 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Starting soon
        </span>
      </div>

      <h4 className="text-[14px] font-bold text-foreground leading-snug mb-3">{room.name}</h4>

      <div className="flex items-center gap-2 mb-3">
        <img src={room.host.avatar_url} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-[11px] text-muted-foreground">@{room.host.username}</span>
        <span className="text-[11px] text-muted-foreground">·</span>
        <LevelBadge level={room.host.english_level} />
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setNotified(!notified)}
          className={
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold border transition-all " +
            (notified
              ? "bg-green-500/10 border-green-500/25 text-green-400"
              : "bg-white/[0.05] border-white/[0.1] text-foreground hover:bg-white/[0.08]")
          }
        >
          <Bell className="h-3.5 w-3.5" />
          {notified ? "Notified" : "Notify Me"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/lounge/" + room.loungeId)}
          className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RECENTLY ENDED CARD
   ═══════════════════════════════════════════════════════════════════ */

function RecentlyEndedCard({ room, index }: { room: typeof RECENTLY_ENDED[0]; index: number }) {
  const navigate = useNavigate();
  const lounge = lounges.find((l) => l.id === room.loungeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all cursor-pointer"
      onClick={() => navigate("/lounge/" + room.loungeId)}
    >
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
        <Play className="h-4 w-4 text-muted-foreground ml-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground truncate">{room.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground">{room.loungeName}</span>
          <span className="text-[11px] text-muted-foreground/50">·</span>
          <span className="text-[11px] text-muted-foreground">{room.duration}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-[11px] text-muted-foreground">{room.endedAt}</span>
        <p className="text-[10px] text-primary font-semibold mt-0.5">{room.participants} joined</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════ */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
      >
        <Waves className="h-8 w-8 text-primary/60" />
      </motion.div>
      <h3 className="text-[18px] font-extrabold text-foreground mb-2">No rooms found</h3>
      <p className="text-[14px] text-muted-foreground max-w-[260px] leading-relaxed mb-6">
        Try adjusting your filters or explore trending topics below
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-[300px] mb-6">
        {["Debate", "Business", "Grammar", "AI"].map((tag) => (
          <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[12px] text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClear}
        className="px-6 py-2.5 rounded-full bg-primary text-white text-[13px] font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_28px_rgba(124,58,237,0.45)] transition-shadow"
      >
        Clear all filters
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════ */

function SectionHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[14px] font-bold text-foreground">{title}</h3>
      </div>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPLORE PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function ExplorePage({ onMenuOpen = () => {} }: ExplorePageProps) {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeMode,  setActiveMode]  = useState("All");
  const [activeDen,   setActiveDen]   = useState("All");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── Filtering logic ── */
  const filtered = useMemo(() => {
    return ALL_ROOMS.filter((room) => {
      if (activeLevel !== "All" && room.host.english_level !== activeLevel) return false;
      if (activeMode  !== "All" && room.mode                !== activeMode)  return false;
      if (activeDen   !== "All" && room.loungeId            !== activeDen)   return false;
      if (activeTopic && !room.topic.toLowerCase().includes(activeTopic.toLowerCase()) && !room.name.toLowerCase().includes(activeTopic.toLowerCase())) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!room.name.toLowerCase().includes(q) &&
            !room.loungeName.toLowerCase().includes(q) &&
            !room.host.username.toLowerCase().includes(q) &&
            !room.topic.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, activeLevel, activeMode, activeDen, activeTopic]);

  /* ── Grouping ── */
  const grouped = useMemo(() => {
    const hasActiveFilter = activeDen !== "All" || activeLevel !== "All" || activeMode !== "All" || activeTopic || search.trim();
    if (hasActiveFilter) {
      return [{ loungeName: "Results", rooms: filtered }];
    }
    const map: Record<string, LoungeRoom[]> = {};
    filtered.forEach((room) => {
      if (!map[room.loungeName]) map[room.loungeName] = [];
      map[room.loungeName].push(room);
    });
    return Object.entries(map).map(([loungeName, rooms]) => ({ loungeName, rooms }));
  }, [filtered, activeDen, activeLevel, activeMode, activeTopic, search]);

  /* ── Featured room (most popular live room) ── */
  const featuredRoom = useMemo(() => {
    if (search || activeLevel !== "All" || activeMode !== "All" || activeDen !== "All" || activeTopic) return null;
    return [...ALL_ROOMS].sort((a, b) => b.participants.length - a.participants.length)[0];
  }, [search, activeLevel, activeMode, activeDen, activeTopic]);

  /* ── Recommended for user level ── */
  const recommended = useMemo(() => {
    if (search || activeLevel !== "All" || activeMode !== "All" || activeDen !== "All" || activeTopic) return [];
    return ALL_ROOMS.filter((r) => r.host.english_level === currentUser.english_level && r.id !== featuredRoom?.id).slice(0, 2);
  }, [search, activeLevel, activeMode, activeDen, activeTopic, featuredRoom]);

  const hasFilters = activeLevel !== "All" || activeMode !== "All" || activeDen !== "All" || activeTopic !== null;
  const totalListeners = ALL_ROOMS.reduce((a, r) => a + r.participants.length, 0);

  const clearAll = () => {
    setSearch("");
    setActiveLevel("All");
    setActiveMode("All");
    setActiveDen("All");
    setActiveTopic(null);
    setFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════
          STICKY HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 h-[53px]">
          <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-extrabold text-foreground">Explore</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Discover live voice rooms</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate("/lounge/l1")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-[0_0_16px_rgba(124,58,237,0.3)]"
          >
            <Mic className="h-3.5 w-3.5" /> Create
          </motion.button>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-primary/40 focus-within:shadow-[0_0_16px_rgba(124,58,237,0.15)] transition-all">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms, topics, hosts..."
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground flex-shrink-0 p-0.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Filter pills row */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all " +
              (hasFilters
                ? "bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-white/20")
            }
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasFilters && (
              <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {[activeLevel !== "All", activeMode !== "All", activeDen !== "All", activeTopic !== null].filter(Boolean).length}
              </span>
            )}
          </motion.button>

          <div className="w-px h-4 bg-white/10 flex-shrink-0" />

          {/* Quick level filters */}
          {LEVELS.filter((l) => l !== "All").map((l) => (
            <FilterChip key={l} label={l} active={activeLevel === l} onClick={() => setActiveLevel(activeLevel === l ? "All" : l)} />
          ))}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/[0.07]"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mode */}
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-2">Room Mode</p>
                  <div className="flex flex-wrap gap-2">
                    {MODES.map((m) => (
                      <FilterChip key={m} label={m} active={activeMode === m} onClick={() => setActiveMode(m)} />
                    ))}
                  </div>
                </div>
                {/* Community */}
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-2">Community</p>
                  <div className="flex flex-wrap gap-2">
                    <FilterChip label="All" active={activeDen === "All"} onClick={() => setActiveDen("All")} />
                    {lounges.map((l) => (
                      <FilterChip
                        key={l.id}
                        label={l.emoji + " " + l.name}
                        active={activeDen === l.id}
                        onClick={() => setActiveDen(activeDen === l.id ? "All" : l.id)}
                      />
                    ))}
                  </div>
                </div>
                {/* Clear */}
                {hasFilters && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={clearAll}
                    className="text-[12px] font-semibold text-destructive/70 hover:text-destructive transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear all filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          LIVE STATS BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-b border-white/[0.07] px-4 py-3.5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <LiveDot />
            <span className="text-[13px] font-bold text-foreground">
              <AnimatedCounter target={filtered.length} /> rooms live
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[13px]"><AnimatedCounter target={totalListeners} /> speaking now</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
            <Globe className="h-3.5 w-3.5" />
            <span className="text-[13px]">{lounges.length} communities</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 px-4 py-5 space-y-8">

        {/* Active filter chips */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {activeLevel !== "All" && (
                <button onClick={() => setActiveLevel("All")} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[12px] font-semibold hover:bg-primary/20 transition-colors">
                  Level: {activeLevel} <X className="h-3 w-3" />
                </button>
              )}
              {activeMode !== "All" && (
                <button onClick={() => setActiveMode("All")} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[12px] font-semibold hover:bg-primary/20 transition-colors">
                  Mode: {activeMode} <X className="h-3 w-3" />
                </button>
              )}
              {activeDen !== "All" && (
                <button onClick={() => setActiveDen("All")} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[12px] font-semibold hover:bg-primary/20 transition-colors">
                  {lounges.find((l) => l.id === activeDen)?.name} <X className="h-3 w-3" />
                </button>
              )}
              {activeTopic && (
                <button onClick={() => setActiveTopic(null)} className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[12px] font-semibold hover:bg-orange-500/20 transition-colors">
                  #{activeTopic} <X className="h-3 w-3" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDen + activeLevel + activeMode + activeTopic + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* ── Featured Room (only when no filters) ── */}
              {featuredRoom && !hasFilters && !search && (
                <section>
                  <SectionHeader
                    icon={<Zap className="h-4 w-4 text-primary" />}
                    title="Featured"
                  />
                  <FeaturedRoom
                    room={featuredRoom}
                    onJoin={() => navigate("/room/" + featuredRoom.id)}
                  />
                </section>
              )}

              {/* ── Trending Topics (only when no filters) ── */}
              {!hasFilters && !search && (
                <section>
                  <TrendingTopics onSelect={setActiveTopic} activeTopic={activeTopic} />
                </section>
              )}

              {/* ── Community Spotlight (only when no filters) ── */}
              {!hasFilters && !search && (
                <section>
                  <CommunitySpotlight onSelect={(id) => { setActiveDen(id); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                </section>
              )}

              {/* ── Recommended for your level ── */}
              {recommended.length > 0 && !hasFilters && !search && (
                <section>
                  <SectionHeader
                    icon={<Star className="h-4 w-4 text-amber-400" />}
                    title={`Recommended for ${currentUser.english_level}`}
                    action={<span className="text-[11px] text-muted-foreground">Based on your level</span>}
                  />
                  <div className="space-y-3">
                    {recommended.map((room, i) => (
                      <EnhancedRoomCard key={room.id} room={room} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* ── Room Groups ── */}
              {grouped.map(({ loungeName, rooms }) => {
                const lounge = lounges.find((l) => l.name === loungeName);
                return (
                  <section key={loungeName}>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        {lounge && (
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-base`}>
                            {lounge.emoji}
                          </div>
                        )}
                        <h3 className="text-[15px] font-bold text-foreground">{loungeName}</h3>
                        <span className="text-[11px] text-muted-foreground bg-white/[0.05] px-2 py-0.5 rounded-full">
                          {rooms.length} room{rooms.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      {lounge && (
                        <button
                          onClick={() => navigate("/lounge/" + lounge.id)}
                          className="text-[12px] text-primary font-semibold hover:underline flex items-center gap-0.5"
                        >
                          View <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {rooms.map((room, i) => (
                        <EnhancedRoomCard key={room.id} room={room} index={i} />
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* ── Starting Soon (only when no filters) ── */}
              {!hasFilters && !search && STARTING_SOON.length > 0 && (
                <section>
                  <SectionHeader
                    icon={<Clock className="h-4 w-4 text-sky-400" />}
                    title="Starting Soon"
                    action={<span className="text-[11px] text-muted-foreground">Get notified</span>}
                  />
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
                    {STARTING_SOON.map((room, i) => (
                      <StartingSoonCard key={room.id} room={room} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* ── Recently Ended (only when no filters) ── */}
              {!hasFilters && !search && RECENTLY_ENDED.length > 0 && (
                <section>
                  <SectionHeader
                    icon={<Volume2 className="h-4 w-4 text-muted-foreground" />}
                    title="Recently Ended"
                    action={<span className="text-[11px] text-muted-foreground">Catch up</span>}
                  />
                  <div className="space-y-2">
                    {RECENTLY_ENDED.map((room, i) => (
                      <RecentlyEndedCard key={room.id} room={room} index={i} />
                    ))}
                  </div>
                </section>
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
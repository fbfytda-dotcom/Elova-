#!/usr/bin/env python3
"""Run from your Elova project root: python3 fix_explore.py"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ {path}")

w("src/pages/ExplorePage.tsx", r'''
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Users, Search, SlidersHorizontal, X,
  ChevronDown, Menu, Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { sampleRooms, loungeUsers, lounges } from "@/lib/lounge-data";
import type { LoungeRoom } from "@/lib/lounge-data";

interface ExplorePageProps { onMenuOpen?: () => void; }

const currentUser = loungeUsers[0];

// Extend mock rooms so the page feels full
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

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400 border-green-500/20",
  "Debate":     "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Teach Me":   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Hot Seat":   "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const LEVELS = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
const MODES  = ["All", "Open Floor", "Debate", "Teach Me", "Hot Seat"];

function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={"relative flex flex-shrink-0 " + s}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={"relative inline-flex rounded-full bg-green-500 " + s} />
    </span>
  );
}

// ─── HERO STATS BAR ───────────────────────────────────────────────────────────
function HeroBar({ total }: { total: number }) {
  const totalListeners = ALL_ROOMS.reduce((a, r) => a + r.participants.length, 0);
  return (
    <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-white/[0.07] px-4 py-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <LiveDot />
          <span className="text-[13px] font-bold text-foreground">{total} rooms live</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span className="text-[13px]">{totalListeners} speaking now</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
          <Globe className="h-3.5 w-3.5" />
          <span className="text-[13px]">{lounges.length} communities</span>
        </div>
      </div>
    </div>
  );
}

// ─── FILTER PILL ──────────────────────────────────────────────────────────────
function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={
        "flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all " +
        (active
          ? "bg-primary text-white border-primary"
          : "bg-white/5 text-muted-foreground border-white/[0.08] hover:border-white/20 hover:text-foreground")
      }
    >
      {label}
    </motion.button>
  );
}

// ─── ROOM CARD ────────────────────────────────────────────────────────────────
function RoomCard({ room, index }: { room: LoungeRoom; index: number }) {
  const navigate = useNavigate();
  const spotsLeft = room.maxParticipants - room.participants.length;
  const lounge = lounges.find((l) => l.id === room.loungeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: "easeOut" }}
      className="border border-white/[0.08] rounded-2xl p-4 hover:border-primary/35 hover:bg-white/[0.025] transition-all cursor-pointer bg-white/[0.02] group"
      onClick={() => navigate("/room/" + room.id)}
    >
      {/* Community tag */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + room.loungeId); }}
        className="flex items-center gap-1.5 mb-2.5 hover:opacity-80 transition-opacity"
      >
        {lounge && (
          <div className={"w-5 h-5 rounded-md bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-[11px] flex-shrink-0"}>
            {lounge.emoji}
          </div>
        )}
        <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          {room.loungeName}
        </span>
      </button>

      {/* Main row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <LiveDot sm />
              <span className="text-[11px] text-green-400 font-bold uppercase tracking-wide">Live</span>
            </div>
            <span className={"text-[11px] font-bold px-2 py-0.5 rounded-full border " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground border-white/10")}>
              {room.mode}
            </span>
          </div>
          {/* Room name */}
          <p className="text-[15px] font-bold text-foreground leading-snug mb-2.5 group-hover:text-primary/90 transition-colors">
            {room.name}
          </p>
          {/* Participants + host */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {room.participants.slice(0, 5).map((p) => (
                <img key={p.id} src={p.avatar_url} alt="" className="w-6 h-6 rounded-full border-2 border-background" />
              ))}
              {room.participants.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                  <span className="text-[8px] text-primary font-bold">+{room.participants.length - 5}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-[11px] text-foreground">
                Hosted by <span className="text-primary font-semibold">@{room.host.username}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                {room.participants.length} speaking
                {spotsLeft > 0
                  ? <span className="text-green-400"> · {spotsLeft} spots left</span>
                  : <span className="text-destructive/70"> · Full</span>
                }
              </p>
            </div>
          </div>
        </div>

        {/* Right: join + level */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            disabled={spotsLeft === 0}
            onClick={(e) => { e.stopPropagation(); navigate("/room/" + room.id); }}
            className={
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors " +
              (spotsLeft > 0
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white/10 text-muted-foreground cursor-not-allowed")
            }
          >
            <Mic className="h-3.5 w-3.5" />
            {spotsLeft > 0 ? "Join" : "Full"}
          </motion.button>
          <LevelBadge level={room.host.english_level} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── EXPLORE PAGE ─────────────────────────────────────────────────────────────
export default function ExplorePage({ onMenuOpen = () => {} }: ExplorePageProps) {
  const [search, setSearch]           = useState("");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeMode,  setActiveMode]  = useState("All");
  const [activeDen,   setActiveDen]   = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return ALL_ROOMS.filter((room) => {
      if (activeLevel !== "All" && room.host.english_level !== activeLevel) return false;
      if (activeMode  !== "All" && room.mode                !== activeMode)  return false;
      if (activeDen   !== "All" && room.loungeId            !== activeDen)   return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!room.name.toLowerCase().includes(q) &&
            !room.loungeName.toLowerCase().includes(q) &&
            !room.host.username.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, activeLevel, activeMode, activeDen]);

  // Group by community
  const grouped = useMemo(() => {
    if (activeDen !== "All" || activeLevel !== "All" || activeMode !== "All" || search.trim()) {
      return [{ loungeName: "Results", rooms: filtered }];
    }
    const map: Record<string, LoungeRoom[]> = {};
    filtered.forEach((room) => {
      if (!map[room.loungeName]) map[room.loungeName] = [];
      map[room.loungeName].push(room);
    });
    return Object.entries(map).map(([loungeName, rooms]) => ({ loungeName, rooms }));
  }, [filtered, activeDen, activeLevel, activeMode, search]);

  const hasFilters = activeLevel !== "All" || activeMode !== "All" || activeDen !== "All";

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 h-[53px]">
          <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-[17px] font-extrabold text-foreground flex-1">Global Rooms</h1>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate("/lounge/l1")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors"
          >
            <Mic className="h-3.5 w-3.5" /> Create
          </motion.button>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-primary/40 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms, topics, hosts..."
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills row */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={"flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all " + (hasFilters ? "bg-primary/15 text-primary border-primary/30" : "bg-white/5 text-muted-foreground border-white/[0.08] hover:border-white/20")}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {hasFilters && "·"}
            {hasFilters && <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{[activeLevel !== "All", activeMode !== "All", activeDen !== "All"].filter(Boolean).length}</span>}
          </button>
          <div className="w-px h-4 bg-white/10 flex-shrink-0" />
          {/* Quick level filters */}
          {LEVELS.filter((l) => l !== "All").map((l) => (
            <FilterPill key={l} label={l} active={activeLevel === l} onClick={() => setActiveLevel(activeLevel === l ? "All" : l)} />
          ))}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/[0.07]"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mode */}
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-2">Room Mode</p>
                  <div className="flex flex-wrap gap-2">
                    {MODES.map((m) => (
                      <FilterPill key={m} label={m} active={activeMode === m} onClick={() => setActiveMode(m)} />
                    ))}
                  </div>
                </div>
                {/* Community */}
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-2">Community</p>
                  <div className="flex flex-wrap gap-2">
                    <FilterPill label="All" active={activeDen === "All"} onClick={() => setActiveDen("All")} />
                    {lounges.map((l) => (
                      <FilterPill key={l.id} label={l.emoji + " " + l.name} active={activeDen === l.id} onClick={() => setActiveDen(activeDen === l.id ? "All" : l.id)} />
                    ))}
                  </div>
                </div>
                {/* Clear */}
                {hasFilters && (
                  <button onClick={() => { setActiveLevel("All"); setActiveMode("All"); setActiveDen("All"); setFiltersOpen(false); }} className="text-[12px] font-semibold text-destructive/70 hover:text-destructive transition-colors">
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HERO STATS ── */}
      <HeroBar total={filtered.length} />

      {/* ── CONTENT ── */}
      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
              <Mic className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-[18px] font-bold text-foreground">No rooms found</p>
            <p className="text-[14px] text-muted-foreground max-w-[240px]">Try adjusting your filters or search term</p>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => { setSearch(""); setActiveLevel("All"); setActiveMode("All"); setActiveDen("All"); }} className="mt-2 px-5 py-2 rounded-full bg-primary/15 text-primary text-sm font-bold border border-primary/25 hover:bg-primary/25 transition-colors">
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeDen + activeLevel + activeMode + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-6">
              {grouped.map(({ loungeName, rooms }) => {
                const lounge = lounges.find((l) => l.name === loungeName);
                return (
                  <div key={loungeName}>
                    {/* Section header */}
                    {grouped.length > 1 && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {lounge && (
                            <div className={"w-7 h-7 rounded-lg bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-base"}>
                              {lounge.emoji}
                            </div>
                          )}
                          <p className="text-[14px] font-bold text-foreground">{loungeName}</p>
                          <span className="text-[11px] text-muted-foreground">{rooms.length} room{rooms.length > 1 ? "s" : ""}</span>
                        </div>
                        {lounge && (
                          <button onClick={() => navigate("/lounge/" + lounge.id)} className="text-[12px] text-primary font-semibold hover:underline">
                            View community
                          </button>
                        )}
                      </div>
                    )}
                    {/* Room cards */}
                    <div className="space-y-3">
                      {rooms.map((room, i) => (
                        <RoomCard key={room.id} room={room} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
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

print("\n✅ Done! Run: npm run dev")
print("   Then click 'Global Rooms' in the left panel to see the new page.")

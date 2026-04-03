#!/usr/bin/env python3
"""
Elova Update Script — Lounges, For You page, and Lounge detail page.
Run from your project root: python3 update_project.py
"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ {path}")

# ── 1. LOUNGE DATA & TYPES ─────────────────────────────────────────────────────
w("src/lib/lounge-data.ts", '''import type { EnglishLevel } from "./types";

export type RoomMode = "Open Floor" | "Debate" | "Teach Me" | "Hot Seat";

export interface LoungeUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  english_level: EnglishLevel;
  xp_points: number;
  streak_count: number;
  is_online: boolean;
  bio?: string;
}

export interface Lounge {
  id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  memberCount: number;
  activeRooms: number;
  gradient: string;
}

export interface LoungeRoom {
  id: string;
  name: string;
  loungeId: string;
  loungeName: string;
  host: LoungeUser;
  participants: LoungeUser[];
  maxParticipants: number;
  mode: RoomMode;
  topic: string;
  isLive: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: LoungeUser;
  upvotes: number;
  createdAt: string;
}

export interface Post {
  id: string;
  loungeId: string;
  loungeName: string;
  title: string;
  content: string;
  author: LoungeUser;
  upvotes: number;
  comments: Comment[];
  createdAt: string;
  isPinned?: boolean;
}

const u1: LoungeUser = { id: "u1", username: "alex_speaks", full_name: "Alex Chen", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4", english_level: "C1", xp_points: 4820, streak_count: 14, is_online: true, bio: "Debate enthusiast and coffee addict" };
const u2: LoungeUser = { id: "u2", username: "maria_talks", full_name: "Maria Santos", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria&backgroundColor=ffdfbf", english_level: "B2", xp_points: 3150, streak_count: 7, is_online: true, bio: "Learning English through football debates" };
const u3: LoungeUser = { id: "u3", username: "james_w", full_name: "James Wilson", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=d1d4f9", english_level: "A2", xp_points: 890, streak_count: 3, is_online: false, bio: "Just getting started!" };
const u4: LoungeUser = { id: "u4", username: "priya_v", full_name: "Priya Venkat", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede", english_level: "B1", xp_points: 2340, streak_count: 21, is_online: true, bio: "Tech writer working on fluency" };
const u5: LoungeUser = { id: "u5", username: "chen_l", full_name: "Chen Li", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen&backgroundColor=ffd5dc", english_level: "C2", xp_points: 9210, streak_count: 45, is_online: true, bio: "Native-level speaker, here to help" };

export const loungeUsers = [u1, u2, u3, u4, u5];

export const lounges: Lounge[] = [
  { id: "l1", name: "Daily Debate", slug: "daily-debate", description: "Hot takes, controversial opinions, and spirited discussions", emoji: "🔥", memberCount: 2847, activeRooms: 2, gradient: "from-orange-500 to-red-600" },
  { id: "l2", name: "Business English", slug: "business-english", description: "Nail your presentations, emails, and boardroom talk", emoji: "💼", memberCount: 1923, activeRooms: 1, gradient: "from-blue-500 to-indigo-600" },
  { id: "l3", name: "Beginner Corner", slug: "beginner-corner", description: "Zero judgment zone. Every question is a good one", emoji: "🌱", memberCount: 4102, activeRooms: 1, gradient: "from-green-500 to-emerald-600" },
  { id: "l4", name: "Football Talk", slug: "football-talk", description: "Match analysis, transfers, and endless hot takes", emoji: "⚽", memberCount: 3341, activeRooms: 1, gradient: "from-lime-400 to-green-600" },
  { id: "l5", name: "Tech and AI", slug: "tech-ai", description: "The future is happening. Let us talk about it", emoji: "🤖", memberCount: 2156, activeRooms: 1, gradient: "from-violet-500 to-purple-700" },
  { id: "l6", name: "Creative Writing", slug: "creative-writing", description: "Stories, poetry, and the art of expression", emoji: "✍️", memberCount: 1287, activeRooms: 0, gradient: "from-pink-500 to-rose-600" },
];

export const sampleRooms: LoungeRoom[] = [
  { id: "r1", name: "Is remote work killing company culture?", loungeId: "l1", loungeName: "Daily Debate", host: u1, participants: [u1, u2, u5], maxParticipants: 8, mode: "Debate", topic: "Remote work vs office", isLive: true },
  { id: "r2", name: "AI will take every job — agree or disagree?", loungeId: "l1", loungeName: "Daily Debate", host: u5, participants: [u5, u4, u2, u3], maxParticipants: 10, mode: "Open Floor", topic: "AI and the future of work", isLive: true },
  { id: "r3", name: "Pitch Practice: Sell me this pen", loungeId: "l2", loungeName: "Business English", host: u4, participants: [u4, u1], maxParticipants: 6, mode: "Hot Seat", topic: "Business pitching", isLive: true },
  { id: "r4", name: "Simple English: Tell me about your week", loungeId: "l3", loungeName: "Beginner Corner", host: u5, participants: [u5, u3, u2], maxParticipants: 6, mode: "Open Floor", topic: "Casual conversation practice", isLive: true },
  { id: "r5", name: "Champions League semi-final breakdown", loungeId: "l4", loungeName: "Football Talk", host: u2, participants: [u2, u1, u4, u3], maxParticipants: 12, mode: "Open Floor", topic: "UCL analysis", isLive: true },
  { id: "r6", name: "Claude vs GPT — which actually wins?", loungeId: "l5", loungeName: "Tech and AI", host: u1, participants: [u1, u5], maxParticipants: 8, mode: "Debate", topic: "AI model comparison", isLive: true },
];

export const samplePosts: Post[] = [
  { id: "p1", loungeId: "l1", loungeName: "Daily Debate", title: "Grammar mistakes do not matter when speaking — unpopular opinion", content: "Hear me out. Communication is about getting your point across. I have seen C2 speakers lose arguments to B1 speakers because confidence matters more than perfect grammar. The obsession with grammar in speaking is actively holding people back from ever opening their mouths.", author: u1, upvotes: 342, comments: [], createdAt: "2h ago", isPinned: true },
  { id: "p2", loungeId: "l1", loungeName: "Daily Debate", title: "Social media has made people worse at real conversation", content: "We spend hours scrolling but our conversational skills are deteriorating. Short-form content has destroyed our ability to hold a sustained argument. The average attention span in a room is now under 90 seconds. Change my mind.", author: u5, upvotes: 218, comments: [], createdAt: "4h ago" },
  { id: "p3", loungeId: "l2", loungeName: "Business English", title: "Phrases that instantly make you sound more professional", content: "After years of business meetings, here are phrases that elevate speakers: Build on that point. Let me reframe that. What I am hearing is. These signal active listening and intelligence. Stop using basically and like in professional settings — they undermine everything else you say.", author: u4, upvotes: 567, comments: [], createdAt: "1d ago", isPinned: true },
  { id: "p4", loungeId: "l3", loungeName: "Beginner Corner", title: "I spoke English with a stranger for the first time today!", content: "I have been learning for 8 months and today I asked for directions and the person understood me perfectly! It is a small win but it feels enormous. This community helped me get here. Thank you all so much.", author: u3, upvotes: 891, comments: [], createdAt: "3h ago" },
  { id: "p5", loungeId: "l4", loungeName: "Football Talk", title: "Best vocabulary for describing a goal in English — let us build a list", content: "I struggle to describe football moments in English. I know scored but what about the rest? Top corner, tap-in, worldie, screamer, curler, header, volley. Share your football vocabulary in the comments and let us build the ultimate list together.", author: u2, upvotes: 445, comments: [], createdAt: "5h ago" },
  { id: "p6", loungeId: "l5", loungeName: "Tech and AI", title: "Using AI to practice English: 6 months in, honest review", content: "The good: always available, no judgment, infinite patience. The bad: it never challenges you, it is too agreeable, and it validates everything you say. Nothing replaces speaking with real humans who will actually push back and disagree with you.", author: u1, upvotes: 623, comments: [], createdAt: "6h ago" },
];
''')

# ── 2. HOME PAGE ───────────────────────────────────────────────────────────────
w("src/pages/HomePage.tsx", '''import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Flame, Mic, Users, ArrowRight, ArrowBigUp, ArrowBigDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { sampleRooms, samplePosts, loungeUsers } from "@/lib/lounge-data";
import type { LoungeRoom, Post } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];
const liveRooms = sampleRooms.filter((r) => r.isLive);

const modeColors: Record<string, string> = {
  "Open Floor": "bg-green-500/20 text-green-400",
  "Debate": "bg-orange-500/20 text-orange-400",
  "Teach Me": "bg-blue-500/20 text-blue-400",
  "Hot Seat": "bg-purple-500/20 text-purple-400",
};

function LiveDot({ size = "sm" }: { size?: "sm" | "xs" }) {
  const s = size === "xs" ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={`relative flex ${s}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={`relative inline-flex rounded-full ${s} bg-green-500`} />
    </span>
  );
}

function LiveRoomCard({ room }: { room: LoungeRoom }) {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/lounge/${room.loungeId}`)}
      className="flex-shrink-0 w-52 glass-panel p-3 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <LiveDot size="xs" />
        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live</span>
        <span className="ml-auto text-[10px] text-muted-foreground truncate max-w-[80px]">{room.loungeName}</span>
      </div>
      <p className="text-xs font-semibold text-foreground line-clamp-2 mb-2 leading-snug">{room.name}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {room.participants.slice(0, 3).map((p) => (
            <img key={p.id} src={p.avatar_url} alt="" className="w-5 h-5 rounded-full border border-card" />
          ))}
          {room.participants.length > 3 && (
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-card flex items-center justify-center">
              <span className="text-[8px] text-primary font-bold">+{room.participants.length - 3}</span>
            </div>
          )}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Users className="h-3 w-3" />{room.participants.length}/{room.maxParticipants}
        </span>
      </div>
    </motion.div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(post.upvotes);
  const [voted, setVoted] = useState<1 | -1 | 0>(0);

  const handleVote = (dir: 1 | -1) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voted === dir) { setVotes(post.upvotes); setVoted(0); }
    else { setVotes(post.upvotes + dir); setVoted(dir); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel overflow-hidden cursor-pointer hover:border-white/20 transition-colors"
      onClick={() => navigate(`/lounge/${post.loungeId}`)}
    >
      <div className="flex">
        <div className="flex flex-col items-center py-4 px-3 gap-1 border-r border-white/5">
          <button onClick={handleVote(1)} className={`transition-colors ${voted === 1 ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
            <ArrowBigUp className="h-5 w-5" />
          </button>
          <span className="text-xs font-bold text-foreground">{votes}</span>
          <button onClick={handleVote(-1)} className={`transition-colors ${voted === -1 ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
            <ArrowBigDown className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">{post.loungeName}</span>
            {post.isPinned && <span className="text-[10px] text-amber-400 font-bold">📌 Pinned</span>}
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1.5 leading-snug">{post.title}</h3>
          <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <img src={post.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
            <span className="text-[10px] text-muted-foreground">@{post.author.username}</span>
            <LevelBadge level={post.author.english_level} />
            <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground ml-auto transition-colors" onClick={(e) => e.stopPropagation()}>
              <MessageSquare className="h-3.5 w-3.5" /> {post.comments.length} replies
            </button>
            <span className="text-[10px] text-muted-foreground/60">{post.createdAt}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SuggestedRoomCard({ room }: { room: LoungeRoom }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-4 border-l-2 border-primary/40 hover:border-primary/70 transition-colors cursor-pointer"
      onClick={() => navigate(`/lounge/${room.loungeId}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <LiveDot size="xs" />
            <span className="text-[10px] text-green-400 font-bold">LIVE IN {room.loungeName.toUpperCase()}</span>
          </div>
          <p className="text-sm font-bold text-foreground mb-2 leading-snug">{room.name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modeColors[room.mode] ?? "bg-white/10 text-muted-foreground"}`}>
              {room.mode}
            </span>
            <div className="flex -space-x-1">
              {room.participants.slice(0, 4).map((p) => (
                <img key={p.id} src={p.avatar_url} alt="" className="w-5 h-5 rounded-full border border-card" />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{room.participants.length}/{room.maxParticipants}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors"
          onClick={(e) => { e.stopPropagation(); navigate(`/lounge/${room.loungeId}`); }}
        >
          <Mic className="h-3 w-3" /> Join
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const feed: { type: "post" | "room"; id: string; data: Post | LoungeRoom }[] = [];
  samplePosts.forEach((post, i) => {
    feed.push({ type: "post", id: post.id, data: post });
    if ((i + 1) % 2 === 0 && liveRooms[Math.floor(i / 2)]) {
      const room = liveRooms[Math.floor(i / 2)];
      feed.push({ type: "room", id: `room-${room.id}`, data: room });
    }
  });

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight gradient-text">
                Good morning, {currentUser.full_name.split(" ")[0]} 👋
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-orange-400" />
                {currentUser.streak_count} day streak · {currentUser.xp_points.toLocaleString()} XP
              </p>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <LiveDot />
                Live Now
                <span className="text-xs font-normal text-muted-foreground">({liveRooms.length} rooms)</span>
              </h2>
              <button className="text-[10px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
                See all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {liveRooms.map((room) => (
                <LiveRoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-foreground mb-3">For You</h2>
            <div className="space-y-3">
              {feed.map((item, i) =>
                item.type === "post" ? (
                  <PostCard key={item.id} post={item.data as Post} index={i} />
                ) : (
                  <SuggestedRoomCard key={item.id} room={item.data as LoungeRoom} />
                )
              )}
            </div>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
''')

# ── 3. ROOMS PAGE (now Lounges browser) ────────────────────────────────────────
w("src/pages/RoomsPage.tsx", '''import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { lounges } from "@/lib/lounge-data";
import type { Lounge } from "@/lib/lounge-data";

function LoungeCard({ lounge, index }: { lounge: Lounge; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/lounge/${lounge.id}`)}
      className="glass-panel overflow-hidden cursor-pointer group"
    >
      <div className={`h-20 bg-gradient-to-r ${lounge.gradient} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{lounge.emoji}</span>
        {lounge.activeRooms > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span className="text-[10px] text-green-300 font-bold">{lounge.activeRooms} live</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-foreground mb-1">{lounge.name}</h3>
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{lounge.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{lounge.memberCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{lounge.activeRooms} rooms</span>
          </div>
          <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Enter →</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const filtered = lounges.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground mb-3">Lounges</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lounges..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </header>
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lounge, i) => (
              <LoungeCard key={lounge.id} lounge={lounge} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm font-semibold text-foreground">No lounges found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
''')

# ── 4. LOUNGE PAGE (new) ───────────────────────────────────────────────────────
w("src/pages/LoungePage.tsx", '''import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Mic, ArrowBigUp, ArrowBigDown, MessageSquare } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { lounges, sampleRooms, samplePosts } from "@/lib/lounge-data";
import type { Post, LoungeRoom } from "@/lib/lounge-data";

type Tab = "posts" | "rooms";

const modeColors: Record<string, string> = {
  "Open Floor": "bg-green-500/20 text-green-400",
  "Debate": "bg-orange-500/20 text-orange-400",
  "Teach Me": "bg-blue-500/20 text-blue-400",
  "Hot Seat": "bg-purple-500/20 text-purple-400",
};

function PostItem({ post, index }: { post: Post; index: number }) {
  const [votes, setVotes] = useState(post.upvotes);
  const [voted, setVoted] = useState<1 | -1 | 0>(0);
  const handleVote = (dir: 1 | -1) => () => {
    if (voted === dir) { setVotes(post.upvotes); setVoted(0); }
    else { setVotes(post.upvotes + dir); setVoted(dir); }
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-panel overflow-hidden"
    >
      <div className="flex">
        <div className="flex flex-col items-center py-4 px-3 gap-1 border-r border-white/5">
          <button onClick={handleVote(1)} className={`transition-colors ${voted === 1 ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
            <ArrowBigUp className="h-5 w-5" />
          </button>
          <span className="text-xs font-bold text-foreground">{votes}</span>
          <button onClick={handleVote(-1)} className={`transition-colors ${voted === -1 ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
            <ArrowBigDown className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-4 min-w-0">
          {post.isPinned && <p className="text-[10px] text-amber-400 font-bold mb-1">📌 Pinned</p>}
          <h3 className="text-sm font-bold text-foreground mb-1.5 leading-snug">{post.title}</h3>
          <p className="text-xs text-foreground/75 leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <img src={post.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
            <span className="text-[10px] text-muted-foreground">@{post.author.username}</span>
            <LevelBadge level={post.author.english_level} />
            <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground ml-auto transition-colors">
              <MessageSquare className="h-3.5 w-3.5" /> {post.comments.length} replies
            </button>
            <span className="text-[10px] text-muted-foreground/60">{post.createdAt}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function RoomItem({ room, index }: { room: LoungeRoom; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-panel p-4 hover:border-white/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wide">Live</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modeColors[room.mode] ?? "bg-white/10 text-muted-foreground"}`}>
              {room.mode}
            </span>
          </div>
          <p className="text-sm font-bold text-foreground mb-2 leading-snug">{room.name}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <img src={room.host.avatar_url} alt="" className="w-4 h-4 rounded-full" />
              <span className="text-[10px] text-muted-foreground">hosted by @{room.host.username}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex -space-x-1">
                {room.participants.slice(0, 5).map((p) => (
                  <img key={p.id} src={p.avatar_url} alt="" className="w-5 h-5 rounded-full border border-card" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> {room.participants.length}/{room.maxParticipants}
              </span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/room/${room.id}`)}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <Mic className="h-3 w-3" /> Join
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function LoungePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("posts");
  const [joined, setJoined] = useState(false);

  const lounge = lounges.find((l) => l.id === id);
  if (!lounge) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Lounge not found</p>
      </div>
    );
  }

  const loungePosts = samplePosts.filter((p) => p.loungeId === id);
  const loungeRooms = sampleRooms.filter((r) => r.loungeId === id);

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0">
        {/* Banner */}
        <div className={`h-36 bg-gradient-to-r ${lounge.gradient} relative`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-4 md:left-6 flex items-end gap-3">
            <span className="text-5xl drop-shadow-lg">{lounge.emoji}</span>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow">{lounge.name}</h1>
              <p className="text-xs text-white/70 mt-0.5">{lounge.description}</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="glass-panel-strong rounded-none border-x-0 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />{lounge.memberCount.toLocaleString()} members
            </span>
            {lounge.activeRooms > 0 && (
              <span className="flex items-center gap-1.5 text-green-400 font-semibold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                {lounge.activeRooms} live rooms
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setJoined(!joined)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              joined
                ? "bg-white/10 text-foreground border border-white/10 hover:bg-destructive/20 hover:text-destructive"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {joined ? "Joined ✓" : "+ Join Lounge"}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 flex gap-1">
          {(["posts", "rooms"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative py-3 px-4 text-sm font-semibold capitalize transition-colors ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "rooms" ? `Rooms · ${loungeRooms.length}` : `Posts · ${loungePosts.length}`}
              {tab === t && (
                <motion.div layoutId="lounge-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            {tab === "posts" ? (
              <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {loungePosts.length > 0
                  ? loungePosts.map((post, i) => <PostItem key={post.id} post={post} index={i} />)
                  : <p className="text-center text-muted-foreground py-16 text-sm">No posts yet. Be the first!</p>
                }
              </motion.div>
            ) : (
              <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {loungeRooms.length > 0
                  ? loungeRooms.map((room, i) => <RoomItem key={room.id} room={room} index={i} />)
                  : <p className="text-center text-muted-foreground py-16 text-sm">No active rooms right now.</p>
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
''')

# ── 5. APP.TSX (add lounge route) ─────────────────────────────────────────────
w("src/App.tsx", '''import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import RoomsPage from "./pages/RoomsPage";
import CommunityPage from "./pages/CommunityPage";
import GamesPage from "./pages/GamesPage";
import VoiceRoomPage from "./pages/VoiceRoomPage";
import ProfilePage from "./pages/ProfilePage";
import LoungePage from "./pages/LoungePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/room/:id" element={<VoiceRoomPage />} />
          <Route path="/lounge/:id" element={<LoungePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
''')

print("\n✅ Done! All 5 files updated.")
print("   Run: npm run dev")
print("   Then open http://localhost:8080")

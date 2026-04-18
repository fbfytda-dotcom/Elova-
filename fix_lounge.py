#!/usr/bin/env python3
"""
Run this from your Elova project root:
  python3 fix_lounge.py
It writes LoungePage.tsx directly into your project.
"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ {path}")

# ── APP.TSX ────────────────────────────────────────────────────────────────────
w("src/App.tsx", '''import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalLayout } from "@/components/GlobalLayout";
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

function AppInner() {
  const [panelOpen, setPanelOpen] = useState(false);
  const openMenu = () => setPanelOpen(true);
  const closeMenu = () => setPanelOpen(false);

  return (
    <GlobalLayout panelOpen={panelOpen} onPanelClose={closeMenu}>
      <Routes>
        <Route path="/"           element={<HomePage      onMenuOpen={openMenu} />} />
        <Route path="/explore"    element={<ExplorePage   onMenuOpen={openMenu} />} />
        <Route path="/rooms"      element={<RoomsPage     onMenuOpen={openMenu} />} />
        <Route path="/community"  element={<CommunityPage onMenuOpen={openMenu} />} />
        <Route path="/games"      element={<GamesPage     onMenuOpen={openMenu} />} />
        <Route path="/room/:id"   element={<VoiceRoomPage onMenuOpen={openMenu} />} />
        <Route path="/lounge/:id" element={<LoungePage    onMenuOpen={openMenu} />} />
        <Route path="/profile"    element={<ProfilePage   onMenuOpen={openMenu} />} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
    </GlobalLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
''')

# ── LOUNGE PAGE ────────────────────────────────────────────────────────────────
LOUNGE = r'''import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Users, Mic, ChevronUp, ChevronDown,
  MessageSquare, Share, MoreHorizontal, Plus, X,
  Send, Image as ImageIcon, Video, Hash, Search,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { lounges, sampleRooms, samplePosts, loungeUsers } from "@/lib/lounge-data";
import type { Post, LoungeRoom, Comment } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];
type DenTab = "posts" | "rooms" | "forums";

interface ForumMessage {
  id: string;
  content: string;
  author: typeof loungeUsers[0];
  createdAt: string;
  upvotes: number;
}
interface Forum {
  id: string;
  title: string;
  topic: string;
  createdBy: typeof loungeUsers[0];
  createdAt: string;
  messages: ForumMessage[];
}

const MOCK_FORUMS: Forum[] = [
  {
    id: "f1", title: "What is the hardest English phrasal verb you have mastered?",
    topic: "Vocabulary", createdBy: loungeUsers[0], createdAt: "2h ago",
    messages: [
      { id: "m1", content: "For me it was put up with. Took months to stop saying tolerate.", author: loungeUsers[0], createdAt: "2h ago", upvotes: 12 },
      { id: "m2", content: "Mine was get over it. The literal meaning kept confusing me.", author: loungeUsers[1], createdAt: "1h ago", upvotes: 8 },
      { id: "m3", content: "Fall through! Sounds so unnatural at first but now I use it constantly.", author: loungeUsers[4], createdAt: "45m ago", upvotes: 5 },
    ],
  },
  {
    id: "f2", title: "Share a sentence you said this week that surprised yourself",
    topic: "Progress", createdBy: loungeUsers[3], createdAt: "5h ago",
    messages: [
      { id: "m4", content: "I said that is beside the point in a meeting. Six months ago I did not know that expression.", author: loungeUsers[3], createdAt: "5h ago", upvotes: 24 },
      { id: "m5", content: "I used I beg to differ in an argument. Felt amazing!", author: loungeUsers[2], createdAt: "4h ago", upvotes: 19 },
    ],
  },
  {
    id: "f3", title: "British English vs American English — which should we learn?",
    topic: "Debate", createdBy: loungeUsers[4], createdAt: "1d ago",
    messages: [
      { id: "m6", content: "American English is more globally dominant in media and tech. Practical choice.", author: loungeUsers[4], createdAt: "1d ago", upvotes: 31 },
      { id: "m7", content: "British English sounds more sophisticated in academic contexts.", author: loungeUsers[0], createdAt: "23h ago", upvotes: 28 },
      { id: "m8", content: "Just pick one and be consistent. Dialect matters less than fluency.", author: loungeUsers[1], createdAt: "20h ago", upvotes: 45 },
    ],
  },
  {
    id: "f4", title: "Resources that helped you break through the B2 plateau",
    topic: "Resources", createdBy: loungeUsers[1], createdAt: "2d ago",
    messages: [
      { id: "m9", content: "Podcasts at native speed with no subtitles. Painful for two weeks then everything clicked.", author: loungeUsers[1], createdAt: "2d ago", upvotes: 67 },
      { id: "m10", content: "Shadowing technique. Repeat everything immediately after hearing it.", author: loungeUsers[3], createdAt: "2d ago", upvotes: 53 },
    ],
  },
];

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400 border-green-500/20",
  "Debate":     "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Teach Me":   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Hot Seat":   "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={"relative flex flex-shrink-0 " + s}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={"relative inline-flex rounded-full bg-green-500 " + s} />
    </span>
  );
}

function VotePill({ initial }: { initial: number }) {
  const [votes, setVotes] = useState(initial);
  const [voted, setVoted] = useState<1 | -1 | 0>(0);
  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
  const up = (e: React.MouseEvent) => { e.stopPropagation(); if (voted === 1) { setVoted(0); setVotes(initial); } else { setVoted(1); setVotes(initial + 1); } };
  const down = (e: React.MouseEvent) => { e.stopPropagation(); if (voted === -1) { setVoted(0); setVotes(initial); } else { setVoted(-1); setVotes(initial - 1); } };
  return (
    <div className="flex items-center rounded-full bg-white/[0.07] border border-white/[0.08] overflow-hidden h-8" onClick={(e) => e.stopPropagation()}>
      <motion.button whileTap={{ scale: 1.2 }} onClick={up} className={"px-2.5 h-full flex items-center transition-colors " + (voted === 1 ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}><ChevronUp className="h-4 w-4" /></motion.button>
      <span className={"text-[13px] font-bold px-1 " + (voted === 1 ? "text-primary" : voted === -1 ? "text-destructive" : "text-foreground")}>{fmt(votes)}</span>
      <motion.button whileTap={{ scale: 1.2 }} onClick={down} className={"px-2.5 h-full flex items-center transition-colors " + (voted === -1 ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10")}><ChevronDown className="h-4 w-4" /></motion.button>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [showReplies, setShowReplies] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const replyRef = useRef<HTMLInputElement>(null);

  const submitReply = () => {
    if (!replyText.trim()) return;
    setComments((prev) => [{ id: "c" + Date.now(), content: replyText, author: currentUser, upvotes: 0, createdAt: "just now" }, ...prev]);
    setReplyText("");
  };

  return (
    <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-white/[0.07] hover:bg-white/[0.012] transition-colors">
      <div className="px-4 pt-4 pb-3 cursor-pointer" onClick={() => setTextExpanded((e) => !e)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <img src={post.author.avatar_url} alt="" className="w-6 h-6 rounded-full border border-white/10 flex-shrink-0" />
            <span className="text-[13px] font-bold text-foreground">{post.author.full_name}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-[12px] text-muted-foreground">@{post.author.username}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-[12px] text-muted-foreground">{post.createdAt}</span>
            {post.isPinned && <span className="text-[11px] text-amber-400 font-semibold">Pinned</span>}
          </div>
          <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-full hover:bg-white/8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
        {post.title && <h2 className="text-[18px] font-bold text-foreground leading-snug mb-2">{post.title}</h2>}
        <p className={"text-[14px] text-foreground/85 leading-[1.6] " + (!textExpanded ? "line-clamp-3" : "")} style={{ wordBreak: "break-word" }}>{post.content}</p>
        {post.mediaType === "image" && post.mediaUrl && (
          <div className="mt-3 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}><img src={post.mediaUrl} alt="" className="w-full object-cover max-h-[400px] rounded-xl" loading="lazy" /></div>
        )}
        {post.mediaType === "video" && post.mediaUrl && (
          <div className="mt-3 rounded-xl overflow-hidden bg-black/60" onClick={(e) => e.stopPropagation()}><video src={post.mediaUrl} controls muted playsInline className="w-full max-h-[400px] rounded-xl" /></div>
        )}
        <div className="flex items-center gap-2 mt-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
          <VotePill initial={post.upvotes} />
          <motion.button whileTap={{ scale: 1.1 }} onClick={(e) => { e.stopPropagation(); setShowReplies(true); setTimeout(() => replyRef.current?.focus(), 200); }} className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/[0.07] border border-white/[0.08] text-muted-foreground hover:text-sky-400 hover:bg-sky-400/10 transition-colors">
            <MessageSquare className="h-3.5 w-3.5" /><span className="text-[13px] font-semibold">{comments.length > 0 ? comments.length : "Comment"}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 1.1 }} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/[0.07] border border-white/[0.08] text-muted-foreground hover:text-violet-400 hover:bg-violet-400/10 transition-colors">
            <Share className="h-3.5 w-3.5" /><span className="text-[13px] font-semibold">Share</span>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {showReplies && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="bg-[#0a0e18] border-t border-white/[0.06]">
              <div className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.05]">
                <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" />
                <div className="flex-1">
                  <input ref={replyRef} type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }} placeholder="What are your thoughts?" className="w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
                  {replyText.trim() && (
                    <div className="flex justify-end mt-2"><motion.button whileTap={{ scale: 0.94 }} onClick={submitReply} className="px-4 h-8 rounded-full text-[13px] font-bold bg-primary text-white">Reply</motion.button></div>
                  )}
                </div>
              </div>
              {comments.length === 0
                ? <div className="px-4 py-6 text-center"><p className="text-sm text-muted-foreground/60">No replies yet.</p></div>
                : <div className="divide-y divide-white/[0.04]">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3 px-4 py-3">
                        <img src={c.author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1"><span className="text-[13px] font-bold text-foreground">{c.author.full_name}</span><span className="text-[11px] text-muted-foreground">{c.createdAt}</span></div>
                          <p className="text-[13px] text-foreground/85 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
              <button onClick={() => setShowReplies(false)} className="w-full py-2.5 text-[12px] text-muted-foreground hover:text-foreground font-semibold hover:bg-white/5 flex items-center justify-center gap-1"><ChevronUp className="h-3.5 w-3.5" /> Hide replies</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ComposePostModal({ open, onClose, loungeName, onPost }: { open: boolean; onClose: () => void; loungeName: string; onPost: (p: Post) => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaPreview({ url: URL.createObjectURL(file), type: file.type.startsWith("video") ? "video" : "image" });
  };

  const handlePost = () => {
    if (!text.trim() && !title.trim()) return;
    onPost({ id: "p" + Date.now(), content: text, title: title || undefined, author: currentUser, upvotes: 0, reposts: 0, comments: [], createdAt: "just now", mediaType: mediaPreview?.type ?? "text", mediaUrl: mediaPreview?.url });
    setTitle(""); setText(""); setMediaPreview(null); onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[560px] bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              <div className="text-center"><p className="text-sm font-bold text-foreground">New Post</p><p className="text-[11px] text-primary">in {loungeName}</p></div>
              <motion.button whileTap={{ scale: 0.94 }} onClick={handlePost} disabled={!text.trim() && !title.trim()} className={"px-5 py-1.5 rounded-full text-sm font-bold " + ((text.trim() || title.trim()) ? "bg-primary text-white" : "bg-primary/20 text-primary/40 cursor-not-allowed")}>Post</motion.button>
            </div>
            <div className="flex gap-3 px-5 py-4">
              <img src={currentUser.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full bg-transparent text-[17px] font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
                <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What is on your mind?" rows={4} className="w-full bg-transparent text-[15px] text-foreground/90 placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed" />
                {mediaPreview && (
                  <div className="relative rounded-xl overflow-hidden">
                    {mediaPreview.type === "image" ? <img src={mediaPreview.url} alt="" className="w-full max-h-48 object-cover rounded-xl" /> : <video src={mediaPreview.url} controls className="w-full max-h-48 rounded-xl" />}
                    <button onClick={() => setMediaPreview(null)} className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"><X className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 px-5 py-3 border-t border-white/[0.07]">
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
              <button onClick={() => fileRef.current?.click()} className="p-2 rounded-full hover:bg-white/5 text-primary"><ImageIcon className="h-5 w-5" /></button>
              <button onClick={() => { if (fileRef.current) { fileRef.current.accept = "video/*"; fileRef.current.click(); } }} className="p-2 rounded-full hover:bg-white/5 text-primary"><Video className="h-5 w-5" /></button>
              <div className="ml-auto"><span className="text-xs text-muted-foreground">{280 - text.length}</span></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function RoomCard({ room, index }: { room: LoungeRoom; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border border-white/[0.08] rounded-2xl p-4 hover:border-primary/30 hover:bg-white/[0.02] transition-all cursor-pointer bg-white/[0.02]" onClick={() => navigate("/room/" + room.id)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <LiveDot sm />
            <span className="text-[11px] text-green-400 font-bold uppercase tracking-wide">Live</span>
            <span className={"text-[11px] font-bold px-2 py-0.5 rounded-full border " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground border-white/10")}>{room.mode}</span>
          </div>
          <p className="text-[15px] font-bold text-foreground leading-snug">{room.name}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); navigate("/room/" + room.id); }} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors">
          <Mic className="h-3.5 w-3.5" /> Join
        </motion.button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">{room.participants.map((p) => (<img key={p.id} src={p.avatar_url} alt="" className="w-7 h-7 rounded-full border-2 border-background" />))}</div>
          <div>
            <p className="text-[12px] text-foreground font-medium">Hosted by <span className="text-primary">@{room.host.username}</span></p>
            <p className="text-[11px] text-muted-foreground">{room.participants.length} speaking · {room.maxParticipants - room.participants.length} spots left</p>
          </div>
        </div>
        <LevelBadge level={room.host.english_level} />
      </div>
    </motion.div>
  );
}

function CreateRoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [mode, setMode] = useState("Open Floor");
  const [maxSlots, setMaxSlots] = useState(8);
  const modes = ["Open Floor", "Debate", "Teach Me", "Hot Seat"];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[480px] bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-2xl mx-4 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              <p className="text-sm font-bold text-foreground">Create a Room</p>
              <motion.button whileTap={{ scale: 0.94 }} disabled={!roomName.trim()} onClick={() => { onClose(); navigate("/room/new"); }} className={"px-5 py-1.5 rounded-full text-sm font-bold " + (roomName.trim() ? "bg-primary text-white" : "bg-primary/20 text-primary/40 cursor-not-allowed")}>Create</motion.button>
            </div>
            <div className="px-5 py-5 space-y-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Room Name *</label>
                <input autoFocus value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="What will you talk about?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Mode</label>
                <div className="grid grid-cols-2 gap-2">{modes.map((m) => (<button key={m} onClick={() => setMode(m)} className={"px-3 py-2.5 rounded-xl border text-sm font-medium transition-all " + (mode === m ? "border-primary/50 bg-primary/10 text-primary" : "border-white/[0.08] bg-white/5 text-muted-foreground hover:text-foreground")}>{m}</button>))}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Max Participants: {maxSlots}</label>
                <input type="range" min={2} max={20} value={maxSlots} onChange={(e) => setMaxSlots(Number(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1"><span>2</span><span>20</span></div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ForumThread({ forum, onBack }: { forum: Forum; onBack: () => void }) {
  const [messages, setMessages] = useState<ForumMessage[]>(forum.messages);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: "m" + Date.now(), content: text, author: currentUser, createdAt: "just now", upvotes: 0 }]);
    setText("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "60vh" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] sticky top-0 z-10 bg-background/90 backdrop-blur">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground flex-shrink-0"><ArrowLeft className="h-4 w-4" /></button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground line-clamp-1">{forum.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-primary font-semibold"># {forum.topic}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-[11px] text-muted-foreground">{messages.length} messages</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <img src={forum.createdBy.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10" />
            <span className="text-[13px] font-bold text-foreground">{forum.createdBy.full_name}</span>
            <LevelBadge level={forum.createdBy.english_level} />
            <span className="text-[11px] text-muted-foreground ml-auto">{forum.createdAt}</span>
          </div>
          <p className="text-[15px] font-semibold text-foreground leading-snug">{forum.title}</p>
        </div>
        {messages.map((msg, i) => {
          const isMe = msg.author.id === currentUser.id;
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={"flex gap-2.5 " + (isMe ? "flex-row-reverse" : "")}>
              <img src={msg.author.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
              <div className={"max-w-[75%] flex flex-col " + (isMe ? "items-end" : "items-start")}>
                {!isMe && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[12px] font-bold text-foreground">{msg.author.full_name}</span>
                    <LevelBadge level={msg.author.english_level} />
                    <span className="text-[10px] text-muted-foreground">{msg.createdAt}</span>
                  </div>
                )}
                <div className={"px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed " + (isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white/[0.07] border border-white/[0.08] text-foreground/90 rounded-tl-sm")}>{msg.content}</div>
                {isMe && <span className="text-[10px] text-muted-foreground mt-1">{msg.createdAt}</span>}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-white/[0.07] px-4 py-3 bg-background/90 backdrop-blur sticky bottom-16 z-10">
        <div className="flex items-end gap-2">
          <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mb-0.5" />
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-primary/40 transition-colors flex items-center gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Reply to this forum..." className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={send} disabled={!text.trim()} className={"p-1.5 rounded-full transition-all " + (text.trim() ? "bg-primary text-white" : "bg-white/5 text-muted-foreground cursor-not-allowed")}>
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateForumModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (f: Forum) => void }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("General");
  const topics = ["Vocabulary", "Grammar", "Pronunciation", "Culture", "Debate", "Progress", "Resources", "General"];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[480px] bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              <p className="text-sm font-bold text-foreground">New Forum Thread</p>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => { if (!title.trim()) return; onCreate({ id: "f" + Date.now(), title, topic, createdBy: currentUser, createdAt: "just now", messages: [] }); setTitle(""); setTopic("General"); onClose(); }} disabled={!title.trim()} className={"px-5 py-1.5 rounded-full text-sm font-bold " + (title.trim() ? "bg-primary text-white" : "bg-primary/20 text-primary/40 cursor-not-allowed")}>Create</motion.button>
            </div>
            <div className="px-5 py-5 space-y-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Thread Title *</label>
                <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ask a question or start a discussion..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Topic Tag</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (<button key={t} onClick={() => setTopic(t)} className={"px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all " + (topic === t ? "bg-primary/15 border-primary/40 text-primary" : "bg-white/5 border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/20")}>#{t}</button>))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ForumsTab() {
  const [forums, setForums] = useState<Forum[]>(MOCK_FORUMS);
  const [activeThread, setActiveThread] = useState<Forum | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = forums.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()) || f.topic.toLowerCase().includes(search.toLowerCase()));

  if (activeThread) return <ForumThread forum={activeThread} onBack={() => setActiveThread(null)} />;

  return (
    <div>
      <div className="px-4 py-4 border-b border-white/[0.07]">
        <div className="flex items-center justify-between mb-3">
          <div><p className="text-[15px] font-bold text-foreground">Forums</p><p className="text-[12px] text-muted-foreground mt-0.5">Ongoing discussions</p></div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> New Thread</motion.button>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-colors">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search forums..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
        </div>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {filtered.length === 0
          ? <div className="px-4 py-12 text-center"><Hash className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm font-semibold text-foreground">No forums yet</p><p className="text-xs text-muted-foreground mt-1">Start the first thread</p></div>
          : filtered.map((forum, i) => (
              <motion.button key={forum.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setActiveThread(forum)} className="w-full px-4 py-4 hover:bg-white/[0.03] transition-colors text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Hash className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-foreground leading-snug line-clamp-2">{forum.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">#{forum.topic}</span>
                      <span className="text-[11px] text-muted-foreground">by @{forum.createdBy.username}</span>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-[11px] text-muted-foreground">{forum.createdAt}</span>
                    </div>
                    {forum.messages.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={forum.messages[forum.messages.length - 1].author.avatar_url} alt="" className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0" />
                        <p className="text-[12px] text-muted-foreground line-clamp-1 italic">{forum.messages[forum.messages.length - 1].content}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0"><MessageSquare className="h-3.5 w-3.5" /><span className="text-[12px] font-semibold">{forum.messages.length}</span></div>
                </div>
              </motion.button>
            ))
        }
      </div>
      <CreateForumModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={(f) => setForums((prev) => [f, ...prev])} />
    </div>
  );
}

export default function LoungePage({ onMenuOpen = () => {} }: { onMenuOpen?: () => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<DenTab>("posts");
  const [joined, setJoined] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  const lounge = lounges.find((l) => l.id === id);
  if (!lounge) return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Community not found</p></div>;

  const loungeRooms = sampleRooms.filter((r) => r.loungeId === id);
  const loungePosts = samplePosts.filter((p) => p.loungeId === id);
  const allPosts = [...localPosts, ...(loungePosts.length >= 3 ? loungePosts : [...loungePosts, ...samplePosts.filter((p) => p.loungeId !== id).slice(0, 3 - loungePosts.length)])];

  const userLevelOrder = ["C2", "C1", "B2", "B1", "A2", "A1"];
  const userLevelIdx = userLevelOrder.indexOf(currentUser.english_level);
  const suggestedRooms = sampleRooms.filter((r) => r.loungeId !== id).sort((a, b) => Math.abs(userLevelOrder.indexOf(a.host.english_level) - userLevelIdx) - Math.abs(userLevelOrder.indexOf(b.host.english_level) - userLevelIdx)).slice(0, 4);

  const tabs: { key: DenTab; label: string }[] = [{ key: "posts", label: "Posts" }, { key: "rooms", label: "Rooms" }, { key: "forums", label: "Forums" }];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className={"h-32 bg-gradient-to-r " + lounge.gradient + " relative flex-shrink-0"}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"><ArrowLeft className="h-4 w-4" /></button>
        <button onClick={onMenuOpen} className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <div className="w-14 h-14 rounded-2xl bg-black/30 backdrop-blur border border-white/20 flex items-center justify-center text-3xl shadow-lg">{lounge.emoji}</div>
          <div><h1 className="text-xl font-extrabold text-white tracking-tight drop-shadow">{lounge.name}</h1><p className="text-xs text-white/70 mt-0.5">{lounge.description}</p></div>
        </div>
      </div>

      <div className="bg-background border-b border-white/[0.07] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{lounge.memberCount.toLocaleString()} members</span>
          {lounge.activeRooms > 0 && <span className="flex items-center gap-1.5 text-green-400 font-semibold"><LiveDot sm />{lounge.activeRooms} live</span>}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setJoined(!joined)} className={"px-4 py-1.5 rounded-full text-xs font-bold transition-all " + (joined ? "bg-white/10 text-foreground border border-white/10" : "bg-primary text-white hover:opacity-90")}>
          {joined ? "Joined ✓" : "+ Join"}
        </motion.button>
      </div>

      <div className="bg-background border-b border-white/[0.07] flex flex-shrink-0 sticky top-0 z-30">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={"relative flex-1 py-3.5 text-[14px] font-bold transition-colors " + (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}>
            {t.label}
            {tab === t.key && <motion.div layoutId="den-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => setComposeOpen(true)} className="flex items-center gap-3 px-4 py-3 w-full border-b border-white/[0.07] hover:bg-white/[0.02] transition-colors">
                <img src={currentUser.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10 flex-shrink-0" />
                <span className="text-[14px] text-muted-foreground/50 flex-1 text-left">Share something with {lounge.name}...</span>
              </button>
              {allPosts.length === 0
                ? <div className="px-4 py-16 text-center"><p className="text-sm font-semibold text-foreground">No posts yet</p><p className="text-xs text-muted-foreground mt-1">Be the first to post in {lounge.name}</p></div>
                : allPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
              }
              <div className="h-24" />
            </motion.div>
          )}

          {tab === "rooms" && (
            <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="px-4 py-4 border-b border-white/[0.07] flex items-center justify-between">
                <div><p className="text-[15px] font-bold text-foreground">Live Rooms</p><p className="text-[12px] text-muted-foreground mt-0.5">Matched to your level · {currentUser.english_level}</p></div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} onClick={() => setCreateRoomOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Create</motion.button>
              </div>
              {loungeRooms.length > 0 && (
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">In {lounge.name}</p>
                  <div className="space-y-3">{loungeRooms.map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}</div>
                </div>
              )}
              <div className="px-4 pt-4 pb-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Suggested for you</p>
                <div className="space-y-3">
                  {suggestedRooms.map((room, i) => (
                    <div key={room.id}><p className="text-[10px] text-muted-foreground/50 mb-1.5 font-medium">from {room.loungeName}</p><RoomCard room={room} index={i} /></div>
                  ))}
                </div>
              </div>
              <div className="h-24" />
            </motion.div>
          )}

          {tab === "forums" && (
            <motion.div key="forums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ForumsTab />
              <div className="h-24" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ComposePostModal open={composeOpen} onClose={() => setComposeOpen(false)} loungeName={lounge.name} onPost={(p) => setLocalPosts((prev) => [p, ...prev])} />
      <CreateRoomModal open={createRoomOpen} onClose={() => setCreateRoomOpen(false)} />
      <BottomNav />
    </div>
  );
}
'''

w("src/pages/LoungePage.tsx", LOUNGE)
print("\nAll done! Run: npm run dev")

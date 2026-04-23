// src/pages/HomePage.tsx — paste this entire file into src/pages/HomePage.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  ChevronUp, ChevronDown, MessageSquare, Share2, Search,
  MoreHorizontal, Mic, MicOff, Users, Menu, X, ArrowLeft,
  Image as ImageIcon, Video, Trophy, Flame, Zap, Plus,
  Send, Bookmark, BookmarkCheck, Radio, TrendingUp,
  Sparkles, Globe, Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import {
  samplePosts, suggestedCommunities, loungeUsers, lounges,
} from "@/lib/lounge-data";
import type { Post, SuggestedCommunity, Comment } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];
type FeedTab = "foryou" | "following";

const fmt = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1_000   ? (n / 1_000).toFixed(1) + "K"
  : String(n);

const easeOutExpo    = [0.16, 1, 0.3, 1] as const;
const easeInOutQuint = [0.83, 0, 0.17, 1] as const;

// ─── Live Dot ─────────────────────────────────────────────────────────────────
function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={`relative flex flex-shrink-0 ${s}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className={`relative inline-flex rounded-full bg-emerald-500 ${s}`} />
    </span>
  );
}

// ─── Voice recorder hook ───────────────────────────────────────────────────────
function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl]   = useState<string | null>(null);
  const [seconds, setSeconds]     = useState(0);
  const media  = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer  = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = () => {
        setAudioUrl(URL.createObjectURL(new Blob(chunks.current, { type: "audio/webm" })));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      media.current = mr;
      setRecording(true);
      setSeconds(0);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stop = () => {
    media.current?.stop();
    setRecording(false);
    if (timer.current) clearInterval(timer.current);
  };

  const clear = () => { setAudioUrl(null); setSeconds(0); };
  return { recording, audioUrl, seconds, start, stop, clear };
}

// ─── Search Overlay ────────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const navigate  = useNavigate();

  const posts = q.trim() ? samplePosts.filter((p) =>
    (p.title ?? p.content).toLowerCase().includes(q.toLowerCase()) ||
    p.author.full_name.toLowerCase().includes(q.toLowerCase())) : [];

  const comms = q.trim() ? lounges.filter((l) =>
    l.name.toLowerCase().includes(q.toLowerCase())) : [];

  const close = () => { setQ(""); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f1a]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 max-w-[1100px] mx-auto">
              <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1.5 rounded-full hover:bg-white/[0.06]">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-primary/40 transition-all">
                <Search className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                <input
                  autoFocus type="text" value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search posts, people, communities…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                />
                {q && (
                  <button onClick={() => setQ("")} className="text-muted-foreground/40 hover:text-foreground flex-shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            {q.trim() && (
              <div className="max-h-[65vh] overflow-y-auto max-w-[1100px] mx-auto pb-6">
                {comms.length > 0 && (
                  <div className="mb-2">
                    <p className="px-4 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground/40 font-bold flex items-center gap-2">
                      <Globe className="h-3 w-3" /> Communities
                    </p>
                    {comms.map((l, i) => (
                      <motion.button key={l.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => { navigate(`/lounge/${l.id}`); close(); }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.03] group"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                          {l.emoji}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{l.name}</p>
                          <p className="text-xs text-muted-foreground/60">{l.memberCount.toLocaleString()} members</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
                {posts.length > 0 && (
                  <div>
                    <p className="px-4 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground/40 font-bold flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" /> Posts
                    </p>
                    {posts.map((post, i) => (
                      <motion.button key={post.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => { navigate(`/post/${post.id}`); close(); }}
                        className="w-full flex items-start gap-3.5 px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.03] text-left"
                      >
                        <img src={post.author.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{post.author.full_name}</p>
                          <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed mt-0.5">{post.title ?? post.content}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
                {posts.length === 0 && comms.length === 0 && (
                  <div className="px-4 py-16 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                      <Search className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground/60">No results for &ldquo;{q}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Compose Modal ─────────────────────────────────────────────────────────────
function ComposeModal({
  open, onClose, onPost,
}: { open: boolean; onClose: () => void; onPost: (p: Post) => void }) {
  const [title, setTitle] = useState("");
  const [text, setText]   = useState("");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const voice   = useVoiceRecorder();
  const canPost = text.trim() || title.trim();

  useEffect(() => { if (open) setTimeout(() => textRef.current?.focus(), 120); }, [open]);

  const reset = () => { setTitle(""); setText(""); setMedia(null); voice.clear(); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMedia({ url: URL.createObjectURL(f), type: f.type.startsWith("video") ? "video" : "image" });
  };

  const post = () => {
    if (!canPost) return;
    onPost({
      id: `p${Date.now()}`,
      content: text,
      title: title || undefined,
      author: currentUser,
      upvotes: 1,
      reposts: 0,
      comments: [],
      createdAt: "just now",
      mediaType: media?.type ?? "text",
      mediaUrl: media?.url,
    });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl"
            onClick={() => { reset(); onClose(); }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[580px] mx-4 bg-[#0d1117] rounded-3xl border border-white/[0.08] shadow-[0_32px_96px_rgba(0,0,0,0.7)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <button onClick={() => { reset(); onClose(); }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-all">
                <X className="h-5 w-5" />
              </button>
              <p className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary/60" /> New Post
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                disabled={!canPost} onClick={post}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  canPost
                    ? "bg-primary text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] hover:bg-primary/90"
                    : "bg-primary/15 text-primary/35 cursor-not-allowed"
                }`}>
                Post
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex gap-3.5 px-5 py-5 max-h-[65vh] overflow-y-auto">
              <img src={currentUser.avatar_url} alt=""
                className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 mt-1 ring-2 ring-white/[0.04]" />
              <div className="flex-1 space-y-3">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title…"
                  className="w-full bg-transparent text-lg font-bold text-foreground placeholder:text-white/15 focus:outline-none tracking-tight" />
                <textarea ref={textRef} value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?" rows={4}
                  className="w-full bg-transparent text-[15px] text-foreground/85 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed" />

                <AnimatePresence>
                  {media && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="relative rounded-2xl overflow-hidden border border-white/[0.08] group"
                    >
                      {media.type === "image"
                        ? <img src={media.url} alt="" className="w-full max-h-60 object-cover" />
                        : <video src={media.url} controls className="w-full max-h-60 rounded-2xl" />}
                      <button onClick={() => setMedia(null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90">
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {voice.audioUrl && !voice.recording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.08]"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <audio src={voice.audioUrl} controls className="flex-1 h-8" />
                      <button onClick={voice.clear} className="text-muted-foreground/40 hover:text-destructive transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {voice.recording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      </span>
                      <span className="text-sm text-red-400 font-bold tabular-nums tracking-wider">
                        {String(Math.floor(voice.seconds / 60)).padStart(2, "0")}:{String(voice.seconds % 60).padStart(2, "0")}
                      </span>
                      <div className="flex-1 flex items-end gap-0.5 px-2 h-6">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div key={i}
                            className="flex-1 bg-red-400/50 rounded-full"
                            animate={{ scaleY: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.04, ease: "easeInOut" }}
                            style={{ originY: 1 }}
                          />
                        ))}
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={voice.stop}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/25 transition-colors">
                        <X className="h-3 w-3" /> Stop
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-3.5 border-t border-white/[0.06] bg-white/[0.015]">
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
              <button onClick={() => fileRef.current?.click()}
                className="p-2.5 rounded-xl hover:bg-white/[0.08] text-primary/60 hover:text-primary transition-all" title="Image">
                <ImageIcon className="h-5 w-5" />
              </button>
              <button onClick={() => { if (fileRef.current) { fileRef.current.accept = "video/*"; fileRef.current.click(); } }}
                className="p-2.5 rounded-xl hover:bg-white/[0.08] text-primary/60 hover:text-primary transition-all" title="Video">
                <Video className="h-5 w-5" />
              </button>
              <button
                onClick={() => voice.recording ? voice.stop() : voice.start()}
                className={`p-2.5 rounded-xl transition-all ${
                  voice.recording ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "hover:bg-white/[0.08] text-primary/60 hover:text-primary"
                }`}>
                {voice.recording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <div className="ml-auto flex items-center gap-3">
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle
                      cx="16" cy="16" r="14" fill="none"
                      stroke={text.length > 280 ? "#ef4444" : text.length > 240 ? "#f59e0b" : "#7c3aed"}
                      strokeWidth="3"
                      strokeDasharray={`${Math.min((text.length / 280) * 87.96, 87.96)} 87.96`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${text.length > 280 ? "text-red-400" : "text-muted-foreground/50"}`}>
                    {Math.max(0, 280 - text.length)}
                  </span>
                </div>
                <div className="w-px h-5 bg-white/[0.08]" />
                <button className="text-xs font-bold text-primary/70 hover:text-primary px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/10 transition-all">
                  Community
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Share Toast ───────────────────────────────────────────────────────────────
function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500/95 backdrop-blur-xl border border-emerald-400/30 text-white text-sm font-bold shadow-[0_8px_32px_rgba(16,185,129,0.3)] whitespace-nowrap"
        >
          <Sparkles className="h-4 w-4" />
          Link copied to clipboard
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Vote Pill ─────────────────────────────────────────────────────────────────
function VotePill({ initial }: { initial: number }) {
  const [votes, setVotes] = useState(initial);
  const [voted, setVoted] = useState<1 | -1 | 0>(0);

  const up = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voted === 1) { setVoted(0); setVotes(initial); }
    else             { setVoted(1); setVotes(initial + 1); }
  };
  const down = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voted === -1) { setVoted(0); setVotes(initial); }
    else              { setVoted(-1); setVotes(initial - 1); }
  };

  return (
    <div
      className={`flex items-center rounded-2xl overflow-hidden border h-9 transition-all ${
        voted === 1
          ? "bg-primary/10 border-primary/30 shadow-[0_0_16px_rgba(124,58,237,0.15)]"
          : voted === -1
          ? "bg-red-500/8 border-red-500/25"
          : "bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06]"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={up}
        className={`px-3 h-full flex items-center transition-colors ${voted === 1 ? "text-primary" : "text-muted-foreground/50 hover:text-primary"}`}>
        <ChevronUp className="h-4 w-4" />
      </motion.button>
      <motion.span
        key={votes}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-[13px] font-bold tabular-nums px-1 min-w-[32px] text-center ${
          voted === 1 ? "text-primary" : voted === -1 ? "text-red-400" : "text-foreground/80"
        }`}>
        {fmt(votes)}
      </motion.span>
      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={down}
        className={`px-3 h-full flex items-center transition-colors ${voted === -1 ? "text-red-400" : "text-muted-foreground/50 hover:text-red-400"}`}>
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, index, onShare }: { post: Post; index: number; onShare: () => void }) {
  const navigate = useNavigate();
  const [showReplies, setShowReplies] = useState(false);
  const [expanded, setExpanded]       = useState(false);
  const [replyText, setReplyText]     = useState("");
  const [comments, setComments]       = useState<Comment[]>(post.comments ?? []);
  const [saved, setSaved]             = useState(false);
  const replyRef = useRef<HTMLInputElement>(null);
  const fileRef  = useRef<HTMLInputElement>(null);

  const submitReply = () => {
    if (!replyText.trim()) return;
    setComments((p) => [{ id: `c${Date.now()}`, content: replyText, author: currentUser, upvotes: 0, createdAt: "just now" }, ...p]);
    setReplyText("");
  };

  const openReplies = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(true);
    setTimeout(() => replyRef.current?.focus(), 200);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`).catch(() => {});
    onShare();
  };

  const long = post.content.length > 300;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: easeOutExpo }}
      className="border-b border-white/[0.05] hover:bg-white/[0.015] transition-colors group relative"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-primary/0 group-hover:bg-primary/20 transition-colors rounded-full" />

      {/* Clickable post body — navigates to full post page */}
      <div className="px-5 pt-4 pb-3 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>

        {/* Community breadcrumb */}
        {post.loungeName && post.loungeId && (
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/lounge/${post.loungeId}`); }}
            className="flex items-center gap-2 mb-3 group/bc"
          >
            <div className="w-5 h-5 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Hash className="h-2.5 w-2.5 text-primary/70" />
            </div>
            <span className="text-[11px] font-bold text-primary/50 group-hover/bc:text-primary transition-colors tracking-wide">
              {post.loungeName}
            </span>
          </button>
        )}

        {/* Author row */}
        <div className="flex items-start justify-between mb-2.5 gap-3">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            <button onClick={(e) => { e.stopPropagation(); navigate(`/user/${post.author.id}`); }}
              className="relative flex-shrink-0 group/avatar">
              <img src={post.author.avatar_url} alt=""
                className="w-9 h-9 rounded-full border border-white/[0.08] group-hover/avatar:border-primary/30 transition-all ring-2 ring-transparent group-hover/avatar:ring-primary/10" />
              {post.author.is_online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[2.5px] border-[#070a12]" />
              )}
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/user/${post.author.id}`); }}
                  className="text-[13px] font-bold text-foreground hover:text-primary transition-colors">
                  {post.author.full_name}
                </button>
                <LevelBadge level={post.author.english_level} />
                {post.isPinned && (
                  <span className="text-[10px] text-amber-400/80 font-bold px-1.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">📌 Pinned</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[12px] text-muted-foreground/50">@{post.author.username}</span>
                <span className="text-muted-foreground/20 text-[10px]">·</span>
                <span className="text-[12px] text-muted-foreground/40">{post.createdAt}</span>
              </div>
            </div>
          </div>
          <button onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl hover:bg-white/[0.08] text-muted-foreground/20 hover:text-muted-foreground transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        {post.title && (
          <h2 className="text-[17px] font-bold text-foreground leading-snug mb-2 tracking-tight pr-4">
            {post.title}
          </h2>
        )}

        {/* Content */}
        <p className="text-[14px] text-foreground/75 leading-[1.7]" style={{ wordBreak: "break-word" }}>
          {!expanded && long ? post.content.slice(0, 300) : post.content}
          {!expanded && long && (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              className="text-primary hover:text-primary/80 ml-1.5 font-semibold text-[13px] inline-flex items-center gap-0.5">
              Show more <ChevronDown className="h-3 w-3" />
            </button>
          )}
        </p>

        {/* Media */}
        {post.mediaType === "image" && post.mediaUrl && (
          <div className="mt-3.5 rounded-2xl overflow-hidden border border-white/[0.06] group/media" onClick={(e) => e.stopPropagation()}>
            <img src={post.mediaUrl} alt=""
              className="w-full object-cover max-h-[460px] group-hover/media:scale-[1.02] transition-transform duration-500" loading="lazy" />
          </div>
        )}
        {post.mediaType === "video" && post.mediaUrl && (
          <div className="mt-3.5 rounded-2xl overflow-hidden border border-white/[0.06] bg-black/40" onClick={(e) => e.stopPropagation()}>
            <video src={post.mediaUrl} controls muted playsInline className="w-full max-h-[460px]" />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3.5" onClick={(e) => e.stopPropagation()}>
            {post.tags.map((t) => (
              <span key={t} className="text-[11px] font-semibold text-primary/60 bg-primary/[0.06] border border-primary/[0.12] px-3 py-1 rounded-lg hover:bg-primary/10 transition-all cursor-pointer">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Action bar — stopPropagation to prevent post navigation */}
        <div className="flex items-center gap-2.5 mt-4 flex-wrap" onClick={(e) => e.stopPropagation()}>
          <VotePill initial={post.upvotes} />

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={openReplies}
            className="flex items-center gap-2 px-3.5 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-muted-foreground hover:text-sky-400 hover:bg-sky-400/8 hover:border-sky-400/20 transition-all">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-[13px] font-semibold">{comments.length > 0 ? comments.length : "Reply"}</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={handleShare}
            className="flex items-center gap-2 px-3.5 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-muted-foreground hover:text-violet-400 hover:bg-violet-400/8 hover:border-violet-400/20 transition-all">
            <Share2 className="h-3.5 w-3.5" />
            <span className="text-[13px] font-semibold">Share</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
            className={`flex items-center gap-2 px-3.5 h-9 rounded-2xl border transition-all ${
              saved
                ? "bg-amber-400/10 border-amber-400/25 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.1)]"
                : "bg-white/[0.04] border-white/[0.07] text-muted-foreground hover:text-amber-400 hover:bg-amber-400/8 hover:border-amber-400/20"
            }`}>
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            <span className="text-[13px] font-semibold">{saved ? "Saved" : "Save"}</span>
          </motion.button>
        </div>
      </div>

      {/* Inline reply panel */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeInOutQuint }}
            className="overflow-hidden"
          >
            <div className="bg-[#080c16] border-t border-white/[0.04]">
              {/* Composer */}
              <div className="flex items-start gap-3 px-5 py-4 border-b border-white/[0.04]">
                <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-primary/40 transition-all">
                    <input
                      ref={replyRef} type="text" value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && replyText.trim()) { e.preventDefault(); submitReply(); } }}
                      placeholder="What are your thoughts?"
                      className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" />
                      <button onClick={() => fileRef.current?.click()}
                        className="p-1.5 rounded-full hover:bg-white/[0.08] text-primary/50 hover:text-primary transition-colors">
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <motion.button whileTap={{ scale: 0.85 }} onClick={submitReply}
                        disabled={!replyText.trim()}
                        className={`p-1.5 rounded-full transition-all ${
                          replyText.trim() ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_12px_rgba(124,58,237,0.3)]" : "text-primary/20 cursor-not-allowed"
                        }`}>
                        <Send className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              {comments.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground/25" />
                  </div>
                  <p className="text-sm text-muted-foreground/40 font-medium">No replies yet. Be the first!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {comments.map((c, i) => (
                    <motion.div key={c.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, ease: easeOutExpo }}
                      className="flex gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                    >
                      <img src={c.author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/[0.08] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[13px] font-bold text-foreground">{c.author.full_name}</span>
                          <LevelBadge level={c.author.english_level} />
                          <span className="text-[11px] text-muted-foreground/40">{c.createdAt}</span>
                        </div>
                        <p className="text-[13px] text-foreground/75 leading-relaxed">{c.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-[12px] text-muted-foreground/40 hover:text-primary transition-colors">
                            <ChevronUp className="h-3.5 w-3.5" />{c.upvotes}
                          </button>
                          <button className="text-[12px] text-muted-foreground/30 hover:text-foreground/70 transition-colors font-medium">Reply</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* View all link */}
              <button onClick={() => navigate(`/post/${post.id}`)}
                className="w-full py-3 text-[12px] text-primary/50 hover:text-primary font-semibold hover:bg-white/[0.02] transition-colors border-t border-white/[0.03]">
                View all comments →
              </button>

              <button onClick={() => setShowReplies(false)}
                className="w-full py-2.5 text-[12px] text-muted-foreground/30 hover:text-muted-foreground/60 font-semibold hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-1.5 group">
                <ChevronUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" /> Collapse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── Suggested Community Card ──────────────────────────────────────────────────
function SuggestedCard({ community }: { community: SuggestedCommunity }) {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="px-5 py-5 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors relative overflow-hidden"
    >
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-[0.06] bg-gradient-to-br ${community.gradient}`} />
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 font-bold mb-3 flex items-center gap-2">
        <Sparkles className="h-3 w-3" /> Suggested for you
      </p>
      <div className="flex items-center gap-4 relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${community.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg ring-1 ring-white/10`}>
          {community.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[15px] font-bold text-foreground truncate">{community.name}</p>
            {community.activeRooms > 0 && <LiveDot sm />}
          </div>
          <p className="text-[11px] text-muted-foreground/50">{community.memberCount.toLocaleString()} members</p>
          <p className="text-[11px] text-primary/40 italic mt-1 line-clamp-1">{community.matchReason}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
          onClick={() => { setJoined(!joined); if (!joined) navigate(`/lounge/${community.id}`); }}
          className={`flex-shrink-0 px-5 h-10 rounded-xl text-[13px] font-bold transition-all border ${
            joined
              ? "bg-transparent border-white/[0.15] text-foreground hover:border-white/30"
              : "bg-primary border-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.35)]"
          }`}>
          {joined ? "Joined" : "Join"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Trending Strip (NOT sticky — scrolls with content) ────────────────────────
function TrendingStrip() {
  const navigate = useNavigate();
  const CARDS = [
    { id:"r1", title:"Is remote work killing culture?",      community:"Daily Debate",    img:"https://picsum.photos/seed/d1/320/180", roomId:"r1", listeners:38 },
    { id:"r2", title:"Champions League semi-finals",          community:"Football Talk",   img:"https://picsum.photos/seed/f2/320/180", roomId:"r5", listeners:71 },
    { id:"r3", title:"Claude vs GPT — who actually wins?",   community:"Tech and AI",     img:"https://picsum.photos/seed/t3/320/180", roomId:"r6", listeners:54 },
    { id:"r4", title:"Pitch practice: sell me this pen",     community:"Business English", img:"https://picsum.photos/seed/b4/320/180", roomId:"r3", listeners:22 },
    { id:"r5", title:"Tell me about your week",              community:"Beginner Corner", img:"https://picsum.photos/seed/c5/320/180", roomId:"r4", listeners:17 },
    { id:"r6", title:"Nolan vs Villeneuve — best director?", community:"Film and TV",     img:"https://picsum.photos/seed/m6/320/180", roomId:"r8", listeners:29 },
  ];

  return (
    <div className="border-b border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <LiveDot sm />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Now</span>
          </div>
          <span className="text-[11px] text-muted-foreground/30 font-medium">{CARDS.length} active rooms</span>
        </div>
        <button onClick={() => navigate("/explore")}
          className="text-[12px] font-bold text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
          See all <ChevronUp className="h-3 w-3 rotate-90" />
        </button>
      </div>
      <div className="flex gap-3.5 px-5 pb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: easeOutExpo }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/room/${card.roomId}`)}
            className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden relative group"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          >
            <img src={card.img} alt=""
              className="w-full h-[136px] object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
              <Users className="h-3 w-3 text-white/70" />
              <span className="text-[10px] font-bold text-white/80">{card.listeners}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3.5 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <LiveDot sm />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Live</span>
              </div>
              <p className="text-[13px] font-bold text-white leading-snug line-clamp-2 mb-1 tracking-tight">{card.title}</p>
              <p className="text-[10px] text-white/40 font-medium">{card.community}</p>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/10 transition-all duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Right Sidebar ─────────────────────────────────────────────────────────────
function RightSidebar({ onCreateRoom }: { onCreateRoom: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"communities" | "people">("communities");
  const top3 = [...loungeUsers].sort((a, b) => b.xp_points - a.xp_points).slice(0, 3);

  return (
    <div
      className="hidden xl:flex flex-col w-[320px] flex-shrink-0 pl-8 pt-6 sticky top-0 h-screen overflow-y-auto gap-6"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Streak card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="rounded-3xl p-5 border border-white/[0.07] relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.03) 50%, rgba(0,0,0,0) 100%)" }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="flex items-center gap-3.5 relative">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Flame className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold text-foreground">{currentUser.streak_count}-day streak</p>
            <p className="text-[11px] text-muted-foreground/50">Keep it going!</p>
          </div>
          <LevelBadge level={currentUser.english_level} size="md" />
        </div>
        <div className="flex gap-1 mt-4 relative">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              i < (currentUser.streak_count % 7 || 7) ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-white/[0.06]"
            }`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/30 mt-3 text-right relative flex items-center justify-end gap-1">
          <Zap className="inline h-3 w-3 text-primary/40" />
          {currentUser.xp_points.toLocaleString()} XP total
        </p>
      </motion.div>

      {/* Tab switcher */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
        className="flex items-center bg-white/[0.03] rounded-2xl p-1 border border-white/[0.06]"
      >
        {(["communities", "people"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-[13px] font-bold capitalize transition-all ${
              tab === t ? "bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]" : "text-muted-foreground/60 hover:text-foreground"
            }`}>
            {t === "communities" ? "Communities" : "People"}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === "communities" ? (
          <motion.div key="c"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/40 font-bold mb-3 px-1 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" /> Popular
              </p>
              <div className="space-y-1">
                {lounges.map((l, i) => (
                  <motion.button key={l.id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, ease: easeOutExpo }}
                    onClick={() => navigate(`/lounge/${l.id}`)}
                    className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform`}>
                      {l.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{l.name}</p>
                      <p className="text-[11px] text-muted-foreground/50">{l.memberCount.toLocaleString()} members</p>
                    </div>
                    {l.activeRooms > 0 && (
                      <div className="flex items-center gap-1.5 flex-shrink-0 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <LiveDot sm />
                        <span className="text-[10px] text-emerald-400 font-bold">{l.activeRooms}</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Create room CTA */}
            <div className="p-5 rounded-3xl border border-primary/20 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(124,58,237,0.1), rgba(6,182,212,0.04))" }}>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
              <div className="flex items-center gap-3 mb-3 relative">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                  <Radio className="h-5 w-5 text-primary" />
                </div>
                <p className="text-[15px] font-bold text-foreground">Start a room</p>
              </div>
              <p className="text-[12px] text-muted-foreground/50 mb-4 leading-relaxed relative">
                Host your own voice room and invite speakers from any community.
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onCreateRoom}
                className="w-full py-3 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-all shadow-[0_0_24px_rgba(124,58,237,0.4)] relative">
                Create Room
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="p"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/40 font-bold mb-3 px-1">
                People You May Know
              </p>
              <div className="space-y-1">
                {loungeUsers.slice(1).map((user, i) => (
                  <motion.div key={user.id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, ease: easeOutExpo }}
                    className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={user.avatar_url} alt=""
                        className="w-10 h-10 rounded-full border border-white/[0.08] group-hover:border-primary/20 transition-colors" />
                      {user.is_online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[2.5px] border-[#070a12]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{user.full_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <LevelBadge level={user.english_level} />
                        <span className="text-[10px] text-muted-foreground/30">·</span>
                        <span className="text-[11px] text-muted-foreground/50">{fmt(user.xp_points)} XP</span>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                      className="flex-shrink-0 px-3.5 h-8 rounded-full text-[12px] font-bold bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
                      Follow
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leaderboard mini */}
            <div className="p-5 rounded-3xl border border-amber-500/15 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(245,158,11,0.06), rgba(239,68,68,0.02))" }}>
              <div className="flex items-center gap-2 mb-4 relative">
                <Trophy className="h-4 w-4 text-amber-400" />
                <p className="text-[13px] font-bold text-foreground">Top Speakers</p>
                <button onClick={() => navigate("/leaderboard")}
                  className="ml-auto text-[11px] font-bold text-muted-foreground/40 hover:text-primary transition-colors">
                  See all
                </button>
              </div>
              {top3.map((u, i) => (
                <motion.div key={u.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 py-2 group cursor-pointer"
                  onClick={() => navigate(`/user/${u.id}`)}
                >
                  <span className="text-[15px] w-6 flex-shrink-0 text-center">{["🥇","🥈","🥉"][i]}</span>
                  <img src={u.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 group-hover:border-amber-400/30 transition-colors" />
                  <span className="text-[13px] text-foreground flex-1 truncate font-medium group-hover:text-amber-400/80 transition-colors">{u.full_name}</span>
                  <LevelBadge level={u.english_level} />
                  <span className="text-[11px] text-muted-foreground/40 font-medium">{fmt(u.xp_points)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-auto pb-6 pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground/25">
          {["About","Terms","Privacy","Cookies"].map((l) => (
            <a key={l} href="#" className="hover:text-muted-foreground/60 transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/20 mt-2">© 2026 Elova</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
interface HomePageProps { onMenuOpen: () => void; }

export default function HomePage({ onMenuOpen }: HomePageProps) {
  const navigate = useNavigate();
  const [tab, setTab]                   = useState<FeedTab>("foryou");
  const [searchOpen, setSearchOpen]     = useState(false);
  const [composeOpen, setComposeOpen]   = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [posts, setPosts]               = useState<Post[]>(samplePosts);

  const handleShare   = useCallback(() => {
    setShareVisible(true);
    setTimeout(() => setShareVisible(false), 2400);
  }, []);

  const handleNewPost = useCallback((p: Post) => setPosts((prev) => [p, ...prev]), []);

  // Inject suggested community at position 5 in the feed
  const feedItems = tab === "foryou"
    ? posts.reduce<{ type: "post" | "suggestion"; id: string; data: Post | SuggestedCommunity }[]>((acc, post, i) => {
        acc.push({ type: "post", id: post.id, data: post });
        if (i === 4 && suggestedCommunities[0]) {
          acc.push({ type: "suggestion", id: "sugg-0", data: suggestedCommunities[0] });
        }
        return acc;
      }, [])
    : [];

  return (
    <div className="min-h-screen bg-[#070a12]">
      <SearchOverlay  open={searchOpen}  onClose={() => setSearchOpen(false)} />
      <ComposeModal   open={composeOpen} onClose={() => setComposeOpen(false)} onPost={handleNewPost} />
      <ShareToast     visible={shareVisible} />

      <div className="max-w-[1100px] mx-auto flex">

        {/* ── Feed column ── */}
        <div className="flex-1 min-w-0 flex flex-col border-x border-white/[0.05] relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

          {/* STICKY: only the header tabs + compose bar */}
          <div className="sticky top-0 z-40 bg-[#070a12]/85 backdrop-blur-2xl border-b border-white/[0.06]">
            <div className="flex items-center h-[56px] px-5 gap-3">
              <motion.button whileTap={{ scale: 0.9 }} onClick={onMenuOpen}
                className="p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors flex-shrink-0">
                <Menu className="h-5 w-5 text-muted-foreground/70" />
              </motion.button>

              <div className="flex flex-1 items-center justify-center">
                {(["foryou", "following"] as FeedTab[]).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`relative flex-1 flex justify-center py-[14px] text-[15px] font-bold transition-colors max-w-[180px] ${
                      tab === t ? "text-foreground" : "text-muted-foreground/40 hover:text-foreground/60"
                    }`}>
                    {t === "foryou" ? "For You" : "Following"}
                    {tab === t && (
                      <motion.div layoutId="feed-tab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-16 bg-primary rounded-full shadow-[0_0_12px_rgba(124,58,237,0.5)]" />
                    )}
                  </button>
                ))}
              </div>

              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors flex-shrink-0">
                <Search className="h-5 w-5 text-muted-foreground/70" />
              </motion.button>
            </div>

            {/* Compose bar */}
            <button onClick={() => setComposeOpen(true)}
              className="flex items-center gap-3.5 px-5 py-3.5 w-full border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
              <img src={currentUser.avatar_url} alt=""
                className="w-10 h-10 rounded-full border border-white/[0.08] flex-shrink-0 group-hover:border-primary/20 transition-colors" />
              <span className="text-[15px] text-muted-foreground/30 flex-1 text-left group-hover:text-muted-foreground/50 transition-colors">
                What's on your mind?
              </span>
              <div className="flex items-center gap-3 text-primary/30 group-hover:text-primary/50 transition-colors">
                <ImageIcon className="h-[18px] w-[18px]" />
                <Video className="h-[18px] w-[18px]" />
              </div>
            </button>
          </div>

          {/* Trending strip — scrolls away with content */}
          <TrendingStrip />

          {/* Feed content */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {tab === "foryou" ? (
                <motion.div key="foryou"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {feedItems.map((item, i) =>
                    item.type === "post" ? (
                      <PostCard key={item.id} post={item.data as Post} index={i} onShare={handleShare} />
                    ) : (
                      <SuggestedCard key={item.id} community={item.data as SuggestedCommunity} />
                    )
                  )}
                  <div className="h-32 flex flex-col items-center justify-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-dashed border-white/10"
                      style={{ animation: "spin 3s linear infinite" }} />
                    <p className="text-[12px] text-muted-foreground/25 font-medium">You're all caught up</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="following"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                  className="flex flex-col items-center justify-center py-32 px-8 text-center gap-4"
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-[20px] font-bold text-foreground tracking-tight">Nothing here yet</p>
                  <p className="text-[14px] text-muted-foreground/50 max-w-[280px] leading-relaxed">
                    Follow people to see their posts and updates in your personal feed
                  </p>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/rooms")}
                    className="mt-3 px-6 py-3 rounded-2xl bg-primary/15 text-primary text-[13px] font-bold border border-primary/25 hover:bg-primary/25 transition-all">
                    Discover Communities
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar onCreateRoom={() => navigate("/create-room")} />
      </div>

      {/* Mobile floating compose button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-20 right-4 xl:hidden z-40 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_28px_rgba(124,58,237,0.55)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] transition-shadow"
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      <BottomNav />
    </div>
  );
}
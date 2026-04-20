#!/usr/bin/env python3
"""Run from your Elova project root: python3 fix_homepage.py"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ok  {path}  ({content.count(chr(10))} lines)")

w("src/pages/HomePage.tsx", r"""
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp, ChevronDown, MessageSquare, Share2, Search,
  MoreHorizontal, Mic, MicOff, Users, Menu, X, ArrowLeft,
  Image as ImageIcon, Video, Trophy, Flame, Zap, Plus,
  Send, Bookmark, BookmarkCheck, Radio,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import {
  samplePosts, suggestedCommunities, loungeUsers, lounges,
} from "@/lib/lounge-data";
import type { Post, SuggestedCommunity, Comment } from "@/lib/lounge-data";

// ─── Constants ────────────────────────────────────────────────────────────────
const currentUser = loungeUsers[0];
type FeedTab = "foryou" | "following";

const fmt = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1_000   ? (n / 1_000).toFixed(1) + "K"
  : String(n);

// ─── Live Dot ────────────────────────────────────────────────────────────────
function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={`relative flex flex-shrink-0 ${s}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={`relative inline-flex rounded-full bg-green-500 ${s}`} />
    </span>
  );
}

// ─── Voice recorder hook ──────────────────────────────────────────────────────
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

// ─── Search Overlay ───────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const navigate  = useNavigate();

  const posts  = q.trim() ? samplePosts.filter((p) =>
    (p.title ?? p.content).toLowerCase().includes(q.toLowerCase()) ||
    p.author.full_name.toLowerCase().includes(q.toLowerCase())) : [];

  const comms  = q.trim() ? lounges.filter((l) =>
    l.name.toLowerCase().includes(q.toLowerCase())) : [];

  const close = () => { setQ(""); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={close} />

          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117] border-b border-white/[0.08] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3 max-w-[1080px] mx-auto">
              <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/40 transition-colors">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus type="text" value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search posts, people, communities…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {q && <button onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground flex-shrink-0"><X className="h-3.5 w-3.5" /></button>}
              </div>
            </div>

            {/* Results */}
            {q.trim() && (
              <div className="max-h-[62vh] overflow-y-auto max-w-[1080px] mx-auto">
                {comms.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground/50 font-bold border-b border-white/[0.04]">Communities</p>
                    {comms.map((l) => (
                      <button key={l.id} onClick={() => { navigate(`/lounge/${l.id}`); close(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04]">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center text-lg flex-shrink-0`}>{l.emoji}</div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.memberCount.toLocaleString()} members</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {posts.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground/50 font-bold border-b border-white/[0.04]">Posts</p>
                    {posts.map((post) => (
                      <button key={post.id} onClick={() => { navigate(`/post/${post.id}`); close(); }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04] text-left">
                        <img src={post.author.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{post.author.full_name}</p>
                          <p className="text-xs text-foreground/70 line-clamp-2 mt-0.5">{post.title ?? post.content}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {posts.length === 0 && comms.length === 0 && (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm text-muted-foreground">No results for &ldquo;{q}&rdquo;</p>
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

// ─── Compose Modal ────────────────────────────────────────────────────────────
function ComposeModal({
  open, onClose, onPost,
}: { open: boolean; onClose: () => void; onPost: (p: Post) => void }) {
  const [title, setTitle]           = useState("");
  const [text, setText]             = useState("");
  const [media, setMedia]           = useState<{ url: string; type: "image" | "video" } | null>(null);
  const fileRef                     = useRef<HTMLInputElement>(null);
  const textRef                     = useRef<HTMLTextAreaElement>(null);
  const voice                       = useVoiceRecorder();
  const canPost                     = text.trim() || title.trim();

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
            onClick={() => { reset(); onClose(); }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 22 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[560px] mx-4 bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={() => { reset(); onClose(); }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
              <p className="text-sm font-bold text-foreground">New Post</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                disabled={!canPost} onClick={post}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  canPost
                    ? "bg-primary text-white shadow-[0_0_18px_rgba(124,58,237,0.4)] hover:bg-primary/90"
                    : "bg-primary/15 text-primary/35 cursor-not-allowed"
                }`}>
                Post
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex gap-3 px-5 py-4 max-h-[65vh] overflow-y-auto">
              <img src={currentUser.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title…"
                  className="w-full bg-transparent text-[17px] font-bold text-foreground placeholder:text-white/20 focus:outline-none" />
                <textarea ref={textRef} value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?" rows={5}
                  className="w-full bg-transparent text-[15px] text-foreground/90 placeholder:text-white/25 focus:outline-none resize-none leading-relaxed" />

                {/* Media preview */}
                {media && (
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] group">
                    {media.type === "image"
                      ? <img src={media.url} alt="" className="w-full max-h-56 object-cover" />
                      : <video src={media.url} controls className="w-full max-h-56 rounded-2xl" />}
                    <button onClick={() => setMedia(null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Voice preview */}
                {voice.audioUrl && !voice.recording && (
                  <div className="flex items-center gap-2 bg-white/[0.05] rounded-xl px-3 py-2 border border-white/[0.08]">
                    <Mic className="h-4 w-4 text-primary flex-shrink-0" />
                    <audio src={voice.audioUrl} controls className="flex-1 h-7" />
                    <button onClick={voice.clear} className="text-muted-foreground hover:text-destructive transition-colors"><X className="h-3.5 w-3.5" /></button>
                  </div>
                )}

                {/* Recording indicator */}
                {voice.recording && (
                  <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="text-sm text-red-400 font-semibold">
                      {String(Math.floor(voice.seconds / 60)).padStart(2, "0")}:{String(voice.seconds % 60).padStart(2, "0")}
                    </span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={voice.stop}
                      className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/25 transition-colors">
                      <X className="h-3 w-3" /> Stop
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-4 py-3 border-t border-white/[0.07] bg-white/[0.01]">
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
              <button onClick={() => fileRef.current?.click()}
                className="p-2.5 rounded-full hover:bg-white/[0.06] text-primary/70 hover:text-primary transition-colors" title="Image">
                <ImageIcon className="h-5 w-5" />
              </button>
              <button onClick={() => { if (fileRef.current) { fileRef.current.accept = "video/*"; fileRef.current.click(); } }}
                className="p-2.5 rounded-full hover:bg-white/[0.06] text-primary/70 hover:text-primary transition-colors" title="Video">
                <Video className="h-5 w-5" />
              </button>
              <button
                onClick={() => voice.recording ? voice.stop() : voice.start()}
                className={`p-2.5 rounded-full transition-colors ${voice.recording ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "hover:bg-white/[0.06] text-primary/70 hover:text-primary"}`}
                title={voice.recording ? "Stop recording" : "Voice note"}>
                {voice.recording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <div className="ml-auto flex items-center gap-2.5">
                <span className={`text-xs font-semibold tabular-nums ${(text.length) > 240 ? "text-amber-400" : "text-muted-foreground/50"}`}>
                  {280 - text.length}
                </span>
                <div className="w-px h-4 bg-white/[0.08]" />
                <button className="text-xs font-bold text-primary hover:text-primary/80 px-3 py-1.5 rounded-full border border-primary/25 hover:bg-primary/10 transition-colors">
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

// ─── Share toast ──────────────────────────────────────────────────────────────
function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500/90 backdrop-blur border border-green-400/50 text-white text-sm font-bold shadow-xl"
        >
          ✓ Link copied
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Vote Pill ────────────────────────────────────────────────────────────────
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
      className={`flex items-center rounded-full overflow-hidden border h-8 transition-all ${
        voted !== 0
          ? "bg-primary/10 border-primary/30"
          : "bg-white/[0.05] border-white/[0.08] hover:border-white/[0.15]"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button whileTap={{ scale: 1.25 }} onClick={up}
        className={`px-2.5 h-full flex items-center transition-colors ${
          voted === 1 ? "text-primary" : "text-muted-foreground hover:text-primary"
        }`}>
        <ChevronUp className="h-4 w-4" />
      </motion.button>

      <motion.span
        key={votes}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-[13px] font-bold tabular-nums px-1 min-w-[28px] text-center ${
          voted === 1 ? "text-primary" : voted === -1 ? "text-red-400" : "text-foreground"
        }`}>
        {fmt(votes)}
      </motion.span>

      <motion.button whileTap={{ scale: 1.25 }} onClick={down}
        className={`px-2.5 h-full flex items-center transition-colors ${
          voted === -1 ? "text-red-400" : "text-muted-foreground hover:text-red-400"
        }`}>
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, index, onShare }: { post: Post; index: number; onShare: () => void }) {
  const navigate = useNavigate();
  const [showReplies, setShowReplies]   = useState(false);
  const [expanded, setExpanded]         = useState(false);
  const [replyText, setReplyText]       = useState("");
  const [comments, setComments]         = useState<Comment[]>(post.comments ?? []);
  const [saved, setSaved]               = useState(false);
  const replyRef = useRef<HTMLInputElement>(null);
  const fileRef  = useRef<HTMLInputElement>(null);

  const submitReply = () => {
    if (!replyText.trim()) return;
    setComments((p) => [{
      id: `c${Date.now()}`,
      content: replyText,
      author: currentUser,
      upvotes: 0,
      createdAt: "just now",
    }, ...p]);
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, ease: "easeOut" }}
      className="border-b border-white/[0.06] hover:bg-white/[0.012] transition-colors group"
    >
      <div className="px-4 pt-4 pb-3 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>

        {/* Community breadcrumb */}
        {post.loungeName && post.loungeId && (
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/lounge/${post.loungeId}`); }}
            className="flex items-center gap-1.5 mb-2.5 group/bc"
          >
            <div className="w-1 h-1 rounded-full bg-primary/60" />
            <span className="text-[11px] font-bold text-primary/60 group-hover/bc:text-primary transition-colors">
              {post.loungeName}
            </span>
          </button>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <button onClick={(e) => { e.stopPropagation(); navigate(`/user/${post.author.id}`); }}
              className="relative flex-shrink-0">
              <img src={post.author.avatar_url} alt=""
                className="w-8 h-8 rounded-full border border-white/10 hover:border-white/25 transition-colors" />
              {post.author.is_online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
              )}
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/user/${post.author.id}`); }}
              className="text-[13px] font-bold text-foreground hover:text-primary transition-colors">
              {post.author.full_name}
            </button>
            <LevelBadge level={post.author.english_level} />
            <span className="text-muted-foreground/30 text-xs">·</span>
            <span className="text-[12px] text-muted-foreground/60">@{post.author.username}</span>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <span className="text-[12px] text-muted-foreground/60">{post.createdAt}</span>
            {post.isPinned && (
              <span className="text-[11px] text-amber-400/80 font-semibold flex-shrink-0">📌 Pinned</span>
            )}
          </div>
          <button onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-muted-foreground/30 hover:text-muted-foreground transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        {post.title && (
          <h2 className="text-[18px] font-bold text-foreground leading-snug mb-2 tracking-tight">
            {post.title}
          </h2>
        )}

        {/* Body */}
        <p className="text-[14px] text-foreground/80 leading-relaxed" style={{ wordBreak: "break-word" }}>
          {!expanded && long ? post.content.slice(0, 300) : post.content}
          {!expanded && long && (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              className="text-primary hover:text-primary/80 ml-1 font-semibold text-[13px]">
              Show more
            </button>
          )}
        </p>

        {/* Media */}
        {post.mediaType === "image" && post.mediaUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
            <img src={post.mediaUrl} alt="" className="w-full object-cover max-h-[420px]" loading="lazy" />
          </div>
        )}
        {post.mediaType === "video" && post.mediaUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.06] bg-black/50" onClick={(e) => e.stopPropagation()}>
            <video src={post.mediaUrl} controls muted playsInline className="w-full max-h-[420px]" />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
            {post.tags.map((t) => (
              <span key={t} className="text-[11px] font-semibold text-primary/70 bg-primary/8 border border-primary/15 px-2.5 py-0.5 rounded-full hover:bg-primary/15 transition-colors cursor-pointer">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-2 mt-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
          <VotePill initial={post.upvotes} />

          <motion.button whileTap={{ scale: 1.1 }} onClick={openReplies}
            className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/[0.05] border border-white/[0.07] text-muted-foreground hover:text-sky-400 hover:bg-sky-400/10 hover:border-sky-400/20 transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-[13px] font-semibold">{comments.length > 0 ? comments.length : "Reply"}</span>
          </motion.button>

          <motion.button whileTap={{ scale: 1.1 }} onClick={handleShare}
            className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/[0.05] border border-white/[0.07] text-muted-foreground hover:text-violet-400 hover:bg-violet-400/10 hover:border-violet-400/20 transition-colors">
            <Share2 className="h-3.5 w-3.5" />
            <span className="text-[13px] font-semibold">Share</span>
          </motion.button>

          <motion.button whileTap={{ scale: 1.1 }} onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
            className={`flex items-center gap-1.5 px-3 h-8 rounded-full border transition-colors ${
              saved
                ? "bg-amber-400/10 border-amber-400/25 text-amber-400"
                : "bg-white/[0.05] border-white/[0.07] text-muted-foreground hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/20"
            }`}>
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            <span className="text-[13px] font-semibold">{saved ? "Saved" : "Save"}</span>
          </motion.button>
        </div>
      </div>

      {/* Reply panel */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-[#090d17] border-t border-white/[0.05]">

              {/* Composer */}
              <div className="flex items-start gap-3 px-4 py-3.5 border-b border-white/[0.05]">
                <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-primary/40 transition-colors">
                    <input
                      ref={replyRef} type="text" value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && replyText.trim()) { e.preventDefault(); submitReply(); } }}
                      placeholder="What are your thoughts?"
                      className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" />
                      <button onClick={() => fileRef.current?.click()}
                        className="p-1.5 rounded-full hover:bg-white/[0.06] text-primary/60 hover:text-primary transition-colors">
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={submitReply}
                        disabled={!replyText.trim()}
                        className={`p-1.5 rounded-full transition-all ${
                          replyText.trim() ? "bg-primary text-white hover:bg-primary/90" : "text-primary/30 cursor-not-allowed"
                        }`}>
                        <Send className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  {replyText.trim() && (
                    <p className="text-[10px] text-muted-foreground/40 mt-1.5 px-2">Enter to send</p>
                  )}
                </div>
              </div>

              {/* Comments */}
              {comments.length === 0 ? (
                <div className="py-10 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground/40">No replies yet. Be the first!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {comments.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex gap-3 px-4 py-3.5 hover:bg-white/[0.015] transition-colors">
                      <img src={c.author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[13px] font-bold text-foreground">{c.author.full_name}</span>
                          <LevelBadge level={c.author.english_level} />
                          <span className="text-[11px] text-muted-foreground/50">{c.createdAt}</span>
                        </div>
                        <p className="text-[13px] text-foreground/80 leading-relaxed">{c.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="flex items-center gap-1 text-[12px] text-muted-foreground/50 hover:text-primary transition-colors">
                            <ChevronUp className="h-3.5 w-3.5" />{c.upvotes}
                          </button>
                          <button className="text-[12px] text-muted-foreground/40 hover:text-foreground/70 transition-colors">Reply</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <button onClick={() => setShowReplies(false)}
                className="w-full py-3 text-[12px] text-muted-foreground/40 hover:text-muted-foreground font-semibold hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-1.5">
                <ChevronUp className="h-3.5 w-3.5" /> Collapse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── Suggested community card ─────────────────────────────────────────────────
function SuggestedCard({ community }: { community: SuggestedCommunity }) {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="px-4 py-4 border-b border-white/[0.06] hover:bg-white/[0.015] transition-colors"
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/40 font-bold mb-3">
        Suggested for you
      </p>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${community.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
          {community.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[14px] font-bold text-foreground truncate">{community.name}</p>
            {community.activeRooms > 0 && <LiveDot sm />}
          </div>
          <p className="text-[11px] text-muted-foreground/60">{community.memberCount.toLocaleString()} members</p>
          <p className="text-[11px] text-primary/50 italic mt-0.5 line-clamp-1">{community.matchReason}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
          onClick={() => { setJoined(!joined); if (!joined) navigate(`/lounge/${community.id}`); }}
          className={`flex-shrink-0 px-4 h-9 rounded-xl text-[12px] font-bold transition-all border ${
            joined
              ? "bg-transparent border-white/[0.12] text-foreground hover:border-white/25"
              : "bg-primary border-primary text-white hover:bg-primary/90 shadow-[0_0_14px_rgba(124,58,237,0.3)]"
          }`}>
          {joined ? "Joined ✓" : "Join"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Trending strip (scrolls away — NOT sticky) ───────────────────────────────
function TrendingStrip() {
  const navigate = useNavigate();
  const CARDS = [
    { id:"r1", title:"Is remote work killing culture?",      community:"Daily Debate",     img:"https://picsum.photos/seed/d1/320/180", roomId:"r1", listeners:38  },
    { id:"r2", title:"Champions League semi-finals",          community:"Football Talk",     img:"https://picsum.photos/seed/f2/320/180", roomId:"r5", listeners:71  },
    { id:"r3", title:"Claude vs GPT — who actually wins?",   community:"Tech and AI",       img:"https://picsum.photos/seed/t3/320/180", roomId:"r6", listeners:54  },
    { id:"r4", title:"Pitch practice: sell me this pen",     community:"Business English",  img:"https://picsum.photos/seed/b4/320/180", roomId:"r3", listeners:22  },
    { id:"r5", title:"Tell me about your week",              community:"Beginner Corner",   img:"https://picsum.photos/seed/c5/320/180", roomId:"r4", listeners:17  },
    { id:"r6", title:"Nolan vs Villeneuve — best director?", community:"Film and TV",       img:"https://picsum.photos/seed/m6/320/180", roomId:"r8", listeners:29  },
  ];

  return (
    <div className="border-b border-white/[0.06]">
      {/* Label row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <LiveDot glow sm />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live Now</span>
          </div>
          <span className="text-[11px] text-muted-foreground/40">{CARDS.length} rooms</span>
        </div>
        <button onClick={() => navigate("/explore")}
          className="text-[12px] font-semibold text-primary/70 hover:text-primary transition-colors">
          See all →
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/room/${card.roomId}`)}
            className="flex-shrink-0 w-[196px] rounded-2xl overflow-hidden relative"
            style={{ boxShadow: "0 6px 28px rgba(0,0,0,0.45)" }}
          >
            <img src={card.img} alt="" className="w-full h-[132px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            {/* Listeners badge */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/45 backdrop-blur-sm rounded-full px-2 py-0.5 border border-white/10">
              <Users className="h-2.5 w-2.5 text-white/60" />
              <span className="text-[10px] font-bold text-white/75">{card.listeners}</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <LiveDot sm />
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wide">Live</span>
              </div>
              <p className="text-[12px] font-bold text-white leading-snug line-clamp-2 mb-1">
                {card.title}
              </p>
              <p className="text-[10px] text-white/45">{card.community}</p>
            </div>

            {/* Hover ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/0 hover:ring-white/[0.08] transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Right sidebar ────────────────────────────────────────────────────────────
function RightSidebar({ onCreateRoom }: { onCreateRoom: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"communities" | "people">("communities");
  const top3 = [...loungeUsers].sort((a, b) => b.xp_points - a.xp_points).slice(0, 3);

  return (
    <div
      className="hidden xl:flex flex-col w-[310px] flex-shrink-0 pl-6 pt-5 sticky top-0 h-screen overflow-y-auto gap-5"
      style={{ scrollbarWidth: "none" }}
    >

      {/* Streak card */}
      <div className="rounded-2xl p-4 border border-white/[0.07] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.04) 100%)" }}>
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="flex items-center gap-3 relative">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <Flame className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-foreground">{currentUser.streak_count}-day streak</p>
            <p className="text-[11px] text-muted-foreground/60">Keep it going!</p>
          </div>
          <LevelBadge level={currentUser.english_level} size="md" />
        </div>
        <div className="flex gap-1 mt-3 relative">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
              i < (currentUser.streak_count % 7 || 7) ? "bg-amber-500" : "bg-white/[0.07]"
            }`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/35 mt-2 text-right relative">
          <Zap className="inline h-3 w-3 text-primary/50 mr-0.5" />
          {currentUser.xp_points.toLocaleString()} XP total
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center bg-white/[0.04] rounded-full p-0.5 border border-white/[0.07]">
        {(["communities", "people"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-full text-[13px] font-bold capitalize transition-all ${
              tab === t ? "bg-primary text-white shadow-[0_0_14px_rgba(124,58,237,0.3)]" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t === "communities" ? "Communities" : "People"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "communities" ? (
          <motion.div key="c" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-4">

            {/* Community list */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/50 font-bold mb-2.5 px-1">
                Popular Communities
              </p>
              <div className="space-y-0.5">
                {lounges.map((l, i) => (
                  <motion.button key={l.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(`/lounge/${l.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left group">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-md`}>{l.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{l.name}</p>
                      <p className="text-[11px] text-muted-foreground/55">{l.memberCount.toLocaleString()} members</p>
                    </div>
                    {l.activeRooms > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <LiveDot sm />
                        <span className="text-[10px] text-green-400 font-bold">{l.activeRooms}</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Create Room CTA */}
            <div className="p-4 rounded-2xl border border-primary/20 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.04))" }}>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
              <div className="flex items-center gap-2 mb-2 relative">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center">
                  <Radio className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[14px] font-bold text-foreground">Start a room</p>
              </div>
              <p className="text-[12px] text-muted-foreground/60 mb-3 leading-relaxed relative">
                Host your own voice room and invite speakers from any community.
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onCreateRoom}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-[0_0_22px_rgba(124,58,237,0.38)] relative">
                Create Room
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="p" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-4">

            {/* People to follow */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/50 font-bold mb-2.5 px-1">
                People You May Know
              </p>
              <div className="space-y-0.5">
                {loungeUsers.slice(1).map((user, i) => (
                  <motion.div key={user.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
                    <div className="relative flex-shrink-0">
                      <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10" />
                      {user.is_online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate">{user.full_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <LevelBadge level={user.english_level} />
                        <span className="text-[10px] text-muted-foreground/50">·</span>
                        <span className="text-[11px] text-muted-foreground/50">{fmt(user.xp_points)} XP</span>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                      className="flex-shrink-0 px-3 h-7 rounded-full text-[12px] font-bold bg-white/[0.06] border border-white/[0.1] text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/25 transition-colors">
                      Follow
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leaderboard mini */}
            <div className="p-4 rounded-2xl border border-amber-500/15"
              style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.07), rgba(239,68,68,0.03))" }}>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-4 w-4 text-amber-400" />
                <p className="text-[13px] font-bold text-foreground">Top Speakers</p>
                <button onClick={() => navigate("/leaderboard")}
                  className="ml-auto text-[11px] font-semibold text-muted-foreground/50 hover:text-primary transition-colors">
                  See all
                </button>
              </div>
              {top3.map((u, i) => (
                <div key={u.id} className="flex items-center gap-2.5 py-1.5">
                  <span className="text-[14px] w-4 flex-shrink-0">{["🥇","🥈","🥉"][i]}</span>
                  <img src={u.avatar_url} alt="" className="w-6 h-6 rounded-full border border-white/10" />
                  <span className="text-[13px] text-foreground flex-1 truncate font-medium">{u.full_name}</span>
                  <LevelBadge level={u.english_level} />
                  <span className="text-[11px] text-muted-foreground/50">{fmt(u.xp_points)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-auto pb-5">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted-foreground/30">
          {["About","Terms","Privacy","Cookies"].map((l) => (
            <a key={l} href="#" className="hover:text-muted-foreground/60 transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/25 mt-1.5">© 2026 Elova</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
interface HomePageProps { onMenuOpen: () => void; }

export default function HomePage({ onMenuOpen }: HomePageProps) {
  const navigate    = useNavigate();
  const [tab, setTab]             = useState<FeedTab>("foryou");
  const [searchOpen, setSearchOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [posts, setPosts]         = useState<Post[]>(samplePosts);

  const handleShare = useCallback(() => {
    setShareVisible(true);
    setTimeout(() => setShareVisible(false), 2400);
  }, []);

  const handleNewPost = useCallback((p: Post) => setPosts((prev) => [p, ...prev]), []);

  // Build feed with a suggested community injected at position 5
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
    <div className="min-h-screen bg-background">
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onPost={handleNewPost} />
      <ShareToast visible={shareVisible} />

      {/* Two-column layout centered */}
      <div className="max-w-[1080px] mx-auto flex">

        {/* ── Center feed column ── */}
        <div className="flex-1 min-w-0 flex flex-col border-x border-white/[0.06]">

          {/* ── STICKY: header tabs + compose bar only ── */}
          <div className="sticky top-0 z-40 bg-background/88 backdrop-blur-xl border-b border-white/[0.06]">

            {/* Header */}
            <div className="flex items-center h-[53px] px-4 gap-2">
              <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/[0.07] transition-colors flex-shrink-0">
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Tab switcher */}
              <div className="flex flex-1 items-center justify-center">
                {(["foryou", "following"] as FeedTab[]).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`relative flex-1 flex justify-center py-[14px] text-[15px] font-bold transition-colors max-w-[180px] ${
                      tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                    }`}>
                    {t === "foryou" ? "For You" : "Following"}
                    {tab === t && (
                      <motion.div layoutId="feed-tab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-14 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
                    )}
                  </button>
                ))}
              </div>

              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-white/[0.07] transition-colors flex-shrink-0">
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Compose bar */}
            <button onClick={() => setComposeOpen(true)}
              className="flex items-center gap-3 px-4 py-3 w-full border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors">
              <img src={currentUser.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10 flex-shrink-0" />
              <span className="text-[14px] text-muted-foreground/40 flex-1 text-left">What's on your mind?</span>
              <div className="flex items-center gap-2.5 text-primary/50">
                <ImageIcon className="h-4 w-4" />
                <Video className="h-4 w-4" />
              </div>
            </button>
          </div>

          {/* ── NOT sticky: trending strip scrolls away ── */}
          <TrendingStrip />

          {/* Feed */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {tab === "foryou" ? (
                <motion.div key="foryou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {feedItems.map((item, i) =>
                    item.type === "post" ? (
                      <PostCard key={item.id} post={item.data as Post} index={i} onShare={handleShare} />
                    ) : (
                      <SuggestedCard key={item.id} community={item.data as SuggestedCommunity} />
                    )
                  )}
                  <div className="h-28" />
                </motion.div>
              ) : (
                <motion.div key="following"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-28 px-8 text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-2">
                    <Users className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-[18px] font-bold text-foreground">Nothing here yet</p>
                  <p className="text-[14px] text-muted-foreground max-w-[260px] leading-relaxed">
                    Follow people to see their posts here
                  </p>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/rooms")}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-primary/15 text-primary text-[13px] font-bold border border-primary/25 hover:bg-primary/25 transition-colors">
                    Discover Communities
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right sidebar (xl+) ── */}
        <RightSidebar onCreateRoom={() => navigate("/create-room")} />
      </div>

      {/* Mobile floating compose */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-20 right-4 xl:hidden z-40 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_28px_rgba(124,58,237,0.55)] hover:shadow-[0_0_38px_rgba(124,58,237,0.7)] transition-shadow"
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      <BottomNav />
    </div>
  );
}
""")

print("\n✅ Done! Run: npm run dev")
print("   Navigate to / to see the rebuilt Home feed.")

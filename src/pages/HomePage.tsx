import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp, ChevronDown, MessageSquare, Share, Search,
  MoreHorizontal, Mic, MicOff, Users, Menu, X, ArrowLeft,
  PenSquare, Image as ImageIcon, Video, Trophy, Plus,
  Square, Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import {
  samplePosts, suggestedCommunities, loungeUsers, sampleRooms, lounges,
} from "@/lib/lounge-data";
import type { Post, SuggestedCommunity, Comment } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];
type FeedTab = "foryou" | "following";

interface HomePageProps { onMenuOpen: () => void; }

// ─── LIVE DOT ─────────────────────────────────────────────────────────────────
function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={"relative flex flex-shrink-0 " + s}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={"relative inline-flex rounded-full bg-green-500 " + s} />
    </span>
  );
}

// ─── TRENDING STRIP (NOT sticky — scrolls away) ───────────────────────────────
function TrendingStrip() {
  const navigate = useNavigate();
  const cards = [
    { id: "r1", title: "Remote work is killing culture", community: "Daily Debate", img: "https://picsum.photos/seed/debate1/320/180", roomId: "r1" },
    { id: "r2", title: "Champions League semi-finals", community: "Football Talk", img: "https://picsum.photos/seed/football2/320/180", roomId: "r5" },
    { id: "r3", title: "Claude vs GPT — who wins?", community: "Tech and AI", img: "https://picsum.photos/seed/tech3/320/180", roomId: "r6" },
    { id: "r4", title: "Pitch practice: sell me this pen", community: "Business English", img: "https://picsum.photos/seed/biz4/320/180", roomId: "r3" },
    { id: "r5", title: "Tell me about your week", community: "Beginner Corner", img: "https://picsum.photos/seed/begin5/320/180", roomId: "r4" },
  ];
  return (
    <div className="border-b border-white/[0.07]">
      <div className="flex gap-2.5 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/room/" + card.roomId)}
            className="flex-shrink-0 w-[200px] h-[120px] rounded-xl overflow-hidden relative group"
          >
            <img src={card.img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left">
              <div className="flex items-center gap-1 mb-1">
                <LiveDot sm />
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wide">Live</span>
              </div>
              <p className="text-[12px] font-bold text-white leading-tight line-clamp-2">{card.title}</p>
              <p className="text-[10px] text-white/60 mt-0.5">{card.community}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const postResults = query.trim() ? samplePosts.filter((p) => p.content.toLowerCase().includes(query.toLowerCase()) || p.author.full_name.toLowerCase().includes(query.toLowerCase())) : [];
  const communityResults = query.trim() ? lounges.filter((l) => l.name.toLowerCase().includes(query.toLowerCase())) : [];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }} className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117] border-b border-white/[0.08] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 max-w-[1080px] mx-auto">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"><ArrowLeft className="h-5 w-5" /></button>
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts, people, communities..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
                {query && <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground flex-shrink-0"><X className="h-3.5 w-3.5" /></button>}
              </div>
            </div>
            {query.trim() && (
              <div className="max-h-[60vh] overflow-y-auto max-w-[1080px] mx-auto">
                {communityResults.map((l) => (
                  <button key={l.id} onClick={() => { navigate("/lounge/" + l.id); onClose(); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04]">
                    <div className={"w-9 h-9 rounded-xl bg-gradient-to-br " + l.gradient + " flex items-center justify-center text-lg flex-shrink-0"}>{l.emoji}</div>
                    <div className="text-left"><p className="text-sm font-semibold text-foreground">{l.name}</p><p className="text-xs text-muted-foreground">{l.memberCount.toLocaleString()} members</p></div>
                  </button>
                ))}
                {postResults.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04]">
                    <img src={post.author.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-xs font-bold text-foreground">{post.author.full_name}</p><p className="text-xs text-foreground/75 line-clamp-2 mt-0.5">{post.content}</p></div>
                  </div>
                ))}
                {postResults.length === 0 && communityResults.length === 0 && <div className="px-4 py-8 text-center"><p className="text-sm text-muted-foreground">No results for "{query}"</p></div>}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── VOICE RECORDER HOOK ──────────────────────────────────────────────────────
function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access denied. Please allow microphone access to record voice.");
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const clear = () => { setAudioUrl(null); setSeconds(0); };

  return { recording, audioUrl, seconds, start, stop, clear };
}

// ─── COMPOSE MODAL (fully working) ────────────────────────────────────────────
function ComposeModal({ open, onClose, onPost }: { open: boolean; onClose: () => void; onPost: (post: Post) => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const voice = useVoiceRecorder();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    setMediaPreview({ url, type });
  };

  const reset = () => { setTitle(""); setText(""); setMediaPreview(null); voice.clear(); };

  const handlePost = () => {
    if (!text.trim() && !title.trim()) return;
    const newPost: Post = {
      id: "p" + Date.now(),
      content: text,
      title: title || undefined,
      author: currentUser,
      upvotes: 0,
      reposts: 0,
      comments: [],
      createdAt: "just now",
      mediaType: mediaPreview?.type ?? (voice.audioUrl ? "text" : "text"),
      mediaUrl: mediaPreview?.url ?? undefined,
    };
    onPost(newPost);
    reset();
    onClose();
  };

  const canPost = text.trim() || title.trim();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[560px] bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={() => { reset(); onClose(); }} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              <p className="text-sm font-bold text-foreground">New Post</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} disabled={!canPost} onClick={handlePost} className={"px-5 py-1.5 rounded-full text-sm font-bold transition-all " + (canPost ? "bg-primary text-white hover:bg-primary/90" : "bg-primary/20 text-primary/40 cursor-not-allowed")}>
                Post
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex gap-3 px-5 py-4">
              <img src={currentUser.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-3">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full bg-transparent text-[17px] font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
                <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What's on your mind?" rows={4} className="w-full bg-transparent text-[15px] text-foreground/90 placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed" />

                {/* Media preview */}
                {mediaPreview && (
                  <div className="relative rounded-xl overflow-hidden">
                    {mediaPreview.type === "image"
                      ? <img src={mediaPreview.url} alt="" className="w-full max-h-48 object-cover rounded-xl" />
                      : <video src={mediaPreview.url} controls className="w-full max-h-48 rounded-xl" />
                    }
                    <button onClick={() => setMediaPreview(null)} className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Voice preview */}
                {voice.audioUrl && !voice.recording && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/[0.08]">
                    <Mic className="h-4 w-4 text-primary flex-shrink-0" />
                    <audio src={voice.audioUrl} controls className="flex-1 h-7" style={{ filter: "invert(0) sepia(1) saturate(2) hue-rotate(220deg)" }} />
                    <button onClick={voice.clear} className="text-muted-foreground hover:text-destructive transition-colors"><X className="h-3.5 w-3.5" /></button>
                  </div>
                )}

                {/* Recording indicator */}
                {voice.recording && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>
                    <span className="text-sm text-red-400 font-semibold">Recording {Math.floor(voice.seconds / 60).toString().padStart(2, "0")}:{(voice.seconds % 60).toString().padStart(2, "0")}</span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={voice.stop} className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">
                      <Square className="h-3 w-3" /> Stop
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-5 py-3 border-t border-white/[0.07]">
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
              <button onClick={() => { fileRef.current!.accept = "image/*"; fileRef.current?.click(); }} className="p-2 rounded-full hover:bg-white/5 text-primary transition-colors" title="Add image">
                <ImageIcon className="h-5 w-5" />
              </button>
              <button onClick={() => { fileRef.current!.accept = "video/*"; fileRef.current?.click(); }} className="p-2 rounded-full hover:bg-white/5 text-primary transition-colors" title="Add video">
                <Video className="h-5 w-5" />
              </button>
              <button
                onClick={() => voice.recording ? voice.stop() : voice.start()}
                className={"p-2 rounded-full transition-colors " + (voice.recording ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "hover:bg-white/5 text-primary")}
                title={voice.recording ? "Stop recording" : "Record voice"}
              >
                {voice.recording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{280 - text.length}</span>
                <div className="w-px h-4 bg-white/10" />
                <button className="text-xs font-semibold text-primary px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors">Community</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── CREATE ROOM MODAL ────────────────────────────────────────────────────────
function CreateRoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("Open Floor");
  const [maxSlots, setMaxSlots] = useState(8);
  const [selectedLounge, setSelectedLounge] = useState(lounges[0].id);
  const modes = ["Open Floor", "Debate", "Teach Me", "Hot Seat"];

  const handleCreate = () => {
    if (!roomName.trim()) return;
    onClose();
    navigate("/room/new");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[480px] bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              <p className="text-sm font-bold text-foreground">Create a Room</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} disabled={!roomName.trim()} onClick={handleCreate} className={"px-5 py-1.5 rounded-full text-sm font-bold transition-all " + (roomName.trim() ? "bg-primary text-white" : "bg-primary/20 text-primary/40 cursor-not-allowed")}>
                Create
              </motion.button>
            </div>
            <div className="px-5 py-5 space-y-5">
              {/* Room name */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Room Name *</label>
                <input autoFocus value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="What will you talk about?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors" />
              </div>
              {/* Topic */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Topic (optional)</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Grammar, Pronunciation, Culture..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors" />
              </div>
              {/* Community */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Community</label>
                <div className="grid grid-cols-2 gap-2">
                  {lounges.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLounge(l.id)}
                      className={"flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all " + (selectedLounge === l.id ? "border-primary/50 bg-primary/10 text-primary" : "border-white/[0.08] bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20")}
                    >
                      <span>{l.emoji}</span><span className="truncate">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Mode */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Room Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {modes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={"px-3 py-2.5 rounded-xl border text-sm font-medium transition-all " + (mode === m ? "border-primary/50 bg-primary/10 text-primary" : "border-white/[0.08] bg-white/5 text-muted-foreground hover:text-foreground")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* Max participants */}
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

// ─── SHARE TOAST ─────────────────────────────────────────────────────────────
function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs text-foreground font-medium whitespace-nowrap">
          Link copied ✓
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── VOTE PILL ────────────────────────────────────────────────────────────────
function VotePill({ initial }: { initial: number }) {
  const [votes, setVotes] = useState(initial);
  const [voted, setVoted] = useState<1 | -1 | 0>(0);
  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
  const up = (e: React.MouseEvent) => { e.stopPropagation(); if (voted === 1) { setVoted(0); setVotes(initial); } else { setVoted(1); setVotes(initial + 1); } };
  const down = (e: React.MouseEvent) => { e.stopPropagation(); if (voted === -1) { setVoted(0); setVotes(initial); } else { setVoted(-1); setVotes(initial - 1); } };
  return (
    <div className="flex items-center rounded-full bg-white/[0.07] border border-white/[0.08] overflow-hidden h-8" onClick={(e) => e.stopPropagation()}>
      <motion.button whileTap={{ scale: 1.2 }} onClick={up} className={"px-2.5 h-full flex items-center transition-colors " + (voted === 1 ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}>
        <ChevronUp className="h-4 w-4" />
      </motion.button>
      <span className={"text-[13px] font-bold px-1 " + (voted === 1 ? "text-primary" : voted === -1 ? "text-destructive" : "text-foreground")}>{fmt(votes)}</span>
      <motion.button whileTap={{ scale: 1.2 }} onClick={down} className={"px-2.5 h-full flex items-center transition-colors " + (voted === -1 ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10")}>
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, index, onShare }: { post: Post; index: number; onShare: () => void }) {
  const navigate = useNavigate();
  const [showReplies, setShowReplies] = useState(false);
  const [reposts, setReposts] = useState(post.reposts);
  const [reposted, setReposted] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const replyRef = useRef<HTMLInputElement>(null);
  const voice = useVoiceRecorder();
  const replyFileRef = useRef<HTMLInputElement>(null);

  const handleRepost = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (reposted) { setReposted(false); setReposts((r) => r - 1); }
    else { setReposted(true); setReposts((r) => r + 1); }
  }, [reposted]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + "/post/" + post.id).catch(() => {});
    onShare();
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(true);
    setTimeout(() => replyRef.current?.focus(), 200);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    const newComment: Comment = {
      id: "c" + Date.now(),
      content: replyText,
      author: currentUser,
      upvotes: 0,
      createdAt: "just now",
    };
    setComments((prev) => [newComment, ...prev]);
    setReplyText("");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-white/[0.07] hover:bg-white/[0.012] transition-colors"
    >
      <div className="px-4 pt-4 pb-3 cursor-pointer" onClick={() => setTextExpanded((e) => !e)}>
        {/* Meta row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <img src={post.author.avatar_url} alt="" className="w-6 h-6 rounded-full border border-white/10 flex-shrink-0" />
            {post.loungeName && post.loungeId
              ? <button onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + post.loungeId); }} className="text-[13px] font-bold text-foreground hover:text-primary transition-colors">{post.loungeName}</button>
              : <span className="text-[13px] font-bold text-foreground">{post.author.full_name}</span>
            }
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-[12px] text-muted-foreground">@{post.author.username}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-[12px] text-muted-foreground flex-shrink-0">{post.createdAt}</span>
            {post.isPinned && <span className="text-[11px] text-amber-400 font-semibold flex-shrink-0">📌 Pinned</span>}
          </div>
          <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        {post.title && <h2 className="text-[18px] font-bold text-foreground leading-snug mb-2">{post.title}</h2>}

        {/* Body */}
        <p className={"text-[14px] text-foreground/85 leading-[1.6] " + (!textExpanded ? "line-clamp-3" : "")} style={{ wordBreak: "break-word" }}>{post.content}</p>

        {/* Media */}
        {post.mediaType === "image" && post.mediaUrl && (
          <div className="mt-3 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={post.mediaUrl} alt="" className="w-full object-cover max-h-[400px] rounded-xl" loading="lazy" />
          </div>
        )}
        {post.mediaType === "video" && post.mediaUrl && (
          <div className="mt-3 rounded-xl overflow-hidden bg-black/60" onClick={(e) => e.stopPropagation()}>
            <video src={post.mediaUrl} controls muted playsInline className="w-full max-h-[400px] object-contain rounded-xl" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
          <VotePill initial={post.upvotes} />
          <motion.button whileTap={{ scale: 1.1 }} onClick={handleReplyClick} className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/[0.07] border border-white/[0.08] text-muted-foreground hover:text-sky-400 hover:bg-sky-400/10 transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-[13px] font-semibold">{comments.length > 0 ? comments.length : "Comment"}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 1.1 }} onClick={handleShare} className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/[0.07] border border-white/[0.08] text-muted-foreground hover:text-violet-400 hover:bg-violet-400/10 transition-colors">
            <Share className="h-3.5 w-3.5" /><span className="text-[13px] font-semibold">Share</span>
          </motion.button>
          {reposts > 0 && (
            <motion.button whileTap={{ scale: 1.1 }} onClick={handleRepost} className={"flex items-center gap-1.5 px-3 h-8 rounded-full border transition-colors " + (reposted ? "bg-green-400/10 border-green-400/20 text-green-400" : "bg-white/[0.07] border-white/[0.08] text-muted-foreground hover:text-green-400 hover:bg-green-400/10")}>
              <span className="text-[13px] font-semibold">{reposts} Reposts</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {showReplies && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="bg-[#0a0e18] border-t border-white/[0.06]">
              {/* Reply composer */}
              <div className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.05]">
                <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <input
                    ref={replyRef}
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && replyText.trim()) submitReply(); }}
                    placeholder="What are your thoughts?"
                    className="w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                  {/* Reply toolbar */}
                  <div className="flex items-center gap-2 mt-2">
                    <input ref={replyFileRef} type="file" accept="image/*,video/*" className="hidden" />
                    <button onClick={() => replyFileRef.current?.click()} className="p-1.5 rounded-full hover:bg-white/5 text-primary/70 hover:text-primary transition-colors"><ImageIcon className="h-4 w-4" /></button>
                    <button onClick={() => voice.recording ? voice.stop() : voice.start()} className={"p-1.5 rounded-full transition-colors " + (voice.recording ? "text-red-400 bg-red-400/10" : "text-primary/70 hover:text-primary hover:bg-white/5")}>
                      {voice.recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    {voice.recording && <span className="text-xs text-red-400 font-semibold">{voice.seconds}s</span>}
                    <div className="ml-auto flex gap-2">
                      <button onClick={() => setShowReplies(false)} className="px-3 py-1 rounded-full text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                      <motion.button whileTap={{ scale: 0.94 }} onClick={submitReply} disabled={!replyText.trim()} className={"px-4 py-1 rounded-full text-[13px] font-bold transition-all " + (replyText.trim() ? "bg-primary text-white" : "bg-primary/20 text-primary/40 cursor-not-allowed")}>
                        Reply
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments list */}
              {comments.length === 0
                ? <div className="px-4 py-6 text-center"><p className="text-sm text-muted-foreground/60">No replies yet. Be the first!</p></div>
                : <div className="divide-y divide-white/[0.04]">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 px-4 py-3">
                        <img src={comment.author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="text-[13px] font-bold text-foreground">{comment.author.full_name}</span>
                            <span className="text-[11px] text-muted-foreground">{comment.createdAt}</span>
                          </div>
                          <p className="text-[13px] text-foreground/85 leading-relaxed">{comment.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center rounded-full bg-white/5 border border-white/[0.07] overflow-hidden h-6">
                              <button className="px-2 h-full text-muted-foreground hover:text-primary transition-colors"><ChevronUp className="h-3 w-3" /></button>
                              <span className="text-[11px] font-bold text-foreground px-1">{comment.upvotes}</span>
                              <button className="px-2 h-full text-muted-foreground hover:text-destructive transition-colors"><ChevronDown className="h-3 w-3" /></button>
                            </div>
                            <button className="text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              }
              <button onClick={() => setShowReplies(false)} className="w-full py-2.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-semibold hover:bg-white/5 flex items-center justify-center gap-1">
                <ChevronUp className="h-3.5 w-3.5" /> Hide replies
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── SUGGESTED COMMUNITY CARD ─────────────────────────────────────────────────
function SuggestedCommunityCard({ community }: { community: SuggestedCommunity }) {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-4 border-b border-white/[0.07] hover:bg-white/[0.018] transition-colors">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-3">Suggested community</p>
      <div className="flex items-center gap-3">
        <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + community.gradient + " flex items-center justify-center flex-shrink-0 text-xl"}>{community.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-foreground">{community.name} <span className="text-muted-foreground font-normal text-[12px]">· {community.memberCount.toLocaleString()} members</span></p>
          <p className="text-[11px] text-muted-foreground/70 italic mt-0.5">{community.matchReason}</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} onClick={() => { setJoined(!joined); if (!joined) navigate("/lounge/" + community.id); }} className={"flex-shrink-0 px-4 h-8 rounded-full text-[12px] font-bold transition-all border " + (joined ? "bg-transparent border-white/20 text-foreground" : "bg-primary border-primary text-white")}>
          {joined ? "Joined" : "Join"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────
function RightSidebar({ onCreateRoom }: { onCreateRoom: () => void }) {
  const navigate = useNavigate();
  const [sideTab, setSideTab] = useState<"communities" | "people">("communities");
  return (
    <div className="hidden lg:flex flex-col w-[310px] flex-shrink-0 pl-6 pt-4">
      <div className="flex items-center bg-white/5 rounded-full p-0.5 mb-5 border border-white/[0.08]">
        {(["communities", "people"] as const).map((t) => (
          <button key={t} onClick={() => setSideTab(t)} className={"flex-1 py-1.5 rounded-full text-[13px] font-bold capitalize transition-all " + (sideTab === t ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground")}>
            {t === "communities" ? "Communities" : "People"}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sideTab === "communities" ? (
          <motion.div key="comm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60 font-bold mb-3 px-1">Popular Communities</p>
            <div className="space-y-0.5">
              {lounges.map((lounge, i) => (
                <motion.button key={lounge.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/lounge/" + lounge.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left group">
                  <div className={"w-9 h-9 rounded-lg bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-[18px] flex-shrink-0"}>{lounge.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{lounge.name}</p>
                    <p className="text-[12px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members</p>
                  </div>
                  {lounge.activeRooms > 0 && <div className="flex items-center gap-1 flex-shrink-0"><LiveDot sm /><span className="text-[10px] text-green-400 font-bold">{lounge.activeRooms}</span></div>}
                </motion.button>
              ))}
            </div>
            <button className="mt-3 px-3 text-[13px] text-primary font-semibold hover:underline">See more</button>
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2"><Mic className="h-5 w-5 text-primary" /><p className="text-sm font-bold text-foreground">Start a room</p></div>
              <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">Host your own voice room and invite others to join the conversation</p>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreateRoom} className="w-full py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">Create Room</motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="people" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60 font-bold mb-3 px-1">People you may know</p>
            <div className="space-y-0.5">
              {loungeUsers.slice(1).map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
                  <div className="relative flex-shrink-0">
                    <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10" />
                    {user.is_online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">{user.full_name}</p>
                    <p className="text-[12px] text-muted-foreground">@{user.username} · {user.english_level}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="flex-shrink-0 px-3 h-7 rounded-full text-[12px] font-bold bg-white/[0.07] border border-white/[0.12] text-foreground hover:bg-primary/15 hover:text-primary hover:border-primary/30 transition-colors">Follow</motion.button>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2"><Trophy className="h-5 w-5 text-amber-400" /><p className="text-sm font-bold text-foreground">Top Speakers</p></div>
              {loungeUsers.slice(0, 3).map((u, i) => (
                <div key={u.id} className="flex items-center gap-2 py-1.5">
                  <span className={"text-[12px] font-bold w-4 " + (i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : "text-amber-700")}>{i + 1}</span>
                  <img src={u.avatar_url} alt="" className="w-6 h-6 rounded-full border border-white/10" />
                  <span className="text-[13px] text-foreground flex-1 truncate">{u.full_name}</span>
                  <span className="text-[11px] text-muted-foreground">{u.xp_points.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage({ onMenuOpen }: HomePageProps) {
  const [tab, setTab] = useState<FeedTab>("foryou");
  const [searchOpen, setSearchOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  const handleShare = () => { setShareToast(true); setTimeout(() => setShareToast(false), 2200); };
  const handleNewPost = (post: Post) => setPosts((prev) => [post, ...prev]);

  const feed: { type: "post" | "suggestion"; id: string; data: Post | SuggestedCommunity }[] = [];
  posts.forEach((post, i) => {
    feed.push({ type: "post", id: post.id, data: post });
    if (i === 4 && suggestedCommunities[0]) feed.push({ type: "suggestion", id: "sugg-0", data: suggestedCommunities[0] });
  });

  return (
    <div className="min-h-screen bg-background">
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onPost={handleNewPost} />
      <CreateRoomModal open={createRoomOpen} onClose={() => setCreateRoomOpen(false)} />
      <ShareToast visible={shareToast} />

      <div className="max-w-[1080px] mx-auto px-4 flex gap-0">
        {/* Center feed */}
        <div className="flex-1 min-w-0 flex flex-col border-x border-white/[0.07]">

          {/* ── STICKY: only the header tabs + composer bar ── */}
          <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
            <div className="flex items-center h-[53px] px-4 gap-2">
              <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="flex flex-1 items-center justify-center">
                {(["foryou", "following"] as FeedTab[]).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={"relative flex-1 flex justify-center py-4 text-[15px] font-bold transition-colors max-w-[200px] " + (tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}>
                    {t === "foryou" ? "For You" : "Following"}
                    {tab === t && <motion.div layoutId="feed-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-16 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-white/[0.08] transition-colors flex-shrink-0">
                <Search className="h-[19px] w-[19px] text-muted-foreground" />
              </button>
            </div>

            {/* Composer bar (sticky) */}
            <button onClick={() => setComposeOpen(true)} className="flex items-center gap-3 px-4 py-3 w-full border-t border-white/[0.07] hover:bg-white/[0.02] transition-colors">
              <img src={currentUser.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10 flex-shrink-0" />
              <span className="text-[15px] text-muted-foreground/50 flex-1 text-left">What's on your mind?</span>
              <div className="flex items-center gap-2 text-primary">
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
                  {feed.map((item, i) =>
                    item.type === "post"
                      ? <PostCard key={item.id} post={item.data as Post} index={i} onShare={handleShare} />
                      : <SuggestedCommunityCard key={item.id} community={item.data as SuggestedCommunity} />
                  )}
                  <div className="h-28" />
                </motion.div>
              ) : (
                <motion.div key="following" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-28 px-8 text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2"><Users className="h-7 w-7 text-muted-foreground" /></div>
                  <p className="text-[18px] font-bold text-foreground">Nothing here yet</p>
                  <p className="text-[14px] text-muted-foreground max-w-[260px]">Join communities to see their posts here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar onCreateRoom={() => setCreateRoomOpen(true)} />
      </div>

      {/* Mobile floating compose */}
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setComposeOpen(true)} className="fixed bottom-20 right-4 lg:hidden z-40 w-14 h-14 rounded-full bg-primary shadow-[0_0_28px_rgba(124,58,237,0.5)] flex items-center justify-center">
        <PenSquare className="h-6 w-6 text-white" />
      </motion.button>

      <BottomNav />
    </div>
  );
}
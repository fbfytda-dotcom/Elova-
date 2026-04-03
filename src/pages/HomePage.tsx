import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageSquare, Repeat2, Share, Search, MoreHorizontal,
  Mic, Users, BadgeCheck, Menu, X, Home, Compass, Flame,
  Zap, Settings, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";
import { BottomNav } from "@/components/BottomNav";
import {
  samplePosts, suggestedCommunities, loungeUsers, sampleRooms, lounges
} from "@/lib/lounge-data";
import type { Post, SuggestedCommunity } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];
type Tab = "foryou" | "following";

// ─── LIVE DOT ────────────────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

// ─── LEFT PANEL (hamburger menu) ─────────────────────────────────────────────
function LeftPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Mic, label: "Rooms", path: "/rooms" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#0f1320] border-r border-white/[0.08] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                <div>
                  <p className="text-sm font-bold text-foreground">{currentUser.full_name}</p>
                  <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/8 transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-1.5 text-sm">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="font-bold text-foreground">{currentUser.streak_count}</span>
                <span className="text-muted-foreground text-xs">streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">{currentUser.xp_points.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs">XP</span>
              </div>
              <LevelBadge level={currentUser.english_level} />
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}

              <div className="pt-3 pb-1 px-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Your Communities</p>
              </div>
              {lounges.slice(0, 4).map((lounge) => (
                <button
                  key={lounge.id}
                  onClick={() => { navigate("/lounge/" + lounge.id); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                >
                  <span className="text-base">{lounge.emoji}</span>
                  {lounge.name}
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/[0.07]">
              <button
                onClick={() => { navigate("/profile"); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? samplePosts.filter((p) =>
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        p.author.full_name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const communityResults = query.trim()
    ? lounges.filter((l) =>
        l.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.18 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0f1320] border-b border-white/[0.08] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts, people, communities..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="max-h-[60vh] overflow-y-auto">
                {communityResults.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-semibold border-b border-white/[0.05]">Communities</p>
                    {communityResults.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { navigate("/lounge/" + l.id); onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04]"
                      >
                        <div className={"w-9 h-9 rounded-xl bg-gradient-to-br " + l.gradient + " flex items-center justify-center text-lg flex-shrink-0"}>
                          {l.emoji}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.memberCount.toLocaleString()} members</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {results.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-semibold border-b border-white/[0.05]">Posts</p>
                    {results.map((post) => (
                      <div key={post.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04]">
                        <img src={post.author.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{post.author.full_name}</p>
                          <p className="text-xs text-foreground/75 line-clamp-2 mt-0.5 leading-relaxed">{post.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {results.length === 0 && communityResults.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No results for "{query}"</p>
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

// ─── LIVE ROOM STRIP ─────────────────────────────────────────────────────────
function LiveRoomStrip() {
  const navigate = useNavigate();
  const liveRooms = sampleRooms.filter((r) => r.isLive);
  return (
    <div className="border-b border-white/[0.07]">
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-1.5 flex-shrink-0 pr-3 border-r border-white/10">
          <LiveDot />
          <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">Live</span>
        </div>
        {liveRooms.map((room) => (
          <motion.button
            key={room.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/room/" + room.id)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/[0.08] transition-colors"
          >
            <div className="flex -space-x-1.5">
              {room.participants.slice(0, 2).map((p) => (
                <img key={p.id} src={p.avatar_url} alt="" className="w-4 h-4 rounded-full border border-background" />
              ))}
            </div>
            <span className="text-[11px] text-foreground/80 font-medium max-w-[120px] truncate">{room.name}</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Users className="h-2.5 w-2.5" />{room.participants.length}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── SUGGESTED COMMUNITY CARD ─────────────────────────────────────────────────
function SuggestedCommunityCard({ community }: { community: SuggestedCommunity }) {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-4 border-b border-white/[0.07] hover:bg-white/[0.018] transition-colors"
    >
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-3">Suggested for you</p>
      <div className="flex items-start gap-3">
        <div className={"w-11 h-11 rounded-2xl bg-gradient-to-br " + community.gradient + " flex items-center justify-center flex-shrink-0 text-xl shadow-lg"}>
          {community.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground leading-tight">{community.name}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{community.shortDescription}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1 italic">{community.matchReason}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => { setJoined(!joined); if (!joined) navigate("/lounge/" + community.id); }}
              className={"flex-shrink-0 px-4 h-8 rounded-full text-[12px] font-bold transition-all border " + (joined ? "bg-transparent border-white/20 text-foreground" : "bg-primary border-primary text-white hover:bg-primary/90")}
            >
              {joined ? "Joined" : "Join"}
            </motion.button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />{community.memberCount.toLocaleString()} members
            </span>
            {community.activeRooms > 0 && (
              <span className="text-[11px] text-green-400 flex items-center gap-1.5 font-medium">
                <LiveDot />{community.activeRooms} live
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── IMAGE WITH SKELETON ──────────────────────────────────────────────────────
function PostImage({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mt-3 rounded-2xl overflow-hidden bg-white/5" style={{ minHeight: 180 }}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white/5 rounded-2xl" />}
      <img
        src={url}
        alt=""
        onLoad={() => setLoaded(true)}
        className={"w-full object-cover max-h-80 rounded-2xl transition-opacity duration-300 " + (loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

// ─── SHARE TOAST ─────────────────────────────────────────────────────────────
function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs text-foreground font-medium"
        >
          Link copied to clipboard
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, index, onShare }: { post: Post; index: number; onShare: () => void }) {
  const navigate = useNavigate();
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.upvotes);
  const [reposts, setReposts] = useState(post.reposts);
  const [reposted, setReposted] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [textExpanded, setTextExpanded] = useState(false);
  const replyRef = useRef<HTMLInputElement>(null);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikes((l) => (liked ? l - 1 : l + 1));
  }, [liked]);

  // ONE repost per click — toggle only
  const handleRepost = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (reposted) {
      setReposted(false);
      setReposts((r) => r - 1);
    } else {
      setReposted(true);
      setReposts((r) => r + 1);
    }
  }, [reposted]);

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(true);
    setTimeout(() => replyRef.current?.focus(), 180);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + "/post/" + post.id).catch(() => {});
    onShare();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, ease: "easeOut" }}
      className="border-b border-white/[0.07]"
    >
      {/* Main post row */}
      <div
        className="flex gap-3 px-4 pt-4 pb-1 hover:bg-white/[0.014] transition-colors cursor-pointer"
        onClick={() => setTextExpanded((e) => !e)}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
          <img
            src={post.author.avatar_url}
            alt=""
            className="w-10 h-10 rounded-full object-cover border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
          {showReplies && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="w-0.5 flex-1 mt-2 min-h-[20px] bg-white/10 rounded-full origin-top"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-2">
          {/* Author row */}
          <div className="flex items-start justify-between mb-0.5 gap-1">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="text-[15px] font-bold text-foreground leading-tight truncate max-w-[130px]">{post.author.full_name}</span>
              {post.author.english_level === "C2" && <BadgeCheck className="h-[15px] w-[15px] text-primary flex-shrink-0" />}
              <span className="text-[14px] text-muted-foreground">@{post.author.username}</span>
              <span className="text-muted-foreground/40 text-[14px]">·</span>
              <span className="text-[13px] text-muted-foreground flex-shrink-0">{post.createdAt}</span>
            </div>
            <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Community */}
          {post.loungeName && post.loungeId && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + post.loungeId); }}
              className="text-[12px] text-primary/75 hover:text-primary hover:underline mb-1.5 block transition-colors text-left"
            >
              in {post.loungeName}
            </button>
          )}

          {/* Level */}
          <div className="mb-2"><LevelBadge level={post.author.english_level} /></div>

          {/* Text */}
          <p
            className={"text-[15px] text-foreground/92 leading-[1.55] " + (!textExpanded ? "line-clamp-3" : "")}
            style={{ wordBreak: "break-word" }}
          >
            {post.content}
          </p>

          {/* Media */}
          {post.mediaType === "image" && post.mediaUrl && (
            <div onClick={(e) => e.stopPropagation()}><PostImage url={post.mediaUrl} /></div>
          )}
          {post.mediaType === "video" && post.mediaUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden bg-black/60" onClick={(e) => e.stopPropagation()}>
              <video src={post.mediaUrl} controls muted playsInline className="w-full max-h-80 object-contain rounded-2xl" />
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-between mt-2 max-w-[300px] -ml-2" onClick={(e) => e.stopPropagation()}>
            {/* Reply */}
            <motion.button whileTap={{ scale: 1.3 }} onClick={handleReplyClick} className="flex items-center gap-1.5 text-muted-foreground hover:text-sky-400 transition-colors p-2 rounded-full hover:bg-sky-400/10">
              <MessageSquare className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{post.comments.length || ""}</span>
            </motion.button>

            {/* Repost — one click toggle */}
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleRepost}
              className={"flex items-center gap-1.5 transition-colors p-2 rounded-full hover:bg-green-400/10 " + (reposted ? "text-green-400" : "text-muted-foreground hover:text-green-400")}
            >
              <Repeat2 className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{reposts || ""}</span>
            </motion.button>

            {/* Like */}
            <motion.button
              whileTap={{ scale: 1.45 }}
              transition={{ type: "spring", stiffness: 500, damping: 12 }}
              onClick={handleLike}
              className={"flex items-center gap-1.5 transition-colors p-2 rounded-full hover:bg-primary/10 " + (liked ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              <Heart className={"h-[18px] w-[18px] transition-all duration-150 " + (liked ? "fill-primary stroke-primary" : "")} />
              <span className="text-[13px]">{likes || ""}</span>
            </motion.button>

            {/* Share */}
            <motion.button whileTap={{ scale: 1.2 }} onClick={handleShare} className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-400 transition-colors p-2 rounded-full hover:bg-violet-400/10">
              <Share className="h-[18px] w-[18px]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reddit-style replies section — expands BELOW the post */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden bg-white/[0.02] border-t border-white/[0.06]"
          >
            {/* Reply composer */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full flex-shrink-0 border border-white/10" />
              <input
                ref={replyRef}
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What are your thoughts?"
                className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                disabled={!replyText.trim()}
                className={"px-4 h-8 rounded-full text-[13px] font-bold flex-shrink-0 transition-all " + (replyText.trim() ? "bg-primary text-white hover:bg-primary/90" : "bg-primary/20 text-primary/40 cursor-not-allowed")}
              >
                Reply
              </motion.button>
            </div>

            {/* Existing comments */}
            {post.comments.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">No replies yet. Be the first!</p>
              </div>
            )}
            {post.comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
                  <img src={comment.author.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[13px] font-bold text-foreground">{comment.author.full_name}</span>
                    <LevelBadge level={comment.author.english_level} />
                    <span className="text-[11px] text-muted-foreground">{comment.createdAt}</span>
                  </div>
                  <p className="text-[13px] text-foreground/85 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="h-3.5 w-3.5" />
                      <span className="text-[11px]">{comment.upvotes}</span>
                    </button>
                    <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">Reply</button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Collapse button */}
            <button
              onClick={() => setShowReplies(false)}
              className="w-full py-2.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium hover:bg-white/5"
            >
              Hide replies ↑
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── FLOATING COMPOSE ────────────────────────────────────────────────────────
function FloatingCompose() {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-primary shadow-[0_0_28px_rgba(124,58,237,0.5)] flex items-center justify-center"
    >
      <Mic className="h-6 w-6 text-white" />
    </motion.button>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [tab, setTab] = useState<Tab>("foryou");
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const feed: { type: "post" | "suggestion"; id: string; data: Post | SuggestedCommunity }[] = [];
  samplePosts.forEach((post, i) => {
    feed.push({ type: "post", id: post.id, data: post });
    if (i === 4 && suggestedCommunities[0]) {
      feed.push({ type: "suggestion", id: "sugg-0", data: suggestedCommunities[0] });
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Left panel */}
      <LeftPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Share toast */}
      <ShareToast visible={shareToast} />

      {/* Center column — exactly 600px, centered */}
      <div className="w-full max-w-[600px] min-h-screen flex flex-col border-x border-white/[0.07]">

        {/* Sticky header */}
        <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
          <div className="flex items-center h-[53px] px-4 gap-2">
            {/* Hamburger */}
            <button
              onClick={() => setPanelOpen(true)}
              className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Tabs */}
            <div className="flex flex-1 items-center justify-center">
              {(["foryou", "following"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={"relative flex-1 flex justify-center py-4 text-[15px] font-bold transition-colors max-w-[200px] " + (tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}
                >
                  {t === "foryou" ? "For You" : "Following"}
                  {tab === t && (
                    <motion.div layoutId="tab-pill" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-16 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-white/[0.08] transition-colors flex-shrink-0"
            >
              <Search className="h-[19px] w-[19px] text-muted-foreground" />
            </button>
          </div>

          <LiveRoomStrip />
        </div>

        {/* Feed */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {tab === "foryou" ? (
              <motion.div
                key="foryou"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {feed.map((item, i) =>
                  item.type === "post" ? (
                    <PostCard
                      key={item.id}
                      post={item.data as Post}
                      index={i}
                      onShare={handleShare}
                    />
                  ) : (
                    <SuggestedCommunityCard
                      key={item.id}
                      community={item.data as SuggestedCommunity}
                    />
                  )
                )}
                <div className="h-28" />
              </motion.div>
            ) : (
              <motion.div
                key="following"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-28 px-8 text-center gap-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                  <Users className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-[18px] font-bold text-foreground">Nothing here yet</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[260px]">
                  Join communities to see their posts in your Following feed
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FloatingCompose />
      <BottomNav />
    </div>
  );
}
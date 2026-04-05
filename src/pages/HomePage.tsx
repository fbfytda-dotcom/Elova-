import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageSquare, Repeat2, Share, Search, MoreHorizontal,
  Mic, Users, BadgeCheck, Menu, X, ArrowLeft, PenSquare,
  Image as ImageIcon, Video, ChevronUp, ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";
import { BottomNav } from "@/components/BottomNav";
import {
  samplePosts, suggestedCommunities, loungeUsers, sampleRooms, lounges,
} from "@/lib/lounge-data";
import type { Post, SuggestedCommunity } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];
type FeedTab = "foryou" | "following";
type SideTab = "communities" | "people";

interface HomePageProps {
  onMenuOpen: () => void;
}

// ─── LIVE DOT ─────────────────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const postResults = query.trim()
    ? samplePosts.filter((p) =>
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        p.author.full_name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const communityResults = query.trim()
    ? lounges.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
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
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117] border-b border-white/[0.08] shadow-2xl max-w-[600px] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts, people, communities..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

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
                        <div className={"w-9 h-9 rounded-xl bg-gradient-to-br " + l.gradient + " flex items-center justify-center text-lg flex-shrink-0"}>{l.emoji}</div>
                        <div className="text-left min-w-0">
                          <p className="text-sm font-semibold text-foreground">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.memberCount.toLocaleString()} members</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {postResults.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-semibold border-b border-white/[0.05]">Posts</p>
                    {postResults.map((post) => (
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
                {postResults.length === 0 && communityResults.length === 0 && (
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

// ─── COMPOSE MODAL ────────────────────────────────────────────────────────────
function ComposeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
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
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[560px] bg-[#0d1117] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
              <p className="text-sm font-bold text-foreground">New Post</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                disabled={!text.trim()}
                className={"px-5 py-1.5 rounded-full text-sm font-bold transition-all " + (text.trim() ? "bg-primary text-white hover:bg-primary/90" : "bg-primary/20 text-primary/40 cursor-not-allowed")}
              >
                Post
              </motion.button>
            </div>

            {/* Composer */}
            <div className="flex gap-3 px-5 py-4">
              <img src={currentUser.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={5}
                  className="w-full bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-5 py-3 border-t border-white/[0.07]">
              <button className="p-2 rounded-full hover:bg-white/5 text-primary transition-colors">
                <ImageIcon className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-white/5 text-primary transition-colors">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-white/5 text-primary transition-colors">
                <Mic className="h-5 w-5" />
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{280 - text.length}</span>
                <div className="w-px h-4 bg-white/10" />
                <button className="text-xs font-semibold text-primary px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors">
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
        <div className={"w-11 h-11 rounded-2xl bg-gradient-to-br " + community.gradient + " flex items-center justify-center flex-shrink-0 text-xl shadow-lg"}>{community.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground leading-tight">{community.name}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{community.shortDescription}</p>
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
            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{community.memberCount.toLocaleString()} members</span>
            {community.activeRooms > 0 && (
              <span className="text-[11px] text-green-400 flex items-center gap-1.5 font-medium"><LiveDot />{community.activeRooms} live</span>
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
    <div className="relative mt-3 rounded-xl overflow-hidden bg-white/5" style={{ minHeight: 180 }}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white/5 rounded-xl" />}
      <img
        src={url}
        alt=""
        onLoad={() => setLoaded(true)}
        className={"w-full object-cover max-h-96 rounded-xl transition-opacity duration-300 " + (loaded ? "opacity-100" : "opacity-0")}
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
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs text-foreground font-medium whitespace-nowrap"
        >
          Link copied to clipboard ✓
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── COMMENT ITEM (recursive Reddit-style) ────────────────────────────────────
function CommentItem({ author, content, upvotes, createdAt, depth = 0 }: {
  author: typeof loungeUsers[0];
  content: string;
  upvotes: number;
  createdAt: string;
  depth?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(upvotes);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="flex gap-0">
      {/* Indent line */}
      {depth > 0 && (
        <div className="w-8 flex-shrink-0 flex justify-center pt-1">
          <div className="w-0.5 h-full bg-white/[0.08] rounded-full" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2.5 py-3">
          <img src={author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[13px] font-bold text-foreground">{author.full_name}</span>
              <LevelBadge level={author.english_level} />
              <span className="text-[11px] text-muted-foreground">{createdAt}</span>
            </div>
            <p className="text-[13px] text-foreground/85 leading-relaxed">{content}</p>
            {/* Comment actions */}
            <div className="flex items-center gap-1 mt-2 -ml-1.5">
              {/* Upvote/downvote inline like Reddit */}
              <div className="flex items-center rounded-full bg-white/5 border border-white/[0.08] overflow-hidden">
                <button
                  onClick={() => { setLiked(true); setLikes((l) => l + 1); }}
                  className={"px-2 py-1 flex items-center transition-colors " + (liked ? "text-primary" : "text-muted-foreground hover:text-primary")}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <span className="text-[12px] font-semibold text-foreground px-1">{likes}</span>
                <button
                  onClick={() => { setLiked(false); setLikes((l) => Math.max(0, l - 1)); }}
                  className="px-2 py-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => setReplying(!replying)}
                className="text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-full hover:bg-white/5"
              >
                Reply
              </button>
            </div>
            {/* Reply input */}
            {replying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 mt-2"
              >
                <img src={currentUser.avatar_url} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
                />
                <button
                  onClick={() => setReplying(false)}
                  className={"px-3 py-1.5 rounded-full text-xs font-bold " + (replyText.trim() ? "bg-primary text-white" : "bg-white/5 text-muted-foreground")}
                >
                  {replyText.trim() ? "Post" : "Cancel"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
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

  const handleRepost = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (reposted) { setReposted(false); setReposts((r) => r - 1); }
    else { setReposted(true); setReposts((r) => r + 1); }
  }, [reposted]);

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(true);
    setTimeout(() => replyRef.current?.focus(), 200);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + "/post/" + post.id).catch(() => {});
    onShare();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, ease: "easeOut" }}
      className="border-b border-white/[0.07]"
    >
      {/* Post */}
      <div className="flex gap-3 px-4 pt-4 pb-2 hover:bg-white/[0.012] transition-colors cursor-pointer" onClick={() => setTextExpanded((e) => !e)}>
        {/* Avatar + thread line */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: 42 }}>
          <img
            src={post.author.avatar_url}
            alt=""
            className="w-[42px] h-[42px] rounded-full object-cover border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
          {showReplies && <div className="w-0.5 flex-1 mt-2 min-h-[12px] bg-white/10 rounded-full" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-1">
          {/* Author row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-[15px] font-bold text-foreground truncate max-w-[140px]">{post.author.full_name}</span>
              {post.author.english_level === "C2" && <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />}
              <span className="text-[13px] text-muted-foreground">@{post.author.username}</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-[13px] text-muted-foreground flex-shrink-0">{post.createdAt}</span>
            </div>
            <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-full hover:bg-white/8 text-muted-foreground flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Community pill */}
          {post.loungeName && post.loungeId && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + post.loungeId); }}
              className="text-[12px] text-primary/80 hover:text-primary hover:underline mb-2 block transition-colors text-left font-medium"
            >
              📍 {post.loungeName}
            </button>
          )}

          <div className="mb-2"><LevelBadge level={post.author.english_level} /></div>

          {/* Text */}
          <p
            className={"text-[15px] text-foreground/90 leading-[1.6] " + (!textExpanded ? "line-clamp-3" : "")}
            style={{ wordBreak: "break-word" }}
          >
            {post.content}
          </p>

          {/* Media */}
          {post.mediaType === "image" && post.mediaUrl && (
            <div onClick={(e) => e.stopPropagation()}><PostImage url={post.mediaUrl} /></div>
          )}
          {post.mediaType === "video" && post.mediaUrl && (
            <div className="mt-3 rounded-xl overflow-hidden bg-black/60" onClick={(e) => e.stopPropagation()}>
              <video src={post.mediaUrl} controls muted playsInline className="w-full max-h-96 object-contain rounded-xl" />
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-1 mt-3 -ml-2" onClick={(e) => e.stopPropagation()}>
            {/* Replies */}
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleReplyClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-sky-400 transition-colors px-3 py-1.5 rounded-full hover:bg-sky-400/10"
            >
              <MessageSquare className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{post.comments.length || ""}</span>
            </motion.button>

            {/* Repost */}
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleRepost}
              className={"flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-green-400/10 " + (reposted ? "text-green-400" : "text-muted-foreground hover:text-green-400")}
            >
              <Repeat2 className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{reposts || ""}</span>
            </motion.button>

            {/* Like */}
            <motion.button
              whileTap={{ scale: 1.4 }}
              transition={{ type: "spring", stiffness: 500, damping: 12 }}
              onClick={handleLike}
              className={"flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-primary/10 " + (liked ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              <Heart className={"h-[18px] w-[18px] transition-all " + (liked ? "fill-primary stroke-primary" : "")} />
              <span className="text-[13px]">{likes || ""}</span>
            </motion.button>

            {/* Share */}
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleShare}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-400 transition-colors px-3 py-1.5 rounded-full hover:bg-violet-400/10"
            >
              <Share className="h-[18px] w-[18px]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reddit-style replies */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0a0e18] border-t border-white/[0.06]">
              {/* Composer */}
              <div className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.05]">
                <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <input
                    ref={replyRef}
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                  {replyText.trim() && (
                    <div className="flex justify-end mt-2">
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        className="px-4 h-8 rounded-full text-[13px] font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        Reply
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments list */}
              {post.comments.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground/60">No replies yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="px-4 divide-y divide-white/[0.04]">
                  {post.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      author={comment.author}
                      content={comment.content}
                      upvotes={comment.upvotes}
                      createdAt={comment.createdAt}
                      depth={0}
                    />
                  ))}
                </div>
              )}

              {/* Hide */}
              <button
                onClick={() => setShowReplies(false)}
                className="w-full py-2.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium hover:bg-white/5 flex items-center justify-center gap-1"
              >
                <ChevronUp className="h-3.5 w-3.5" /> Hide replies
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────
function RightSidebar() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<SideTab>("communities");

  return (
    <div className="hidden lg:flex flex-col w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-white/[0.07] bg-background">
      {/* Tabs */}
      <div className="flex border-b border-white/[0.07]">
        {(["communities", "people"] as SideTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={"flex-1 py-3.5 text-[13px] font-bold capitalize transition-colors relative " + (tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}
          >
            {t === "communities" ? "Communities" : "People"}
            {tab === t && (
              <motion.div layoutId="sidebar-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-16 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {tab === "communities" ? (
            <motion.div key="comm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Suggested for you</p>
              {lounges.map((lounge, i) => (
                <motion.button
                  key={lounge.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate("/lounge/" + lounge.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-lg flex-shrink-0"}>{lounge.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{lounge.name}</p>
                    <p className="text-[11px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members</p>
                  </div>
                  {lounge.activeRooms > 0 && (
                    <div className="flex items-center gap-1">
                      <LiveDot />
                      <span className="text-[10px] text-green-400 font-semibold">{lounge.activeRooms}</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="people" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">People you may know</p>
              {loungeUsers.slice(1).map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                    {user.is_online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.full_name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">@{user.username}</span>
                      <LevelBadge level={user.english_level} />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex-shrink-0 px-3 h-7 rounded-full text-[11px] font-bold bg-primary/15 text-primary hover:bg-primary/25 transition-colors border border-primary/20"
                  >
                    Follow
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage({ onMenuOpen }: HomePageProps) {
  const [tab, setTab] = useState<FeedTab>("foryou");
  const [searchOpen, setSearchOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2200);
  };

  const feed: { type: "post" | "suggestion"; id: string; data: Post | SuggestedCommunity }[] = [];
  samplePosts.forEach((post, i) => {
    feed.push({ type: "post", id: post.id, data: post });
    if (i === 4 && suggestedCommunities[0]) {
      feed.push({ type: "suggestion", id: "sugg-0", data: suggestedCommunities[0] });
    }
  });

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
      <ShareToast visible={shareToast} />

      {/* Main column */}
      <div className="w-full max-w-[600px] min-h-screen flex flex-col border-x border-white/[0.07]">

        {/* Sticky header */}
        <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
          <div className="flex items-center h-[53px] px-4 gap-2">
            <button
              onClick={onMenuOpen}
              className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex flex-1 items-center justify-center">
              {(["foryou", "following"] as FeedTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={"relative flex-1 flex justify-center py-4 text-[15px] font-bold transition-colors max-w-[200px] " + (tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}
                >
                  {t === "foryou" ? "For You" : "Following"}
                  {tab === t && (
                    <motion.div layoutId="feed-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-16 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-white/[0.08] transition-colors flex-shrink-0"
            >
              <Search className="h-[19px] w-[19px] text-muted-foreground" />
            </button>
          </div>

          <LiveRoomStrip />

          {/* Composer bar at top of feed */}
          <button
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full border-b border-white/[0.07] hover:bg-white/[0.02] transition-colors"
          >
            <img src={currentUser.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10 flex-shrink-0" />
            <span className="text-[15px] text-muted-foreground/60 flex-1 text-left">What's on your mind?</span>
            <div className="flex items-center gap-2 text-primary">
              <ImageIcon className="h-4 w-4" />
              <Video className="h-4 w-4" />
            </div>
          </button>
        </div>

        {/* Feed */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {tab === "foryou" ? (
              <motion.div key="foryou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {feed.map((item, i) =>
                  item.type === "post" ? (
                    <PostCard key={item.id} post={item.data as Post} index={i} onShare={handleShare} />
                  ) : (
                    <SuggestedCommunityCard key={item.id} community={item.data as SuggestedCommunity} />
                  )
                )}
                <div className="h-28" />
              </motion.div>
            ) : (
              <motion.div key="following" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-28 px-8 text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                  <Users className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-[18px] font-bold text-foreground">Nothing here yet</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[260px]">Join communities to see their posts here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right sidebar */}
      <RightSidebar />

      {/* Floating compose */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 lg:hidden z-40 w-14 h-14 rounded-full bg-primary shadow-[0_0_28px_rgba(124,58,237,0.5)] flex items-center justify-center"
      >
        <PenSquare className="h-6 w-6 text-white" />
      </motion.button>

      <BottomNav />
    </div>
  );
}
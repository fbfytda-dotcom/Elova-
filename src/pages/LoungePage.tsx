import { useState } from "react";
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

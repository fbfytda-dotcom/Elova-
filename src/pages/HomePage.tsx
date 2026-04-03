import { useState } from "react";
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

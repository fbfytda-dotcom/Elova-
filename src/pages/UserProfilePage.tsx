
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mic, Flame, Zap, MessageSquare,
  ChevronUp, Users, Share2, BadgeCheck, Star,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { loungeUsers, samplePosts, lounges } from "@/lib/lounge-data";

interface UserProfilePageProps { onMenuOpen?: () => void; }

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400",
  "Debate":     "bg-orange-500/15 text-orange-400",
  "Teach Me":   "bg-blue-500/15 text-blue-400",
  "Hot Seat":   "bg-purple-500/15 text-purple-400",
};

const RECENT_ROOMS = [
  { id: "r1", name: "Is remote work killing company culture?", community: "Daily Debate", mode: "Debate", duration: "24 min", date: "Today" },
  { id: "r3", name: "Pitch Practice: Sell me this pen",        community: "Business English", mode: "Hot Seat", duration: "31 min", date: "Yesterday" },
];

type UTab = "posts" | "rooms" | "about";

export default function UserProfilePage({ onMenuOpen = () => {} }: UserProfilePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<UTab>("posts");

  const user = loungeUsers.find((u) => u.id === id) ?? loungeUsers[1];
  const isMe = user.id === loungeUsers[0].id;
  const userPosts = samplePosts.filter((p) => p.author.id === user.id);
  const userLounges = lounges.slice(0, 3);

  const LEVEL_LABELS: Record<string, string> = {
    A1: "Beginner", A2: "Elementary", B1: "Intermediate",
    B2: "Upper-Intermediate", C1: "Advanced", C2: "Mastery",
  };

  const tabs: { key: UTab; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "rooms", label: "Rooms" },
    { key: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 h-[53px] flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-[15px] font-bold text-foreground">{user.full_name}</p>
        <button className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Hero */}
      <div className="relative px-4 pt-6 pb-4 border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/6 to-transparent pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2.5px] shadow-[0_0_24px_rgba(124,58,237,0.3)]">
              <img src={user.avatar_url} alt="" className="w-full h-full rounded-[14px] object-cover bg-card" />
            </div>
            {user.is_online && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[20px] font-extrabold text-foreground">{user.full_name}</h2>
              {user.english_level === "C2" && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
            </div>
            <p className="text-[13px] text-muted-foreground mb-2">@{user.username} · {user.is_online ? <span className="text-green-400 font-semibold">Online</span> : "Offline"}</p>
            <LevelBadge level={user.english_level} size="md" />
            {user.bio && <p className="text-[13px] text-foreground/75 mt-2 leading-relaxed">{user.bio}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
          {[
            { icon: <Flame className="h-4 w-4 text-orange-400" />, value: user.streak_count,           label: "Day streak" },
            { icon: <Zap   className="h-4 w-4 text-primary"    />, value: user.xp_points.toLocaleString(), label: "XP" },
            { icon: <Mic   className="h-4 w-4 text-primary"    />, value: RECENT_ROOMS.length,          label: "Rooms" },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-[17px] font-extrabold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {!isMe ? (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFollowing(!following)}
              className={
                "flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all " +
                (following
                  ? "bg-white/[0.07] border border-white/[0.12] text-foreground hover:bg-destructive/15 hover:text-destructive hover:border-destructive/25"
                  : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_16px_rgba(124,58,237,0.3)]")
              }
            >
              {following ? "Following ✓" : "Follow"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-2.5 rounded-xl text-[14px] font-bold bg-white/[0.06] border border-white/[0.1] text-foreground hover:bg-white/[0.1] transition-all flex items-center justify-center gap-1.5"
            >
              <Mic className="h-4 w-4" /> Invite to Room
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/profile")}
            className="w-full py-2.5 rounded-xl text-[14px] font-bold bg-white/[0.06] border border-white/[0.1] text-foreground hover:bg-white/[0.1] transition-all"
          >
            Edit Profile
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.07] flex sticky top-[53px] z-30 bg-background">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={"relative flex-1 py-3.5 text-[13px] font-bold transition-colors " + (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")}
          >
            {t.label}
            {tab === t.key && <motion.div layoutId="user-tab" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {userPosts.length === 0
                ? <div className="py-16 text-center"><p className="text-sm text-muted-foreground">No posts yet</p></div>
                : userPosts.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="px-4 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        {post.loungeName && <span className="text-[11px] text-primary font-semibold">{post.loungeName}</span>}
                        <span className="text-[11px] text-muted-foreground ml-auto">{post.createdAt}</span>
                      </div>
                      {post.title && <p className="text-[16px] font-bold text-foreground mb-1 leading-snug">{post.title}</p>}
                      <p className="text-[14px] text-foreground/80 leading-relaxed line-clamp-3">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <ChevronUp className="h-3.5 w-3.5" />{post.upvotes}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />{post.comments.length}
                        </span>
                      </div>
                    </motion.div>
                  ))
              }
              <div className="h-24" />
            </motion.div>
          )}

          {tab === "rooms" && (
            <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Recent Rooms</p>
              <div className="space-y-2">
                {RECENT_ROOMS.map((room, i) => (
                  <motion.div key={room.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Mic className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground leading-snug">{room.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-primary font-semibold">{room.community}</span>
                        <span className={"text-[11px] font-semibold px-2 py-0.5 rounded-full " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground")}>{room.mode}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-semibold text-foreground">{room.duration}</p>
                      <p className="text-[11px] text-muted-foreground">{room.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="h-24" />
            </motion.div>
          )}

          {tab === "about" && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Language Info</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">English Level</span>
                    <div className="flex items-center gap-2"><LevelBadge level={user.english_level} /><span className="text-[13px] font-semibold text-foreground">{LEVEL_LABELS[user.english_level]}</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">XP Points</span>
                    <span className="text-[13px] font-bold text-foreground">{user.xp_points.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">Current streak</span>
                    <span className="text-[13px] font-bold text-orange-400">{user.streak_count} days 🔥</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Communities</p>
                <div className="space-y-2">
                  {userLounges.map((l) => (
                    <button key={l.id} onClick={() => navigate("/lounge/" + l.id)} className="w-full flex items-center gap-2.5 py-1.5 hover:opacity-80 transition-opacity text-left">
                      <div className={"w-8 h-8 rounded-lg bg-gradient-to-br " + l.gradient + " flex items-center justify-center text-base flex-shrink-0"}>{l.emoji}</div>
                      <span className="text-[13px] font-semibold text-foreground">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-24" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

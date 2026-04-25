import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mic, Flame, Zap, MessageSquare, ChevronUp, Users, PenTool,
  Share2, BadgeCheck, Star, MoreHorizontal, MessageCircle,
  Crown, Clock, MapPin, Globe, BookOpen, Volume2, TrendingUp,
  Heart, Flag, Ban, Check, X, Activity, Calendar, BarChart3,
  ChevronRight, Hash, Radio, Eye, Award, Sparkles
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { loungeUsers, samplePosts, lounges, sampleRooms } from "@/lib/lounge-data";

interface UserProfilePageProps { onMenuOpen?: () => void; }

const currentUser = loungeUsers[0];

const LEVEL_LABELS: Record<string, string> = {
  A1: "Beginner", A2: "Elementary", B1: "Intermediate",
  B2: "Upper-Intermediate", C1: "Advanced", C2: "Mastery",
};

const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

const MODE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Open Floor": { bg: "bg-emerald-500/12", text: "text-emerald-400", border: "border-emerald-500/20" },
  "Debate":     { bg: "bg-orange-500/12",  text: "text-orange-400",  border: "border-orange-500/20"  },
  "Teach Me":   { bg: "bg-sky-500/12",     text: "text-sky-400",     border: "border-sky-500/20"     },
  "Hot Seat":   { bg: "bg-violet-500/12",  text: "text-violet-400",  border: "border-violet-500/20"  },
};

/* Mock user-specific room history */
const USER_ROOM_HISTORY: Record<string, Array<{
  id: string; name: string; community: string; communityId: string;
  mode: string; duration: string; date: string; role: string; participants: number;
}>> = {
  u1: [
    { id: "rh1", name: "Is remote work killing company culture?", community: "Daily Debate", communityId: "l1", mode: "Debate", duration: "24 min", date: "Today", role: "Speaker", participants: 5 },
    { id: "rh2", name: "AI will take every job — agree or disagree?", community: "Daily Debate", communityId: "l1", mode: "Open Floor", duration: "31 min", date: "Yesterday", role: "Host", participants: 4 },
    { id: "rh3", name: "Champions League semi-final breakdown", community: "Football Talk", communityId: "l4", mode: "Open Floor", duration: "42 min", date: "Apr 10", role: "Speaker", participants: 8 },
    { id: "rh4", name: "Claude vs GPT — which actually wins?", community: "Tech and AI", communityId: "l5", mode: "Debate", duration: "28 min", date: "Apr 9", role: "Moderator", participants: 6 },
  ],
  u2: [
    { id: "rh5", name: "Football vocabulary for beginners", community: "Football Talk", communityId: "l4", mode: "Teach Me", duration: "18 min", date: "Today", role: "Host", participants: 3 },
    { id: "rh6", name: "Best vocabulary for describing a goal", community: "Football Talk", communityId: "l4", mode: "Open Floor", duration: "35 min", date: "Yesterday", role: "Speaker", participants: 7 },
  ],
  u3: [
    { id: "rh7", name: "Simple English: Tell me about your week", community: "Beginner Corner", communityId: "l3", mode: "Open Floor", duration: "15 min", date: "Today", role: "Speaker", participants: 4 },
  ],
  u4: [
    { id: "rh8", name: "Pitch Practice: Sell me this pen", community: "Business English", communityId: "l2", mode: "Hot Seat", duration: "31 min", date: "Yesterday", role: "Host", participants: 3 },
    { id: "rh9", name: "Phrases that make you sound professional", community: "Business English", communityId: "l2", mode: "Teach Me", duration: "22 min", date: "Apr 11", role: "Speaker", participants: 5 },
  ],
  u5: [
    { id: "rh10", name: "Grammar rules are made to be broken", community: "Daily Debate", communityId: "l1", mode: "Debate", duration: "45 min", date: "Today", role: "Host", participants: 6 },
    { id: "rh11", name: "Ask a native speaker anything", community: "Beginner Corner", communityId: "l3", mode: "Hot Seat", duration: "20 min", date: "Yesterday", role: "Host", participants: 4 },
    { id: "rh12", name: "IELTS Speaking Part 2 practice", community: "Business English", communityId: "l2", mode: "Teach Me", duration: "25 min", date: "Apr 10", role: "Speaker", participants: 3 },
  ],
};

const ROLE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Host:      { bg: "bg-primary/12", text: "text-primary", border: "border-primary/25", label: "Host" },
  Speaker:   { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", label: "Speaker" },
  Moderator: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Moderator" },
  Listener:  { bg: "bg-white/5", text: "text-muted-foreground", border: "border-white/10", label: "Listener" },
};

/* Mock activity data for heatmap */
const ACTIVITY_WEEKS = 12;
const ACTIVITY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type UTab = "posts" | "rooms" | "activity" | "about";

/* ═══════════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function StatCard({ icon, value, label, delay = 0, color = "text-primary" }: { icon: React.ReactNode; value: string | number; label: string; delay?: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-3 text-center hover:border-white/[0.14] transition-all"
    >
      <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
      <p className="text-[18px] font-extrabold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-[15px] font-bold text-foreground mb-1">{title}</p>
      <p className="text-[13px] text-muted-foreground max-w-[220px]">{subtitle}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */

function UserHero({ user, isMe, following, onFollowToggle }: {
  user: typeof loungeUsers[0]; isMe: boolean; following: boolean; onFollowToggle: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="relative px-4 pt-8 pb-5 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -right-16 w-56 h-56 bg-primary/15 rounded-full blur-[70px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/10 rounded-full blur-[50px]"
        />
      </div>

      <div className="relative">
        {/* Avatar + Info */}
        <div className="flex items-start gap-4 mb-5">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex-shrink-0"
          >
            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-[2.5px] shadow-[0_0_28px_rgba(124,58,237,0.35)]">
              <img src={user.avatar_url} alt="" className="w-full h-full rounded-[13px] object-cover bg-card" />
            </div>
            {user.is_online && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[2.5px] border-background"
              />
            )}
          </motion.div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-[22px] font-extrabold text-foreground tracking-tight">{user.full_name}</h2>
              {user.english_level === "C2" && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
            </div>
            <p className="text-[13px] text-muted-foreground mb-2">
              @{user.username} · {user.is_online ? <span className="text-green-400 font-semibold">Online now</span> : <span className="text-muted-foreground">Offline</span>}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <LevelBadge level={user.english_level} size="md" />
              <span className="text-[12px] text-muted-foreground">{LEVEL_LABELS[user.english_level]}</span>
              <span className="text-[11px] text-muted-foreground/50">·</span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Global
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[13px] text-foreground/70 leading-relaxed mb-5"
          >
            {user.bio}
          </motion.p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          <StatCard icon={<Flame className="h-4 w-4 text-orange-400" />} value={user.streak_count} label="Streak" delay={0.1} color="text-orange-400" />
          <StatCard icon={<Zap className="h-4 w-4 text-primary" />} value={user.xp_points.toLocaleString()} label="XP" delay={0.18} color="text-primary" />
          <StatCard icon={<Mic className="h-4 w-4 text-primary" />} value={(USER_ROOM_HISTORY[user.id] || []).length} label="Rooms" delay={0.26} color="text-primary" />
          <StatCard icon={<Users className="h-4 w-4 text-sky-400" />} value={user.id === "u5" ? 234 : user.id === "u1" ? 89 : Math.floor(Math.random() * 150 + 20)} label="Followers" delay={0.34} color="text-sky-400" />
        </div>

        {/* Actions */}
        {!isMe ? (
          <div className="flex gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onFollowToggle}
              className={
                "flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-1.5 " +
                (following
                  ? "bg-white/[0.07] border border-white/[0.12] text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  : "bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_28px_rgba(124,58,237,0.45)]")
              }
            >
              {following ? <><Check className="h-4 w-4" /> Following</> : "Follow"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 rounded-xl text-[14px] font-bold bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="h-4 w-4" /> Message
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.08] transition-all flex items-center justify-center"
              onClick={() => navigate("/room/l1")}
            >
              <Mic className="h-4 w-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/profile")}
            className="w-full py-2.5 rounded-xl text-[14px] font-bold bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.08] transition-all"
          >
            Edit Profile
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MUTUAL COMMUNITIES
   ═══════════════════════════════════════════════════════════════════ */

function MutualCommunities({ userLounges, userId }: { userLounges: typeof lounges; userId: string }) {
  const navigate = useNavigate();
  const mutual = lounges.filter((l) => userLounges.some((ul) => ul.id === l.id));

  if (mutual.length === 0) return null;

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-[13px] font-bold text-foreground">Mutual Communities</p>
        </div>
        <span className="text-[11px] text-muted-foreground">{mutual.length} shared</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {mutual.map((lounge, i) => (
          <motion.button
            key={lounge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/lounge/" + lounge.id)}
            className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.06] transition-all"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-base shadow-md`}>
              {lounge.emoji}
            </div>
            <div className="text-left">
              <p className="text-[12px] font-semibold text-foreground">{lounge.name}</p>
              <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                <Check className="h-2.5 w-2.5" /> Both joined
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   POSTS TAB
   ═══════════════════════════════════════════════════════════════════ */

function PostsTab({ userPosts }: { userPosts: typeof samplePosts }) {
  const navigate = useNavigate();

  if (userPosts.length === 0) {
    return (
      <EmptyState
        icon={<PenTool className="h-6 w-6 text-muted-foreground/40" />}
        title="No posts yet"
        subtitle="This user has not shared any posts in the community"
      />
    );
  }

  return (
    <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-2 space-y-3">
      {userPosts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-2 mb-2">
            {post.loungeName && (
              <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                <Hash className="h-3 w-3" /> {post.loungeName}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground ml-auto">{post.createdAt}</span>
          </div>
          {post.title && <p className="text-[15px] font-bold text-foreground mb-1.5 leading-snug group-hover:text-primary/90 transition-colors">{post.title}</p>}
          <p className="text-[13px] text-foreground/70 leading-relaxed line-clamp-3">{post.content}</p>
          {post.mediaUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/[0.08]">
              <img src={post.mediaUrl} alt="" className="w-full h-40 object-cover" />
            </div>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
              <ChevronUp className="h-3.5 w-3.5" /> {post.upvotes}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> {post.comments.length}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground ml-auto">
              <Eye className="h-3.5 w-3.5" /> {Math.floor(post.upvotes * 3.5)}
            </span>
          </div>
        </motion.div>
      ))}
      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOMS TAB — TIMELINE
   ═══════════════════════════════════════════════════════════════════ */

function RoomsTab({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const rooms = USER_ROOM_HISTORY[userId] || [];

  if (rooms.length === 0) {
    return (
      <EmptyState
        icon={<Mic className="h-6 w-6 text-muted-foreground/40" />}
        title="No rooms yet"
        subtitle="This user has not joined any voice rooms yet"
      />
    );
  }

  return (
    <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-2">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="h-4 w-4 text-primary" />
        <p className="text-[14px] font-bold text-foreground">Speaking History</p>
        <span className="text-[11px] text-muted-foreground ml-auto">{rooms.length} sessions</span>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-8 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent" />
        <div className="space-y-4">
          {rooms.map((room, i) => {
            const modeStyle = MODE_COLORS[room.mode] || MODE_COLORS["Open Floor"];
            const roleStyle = ROLE_STYLES[room.role] || ROLE_STYLES["Listener"];
            const lounge = lounges.find((l) => l.id === room.communityId);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative flex items-start gap-3 pl-1"
              >
                <div className="relative flex-shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-xl ${modeStyle.bg} border ${modeStyle.border} flex items-center justify-center z-10 relative`}>
                    <Mic className={`h-4 w-4 ${modeStyle.text}`} />
                  </div>
                  {i === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-xl ${modeStyle.bg}`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-all cursor-pointer"
                  onClick={() => navigate("/lounge/" + room.communityId)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-[14px] font-bold text-foreground leading-snug">{room.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                      {roleStyle.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {lounge && (
                      <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                        <div className={`w-3.5 h-3.5 rounded-sm bg-gradient-to-br ${lounge.gradient} flex items-center justify-center text-[8px]`}>
                          {lounge.emoji}
                        </div>
                        {room.community}
                      </span>
                    )}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
                      {room.mode}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-[11px] flex items-center gap-1"><Clock className="h-3 w-3" /> {room.duration}</span>
                    <span className="text-[11px] flex items-center gap-1"><Users className="h-3 w-3" /> {room.participants}</span>
                    <span className="text-[11px] ml-auto">{room.date}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-primary/8 to-accent/5 border border-primary/15 text-center"
      >
        <p className="text-[13px] text-foreground/80">
          Total: <span className="font-bold text-foreground">{rooms.reduce((a, r) => a + parseInt(r.duration), 0)} min</span> spoken across <span className="font-bold text-foreground">{rooms.length} rooms</span>
        </p>
      </motion.div>
      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ACTIVITY TAB — HEATMAP
   ═══════════════════════════════════════════════════════════════════ */

function ActivityTab({ userId }: { userId: string }) {
  const heatmapData = useMemo(() => {
    const data: number[][] = [];
    for (let w = 0; w < ACTIVITY_WEEKS; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const seed = (userId.charCodeAt(1) + w * 7 + d) % 10;
        week.push(seed > 3 ? Math.min(seed, 5) : 0);
      }
      data.push(week);
    }
    return data;
  }, [userId]);

  const intensityColors = [
    "bg-white/[0.04]",
    "bg-primary/20",
    "bg-primary/35",
    "bg-primary/50",
    "bg-primary/65",
    "bg-primary/80",
  ];

  const totalActive = heatmapData.flat().filter((v) => v > 0).length;
  const maxStreak = 5;

  return (
    <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-2 space-y-6">

      {/* Weekly summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Calendar className="h-4 w-4 text-primary" />, value: totalActive, label: "Active days" },
          { icon: <Flame className="h-4 w-4 text-orange-400" />, value: maxStreak, label: "Best streak" },
          { icon: <BarChart3 className="h-4 w-4 text-accent" />, value: "B1", label: "Avg level" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center"
          >
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-[20px] font-extrabold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Speaking Activity
          </p>
          <span className="text-[11px] text-muted-foreground">Last 12 weeks</span>
        </div>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 pt-6">
            {ACTIVITY_DAYS.map((d) => (
              <span key={d} className="text-[9px] text-muted-foreground/60 h-3 flex items-center">{d.slice(0, 1)}</span>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <motion.div
                    key={di}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: wi * 0.02 + di * 0.01 }}
                    className={`w-3 h-3 rounded-sm ${intensityColors[day]} ${day > 0 ? "shadow-[0_0_4px_rgba(124,58,237,0.2)]" : ""}`}
                    title={`${day} sessions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] text-muted-foreground/60">Less</span>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${intensityColors[i]}`} />
          ))}
          <span className="text-[9px] text-muted-foreground/60">More</span>
        </div>
      </div>

      {/* Recent interactions */}
      <div>
        <p className="text-[13px] font-bold text-foreground mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Recent Interactions
        </p>
        <div className="space-y-2">
          {[
            { action: "Joined room", detail: "Daily Debate · Debate", time: "2h ago", icon: <Mic className="h-3.5 w-3.5 text-primary" /> },
            { action: "Upvoted post", detail: "Grammar mistakes do not matter...", time: "5h ago", icon: <ChevronUp className="h-3.5 w-3.5 text-green-400" /> },
            { action: "Commented", detail: "Business English forum", time: "1d ago", icon: <MessageSquare className="h-3.5 w-3.5 text-sky-400" /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground">{item.action}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
              </div>
              <span className="text-[11px] text-muted-foreground flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ABOUT TAB
   ═══════════════════════════════════════════════════════════════════ */

function AboutTab({ user, isMe }: { user: typeof loungeUsers[0]; isMe: boolean }) {
  const navigate = useNavigate();
  const userLounges = lounges.slice(0, 4);
  const levelIndex = LEVEL_ORDER.indexOf(user.english_level);
  const levelProgress = ((levelIndex + 1) / LEVEL_ORDER.length) * 100;

  return (
    <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-2 space-y-5">

      {/* Language Info */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-primary" />
          <p className="text-[13px] font-bold text-foreground">Language Profile</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-muted-foreground">English Level</span>
              <div className="flex items-center gap-2">
                <LevelBadge level={user.english_level} />
                <span className="text-[13px] font-semibold text-foreground">{LEVEL_LABELS[user.english_level]}</span>
              </div>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: levelProgress + "%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {LEVEL_ORDER.length - levelIndex - 1} level{LEVEL_ORDER.length - levelIndex - 1 !== 1 ? "s" : ""} to C2 Mastery
            </p>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
            <span className="text-[13px] text-muted-foreground">XP Points</span>
            <span className="text-[13px] font-bold text-foreground">{user.xp_points.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
            <span className="text-[13px] text-muted-foreground">Current streak</span>
            <span className="text-[13px] font-bold text-orange-400 flex items-center gap-1">
              {user.streak_count} days <Flame className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
            <span className="text-[13px] text-muted-foreground">Member since</span>
            <span className="text-[13px] font-semibold text-foreground">March 2024</span>
          </div>
        </div>
      </div>

      {/* Communities */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-[13px] font-bold text-foreground">Communities</p>
          </div>
          <span className="text-[11px] text-muted-foreground">{userLounges.length} joined</span>
        </div>
        <div className="space-y-2.5">
          {userLounges.map((l) => {
            const isMutual = !isMe && lounges.some((cl) => cl.id === l.id);
            return (
              <motion.button
                key={l.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/lounge/" + l.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                  {l.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{l.name}</p>
                  <p className="text-[11px] text-muted-foreground">{l.memberCount.toLocaleString()} members</p>
                </div>
                {isMutual && (
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                    <Check className="h-2.5 w-2.5" /> Mutual
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Speaking Stats Comparison */}
      {!isMe && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/8 to-transparent border border-primary/15">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <p className="text-[13px] font-bold text-foreground">Speaking Comparison</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "XP Points", you: currentUser.xp_points, them: user.xp_points, max: Math.max(currentUser.xp_points, user.xp_points, 10000) },
              { label: "Streak", you: currentUser.streak_count, them: user.streak_count, max: Math.max(currentUser.streak_count, user.streak_count, 50) },
              { label: "Rooms Joined", you: (USER_ROOM_HISTORY[currentUser.id] || []).length, them: (USER_ROOM_HISTORY[user.id] || []).length, max: Math.max((USER_ROOM_HISTORY[currentUser.id] || []).length, (USER_ROOM_HISTORY[user.id] || []).length, 10) },
            ].map((stat, i) => {
              const youPct = (stat.you / stat.max) * 100;
              const themPct = (stat.them / stat.max) * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-primary">You: {stat.you}</span>
                      <span className="text-[11px] font-bold text-accent">Them: {stat.them}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: themPct + "%" }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      className="absolute h-full rounded-full bg-accent/40"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: youPct + "%" }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className="absolute h-full rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="h-24" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN USER PROFILE PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function UserProfilePage({ onMenuOpen = () => {} }: UserProfilePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<UTab>("posts");
  const [showMenu, setShowMenu] = useState(false);

  const user = loungeUsers.find((u) => u.id === id) ?? loungeUsers[1];
  const isMe = user.id === currentUser.id;
  const userPosts = samplePosts.filter((p) => p.author.id === user.id);
  const userLounges = lounges.slice(0, 4);

  const tabs: { key: UTab; label: string; icon: React.ReactNode }[] = [
    { key: "posts",    label: "Posts",    icon: <PenTool className="h-3.5 w-3.5" />    },
    { key: "rooms",    label: "Rooms",    icon: <Mic className="h-3.5 w-3.5" />        },
    { key: "activity", label: "Activity", icon: <Activity className="h-3.5 w-3.5" />    },
    { key: "about",    label: "About",    icon: <Globe className="h-3.5 w-3.5" />      },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07] px-4 h-[53px] flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-[15px] font-bold text-foreground">{user.full_name}</p>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-card border border-white/[0.1] rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <button className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-foreground hover:bg-white/[0.05] transition-colors">
                    <Share2 className="h-4 w-4 text-muted-foreground" /> Share Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-foreground hover:bg-white/[0.05] transition-colors">
                    <Flag className="h-4 w-4 text-muted-foreground" /> Report User
                  </button>
                  <div className="h-px bg-white/[0.06]" />
                  <button className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-destructive hover:bg-destructive/10 transition-colors">
                    <Ban className="h-4 w-4" /> Block User
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hero */}
      <UserHero user={user} isMe={isMe} following={following} onFollowToggle={() => setFollowing(!following)} />

      {/* Mutual Communities */}
      {!isMe && <MutualCommunities userLounges={userLounges} userId={user.id} />}

      {/* Tabs */}
      <div className="border-b border-white/[0.07] flex flex-shrink-0 sticky top-[53px] z-30 bg-background/95 backdrop-blur-md px-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "relative flex-1 py-3.5 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-colors " +
              (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70")
            }
          >
            {t.icon}
            {t.label}
            {tab === t.key && (
              <motion.div
                layoutId="user-profile-tab"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-gradient-to-r from-primary to-accent rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tab === "posts" && <PostsTab userPosts={userPosts} />}
          {tab === "rooms" && <RoomsTab userId={user.id} />}
          {tab === "activity" && <ActivityTab userId={user.id} />}
          {tab === "about" && <AboutTab user={user} isMe={isMe} />}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
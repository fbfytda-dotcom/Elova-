import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Heart, MessageSquare, Users, Mic, Trophy,
  Zap, ChevronRight, Check, CheckCheck, Settings, Filter,
  Clock, Star, Flame, Sparkles, TrendingUp, Crown, Volume2,
  BookOpen, Hash, Eye, Calendar, X, Trash2, Pin, Radio,
  Award, Share2, UserPlus, MessageCircle, BarChart3, BrainCircuit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { loungeUsers } from "@/lib/lounge-data";

interface NotificationsPageProps { onMenuOpen?: () => void; }

type NotifType = "like" | "reply" | "follow" | "room_invite" | "achievement" | "weekly_report" | "joined_room" | "mention" | "badge_unlock" | "streak_milestone";
type NotifFilter = "all" | "unread" | "likes" | "replies" | "rooms" | "social" | "achievements";

interface Notification {
  id: string;
  type: NotifType;
  read: boolean;
  pinned?: boolean;
  time: string;
  group: "today" | "yesterday" | "earlier";
  actor?: typeof loungeUsers[0];
  text: string;
  sub?: string;
  meta?: { label: string; value: string };
  action?: { label: string; path: string };
}

const MOCK_NOTIFICATIONS: Notification[] = [
  // ── TODAY ──
  { id: "n0",  type: "streak_milestone", read: false, pinned: true,  time: "Just now",    group: "today", text: "🔥 14-day streak! You are on fire!", sub: "Keep it going — 16 more days to the 30-day badge", meta: { label: "Streak", value: "14 days" } },
  { id: "n1",  type: "weekly_report",    read: false, pinned: false, time: "2m ago",      group: "today", text: "Your weekly AI report is ready", sub: "Fluency +5 · Vocabulary +7 · Confidence +3", action: { label: "View Report", path: "/profile" }, meta: { label: "Score", value: "78/100" } },
  { id: "n2",  type: "room_invite",      read: false, pinned: false, time: "8m ago",      group: "today", text: "invited you to a Debate room", sub: "Is social media making us worse communicators?", actor: loungeUsers[0], action: { label: "Join Now", path: "/room/r1" }, meta: { label: "Mode", value: "Debate" } },
  { id: "n3",  type: "like",             read: false, pinned: false, time: "15m ago",     group: "today", text: "liked your post", sub: "Grammar mistakes do not matter when speaking — unpopular opinion", actor: loungeUsers[1], meta: { label: "Upvotes", value: "+1" } },
  { id: "n4",  type: "reply",            read: false, pinned: false, time: "22m ago",     group: "today", text: "replied to your post", sub: "This is solid advice actually. Confidence over grammar is the real unlock.", actor: loungeUsers[4], meta: { label: "Replies", value: "+1" } },
  { id: "n5",  type: "mention",          read: false, pinned: false, time: "34m ago",     group: "today", text: "mentioned you in a comment", sub: "@alex_speaks what do you think about this take?", actor: loungeUsers[2], meta: { label: "In", value: "Daily Debate" } },
  { id: "n6",  type: "follow",           read: false, pinned: false, time: "1h ago",      group: "today", text: "started following you", sub: "B2 · Football Talk · Beginner Corner", actor: loungeUsers[3], meta: { label: "Followers", value: "+1" } },
  { id: "n7",  type: "joined_room",      read: false, pinned: false, time: "1h ago",      group: "today", text: "joined your room", sub: "Is remote work killing company culture?", actor: loungeUsers[1], meta: { label: "Participants", value: "5" } },
  { id: "n8",  type: "badge_unlock",     read: false, pinned: false, time: "2h ago",      group: "today", text: "You earned a new badge!", sub: "🏆 Debate Champion — Won 5 debates", action: { label: "See Badge", path: "/profile" }, meta: { label: "XP", value: "+250" } },

  // ── YESTERDAY ──
  { id: "n9",  type: "like",             read: true,  pinned: false, time: "Yesterday",   group: "yesterday", text: "liked your post", sub: "Phrases that instantly make you sound more professional...", actor: loungeUsers[2], meta: { label: "Upvotes", value: "+1" } },
  { id: "n10", type: "reply",            read: true,  pinned: false, time: "Yesterday",   group: "yesterday", text: "replied to your post", sub: "The plateau phase is brutal but real. Push through it and you will break through.", actor: loungeUsers[3], meta: { label: "Replies", value: "+1" } },
  { id: "n11", type: "room_invite",      read: true,  pinned: false, time: "Yesterday",   group: "yesterday", text: "invited you to an Open Floor room", sub: "Champions League semi-final breakdown", actor: loungeUsers[2], action: { label: "View Room", path: "/room/r5" }, meta: { label: "Mode", value: "Open Floor" } },
  { id: "n12", type: "follow",           read: true,  pinned: false, time: "Yesterday",   group: "yesterday", text: "started following you", sub: "C2 · Daily Debate · Tech and AI", actor: loungeUsers[4], meta: { label: "Followers", value: "+1" } },
  { id: "n13", type: "achievement",      read: true,  pinned: false, time: "Yesterday",   group: "yesterday", text: "Weekly challenge completed!", sub: "You spoke for 87 minutes this week — top 10% of all speakers", action: { label: "View Stats", path: "/profile" }, meta: { label: "Rank", value: "Top 10%" } },

  // ── EARLIER ──
  { id: "n14", type: "weekly_report",    read: true,  pinned: false, time: "2 days ago",  group: "earlier", text: "Your weekly AI report is ready", sub: "Fluency +3 · Grammar +2 · Pronunciation +1", action: { label: "View Report", path: "/profile" }, meta: { label: "Score", value: "73/100" } },
  { id: "n15", type: "like",             read: true,  pinned: false, time: "3 days ago",  group: "earlier", text: "liked your post", sub: "Using AI to practice English: 6 months in, honest review", actor: loungeUsers[0], meta: { label: "Upvotes", value: "+1" } },
  { id: "n16", type: "joined_room",      read: true,  pinned: false, time: "4 days ago",  group: "earlier", text: "joined your room", sub: "Pitch Practice: Sell me this pen", actor: loungeUsers[3], meta: { label: "Participants", value: "3" } },
  { id: "n17", type: "follow",           read: true,  pinned: false, time: "5 days ago",  group: "earlier", text: "started following you", sub: "A2 · Beginner Corner", actor: loungeUsers[2], meta: { label: "Followers", value: "+1" } },
  { id: "n18", type: "reply",            read: true,  pinned: false, time: "1 week ago",  group: "earlier", text: "replied to your post", sub: "I tried shadowing with BBC podcasts and it actually works!", actor: loungeUsers[1], meta: { label: "Replies", value: "+1" } },
  { id: "n19", type: "streak_milestone", read: true,  pinned: false, time: "1 week ago",  group: "earlier", text: "🔥 7-day streak reached!", sub: "You are building a solid habit. Keep showing up.", meta: { label: "Streak", value: "7 days" } },
];

/* ═══════════════════════════════════════════════════════════════════
   NOTIFICATION TYPE STYLES
   ═══════════════════════════════════════════════════════════════════ */

const NOTIF_STYLES: Record<NotifType, {
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
  glow: string;
  label: string;
}> = {
  like:           { icon: <Heart        className="h-4 w-4" />, bg: "bg-pink-500/15",    border: "border-pink-500/25",    text: "text-pink-400",    glow: "shadow-[0_0_12px_rgba(236,72,153,0.2)]",    label: "Like"           },
  reply:          { icon: <MessageSquare className="h-4 w-4" />, bg: "bg-sky-500/15",     border: "border-sky-500/25",     text: "text-sky-400",     glow: "shadow-[0_0_12px_rgba(14,165,233,0.2)]",      label: "Reply"          },
  follow:         { icon: <UserPlus     className="h-4 w-4" />, bg: "bg-green-500/15",   border: "border-green-500/25",   text: "text-green-400",   glow: "shadow-[0_0_12px_rgba(34,197,94,0.2)]",       label: "Follow"         },
  room_invite:    { icon: <Mic          className="h-4 w-4" />, bg: "bg-primary/15",     border: "border-primary/25",     text: "text-primary",     glow: "shadow-[0_0_12px_rgba(124,58,237,0.25)]",     label: "Room Invite"    },
  achievement:    { icon: <Trophy       className="h-4 w-4" />, bg: "bg-amber-500/15",   border: "border-amber-500/25",   text: "text-amber-400",   glow: "shadow-[0_0_12px_rgba(245,158,11,0.2)]",      label: "Achievement"    },
  weekly_report:  { icon: <BarChart3    className="h-4 w-4" />, bg: "bg-primary/15",     border: "border-primary/25",     text: "text-primary",     glow: "shadow-[0_0_12px_rgba(124,58,237,0.25)]",     label: "AI Report"      },
  joined_room:    { icon: <Volume2      className="h-4 w-4" />, bg: "bg-emerald-500/15", border: "border-emerald-500/25", text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(16,185,129,0.2)]",      label: "Joined Room"    },
  mention:        { icon: <Hash         className="h-4 w-4" />, bg: "bg-orange-500/15",  border: "border-orange-500/25",  text: "text-orange-400",  glow: "shadow-[0_0_12px_rgba(249,115,22,0.2)]",      label: "Mention"        },
  badge_unlock:   { icon: <Award        className="h-4 w-4" />, bg: "bg-violet-500/15",  border: "border-violet-500/25",  text: "text-violet-400",  glow: "shadow-[0_0_12px_rgba(139,92,246,0.2)]",      label: "Badge"          },
  streak_milestone:{ icon: <Flame       className="h-4 w-4" />, bg: "bg-orange-500/15",  border: "border-orange-500/25",  text: "text-orange-400",  glow: "shadow-[0_0_12px_rgba(249,115,22,0.2)]",      label: "Streak"         },
};

const FILTER_CONFIG: { key: NotifFilter; label: string; icon: React.ReactNode }[] = [
  { key: "all",          label: "All",          icon: <Bell        className="h-3 w-3" /> },
  { key: "unread",       label: "Unread",       icon: <Eye         className="h-3 w-3" /> },
  { key: "likes",        label: "Likes",        icon: <Heart       className="h-3 w-3" /> },
  { key: "replies",      label: "Replies",      icon: <MessageSquare className="h-3 w-3" /> },
  { key: "rooms",        label: "Rooms",        icon: <Mic         className="h-3 w-3" /> },
  { key: "social",       label: "Social",       icon: <Users       className="h-3 w-3" /> },
  { key: "achievements", label: "Achievements", icon: <Trophy      className="h-3 w-3" /> },
];

/* ═══════════════════════════════════════════════════════════════════
   NOTIFICATION CARD
   ═══════════════════════════════════════════════════════════════════ */

function NotificationCard({ notif, index, onRead }: { notif: Notification; index: number; onRead: (id: string) => void }) {
  const navigate = useNavigate();
  const style = NOTIF_STYLES[notif.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      onClick={() => {
        onRead(notif.id);
        if (notif.actor) navigate("/user/" + notif.actor.id);
      }}
      className={
        "relative flex items-start gap-3.5 px-4 py-4 cursor-pointer transition-all duration-200 group " +
        (!notif.read
          ? "bg-gradient-to-r from-primary/[0.04] to-transparent border-l-[3px] border-primary"
          : "border-l-[3px] border-transparent hover:bg-white/[0.02]")
      }
    >
      {/* Unread glow */}
      {!notif.read && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary"
        />
      )}

      {/* Avatar or Icon */}
      <div className="relative flex-shrink-0 mt-0.5">
        {notif.actor ? (
          <div className="relative">
            <img src={notif.actor.avatar_url} alt="" className="w-11 h-11 rounded-2xl border border-white/10 object-cover" />
            <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg border-2 border-background flex items-center justify-center ${style.bg} ${style.border}`}>
              <span className={style.text}>{style.icon}</span>
            </div>
          </div>
        ) : (
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${style.bg} ${style.border} ${style.glow}`}>
            <span className={style.text}>{style.icon}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] leading-snug">
              {notif.actor && (
                <span className="font-bold text-foreground">{notif.actor.full_name} </span>
              )}
              <span className={notif.read ? "text-foreground/70" : "text-foreground"}>{notif.text}</span>
            </p>
            {notif.sub && (
              <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{notif.sub}</p>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground/60 flex-shrink-0 mt-0.5">{notif.time}</span>
        </div>

        {/* Meta + Action */}
        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          {notif.meta && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text} ${style.border} border`}>
              {notif.meta.label}: {notif.meta.value}
            </span>
          )}
          {notif.pinned && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Pin className="h-2.5 w-2.5" /> Pinned
            </span>
          )}
          {notif.action && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onRead(notif.id); navigate(notif.action!.path); }}
              className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5"
            >
              {notif.action.label} <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════ */

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="sticky top-[108px] z-20 bg-background/95 backdrop-blur-md px-4 py-2 border-b border-white/[0.05]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold">{label}</p>
        {count !== undefined && (
          <span className="text-[11px] text-muted-foreground font-medium">{count} notification{count !== 1 ? "s" : ""}</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════ */

function EmptyState({ filter }: { filter: NotifFilter }) {
  const messages: Record<NotifFilter, { title: string; subtitle: string }> = {
    all:          { title: "You are all caught up",      subtitle: "No notifications to show right now" },
    unread:       { title: "No unread notifications",    subtitle: "You have read everything — nice work" },
    likes:        { title: "No likes yet",               subtitle: "Your posts will get love soon" },
    replies:      { title: "No replies yet",             subtitle: "Start a conversation and get responses" },
    rooms:        { title: "No room activity",           subtitle: "Join or host a room to see invites" },
    social:       { title: "No social updates",          subtitle: "Follow more speakers to grow your network" },
    achievements: { title: "No achievements yet",        subtitle: "Keep speaking to unlock badges and reports" },
  };

  const msg = messages[filter];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/5 border border-primary/20 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(124,58,237,0.1)]"
      >
        <Bell className="h-8 w-8 text-primary/50" />
      </motion.div>
      <p className="text-[18px] font-extrabold text-foreground mb-1.5">{msg.title}</p>
      <p className="text-[14px] text-muted-foreground max-w-[260px] leading-relaxed">{msg.subtitle}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN NOTIFICATIONS PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function NotificationsPage({ onMenuOpen = () => {} }: NotificationsPageProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filtered = useMemo(() => {
    let result = notifications;
    if (filter === "unread") result = result.filter((n) => !n.read);
    if (filter === "likes") result = result.filter((n) => n.type === "like");
    if (filter === "replies") result = result.filter((n) => n.type === "reply" || n.type === "mention");
    if (filter === "rooms") result = result.filter((n) => n.type === "room_invite" || n.type === "joined_room");
    if (filter === "social") result = result.filter((n) => n.type === "follow");
    if (filter === "achievements") result = result.filter((n) => n.type === "achievement" || n.type === "badge_unlock" || n.type === "streak_milestone" || n.type === "weekly_report");
    return result;
  }, [notifications, filter]);

  const today = filtered.filter((n) => n.group === "today");
  const yesterday = filtered.filter((n) => n.group === "yesterday");
  const earlier = filtered.filter((n) => n.group === "earlier");

  const hasContent = today.length > 0 || yesterday.length > 0 || earlier.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="flex items-center justify-between px-4 h-[53px]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[17px] font-extrabold text-foreground">Activity</h1>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-primary text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </motion.button>
            )}
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTER_CONFIG.map((f) => {
            const active = filter === f.key;
            const count = f.key === "unread" ? unreadCount : undefined;
            return (
              <motion.button
                key={f.key}
                whileTap={{ scale: 0.93 }}
                onClick={() => setFilter(f.key)}
                className={
                  "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all " +
                  (active
                    ? "bg-primary text-white border-primary shadow-[0_0_16px_rgba(124,58,237,0.3)]"
                    : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-white/20 hover:text-foreground")
                }
              >
                {f.icon}
                {f.label}
                {count !== undefined && count > 0 && (
                  <span className="bg-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTENT
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1">
        {!hasContent ? (
          <EmptyState filter={filter} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Pinned notifications */}
              {filter === "all" && notifications.some((n) => n.pinned) && (
                <div className="mb-1">
                  <SectionHeader label="Pinned" />
                  {notifications.filter((n) => n.pinned).map((notif, i) => (
                    <NotificationCard key={notif.id} notif={notif} index={i} onRead={markRead} />
                  ))}
                </div>
              )}

              {/* Today */}
              {today.length > 0 && (
                <div className="mb-1">
                  <SectionHeader label="Today" count={today.length} />
                  {today.map((notif, i) => (
                    <NotificationCard key={notif.id} notif={notif} index={i} onRead={markRead} />
                  ))}
                </div>
              )}

              {/* Yesterday */}
              {yesterday.length > 0 && (
                <div className="mb-1">
                  <SectionHeader label="Yesterday" count={yesterday.length} />
                  {yesterday.map((notif, i) => (
                    <NotificationCard key={notif.id} notif={notif} index={i} onRead={markRead} />
                  ))}
                </div>
              )}

              {/* Earlier */}
              {earlier.length > 0 && (
                <div className="mb-1">
                  <SectionHeader label="Earlier" count={earlier.length} />
                  {earlier.map((notif, i) => (
                    <NotificationCard key={notif.id} notif={notif} index={i} onRead={markRead} />
                  ))}
                </div>
              )}

              <div className="h-24" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-white/[0.1] rounded-t-3xl max-h-[70vh] overflow-y-auto"
            >
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-[17px] font-extrabold text-foreground">Notification Settings</p>
                  <button onClick={() => setShowSettings(false)} className="p-2 rounded-full hover:bg-white/8 transition-colors">
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                {[
                  { label: "Room Invites",        desc: "When someone invites you to a voice room",       enabled: true  },
                  { label: "Likes & Replies",     desc: "When someone interacts with your posts",        enabled: true  },
                  { label: "New Followers",       desc: "When someone starts following you",             enabled: true  },
                  { label: "Weekly AI Reports",   desc: "Your personalized speaking assessment",         enabled: true  },
                  { label: "Streak Reminders",    desc: "Daily reminders to keep your streak alive",     enabled: false },
                  { label: "Community Updates",   desc: "New rooms and announcements in your lounges",   enabled: true  },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{setting.label}</p>
                      <p className="text-[12px] text-muted-foreground">{setting.desc}</p>
                    </div>
                    <button className={`w-11 h-6 rounded-full transition-colors relative ${setting.enabled ? "bg-primary" : "bg-white/10"}`}>
                      <motion.div
                        animate={{ x: setting.enabled ? 20 : 2 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
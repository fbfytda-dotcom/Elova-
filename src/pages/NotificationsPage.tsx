
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Heart, MessageSquare, Users,
  Mic, Trophy, Zap, ChevronRight, Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { loungeUsers } from "@/lib/lounge-data";

interface NotificationsPageProps { onMenuOpen?: () => void; }

type NotifType = "like" | "reply" | "follow" | "room_invite" | "achievement" | "weekly_report" | "joined_room";

interface Notification {
  id: string;
  type: NotifType;
  read: boolean;
  time: string;
  actor?: typeof loungeUsers[0];
  text: string;
  sub?: string;
  action?: { label: string; path: string };
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1",  type: "weekly_report", read: false, time: "Just now",    text: "Your weekly AI report is ready", sub: "Fluency +5 · Vocabulary +7", action: { label: "View Report", path: "/profile" } },
  { id: "n2",  type: "like",          read: false, time: "2m ago",      text: "liked your post", sub: "Grammar mistakes do not matter when speaking...", actor: loungeUsers[1] },
  { id: "n3",  type: "reply",         read: false, time: "5m ago",      text: "replied to your post", sub: "This is solid advice actually. Confidence over grammar.", actor: loungeUsers[4] },
  { id: "n4",  type: "room_invite",   read: false, time: "12m ago",     text: "invited you to a Debate room", sub: "Is social media making us worse communicators?", actor: loungeUsers[0], action: { label: "Join Room", path: "/room/r1" } },
  { id: "n5",  type: "follow",        read: false, time: "1h ago",      text: "started following you", sub: "B2 · Football Talk", actor: loungeUsers[3] },
  { id: "n6",  type: "achievement",   read: true,  time: "2h ago",      text: "You earned a new badge!", sub: "🏆 Debate Champion — Won 5 debates", action: { label: "See Badges", path: "/profile" } },
  { id: "n7",  type: "like",          read: true,  time: "3h ago",      text: "liked your post", sub: "Phrases that instantly make you sound more professional...", actor: loungeUsers[2] },
  { id: "n8",  type: "joined_room",   read: true,  time: "5h ago",      text: "joined your room", sub: "Is remote work killing company culture?", actor: loungeUsers[1] },
  { id: "n9",  type: "reply",         read: true,  time: "Yesterday",   text: "replied to your post", sub: "The plateau phase is brutal but real. Push through.", actor: loungeUsers[3] },
  { id: "n10", type: "follow",        read: true,  time: "Yesterday",   text: "started following you", sub: "C2 · Daily Debate · Tech and AI", actor: loungeUsers[4] },
  { id: "n11", type: "weekly_report", read: true,  time: "1 week ago",  text: "Your weekly AI report is ready", sub: "Fluency +3 · Grammar +2", action: { label: "View Report", path: "/profile" } },
];

const NOTIF_ICON: Record<NotifType, { icon: React.ReactNode; bg: string }> = {
  like:          { icon: <Heart    className="h-4 w-4 text-pink-400"   />, bg: "bg-pink-500/15 border-pink-500/20"   },
  reply:         { icon: <MessageSquare className="h-4 w-4 text-sky-400" />, bg: "bg-sky-500/15 border-sky-500/20"   },
  follow:        { icon: <Users    className="h-4 w-4 text-green-400"  />, bg: "bg-green-500/15 border-green-500/20" },
  room_invite:   { icon: <Mic      className="h-4 w-4 text-primary"    />, bg: "bg-primary/15 border-primary/20"     },
  achievement:   { icon: <Trophy   className="h-4 w-4 text-amber-400"  />, bg: "bg-amber-500/15 border-amber-500/20" },
  weekly_report: { icon: <Zap      className="h-4 w-4 text-primary"    />, bg: "bg-primary/15 border-primary/20"     },
  joined_room:   { icon: <Mic      className="h-4 w-4 text-green-400"  />, bg: "bg-green-500/15 border-green-500/20" },
};

export default function NotificationsPage({ onMenuOpen = () => {} }: NotificationsPageProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[17px] font-extrabold text-foreground flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">
              <Check className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-3">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all capitalize " +
                (filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:text-foreground")
              }
            >
              {f === "unread" ? `Unread (${unreadCount})` : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3 px-6">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-2">
              <Bell className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-[17px] font-bold text-foreground">You are all caught up</p>
            <p className="text-[13px] text-muted-foreground">No unread notifications right now</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayed.map((notif, i) => {
              const iconInfo = NOTIF_ICON[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    markRead(notif.id);
                    if (notif.actor) navigate("/user/" + notif.actor.id);
                  }}
                  className={
                    "flex items-start gap-3.5 px-4 py-4 border-b border-white/[0.05] cursor-pointer transition-colors hover:bg-white/[0.02] " +
                    (!notif.read ? "bg-primary/[0.025]" : "")
                  }
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                  {notif.read && <div className="w-2 flex-shrink-0" />}

                  {/* Icon or avatar */}
                  <div className="relative flex-shrink-0">
                    {notif.actor ? (
                      <>
                        <img src={notif.actor.avatar_url} alt="" className="w-11 h-11 rounded-full border border-white/10" />
                        <div className={"absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center " + iconInfo.bg}>
                          {iconInfo.icon}
                        </div>
                      </>
                    ) : (
                      <div className={"w-11 h-11 rounded-2xl border flex items-center justify-center " + iconInfo.bg}>
                        {iconInfo.icon}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-foreground leading-snug">
                      {notif.actor && (
                        <span className="font-bold">{notif.actor.full_name} </span>
                      )}
                      {notif.text}
                    </p>
                    {notif.sub && (
                      <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">{notif.sub}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{notif.time}</p>
                    {notif.action && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); markRead(notif.id); navigate(notif.action!.path); }}
                        className="mt-2 flex items-center gap-1 text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        {notif.action.label} <ChevronRight className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div className="h-24" />
      </div>

      <BottomNav />
    </div>
  );
}

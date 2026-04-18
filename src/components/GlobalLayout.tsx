
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X, Home, Users, Mic, User, Flame, Zap,
  Settings, Compass, LogOut,
} from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";
import { loungeUsers, lounges, sampleRooms } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];

interface GlobalLayoutProps {
  children: React.ReactNode;
  panelOpen: boolean;
  onPanelClose: () => void;
}

const NAV_ITEMS = [
  { icon: Home,    label: "Home",         path: "/"        },
  { icon: Compass, label: "Global Rooms", path: "/explore" },
  { icon: Users,   label: "Communities",  path: "/rooms"   },
  { icon: User,    label: "Profile",      path: "/profile" },
];

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
    </span>
  );
}

export function GlobalLayout({ children, panelOpen, onPanelClose }: GlobalLayoutProps) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const go = (path: string) => { navigate(path); onPanelClose(); };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
              onClick={onPanelClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] flex flex-col overflow-hidden"
              style={{ background: "linear-gradient(160deg, #0f1320 0%, #0a0d14 100%)" }}
            >
              {/* Top border glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* User card */}
              <div className="relative px-5 pt-12 pb-5 border-b border-white/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
                <button
                  onClick={onPanelClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/8 text-muted-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-[0_0_16px_rgba(124,58,237,0.35)]">
                      <img src={currentUser.avatar_url} alt="" className="w-full h-full rounded-[10px] object-cover bg-card" />
                    </div>
                    {currentUser.is_online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0f1320]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-foreground truncate">{currentUser.full_name}</p>
                    <p className="text-[12px] text-muted-foreground truncate">@{currentUser.username}</p>
                  </div>
                </div>
                {/* Stats */}
                <div className="flex items-center gap-4 mt-3.5">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                    <span className="text-[13px] font-bold text-foreground">{currentUser.streak_count}</span>
                    <span className="text-[11px] text-muted-foreground">streak</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[13px] font-bold text-foreground">{currentUser.xp_points.toLocaleString()}</span>
                    <span className="text-[11px] text-muted-foreground">XP</span>
                  </div>
                  <LevelBadge level={currentUser.english_level} />
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => go(item.path)}
                      className={
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all relative " +
                        (active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground")
                      }
                    >
                      {active && (
                        <motion.div
                          layoutId="panel-active"
                          className="absolute inset-0 bg-primary/15 rounded-xl"
                        />
                      )}
                      <item.icon className="h-5 w-5 flex-shrink-0 relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary relative z-10" />
                      )}
                    </motion.button>
                  );
                })}

                {/* Communities section */}
                <div className="pt-5 pb-2 px-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50 font-bold">
                    Your Communities
                  </p>
                </div>
                {lounges.slice(0, 5).map((lounge) => {
                  const liveCount = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive).length;
                  const active = pathname === "/lounge/" + lounge.id;
                  return (
                    <motion.button
                      key={lounge.id}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => go("/lounge/" + lounge.id)}
                      className={
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all " +
                        (active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground")
                      }
                    >
                      <span className="text-[17px] w-6 text-center flex-shrink-0">{lounge.emoji}</span>
                      <span className="flex-1 truncate text-left">{lounge.name}</span>
                      {liveCount > 0 && <LiveDot />}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => go("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground transition-all"
                >
                  <Settings className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  Settings
                </motion.button>
              </div>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}

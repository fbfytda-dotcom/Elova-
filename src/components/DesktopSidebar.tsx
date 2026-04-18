
import { motion } from "framer-motion";
import { Home, Compass, Users, User, Flame, Zap, Settings, Mic } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { loungeUsers, lounges, sampleRooms } from "@/lib/lounge-data";
import { LevelBadge } from "@/components/LevelBadge";

const currentUser = loungeUsers[0];

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

export function DesktopSidebar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex w-[72px] lg:w-[220px] flex-col flex-shrink-0 sticky top-0 h-screen border-r border-white/[0.07] bg-[#0a0d14]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 lg:px-5 h-[53px] border-b border-white/[0.07] flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(124,58,237,0.4)]">
          <Mic className="h-4 w-4 text-white" />
        </div>
        <span className="hidden lg:block text-[16px] font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Elova
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 lg:px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <motion.button
              key={item.path}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(item.path)}
              className={
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all relative " +
                (active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground")
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={active ? 2.5 : 1.8} />
              <span className="hidden lg:block">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}

        {/* Communities */}
        <div className="pt-5 pb-2 px-3 hidden lg:block">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50 font-bold">Communities</p>
        </div>
        {lounges.slice(0, 5).map((lounge) => {
          const liveCount = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive).length;
          const active = pathname === "/lounge/" + lounge.id;
          return (
            <motion.button
              key={lounge.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/lounge/" + lounge.id)}
              className={
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all " +
                (active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground")
              }
              title={lounge.name}
            >
              <span className="text-[16px] flex-shrink-0 w-6 text-center">{lounge.emoji}</span>
              <span className="hidden lg:block flex-1 text-left truncate">{lounge.name}</span>
              {liveCount > 0 && <span className="hidden lg:block"><LiveDot /></span>}
            </motion.button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-2 lg:px-3 py-4 border-t border-white/[0.07] flex-shrink-0">
        <motion.button
          whileHover={{ x: 2 }}
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors"
        >
          <div className="relative flex-shrink-0">
            <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-lg border border-white/10" />
            {currentUser.is_online && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0d14]" />
            )}
          </div>
          <div className="hidden lg:block flex-1 min-w-0 text-left">
            <p className="text-[12px] font-bold text-foreground truncate">{currentUser.full_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Flame className="h-2.5 w-2.5 text-orange-400" />{currentUser.streak_count}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Zap className="h-2.5 w-2.5 text-primary/70" />{currentUser.xp_points.toLocaleString()}
              </span>
            </div>
          </div>
          <Settings className="hidden lg:block h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground flex-shrink-0" />
        </motion.button>
      </div>
    </aside>
  );
}

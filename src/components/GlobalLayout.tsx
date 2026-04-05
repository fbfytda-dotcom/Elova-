import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Home, Users, Mic, User, Flame, Zap, Settings } from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";
import { loungeUsers, lounges } from "@/lib/lounge-data";

const currentUser = loungeUsers[0];

interface GlobalLayoutProps {
  children: React.ReactNode;
  panelOpen: boolean;
  onPanelClose: () => void;
}

export function GlobalLayout({ children, panelOpen, onPanelClose }: GlobalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: User,  label: "Profile",      path: "/profile" },
    { icon: Home,  label: "Home",         path: "/" },
    { icon: Users, label: "Communities",  path: "/rooms" },
    { icon: Mic,   label: "Global Rooms", path: "/explore" },
  ];

  const go = (path: string) => { navigate(path); onPanelClose(); };

  return (
    <>
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onPanelClose}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#0d1117] border-r border-white/[0.08] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <img src={currentUser.avatar_url} alt="" className="w-11 h-11 rounded-full border-2 border-primary/30" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{currentUser.full_name}</p>
                    <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                  </div>
                </div>
                <button onClick={onPanelClose} className="p-1.5 rounded-full hover:bg-white/8 transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-bold text-foreground">{currentUser.streak_count}</span>
                  <span className="text-xs text-muted-foreground">streak</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">{currentUser.xp_points.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
                <LevelBadge level={currentUser.english_level} />
              </div>

              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => go(item.path)}
                      className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all " + (active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {item.label}
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}

                <div className="pt-4 pb-2 px-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">Your Communities</p>
                </div>
                {lounges.map((lounge) => (
                  <button
                    key={lounge.id}
                    onClick={() => go("/lounge/" + lounge.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                  >
                    <span className="text-lg w-6 text-center flex-shrink-0">{lounge.emoji}</span>
                    <span className="truncate">{lounge.name}</span>
                    {lounge.activeRooms > 0 && <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-green-400 flex-shrink-0" />}
                  </button>
                ))}
              </nav>

              <div className="px-3 py-3 border-t border-white/[0.07]">
                <button
                  onClick={() => go("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

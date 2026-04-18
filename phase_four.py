#!/usr/bin/env python3
"""Run from your Elova project root: python3 phase_four.py"""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {path}")

# ══════════════════════════════════════════════════════════════════════════════
# 1. BOTTOM NAV — correct routes, active state, badge on rooms
# ══════════════════════════════════════════════════════════════════════════════
w("src/components/BottomNav.tsx", r'''
import { motion } from "framer-motion";
import { Home, Compass, Users, Mic, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: Home,    label: "Home",       path: "/"        },
  { icon: Compass, label: "Rooms",      path: "/explore" },
  { icon: Users,   label: "Communities",path: "/rooms"   },
  { icon: User,    label: "Profile",    path: "/profile" },
];

export function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0d14]/95 backdrop-blur-xl border-t border-white/[0.07]">
      <div className="flex items-center justify-around px-2 py-2 safe-bottom">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl relative"
            >
              {/* Active bg pill */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                className={
                  "h-[22px] w-[22px] relative z-10 transition-colors " +
                  (active ? "text-primary" : "text-muted-foreground")
                }
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={
                  "text-[10px] font-semibold relative z-10 transition-colors " +
                  (active ? "text-primary" : "text-muted-foreground")
                }
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 2. GLOBAL LAYOUT — full nav panel, works on every page
# ══════════════════════════════════════════════════════════════════════════════
w("src/components/GlobalLayout.tsx", r'''
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
''')

# ══════════════════════════════════════════════════════════════════════════════
# 3. DESKTOP SIDEBAR — shown on md+ screens, always visible
# ══════════════════════════════════════════════════════════════════════════════
w("src/components/DesktopSidebar.tsx", r'''
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
''')

# ══════════════════════════════════════════════════════════════════════════════
# 4. APP.TSX — desktop layout wrapper + all routes wired
# ══════════════════════════════════════════════════════════════════════════════
w("src/App.tsx", r'''
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalLayout } from "@/components/GlobalLayout";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import HomePage       from "./pages/HomePage";
import ExplorePage    from "./pages/ExplorePage";
import RoomsPage      from "./pages/RoomsPage";
import CommunityPage  from "./pages/CommunityPage";
import GamesPage      from "./pages/GamesPage";
import VoiceRoomPage  from "./pages/VoiceRoomPage";
import ProfilePage    from "./pages/ProfilePage";
import LoungePage     from "./pages/LoungePage";
import NotFound       from "./pages/NotFound";

const queryClient = new QueryClient();

// Voice room gets full screen — no sidebar
const FULLSCREEN_ROUTES = ["/room/"];

function AppShell() {
  const [panelOpen, setPanelOpen] = useState(false);
  const location = useLocation();
  const openMenu  = () => setPanelOpen(true);
  const closeMenu = () => setPanelOpen(false);

  const isFullscreen = FULLSCREEN_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <GlobalLayout panelOpen={panelOpen} onPanelClose={closeMenu}>
      <div className={isFullscreen ? "" : "flex min-h-screen"}>
        {/* Desktop sidebar — hidden on fullscreen routes */}
        {!isFullscreen && <DesktopSidebar />}

        {/* Main content */}
        <div className={isFullscreen ? "min-h-screen" : "flex-1 min-w-0"}>
          <Routes>
            <Route path="/"            element={<HomePage      onMenuOpen={openMenu} />} />
            <Route path="/explore"     element={<ExplorePage   onMenuOpen={openMenu} />} />
            <Route path="/rooms"       element={<RoomsPage     onMenuOpen={openMenu} />} />
            <Route path="/community"   element={<CommunityPage onMenuOpen={openMenu} />} />
            <Route path="/games"       element={<GamesPage     onMenuOpen={openMenu} />} />
            <Route path="/room/:id"    element={<VoiceRoomPage onMenuOpen={openMenu} />} />
            <Route path="/lounge/:id"  element={<LoungePage    onMenuOpen={openMenu} />} />
            <Route path="/profile"     element={<ProfilePage   onMenuOpen={openMenu} />} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </GlobalLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
''')

# ══════════════════════════════════════════════════════════════════════════════
# 5. INDEX.CSS — visual audit: typography, scrollbar, selection color
# ══════════════════════════════════════════════════════════════════════════════
w("src/index.css", r'''@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Google Font ── */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@layer base {
  :root {
    --background: 228 45% 7%;
    --foreground: 0 0% 98%;
    --card: 228 35% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 228 35% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 263 84% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 228 30% 14%;
    --secondary-foreground: 220 15% 65%;
    --muted: 228 25% 16%;
    --muted-foreground: 220 15% 52%;
    --accent: 187 94% 43%;
    --accent-foreground: 228 45% 7%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 228 25% 14%;
    --input: 228 25% 14%;
    --ring: 263 84% 58%;
    --radius: 0.75rem;
    --level-a1: 220 15% 55%;
    --level-a2: 217 91% 60%;
    --level-b1: 142 71% 45%;
    --level-b2: 25 95% 53%;
    --level-c1: 0 84% 60%;
    --level-c2: 263 84% 58%;
  }

  * {
    @apply border-border;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    @apply bg-background text-foreground;
    overflow-x: hidden;
  }

  /* Custom scrollbar — subtle, on-brand */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.25); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.45); }
  * { scrollbar-width: thin; scrollbar-color: rgba(124,58,237,0.25) transparent; }

  /* Text selection */
  ::selection { background: rgba(124,58,237,0.3); color: white; }
}

@layer components {
  /* Glass card — used everywhere */
  .glass-panel {
    @apply bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm;
  }
  .glass-panel-strong {
    @apply bg-background/85 border border-white/[0.07] backdrop-blur-xl;
  }

  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
  }

  /* Glow effects */
  .glow-primary {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.35);
  }
  .glow-accent {
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.35);
  }

  /* Safe area bottom for mobile nav */
  .safe-bottom {
    padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  }
}

@layer utilities {
  /* Smooth page transitions */
  .page-enter {
    @apply animate-[fade-in_0.2s_ease-out];
  }

  /* Hide scrollbar but keep scroll */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
}
''')

# ══════════════════════════════════════════════════════════════════════════════
# 6. TAILWIND CONFIG — ensure all needed classes are present
# ══════════════════════════════════════════════════════════════════════════════
w("tailwind.config.ts", r'''import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        level: {
          a1: "hsl(var(--level-a1))",
          a2: "hsl(var(--level-a2))",
          b1: "hsl(var(--level-b1))",
          b2: "hsl(var(--level-b2))",
          c1: "hsl(var(--level-c1))",
          c2: "hsl(var(--level-c2))",
        },
        violet: { DEFAULT: "#7C3AED", glow: "#A855F7" },
        cyan:   { DEFAULT: "#06B6D4", glow: "#22D3EE" },
        space: {
          DEFAULT: "#0B0F19",
          light:   "#131825",
          lighter: "#1A2035",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-in":         "fade-in 0.3s ease-out",
        "slide-in-right":  "slide-in-right 0.3s ease-out",
        "ping-slow":       "ping-slow 2s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
''')

# ══════════════════════════════════════════════════════════════════════════════
# 7. NOT FOUND PAGE — polished
# ══════════════════════════════════════════════════════════════════════════════
w("src/pages/NotFound.tsx", r'''
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Mic } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Glowing orb */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.4)]">
          <Mic className="h-12 w-12 text-white" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-primary/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[64px] font-extrabold gradient-text leading-none mb-2"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[18px] font-bold text-foreground mb-2"
      >
        This room does not exist
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[14px] text-muted-foreground mb-8 max-w-[280px] leading-relaxed"
      >
        The page you are looking for has left the conversation or never joined.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-[15px] hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(124,58,237,0.4)]"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </motion.button>
    </div>
  );
}
''')

print("\n✅ Phase 4 complete. 7 files written:")
print("   src/components/BottomNav.tsx        — correct routes + active states")
print("   src/components/GlobalLayout.tsx     — full panel, all pages")
print("   src/components/DesktopSidebar.tsx   — always visible on md+ screens")
print("   src/App.tsx                         — desktop layout + all routes wired")
print("   src/index.css                       — visual audit + font + scrollbar")
print("   tailwind.config.ts                  — complete color system")
print("   src/pages/NotFound.tsx              — polished 404")
print("\nRun: npm run dev")

// DesktopSidebar.tsx — Premium Frosted Glass Navigation for Elova
// Upgraded: Saturated glassmorphism, glowing active states, pulsing live indicators, premium profile ring

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Compass,
  Users,
  Bell,
  User,
  Flame,
  Award,
  Bookmark,
  Settings,
  Zap,
} from "lucide-react";
import { lounges, loungeUsers } from "@/lib/lounge-data";
import { LevelBadge } from "@/components/LevelBadge";

// ════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ════════════════════════════════════════════════════════════

const primaryNav = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/rooms", icon: Users, label: "Communities" },
  { path: "/notifications", icon: Bell, label: "Activity" },
  { path: "/profile", icon: User, label: "Profile" },
];

const secondaryNav = [
  { path: "/leaderboard", icon: Award, label: "Leaderboard" },
  { path: "/saved", icon: Bookmark, label: "Saved" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

// ════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR COMPONENT
// ════════════════════════════════════════════════════════════

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = loungeUsers[0]; // Alex Chen (C1)

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="hidden md:flex sticky top-0 h-screen flex-col border-r z-30 w-[72px] lg:w-[240px] transition-all duration-300"
      style={{
        borderColor: "rgba(255,255,255,0.05)",
        // Billion-dollar blur: saturated and deep
        background: "linear-gradient(180deg, rgba(11,15,25,0.85) 0%, rgba(5,5,15,0.95) 100%)",
        backdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "1px 0 30px rgba(0,0,0,0.4)", // Adds massive depth against the main content
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center h-16 border-b px-0 lg:px-6"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="w-full flex items-center justify-center lg:justify-start gap-3">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-extrabold text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
              fontSize: 15,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
            E
          </motion.div>
          <span className="hidden lg:block font-extrabold text-white text-lg tracking-tight">
            Elova
          </span>
        </div>
      </div>

      {/* ── Primary Navigation ── */}
      <nav className="flex flex-col py-4 space-y-1 px-3">
        {primaryNav.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex items-center gap-4 h-11 rounded-xl transition-all duration-200 group w-full justify-center lg:justify-start lg:px-4 hover:bg-white/[0.04]"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "linear-gradient(90deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Glowing Left Active Bar */}
              {active && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ background: "#8b5cf6", boxShadow: "0 0 10px #8b5cf6" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <item.icon
                size={20}
                className="flex-shrink-0 relative z-10 transition-colors"
                style={{ 
                  color: active ? "#fff" : "rgba(255,255,255,0.35)", 
                  filter: active ? "drop-shadow(0 0 8px rgba(139,92,246,0.6))" : "none" 
                }}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className="hidden lg:block relative z-10 font-semibold text-[13.5px] tracking-wide"
                style={{ color: active ? "white" : "rgba(255,255,255,0.45)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* ── Secondary Navigation ── */}
      <nav className="flex flex-col py-4 space-y-1 px-3">
        {secondaryNav.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex items-center gap-4 h-10 rounded-xl transition-all duration-200 group w-full justify-center lg:justify-start lg:px-4 hover:bg-white/[0.04]"
              style={{ color: active ? "#fff" : "rgba(255,255,255,0.3)" }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active-sec"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(124,58,237,0.1)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={18} className="flex-shrink-0 relative z-10" />
              <span
                className="hidden lg:block relative z-10 font-medium text-[13px]"
                style={{ color: active ? "white" : "rgba(255,255,255,0.4)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* ── Communities (Live Dots) ── */}
      <div className="py-4 px-3 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <p
          className="text-[10px] uppercase tracking-[0.16em] font-bold mb-3 text-center lg:text-left lg:px-4"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          <span className="hidden lg:inline">Your Dens</span>
          <span className="lg:hidden">Dens</span>
        </p>
        <div className="flex flex-col space-y-1">
          {lounges.slice(0, 6).map((lounge) => {
            const hasLiveRoom = lounge.activeRooms > 0;
            return (
              <button
                key={lounge.id}
                onClick={() => navigate(`/lounge/${lounge.id}`)}
                className="flex items-center gap-3 h-10 rounded-xl hover:bg-white/[0.04] transition-colors w-full justify-center lg:justify-start lg:px-4 relative"
              >
                <span className="text-lg flex-shrink-0">{lounge.emoji}</span>
                <span
                  className="hidden lg:block font-medium truncate text-[13px]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {lounge.name}
                </span>
                {/* Pulsing Live Dot */}
                {hasLiveRoom && (
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-2 right-2 lg:relative lg:top-auto lg:right-auto lg:ml-auto w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: "#06b6d4",
                      boxShadow: "0 0 8px #06b6d4",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── User Footer ── */}
      <div
        className="flex flex-col items-center lg:flex-row lg:items-center gap-3 py-4 px-3 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          background: "linear-gradient(to top, rgba(124,58,237,0.06), transparent)",
        }}
      >
        {/* Gradient Ring Avatar */}
        <div className="relative flex-shrink-0 p-[2px] rounded-full" style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
            style={{
              background: "#0B0F19", // Matches the dark bg to create cutout effect
              fontSize: 12,
            }}
          >
            {currentUser.full_name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{ background: "#10b981", borderColor: "#0B0F19" }}
          />
        </div>

        <div className="hidden lg:flex flex-col flex-1 min-w-0">
          <p className="font-semibold text-white text-[13px] truncate">
            {currentUser.full_name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <Zap size={10} color="#8b5cf6" fill="#8b5cf6" />
              <span className="font-bold" style={{ fontSize: 10, color: "#a78bfa" }}>
                {currentUser.xp_points}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={10} color="#f59e0b" />
              <span className="font-bold" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                {currentUser.streak_count}
              </span>
            </div>
            <LevelBadge level={currentUser.english_level} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
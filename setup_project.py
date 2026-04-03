#!/usr/bin/env python3
"""Run this script from your project root to scaffold all source files."""
import os

files = {
    '.gitignore': '''# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
node_modules
dist
dist-ssr
*.local
# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?''',

    'README.md': '''# Welcome to your Lovable project
TODO: Document your project here''',

    'playwright-fixture.ts': '''// Re-export the base fixture from the package
// Override or extend test/expect here if needed
export { test, expect } from "lovable-agent-playwright-config/fixture";''',

    'playwright.config.ts': '''import { createLovableConfig } from "lovable-agent-playwright-config/config";
export default createLovableConfig({
// Add your custom playwright configuration overrides here
// Example:
// timeout: 60000,
// use: {
// baseURL: 'http://localhost:3000',
// },
});''',

    'postcss.config.js': '''export default {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
};''',

    'src/App.css': '''#root {
max-width: 1280px;
margin: 0 auto;
padding: 2rem;
text-align: center;
}
.logo {
height: 6em;
padding: 1.5em;
will-change: filter;
transition: filter 300ms;
}
.logo:hover {
filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
filter: drop-shadow(0 0 2em #61dafbaa);
}
@keyframes logo-spin {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}
@media (prefers-reduced-motion: no-preference) {
a:nth-of-type(2) .logo {
animation: logo-spin infinite 20s linear;
}
}
.card {
padding: 2em;
}
.read-the-docs {
color: #888;
}''',

    'src/App.tsx': '''import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import RoomsPage from "./pages/RoomsPage";
import CommunityPage from "./pages/CommunityPage";
import GamesPage from "./pages/GamesPage";
import VoiceRoomPage from "./pages/VoiceRoomPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => (
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Toaster />
<Sonner />
<BrowserRouter>
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/explore" element={<ExplorePage />} />
<Route path="/rooms" element={<RoomsPage />} />
<Route path="/community" element={<CommunityPage />} />
<Route path="/games" element={<GamesPage />} />
<Route path="/room/:id" element={<VoiceRoomPage />} />
<Route path="/profile" element={<ProfilePage />} />
<Route path="*" element={<NotFound />} />
</Routes>
</BrowserRouter>
</TooltipProvider>
</QueryClientProvider>
);
export default App;''',

    'src/components/BottomNav.tsx': '''import { motion } from "framer-motion";
import { Home, Compass, MessageSquare, Gamepad2, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
const navItems = [
{ icon: Home, label: "Home", path: "/" },
{ icon: Compass, label: "Explore", path: "/explore" },
{ icon: MessageSquare, label: "Chat", path: "/community" },
{ icon: Gamepad2, label: "Games", path: "/games" },
{ icon: User, label: "Profile", path: "/profile" },
];
export function BottomNav() {
const navigate = useNavigate();
const { pathname } = useLocation();
return (
<nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel-strong rounded-none border-x-0 border-b-0 px-2 py-1
md:hidden">
<div className="flex items-center justify-around">
{navItems.map((item) => {
const active = pathname === item.path;
return (
<motion.button
key={item.label}
whileTap={{ scale: 0.9 }}
onClick={() => navigate(item.path)}
className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${active ?
"text-primary" : "text-muted-foreground"}`}
>
<item.icon className="h-5 w-5" />
<span className="text-[10px] font-medium">{item.label}</span>
{active && (
<motion.div layoutId="nav-indicator" className="w-1 h-1 rounded-full bg-primary" />
)}
</motion.button>
);
})}
</div>
</nav>
);
}''',

    'src/components/DesktopSidebar.tsx': '''import { motion } from "framer-motion";
import { Home, Compass, Mic, User, Flame, Zap, Settings, MessageSquare, Gamepad2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockUsers } from "@/lib/mock-data";
const sidebarLinks = [
{ icon: Home, label: "Home", path: "/" },
{ icon: Compass, label: "Explore", path: "/explore" },
{ icon: Mic, label: "Voice Rooms", path: "/rooms" },
{ icon: MessageSquare, label: "Community", path: "/community" },
{ icon: Gamepad2, label: "Games", path: "/games" },
{ icon: User, label: "Profile", path: "/profile" },
];
export function DesktopSidebar() {
const navigate = useNavigate();
const { pathname } = useLocation();
const currentUser = mockUsers[0];
return (
<div className="hidden md:flex w-[72px] lg:w-56 flex-col glass-panel rounded-none border-t-0 border-b-0 border-l-0
h-screen sticky top-0">
{/* Logo */}
<div className="p-4 lg:px-5 flex items-center gap-2.5 border-b border-white/5">
<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center
flex-shrink-0 glow-primary">
<Mic className="h-4 w-4 text-primary-foreground" />
</div>
<span className="hidden lg:block text-base font-extrabold tracking-tight gradient-text">SpeakSpace</span>
</div>
{/* Nav */}
<nav className="flex-1 p-3 space-y-1">
{sidebarLinks.map((link) => {
const active = pathname === link.path;
return (
<motion.button
key={link.path}
whileHover={{ x: 2 }}
whileTap={{ scale: 0.97 }}
onClick={() => navigate(link.path)}
className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/5
hover:text-foreground"}`}
>
<link.icon className="h-5 w-5 flex-shrink-0" />
<span className="hidden lg:block">{link.label}</span>
{active && (
<motion.div layoutId="sidebar-indicator" className="hidden lg:block w-1.5 h-1.5 rounded-full bg-primary
ml-auto" />
)}
</motion.button>
);
})}
</nav>
{/* User section */}
<div className="p-3 border-t border-white/5">
<div className="flex items-center gap-2.5 px-2 py-2">
<div className="relative flex-shrink-0">
<img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full" />
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
</div>
<div className="hidden lg:block flex-1 min-w-0">
<p className="text-xs font-semibold text-foreground truncate">{currentUser.full_name}</p>
<div className="flex items-center gap-2 text-[10px] text-muted-foreground">
<span className="flex items-center gap-0.5"><Flame className="h-3 w-3 text-orange-400"
/>{currentUser.streak_count}</span>
<span className="flex items-center gap-0.5"><Zap className="h-3 w-3 text-accent"
/>{currentUser.xp_points.toLocaleString()}</span>
</div>
</div>
<button className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors">
<Settings className="h-4 w-4" />
</button>
</div>
</div>

</div>
);
}''',

    'src/components/FriendsSidebar.tsx': '''import { motion } from "framer-motion";
import { Search, Users, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { LevelBadge } from "./LevelBadge";
import type { UserProfile } from "@/lib/types";
import { useState } from "react";
interface FriendsSidebarProps {
friends: UserProfile[];
}
export function FriendsSidebar({ friends }: FriendsSidebarProps) {
const [search, setSearch] = useState("");
const [onlineOpen, setOnlineOpen] = useState(true);
const [offlineOpen, setOfflineOpen] = useState(false);
const online = friends.filter((f) => f.is_online);
const offline = friends.filter((f) => !f.is_online);
const filtered = (list: UserProfile[]) =>
list.filter((f) => f.full_name.toLowerCase().includes(search.toLowerCase()));
return (
<div className="w-64 glass-panel h-full flex flex-col">
{/* Header */}
<div className="p-4 border-b border-white/5">
<div className="flex items-center gap-2 mb-3">
<Users className="h-4 w-4 text-primary" />
<h2 className="text-sm font-bold tracking-tight text-foreground">Friends</h2>
<span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold
ml-auto">{online.length}</span>
</div>
<div className="relative">
<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search friends..."
className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-foreground
placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30
transition-all"
/>
</div>
</div>
{/* Lists */}
<div className="flex-1 overflow-y-auto p-2 space-y-1">
<FriendSection title="Online" count={filtered(online).length} open={onlineOpen} toggle={() =>
setOnlineOpen(!onlineOpen)}>
{filtered(online).map((f, i) => (
<FriendRow key={f.id} user={f} index={i} />
))}
</FriendSection>
<FriendSection title="Offline" count={filtered(offline).length} open={offlineOpen} toggle={() =>
setOfflineOpen(!offlineOpen)}>
{filtered(offline).map((f, i) => (
<FriendRow key={f.id} user={f} index={i} />
))}
</FriendSection>
</div>
</div>
);
}
function FriendSection({ title, count, open, toggle, children }: {
title: string; count: number; open: boolean; toggle: () => void; children: React.ReactNode;
}) {
return (
<div>
<button onClick={toggle} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[10px] font-bold uppercase
tracking-widest text-muted-foreground hover:text-foreground transition-colors">
{open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
{title}
<span className="ml-auto text-muted-foreground/60">{count}</span>
</button>
{open && <div className="space-y-0.5">{children}</div>}
</div>
);
}

function FriendRow({ user, index }: { user: UserProfile; index: number }) {
return (
<motion.div
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.05 }}
className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group
cursor-pointer"
>
<div className="relative flex-shrink-0">
<img src={user.avatar_url} alt={user.full_name} className={`w-8 h-8 rounded-full ${!user.is_online ? "opacity-50
grayscale" : ""}`} />
{user.is_online && (
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
)}
</div>
<div className="flex-1 min-w-0">
<p className="text-xs font-semibold text-foreground truncate">{user.full_name}</p>
<p className="text-[10px] text-muted-foreground truncate">@{user.username}</p>
</div>
<LevelBadge level={user.english_level} />
<button className="opacity-0 group-hover:opacity-100 transition-opacity">
<MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
</button>
</motion.div>
);
}''',

    'src/components/LevelBadge.tsx': '''import { type EnglishLevel } from "@/lib/types";
const levelColors: Record<EnglishLevel, string> = {
A1: "bg-muted-foreground/20 text-muted-foreground",
A2: "bg-level-a2/20 text-level-a2",
B1: "bg-level-b1/20 text-level-b1",
B2: "bg-level-b2/20 text-level-b2",
C1: "bg-level-c1/20 text-level-c1",
C2: "bg-level-c2/20 text-level-c2",
};
const levelGlow: Record<EnglishLevel, string> = {
A1: "shadow-none",
A2: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
B1: "shadow-[0_0_12px_rgba(34,197,94,0.3)]",
B2: "shadow-[0_0_12px_rgba(249,115,22,0.3)]",
C1: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
C2: "shadow-[0_0_12px_rgba(124,58,237,0.4)]",
};
export function LevelBadge({ level, size = "sm" }: { level: EnglishLevel; size?: "sm" | "md" }) {
return (
<span
className={`
inline-flex items-center font-bold tracking-wider uppercase rounded-full
${levelColors[level]} ${levelGlow[level]}
${size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"}
`}
>
{level}
</span>
);
}''',

    'src/components/NavLink.tsx': '''import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
className?: string;
activeClassName?: string;
pendingClassName?: string;
}
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
return (
<RouterNavLink
ref={ref}
to={to}
className={({ isActive, isPending }) =>
cn(className, isActive && activeClassName, isPending && pendingClassName)
}
{...props}
/>
);
},
);
NavLink.displayName = "NavLink";
export { NavLink };''',

    'src/components/ProfileCard.tsx': '''import { motion } from "framer-motion";
import { Flame, Phone, Zap } from "lucide-react";
import { LevelBadge } from "./LevelBadge";
import type { UserProfile } from "@/lib/types";
const levelRingColors: Record<string, string> = {
A1: "from-gray-400 to-gray-600",
A2: "from-blue-400 to-blue-600",
B1: "from-green-400 to-green-600",
B2: "from-orange-400 to-orange-600",
C1: "from-red-400 to-red-600",
C2: "from-violet-400 to-violet-600",
};
export function ProfileCard({ user }: { user: UserProfile }) {
const ringGrad = levelRingColors[user.english_level] ?? "from-violet-400 to-cyan-400";
return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
className="glass-panel p-6 flex flex-col items-center gap-4 relative overflow-hidden"
>
{/* Glow backdrop */}
<div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
{/* Avatar with gradient ring */}
<div className="relative">
<div className={`w-[124px] h-[124px] rounded-full bg-gradient-to-br ${ringGrad} p-[3px]`}>
<img
src={user.avatar_url}
alt={user.full_name}
className="w-full h-full rounded-full bg-card object-cover"
/>
</div>
{/* Online status */}
{user.is_online && (
<div className="absolute bottom-1 right-1">
<span className="relative flex h-4 w-4">
<span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400
opacity-75" />
<span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-card" />
</span>
</div>
)}
</div>
{/* Info */}
<div className="text-center space-y-1">
<h3 className="text-lg font-bold tracking-tight text-foreground">{user.full_name}</h3>
<p className="text-sm text-muted-foreground">@{user.username}</p>
</div>
<LevelBadge level={user.english_level} size="md" />
{/* Stats */}
<div className="flex items-center gap-6 text-sm">
<div className="flex items-center gap-1.5">
<Flame className="h-4 w-4 text-orange-400 animate-flame" />
<span className="font-semibold text-foreground">{user.streak_count}</span>
<span className="text-muted-foreground">streak</span>
</div>
<div className="flex items-center gap-1.5">
<Zap className="h-4 w-4 text-accent" />
<span className="font-semibold text-foreground">{user.xp_points.toLocaleString()}</span>
<span className="text-muted-foreground">XP</span>
</div>
</div>
{user.bio && (
<p className="text-sm text-muted-foreground text-center max-w-[200px]">{user.bio}</p>
)}
{/* Call button */}
<motion.button
whileHover={{ scale: 1.02, y: -2 }}
whileTap={{ scale: 0.95 }}

className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground
font-semibold text-sm flex items-center justify-center gap-2 glow-primary transition-shadow
hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
>
<Phone className="h-4 w-4" />
Call
</motion.button>
</motion.div>
);
}''',

    'src/components/RoomCard.tsx': '''import { motion } from "framer-motion";
import { Users, Mic, Crown, ArrowRight } from "lucide-react";
import { LevelBadge } from "./LevelBadge";
import type { VoiceRoom } from "@/lib/types";
import { useNavigate } from "react-router-dom";
const categoryColors: Record<string, string> = {
General: "bg-primary/20 text-primary",
Business: "bg-blue-900/40 text-blue-300",
Exam: "bg-amber-900/40 text-amber-300",
Gaming: "bg-green-900/40 text-green-300",
};
const vibeGradients: Record<string, string> = {
General: "from-primary/30 via-accent/20 to-transparent",
Business: "from-blue-600/30 via-blue-900/20 to-transparent",
Exam: "from-amber-600/30 via-amber-900/20 to-transparent",
Gaming: "from-green-600/30 via-green-900/20 to-transparent",
};
export function RoomCard({ room, index }: { room: VoiceRoom; index: number }) {
const navigate = useNavigate();
return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.08, type: "spring", bounce: 0.3 }}
whileHover={{ scale: 1.01 }}
className="glass-panel group cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/30"
onClick={() => navigate(`/room/${room.id}`)}
>
{/* Vibe gradient header */}
<div className={`h-16 bg-gradient-to-r ${vibeGradients[room.language_focus]} relative`}>
{room.is_live && (
<div className="absolute top-3 right-3 flex items-center gap-1.5 bg-destructive/90 backdrop-blur-sm
rounded-full px-2.5 py-1">
<span className="relative flex h-2 w-2">
<span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-foreground" />
<span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
</span>
<span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Live</span>
</div>
)}
</div>
<div className="p-5 space-y-4">
{/* Title & category */}
<div className="space-y-2">
<div className="flex items-center gap-2 flex-wrap">
<span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
${categoryColors[room.language_focus]}`}>
{room.language_focus}
</span>
{room.topic_tags.map((tag) => (
<span key={tag} className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
{tag}
</span>
))}
</div>
<h3 className="text-base font-bold tracking-tight text-foreground">{room.name}</h3>
</div>
{/* Host & participants */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
{/* Host */}
<div className="relative">
<img src={room.host.avatar_url} alt={room.host.full_name} className="w-8 h-8 rounded-full border-2
border-primary/50" />
<Crown className="absolute -top-2 -right-1 h-3.5 w-3.5 text-amber-400" />
</div>
{/* Stacked participants */}
<div className="flex -space-x-2">
{room.participants.slice(1, 4).map((p) => (
<img key={p.id} src={p.avatar_url} alt={p.full_name} className="w-7 h-7 rounded-full border-2
border-card" />

))}
{room.current_count > 4 && (
<div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
<span className="text-[10px] font-bold text-muted-foreground">+{room.current_count - 4}</span>
</div>
)}
</div>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center gap-1 text-muted-foreground">
<Users className="h-3.5 w-3.5" />
<span className="text-xs font-medium">{room.current_count}/{room.max_capacity}</span>
</div>
<LevelBadge level={room.host.english_level} />
</div>
</div>
{/* Join button - visible on hover */}
<motion.div
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 0, height: 0 }}
whileHover={{ opacity: 1, height: "auto" }}
className="group-hover:opacity-100 group-hover:h-auto transition-all duration-200 overflow-hidden"
>
<motion.button
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.95 }}
className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground
font-semibold text-sm flex items-center justify-center gap-2 glow-primary"
>
<Mic className="h-4 w-4" />
Join Room
<ArrowRight className="h-4 w-4" />
</motion.button>
</motion.div>
</div>
</motion.div>
);
}''',

    'src/components/ui/accordion.tsx': '''import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
<AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
<AccordionPrimitive.Header className="flex">
<AccordionPrimitive.Trigger
ref={ref}
className={cn(
"flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline
[&[data-state=open]>svg]:rotate-180",
className,
)}
{...props}
>
{children}
<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
<AccordionPrimitive.Content
ref={ref}
className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up
data-[state=open]:animate-accordion-down"
{...props}
>
<div className={cn("pb-4 pt-0", className)}>{children}</div>
</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };''',

    'src/components/ui/alert-dialog.tsx': '''import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
<AlertDialogPrimitive.Overlay
className={cn(
"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
className,
)}
{...props}
ref={ref}
/>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
<AlertDialogPortal>
<AlertDialogOverlay />
<AlertDialogPrimitive.Content
ref={ref}
className={cn(
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border
bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
className,
)}
{...props}
/>
</AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
<AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
<AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef<

React.ElementRef<typeof AlertDialogPrimitive.Action>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
<AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
<AlertDialogPrimitive.Cancel
ref={ref}
className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
{...props}
/>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
export {
AlertDialog,
AlertDialogPortal,
AlertDialogOverlay,
AlertDialogTrigger,
AlertDialogContent,
AlertDialogHeader,
AlertDialogFooter,
AlertDialogTitle,
AlertDialogDescription,
AlertDialogAction,
AlertDialogCancel,
};''',

    'src/components/ui/alert.tsx': '''import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const alertVariants = cva(
"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4
[&>svg]:top-4 [&>svg]:text-foreground",
{
variants: {
variant: {
default: "bg-background text-foreground",
destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
},
},
defaultVariants: {
variant: "default",
},
},
);
const Alert = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
<div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
({ className, ...props }, ref) => (
<h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
),
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
({ className, ...props }, ref) => (
<div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
),
);
AlertDescription.displayName = "AlertDescription";
export { Alert, AlertTitle, AlertDescription };''',

    'src/components/ui/aspect-ratio.tsx': '''import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
const AspectRatio = AspectRatioPrimitive.Root;
export { AspectRatio };''',

    'src/components/ui/avatar.tsx': '''import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
const Avatar = React.forwardRef<
React.ElementRef<typeof AvatarPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
<AvatarPrimitive.Root
ref={ref}
className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
{...props}
/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef<
React.ElementRef<typeof AvatarPrimitive.Image>,
React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
<AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef<
React.ElementRef<typeof AvatarPrimitive.Fallback>,
React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
<AvatarPrimitive.Fallback
ref={ref}
className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
{...props}
/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
export { Avatar, AvatarImage, AvatarFallback };''',

    'src/components/ui/badge.tsx': '''import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva(
"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none
focus:ring-2 focus:ring-ring focus:ring-offset-2",
{
variants: {
variant: {
default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
outline: "text-foreground",
},
},
defaultVariants: {
variant: "default",
},
},
);
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) {
return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };''',

    'src/components/ui/breadcrumb.tsx': '''import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
const Breadcrumb = React.forwardRef<
HTMLElement,
React.ComponentPropsWithoutRef<"nav"> & {
separator?: React.ReactNode;
}
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
({ className, ...props }, ref) => (
<ol
ref={ref}
className={cn(
"flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
className,
)}
{...props}
/>
),
);
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
({ className, ...props }, ref) => (
<li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
),
);
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef<
HTMLAnchorElement,
React.ComponentPropsWithoutRef<"a"> & {
asChild?: boolean;
}
>(({ asChild, className, ...props }, ref) => {
const Comp = asChild ? Slot : "a";
return <Comp ref={ref} className={cn("transition-colors hover:text-foreground", className)} {...props} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
({ className, ...props }, ref) => (
<span
ref={ref}
role="link"
aria-disabled="true"
aria-current="page"
className={cn("font-normal text-foreground", className)}
{...props}
/>
),
);
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
<li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
{children ?? <ChevronRight />}
</li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
<span
role="presentation"
aria-hidden="true"
className={cn("flex h-9 w-9 items-center justify-center", className)}
{...props}
>
<MoreHorizontal className="h-4 w-4" />
<span className="sr-only">More</span>

</span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
export {
Breadcrumb,
BreadcrumbList,
BreadcrumbItem,
BreadcrumbLink,
BreadcrumbPage,
BreadcrumbSeparator,
BreadcrumbEllipsis,
};''',

    'src/components/ui/button.tsx': '''import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva(
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background
transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
{
variants: {
variant: {
default: "bg-primary text-primary-foreground hover:bg-primary/90",
destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
ghost: "hover:bg-accent hover:text-accent-foreground",
link: "text-primary underline-offset-4 hover:underline",
},
size: {
default: "h-10 px-4 py-2",
sm: "h-9 rounded-md px-3",
lg: "h-11 rounded-md px-8",
icon: "h-10 w-10",
},
},
defaultVariants: {
variant: "default",
size: "default",
},
},
);
export interface ButtonProps
extends React.ButtonHTMLAttributes<HTMLButtonElement>,
VariantProps<typeof buttonVariants> {
asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
({ className, variant, size, asChild = false, ...props }, ref) => {
const Comp = asChild ? Slot : "button";
return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
},
);
Button.displayName = "Button";
export { Button, buttonVariants };''',

    'src/components/ui/calendar.tsx': '''import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
return (
<DayPicker
showOutsideDays={showOutsideDays}
className={cn("p-3", className)}
classNames={{
months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
month: "space-y-4",
caption: "flex justify-center pt-1 relative items-center",
caption_label: "text-sm font-medium",
nav: "space-x-1 flex items-center",
nav_button: cn(
buttonVariants({ variant: "outline" }),
"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
),
nav_button_previous: "absolute left-1",
nav_button_next: "absolute right-1",
table: "w-full border-collapse space-y-1",
head_row: "flex",
head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
row: "flex w-full mt-2",
cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md
[&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent
first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative
focus-within:z-20",
day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
day_range_end: "day-range-end",
day_selected:
"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary
focus:text-primary-foreground",
day_today: "bg-accent text-accent-foreground",
day_outside:
"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground
aria-selected:opacity-30",
day_disabled: "text-muted-foreground opacity-50",
day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
day_hidden: "invisible",
...classNames,
}}
components={{
IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
}}
{...props}
/>
);
}
Calendar.displayName = "Calendar";
export { Calendar };''',

    'src/components/ui/card.tsx': '''import * as React from "react";
import { cn } from "@/lib/utils";
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
<div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => (
<div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
),
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
({ className, ...props }, ref) => (
<h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
),
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
({ className, ...props }, ref) => (
<p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
),
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => (
<div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
),
);
CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };''',

    'src/components/ui/carousel.tsx': '''import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
opts?: CarouselOptions;
plugins?: CarouselPlugin;
orientation?: "horizontal" | "vertical";
setApi?: (api: CarouselApi) => void;
};
type CarouselContextProps = {
carouselRef: ReturnType<typeof useEmblaCarousel>[0];
api: ReturnType<typeof useEmblaCarousel>[1];
scrollPrev: () => void;
scrollNext: () => void;
canScrollPrev: boolean;
canScrollNext: boolean;
} & CarouselProps;
const CarouselContext = React.createContext<CarouselContextProps | null>(null);
function useCarousel() {
const context = React.useContext(CarouselContext);
if (!context) {
throw new Error("useCarousel must be used within a <Carousel />");
}
return context;
}
const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
const [carouselRef, api] = useEmblaCarousel(
{
...opts,
axis: orientation === "horizontal" ? "x" : "y",
},
plugins,
);
const [canScrollPrev, setCanScrollPrev] = React.useState(false);
const [canScrollNext, setCanScrollNext] = React.useState(false);
const onSelect = React.useCallback((api: CarouselApi) => {
if (!api) {
return;
}
setCanScrollPrev(api.canScrollPrev());
setCanScrollNext(api.canScrollNext());
}, []);
const scrollPrev = React.useCallback(() => {
api?.scrollPrev();
}, [api]);
const scrollNext = React.useCallback(() => {
api?.scrollNext();
}, [api]);
const handleKeyDown = React.useCallback(
(event: React.KeyboardEvent<HTMLDivElement>) => {
if (event.key === "ArrowLeft") {
event.preventDefault();
scrollPrev();
} else if (event.key === "ArrowRight") {
event.preventDefault();
scrollNext();

}
},
[scrollPrev, scrollNext],
);
React.useEffect(() => {
if (!api || !setApi) {
return;
}
setApi(api);
}, [api, setApi]);
React.useEffect(() => {
if (!api) {
return;
}
onSelect(api);
api.on("reInit", onSelect);
api.on("select", onSelect);
return () => {
api?.off("select", onSelect);
};
}, [api, onSelect]);
return (
<CarouselContext.Provider
value={{
carouselRef,
api: api,
opts,
orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
scrollPrev,
scrollNext,
canScrollPrev,
canScrollNext,
}}
>
<div
ref={ref}
onKeyDownCapture={handleKeyDown}
className={cn("relative", className)}
role="region"
aria-roledescription="carousel"
{...props}
>
{children}
</div>
</CarouselContext.Provider>
);
},
);
Carousel.displayName = "Carousel";
const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => {
const { carouselRef, orientation } = useCarousel();
return (
<div ref={carouselRef} className="overflow-hidden">
<div
ref={ref}
className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
{...props}
/>
</div>
);
},
);
CarouselContent.displayName = "CarouselContent";
const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => {
const { orientation } = useCarousel();
return (

<div
ref={ref}
role="group"
aria-roledescription="slide"
className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
{...props}
/>
);
},
);
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
({ className, variant = "outline", size = "icon", ...props }, ref) => {
const { orientation, scrollPrev, canScrollPrev } = useCarousel();
return (
<Button
ref={ref}
variant={variant}
size={size}
className={cn(
"absolute h-8 w-8 rounded-full",
orientation === "horizontal"
? "-left-12 top-1/2 -translate-y-1/2"
: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
className,
)}
disabled={!canScrollPrev}
onClick={scrollPrev}
{...props}
>
<ArrowLeft className="h-4 w-4" />
<span className="sr-only">Previous slide</span>
</Button>
);
},
);
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
({ className, variant = "outline", size = "icon", ...props }, ref) => {
const { orientation, scrollNext, canScrollNext } = useCarousel();
return (
<Button
ref={ref}
variant={variant}
size={size}
className={cn(
"absolute h-8 w-8 rounded-full",
orientation === "horizontal"
? "-right-12 top-1/2 -translate-y-1/2"
: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
className,
)}
disabled={!canScrollNext}
onClick={scrollNext}
{...props}
>
<ArrowRight className="h-4 w-4" />
<span className="sr-only">Next slide</span>
</Button>
);
},
);
CarouselNext.displayName = "CarouselNext";
export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };''',

    'src/components/ui/chart.tsx': '''import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;
export type ChartConfig = {
[k in string]: {
label?: React.ReactNode;
icon?: React.ComponentType;
} & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};
type ChartContextProps = {
config: ChartConfig;
};
const ChartContext = React.createContext<ChartContextProps | null>(null);
function useChart() {
const context = React.useContext(ChartContext);
if (!context) {
throw new Error("useChart must be used within a <ChartContainer />");
}
return context;
}
const ChartContainer = React.forwardRef<
HTMLDivElement,
React.ComponentProps<"div"> & {
config: ChartConfig;
children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}
>(({ id, className, children, config, ...props }, ref) => {
const uniqueId = React.useId();
const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
return (
<ChartContext.Provider value={{ config }}>
<div
data-chart={chartId}
ref={ref}
className={cn(
"flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground
[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50
[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent
[&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border
[&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted
[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent
[&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
className,
)}
{...props}
>
<ChartStyle id={chartId} config={config} />
<RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
</div>
</ChartContext.Provider>
);
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);
if (!colorConfig.length) {
return null;
}
return (
<style
dangerouslySetInnerHTML={{
__html: Object.entries(THEMES)

.map(
([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
.map(([key, itemConfig]) => {
const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
return color ? ` --color-${key}: ${color};` : null;
})
.join("\\n")}
}
`,
)
.join("\\n"),
}}
/>
);
};
const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartTooltipContent = React.forwardRef<
HTMLDivElement,
React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
React.ComponentProps<"div"> & {
hideLabel?: boolean;
hideIndicator?: boolean;
indicator?: "line" | "dot" | "dashed";
nameKey?: string;
labelKey?: string;
}
>(
(
{
active,
payload,
className,
indicator = "dot",
hideLabel = false,
hideIndicator = false,
label,
labelFormatter,
labelClassName,
formatter,
color,
nameKey,
labelKey,
},
ref,
) => {
const { config } = useChart();
const tooltipLabel = React.useMemo(() => {
if (hideLabel || !payload?.length) {
return null;
}
const [item] = payload;
const key = `${labelKey || item.dataKey || item.name || "value"}`;
const itemConfig = getPayloadConfigFromPayload(config, item, key);
const value =
!labelKey && typeof label === "string"
? config[label as keyof typeof config]?.label || label
: itemConfig?.label;
if (labelFormatter) {
return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
}
if (!value) {
return null;
}
return <div className={cn("font-medium", labelClassName)}>{value}</div>;
}, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);
if (!active || !payload?.length) {
return null;
}

const nestLabel = payload.length === 1 && indicator !== "dot";
return (
<div
ref={ref}
className={cn(
"grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs
shadow-xl",
className,
)}
>
{!nestLabel ? tooltipLabel : null}
<div className="grid gap-1.5">
{payload.map((item, index) => {
const key = `${nameKey || item.name || item.dataKey || "value"}`;
const itemConfig = getPayloadConfigFromPayload(config, item, key);
const indicatorColor = color || item.payload.fill || item.color;
return (
<div
key={item.dataKey}
className={cn(
"flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
indicator === "dot" && "items-center",
)}
>
{formatter && item?.value !== undefined && item.name ? (
formatter(item.value, item.name, item, index, item.payload)
) : (
<>
{itemConfig?.icon ? (
<itemConfig.icon />
) : (
!hideIndicator && (
<div
className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
"h-2.5 w-2.5": indicator === "dot",
"w-1": indicator === "line",
"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
"my-0.5": nestLabel && indicator === "dashed",
})}
style={
{
"--color-bg": indicatorColor,
"--color-border": indicatorColor,
} as React.CSSProperties
}
/>
)
)}
<div
className={cn(
"flex flex-1 justify-between leading-none",
nestLabel ? "items-end" : "items-center",
)}
>
<div className="grid gap-1.5">
{nestLabel ? tooltipLabel : null}
<span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
</div>
{item.value && (
<span className="font-mono font-medium tabular-nums text-foreground">
{item.value.toLocaleString()}
</span>
)}
</div>
</>
)}
</div>
);
})}
</div>
</div>
);
},
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;
const ChartLegendContent = React.forwardRef<
HTMLDivElement,
React.ComponentProps<"div"> &
Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
hideIcon?: boolean;
nameKey?: string;
}
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
const { config } = useChart();
if (!payload?.length) {
return null;
}
return (
<div
ref={ref}
className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
>
{payload.map((item) => {
const key = `${nameKey || item.dataKey || "value"}`;
const itemConfig = getPayloadConfigFromPayload(config, item, key);
return (
<div
key={item.value}
className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
>
{itemConfig?.icon && !hideIcon ? (
<itemConfig.icon />
) : (
<div
className="h-2 w-2 shrink-0 rounded-[2px]"
style={{
backgroundColor: item.color,
}}
/>
)}
{itemConfig?.label}
</div>
);
})}
</div>
);
});
ChartLegendContent.displayName = "ChartLegend";
// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
if (typeof payload !== "object" || payload === null) {
return undefined;
}
const payloadPayload =
"payload" in payload && typeof payload.payload === "object" && payload.payload !== null
? payload.payload
: undefined;
let configLabelKey: string = key;
if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
configLabelKey = payload[key as keyof typeof payload] as string;
} else if (
payloadPayload &&
key in payloadPayload &&
typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
) {
configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
}
return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];

… (file truncated for length — see source for full content)''',

    'src/components/ui/checkbox.tsx': '''import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
const Checkbox = React.forwardRef<
React.ElementRef<typeof CheckboxPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
<CheckboxPrimitive.Root
ref={ref}
className={cn(
"peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary
data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className,
)}
{...props}
>
<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
<Check className="h-4 w-4" />
</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox };''',

    'src/components/ui/collapsible.tsx': '''import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
export { Collapsible, CollapsibleTrigger, CollapsibleContent };''',

    'src/components/ui/command.tsx': '''import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const Command = React.forwardRef<
React.ElementRef<typeof CommandPrimitive>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
<CommandPrimitive
ref={ref}
className={cn(
"flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
className,
)}
{...props}
/>
));
Command.displayName = CommandPrimitive.displayName;
interface CommandDialogProps extends DialogProps {}
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
return (
<Dialog {...props}>
<DialogContent className="overflow-hidden p-0 shadow-lg">
<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium
[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2
[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2
[&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
{children}
</Command>
</DialogContent>
</Dialog>
);
};
const CommandInput = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Input>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
<CommandPrimitive.Input
ref={ref}
className={cn(
"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground
disabled:cursor-not-allowed disabled:opacity-50",
className,
)}
{...props}
/>
</div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;
const CommandList = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.List>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
<CommandPrimitive.List
ref={ref}
className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
{...props}
/>
));
CommandList.displayName = CommandPrimitive.List.displayName;
const CommandEmpty = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Empty>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
const CommandGroup = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Group>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
<CommandPrimitive.Group
ref={ref}
className={cn(
"overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5
[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
className,
)}
{...props}
/>
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;
const CommandSeparator = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
<CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
const CommandItem = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
<CommandPrimitive.Item
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground
data-[disabled=true]:opacity-50",
className,
)}
{...props}
/>
));
CommandItem.displayName = CommandPrimitive.Item.displayName;
const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";
export {
Command,
CommandDialog,
CommandInput,
CommandList,
CommandEmpty,
CommandGroup,
CommandItem,
CommandShortcut,
CommandSeparator,
};''',

    'src/components/ui/context-menu.tsx': '''import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const ContextMenuSubTrigger = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
inset?: boolean;
}
>(({ className, inset, children, ...props }, ref) => (
<ContextMenuPrimitive.SubTrigger
ref={ref}
className={cn(
"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
inset && "pl-8",
className,
)}
{...props}
>
{children}
<ChevronRight className="ml-auto h-4 w-4" />
</ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;
const ContextMenuSubContent = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
<ContextMenuPrimitive.SubContent
ref={ref}
className={cn(
"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;
const ContextMenuContent = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
<ContextMenuPrimitive.Portal>
<ContextMenuPrimitive.Content
ref={ref}
className={cn(
"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in
fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
</ContextMenuPrimitive.Portal>
));

ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;
const ContextMenuItem = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
<ContextMenuPrimitive.Item
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
inset && "pl-8",
className,
)}
{...props}
/>
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;
const ContextMenuCheckboxItem = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
<ContextMenuPrimitive.CheckboxItem
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
className,
)}
checked={checked}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<ContextMenuPrimitive.ItemIndicator>
<Check className="h-4 w-4" />
</ContextMenuPrimitive.ItemIndicator>
</span>
{children}
</ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;
const ContextMenuRadioItem = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
<ContextMenuPrimitive.RadioItem
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
className,
)}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<ContextMenuPrimitive.ItemIndicator>
<Circle className="h-2 w-2 fill-current" />
</ContextMenuPrimitive.ItemIndicator>
</span>
{children}
</ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;
const ContextMenuLabel = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
<ContextMenuPrimitive.Label
ref={ref}
className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
{...props}

/>
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;
const ContextMenuSeparator = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
<ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;
const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";
export {
ContextMenu,
ContextMenuTrigger,
ContextMenuContent,
ContextMenuItem,
ContextMenuCheckboxItem,
ContextMenuRadioItem,
ContextMenuLabel,
ContextMenuSeparator,
ContextMenuShortcut,
ContextMenuGroup,
ContextMenuPortal,
ContextMenuSub,
ContextMenuSubContent,
ContextMenuSubTrigger,
ContextMenuRadioGroup,
};''',

    'src/components/ui/dialog.tsx': '''import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
<DialogPrimitive.Overlay
ref={ref}
className={cn(
"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
className,
)}
{...props}
/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
<DialogPortal>
<DialogOverlay />
<DialogPrimitive.Content
ref={ref}
className={cn(
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border
bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
className,
)}
{...props}
>
{children}
<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background
transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100
focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
<X className="h-4 w-4" />
<span className="sr-only">Close</span>
</DialogPrimitive.Close>
</DialogPrimitive.Content>
</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
<DialogPrimitive.Title
ref={ref}
className={cn("text-lg font-semibold leading-none tracking-tight", className)}

{...props}
/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
<DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
export {
Dialog,
DialogPortal,
DialogOverlay,
DialogClose,
DialogTrigger,
DialogContent,
DialogHeader,
DialogFooter,
DialogTitle,
DialogDescription,
};''',

    'src/components/ui/drawer.tsx': '''import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
<DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;
const DrawerOverlay = React.forwardRef<
React.ElementRef<typeof DrawerPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
<DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;
const DrawerContent = React.forwardRef<
React.ElementRef<typeof DrawerPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
<DrawerPortal>
<DrawerOverlay />
<DrawerPrimitive.Content
ref={ref}
className={cn(
"fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
className,
)}
{...props}
>
<div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
{children}
</DrawerPrimitive.Content>
</DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";
const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";
const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";
const DrawerTitle = React.forwardRef<
React.ElementRef<typeof DrawerPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
<DrawerPrimitive.Title
ref={ref}
className={cn("text-lg font-semibold leading-none tracking-tight", className)}
{...props}
/>
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;
const DrawerDescription = React.forwardRef<
React.ElementRef<typeof DrawerPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
<DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;
export {
Drawer,

DrawerPortal,
DrawerOverlay,
DrawerTrigger,
DrawerClose,
DrawerContent,
DrawerHeader,
DrawerFooter,
DrawerTitle,
DrawerDescription,
};''',

    'src/components/ui/dropdown-menu.tsx': '''import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuSubTrigger = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
inset?: boolean;
}
>(({ className, inset, children, ...props }, ref) => (
<DropdownMenuPrimitive.SubTrigger
ref={ref}
className={cn(
"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
data-[state=open]:bg-accent focus:bg-accent",
inset && "pl-8",
className,
)}
{...props}
>
{children}
<ChevronRight className="ml-auto h-4 w-4" />
</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
<DropdownMenuPrimitive.SubContent
ref={ref}
className={cn(
"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
<DropdownMenuPrimitive.Portal>
<DropdownMenuPrimitive.Content
ref={ref}
sideOffset={sideOffset}
className={cn(
"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
</DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
<DropdownMenuPrimitive.Item
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent
focus:text-accent-foreground",
inset && "pl-8",
className,
)}
{...props}
/>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
<DropdownMenuPrimitive.CheckboxItem
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent
focus:text-accent-foreground",
className,
)}
checked={checked}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<DropdownMenuPrimitive.ItemIndicator>
<Check className="h-4 w-4" />
</DropdownMenuPrimitive.ItemIndicator>
</span>
{children}
</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
<DropdownMenuPrimitive.RadioItem
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent
focus:text-accent-foreground",
className,
)}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<DropdownMenuPrimitive.ItemIndicator>
<Circle className="h-2 w-2 fill-current" />
</DropdownMenuPrimitive.ItemIndicator>
</span>
{children}
</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
<DropdownMenuPrimitive.Label

ref={ref}
className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
{...props}
/>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
<DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
export {
DropdownMenu,
DropdownMenuTrigger,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuCheckboxItem,
DropdownMenuRadioItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuGroup,
DropdownMenuPortal,
DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
DropdownMenuRadioGroup,
};''',

    'src/components/ui/form.tsx': '''import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
const Form = FormProvider;
type FormFieldContextValue<
TFieldValues extends FieldValues = FieldValues,
TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
name: TName;
};
const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);
const FormField = <
TFieldValues extends FieldValues = FieldValues,
TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
...props
}: ControllerProps<TFieldValues, TName>) => {
return (
<FormFieldContext.Provider value={{ name: props.name }}>
<Controller {...props} />
</FormFieldContext.Provider>
);
};
const useFormField = () => {
const fieldContext = React.useContext(FormFieldContext);
const itemContext = React.useContext(FormItemContext);
const { getFieldState, formState } = useFormContext();
const fieldState = getFieldState(fieldContext.name, formState);
if (!fieldContext) {
throw new Error("useFormField should be used within <FormField>");
}
const { id } = itemContext;
return {
id,
name: fieldContext.name,
formItemId: `${id}-form-item`,
formDescriptionId: `${id}-form-item-description`,
formMessageId: `${id}-form-item-message`,
...fieldState,
};
};
type FormItemContextValue = {
id: string;
};
const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => {
const id = React.useId();
return (
<FormItemContext.Provider value={{ id }}>
<div ref={ref} className={cn("space-y-2", className)} {...props} />
</FormItemContext.Provider>
);
},
);
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef<
React.ElementRef<typeof LabelPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

>(({ className, ...props }, ref) => {
const { error, formItemId } = useFormField();
return <Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
({ ...props }, ref) => {
const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
return (
<Slot
ref={ref}
id={formItemId}
aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
aria-invalid={!!error}
{...props}
/>
);
},
);
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
({ className, ...props }, ref) => {
const { formDescriptionId } = useFormField();
return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
},
);
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
({ className, children, ...props }, ref) => {
const { error, formMessageId } = useFormField();
const body = error ? String(error?.message) : children;
if (!body) {
return null;
}
return (
<p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
{body}
</p>
);
},
);
FormMessage.displayName = "FormMessage";
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };''',

    'src/components/ui/hover-card.tsx': '''import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";
const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardContent = React.forwardRef<
React.ElementRef<typeof HoverCardPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
<HoverCardPrimitive.Content
ref={ref}
align={align}
sideOffset={sideOffset}
className={cn(
"z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
export { HoverCard, HoverCardTrigger, HoverCardContent };''',

    'src/components/ui/input-otp.tsx': '''import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";
const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
({ className, containerClassName, ...props }, ref) => (
<OTPInput
ref={ref}
containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
className={cn("disabled:cursor-not-allowed", className)}
{...props}
/>
),
);
InputOTP.displayName = "InputOTP";
const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
);
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = React.forwardRef<
React.ElementRef<"div">,
React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
const inputOTPContext = React.useContext(OTPInputContext);
const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
return (
<div
ref={ref}
className={cn(
"relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all
first:rounded-l-md first:border-l last:rounded-r-md",
isActive && "z-10 ring-2 ring-ring ring-offset-background",
className,
)}
{...props}
>
{char}
{hasFakeCaret && (
<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
<div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
</div>
)}
</div>
);
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
({ ...props }, ref) => (
<div ref={ref} role="separator" {...props}>
<Dot />
</div>
),
);
InputOTPSeparator.displayName = "InputOTPSeparator";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };''',

    'src/components/ui/input.tsx': '''import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
({ className, type, ...props }, ref) => {
return (
<input
type={type}
className={cn(
"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background
file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
className,
)}
ref={ref}
{...props}
/>
);
},
);
Input.displayName = "Input";
export { Input };''',

    'src/components/ui/label.tsx': '''import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef<
React.ElementRef<typeof LabelPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
<LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;
export { Label };''',

    'src/components/ui/menubar.tsx': '''import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const Menubar = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
<MenubarPrimitive.Root
ref={ref}
className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)}
{...props}
/>
));
Menubar.displayName = MenubarPrimitive.Root.displayName;
const MenubarTrigger = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
<MenubarPrimitive.Trigger
ref={ref}
className={cn(
"flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none
data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
className,
)}
{...props}
/>
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;
const MenubarSubTrigger = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
inset?: boolean;
}
>(({ className, inset, children, ...props }, ref) => (
<MenubarPrimitive.SubTrigger
ref={ref}
className={cn(
"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
inset && "pl-8",
className,
)}
{...props}
>
{children}
<ChevronRight className="ml-auto h-4 w-4" />
</MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;
const MenubarSubContent = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
<MenubarPrimitive.SubContent
ref={ref}
className={cn(
"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",

className,
)}
{...props}
/>
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;
const MenubarContent = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
<MenubarPrimitive.Portal>
<MenubarPrimitive.Content
ref={ref}
align={align}
alignOffset={alignOffset}
sideOffset={sideOffset}
className={cn(
"z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md
data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
</MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;
const MenubarItem = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
<MenubarPrimitive.Item
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
inset && "pl-8",
className,
)}
{...props}
/>
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;
const MenubarCheckboxItem = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
<MenubarPrimitive.CheckboxItem
ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
className,
)}
checked={checked}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<MenubarPrimitive.ItemIndicator>
<Check className="h-4 w-4" />
</MenubarPrimitive.ItemIndicator>
</span>
{children}
</MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;
const MenubarRadioItem = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.RadioItem>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
<MenubarPrimitive.RadioItem

ref={ref}
className={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
className,
)}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<MenubarPrimitive.ItemIndicator>
<Circle className="h-2 w-2 fill-current" />
</MenubarPrimitive.ItemIndicator>
</span>
{children}
</MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;
const MenubarLabel = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
<MenubarPrimitive.Label
ref={ref}
className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
{...props}
/>
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;
const MenubarSeparator = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
<MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;
const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
MenubarShortcut.displayname = "MenubarShortcut";
export {
Menubar,
MenubarMenu,
MenubarTrigger,
MenubarContent,
MenubarItem,
MenubarSeparator,
MenubarLabel,
MenubarCheckboxItem,
MenubarRadioGroup,
MenubarRadioItem,
MenubarPortal,
MenubarSubContent,
MenubarSubTrigger,
MenubarGroup,
MenubarSub,
MenubarShortcut,
};''',

    'src/components/ui/navigation-menu.tsx': '''import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
const NavigationMenu = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
<NavigationMenuPrimitive.Root
ref={ref}
className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
{...props}
>
{children}
<NavigationMenuViewport />
</NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
const NavigationMenuList = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.List>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
<NavigationMenuPrimitive.List
ref={ref}
className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
{...props}
/>
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const navigationMenuTriggerStyle = cva(
"group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium
transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground
focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50
data-[state=open]:bg-accent/50",
);
const NavigationMenuTrigger = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
<NavigationMenuPrimitive.Trigger
ref={ref}
className={cn(navigationMenuTriggerStyle(), "group", className)}
{...props}
>
{children}{" "}
<ChevronDown
className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
aria-hidden="true"
/>
</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
const NavigationMenuContent = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
<NavigationMenuPrimitive.Content
ref={ref}
className={cn(
"left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in
data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52
data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
className,
)}
{...props}
/>
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuViewport = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
<div className={cn("absolute left-0 top-full flex justify-center")}>
<NavigationMenuPrimitive.Viewport
className={cn(
"origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden
rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in
data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90
md:w-[var(--radix-navigation-menu-viewport-width)]",
className,
)}
ref={ref}
{...props}
/>
</div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
const NavigationMenuIndicator = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
<NavigationMenuPrimitive.Indicator
ref={ref}
className={cn(
"top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in
data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
className,
)}
{...props}
>
<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
export {
navigationMenuTriggerStyle,
NavigationMenu,
NavigationMenuList,
NavigationMenuItem,
NavigationMenuContent,
NavigationMenuTrigger,
NavigationMenuLink,
NavigationMenuIndicator,
NavigationMenuViewport,
};''',

    'src/components/ui/pagination.tsx': '''import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
<nav
role="navigation"
aria-label="pagination"
className={cn("mx-auto flex w-full justify-center", className)}
{...props}
/>
);
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
({ className, ...props }, ref) => (
<ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
),
);
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
<li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";
type PaginationLinkProps = {
isActive?: boolean;
} & Pick<ButtonProps, "size"> &
React.ComponentProps<"a">;
const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
<a
aria-current={isActive ? "page" : undefined}
className={cn(
buttonVariants({
variant: isActive ? "outline" : "ghost",
size,
}),
className,
)}
{...props}
/>
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
<PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
<ChevronLeft className="h-4 w-4" />
<span>Previous</span>
</PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
<PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
<span>Next</span>
<ChevronRight className="h-4 w-4" />
</PaginationLink>
);
PaginationNext.displayName = "PaginationNext";
const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
<span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
<MoreHorizontal className="h-4 w-4" />
<span className="sr-only">More pages</span>
</span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
export {
Pagination,
PaginationContent,
PaginationEllipsis,
PaginationItem,

PaginationLink,
PaginationNext,
PaginationPrevious,
};''',

    'src/components/ui/popover.tsx': '''import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<
React.ElementRef<typeof PopoverPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
<PopoverPrimitive.Portal>
<PopoverPrimitive.Content
ref={ref}
align={align}
sideOffset={sideOffset}
className={cn(
"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
</PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
export { Popover, PopoverTrigger, PopoverContent };''',

    'src/components/ui/progress.tsx': '''import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
const Progress = React.forwardRef<
React.ElementRef<typeof ProgressPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
<ProgressPrimitive.Root
ref={ref}
className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
{...props}
>
<ProgressPrimitive.Indicator
className="h-full w-full flex-1 bg-primary transition-all"
style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
/>
</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };''',

    'src/components/ui/radio-group.tsx': '''import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
const RadioGroup = React.forwardRef<
React.ElementRef<typeof RadioGroupPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef<
React.ElementRef<typeof RadioGroupPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
return (
<RadioGroupPrimitive.Item
ref={ref}
className={cn(
"aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
disabled:opacity-50",
className,
)}
{...props}
>
<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
<Circle className="h-2.5 w-2.5 fill-current text-current" />
</RadioGroupPrimitive.Indicator>
</RadioGroupPrimitive.Item>
);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
export { RadioGroup, RadioGroupItem };''',

    'src/components/ui/resizable.tsx': '''import { GripVertical } from "lucide-react";
ertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";
const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
<ResizablePrimitive.PanelGroup
className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
{...props}
/>
);
const ResizablePanel = ResizablePrimitive.Panel;
const ResizableHandle = ({
withHandle,
className,
...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
withHandle?: boolean;
}) => (
<ResizablePrimitive.PanelResizeHandle
className={cn(
"relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1
after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full
data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1
data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2
data-[panel-group-direction=vertical]:after:translate-x-0 focus-visible:outline-none focus-visible:ring-1
focus-visible:ring-ring focus-visible:ring-offset-1 [&[data-panel-group-direction=vertical]>div]:rotate-90",
className,
)}
{...props}
>
{withHandle && (
<div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
<GripVertical className="h-2.5 w-2.5" />
</div>
)}
</ResizablePrimitive.PanelResizeHandle>
);
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };''',

    'src/components/ui/scroll-area.tsx': '''import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
const ScrollArea = React.forwardRef<
React.ElementRef<typeof ScrollAreaPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
<ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
<ScrollBar />
<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef<
React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
<ScrollAreaPrimitive.ScrollAreaScrollbar
ref={ref}
orientation={orientation}
className={cn(
"flex touch-none select-none transition-colors",
orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
className,
)}
{...props}
>
<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
export { ScrollArea, ScrollBar };''',

    'src/components/ui/select.tsx': '''import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
<SelectPrimitive.Trigger
ref={ref}
className={cn(
"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm
ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
className,
)}
{...props}
>
{children}
<SelectPrimitive.Icon asChild>
<ChevronDown className="h-4 w-4 opacity-50" />
</SelectPrimitive.Icon>
</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
<SelectPrimitive.ScrollUpButton
ref={ref}
className={cn("flex cursor-default items-center justify-center py-1", className)}
{...props}
>
<ChevronUp className="h-4 w-4" />
</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
<SelectPrimitive.ScrollDownButton
ref={ref}
className={cn("flex cursor-default items-center justify-center py-1", className)}
{...props}
>
<ChevronDown className="h-4 w-4" />
</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
<SelectPrimitive.Portal>
<SelectPrimitive.Content
ref={ref}
className={cn(
"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground
shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2",
position === "popper" &&
"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1

data-[side=top]:-translate-y-1",
className,
)}
position={position}
{...props}
>
<SelectScrollUpButton />
<SelectPrimitive.Viewport
className={cn(
"p-1",
position === "popper" &&
"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
)}
>
{children}
</SelectPrimitive.Viewport>
<SelectScrollDownButton />
</SelectPrimitive.Content>
</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
<SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
<SelectPrimitive.Item
ref={ref}
className={cn(
"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
className,
)}
{...props}
>
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
<SelectPrimitive.ItemIndicator>
<Check className="h-4 w-4" />
</SelectPrimitive.ItemIndicator>
</span>
<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
<SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
export {
Select,
SelectGroup,
SelectValue,
SelectTrigger,
SelectContent,
SelectLabel,
SelectItem,
SelectSeparator,
SelectScrollUpButton,
SelectScrollDownButton,
};''',

    'src/components/ui/separator.tsx': '''import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
const Separator = React.forwardRef<
React.ElementRef<typeof SeparatorPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
<SeparatorPrimitive.Root
ref={ref}
decorative={decorative}
orientation={orientation}
className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
{...props}
/>
));
Separator.displayName = SeparatorPrimitive.Root.displayName;
export { Separator };''',

    'src/components/ui/sheet.tsx': '''import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
<SheetPrimitive.Overlay
className={cn(
"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
className,
)}
{...props}
ref={ref}
/>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
"fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in
data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
{
variants: {
side: {
top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
bottom:
"inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left
data-[state=open]:slide-in-from-left sm:max-w-sm",
right:
"inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right
data-[state=open]:slide-in-from-right sm:max-w-sm",
},
},
defaultVariants: {
side: "right",
},
},
);
interface SheetContentProps
extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
VariantProps<typeof sheetVariants> {}
const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
({ side = "right", className, children, ...props }, ref) => (
<SheetPortal>
<SheetOverlay />
<SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
{children}
<SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background
transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring
focus:ring-offset-2 disabled:pointer-events-none">
<X className="h-4 w-4" />
<span className="sr-only">Close</span>
</SheetPrimitive.Close>
</SheetPrimitive.Content>
</SheetPortal>
),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />

);
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";
const SheetTitle = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
<SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
<SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
export {
Sheet,
SheetClose,
SheetContent,
SheetDescription,
SheetFooter,
SheetHeader,
SheetOverlay,
SheetPortal,
SheetTitle,
SheetTrigger,
};''',

    'src/components/ui/sidebar.tsx': '''import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
type SidebarContext = {
state: "expanded" | "collapsed";
open: boolean;
setOpen: (open: boolean) => void;
openMobile: boolean;
setOpenMobile: (open: boolean) => void;
isMobile: boolean;
toggleSidebar: () => void;
};
const SidebarContext = React.createContext<SidebarContext | null>(null);
function useSidebar() {
const context = React.useContext(SidebarContext);
if (!context) {
throw new Error("useSidebar must be used within a SidebarProvider.");
}
return context;
}
const SidebarProvider = React.forwardRef<
HTMLDivElement,
React.ComponentProps<"div"> & {
defaultOpen?: boolean;
open?: boolean;
onOpenChange?: (open: boolean) => void;
}
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
const isMobile = useIsMobile();
const [openMobile, setOpenMobile] = React.useState(false);
// This is the internal state of the sidebar.
// We use openProp and setOpenProp for control from outside the component.
const [_open, _setOpen] = React.useState(defaultOpen);
const open = openProp ?? _open;
const setOpen = React.useCallback(
(value: boolean | ((value: boolean) => boolean)) => {
const openState = typeof value === "function" ? value(open) : value;
if (setOpenProp) {
setOpenProp(openState);
} else {
_setOpen(openState);
}
// This sets the cookie to keep the sidebar state.
document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
},
[setOpenProp, open],
);
// Helper to toggle the sidebar.
const toggleSidebar = React.useCallback(() => {
return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
}, [isMobile, setOpen, setOpenMobile]);

// Adds a keyboard shortcut to toggle the sidebar.
React.useEffect(() => {
const handleKeyDown = (event: KeyboardEvent) => {
if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
event.preventDefault();
toggleSidebar();
}
};
window.addEventListener("keydown", handleKeyDown);
return () => window.removeEventListener("keydown", handleKeyDown);
}, [toggleSidebar]);
// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
const state = open ? "expanded" : "collapsed";
const contextValue = React.useMemo<SidebarContext>(
() => ({
state,
open,
setOpen,
isMobile,
openMobile,
setOpenMobile,
toggleSidebar,
}),
[state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
);
return (
<SidebarContext.Provider value={contextValue}>
<TooltipProvider delayDuration={0}>
<div
style={
{
"--sidebar-width": SIDEBAR_WIDTH,
"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
...style,
} as React.CSSProperties
}
className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
ref={ref}
{...props}
>
{children}
</div>
</TooltipProvider>
</SidebarContext.Provider>
);
});
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef<
HTMLDivElement,
React.ComponentProps<"div"> & {
side?: "left" | "right";
variant?: "sidebar" | "floating" | "inset";
collapsible?: "offcanvas" | "icon" | "none";
}
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
if (collapsible === "none") {
return (
<div
className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)}
ref={ref}
{...props}
>
{children}
</div>
);
}
if (isMobile) {
return (
<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>

<SheetContent
data-sidebar="sidebar"
data-mobile="true"
className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
style={
{
"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
} as React.CSSProperties
}
side={side}
>
<div className="flex h-full w-full flex-col">{children}</div>
</SheetContent>
</Sheet>
);
}
return (
<div
ref={ref}
className="group peer hidden text-sidebar-foreground md:block"
data-state={state}
data-collapsible={state === "collapsed" ? collapsible : ""}
data-variant={variant}
data-side={side}
>
{/* This is what handles the sidebar gap on desktop */}
<div
className={cn(
"relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
"group-data-[collapsible=offcanvas]:w-0",
"group-data-[side=right]:rotate-180",
variant === "floating" || variant === "inset"
? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
: "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
)}
/>
<div
className={cn(
"fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear
md:flex",
side === "left"
? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
: "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
// Adjust the padding for floating and inset variants.
variant === "floating" || variant === "inset"
? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
: "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r
group-data-[side=right]:border-l",
className,
)}
{...props}
>
<div
data-sidebar="sidebar"
className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg
group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border
group-data-[variant=floating]:shadow"
>
{children}
</div>
</div>
</div>
);
});
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
({ className, onClick, ...props }, ref) => {
const { toggleSidebar } = useSidebar();
return (
<Button
ref={ref}
data-sidebar="trigger"
variant="ghost"
size="icon"
className={cn("h-7 w-7", className)}

onClick={(event) => {
onClick?.(event);
toggleSidebar();
}}
{...props}
>
<PanelLeft />
<span className="sr-only">Toggle Sidebar</span>
</Button>
);
},
);
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
({ className, ...props }, ref) => {
const { toggleSidebar } = useSidebar();
return (
<button
ref={ref}
data-sidebar="rail"
aria-label="Toggle Sidebar"
tabIndex={-1}
onClick={toggleSidebar}
title="Toggle Sidebar"
className={cn(
"absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0
after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border
sm:flex",
"[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize
[[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
"group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full
group-data-[collapsible=offcanvas]:hover:bg-sidebar",
"[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
"[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
className,
)}
{...props}
/>
);
},
);
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
return (
<main
ref={ref}
className={cn(
"relative flex min-h-svh flex-1 flex-col bg-background",
"peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2
md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0
md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
className,
)}
{...props}
/>
);
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
({ className, ...props }, ref) => {
return (
<Input
ref={ref}
data-sidebar="input"
className={cn(
"h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
className,
)}
{...props}
/>
);
},

… (file truncated for length — see source for full content)''',

    'src/components/ui/skeleton.tsx': '''import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
export { Skeleton };''',

    'src/components/ui/slider.tsx': '''import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
const Slider = React.forwardRef<
React.ElementRef<typeof SliderPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
<SliderPrimitive.Root
ref={ref}
className={cn("relative flex w-full touch-none select-none items-center", className)}
{...props}
>
<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
<SliderPrimitive.Range className="absolute h-full bg-primary" />
</SliderPrimitive.Track>
<SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background
ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };''',

    'src/components/ui/sonner.tsx': '''import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = ({ ...props }: ToasterProps) => {
const { theme = "system" } = useTheme();
return (
<Sonner
theme={theme as ToasterProps["theme"]}
className="toaster group"
toastOptions={{
classNames: {
toast:
"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border
group-[.toaster]:shadow-lg",
description: "group-[.toast]:text-muted-foreground",
actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
},
}}
{...props}
/>
);
};
export { Toaster, toast };''',

    'src/components/ui/switch.tsx': '''import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
const Switch = React.forwardRef<
React.ElementRef<typeof SwitchPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
<SwitchPrimitives.Root
className={cn(
"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent
transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
disabled:cursor-not-allowed disabled:opacity-50",
className,
)}
{...props}
ref={ref}
>
<SwitchPrimitives.Thumb
className={cn(
"pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform
data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
)}
/>
</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
export { Switch };''',

    'src/components/ui/table.tsx': '''import * as React from "react";
import { cn } from "@/lib/utils";
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
({ className, ...props }, ref) => (
<div className="relative w-full overflow-auto">
<table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
</div>
),
);
Table.displayName = "Table";
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
({ className, ...props }, ref) => (
<tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
),
);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
({ className, ...props }, ref) => (
<tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
),
);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
({ className, ...props }, ref) => (
<tr
ref={ref}
className={cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className)}
{...props}
/>
),
);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
({ className, ...props }, ref) => (
<th
ref={ref}
className={cn(
"h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
className,
)}
{...props}
/>
),
);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
({ className, ...props }, ref) => (
<td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
),
);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
({ className, ...props }, ref) => (
<caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
),
);
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };''',

    'src/components/ui/tabs.tsx': '''import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.List>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
<TabsPrimitive.List
ref={ref}
className={cn(
"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
className,
)}
{...props}
/>
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
<TabsPrimitive.Trigger
ref={ref}
className={cn(
"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground
data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
className,
)}
{...props}
/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
<TabsPrimitive.Content
ref={ref}
className={cn(
"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2",
className,
)}
{...props}
/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };''',

    'src/components/ui/textarea.tsx': '''import * as React from "react";
import { cn } from "@/lib/utils";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
return (
<textarea
className={cn(
"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className,
)}
ref={ref}
{...props}
/>
);
});
Textarea.displayName = "Textarea";
export { Textarea };''',

    'src/components/ui/toast.tsx': '''import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Viewport>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
<ToastPrimitives.Viewport
ref={ref}
className={cn(
"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col
md:max-w-[420px]",
className,
)}
{...props}
/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md
border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0
data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none
data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80
data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full
data-[state=open]:sm:slide-in-from-bottom-full",
{
variants: {
variant: {
default: "border bg-background text-foreground",
destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
},
},
defaultVariants: {
variant: "default",
},
},
);
const Toast = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Action>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
<ToastPrimitives.Action
ref={ref}
className={cn(
"inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium
ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary
group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive
group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring
focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
className,
)}
{...props}
/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Close>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (

<ToastPrimitives.Close
ref={ref}
className={cn(
"absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100
group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100
focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
className,
)}
toast-close=""
{...props}
>
<X className="h-4 w-4" />
</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Title>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
<ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Description>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
<ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;
export {
type ToastProps,
type ToastActionElement,
ToastProvider,
ToastViewport,
Toast,
ToastTitle,
ToastDescription,
ToastClose,
ToastAction,
};''',

    'src/components/ui/toaster.tsx': '''import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
export function Toaster() {
const { toasts } = useToast();
return (
<ToastProvider>
{toasts.map(function ({ id, title, description, action, ...props }) {
return (
<Toast key={id} {...props}>
<div className="grid gap-1">
{title && <ToastTitle>{title}</ToastTitle>}
{description && <ToastDescription>{description}</ToastDescription>}
</div>
{action}
<ToastClose />
</Toast>
);
})}
<ToastViewport />
</ToastProvider>
);
}''',

    'src/components/ui/toggle-group.tsx': '''import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
size: "default",
variant: "default",
});
const ToggleGroup = React.forwardRef<
React.ElementRef<typeof ToggleGroupPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
<ToggleGroupPrimitive.Root ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
<ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
</ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
const ToggleGroupItem = React.forwardRef<
React.ElementRef<typeof ToggleGroupPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
const context = React.useContext(ToggleGroupContext);
return (
<ToggleGroupPrimitive.Item
ref={ref}
className={cn(
toggleVariants({
variant: context.variant || variant,
size: context.size || size,
}),
className,
)}
{...props}
>
{children}
</ToggleGroupPrimitive.Item>
);
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
export { ToggleGroup, ToggleGroupItem };''',

    'src/components/ui/toggle.tsx': '''import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const toggleVariants = cva(
"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors
hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent
data-[state=on]:text-accent-foreground",
{
variants: {
variant: {
default: "bg-transparent",
outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
},
size: {
default: "h-10 px-3",
sm: "h-9 px-2.5",
lg: "h-11 px-5",
},
},
defaultVariants: {
variant: "default",
size: "default",
},
},
);
const Toggle = React.forwardRef<
React.ElementRef<typeof TogglePrimitive.Root>,
React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
<TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));
Toggle.displayName = TogglePrimitive.Root.displayName;
export { Toggle, toggleVariants };''',

    'src/components/ui/tooltip.tsx': '''import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
React.ElementRef<typeof TooltipPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
<TooltipPrimitive.Content
ref={ref}
sideOffset={sideOffset}
className={cn(
"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md
animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
className,
)}
{...props}
/>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };''',

    'src/components/ui/use-toast.ts': '''import { useToast, toast } from "@/hooks/use-toast";
export { useToast, toast };''',

    'src/hooks/use-mobile.tsx': '''import * as React from "react";
const MOBILE_BREAKPOINT = 768;
export function useIsMobile() {
const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
React.useEffect(() => {
const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
const onChange = () => {
setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
};
mql.addEventListener("change", onChange);
setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
return () => mql.removeEventListener("change", onChange);
}, []);
return !!isMobile;
}''',

    'src/hooks/use-toast.ts': '''import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
type ToasterToast = ToastProps & {
id: string;
title?: React.ReactNode;
description?: React.ReactNode;
action?: ToastActionElement;
};
const actionTypes = {
ADD_TOAST: "ADD_TOAST",
UPDATE_TOAST: "UPDATE_TOAST",
DISMISS_TOAST: "DISMISS_TOAST",
REMOVE_TOAST: "REMOVE_TOAST",
} as const;
let count = 0;
function genId() {
count = (count + 1) % Number.MAX_SAFE_INTEGER;
return count.toString();
}
type ActionType = typeof actionTypes;
type Action =
| {
type: ActionType["ADD_TOAST"];
toast: ToasterToast;
}
| {
type: ActionType["UPDATE_TOAST"];
toast: Partial<ToasterToast>;
}
| {
type: ActionType["DISMISS_TOAST"];
toastId?: ToasterToast["id"];
}
| {
type: ActionType["REMOVE_TOAST"];
toastId?: ToasterToast["id"];
};
interface State {
toasts: ToasterToast[];
}
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const addToRemoveQueue = (toastId: string) => {
if (toastTimeouts.has(toastId)) {
return;
}
const timeout = setTimeout(() => {
toastTimeouts.delete(toastId);
dispatch({
type: "REMOVE_TOAST",
toastId: toastId,
});
}, TOAST_REMOVE_DELAY);
toastTimeouts.set(toastId, timeout);
};
export const reducer = (state: State, action: Action): State => {
switch (action.type) {
case "ADD_TOAST":
return {
...state,
toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
};

case "UPDATE_TOAST":
return {
...state,
toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
};
case "DISMISS_TOAST": {
const { toastId } = action;
// ! Side effects ! - This could be extracted into a dismissToast() action,
// but I'll keep it here for simplicity
if (toastId) {
addToRemoveQueue(toastId);
} else {
state.toasts.forEach((toast) => {
addToRemoveQueue(toast.id);
});
}
return {
...state,
toasts: state.toasts.map((t) =>
t.id === toastId || toastId === undefined
? {
...t,
open: false,
}
: t,
),
};
}
case "REMOVE_TOAST":
if (action.toastId === undefined) {
return {
...state,
toasts: [],
};
}
return {
...state,
toasts: state.toasts.filter((t) => t.id !== action.toastId),
};
}
};
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };
function dispatch(action: Action) {
memoryState = reducer(memoryState, action);
listeners.forEach((listener) => {
listener(memoryState);
});
}
type Toast = Omit<ToasterToast, "id">;
function toast({ ...props }: Toast) {
const id = genId();
const update = (props: ToasterToast) =>
dispatch({
type: "UPDATE_TOAST",
toast: { ...props, id },
});
const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
dispatch({
type: "ADD_TOAST",
toast: {
...props,
id,
open: true,
onOpenChange: (open) => {
if (!open) dismiss();
},

},
});
return {
id: id,
dismiss,
update,
};
}
function useToast() {
const [state, setState] = React.useState<State>(memoryState);
React.useEffect(() => {
listeners.push(setState);
return () => {
const index = listeners.indexOf(setState);
if (index > -1) {
listeners.splice(index, 1);
}
};
}, [state]);
return {
...state,
toast,
dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
};
}
export { useToast, toast };''',

    'src/index.css': '''@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
:root {
--background: 228 45% 7%;
--foreground: 0 0% 100%;
--card: 228 35% 10%;
--card-foreground: 0 0% 100%;
--popover: 228 35% 10%;
--popover-foreground: 0 0% 100%;
--primary: 263 84% 58%;
--primary-foreground: 0 0% 100%;
--secondary: 228 30% 14%;
--secondary-foreground: 220 15% 65%;
--muted: 228 25% 16%;
--muted-foreground: 220 15% 55%;
--accent: 187 94% 43%;
--accent-foreground: 228 45% 7%;
--destructive: 0 84% 60%;
--destructive-foreground: 0 0% 100%;
--border: 0 0% 100% / 0.08;
--input: 0 0% 100% / 0.08;
--ring: 263 84% 58%;
--radius: 0.75rem;
/* Custom tokens */
--glass-bg: 0 0% 100% / 0.05;
--glass-border: 0 0% 100% / 0.1;
--glow-primary: 0 0 30px rgba(124, 58, 237, 0.4);
--glow-accent: 0 0 30px rgba(6, 182, 212, 0.3);
--gradient-primary: linear-gradient(135deg, #7C3AED, #06B6D4);
--gradient-violet: linear-gradient(135deg, #7C3AED, #A855F7);
--gradient-surface: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
/* Level colors */
--level-a1: 220 10% 50%;
--level-a2: 217 91% 60%;
--level-b1: 142 71% 45%;
--level-b2: 25 95% 53%;
--level-c1: 0 84% 60%;
--level-c2: 263 84% 58%;
--sidebar-background: 228 35% 8%;
--sidebar-foreground: 0 0% 90%;
--sidebar-primary: 263 84% 58%;
--sidebar-primary-foreground: 0 0% 100%;
--sidebar-accent: 228 25% 14%;
--sidebar-accent-foreground: 0 0% 90%;
--sidebar-border: 0 0% 100% / 0.06;
--sidebar-ring: 263 84% 58%;
}
}
@layer base {
* {
@apply border-border;
}
body {
@apply bg-background text-foreground font-sans antialiased;
font-family: 'Plus Jakarta Sans', sans-serif;
}
}
@layer components {
.glass-panel {
@apply backdrop-blur-xl rounded-xl;

background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
}
.glass-panel-strong {
@apply backdrop-blur-2xl rounded-xl;
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.12);
}
.gradient-text {
@apply bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#06B6D4];
}
.gradient-border {
@apply relative;
background: linear-gradient(var(--card), var(--card)) padding-box,
linear-gradient(135deg, #7C3AED, #06B6D4) border-box;
border: 1px solid transparent;
}
.glow-primary {
box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
}
.glow-accent {
box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}
.glow-primary-lg {
box-shadow: 0 0 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(124, 58, 237, 0.1);
}
}
@layer utilities {
.text-balance {
text-wrap: balance;
}
}
/* Flame animation */
@keyframes flame-flicker {
0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
25% { transform: scaleY(1.1) scaleX(0.95); opacity: 0.9; }
50% { transform: scaleY(0.95) scaleX(1.05); opacity: 1; }
75% { transform: scaleY(1.05) scaleX(0.98); opacity: 0.85; }
}
.animate-flame {
animation: flame-flicker 0.6s ease-in-out infinite;
}
/* Pulse live indicator */
@keyframes live-pulse {
0%, 100% { opacity: 1; transform: scale(1); }
50% { opacity: 0.5; transform: scale(1.5); }
}
.animate-live-pulse {
animation: live-pulse 1.5s ease-in-out infinite;
}
/* Waveform bars */
@keyframes waveform {
0%, 100% { height: 4px; }
50% { height: 16px; }
}
.animate-waveform {
animation: waveform 0.6s ease-in-out infinite;
}
/* Shimmer skeleton */
@keyframes shimmer {
0% { background-position: -200% 0; }
100% { background-position: 200% 0; }
}
.skeleton-shimmer {
background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04)
75%);
background-size: 200% 100%;
animation: shimmer 1.5s ease-in-out infinite;
}
/* Gradient border animation */
@keyframes gradient-rotate {
0% { --angle: 0deg; }

100% { --angle: 360deg; }
}
/* Scrollbar */
::-webkit-scrollbar {
width: 6px;
}
::-webkit-scrollbar-track {
background: transparent;
}
::-webkit-scrollbar-thumb {
background: rgba(255, 255, 255, 0.1);
border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
background: rgba(255, 255, 255, 0.2);
}''',

    'src/lib/mock-data.ts': '''import type { UserProfile, VoiceRoom } from "./types";
const diceBearUrl = (seed: string) =>
`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
export const mockUsers: UserProfile[] = [
{
id: "1", username: "luna_speaks", full_name: "Luna Martinez",
avatar_url: diceBearUrl("luna"), english_level: "C2", streak_count: 47,
xp_points: 12400, native_language: "Spanish", bio: "Language enthusiast & polyglot", is_online: true,
},
{
id: "2", username: "kai_english", full_name: "Kai Tanaka",
avatar_url: diceBearUrl("kai"), english_level: "B2", streak_count: 12,
xp_points: 3200, native_language: "Japanese", bio: "Preparing for IELTS", is_online: true,
},
{
id: "3", username: "sofia_words", full_name: "Sofia Andersson",
avatar_url: diceBearUrl("sofia"), english_level: "C1", streak_count: 31,
xp_points: 8900, native_language: "Swedish", bio: "Business English focused", is_online: false,
},
{
id: "4", username: "alex_flow", full_name: "Alex Kim",
avatar_url: diceBearUrl("alex"), english_level: "B1", streak_count: 5,
xp_points: 1100, native_language: "Korean", bio: "Just getting started!", is_online: true,
},
{
id: "5", username: "priya_talks", full_name: "Priya Sharma",
avatar_url: diceBearUrl("priya"), english_level: "A2", streak_count: 3,
xp_points: 450, native_language: "Hindi", bio: "Learning every day", is_online: true,
},
{
id: "6", username: "marco_chat", full_name: "Marco Rossi",
avatar_url: diceBearUrl("marco"), english_level: "B2", streak_count: 22,
xp_points: 5600, native_language: "Italian", bio: "Love debating topics", is_online: false,
},
];
export const mockRooms: VoiceRoom[] = [
{
id: "r1", name: "Morning Coffee Chat", topic_tags: ["Casual", "Daily Life"],
host: mockUsers[0], participants: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[4]],
max_capacity: 8, current_count: 4, is_live: true, language_focus: "General",
created_at: new Date().toISOString(),
},
{
id: "r2", name: "IELTS Speaking Practice", topic_tags: ["Exam Prep", "IELTS"],
host: mockUsers[2], participants: [mockUsers[2], mockUsers[1]],
max_capacity: 6, current_count: 2, is_live: true, language_focus: "Exam",
created_at: new Date().toISOString(),
},
{
id: "r3", name: "Business Negotiations 101", topic_tags: ["Business", "Professional"],
host: mockUsers[5], participants: [mockUsers[5], mockUsers[2], mockUsers[0]],
max_capacity: 8, current_count: 3, is_live: false, language_focus: "Business",
created_at: new Date().toISOString(),
},
{
id: "r4", name: "Gaming in English", topic_tags: ["Gaming", "Fun"],
host: mockUsers[3], participants: [mockUsers[3], mockUsers[4]],
max_capacity: 8, current_count: 2, is_live: true, language_focus: "Gaming",
created_at: new Date().toISOString(),
},
];''',

    'src/lib/types.ts': '''export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type RoomCategory = "General" | "Business" | "Exam" | "Gaming";
export interface UserProfile {
id: string;
username: string;
full_name: string;
avatar_url: string;
english_level: EnglishLevel;
streak_count: number;
xp_points: number;
native_language: string;
bio: string;
is_online: boolean;
}
export interface VoiceRoom {
id: string;
name: string;
topic_tags: string[];
host: UserProfile;
participants: UserProfile[];
max_capacity: number;
current_count: number;
is_live: boolean;
language_focus: RoomCategory;
created_at: string;
}''',

    'src/lib/utils.ts': '''import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs));
}''',

    'src/main.tsx': '''import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
createRoot(document.getElementById("root")!).render(<App />);''',

    'src/pages/CommunityPage.tsx': '''import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark,
TrendingUp, Clock, Flame, Pin, Send, ChevronDown, ChevronUp
} from "lucide-react";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockUsers } from "@/lib/mock-data";
import type { UserProfile } from "@/lib/types";
import { LevelBadge } from "@/components/LevelBadge";
interface Reply {
id: string;
author: UserProfile;
content: string;
upvotes: number;
created_at: string;
}
interface Post {
id: string;
author: UserProfile;
title: string;
content: string;
topic: string;
upvotes: number;
replies: Reply[];
isPinned: boolean;
created_at: string;
}
const mockPosts: Post[] = [
{
id: "p1",
author: mockUsers[0],
title: "Best resources for improving pronunciation?",
content: "I have been working on my pronunciation for a while now. My native language is Spanish and I struggle with
the 'th' sound. Does anyone have recommendations for good YouTube channels or apps that focus specifically on
pronunciation drills? I have tried Forvo but looking for something more structured.",
topic: "Learning Tips",
upvotes: 47,
isPinned: true,
created_at: "2h ago",
replies: [
{ id: "r1", author: mockUsers[2], content: "Rachel's English on YouTube is amazing for American pronunciation. She
breaks down mouth positioning for every sound.", upvotes: 23, created_at: "1h ago" },
{ id: "r2", author: mockUsers[1], content: "I had the same issue with Japanese. What helped me was recording myself
and comparing with native speakers. Try Elsa Speak app!", upvotes: 15, created_at: "45m ago" },
{ id: "r3", author: mockUsers[4], content: "Practice tongue twisters! 'The thirty-three thieves thought that they
thrilled the throne throughout Thursday.' Really helped me.", upvotes: 8, created_at: "30m ago" },
],
},
{
id: "p2",
author: mockUsers[2],
title: "IELTS Band 8 - My preparation strategy",
content: "Just got my results back and scored Band 8 overall! Here is what worked for me: I practiced speaking with
native speakers daily (this app helped a lot), read academic articles from The Economist, and took mock tests every
weekend. Happy to answer any questions about the exam structure.",
topic: "Exam Prep",
upvotes: 89,
isPinned: false,
created_at: "5h ago",
replies: [
{ id: "r4", author: mockUsers[3], content: "Congratulations! How long did you prepare? I am aiming for Band 7 and
feeling nervous.", upvotes: 12, created_at: "4h ago" },
{ id: "r5", author: mockUsers[5], content: "What was your writing strategy? That is my weakest section.", upvotes:
9, created_at: "3h ago" },
],
},
{
id: "p3",
author: mockUsers[3],
title: "Daily vocabulary challenge - Week 12",
content: "This week's theme: Business idioms! Try using these in your next conversation:\\n\\n1. 'Cut corners' - to do
something in the cheapest way\\n2. 'The bottom line' - the most important fact\\n3. 'Get the ball rolling' - to start

something\\n4. 'Think outside the box' - to think creatively\\n5. 'Bring to the table' - to contribute something\\n\\nDrop a
sentence using any of these below!",
topic: "Vocabulary",
upvotes: 34,
isPinned: false,
created_at: "8h ago",
replies: [
{ id: "r6", author: mockUsers[0], content: "Let us get the ball rolling on this project! - I use this one all the
time at work.", upvotes: 6, created_at: "7h ago" },
],
},
{
id: "p4",
author: mockUsers[5],
title: "Debate topic: Is AI making language learning easier or lazier?",
content: "With tools like ChatGPT and translation apps becoming so advanced, do you think learners are becoming more
dependent on technology? On one hand, AI provides instant feedback. On the other, some argue it reduces the motivation to
truly internalize the language. What are your thoughts?",
topic: "Discussion",
upvotes: 56,
isPinned: false,
created_at: "12h ago",
replies: [
{ id: "r7", author: mockUsers[2], content: "I think AI is a great supplement but nothing replaces actual human
conversation. That is why platforms like this are so valuable.", upvotes: 19, created_at: "11h ago" },
{ id: "r8", author: mockUsers[1], content: "AI helped me understand grammar rules faster, but I only improved
fluency by talking to real people.", upvotes: 14, created_at: "10h ago" },
{ id: "r9", author: mockUsers[4], content: "The danger is when people use AI to write everything for them instead
of practicing themselves.", upvotes: 11, created_at: "9h ago" },
],
},
];
const topicColors: Record<string, string> = {
"Learning Tips": "bg-blue-500/15 text-blue-300",
"Exam Prep": "bg-amber-500/15 text-amber-300",
"Vocabulary": "bg-green-500/15 text-green-300",
"Discussion": "bg-purple-500/15 text-purple-300",
"Grammar": "bg-red-500/15 text-red-300",
};
const sortOptions = [
{ icon: TrendingUp, label: "Trending" },
{ icon: Clock, label: "New" },
{ icon: Flame, label: "Top" },
];
export default function CommunityPage() {
const [activeSort, setActiveSort] = useState("Trending");
const [expandedPost, setExpandedPost] = useState<string | null>(null);
const [newComment, setNewComment] = useState("");
const [votes, setVotes] = useState<Record<string, number>>({});
const handleVote = (id: string, delta: number) => {
setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta }));
};
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex-1">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">Community</h1>
<p className="text-xs text-muted-foreground mt-0.5">Discuss, share tips, and learn together</p>
</div>
<motion.button
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.95 }}
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent
text-primary-foreground text-sm font-semibold glow-primary"
>
<Send className="h-4 w-4" />
New Post
</motion.button>
</div>

{/* Sort tabs */}
<div className="flex items-center gap-2 mt-3">
{sortOptions.map((opt) => (
<button
key={opt.label}
onClick={() => setActiveSort(opt.label)}
className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
${activeSort === opt.label
? "bg-primary/15 text-primary"
: "text-muted-foreground hover:bg-white/5 hover:text-foreground"
}`}
>
<opt.icon className="h-3.5 w-3.5" />
{opt.label}
</button>
))}
</div>
</header>
<div className="p-4 md:p-6 pb-24 md:pb-6 max-w-3xl mx-auto space-y-3">
{mockPosts.map((post, i) => {
const isExpanded = expandedPost === post.id;
const voteOffset = votes[post.id] ?? 0;
return (
<motion.article
key={post.id}
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
className="glass-panel overflow-hidden"
>
<div className="flex">
{/* Vote column */}
<div className="flex flex-col items-center py-4 px-3 gap-1 border-r border-white/5">
<motion.button
whileTap={{ scale: 0.8 }}
onClick={() => handleVote(post.id, 1)}
className={`p-0.5 rounded transition-colors ${voteOffset > 0 ? "text-primary" :
"text-muted-foreground hover:text-primary"}`}
>
<ArrowBigUp className="h-5 w-5" />
</motion.button>
<span className="text-xs font-bold text-foreground">{post.upvotes + voteOffset}</span>
<motion.button
whileTap={{ scale: 0.8 }}
onClick={() => handleVote(post.id, -1)}
className={`p-0.5 rounded transition-colors ${voteOffset < 0 ? "text-destructive" :
"text-muted-foreground hover:text-destructive"}`}
>
<ArrowBigDown className="h-5 w-5" />
</motion.button>
</div>
{/* Content */}
<div className="flex-1 p-4">
{/* Post header */}
<div className="flex items-center gap-2 mb-2 flex-wrap">
{post.isPinned && (
<span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider
text-amber-400">
<Pin className="h-3 w-3" /> Pinned
</span>
)}
<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${topicColors[post.topic] ??
"bg-white/10 text-muted-foreground"}`}>
{post.topic}
</span>
<div className="flex items-center gap-1.5">
<img src={post.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
<span className="text-[10px] text-muted-foreground">@{post.author.username}</span>
<LevelBadge level={post.author.english_level} />
</div>
<span className="text-[10px] text-muted-foreground/60">{post.created_at}</span>
</div>
{/* Title & content */}
<h3 className="text-sm font-bold text-foreground mb-1.5">{post.title}</h3>

<p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{post.content}</p>
{/* Actions bar */}
<div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
<button
onClick={() => setExpandedPost(isExpanded ? null : post.id)}
className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground
hover:text-foreground transition-colors"
>
<MessageSquare className="h-3.5 w-3.5" />
{post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
{isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
</button>
<button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground
transition-colors">
<Share2 className="h-3.5 w-3.5" /> Share
</button>
<button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground
transition-colors">
<Bookmark className="h-3.5 w-3.5" /> Save
</button>
</div>
{/* Replies */}
<AnimatePresence>
{isExpanded && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.2 }}
className="overflow-hidden"
>
<div className="mt-3 space-y-2 pl-3 border-l-2 border-primary/20">
{post.replies.map((reply, ri) => (
<motion.div
key={reply.id}
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: ri * 0.05 }}
className="bg-white/[0.03] rounded-lg p-3"
>
<div className="flex items-center gap-1.5 mb-1">
<img src={reply.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
<span className="text-[10px] font-semibold
text-foreground">@{reply.author.username}</span>
<LevelBadge level={reply.author.english_level} />
<span className="text-[10px] text-muted-foreground/60
ml-auto">{reply.created_at}</span>
</div>
<p className="text-xs text-foreground/80">{reply.content}</p>
<div className="flex items-center gap-1 mt-1.5">
<ArrowBigUp className="h-3.5 w-3.5 text-muted-foreground hover:text-primary
cursor-pointer transition-colors" />
<span className="text-[10px] font-semibold
text-muted-foreground">{reply.upvotes}</span>
</div>
</motion.div>
))}
{/* Reply input */}
<div className="flex items-center gap-2 pt-2">
<input
value={newComment}
onChange={(e) => setNewComment(e.target.value)}
placeholder="Write a reply..."
className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs
text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
/>
<motion.button
whileTap={{ scale: 0.9 }}
className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center
justify-center hover:bg-primary/30 transition-colors"
>
<Send className="h-3.5 w-3.5" />
</motion.button>
</div>
</div>

</motion.div>
)}
</AnimatePresence>
</div>
</div>
</motion.article>
);
})}
</div>
</main>
<BottomNav />
</div>
);
}''',

    'src/pages/ExplorePage.tsx': '''import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Flame, Star, Clock, Filter } from "lucide-react";
import { RoomCard } from "@/components/RoomCard";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockRooms, mockUsers } from "@/lib/mock-data";
import { LevelBadge } from "@/components/LevelBadge";
import type { RoomCategory } from "@/lib/types";
const categories: { label: string; value: RoomCategory | "All"; icon: typeof TrendingUp; desc: string }[] = [
{ label: "All Rooms", value: "All", icon: Star, desc: "Browse everything" },
{ label: "General", value: "General", icon: TrendingUp, desc: "Casual conversation" },
{ label: "Business", value: "Business", icon: Filter, desc: "Professional English" },
{ label: "Exam Prep", value: "Exam", icon: Clock, desc: "IELTS, TOEFL, Cambridge" },
{ label: "Gaming", value: "Gaming", icon: Flame, desc: "Play and talk" },
];
export default function ExplorePage() {
const [activeCategory, setActiveCategory] = useState<RoomCategory | "All">("All");
const [search, setSearch] = useState("");
const filteredRooms = mockRooms.filter((r) => {
if (activeCategory !== "All" && r.language_focus !== activeCategory) return false;
if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
return true;
});
// Featured speakers
const topSpeakers = mockUsers.filter((u) => u.xp_points > 3000).slice(0, 4);
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex-1">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">Explore</h1>
<p className="text-xs text-muted-foreground mt-0.5">Discover rooms, speakers, and topics</p>
</div>
<div className="relative hidden sm:block w-72">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search rooms, topics, people..."
className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground
placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
/>
</div>
</div>
</header>
<div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6">
{/* Category cards */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
{categories.map((cat, i) => (
<motion.button
key={cat.value}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.06 }}
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
onClick={() => setActiveCategory(cat.value)}
className={`glass-panel p-4 text-left transition-all ${
activeCategory === cat.value ? "border-primary/40 glow-primary" : "hover:border-white/20"
}`}
>
<div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
activeCategory === cat.value
? "bg-gradient-to-br from-primary to-accent"
: "bg-white/5"
}`}>
<cat.icon className={`h-4 w-4 ${activeCategory === cat.value ? "text-primary-foreground" :

"text-muted-foreground"}`} />
</div>
<p className="text-xs font-bold text-foreground">{cat.label}</p>
<p className="text-[10px] text-muted-foreground mt-0.5">{cat.desc}</p>
</motion.button>
))}
</div>
{/* Top Speakers */}
<div>
<h2 className="text-sm font-bold tracking-tight text-foreground mb-3">Top Speakers</h2>
<div className="flex gap-3 overflow-x-auto pb-2">
{topSpeakers.map((speaker, i) => (
<motion.div
key={speaker.id}
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: i * 0.08 }}
className="glass-panel p-4 flex flex-col items-center gap-2 min-w-[140px] flex-shrink-0"
>
<div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
<img src={speaker.avatar_url} alt={speaker.full_name} className="w-full h-full rounded-full bg-card"
/>
</div>
<p className="text-xs font-semibold text-foreground text-center">{speaker.full_name}</p>
<LevelBadge level={speaker.english_level} />
<p className="text-[10px] text-muted-foreground">{speaker.xp_points.toLocaleString()} XP</p>
</motion.div>
))}
</div>
</div>
{/* Rooms */}
<div>
<h2 className="text-sm font-bold tracking-tight text-foreground mb-3">
{activeCategory === "All" ? "All Rooms" : `${activeCategory} Rooms`}
<span className="text-muted-foreground ml-2 font-normal">({filteredRooms.length})</span>
</h2>
<AnimatePresence mode="popLayout">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
{filteredRooms.map((room, i) => (
<RoomCard key={room.id} room={room} index={i} />
))}
</div>
</AnimatePresence>
{filteredRooms.length === 0 && (
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
<div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center">
<Search className="h-6 w-6 text-muted-foreground" />
</div>
<p className="text-sm font-semibold text-foreground">No rooms found</p>
<p className="text-xs text-muted-foreground mt-1">Try a different category or search term</p>
</motion.div>
)}
</div>
</div>
</main>
<BottomNav />
</div>
);
}''',

    'src/pages/GamesPage.tsx': '''import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Grid3X3, RotateCcw, Trophy, Star } from "lucide-react";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
type GameTab = "tictactoe" | "sudoku";
type CellValue = "X" | "O" | null;
// ■■■ Tic-Tac-Toe ■■■
function TicTacToe() {
const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
const [isXNext, setIsXNext] = useState(true);
const [scores, setScores] = useState({ X: 0, O: 0 });
const winner = calculateWinner(board);
const isDraw = !winner && board.every(Boolean);
const handleClick = (i: number) => {
if (board[i] || winner) return;
const next = [...board];
next[i] = isXNext ? "X" : "O";
setBoard(next);
setIsXNext(!isXNext);
const w = calculateWinner(next);
if (w) setScores((s) => ({ ...s, [w]: s[w as keyof typeof s] + 1 }));
};
const reset = () => {
setBoard(Array(9).fill(null));
setIsXNext(true);
};
return (
<div className="flex flex-col items-center gap-6">
{/* Scoreboard */}
<div className="flex items-center gap-8">
<div className={`text-center px-4 py-2 rounded-lg ${isXNext && !winner ? "bg-primary/15 ring-1 ring-primary/30"
: "bg-white/5"}`}>
<p className="text-lg font-extrabold gradient-text">X</p>
<p className="text-xs text-muted-foreground">{scores.X} wins</p>
</div>
<div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">VS</div>
<div className={`text-center px-4 py-2 rounded-lg ${!isXNext && !winner ? "bg-accent/15 ring-1 ring-accent/30" :
"bg-white/5"}`}>
<p className="text-lg font-extrabold text-accent">O</p>
<p className="text-xs text-muted-foreground">{scores.O} wins</p>
</div>
</div>
{/* Status */}
<div className="text-sm font-semibold text-foreground">
{winner ? (
<span className="gradient-text">Player {winner} wins!</span>
) : isDraw ? (
<span className="text-muted-foreground">It is a draw!</span>
) : (
<span>Player <span className={isXNext ? "text-primary" : "text-accent"}>{isXNext ? "X" : "O"}</span>
turn</span>
)}
</div>
{/* Board */}
<div className="grid grid-cols-3 gap-2">
{board.map((cell, i) => {
const winLine = winner ? getWinningLine(board) : null;
const isWinCell = winLine?.includes(i);
return (
<motion.button
key={i}
whileHover={!cell && !winner ? { scale: 1.05 } : {}}
whileTap={!cell && !winner ? { scale: 0.9 } : {}}
onClick={() => handleClick(i)}
className={`w-20 h-20 rounded-xl text-2xl font-extrabold flex items-center justify-center transition-all
${isWinCell ? "bg-primary/20 ring-2 ring-primary glow-primary" : "glass-panel hover:bg-white/10"}
${cell === "X" ? "text-primary" : cell === "O" ? "text-accent" : "text-transparent"}`}
>

{cell && (
<motion.span
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ type: "spring", bounce: 0.5 }}
>
{cell}
</motion.span>
)}
</motion.button>
);
})}
</div>
{/* Reset */}
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={reset}
className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-xs font-semibold text-muted-foreground
hover:text-foreground hover:bg-white/10 transition-all"
>
<RotateCcw className="h-3.5 w-3.5" />
New Game
</motion.button>
</div>
);
}
function calculateWinner(board: CellValue[]): CellValue {
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
for (const [a, b, c] of lines) {
if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
}
return null;
}
function getWinningLine(board: CellValue[]): number[] | null {
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
for (const line of lines) {
const [a, b, c] = line;
if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
}
return null;
}
// ■■■ Sudoku ■■■
const easySudoku = [
[5,3,0,0,7,0,0,0,0],
[6,0,0,1,9,5,0,0,0],
[0,9,8,0,0,0,0,6,0],
[8,0,0,0,6,0,0,0,3],
[4,0,0,8,0,3,0,0,1],
[7,0,0,0,2,0,0,0,6],
[0,6,0,0,0,0,2,8,0],
[0,0,0,4,1,9,0,0,5],
[0,0,0,0,8,0,0,7,9],
];
const sudokuSolution = [
[5,3,4,6,7,8,9,1,2],
[6,7,2,1,9,5,3,4,8],
[1,9,8,3,4,2,5,6,7],
[8,5,9,7,6,1,4,2,3],
[4,2,6,8,5,3,7,9,1],
[7,1,3,9,2,4,8,5,6],
[9,6,1,5,3,7,2,8,4],
[2,8,7,4,1,9,6,3,5],
[3,4,5,2,8,6,1,7,9],
];
function Sudoku() {
const [grid, setGrid] = useState<number[][]>(easySudoku.map((r) => [...r]));
const [selected, setSelected] = useState<[number, number] | null>(null);
const [errors, setErrors] = useState<Set<string>>(new Set());
const [shakeCell, setShakeCell] = useState<string | null>(null);
const isOriginal = (r: number, c: number) => easySudoku[r][c] !== 0;

const handleCellClick = (r: number, c: number) => {
if (isOriginal(r, c)) return;
setSelected([r, c]);
};
const handleNumberInput = (num: number) => {
if (!selected) return;
const [r, c] = selected;
if (isOriginal(r, c)) return;
const newGrid = grid.map((row) => [...row]);
newGrid[r][c] = num;
setGrid(newGrid);
// Check against solution
if (num !== 0 && num !== sudokuSolution[r][c]) {
const key = `${r}-${c}`;
setErrors((prev) => new Set([...prev, key]));
setShakeCell(key);
setTimeout(() => setShakeCell(null), 500);
} else {
setErrors((prev) => {
const next = new Set(prev);
next.delete(`${r}-${c}`);
return next;
});
}
};
const reset = () => {
setGrid(easySudoku.map((r) => [...r]));
setSelected(null);
setErrors(new Set());
};
const isSolved = grid.every((row, r) => row.every((cell, c) => cell === sudokuSolution[r][c]));
return (
<div className="flex flex-col items-center gap-5">
{isSolved && (
<motion.div
initial={{ scale: 0 }}
animate={{ scale: 1 }}
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 text-green-400 text-sm font-bold"
>
<Trophy className="h-4 w-4" /> Puzzle Solved!
</motion.div>
)}
{/* Grid */}
<div className="grid grid-cols-9 gap-0 rounded-xl overflow-hidden border border-white/10">
{grid.map((row, r) =>
row.map((cell, c) => {
const isSelected = selected?.[0] === r && selected?.[1] === c;
const isSameRow = selected?.[0] === r;
const isSameCol = selected?.[1] === c;
const isHighlighted = isSameRow || isSameCol;
const isError = errors.has(`${r}-${c}`);
const isShaking = shakeCell === `${r}-${c}`;
const borderR = (c + 1) % 3 === 0 && c < 8 ? "border-r border-white/20" : "border-r border-white/5";
const borderB = (r + 1) % 3 === 0 && r < 8 ? "border-b border-white/20" : "border-b border-white/5";
return (
<motion.button
key={`${r}-${c}`}
animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : {}}
transition={{ duration: 0.4 }}
onClick={() => handleCellClick(r, c)}
className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-sm font-bold transition-all
${borderR} ${borderB}
${isSelected ? "bg-primary/20 ring-1 ring-primary/50" : isHighlighted ? "bg-white/[0.03]" :
"bg-transparent"}
${isOriginal(r, c) ? "text-foreground" : isError ? "text-destructive" : "text-accent"}
${!isOriginal(r, c) ? "cursor-pointer hover:bg-white/5" : "cursor-default"}
`}
>
{cell !== 0 ? cell : ""}

</motion.button>
);
})
)}
</div>
{/* Number pad */}
<div className="flex gap-2">
{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
<motion.button
key={num}
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
onClick={() => handleNumberInput(num)}
className="w-9 h-9 rounded-lg bg-white/5 text-sm font-bold text-foreground hover:bg-primary/20
hover:text-primary transition-all"
>
{num}
</motion.button>
))}
<motion.button
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
onClick={() => handleNumberInput(0)}
className="w-9 h-9 rounded-lg bg-white/5 text-xs font-bold text-muted-foreground hover:bg-destructive/20
hover:text-destructive transition-all"
>
CLR
</motion.button>
</div>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={reset}
className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-xs font-semibold text-muted-foreground
hover:text-foreground hover:bg-white/10 transition-all"
>
<RotateCcw className="h-3.5 w-3.5" />
Reset Puzzle
</motion.button>
</div>
);
}
// ■■■ Games Page ■■■
export default function GamesPage() {
const [activeGame, setActiveGame] = useState<GameTab>("tictactoe");
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<div className="flex-1">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">Games</h1>
<p className="text-xs text-muted-foreground mt-0.5">Play while you practice English</p>
</div>
</header>
<div className="p-4 md:p-6 pb-24 md:pb-6">
{/* Game selector */}
<div className="flex gap-3 mb-8">
{([
{ id: "tictactoe" as GameTab, icon: Grid3X3, label: "Tic-Tac-Toe", desc: "Classic 2-player" },
{ id: "sudoku" as GameTab, icon: Gamepad2, label: "Sudoku", desc: "Logic puzzle" },
]).map((game) => (
<motion.button
key={game.id}
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.97 }}
onClick={() => setActiveGame(game.id)}
className={`glass-panel p-4 flex items-center gap-3 transition-all flex-1
${activeGame === game.id ? "border-primary/40 glow-primary" : "hover:border-white/20"}`}

… (file truncated for length — see source for full content)''',

    'src/pages/HallwayPage.tsx': '''import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, TrendingUp, Filter } from "lucide-react";
import { RoomCard } from "@/components/RoomCard";
import { FriendsSidebar } from "@/components/FriendsSidebar";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockRooms, mockUsers } from "@/lib/mock-data";
import type { RoomCategory } from "@/lib/types";
const filters: (RoomCategory | "All")[] = ["All", "General", "Business", "Exam", "Gaming"];
export default function HallwayPage() {
const [activeFilter, setActiveFilter] = useState<RoomCategory | "All">("All");
const [search, setSearch] = useState("");
const filteredRooms = mockRooms.filter((r) => {
if (activeFilter !== "All" && r.language_focus !== activeFilter) return false;
if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
return true;
});
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
{/* Header */}
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex-1">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">The Hallway</h1>
<p className="text-xs text-muted-foreground mt-0.5">Discover live conversations</p>
</div>
<div className="relative hidden sm:block w-64">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search rooms..."
className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground
placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30
transition-all"
/>
</div>
</div>
{/* Filter tabs */}
<div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
{filters.map((f) => (
<motion.button
key={f}
whileTap={{ scale: 0.95 }}
onClick={() => setActiveFilter(f)}
className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all
${activeFilter === f
? "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
: "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
}`}
>
{f}
</motion.button>
))}
</div>
</header>
{/* Room grid */}
<div className="p-4 md:p-6 pb-24 md:pb-6">
<div className="flex items-center gap-2 mb-4">
<TrendingUp className="h-4 w-4 text-primary" />
<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
{filteredRooms.filter(r => r.is_live).length} Live Now
</span>
</div>
<AnimatePresence mode="popLayout">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

{filteredRooms.map((room, i) => (
<RoomCard key={room.id} room={room} index={i} />
))}
</div>
</AnimatePresence>
{filteredRooms.length === 0 && (
<motion.div
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
className="text-center py-20"
>
<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
<Search className="h-7 w-7 text-muted-foreground" />
</div>
<p className="text-sm font-semibold text-foreground">No rooms found</p>
<p className="text-xs text-muted-foreground mt-1">Try a different filter or create your own room</p>
</motion.div>
)}
</div>
</main>
{/* Friends sidebar - desktop only */}
<div className="hidden xl:block">
<div className="sticky top-0 h-screen">
<FriendsSidebar friends={mockUsers} />
</div>
</div>
{/* FAB */}
<motion.button
whileHover={{ scale: 1.1, rotate: 90 }}
whileTap={{ scale: 0.9 }}
className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary
to-accent flex items-center justify-center glow-primary-lg"
>
<Plus className="h-6 w-6 text-primary-foreground" />
</motion.button>
<BottomNav />
</div>
);
}''',

    'src/pages/HomePage.tsx': '''import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";
import { RoomCard } from "@/components/RoomCard";
import { FriendsSidebar } from "@/components/FriendsSidebar";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockRooms, mockUsers } from "@/lib/mock-data";
import type { RoomCategory } from "@/lib/types";
import { ProfileCard } from "@/components/ProfileCard";
const filters: (RoomCategory | "All")[] = ["All", "General", "Business", "Exam", "Gaming"];
export default function HomePage() {
const [activeFilter, setActiveFilter] = useState<RoomCategory | "All">("All");
const currentUser = mockUsers[0];
const liveRooms = mockRooms.filter((r) => {
if (!r.is_live) return false;
if (activeFilter !== "All" && r.language_focus !== activeFilter) return false;
return true;
});
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
{/* Header */}
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">Welcome back,
{currentUser.full_name.split(" ")[0]}</h1>
<p className="text-xs text-muted-foreground mt-0.5">Here is what is happening right now</p>
</header>
<div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6">
{/* Your profile summary */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="lg:col-span-1">
<ProfileCard user={currentUser} />
</div>
<div className="lg:col-span-2 space-y-4">
{/* Quick stats */}
<div className="grid grid-cols-3 gap-3">
{[
{ label: "Rooms Today", value: "3", color: "from-primary/20 to-primary/5" },
{ label: "Words Spoken", value: "842", color: "from-accent/20 to-accent/5" },
{ label: "XP Earned", value: "+250", color: "from-green-500/20 to-green-500/5" },
].map((stat, i) => (
<motion.div
key={stat.label}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.1 }}
className={`glass-panel p-4 bg-gradient-to-br ${stat.color}`}
>
<p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
<p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold
mt-1">{stat.label}</p>
</motion.div>
))}
</div>
{/* Live now */}
<div>
<div className="flex items-center gap-2 mb-3">
<TrendingUp className="h-4 w-4 text-primary" />
<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
{liveRooms.length} Live Now
</span>
<div className="flex gap-2 ml-auto">
{filters.map((f) => (
<button
key={f}
onClick={() => setActiveFilter(f)}
className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all
${activeFilter === f

? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
: "bg-white/5 text-muted-foreground hover:bg-white/10"
}`}
>
{f}
</button>
))}
</div>
</div>
<AnimatePresence mode="popLayout">
<div className="space-y-3">
{liveRooms.map((room, i) => (
<RoomCard key={room.id} room={room} index={i} />
))}
</div>
</AnimatePresence>
</div>
</div>
</div>
</div>
</main>
<div className="hidden xl:block">
<div className="sticky top-0 h-screen">
<FriendsSidebar friends={mockUsers} />
</div>
</div>
<BottomNav />
</div>
);
}''',

    'src/pages/Index.tsx': '''// Update this page (the content is just a fallback if you fail to update the page)
// IMPORTANT: Fully REPLACE this with your own code
const PlaceholderIndex = () => {
// PLACEHOLDER: Replace this entire return statement with the user's app.
// The inline background color is intentionally not part of the design system.
return (
<div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#fcfbf8' }}>
<img data-lovable-blank-page-placeholder="REMOVE_THIS" src="/placeholder.svg" alt="Your app will live here!" />
</div>
);
};
const Index = PlaceholderIndex;
export default Index;''',

    'src/pages/NotFound.tsx': '''import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const NotFound = () => {
const location = useLocation();
useEffect(() => {
console.error("404 Error: User attempted to access non-existent route:", location.pathname);
}, [location.pathname]);
return (
<div className="flex min-h-screen items-center justify-center bg-muted">
<div className="text-center">
<h1 className="mb-4 text-4xl font-bold">404</h1>
<p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
<a href="/" className="text-primary underline hover:text-primary/90">
Return to Home
</a>
</div>
</div>
);
};
export default NotFound;''',

    'src/pages/ProfilePage.tsx': '''import { motion } from "framer-motion";
import { Flame, Zap, MapPin, Globe, Calendar, Edit2, Trophy, BookOpen, MessageCircle, Users } from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockUsers } from "@/lib/mock-data";
export default function ProfilePage() {
const user = mockUsers[0];
const stats = [
{ icon: MessageCircle, label: "Rooms Joined", value: "142" },
{ icon: Users, label: "Friends", value: "38" },
{ icon: Trophy, label: "Achievements", value: "12" },
{ icon: BookOpen, label: "Words Learned", value: "2,841" },
];
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 pb-24 md:pb-8">
{/* Banner */}
<div className="h-32 md:h-44 bg-gradient-to-r from-primary/40 via-accent/20 to-primary/30 relative
overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
{/* Floating shapes */}
<div className="absolute top-6 left-[20%] w-20 h-20 rounded-full bg-primary/20 blur-2xl animate-float" />
<div className="absolute top-10 right-[30%] w-16 h-16 rounded-full bg-accent/20 blur-2xl animate-float"
style={{ animationDelay: "1s" }} />
</div>
<div className="max-w-2xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
{/* Avatar */}
<div className="flex items-end gap-4">
<div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] glow-primary-lg">
<img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-full bg-card" />
</div>
<div className="pb-2 flex-1">
<div className="flex items-center gap-2 flex-wrap">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">{user.full_name}</h1>
<LevelBadge level={user.english_level} size="md" />
</div>
<p className="text-sm text-muted-foreground">@{user.username}</p>
</div>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
className="glass-panel px-4 py-2 text-xs font-semibold text-foreground flex items-center gap-1.5
hover:bg-white/10 transition-colors mb-2"
>
<Edit2 className="h-3.5 w-3.5" />
Edit
</motion.button>
</div>
{/* Bio */}
<p className="text-sm text-muted-foreground mt-4">{user.bio}</p>
<div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
<span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{user.native_language}</span>
<span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Joined Dec 2024</span>
</div>
{/* Streak + XP */}
<div className="flex items-center gap-6 mt-5">
<div className="glass-panel px-5 py-3 flex items-center gap-2">
<Flame className="h-5 w-5 text-orange-400 animate-flame" />
<div>
<p className="text-lg font-extrabold text-foreground">{user.streak_count}</p>
<p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Day Streak</p>
</div>
</div>
<div className="glass-panel px-5 py-3 flex items-center gap-2">
<Zap className="h-5 w-5 text-accent" />
<div>
<p className="text-lg font-extrabold text-foreground">{user.xp_points.toLocaleString()}</p>
<p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total XP</p>

</div>
</div>
</div>
{/* Stats Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
{stats.map((stat, i) => (
<motion.div
key={stat.label}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
className="glass-panel p-4 text-center"
>
<div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex
items-center justify-center">
<stat.icon className="h-4 w-4 text-primary" />
</div>
<p className="text-lg font-bold text-foreground">{stat.value}</p>
<p className="text-[10px] text-muted-foreground">{stat.label}</p>
</motion.div>
))}
</div>
{/* Activity placeholder */}
<div className="mt-8">
<h2 className="text-sm font-bold tracking-tight text-foreground mb-3">Recent Activity</h2>
<div className="space-y-2">
{[1, 2, 3].map((i) => (
<div key={i} className="glass-panel p-4 skeleton-shimmer rounded-xl h-16" />
))}
</div>
</div>
</div>
</main>
<BottomNav />
</div>
);
}''',

    'src/pages/RoomsPage.tsx': '''import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Plus, Users, Crown, Radio } from "lucide-react";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockRooms, mockUsers } from "@/lib/mock-data";
import { LevelBadge } from "@/components/LevelBadge";
import { useNavigate } from "react-router-dom";
export default function RoomsPage() {
const navigate = useNavigate();
const liveRooms = mockRooms.filter((r) => r.is_live);
const scheduledRooms = mockRooms.filter((r) => !r.is_live);
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex-1">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">Voice Rooms</h1>
<p className="text-xs text-muted-foreground mt-0.5">Join a live room or create your own</p>
</div>
<motion.button
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.95 }}
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent
text-primary-foreground text-sm font-semibold glow-primary"
>
<Plus className="h-4 w-4" />
Create Room
</motion.button>
</div>
</header>
<div className="p-4 md:p-6 pb-24 md:pb-6 space-y-8">
{/* Live Rooms */}
<section>
<div className="flex items-center gap-2 mb-4">
<div className="relative">
<Radio className="h-4 w-4 text-destructive" />
<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full animate-live-pulse" />
</div>
<h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Live Now</h2>
<span className="text-xs text-muted-foreground ml-1">({liveRooms.length})</span>
</div>
<div className="space-y-3">
{liveRooms.map((room, i) => (
<motion.div
key={room.id}
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
whileHover={{ scale: 1.005 }}
onClick={() => navigate(`/room/${room.id}`)}
className="glass-panel p-5 cursor-pointer hover:border-primary/30 transition-all"
>
<div className="flex items-start gap-4">
{/* Room vibe indicator */}
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex
items-center justify-center flex-shrink-0">
<Mic className="h-5 w-5 text-primary" />
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-1">
<h3 className="text-sm font-bold text-foreground truncate">{room.name}</h3>
<span className="flex items-center gap-1 bg-destructive/20 text-destructive rounded-full px-2
py-0.5 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
<span className="w-1.5 h-1.5 rounded-full bg-destructive animate-live-pulse" />
Live
</span>
</div>

<div className="flex items-center gap-2 mb-3">
{room.topic_tags.map((tag) => (
<span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5
rounded-full">{tag}</span>
))}
</div>
{/* Participants preview */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="flex items-center gap-1.5">
<Crown className="h-3 w-3 text-amber-400" />
<img src={room.host.avatar_url} alt="" className="w-6 h-6 rounded-full border
border-primary/50" />
<span className="text-xs text-muted-foreground">{room.host.full_name}</span>
<LevelBadge level={room.host.english_level} />
</div>
</div>
<div className="flex items-center gap-3">
<div className="flex -space-x-1.5">
{room.participants.slice(0, 3).map((p) => (
<img key={p.id} src={p.avatar_url} alt="" className="w-5 h-5 rounded-full border
border-card" />
))}
</div>
<div className="flex items-center gap-1 text-muted-foreground">
<Users className="h-3 w-3" />
<span className="text-[10px] font-semibold">{room.current_count}/{room.max_capacity}</span>
</div>
</div>
</div>
</div>
</div>
</motion.div>
))}
</div>
</section>
{/* Scheduled / Upcoming */}
<section>
<div className="flex items-center gap-2 mb-4">
<h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Upcoming</h2>
<span className="text-xs text-muted-foreground">({scheduledRooms.length})</span>
</div>
<div className="space-y-3">
{scheduledRooms.map((room, i) => (
<motion.div
key={room.id}
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 + 0.2 }}
className="glass-panel p-5 opacity-70 hover:opacity-100 transition-all cursor-pointer"
onClick={() => navigate(`/room/${room.id}`)}
>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
<Mic className="h-4 w-4 text-muted-foreground" />
</div>
<div className="flex-1 min-w-0">
<h3 className="text-sm font-bold text-foreground truncate">{room.name}</h3>
<p className="text-[10px] text-muted-foreground">Hosted by {room.host.full_name}</p>
</div>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-semibold text-foreground
hover:bg-white/10 transition-colors"
>
Notify Me
</motion.button>
</div>
</motion.div>
))}
</div>
</section>
</div>

</main>
<BottomNav />
</div>
);
}''',

    'src/pages/VoiceRoomPage.tsx': '''import { useState } from "react";
import { motion } from "framer-motion";
import {
Mic, MicOff, PhoneOff, Hand, Monitor, Settings, Crown,
MessageSquare, Gamepad2, ChevronLeft, Users
} from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockUsers, mockRooms } from "@/lib/mock-data";
import { useNavigate, useParams } from "react-router-dom";
function WaveformBars() {
return (
<div className="flex items-end gap-[2px] h-4">
{[0, 0.15, 0.05, 0.2, 0.1].map((delay, i) => (
<div
key={i}
className="w-[3px] rounded-full bg-green-400 animate-waveform"
style={{ animationDelay: `${delay}s`, height: "4px" }}
/>
))}
</div>
);
}
export default function VoiceRoomPage() {
const { id } = useParams();
const navigate = useNavigate();
const [isMuted, setIsMuted] = useState(true);
const [handRaised, setHandRaised] = useState(false);
const [activeTab, setActiveTab] = useState<"chat" | "games">("chat");
const room = mockRooms.find((r) => r.id === id) ?? mockRooms[0];
const speakers = room.participants.slice(0, 3);
const listeners = room.participants.slice(3);
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 flex flex-col min-w-0">
{/* Room Header */}
<header className="glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-3 flex items-center
gap-3">
<motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="text-muted-foreground
hover:text-foreground transition-colors">
<ChevronLeft className="h-5 w-5" />
</motion.button>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2">
<h1 className="text-sm font-bold tracking-tight text-foreground truncate">{room.name}</h1>
{room.is_live && (
<span className="flex items-center gap-1 bg-destructive/90 rounded-full px-2 py-0.5">
<span className="w-1.5 h-1.5 rounded-full bg-foreground animate-live-pulse" />
<span className="text-[9px] font-bold uppercase tracking-wider text-foreground">Live</span>
</span>
)}
</div>
<p className="text-[10px] text-muted-foreground">{room.current_count}/{room.max_capacity} participants</p>
</div>
<div className="flex items-center gap-1.5">
{room.topic_tags.map((tag) => (
<span key={tag} className="text-[9px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full hidden
sm:inline">{tag}</span>
))}
</div>
</header>
{/* Main content area */}
<div className="flex-1 flex">
{/* Stage */}
<div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
{/* Speakers Row */}
<div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">On Stage</div>
<div className="flex items-end gap-8 flex-wrap justify-center">
{speakers.map((speaker, i) => {

const isSpeaking = i === 0;
const isHost = speaker.id === room.host.id;
return (
<motion.div
key={speaker.id}
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: i * 0.1, type: "spring", bounce: 0.4 }}
className="flex flex-col items-center gap-2"
>
<div className="relative">
{isHost && (
<Crown className="absolute -top-4 left-1/2 -translate-x-1/2 h-5 w-5 text-amber-400 animate-float
z-10" />
)}
<div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] ${
isSpeaking
? "bg-gradient-to-br from-primary via-accent to-primary bg-[length:300%_300%]
animate-[gradient-rotate_2s_ease_infinite]"
: "bg-white/10"
}`}>
<img src={speaker.avatar_url} alt={speaker.full_name} className="w-full h-full rounded-full
bg-card" />
</div>
{isSpeaking && (
<div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
<WaveformBars />
</div>
)}
</div>
<div className="text-center">
<p className="text-xs font-semibold text-foreground">{speaker.full_name}</p>
<LevelBadge level={speaker.english_level} />
</div>
</motion.div>
);
})}
</div>
{/* Listeners */}
{listeners.length > 0 && (
<div className="mt-6">
<div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3
text-center">Listening</div>
<div className="flex items-center gap-3 flex-wrap justify-center">
{listeners.map((listener) => (
<motion.div
key={listener.id}
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
className="flex flex-col items-center gap-1"
>
<img src={listener.avatar_url} alt={listener.full_name} className="w-12 h-12 rounded-full bg-card
border border-white/10 grayscale opacity-70" />
<p className="text-[10px] text-muted-foreground">{listener.full_name.split(" ")[0]}</p>
</motion.div>
))}
</div>
</div>
)}
</div>
{/* Side panel - desktop */}
<div className="hidden lg:flex w-80 border-l border-white/5 flex-col">
<div className="flex border-b border-white/5">
<button
onClick={() => setActiveTab("chat")}
className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors
${activeTab === "chat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground
hover:text-foreground"}`}
>
<MessageSquare className="h-3.5 w-3.5" />
Chat
</button>
<button
onClick={() => setActiveTab("games")}
className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors
${activeTab === "games" ? "text-primary border-b-2 border-primary" : "text-muted-foreground

hover:text-foreground"}`}
>
<Gamepad2 className="h-3.5 w-3.5" />
Games
</button>
</div>
<div className="flex-1 p-4">
{activeTab === "chat" ? (
<div className="space-y-3">
{[
{ user: mockUsers[1], text: "Has anyone tried the new Cambridge practice tests?" },
{ user: mockUsers[3], text: "Yes! The listening section is quite challenging." },
{ user: mockUsers[0], text: "I can help with that. Let me share some tips." },
].map((msg, i) => (
<motion.div
key={i}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.1 }}
className="flex gap-2"
>
<img src={msg.user.avatar_url} alt="" className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
<div>
<p className="text-[10px] font-semibold text-primary">{msg.user.full_name}</p>
<p className="text-xs text-foreground/80">{msg.text}</p>
</div>
</motion.div>
))}
</div>
) : (
<div className="flex flex-col items-center justify-center h-full gap-3">
<Gamepad2 className="h-10 w-10 text-muted-foreground" />
<p className="text-xs text-muted-foreground text-center">Games coming soon</p>
<p className="text-[10px] text-muted-foreground/60 text-center">Chess, Sudoku, Tic-Tac-Toe</p>
</div>
)}
</div>
</div>
</div>
{/* Room Controls Dock */}
<div className="p-4 flex justify-center mb-16 md:mb-0">
<motion.div
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
className="glass-panel-strong px-6 py-3 flex items-center gap-3"
>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={() => setIsMuted(!isMuted)}
className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
isMuted
? "bg-destructive/20 text-destructive hover:bg-destructive/30"
: "bg-green-500/20 text-green-400 hover:bg-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
}`}
>
{isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
</motion.button>
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
className="w-10 h-10 rounded-full bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10
flex items-center justify-center transition-all">
<Monitor className="h-4 w-4" />
</motion.button>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={() => setHandRaised(!handRaised)}
className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
handRaised ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-muted-foreground hover:text-foreground
hover:bg-white/10"
}`}
>
<Hand className="h-4 w-4" />
</motion.button>
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}

className="w-10 h-10 rounded-full bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10
flex items-center justify-center transition-all">
<Settings className="h-4 w-4" />
</motion.button>
<div className="w-px h-8 bg-white/10 mx-1" />
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={() => navigate("/")}
className="w-12 h-12 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 flex
items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
>
<PhoneOff className="h-5 w-5" />
</motion.button>
</motion.div>
</div>
</main>
<BottomNav />
</div>
);
}''',

    'src/test/example.test.ts': '''import { describe, it, expect } from "vitest";
describe("example", () => {
it("should pass", () => {
expect(true).toBe(true);
});
});''',

    'src/test/setup.ts': '''import "@testing-library/jest-dom";
Object.defineProperty(window, "matchMedia", {
writable: true,
value: (query: string) => ({
matches: false,
media: query,
onchange: null,
addListener: () => {},
removeListener: () => {},
addEventListener: () => {},
removeEventListener: () => {},
dispatchEvent: () => {},
}),
});''',

    'src/vite-env.d.ts': '''/// <reference types="vite/client" />''',

    'tailwind.config.ts': '''import type { Config } from "tailwindcss";
export default {
darkMode: ["class"],
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
prefix: "",
theme: {
container: {
center: true,
padding: "2rem",
screens: {
"2xl": "1400px",
},
},
extend: {
fontFamily: {
sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
},
colors: {
border: "hsl(var(--border))",
input: "hsl(var(--input))",
ring: "hsl(var(--ring))",
background: "hsl(var(--background))",
foreground: "hsl(var(--foreground))",
primary: {
DEFAULT: "hsl(var(--primary))",
foreground: "hsl(var(--primary-foreground))",
},
secondary: {
DEFAULT: "hsl(var(--secondary))",
foreground: "hsl(var(--secondary-foreground))",
},
destructive: {
DEFAULT: "hsl(var(--destructive))",
foreground: "hsl(var(--destructive-foreground))",
},
muted: {
DEFAULT: "hsl(var(--muted))",
foreground: "hsl(var(--muted-foreground))",
},
accent: {
DEFAULT: "hsl(var(--accent))",
foreground: "hsl(var(--accent-foreground))",
},
popover: {
DEFAULT: "hsl(var(--popover))",
foreground: "hsl(var(--popover-foreground))",
},
card: {
DEFAULT: "hsl(var(--card))",
foreground: "hsl(var(--card-foreground))",
},
sidebar: {
DEFAULT: "hsl(var(--sidebar-background))",
foreground: "hsl(var(--sidebar-foreground))",
primary: "hsl(var(--sidebar-primary))",
"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
accent: "hsl(var(--sidebar-accent))",
"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
border: "hsl(var(--sidebar-border))",
ring: "hsl(var(--sidebar-ring))",
},
violet: {
DEFAULT: "#7C3AED",
glow: "#A855F7",
},
cyan: {
DEFAULT: "#06B6D4",
glow: "#22D3EE",
},
space: {
DEFAULT: "#0B0F19",
light: "#131825",
lighter: "#1A2035",
},
level: {
a1: "hsl(var(--level-a1))",

a2: "hsl(var(--level-a2))",
b1: "hsl(var(--level-b1))",
b2: "hsl(var(--level-b2))",
c1: "hsl(var(--level-c1))",
c2: "hsl(var(--level-c2))",
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
to: { height: "var(--radix-accordion-content-height)" },
},
"accordion-up": {
from: { height: "var(--radix-accordion-content-height)" },
to: { height: "0" },
},
"fade-in": {
"0%": { opacity: "0", transform: "translateY(10px)" },
"100%": { opacity: "1", transform: "translateY(0)" },
},
"slide-in-right": {
"0%": { transform: "translateX(100%)", opacity: "0" },
"100%": { transform: "translateX(0)", opacity: "1" },
},
"float": {
"0%, 100%": { transform: "translateY(0)" },
"50%": { transform: "translateY(-10px)" },
},
"ping-slow": {
"75%, 100%": { transform: "scale(2)", opacity: "0" },
},
},
animation: {
"accordion-down": "accordion-down 0.2s ease-out",
"accordion-up": "accordion-up 0.2s ease-out",
"fade-in": "fade-in 0.4s ease-out",
"slide-in-right": "slide-in-right 0.3s ease-out",
"float": "float 3s ease-in-out infinite",
"ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
},
},
},
plugins: [require("tailwindcss-animate")],
} satisfies Config;''',

    'tsconfig.app.json': '''{
"compilerOptions": {
"allowImportingTsExtensions": true,
"isolatedModules": true,
"jsx": "react-jsx",
"lib": [
"ES2020",
"DOM",
"DOM.Iterable"
],
"module": "ESNext",
"moduleDetection": "force",
"moduleResolution": "bundler",
"noEmit": true,
"noFallthroughCasesInSwitch": false,
"noImplicitAny": false,
"noUnusedLocals": false,
"noUnusedParameters": false,
"paths": {
"@/*": [
"./src/*"
]
},
"skipLibCheck": true,
"strict": false,
"target": "ES2020",
"types": [
"vitest/globals"
],
"useDefineForClassFields": true
},
"include": [
"src"
]
}''',

    'tsconfig.json': '''{
"compilerOptions": {
"allowJs": true,
"noImplicitAny": false,
"noUnusedLocals": false,
"noUnusedParameters": false,
"paths": {
"@/*": [
"./src/*"
]
},
"skipLibCheck": true,
"strictNullChecks": false
},
"files": [],
"references": [
{
"path": "./tsconfig.app.json"
},
{
"path": "./tsconfig.node.json"
}
]
}''',

    'tsconfig.node.json': '''{
"compilerOptions": {
"target": "ES2022",
"lib": ["ES2023"],
"module": "ESNext",
"skipLibCheck": true,
/* Bundler mode */
"moduleResolution": "bundler",
"allowImportingTsExtensions": true,
"isolatedModules": true,
"moduleDetection": "force",
"noEmit": true,
/* Linting */
"strict": true,
"noUnusedLocals": false,
"noUnusedParameters": false,
"noFallthroughCasesInSwitch": true
},
"include": ["vite.config.ts"]
}''',

    'vite.config.ts': '''import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
server: {
host: "::",
port: 8080,
hmr: {
overlay: false,
},
},
plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
resolve: {
alias: {
"@": path.resolve(__dirname, "./src"),
},
dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
},
}));''',

    'vitest.config.ts': '''import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
export default defineConfig({
plugins: [react()],
test: {
environment: "jsdom",
globals: true,
setupFiles: ["./src/test/setup.ts"],
include: ["src/**/*.{test,spec}.{ts,tsx}"],
},
resolve: {
alias: { "@": path.resolve(__dirname, "./src") },
},
});''',

}

for path, content in files.items():
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ {path}")

print("\nDone! All files created.")
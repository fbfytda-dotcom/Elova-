import { motion } from "framer-motion";
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
<div className="hidden md:flex w-[72px] lg:w-56 flex-col glass-panel rounded-none border-t-0 border-b-0 border-l-0 h-screen sticky top-0">
{/* Logo */}
<div className="p-4 lg:px-5 flex items-center gap-2.5 border-b border-white/5">
<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-primary">
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
${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
>
<link.icon className="h-5 w-5 flex-shrink-0" />
<span className="hidden lg:block">{link.label}</span>
{active && (
<motion.div layoutId="sidebar-indicator" className="hidden lg:block w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
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
}
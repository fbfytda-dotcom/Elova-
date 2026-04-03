import { motion } from "framer-motion";
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
}
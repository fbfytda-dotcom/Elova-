import { motion } from "framer-motion";
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
}
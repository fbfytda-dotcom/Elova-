import { motion } from "framer-motion";
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
}
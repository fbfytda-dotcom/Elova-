import { useState } from "react";
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
}
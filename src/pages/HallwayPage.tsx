import { useState } from "react";
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
}
import { motion } from "framer-motion";
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
<span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold ml-auto">{online.length}</span>
</div>
<div className="relative">
<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search friends..."
className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
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
<button onClick={toggle} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
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
className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
>
<div className="relative flex-shrink-0">
<img src={user.avatar_url} alt={user.full_name} className={`w-8 h-8 rounded-full ${!user.is_online ? "opacity-50 grayscale" : ""}`} />
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
}
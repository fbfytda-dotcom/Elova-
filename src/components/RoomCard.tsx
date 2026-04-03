import { motion } from "framer-motion";
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
}
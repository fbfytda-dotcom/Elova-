import { useState } from "react";
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
<header className="glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-3 flex items-center gap-3">
<motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
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
<span key={tag} className="text-[9px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full hidden sm:inline">{tag}</span>
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
<Crown className="absolute -top-4 left-1/2 -translate-x-1/2 h-5 w-5 text-amber-400 animate-float z-10" />
)}
<div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] ${
isSpeaking
? "bg-gradient-to-br from-primary via-accent to-primary bg-[length:300%_300%] animate-[gradient-rotate_2s_ease_infinite]"
: "bg-white/10"
}`}>
<img src={speaker.avatar_url} alt={speaker.full_name} className="w-full h-full rounded-full bg-card" />
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
<div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center">Listening</div>
<div className="flex items-center gap-3 flex-wrap justify-center">
{listeners.map((listener) => (
<motion.div
key={listener.id}
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
className="flex flex-col items-center gap-1"
>
<img src={listener.avatar_url} alt={listener.full_name} className="w-12 h-12 rounded-full bg-card border border-white/10 grayscale opacity-70" />
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
${activeTab === "chat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
>
<MessageSquare className="h-3.5 w-3.5" />
Chat
</button>
<button
onClick={() => setActiveTab("games")}
className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors
${activeTab === "games" ? "text-primary border-b-2 border-primary" : "text-muted-foreground  hover:text-foreground"}`}
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
className="w-10 h-10 rounded-full bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 flex items-center justify-center transition-all">
<Monitor className="h-4 w-4" />
</motion.button>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={() => setHandRaised(!handRaised)}
className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
handRaised ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
}`}
>
<Hand className="h-4 w-4" />
</motion.button>
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}

className="w-10 h-10 rounded-full bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 flex items-center justify-center transition-all">
<Settings className="h-4 w-4" />
</motion.button>
<div className="w-px h-8 bg-white/10 mx-1" />
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.9 }}
onClick={() => navigate("/")}
className="w-12 h-12 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
>
<PhoneOff className="h-5 w-5" />
</motion.button>
</motion.div>
</div>
</main>
<BottomNav />
</div>
);
}
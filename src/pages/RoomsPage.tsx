import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { lounges } from "@/lib/lounge-data";
import type { Lounge } from "@/lib/lounge-data";

function LoungeCard({ lounge, index }: { lounge: Lounge; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/lounge/${lounge.id}`)}
      className="glass-panel overflow-hidden cursor-pointer group"
    >
      <div className={`h-20 bg-gradient-to-r ${lounge.gradient} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{lounge.emoji}</span>
        {lounge.activeRooms > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span className="text-[10px] text-green-300 font-bold">{lounge.activeRooms} live</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-foreground mb-1">{lounge.name}</h3>
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{lounge.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{lounge.memberCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{lounge.activeRooms} rooms</span>
          </div>
          <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Enter →</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const filtered = lounges.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground mb-3">Lounges</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lounges..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </header>
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lounge, i) => (
              <LoungeCard key={lounge.id} lounge={lounge} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm font-semibold text-foreground">No lounges found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

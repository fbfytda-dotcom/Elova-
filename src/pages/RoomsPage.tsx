
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mic, Plus, Menu, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { lounges, sampleRooms } from "@/lib/lounge-data";

interface RoomsPageProps { onMenuOpen?: () => void; }

function LiveDot({ sm }: { sm?: boolean }) {
  const s = sm ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span className={"relative flex flex-shrink-0 " + s}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className={"relative inline-flex rounded-full bg-green-500 " + s} />
    </span>
  );
}

export default function RoomsPage({ onMenuOpen = () => {} }: RoomsPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set(["l1", "l2", "l3"]));

  const filtered = lounges.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) ||
           l.description.toLowerCase().includes(search.toLowerCase())
  );

  const joinedList = filtered.filter((l) => joined.has(l.id));
  const suggestedList = filtered.filter((l) => !joined.has(l.id));

  const toggleJoin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJoined((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalLive = lounges.reduce((a, l) => a + l.activeRooms, 0);
  const totalMembers = lounges.reduce((a, l) => a + l.memberCount, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="flex items-center gap-3 px-4 h-[53px]">
          <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 transition-colors flex-shrink-0">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-[17px] font-extrabold text-foreground flex-1">Communities</h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-primary/40 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search communities..." className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Hero stats */}
      <div className="px-4 py-4 border-b border-white/[0.07] bg-gradient-to-r from-primary/8 via-transparent to-transparent">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-[13px] font-bold text-foreground">{lounges.length} communities</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[13px]">{totalMembers.toLocaleString()} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-400">
            <LiveDot sm />
            <span className="text-[13px] font-semibold">{totalLive} live now</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-6">

        {/* Joined */}
        {joinedList.length > 0 && !search && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Your Communities</p>
            <div className="space-y-2">
              {joinedList.map((lounge, i) => {
                const liveRooms = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive);
                return (
                  <motion.div
                    key={lounge.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate("/lounge/" + lounge.id)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-primary/20 transition-all cursor-pointer group"
                  >
                    <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-2xl flex-shrink-0 shadow-md"}>{lounge.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">{lounge.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members</span>
                        {liveRooms.length > 0 && (
                          <>
                            <span className="text-muted-foreground/30 text-xs">·</span>
                            <span className="flex items-center gap-1 text-[11px] text-green-400 font-semibold">
                              <LiveDot sm />{liveRooms.length} live
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleJoin(lounge.id, e)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/[0.07] border border-white/[0.1] text-foreground hover:bg-destructive/15 hover:text-destructive hover:border-destructive/25 transition-all"
                    >
                      Joined
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Discover */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">
            {search ? "Results" : "Discover"}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {(search ? filtered : suggestedList).map((lounge, i) => {
              const liveRooms = sampleRooms.filter((r) => r.loungeId === lounge.id && r.isLive);
              const isJoined = joined.has(lounge.id);
              return (
                <motion.div
                  key={lounge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate("/lounge/" + lounge.id)}
                  className="rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer group bg-white/[0.02]"
                >
                  {/* Gradient banner */}
                  <div className={"h-20 bg-gradient-to-br " + lounge.gradient + " relative"}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    {liveRooms.length > 0 && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <LiveDot sm />
                        <span className="text-[10px] text-green-300 font-bold">{liveRooms.length} live</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 left-3 text-3xl drop-shadow-lg">{lounge.emoji}</span>
                  </div>
                  {/* Info */}
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">{lounge.name}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => toggleJoin(lounge.id, e)}
                        className={"flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border " + (isJoined ? "bg-white/[0.07] border-white/[0.1] text-foreground" : "bg-primary border-primary text-white hover:bg-primary/90")}
                      >
                        {isJoined ? "Joined" : "+ Join"}
                      </motion.button>
                    </div>
                    <p className="text-[12px] text-muted-foreground mb-2 leading-snug">{lounge.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{lounge.memberCount.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{lounge.activeRooms} rooms</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-foreground">No communities found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}

        <div className="h-24" />
      </div>

      <BottomNav />
    </div>
  );
}

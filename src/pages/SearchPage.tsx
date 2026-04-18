
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ArrowLeft, Users, Mic, Hash,
  TrendingUp, Clock, ChevronUp, ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { LevelBadge } from "@/components/LevelBadge";
import { samplePosts, sampleRooms, lounges, loungeUsers } from "@/lib/lounge-data";

interface SearchPageProps { onMenuOpen?: () => void; }

type SearchTab = "all" | "posts" | "rooms" | "communities" | "people";

const TRENDING = [
  "remote work debate", "B2 plateau tips", "phrasal verbs",
  "Champions League", "AI writing tools", "shadowing technique",
  "IELTS speaking", "British vs American English",
];

const RECENT_SEARCHES_KEY = "elova_recent_searches";

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
    </span>
  );
}

function VotePillMini({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
      <ChevronUp className="h-3 w-3" />{n >= 1000 ? (n/1000).toFixed(1)+"K" : n}
    </span>
  );
}

const MODE_COLORS: Record<string, string> = {
  "Open Floor": "bg-green-500/15 text-green-400",
  "Debate":     "bg-orange-500/15 text-orange-400",
  "Teach Me":   "bg-blue-500/15 text-blue-400",
  "Hot Seat":   "bg-purple-500/15 text-purple-400",
};

export default function SearchPage({ onMenuOpen = () => {} }: SearchPageProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SearchTab>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]"); }
    catch { return []; }
  });

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.trim().toLowerCase();

  const postResults    = useMemo(() => !q ? [] : samplePosts.filter((p) => p.content.toLowerCase().includes(q) || p.author.full_name.toLowerCase().includes(q) || (p.title ?? "").toLowerCase().includes(q)), [q]);
  const roomResults    = useMemo(() => !q ? [] : sampleRooms.filter((r) => r.name.toLowerCase().includes(q) || r.loungeName.toLowerCase().includes(q) || r.host.username.toLowerCase().includes(q)), [q]);
  const communityResults = useMemo(() => !q ? [] : lounges.filter((l) => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)), [q]);
  const peopleResults  = useMemo(() => !q ? [] : loungeUsers.filter((u) => u.full_name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)), [q]);

  const totalResults = postResults.length + roomResults.length + communityResults.length + peopleResults.length;

  const saveSearch = (s: string) => {
    const updated = [s, ...recentSearches.filter((r) => r !== s)].slice(0, 8);
    setRecentSearches(updated);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleSearch = (s: string) => {
    setQuery(s);
    if (s.trim()) saveSearch(s.trim());
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch {}
  };

  const tabs: { key: SearchTab; label: string; count?: number }[] = [
    { key: "all",         label: "All",         count: totalResults     },
    { key: "posts",       label: "Posts",       count: postResults.length },
    { key: "rooms",       label: "Rooms",       count: roomResults.length },
    { key: "communities", label: "Communities", count: communityResults.length },
    { key: "people",      label: "People",      count: peopleResults.length },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Search header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 focus-within:border-primary/40 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) saveSearch(query.trim()); }}
              placeholder="Search posts, rooms, people..."
              className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs — only show when results exist */}
        {q && totalResults > 0 && (
          <div className="flex gap-1 mt-3 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all " +
                  (tab === t.key
                    ? "bg-primary text-white border-primary"
                    : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/[0.16]")
                }
              >
                {t.label}
                {t.count != null && t.count > 0 && (
                  <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full " + (tab === t.key ? "bg-white/20" : "bg-white/[0.07]")}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4">
        {/* Empty state — show trending + recents */}
        {!q && (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Recent
                  </p>
                  <button onClick={clearRecent} className="text-[12px] text-muted-foreground hover:text-destructive transition-colors">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[13px] text-foreground hover:bg-white/[0.09] transition-colors"
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" /> {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1.5 mb-3">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </p>
              <div className="space-y-1">
                {TRENDING.map((term, i) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSearch(term)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors text-left"
                  >
                    <span className="text-[13px] font-bold text-muted-foreground/50 w-5 text-center">{i + 1}</span>
                    <Search className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                    <span className="text-[14px] text-foreground font-medium">{term}</span>
                    <ChevronUp className="h-3.5 w-3.5 text-primary/60 ml-auto rotate-45" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No results */}
        {q && totalResults === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-2">
              <Search className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-[17px] font-bold text-foreground">No results for "{query}"</p>
            <p className="text-[13px] text-muted-foreground">Try a different search term</p>
          </div>
        )}

        {/* Results */}
        {q && totalResults > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={tab + q} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-6">

              {/* Posts */}
              {(tab === "all" || tab === "posts") && postResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Posts</p>}
                  <div className="space-y-2">
                    {postResults.slice(0, tab === "all" ? 3 : 20).map((post, i) => (
                      <motion.div key={post.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer" onClick={() => navigate("/")}>
                        <div className="flex items-center gap-2 mb-2">
                          <img src={post.author.avatar_url} alt="" className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0" />
                          <span className="text-[12px] font-bold text-foreground">{post.author.full_name}</span>
                          {post.loungeName && <span className="text-[11px] text-primary">· {post.loungeName}</span>}
                          <span className="text-[11px] text-muted-foreground ml-auto">{post.createdAt}</span>
                        </div>
                        {post.title && <p className="text-[15px] font-bold text-foreground mb-1 leading-snug">{post.title}</p>}
                        <p className="text-[13px] text-foreground/75 line-clamp-2 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <VotePillMini n={post.upvotes} />
                          <span className="text-[11px] text-muted-foreground">{post.comments.length} replies</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms */}
              {(tab === "all" || tab === "rooms") && roomResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Rooms</p>}
                  <div className="space-y-2">
                    {roomResults.slice(0, tab === "all" ? 2 : 20).map((room, i) => (
                      <motion.div key={room.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/room/" + room.id)} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Mic className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <LiveDot />
                            <span className="text-[11px] text-green-400 font-bold">LIVE</span>
                            <span className={"text-[11px] font-bold px-2 py-0.5 rounded-full " + (MODE_COLORS[room.mode] ?? "bg-white/10 text-muted-foreground")}>
                              {room.mode}
                            </span>
                          </div>
                          <p className="text-[14px] font-bold text-foreground leading-snug">{room.name}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">{room.loungeName} · {room.participants.length}/{room.maxParticipants}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); navigate("/room/" + room.id); }} className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-colors">Join</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {(tab === "all" || tab === "communities") && communityResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Communities</p>}
                  <div className="space-y-2">
                    {communityResults.slice(0, tab === "all" ? 3 : 20).map((lounge, i) => (
                      <motion.div key={lounge.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/lounge/" + lounge.id)} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className={"w-11 h-11 rounded-xl bg-gradient-to-br " + lounge.gradient + " flex items-center justify-center text-xl flex-shrink-0"}>{lounge.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-foreground">{lounge.name}</p>
                          <p className="text-[12px] text-muted-foreground">{lounge.memberCount.toLocaleString()} members · {lounge.activeRooms} live</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); navigate("/lounge/" + lounge.id); }} className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.07] border border-white/[0.1] text-foreground text-[12px] font-bold hover:bg-white/[0.12] transition-colors">View</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {(tab === "all" || tab === "people") && peopleResults.length > 0 && (
                <div>
                  {tab === "all" && <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">People</p>}
                  <div className="space-y-2">
                    {peopleResults.slice(0, tab === "all" ? 3 : 20).map((user, i) => (
                      <motion.div key={user.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => navigate("/user/" + user.id)} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className="relative flex-shrink-0">
                          <img src={user.avatar_url} alt="" className="w-11 h-11 rounded-full border border-white/10" />
                          {user.is_online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-foreground">{user.full_name}</p>
                          <p className="text-[12px] text-muted-foreground">@{user.username} · {user.xp_points.toLocaleString()} XP</p>
                        </div>
                        <LevelBadge level={user.english_level} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-24" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

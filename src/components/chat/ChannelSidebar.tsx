import { motion } from "framer-motion";
import { Hash, ChevronDown, Mic, Headphones, Settings } from "lucide-react";
import type { ChatChannel, Lounge, LoungeUser } from "@/lib/lounge-data";

interface ChannelSidebarProps {
  lounge: Lounge;
  channels: ChatChannel[];
  activeChannelId: string;
  onChannelSelect: (id: string) => void;
  currentUser: LoungeUser;
  onClose?: () => void;
}

export function ChannelSidebar({
  lounge,
  channels,
  activeChannelId,
  onChannelSelect,
  currentUser,
}: ChannelSidebarProps) {
  // Group channels by category
  const categories = channels.reduce<Record<string, ChatChannel[]>>((acc, ch) => {
    if (!acc[ch.category]) acc[ch.category] = [];
    acc[ch.category].push(ch);
    return acc;
  }, {});

  return (
    <div className="w-60 flex-shrink-0 bg-[#0b0f18] flex flex-col h-full border-r border-white/[0.06]">
      {/* Server Header */}
      <button className={`h-12 px-4 flex items-center justify-between border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors flex-shrink-0`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{lounge.emoji}</span>
          <span className="text-[14px] font-bold text-foreground truncate">{lounge.name}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </button>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {Object.entries(categories).map(([category, chans]) => (
          <div key={category}>
            {/* Category header */}
            <button className="flex items-center gap-1 px-1 mb-1 group w-full">
              <ChevronDown className="h-2.5 w-2.5 text-muted-foreground/60 flex-shrink-0" />
              <span className="text-[10px] uppercase tracking-[0.08em] font-bold text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                {category}
              </span>
            </button>

            {/* Channels */}
            <div className="space-y-0.5">
              {chans.map((ch) => {
                const active = ch.id === activeChannelId;
                const hasUnread = ch.unreadCount > 0;

                return (
                  <motion.button
                    key={ch.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onChannelSelect(ch.id)}
                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[14px] font-medium transition-all group relative ${
                      active
                        ? "bg-white/[0.08] text-foreground"
                        : hasUnread
                        ? "text-foreground hover:bg-white/[0.04]"
                        : "text-muted-foreground/70 hover:text-muted-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {hasUnread && !active && (
                      <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1 h-2 rounded-r-full bg-foreground" />
                    )}

                    <Hash className={`h-4 w-4 flex-shrink-0 ${active ? "text-muted-foreground" : "text-muted-foreground/50"}`} />
                    <span className={`truncate flex-1 text-left ${hasUnread && !active ? "font-semibold" : ""}`}>
                      {ch.name}
                    </span>

                    {hasUnread && (
                      <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center px-1">
                        {ch.unreadCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Current User Panel — Discord-style bottom bar */}
      <div className="h-[52px] bg-[#080b12] px-2 flex items-center gap-2 border-t border-white/[0.06] flex-shrink-0">
        <div className="relative flex-shrink-0">
          <img src={currentUser.avatar_url} alt="" className="w-8 h-8 rounded-full" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#080b12]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-foreground truncate leading-tight">{currentUser.full_name}</p>
          <p className="text-[10px] text-muted-foreground/60 truncate leading-tight">Online</p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button className="p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            <Mic className="h-3.5 w-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            <Headphones className="h-3.5 w-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

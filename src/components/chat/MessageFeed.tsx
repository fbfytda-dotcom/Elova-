import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Reply, MoreHorizontal, ArrowDown, Hash } from "lucide-react";
import { MessageReactions } from "./MessageReactions";
import { LevelBadge } from "@/components/LevelBadge";
import type { ChatMessage, ChatChannel, LoungeUser } from "@/lib/lounge-data";

// Username colors matching Discord's role color system
const USERNAME_COLORS = [
  "text-[#f47fff]", // pink
  "text-[#1abc9c]", // teal
  "text-[#e91e63]", // rose
  "text-[#3498db]", // blue
  "text-[#e67e22]", // orange
  "text-[#9b59b6]", // purple
  "text-[#2ecc71]", // green
  "text-[#e74c3c]", // red
];

function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  return USERNAME_COLORS[Math.abs(hash) % USERNAME_COLORS.length];
}

interface MessageFeedProps {
  messages: ChatMessage[];
  channel: ChatChannel;
  onReply: (msg: ChatMessage) => void;
  onReactionToggle: (messageId: string, emoji: string) => void;
  onReactionAdd: (messageId: string, emoji: string) => void;
}

function SystemMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-center justify-center py-1 px-4">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground/60">
        <div className="h-px flex-1 bg-white/[0.04]" />
        <span>→ {msg.content}</span>
        <div className="h-px flex-1 bg-white/[0.04]" />
      </div>
    </div>
  );
}

function MessageBubble({
  msg,
  isGrouped,
  onReply,
  onReactionToggle,
  onReactionAdd,
}: {
  msg: ChatMessage;
  isGrouped: boolean;
  onReply: () => void;
  onReactionToggle: (emoji: string) => void;
  onReactionAdd: (emoji: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const colorClass = getUserColor(msg.author.id);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover action bar */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-4 right-4 z-20 flex items-center bg-[#0d1117] border border-white/[0.12] rounded-md shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                const existing = msg.reactions.find((r) => r.emoji === "👍");
                if (existing) onReactionToggle("👍");
                else onReactionAdd("👍");
              }}
              className="px-2 py-1.5 hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors"
              title="React"
            >
              <Smile className="h-4 w-4" />
            </button>
            <button
              onClick={onReply}
              className="px-2 py-1.5 hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors"
              title="Reply"
            >
              <Reply className="h-4 w-4" />
            </button>
            <button
              className="px-2 py-1.5 hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors"
              title="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`flex gap-4 px-4 hover:bg-white/[0.015] transition-colors ${
          isGrouped ? "py-0.5 pl-[72px]" : "pt-3 pb-0.5"
        }`}
      >
        {/* Avatar — only on first message in group */}
        {!isGrouped && (
          <img
            src={msg.author.avatar_url}
            alt=""
            className="w-10 h-10 rounded-full flex-shrink-0 mt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Reply reference */}
          {msg.replyTo && (
            <div className="flex items-center gap-1.5 mb-1 text-[12px]">
              <div className="flex items-center gap-0.5">
                <div className="w-[33px] h-[13px] border-l-2 border-t-2 border-muted-foreground/20 rounded-tl-md ml-[-5px] mr-1" />
                <img src={msg.replyTo.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
                <span className={`font-semibold ${getUserColor(msg.replyTo.author.id)} cursor-pointer hover:underline`}>
                  @{msg.replyTo.author.username}
                </span>
              </div>
              <span className="text-muted-foreground/60 truncate cursor-pointer hover:text-muted-foreground transition-colors">
                {msg.replyTo.content.slice(0, 80)}{msg.replyTo.content.length > 80 ? "..." : ""}
              </span>
            </div>
          )}

          {/* Username + timestamp (first message in group) */}
          {!isGrouped && (
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[14px] font-semibold cursor-pointer hover:underline ${colorClass}`}>
                {msg.author.full_name}
              </span>
              <LevelBadge level={msg.author.english_level} />
              <span className="text-[11px] text-muted-foreground/40">{msg.timestamp}</span>
            </div>
          )}

          {/* Hover timestamp for grouped messages */}
          {isGrouped && hovered && (
            <span className="absolute left-4 text-[10px] text-muted-foreground/30 font-mono select-none" style={{ width: 48, textAlign: "right" }}>
              {msg.timestamp.split(" at ").pop()?.split(" ").slice(0, 2).join(" ") || ""}
            </span>
          )}

          {/* Message content */}
          <div className="text-[14px] text-foreground/90 leading-[1.4] whitespace-pre-wrap break-words">
            {msg.content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </div>

          {/* Reactions */}
          <MessageReactions
            reactions={msg.reactions}
            onToggle={(emoji) => onReactionToggle(emoji)}
            onAdd={(emoji) => onReactionAdd(emoji)}
          />
        </div>
      </div>
    </div>
  );
}

export function MessageFeed({ messages, channel, onReply, onReactionToggle, onReactionAdd }: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom("auto");
  }, [messages.length]);

  // Track scroll position for FAB
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 200);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if messages should be grouped
  const shouldGroup = (curr: ChatMessage, prev: ChatMessage | null): boolean => {
    if (!prev) return false;
    if (curr.isSystem || prev.isSystem) return false;
    if (curr.author.id !== prev.author.id) return false;
    if (curr.replyTo) return false;
    return true;
  };

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
      {/* Channel welcome header */}
      <div className="px-4 pt-16 pb-4">
        <div className="w-[68px] h-[68px] rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
          <Hash className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-[28px] font-extrabold text-foreground mb-1">
          Welcome to #{channel.name}
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          {channel.description}. This is the start of the <span className="font-semibold text-foreground">#{channel.name}</span> channel.
        </p>
        <div className="h-px bg-white/[0.06] mt-6" />
      </div>

      {/* Messages */}
      <div className="pb-2">
        {messages.map((msg, i) => {
          if (msg.isSystem) return <SystemMessage key={msg.id} msg={msg} />;

          const prev = i > 0 ? messages[i - 1] : null;
          const isGrouped = shouldGroup(msg, prev);

          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isGrouped={isGrouped}
              onReply={() => onReply(msg)}
              onReactionToggle={(emoji) => onReactionToggle(msg.id, emoji)}
              onReactionAdd={(emoji) => onReactionAdd(msg.id, emoji)}
            />
          );
        })}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Scroll to bottom FAB */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="fixed bottom-28 right-[calc(240px+1rem+1rem)] z-30 w-9 h-9 rounded-full bg-[#0d1117] border border-white/[0.12] shadow-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

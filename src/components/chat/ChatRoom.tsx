import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Users, Menu, X, Bell, Pin, Search } from "lucide-react";
import { ChannelSidebar } from "./ChannelSidebar";
import { MessageFeed } from "./MessageFeed";
import { MessageInput } from "./MessageInput";
import { MemberSidebar } from "./MemberSidebar";
import {
  mockChannels,
  mockChatMessages,
  loungeUsers,
  type Lounge,
  type ChatMessage,
  type ChatChannel,
} from "@/lib/lounge-data";

const currentUser = loungeUsers[0];

interface ChatRoomProps {
  loungeId: string;
  lounge: Lounge;
}

export function ChatRoom({ loungeId, lounge }: ChatRoomProps) {
  const [activeChannelId, setActiveChannelId] = useState(mockChannels[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [channels, setChannels] = useState<ChatChannel[]>(mockChannels);
  const [replyingTo, setReplyingTo] = useState<ChatMessage["replyTo"] | null>(null);
  const [showMembers, setShowMembers] = useState(true);
  const [showChannels, setShowChannels] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  // Clear unread when switching channels
  useEffect(() => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === activeChannelId ? { ...ch, unreadCount: 0 } : ch))
    );
  }, [activeChannelId]);

  // Simulate typing indicator
  useEffect(() => {
    const timeout = setTimeout(() => {
      const randomUser = loungeUsers[Math.floor(Math.random() * (loungeUsers.length - 1)) + 1];
      setTypingUsers([randomUser.full_name]);
      const clear = setTimeout(() => setTypingUsers([]), 3000);
      return () => clearTimeout(clear);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [messages.length]);

  const handleSend = useCallback(
    (content: string) => {
      const newMsg: ChatMessage = {
        id: "cm-" + Date.now(),
        channelId: activeChannelId,
        author: currentUser,
        content,
        timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }),
        reactions: [],
        replyTo: replyingTo ?? undefined,
      };
      setMessages((prev) => [...prev, newMsg]);
      setReplyingTo(null);
      setTypingUsers([]);
    },
    [activeChannelId, replyingTo]
  );

  const handleReply = useCallback((msg: ChatMessage) => {
    setReplyingTo({
      id: msg.id,
      author: msg.author,
      content: msg.content,
    });
  }, []);

  const handleReactionToggle = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        if (!existing) return m;
        return {
          ...m,
          reactions: existing.reacted
            ? m.reactions
                .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r))
                .filter((r) => r.count > 0)
            : m.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r)),
        };
      })
    );
  }, []);

  const handleReactionAdd = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: m.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r
            ),
          };
        }
        return {
          ...m,
          reactions: [...m.reactions, { emoji, count: 1, reacted: true }],
        };
      })
    );
  }, []);

  return (
    <div className="flex h-[calc(100vh-240px)] min-h-[500px] bg-background rounded-xl overflow-hidden border border-white/[0.06]">
      {/* Mobile channel drawer overlay */}
      <AnimatePresence>
        {showChannels && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setShowChannels(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <ChannelSidebar
                lounge={lounge}
                channels={channels}
                activeChannelId={activeChannelId}
                onChannelSelect={(id) => {
                  setActiveChannelId(id);
                  setShowChannels(false);
                }}
                currentUser={currentUser}
                onClose={() => setShowChannels(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop channel sidebar */}
      <div className="hidden lg:block">
        <ChannelSidebar
          lounge={lounge}
          channels={channels}
          activeChannelId={activeChannelId}
          onChannelSelect={setActiveChannelId}
          currentUser={currentUser}
        />
      </div>

      {/* Center — Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        {/* Channel header bar */}
        <div className="h-12 flex items-center gap-2 px-4 border-b border-white/[0.06] flex-shrink-0 bg-[#0d1117]">
          {/* Mobile hamburger */}
          <button
            onClick={() => setShowChannels(true)}
            className="lg:hidden p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors mr-1"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Hash className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-[15px] font-bold text-foreground">{activeChannel.name}</span>

          <div className="hidden sm:block w-px h-5 bg-white/[0.08] mx-2" />
          <span className="hidden sm:block text-[13px] text-muted-foreground/60 truncate flex-1">
            {activeChannel.description}
          </span>

          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <button className="hidden sm:flex p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <button className="hidden sm:flex p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              <Pin className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowMembers(!showMembers)}
              className={`p-1.5 rounded transition-colors ${
                showMembers
                  ? "bg-white/[0.08] text-foreground"
                  : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/[0.08]"
              }`}
            >
              <Users className="h-4 w-4" />
            </button>
            <button className="hidden sm:flex p-1.5 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <MessageFeed
          messages={channelMessages}
          channel={activeChannel}
          onReply={handleReply}
          onReactionToggle={handleReactionToggle}
          onReactionAdd={handleReactionAdd}
        />

        {/* Input */}
        <MessageInput
          channelName={activeChannel.name}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onSend={handleSend}
          typingUsers={typingUsers}
        />
      </div>

      {/* Member sidebar — desktop only */}
      {showMembers && (
        <div className="hidden lg:block">
          <MemberSidebar members={loungeUsers} />
        </div>
      )}
    </div>
  );
}

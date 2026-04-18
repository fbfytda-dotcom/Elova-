import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Smile, X } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import type { LoungeUser } from "@/lib/lounge-data";

interface MessageInputProps {
  channelName: string;
  replyingTo: { id: string; author: LoungeUser; content: string } | null;
  onCancelReply: () => void;
  onSend: (content: string) => void;
  typingUsers: string[];
}

export function MessageInput({ channelName, replyingTo, onCancelReply, onSend, typingUsers }: MessageInputProps) {
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyingTo) inputRef.current?.focus();
  }, [replyingTo]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [text]);

  return (
    <div className="px-4 pb-4 pt-0 flex-shrink-0">
      {/* Reply preview bar */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0b0f18] rounded-t-lg border border-b-0 border-white/[0.08]">
              <div className="w-0.5 h-5 bg-primary rounded-full flex-shrink-0" />
              <span className="text-[12px] text-muted-foreground">
                Replying to{" "}
                <span className="font-semibold text-primary">@{replyingTo.author.username}</span>
              </span>
              <span className="text-[12px] text-muted-foreground/50 truncate flex-1">
                {replyingTo.content.slice(0, 60)}
                {replyingTo.content.length > 60 ? "..." : ""}
              </span>
              <button
                onClick={onCancelReply}
                className="p-0.5 rounded hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <div
        className={`flex items-end gap-2 bg-[#0f1420] border border-white/[0.08] px-4 py-2.5 transition-all focus-within:border-white/[0.15] ${
          replyingTo ? "rounded-b-lg" : "rounded-lg"
        }`}
      >
        {/* Attach button */}
        <button className="p-1 rounded hover:bg-white/[0.08] text-muted-foreground/60 hover:text-muted-foreground transition-colors flex-shrink-0 mb-0.5">
          <Plus className="h-5 w-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={1}
          className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-[1.4] max-h-[120px] py-0.5"
        />

        {/* Emoji button */}
        <div className="relative flex-shrink-0 mb-0.5">
          <button
            onClick={() => setEmojiOpen(!emojiOpen)}
            className={`p-1 rounded hover:bg-white/[0.08] transition-colors ${
              emojiOpen ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
          >
            <Smile className="h-5 w-5" />
          </button>
          <EmojiPicker
            open={emojiOpen}
            onClose={() => setEmojiOpen(false)}
            onSelect={(emoji) => setText((prev) => prev + emoji)}
          />
        </div>
      </div>

      {/* Typing indicator */}
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 px-4 pt-1">
              <div className="flex items-center gap-[3px]">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-typing-dot-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-typing-dot-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-typing-dot-3" />
              </div>
              <span className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground/80">
                  {typingUsers.join(", ")}
                </span>{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { ChatReaction } from "@/lib/lounge-data";

interface MessageReactionsProps {
  reactions: ChatReaction[];
  onToggle: (emoji: string) => void;
  onAdd: (emoji: string) => void;
}

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🔥", "👀", "🎯", "💯", "🙌"];

export function MessageReactions({ reactions, onToggle, onAdd }: MessageReactionsProps) {
  const [showQuickPicker, setShowQuickPicker] = useState(false);

  if (reactions.length === 0 && !showQuickPicker) return null;

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {reactions.map((r) => (
        <motion.button
          key={r.emoji}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(r.emoji)}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium transition-all border ${
            r.reacted
              ? "bg-primary/15 border-primary/40 text-primary"
              : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:bg-white/[0.08] hover:border-white/[0.15]"
          }`}
        >
          <span className="text-[13px]">{r.emoji}</span>
          <span>{r.count}</span>
        </motion.button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickPicker(!showQuickPicker)}
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
        >
          <Plus className="h-3 w-3" />
        </motion.button>

        {showQuickPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowQuickPicker(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute bottom-full mb-1 left-0 z-50 flex items-center gap-0.5 bg-[#0d1117] border border-white/[0.1] rounded-lg px-1.5 py-1 shadow-xl"
            >
              {QUICK_EMOJIS.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { onAdd(emoji); setShowQuickPicker(false); }}
                  className="w-7 h-7 rounded flex items-center justify-center text-[16px] hover:bg-white/[0.08] transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

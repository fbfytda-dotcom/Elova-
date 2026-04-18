import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  { label: "Smileys", emojis: ["😀","😂","🥹","😍","🤩","😎","🤔","😅","😤","🥺","😭","🤯","🫡","😴","🤗","🫠","😈","💀"] },
  { label: "Gestures", emojis: ["👋","👍","👎","👏","🙌","🤝","💪","🫶","✌️","🤞","🫰","☝️","👀","🧠","❤️","🔥"] },
  { label: "Objects", emojis: ["🎯","💯","🏆","🎙️","📚","📝","📢","🎧","🎮","⚽","🚀","💡","🔖","🎉","✨","⭐"] },
  { label: "Food", emojis: ["🍕","🍣","🍜","🍔","☕","🧋","🍰","🍿","🌮","🥑","🍩","🍫"] },
  { label: "Nature", emojis: ["🌱","🌸","🌊","⚡","🌙","☀️","🌈","🍀","🐱","🦊","🐧","🦋"] },
  { label: "Symbols", emojis: ["❤️","💜","💙","💚","🧡","💛","🤍","🖤","💔","❣️","💕","💞"] },
];

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const filteredCategories = search.trim()
    ? [{ label: "Results", emojis: EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter(() => true) }] // show all when searching (native emoji search isn't practical)
    : EMOJI_CATEGORIES;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full mb-2 left-0 w-[352px] bg-[#0d1117] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.07]">
            <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emoji..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          {!search.trim() && (
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.05] overflow-x-auto">
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(i)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                    activeCategory === i
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {cat.emojis[0]} {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div className="max-h-[260px] overflow-y-auto p-2">
            {(search.trim() ? filteredCategories : [EMOJI_CATEGORIES[activeCategory]]).map((cat) => (
              <div key={cat.label}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold px-1 py-1.5">
                  {cat.label}
                </p>
                <div className="grid grid-cols-8 gap-0.5">
                  {cat.emojis.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { onSelect(emoji); onClose(); }}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xl hover:bg-white/[0.08] transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

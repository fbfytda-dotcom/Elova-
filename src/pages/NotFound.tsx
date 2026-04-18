
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Mic } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Glowing orb */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.4)]">
          <Mic className="h-12 w-12 text-white" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-primary/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[64px] font-extrabold gradient-text leading-none mb-2"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[18px] font-bold text-foreground mb-2"
      >
        This room does not exist
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[14px] text-muted-foreground mb-8 max-w-[280px] leading-relaxed"
      >
        The page you are looking for has left the conversation or never joined.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-[15px] hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(124,58,237,0.4)]"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </motion.button>
    </div>
  );
}

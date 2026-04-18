
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneOff, Mic, MicOff, Hand, MessageSquare,
  Users, Settings, ChevronDown, Send, Share2,
  Volume2, VolumeX, Crown, BadgeCheck, Menu,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";
import { sampleRooms, loungeUsers } from "@/lib/lounge-data";

interface VoiceRoomPageProps { onMenuOpen?: () => void; }

const currentUser = loungeUsers[0];

const MODE_INFO: Record<string, { label: string; color: string; desc: string }> = {
  "Open Floor": { label: "Open Floor", color: "text-green-400",  desc: "Anyone can unmute and speak" },
  "Debate":     { label: "Debate",     color: "text-orange-400", desc: "Structured debate with turn timer" },
  "Teach Me":   { label: "Teach Me",   color: "text-blue-400",   desc: "One speaker, others ask questions" },
  "Hot Seat":   { label: "Hot Seat",   color: "text-purple-400", desc: "One person answers room questions" },
};

interface ChatMessage {
  id: string;
  content: string;
  author: typeof loungeUsers[0];
  time: string;
}

const INITIAL_CHAT: ChatMessage[] = [
  { id: "c1", content: "Great topic today!", author: loungeUsers[1], time: "9:15 AM" },
  { id: "c2", content: "Agreed. I have been thinking about this a lot.", author: loungeUsers[4], time: "9:16 AM" },
  { id: "c3", content: "Can we also discuss the impact on mental health?", author: loungeUsers[3], time: "9:17 AM" },
];

function SpeakerAvatar({
  user, isSpeaking, isMuted, isHost, size = "md",
}: {
  user: typeof loungeUsers[0];
  isSpeaking?: boolean;
  isMuted?: boolean;
  isHost?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const s = size === "lg" ? "w-20 h-20" : size === "md" ? "w-14 h-14" : "w-10 h-10";
  const ring = size === "lg" ? "p-[3px]" : "p-[2px]";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        {/* Speaking ring */}
        <div className={"rounded-full " + ring + " " + (isSpeaking ? "bg-gradient-to-br from-primary to-accent shadow-[0_0_16px_rgba(124,58,237,0.5)]" : "bg-white/10")}>
          <img
            src={user.avatar_url}
            alt=""
            className={"rounded-full object-cover bg-card " + s + (isMuted ? " opacity-60 grayscale" : "")}
          />
        </div>
        {/* Speaking animation */}
        {isSpeaking && !isMuted && (
          <motion.div
            className="absolute -inset-1.5 rounded-full border-2 border-primary/40"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {/* Host crown */}
        {isHost && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <Crown className="h-4 w-4 text-amber-400 drop-shadow" />
          </div>
        )}
        {/* Muted icon */}
        {isMuted && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
            <MicOff className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <p className="text-[11px] font-semibold text-foreground text-center max-w-[72px] truncate">{user.full_name.split(" ")[0]}</p>
      <LevelBadge level={user.english_level} />
    </div>
  );
}

export default function VoiceRoomPage({ onMenuOpen = () => {} }: VoiceRoomPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [speakingUser, setSpeakingUser] = useState<string | null>("u2");
  const [elapsed, setElapsed] = useState(0);
  const [deaf, setDeaf] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Find room from sampleRooms or use a default
  const room = sampleRooms.find((r) => r.id === id) ?? {
    id: id ?? "r1",
    name: "Is remote work killing company culture?",
    loungeId: "l1",
    loungeName: "Daily Debate",
    host: loungeUsers[0],
    participants: loungeUsers.slice(0, 4),
    maxParticipants: 8,
    mode: "Debate" as const,
    topic: "Remote work",
    isLive: true,
  };

  const modeInfo = MODE_INFO[room.mode] ?? MODE_INFO["Open Floor"];

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate random speaker switching
  useEffect(() => {
    const t = setInterval(() => {
      const speakers = room.participants.map((p) => p.id);
      setSpeakingUser(speakers[Math.floor(Math.random() * speakers.length)]);
    }, 3500);
    return () => clearInterval(t);
  }, [room.participants]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const sendChat = () => {
    if (!chatText.trim()) return;
    setChatMessages((prev) => [...prev, { id: "c" + Date.now(), content: chatText, author: currentUser, time: "Now" }]);
    setChatText("");
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const meInRoom = room.participants[0];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Room info */}
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-[11px] text-green-400 font-bold uppercase tracking-wide">Live · {fmt(elapsed)}</span>
              <span className={"text-[11px] font-bold " + modeInfo.color}>· {modeInfo.label}</span>
            </div>
            <p className="text-[14px] font-bold text-foreground leading-tight line-clamp-1">{room.name}</p>
            <p className="text-[11px] text-muted-foreground">{room.loungeName} · {room.participants.length}/{room.maxParticipants} speakers</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setChatOpen(!chatOpen)} className={"p-2 rounded-full transition-colors relative " + (chatOpen ? "bg-primary/20 text-primary" : "hover:bg-white/8 text-muted-foreground")}>
              <MessageSquare className="h-5 w-5" />
              {chatMessages.length > 0 && !chatOpen && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
            </button>
            <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-white/8 text-muted-foreground transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Stage */}
        <div className="flex-1 px-4 pt-6 pb-4">

          {/* Mode badge */}
          <div className="flex justify-center mb-6">
            <div className={"px-4 py-2 rounded-full bg-white/5 border border-white/[0.08] flex items-center gap-2"}>
              <span className={"text-[12px] font-bold " + modeInfo.color}>{modeInfo.label}</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-[12px] text-muted-foreground">{modeInfo.desc}</span>
            </div>
          </div>

          {/* Current speaker — prominent center */}
          <AnimatePresence mode="wait">
            {speakingUser && (() => {
              const speaker = room.participants.find((p) => p.id === speakingUser) ?? room.participants[0];
              return (
                <motion.div
                  key={speakingUser}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center mb-8"
                >
                  <div className="relative mb-3">
                    {/* Outer pulse */}
                    <motion.div
                      className="absolute -inset-4 rounded-full bg-primary/10"
                      animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-primary/15"
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                    />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] shadow-[0_0_32px_rgba(124,58,237,0.5)]">
                      <img src={speaker.avatar_url} alt="" className="w-full h-full rounded-full object-cover bg-card" />
                      {speaker.id === room.host.id && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Crown className="h-5 w-5 text-amber-400 drop-shadow" /></div>
                      )}
                    </div>
                  </div>
                  <p className="text-[17px] font-extrabold text-foreground">{speaker.full_name}</p>
                  <p className="text-[12px] text-muted-foreground mb-2">@{speaker.username} · Speaking now</p>
                  <LevelBadge level={speaker.english_level} size="md" />

                  {/* Sound wave */}
                  <div className="flex items-center gap-1 mt-4">
                    {[3, 5, 8, 5, 3, 6, 9, 6, 3].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{ height: [h, h * 2.5, h] }}
                        transition={{ duration: 0.5 + i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* All participants grid */}
          <div className="flex flex-wrap justify-center gap-5">
            {room.participants.map((participant) => (
              <SpeakerAvatar
                key={participant.id}
                user={participant}
                isSpeaking={speakingUser === participant.id}
                isMuted={participant.id === currentUser.id && muted}
                isHost={participant.id === room.host.id}
                size="sm"
              />
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, room.maxParticipants - room.participants.length - 1) }).slice(0, 3).map((_, i) => (
              <div key={"empty-" + i} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white/20" />
                </div>
                <p className="text-[11px] text-muted-foreground/40">Empty</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTROLS ── */}
        <div className="px-4 pb-6 pt-2">
          {/* Hand raised banner */}
          <AnimatePresence>
            {handRaised && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="mb-4 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center gap-2"
              >
                <Hand className="h-4 w-4 text-amber-400" />
                <p className="text-[13px] text-amber-300 font-semibold">Your hand is raised — waiting to speak</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-5">
            {/* Deaf toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setDeaf(!deaf)}
              className={"w-12 h-12 rounded-full border flex items-center justify-center transition-all " + (deaf ? "bg-destructive/20 border-destructive/30 text-destructive" : "bg-white/[0.07] border-white/[0.1] text-muted-foreground hover:text-foreground")}
            >
              {deaf ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.button>

            {/* Mic toggle — primary action */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setMuted(!muted)}
              className={"w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg " + (muted ? "bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-primary shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:bg-primary/90")}
            >
              {muted ? <MicOff className="h-7 w-7 text-white" /> : <Mic className="h-7 w-7 text-white" />}
            </motion.button>

            {/* Hand raise */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setHandRaised(!handRaised)}
              className={"w-12 h-12 rounded-full border flex items-center justify-center transition-all " + (handRaised ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-white/[0.07] border-white/[0.1] text-muted-foreground hover:text-foreground")}
            >
              <Hand className="h-5 w-5" />
            </motion.button>

            {/* Leave */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/25 flex items-center justify-center text-destructive hover:bg-destructive/25 transition-colors"
            >
              <PhoneOff className="h-5 w-5" />
            </motion.button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground/50 mt-3">
            {muted ? "You are muted" : "You are live"} · {fmt(elapsed)}
          </p>
        </div>
      </div>

      {/* ── CHAT DRAWER ── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[#0d1117] border-t border-white/[0.1] rounded-t-3xl shadow-2xl"
            style={{ maxHeight: "65vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.07]">
              <p className="text-[14px] font-bold text-foreground">Room Chat</p>
              <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-full hover:bg-white/8 text-muted-foreground transition-colors">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: "calc(65vh - 130px)" }}>
              {chatMessages.map((msg) => {
                const isMe = msg.author.id === currentUser.id;
                return (
                  <div key={msg.id} className={"flex gap-2.5 " + (isMe ? "flex-row-reverse" : "")}>
                    <img src={msg.author.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0" />
                    <div className={"max-w-[75%] " + (isMe ? "items-end" : "items-start") + " flex flex-col gap-0.5"}>
                      {!isMe && <p className="text-[11px] font-bold text-muted-foreground px-1">{msg.author.full_name.split(" ")[0]}</p>}
                      <div className={"px-3 py-2 rounded-2xl text-[13px] leading-relaxed " + (isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white/[0.07] border border-white/[0.08] text-foreground/90 rounded-tl-sm")}>
                        {msg.content}
                      </div>
                      <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat input */}
            <div className="px-4 py-3 border-t border-white/[0.07] flex items-center gap-2">
              <img src={currentUser.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0" />
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/40 transition-colors">
                <input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                  placeholder="Message the room..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={sendChat}
                  disabled={!chatText.trim()}
                  className={"w-7 h-7 rounded-full flex items-center justify-center transition-all " + (chatText.trim() ? "bg-primary text-white" : "bg-white/5 text-muted-foreground cursor-not-allowed")}
                >
                  <Send className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

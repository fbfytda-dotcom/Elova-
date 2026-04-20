// VoiceRoomPage.tsx — Premium Audio Room Experience for Elova
// Design System: Violet primary (#7C3AED), Cyan accent (#06B6D4), Navy bg (#0B0F19)

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

interface Participant {
  id: string;
  name: string;
  initials: string;
  isSpeaking: boolean;
  isMuted: boolean;
  volume: number;
  role: "host" | "speaker" | "listener";
  color: string;
  hasHandUp?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  color: string;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  createdAt: number;
}

interface VoiceRoomPageProps {
  roomName?: string;
  participants?: Participant[];
  currentUser?: Participant;
  onLeave?: () => void;
  messages?: ChatMessage[];
  onSendMessage?: (text: string) => void;
  onMenuOpen?: () => void;
}

// ════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════

const SPEAKER_PALETTE = [
  "#7c3aed", "#8b5cf6", "#06b6d4", "#22d3ee",
  "#10b981", "#34d399", "#f43f5e", "#3b82f6",
];

const REACTION_EMOJIS = ["❤️", "🔥", "👏", "😂", "💯", "✨", "🙌", "🤩"];

const DEMO_SPEAKERS: Participant[] = [
  { id: "s1", name: "Sarah Chen", initials: "SC", isSpeaking: true, isMuted: false, volume: 0.8, role: "host", color: "#7c3aed" },
  { id: "s2", name: "Alex Rivera", initials: "AR", isSpeaking: false, isMuted: false, volume: 0, role: "speaker", color: "#06b6d4" },
  { id: "s3", name: "Priya Sharma", initials: "PS", isSpeaking: false, isMuted: false, volume: 0, role: "speaker", color: "#10b981" },
  { id: "s4", name: "Marcus Johnson", initials: "MJ", isSpeaking: false, isMuted: true, volume: 0, role: "speaker", color: "#3b82f6" },
];

const DEMO_AUDIENCE: Participant[] = [
  { id: "a1", name: "Yuki Tanaka", initials: "YT", isSpeaking: false, isMuted: true, volume: 0, role: "listener", color: "#f43f5e" },
  { id: "a2", name: "Emma Wilson", initials: "EW", isSpeaking: false, isMuted: true, volume: 0, role: "listener", color: "#8b5cf6", hasHandUp: true },
  { id: "a3", name: "Diego Santos", initials: "DS", isSpeaking: false, isMuted: true, volume: 0, role: "listener", color: "#22d3ee" },
  { id: "a4", name: "Leah Kim", initials: "LK", isSpeaking: false, isMuted: true, volume: 0, role: "listener", color: "#34d399" },
  { id: "a5", name: "Omar Hassan", initials: "OH", isSpeaking: false, isMuted: true, volume: 0, role: "listener", color: "#7c3aed", hasHandUp: true },
  { id: "a6", name: "Nina Petrov", initials: "NP", isSpeaking: false, isMuted: true, volume: 0, role: "listener", color: "#06b6d4" },
];

const DEMO_MESSAGES: ChatMessage[] = [
  { id: "m1", userId: "a1", userName: "Yuki", text: "This topic is so interesting!", timestamp: Date.now() - 120000, color: "#f43f5e" },
  { id: "m2", userId: "s2", userName: "Alex", text: "Absolutely, language evolution fascinates me", timestamp: Date.now() - 90000, color: "#06b6d4" },
  { id: "m3", userId: "a3", userName: "Diego", text: "Can you talk about Portuguese variations? 🇧🇷🇵🇹", timestamp: Date.now() - 60000, color: "#22d3ee" },
  { id: "m4", userId: "s1", userName: "Sarah", text: "Great question Diego! We'll get to that next 🎉", timestamp: Date.now() - 30000, color: "#7c3aed" },
];

// ════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 124, g: 58, b: 237 };
}

function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r},${g},${bl})`;
}

// ════════════════════════════════════════════════════════════
// CUSTOM HOOKS
// ════════════════════════════════════════════════════════════

function useTimer(): { elapsed: number; formatted: string } {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  return { elapsed: seconds, formatted: formatTime(seconds) };
}

function useAudioSimulation(speakers: Participant[]): Record<string, number> {
  const [levels, setLevels] = useState<Record<string, number>>({});
  const prevLevels = useRef<Record<string, number>>({});

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const next: Record<string, number> = {};
      const t = Date.now() / 1000;
      speakers.forEach((s) => {
        const prev = prevLevels.current[s.id] || 0;
        if (s.isSpeaking && !s.isMuted) {
          const seed = parseInt(s.id.replace(/\D/g, "") || "1");
          const raw = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 4.2 + seed * 1.7)) * (0.6 + 0.4 * Math.sin(t * 7.1 + seed * 2.3));
          next[s.id] = Math.max(0.05, Math.min(1, prev + (raw - prev) * 0.3));
        } else {
          next[s.id] = prev * 0.85;
        }
      });
      prevLevels.current = next;
      setLevels(next);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [speakers]);
  return levels;
}

function useSpeakerRotation(speakers: Participant[], intervalMs: number = 4500): number {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (speakers.length <= 1) return;
    const iv = setInterval(() => setActiveIdx((i) => (i + 1) % speakers.length), intervalMs);
    return () => clearInterval(iv);
  }, [speakers.length, intervalMs]);
  return activeIdx;
}

// ════════════════════════════════════════════════════════════
// AMBIENT BACKGROUND CANVAS
// ════════════════════════════════════════════════════════════

class OrbEntity {
  x: number; y: number; radius: number; currentColor: string;
  angle: number; speed: number; opacity: number; targetOpacity: number;

  constructor(w: number, h: number, color: string, idx: number) {
    this.radius = Math.max(150, Math.min(w, h) * (0.25 + Math.random() * 0.2));
    this.x = w * (0.2 + Math.random() * 0.6);
    this.y = h * (0.2 + Math.random() * 0.6);
    this.currentColor = color;
    this.angle = (idx * Math.PI * 2) / 5 + Math.random() * 0.5;
    this.speed = 0.001 + Math.random() * 0.002;
    this.opacity = 0.1;
    this.targetOpacity = 0.1;
  }

  update(w: number, h: number, targetColor: string, energy: number) {
    this.angle += this.speed;
    this.x += Math.sin(this.angle) * 0.4;
    this.y += Math.cos(this.angle * 0.7) * 0.25;
    this.x = Math.max(this.radius * 0.3, Math.min(w - this.radius * 0.3, this.x));
    this.y = Math.max(this.radius * 0.3, Math.min(h - this.radius * 0.3, this.y));
    this.currentColor = lerpColor(this.currentColor, targetColor, 0.008);
    this.targetOpacity = 0.06 + energy * 0.14;
    this.opacity += (this.targetOpacity - this.opacity) * 0.04;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const rgb = hexToRgb(this.currentColor);
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${this.opacity})`);
    g.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${this.opacity * 0.35})`);
    g.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const AmbientCanvas: React.FC<{ activeColor: string; energy: number }> = ({ activeColor, energy }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<OrbEntity[]>([]);
  const rafRef = useRef(0);
  const colorRef = useRef(activeColor);
  const energyRef = useRef(energy);

  useEffect(() => { colorRef.current = activeColor; }, [activeColor]);
  useEffect(() => { energyRef.current = energy; }, [energy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    orbsRef.current = SPEAKER_PALETTE.slice(0, 5).map(
      (c, i) => new OrbEntity(window.innerWidth, window.innerHeight, c, i)
    );

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.fillStyle = "rgba(11,15,25,0.25)";
      ctx.fillRect(0, 0, w, h);
      orbsRef.current.forEach((orb, i) => {
        const color = i === 0 ? colorRef.current : lerpColor(colorRef.current, orb.currentColor, 0.6 + i * 0.1);
        orb.update(w, h, color, energyRef.current);
        orb.draw(ctx);
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};

// ════════════════════════════════════════════════════════════
// WAVEFORM VISUALIZER
// ════════════════════════════════════════════════════════════

const WaveformVisualizer: React.FC<{
  audioLevels: Record<string, number>;
  activeColor: string;
  speakerCount: number;
}> = ({ audioLevels, activeColor, speakerCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      phaseRef.current += 0.02;

      const totalEnergy = Object.values(audioLevels).reduce((sum, v) => sum + v, 0);
      const avgEnergy = speakerCount > 0 ? totalEnergy / speakerCount : 0;

      for (let layer = 0; layer < 3; layer++) {
        const layerOpacity = [0.35, 0.2, 0.1][layer];
        const layerAmp = [1, 0.65, 0.35][layer];
        const layerPhase = [0, 1.2, 2.5][layer];

        ctx.beginPath();
        ctx.moveTo(0, h);
        const segs = 120;
        for (let i = 0; i <= segs; i++) {
          const x = (i / segs) * w;
          const nx = i / segs;
          const w1 = Math.sin(nx * Math.PI * 4 + phaseRef.current * 2 + layerPhase) * 0.5;
          const w2 = Math.sin(nx * Math.PI * 6 + phaseRef.current * 1.5 + layerPhase) * 0.3;
          const w3 = Math.sin(nx * Math.PI * 2 + phaseRef.current * 0.8 + layerPhase) * 0.2;
          const combined = (w1 + w2 + w3) * layerAmp;
          const amplitude = (0.1 + avgEnergy * 0.6) * h;
          const y = h - (0.2 + combined * 0.5 + 0.5) * amplitude;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const rgb = hexToRgb(activeColor);
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${layerOpacity})`);
        gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0.02)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [audioLevels, activeColor, speakerCount]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
};

// ════════════════════════════════════════════════════════════
// SVG ICONS
// ════════════════════════════════════════════════════════════

const IconMicOn: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const IconMicOff: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const IconChat: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconHand: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

const IconLeave: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const IconSend: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconUsers: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconClock: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconClose: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

const IconCrown: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
    <path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7zm3 14h14v2H5v-2z" />
  </svg>
);

// ════════════════════════════════════════════════════════════
// SPEAKER CARD
// ════════════════════════════════════════════════════════════

const SpeakerCard: React.FC<{
  participant: Participant;
  audioLevel: number;
  isLarge?: boolean;
  animDelay?: number;
}> = ({ participant, audioLevel, isLarge = false, animDelay = 0 }) => {
  const avatarSize = isLarge ? 72 : 56;
  const rgb = hexToRgb(participant.color);
  const isSpeaking = participant.isSpeaking && !participant.isMuted;
  const glowIntensity = isSpeaking ? 0.3 + audioLevel * 0.4 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2"
      style={{ width: isLarge ? 120 : 100 }}
    >
      <div className="relative" style={{ width: avatarSize + 32, height: avatarSize + 32 }}>
        {/* Outer glow */}
        <motion.div
          animate={{ opacity: glowIntensity, scale: 1 + audioLevel * 0.15 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, rgba(${rgb.r},${rgb.g},${rgb.b},0.3) 0%, transparent 70%)`, filter: "blur(8px)" }}
        />

        {/* Animated rings */}
        {isSpeaking && (
          <>
            <motion.div animate={{ scale: [1, 1.3 + audioLevel * 0.3, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }} className="absolute inset-0 rounded-full border-2" style={{ borderColor: participant.color }} />
            <motion.div animate={{ scale: [1, 1.5 + audioLevel * 0.4, 1], opacity: [0.25, 0, 0.25] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }} className="absolute inset-0 rounded-full border" style={{ borderColor: participant.color }} />
          </>
        )}

        {/* Avatar */}
        <motion.div
          animate={{ scale: isSpeaking ? 1 + audioLevel * 0.04 : 1 }}
          transition={{ duration: 0.1 }}
          className="absolute rounded-full flex items-center justify-center font-bold text-white"
          style={{
            width: avatarSize, height: avatarSize, top: 16, left: 16,
            background: `linear-gradient(135deg, ${participant.color}, ${lerpColor(participant.color, "#000000", 0.4)})`,
            boxShadow: isSpeaking ? `0 0 20px rgba(${rgb.r},${rgb.g},${rgb.b},0.4), inset 0 2px 4px rgba(255,255,255,0.2)` : `0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15)`,
            fontSize: avatarSize * 0.3,
            letterSpacing: "0.05em",
          }}
        >
          {participant.initials}
        </motion.div>

        {/* Mute overlay */}
        {participant.isMuted && (
          <div className="absolute rounded-full flex items-center justify-center" style={{ width: avatarSize, height: avatarSize, top: 16, left: 16, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
            <IconMicOff size={20} color="#ef4444" />
          </div>
        )}

        {/* Host crown */}
        {participant.role === "host" && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
            <IconCrown size={18} color={participant.color} />
          </div>
        )}

        {/* Speaking dot */}
        {isSpeaking && (
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="absolute bottom-1 right-3 w-3 h-3 rounded-full" style={{ background: participant.color, boxShadow: `0 0 6px ${participant.color}` }} />
        )}
      </div>

      <div className="text-center">
        <p className="font-semibold text-white truncate" style={{ fontSize: isLarge ? 14 : 12, maxWidth: isLarge ? 120 : 100, textShadow: isSpeaking ? `0 0 12px rgba(${rgb.r},${rgb.g},${rgb.b},0.4)` : "none" }}>
          {participant.name.split(" ")[0]}
        </p>
        <p className="truncate" style={{ fontSize: 10, color: isSpeaking ? participant.color : "rgba(255,255,255,0.4)", maxWidth: isLarge ? 120 : 100 }}>
          {participant.role === "host" ? "Host" : participant.isMuted ? "Muted" : "Speaker"}
        </p>
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════
// AUDIENCE MEMBER
// ════════════════════════════════════════════════════════════

const AudienceMember: React.FC<{ participant: Participant; index: number }> = ({ participant, index }) => {
  const rgb = hexToRgb(participant.color);
  return (
    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="relative group cursor-pointer">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${participant.color}, ${lerpColor(participant.color, "#000000", 0.5)})`, boxShadow: `0 2px 8px rgba(${rgb.r},${rgb.g},${rgb.b},0.2)`, fontSize: 11 }}>
        {participant.initials}
      </div>
      {participant.hasHandUp && (
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center" style={{ fontSize: 9 }}>✋</motion.div>
      )}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" style={{ background: "rgba(0,0,0,0.8)", color: "white", backdropFilter: "blur(4px)" }}>
        {participant.name.split(" ")[0]}
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════
// CHAT PANEL
// ════════════════════════════════════════════════════════════

const ChatPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}> = ({ isOpen, onClose, messages, onSend }) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = () => { if (input.trim()) { onSend(input.trim()); setInput(""); } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-80 z-40 flex flex-col"
          style={{ background: "rgba(11,15,25,0.88)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="font-semibold text-white" style={{ fontSize: 15, letterSpacing: "0.02em" }}>Room Chat</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <IconClose size={18} color="rgba(255,255,255,0.6)" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            {messages.map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-semibold" style={{ fontSize: 12, color: msg.color }}>{msg.userName}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{formatTime(Math.floor((Date.now() - msg.timestamp) / 1000))}</span>
                </div>
                <p className="leading-relaxed" style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{msg.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Say something..." className="flex-1 bg-transparent outline-none text-white placeholder-white/30" style={{ fontSize: 13 }} />
              <button onClick={handleSend} disabled={!input.trim()} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: input.trim() ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(255,255,255,0.05)", opacity: input.trim() ? 1 : 0.4 }}>
                <IconSend size={14} color="#fff" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ════════════════════════════════════════════════════════════
// REACTIONS
// ════════════════════════════════════════════════════════════

const ReactionOverlay: React.FC<{ reactions: FloatingReaction[] }> = ({ reactions }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
    <AnimatePresence>
      {reactions.map((reaction) => (
        <motion.div
          key={reaction.id}
          initial={{ x: reaction.x, y: reaction.y, scale: 0, opacity: 1 }}
          animate={{ y: reaction.y - 300, scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute"
          style={{ fontSize: 28 }}
        >
          {reaction.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const ReactionPicker: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}> = ({ isOpen, onClose, onSelect }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(16,21,32,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          {REACTION_EMOJIS.map((emoji, i) => (
            <motion.button key={emoji} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.85 }} onClick={() => onSelect(emoji)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors" style={{ fontSize: 22 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              {emoji}
            </motion.button>
          ))}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ════════════════════════════════════════════════════════════
// LEAVE MODAL
// ════════════════════════════════════════════════════════════

const LeaveModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 rounded-2xl p-6 text-center"
          style={{ background: "rgba(16,21,32,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
        >
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
            <IconLeave size={24} color="#ef4444" />
          </div>
          <h3 className="text-white font-semibold mb-2" style={{ fontSize: 18 }}>Leave Room?</h3>
          <p className="mb-6" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>You'll be removed from this conversation. You can rejoin later.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-medium transition-colors" style={{ fontSize: 14, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>Stay</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-medium transition-all" style={{ fontSize: 14, background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }}>Leave</button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ════════════════════════════════════════════════════════════
// STATUS BAR
// ════════════════════════════════════════════════════════════

const RoomStatusBar: React.FC<{
  roomName: string;
  participantCount: number;
  formattedTime: string;
  activeColor: string;
}> = ({ roomName, participantCount, formattedTime, activeColor }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center justify-between px-5 py-3 relative z-10"
    style={{ background: "rgba(11,15,25,0.55)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
  >
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full" style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
      <span className="font-semibold text-white" style={{ fontSize: 15, letterSpacing: "0.01em" }}>{roomName}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <IconUsers size={14} color="rgba(255,255,255,0.4)" />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{participantCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <IconClock size={14} color="rgba(255,255,255,0.4)" />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums", fontFamily: "ui-monospace, monospace" }}>{formattedTime}</span>
      </div>
    </div>
  </motion.div>
);

// ════════════════════════════════════════════════════════════
// CONTROL BAR
// ════════════════════════════════════════════════════════════

const ControlBar: React.FC<{
  isMuted: boolean;
  onToggleMute: () => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onToggleReactions: () => void;
  hasHandUp: boolean;
  onToggleHand: () => void;
  onLeave: () => void;
  unreadCount: number;
}> = ({ isMuted, onToggleMute, isChatOpen, onToggleChat, onToggleReactions, hasHandUp, onToggleHand, onLeave, unreadCount }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center justify-center gap-4 px-6 py-4 relative z-10"
    style={{ background: "rgba(11,15,25,0.65)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
  >
    {/* Mic */}
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={onToggleMute} className="w-14 h-14 rounded-full flex items-center justify-center transition-all" style={{ background: isMuted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)", border: isMuted ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.07)", boxShadow: isMuted ? "0 0 20px rgba(239,68,68,0.15)" : "0 4px 15px rgba(0,0,0,0.2)" }}>
      {isMuted ? <IconMicOff size={22} color="#ef4444" /> : <IconMicOn size={22} color="white" />}
    </motion.button>

    {/* Chat */}
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={onToggleChat} className="w-14 h-14 rounded-full flex items-center justify-center relative" style={{ background: isChatOpen ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.08)", border: isChatOpen ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
      <IconChat size={22} color={isChatOpen ? "#a78bfa" : "white"} />
      {unreadCount > 0 && !isChatOpen && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ fontSize: 10, color: "white", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          {unreadCount}
        </motion.div>
      )}
    </motion.button>

    {/* Reactions */}
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={onToggleReactions} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <span style={{ fontSize: 22 }}>😊</span>
    </motion.button>

    {/* Hand */}
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={onToggleHand} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: hasHandUp ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.08)", border: hasHandUp ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
      <IconHand size={22} color={hasHandUp ? "#a78bfa" : "white"} />
    </motion.button>

    {/* Leave */}
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={onLeave} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
      <IconLeave size={22} color="#ef4444" />
    </motion.button>
  </motion.div>
);

// ════════════════════════════════════════════════════════════
// MAIN VOICE ROOM PAGE
// ════════════════════════════════════════════════════════════

const VoiceRoomPage: React.FC<VoiceRoomPageProps> = ({
  roomName = "English Conversation Circle",
  participants: externalParticipants,
  currentUser,
  onLeave: externalOnLeave,
  messages: externalMessages,
  onSendMessage: externalOnSendMessage,
  onMenuOpen,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [hasHandUp, setHasHandUp] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(externalMessages || DEMO_MESSAGES);

  const [speakers, setSpeakers] = useState<Participant[]>(
    externalParticipants?.filter((p) => p.role !== "listener") || DEMO_SPEAKERS
  );
  const [audience, setAudience] = useState<Participant[]>(
    externalParticipants?.filter((p) => p.role === "listener") || DEMO_AUDIENCE
  );

  const activeSpeakerIdx = useSpeakerRotation(speakers);

  useEffect(() => {
    if (externalParticipants) return;
    const iv = setInterval(() => {
      setSpeakers((prev) =>
        prev.map((s, i) => ({ ...s, isSpeaking: i === activeSpeakerIdx, volume: i === activeSpeakerIdx ? 0.6 + Math.random() * 0.4 : 0 }))
      );
    }, 400);
    return () => clearInterval(iv);
  }, [activeSpeakerIdx, externalParticipants]);

  const timer = useTimer();
  const audioLevels = useAudioSimulation(speakers);

  const activeColor = useMemo(() => {
    const speaking = speakers.find((s) => s.isSpeaking && !s.isMuted);
    return speaking?.color || "#7c3aed";
  }, [speakers]);

  const totalEnergy = useMemo(
    () => Object.values(audioLevels).reduce((sum, v) => sum + v, 0),
    [audioLevels]
  );

  const handleReaction = useCallback((emoji: string) => {
    const newReaction: FloatingReaction = {
      id: `r-${Date.now()}-${Math.random()}`,
      emoji,
      x: 100 + Math.random() * (window.innerWidth - 200),
      y: window.innerHeight - 150,
      createdAt: Date.now(),
    };
    setReactions((prev) => [...prev, newReaction]);
    setIsReactionPickerOpen(false);
    setTimeout(() => { setReactions((prev) => prev.filter((r) => r.id !== newReaction.id)); }, 3000);
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (externalOnSendMessage) { externalOnSendMessage(text); return; }
      setChatMessages((prev) => [...prev, { id: `m-${Date.now()}`, userId: "current", userName: "You", text, timestamp: Date.now(), color: "#7c3aed" }]);
    },
    [externalOnSendMessage]
  );

  const handleLeave = useCallback(() => {
    if (externalOnLeave) { externalOnLeave(); } else { setShowLeaveModal(false); window.history.back(); }
  }, [externalOnLeave]);

  const speakerCount = speakers.length;
  const isSmallStage = speakerCount <= 3;

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{
        background: "#0B0F19",
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <AmbientCanvas activeColor={activeColor} energy={totalEnergy * 0.15} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <RoomStatusBar roomName={roomName} participantCount={speakers.length + audience.length} formattedTime={timer.formatted} activeColor={activeColor} />

      <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor, boxShadow: `0 0 6px ${activeColor}` }} />
            <span className="uppercase tracking-widest font-medium" style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em" }}>On Stage</span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor, boxShadow: `0 0 6px ${activeColor}` }} />
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6" style={{ maxWidth: isSmallStage ? 500 : 700 }}>
            {speakers.map((speaker, i) => (
              <SpeakerCard key={speaker.id} participant={speaker} audioLevel={audioLevels[speaker.id] || 0} isLarge={isSmallStage} animDelay={i * 0.1} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="w-full mt-8" style={{ maxWidth: 700, height: 60 }}>
            <WaveformVisualizer audioLevels={audioLevels} activeColor={activeColor} speakerCount={speakerCount} />
          </motion.div>
        </div>

        {audience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="px-6 py-3"
            style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider font-medium" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>In the Room</span>
                <span className="px-1.5 py-0.5 rounded-md font-medium" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>{audience.length}</span>
              </div>
              {audience.some((a) => a.hasHandUp) && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)" }}>
                  <span style={{ fontSize: 12 }}>✋</span>
                  <span className="font-medium" style={{ fontSize: 11, color: "#a78bfa" }}>{audience.filter((a) => a.hasHandUp).length} raised</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {audience.slice(0, 12).map((member, i) => (
                <AudienceMember key={member.id} participant={member} index={i} />
              ))}
              {audience.length > 12 && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: 11, border: "1px solid rgba(255,255,255,0.07)" }}>+{audience.length - 12}</div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Hand raise banner */}
      <AnimatePresence>
        {hasHandUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(12px)" }}
          >
            <span style={{ fontSize: 14 }}>✋</span>
            <span className="font-medium" style={{ fontSize: 13, color: "#a78bfa" }}>Hand raised</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ControlBar
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleReactions={() => setIsReactionPickerOpen(!isReactionPickerOpen)}
        hasHandUp={hasHandUp}
        onToggleHand={() => setHasHandUp(!hasHandUp)}
        onLeave={() => setShowLeaveModal(true)}
        unreadCount={isChatOpen ? 0 : chatMessages.length - DEMO_MESSAGES.length > 0 ? chatMessages.length - DEMO_MESSAGES.length : 0}
      />

      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} messages={chatMessages} onSend={handleSendMessage} />
      <ReactionPicker isOpen={isReactionPickerOpen} onClose={() => setIsReactionPickerOpen(false)} onSelect={handleReaction} />
      <ReactionOverlay reactions={reactions} />
      <LeaveModal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} onConfirm={handleLeave} />
    </div>
  );
};

export default VoiceRoomPage;
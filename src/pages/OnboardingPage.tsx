// OnboardingPage.tsx — Cinematic Onboarding with Antigravity Effect for Elova
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

interface OnboardingData {
  displayName: string;
  languages: string[];
  level: string;
  interests: string[];
}

interface OnboardingPageProps {
  onComplete?: (data: OnboardingData) => void;
}

// ════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just getting started", color: "#10b981", icon: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "Can hold basic conversations", color: "#06b6d4", icon: "🌿" },
  { id: "advanced", label: "Advanced", desc: "Comfortable in most situations", color: "#8b5cf6", icon: "🌳" },
  { id: "native", label: "Native / Fluent", desc: "Near-native or native speaker", color: "#7c3aed", icon: "🏔️" },
];

const INTERESTS = [
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "culture", label: "Culture", icon: "🎭" },
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "food", label: "Food & Cooking", icon: "🍳" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "art", label: "Art & Design", icon: "🎨" },
  { id: "science", label: "Science", icon: "🔬" },
  { id: "film", label: "Film & TV", icon: "🎬" },
  { id: "literature", label: "Literature", icon: "📚" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "health", label: "Health & Wellness", icon: "🧘" },
  { id: "history", label: "History", icon: "🏛️" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "photography", label: "Photography", icon: "📸" },
];

const TOTAL_STEPS = 4;

// ════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 124, g: 58, b: 237 };
}

// ════════════════════════════════════════════════════════════
// ANTIGRAVITY PHYSICS ENGINE
// Faithful recreation of antigravity.google sphere effect
//
// What you see in the real Antigravity:
// - Glossy 3D spheres of varying sizes (8-30px radius)
// - Bright saturated colors (blue, purple, pink, yellow, green, cyan)
// - They FALL with gravity and pile at the bottom
// - Mouse PUSHES them — they scatter violently then settle
// - They BOUNCE off walls with energy loss
// - They COLLIDE with each other — mass-based response
// - They SETTLE — friction brings them to rest in piles
// - Each sphere has a highlight spot (top-left gloss)
// - Each sphere has a subtle drop shadow
// ════════════════════════════════════════════════════════════

interface Sphere {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  rgb: { r: number; g: number; b: number };
  lightRgb: { r: number; g: number; b: number };
  darkRgb: { r: number; g: number; b: number };
}

class AntigravityEngine {
  spheres: Sphere[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  raf: number = 0;
  w: number = 0;
  h: number = 0;
  mouseX: number = -9999;
  mouseY: number = -9999;
  prevMouseX: number = -9999;
  prevMouseY: number = -9999;
  mouseVX: number = 0;
  mouseVY: number = 0;
  mouseActive: boolean = false;

  // Physics — tuned to match Antigravity's playful-but-physical feel
  GRAVITY = 0.3;
  AIR_DRAG = 0.998;
  GROUND_FRICTION = 0.93;
  BOUNCE = 0.5;
  WALL_BOUNCE = 0.45;
  MOUSE_RADIUS = 110;
  MOUSE_FORCE = 12;
  MOUSE_MOMENTUM = 0.3;
  SPEED_CAP = 28;
  SPHERE_COUNT = 55;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    this.spawn();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  spawn() {
    // Colors matching the Antigravity palette — bright, saturated, Google-like
    const palette = [
      "#7c3aed", "#8b5cf6", "#06b6d4", "#22d3ee",
      "#3b82f6", "#60a5fa", "#f43f5e", "#fb7185",
      "#10b981", "#34d399", "#f59e0b", "#fbbf24",
      "#ec4899", "#f472b6",
    ];
    this.spheres = [];
    for (let i = 0; i < this.SPHERE_COUNT; i++) {
      const radius = 6 + Math.random() * 22;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const rgb = hexToRgb(color);
      this.spheres.push({
        x: radius + Math.random() * (this.w - radius * 2),
        y: radius + Math.random() * (this.h * 0.6),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2,
        radius,
        mass: radius * radius * 0.01,
        color,
        rgb,
        lightRgb: {
          r: Math.min(255, rgb.r + 80),
          g: Math.min(255, rgb.g + 80),
          b: Math.min(255, rgb.b + 80),
        },
        darkRgb: {
          r: Math.max(0, rgb.r - 50),
          g: Math.max(0, rgb.g - 50),
          b: Math.max(0, rgb.b - 50),
        },
      });
    }
  }

  update() {
    if (this.mouseActive) {
      this.mouseVX = this.mouseX - this.prevMouseX;
      this.mouseVY = this.mouseY - this.prevMouseY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    }

    for (let i = 0; i < this.spheres.length; i++) {
      const s = this.spheres[i];

      // Gravity
      s.vy += this.GRAVITY;

      // Mouse repulsion
      if (this.mouseActive) {
        const dx = s.x - this.mouseX;
        const dy = s.y - this.mouseY;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const range = this.MOUSE_RADIUS + s.radius;

        if (dist < range && dist > 0.5) {
          const overlap = (range - dist) / range;
          const force = overlap * this.MOUSE_FORCE;
          const nx = dx / dist;
          const ny = dy / dist;

          s.vx += (nx * force) / Math.sqrt(s.mass);
          s.vy += (ny * force) / Math.sqrt(s.mass);
          s.vx += this.mouseVX * this.MOUSE_MOMENTUM;
          s.vy += this.mouseVY * this.MOUSE_MOMENTUM;
        }
      }

      // Air drag
      s.vx *= this.AIR_DRAG;
      s.vy *= this.AIR_DRAG;

      // Speed cap
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > this.SPEED_CAP) {
        const scale = this.SPEED_CAP / speed;
        s.vx *= scale;
        s.vy *= scale;
      }

      // Integrate
      s.x += s.vx;
      s.y += s.vy;

      // Walls
      if (s.x + s.radius > this.w) {
        s.x = this.w - s.radius;
        s.vx = -Math.abs(s.vx) * this.WALL_BOUNCE;
      }
      if (s.x - s.radius < 0) {
        s.x = s.radius;
        s.vx = Math.abs(s.vx) * this.WALL_BOUNCE;
      }
      // Floor — the pile surface
      if (s.y + s.radius > this.h) {
        s.y = this.h - s.radius;
        s.vy = -Math.abs(s.vy) * this.BOUNCE;
        s.vx *= this.GROUND_FRICTION;
        if (Math.abs(s.vy) < 1.2) s.vy = 0;
      }
      if (s.y - s.radius < 0) {
        s.y = s.radius;
        s.vy = Math.abs(s.vy) * this.WALL_BOUNCE;
      }
    }

    // Sphere-sphere collisions
    for (let i = 0; i < this.spheres.length; i++) {
      for (let j = i + 1; j < this.spheres.length; j++) {
        const a = this.spheres[i];
        const b = this.spheres[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;
        const minDist = a.radius + b.radius;

        if (distSq < minDist * minDist && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;
          const totalMass = a.mass + b.mass;

          // Separate
          a.x -= nx * overlap * (b.mass / totalMass);
          a.y -= ny * overlap * (b.mass / totalMass);
          b.x += nx * overlap * (a.mass / totalMass);
          b.y += ny * overlap * (a.mass / totalMass);

          // Impulse
          const relVx = a.vx - b.vx;
          const relVy = a.vy - b.vy;
          const relDot = relVx * nx + relVy * ny;

          if (relDot > 0) {
            const impulse = (1.5 * relDot) / totalMass;
            a.vx -= impulse * b.mass * nx;
            a.vy -= impulse * b.mass * ny;
            b.vx += impulse * a.mass * nx;
            b.vy += impulse * a.mass * ny;
          }
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    // Mouse glow
    if (this.mouseActive) {
      const g = this.ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, this.MOUSE_RADIUS * 1.2
      );
      g.addColorStop(0, "rgba(124,58,237,0.06)");
      g.addColorStop(1, "rgba(124,58,237,0)");
      this.ctx.fillStyle = g;
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, this.MOUSE_RADIUS * 1.2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw each sphere
    for (let i = 0; i < this.spheres.length; i++) {
      const s = this.spheres[i];

      // Shadow
      this.ctx.fillStyle = "rgba(0,0,0,0.18)";
      this.ctx.beginPath();
      this.ctx.ellipse(s.x + 2, s.y + 3, s.radius * 0.85, s.radius * 0.45, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Main body — radial gradient for 3D sphere look
      const grad = this.ctx.createRadialGradient(
        s.x - s.radius * 0.3, s.y - s.radius * 0.35, s.radius * 0.05,
        s.x, s.y, s.radius
      );
      grad.addColorStop(0, `rgba(${s.lightRgb.r},${s.lightRgb.g},${s.lightRgb.b},1)`);
      grad.addColorStop(0.6, `rgba(${s.rgb.r},${s.rgb.g},${s.rgb.b},1)`);
      grad.addColorStop(1, `rgba(${s.darkRgb.r},${s.darkRgb.g},${s.darkRgb.b},1)`);

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Highlight gloss spot (top-left)
      const hlGrad = this.ctx.createRadialGradient(
        s.x - s.radius * 0.35, s.y - s.radius * 0.35, 0,
        s.x - s.radius * 0.35, s.y - s.radius * 0.35, s.radius * 0.55
      );
      hlGrad.addColorStop(0, "rgba(255,255,255,0.55)");
      hlGrad.addColorStop(0.5, "rgba(255,255,255,0.12)");
      hlGrad.addColorStop(1, "rgba(255,255,255,0)");
      this.ctx.fillStyle = hlGrad;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Rim light (bottom-right edge glow)
      const rimGrad = this.ctx.createRadialGradient(
        s.x + s.radius * 0.3, s.y + s.radius * 0.3, s.radius * 0.6,
        s.x + s.radius * 0.3, s.y + s.radius * 0.3, s.radius
      );
      rimGrad.addColorStop(0, "rgba(255,255,255,0)");
      rimGrad.addColorStop(0.8, "rgba(255,255,255,0.04)");
      rimGrad.addColorStop(1, "rgba(255,255,255,0.1)");
      this.ctx.fillStyle = rimGrad;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate = () => {
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.animate);
  };

  start() { this.animate(); }
  stop() { cancelAnimationFrame(this.raf); }

  setMouse(x: number, y: number) {
    if (!this.mouseActive) {
      this.prevMouseX = x;
      this.prevMouseY = y;
      this.mouseActive = true;
    }
    this.mouseX = x;
    this.mouseY = y;
  }

  clearMouse() {
    this.mouseActive = false;
    this.mouseVX = 0;
    this.mouseVY = 0;
  }
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new AntigravityEngine(canvasRef.current);
    engine.start();

    const onResize = () => { engine.resize(); engine.spawn(); };
    const onMove = (e: MouseEvent) => { engine.setMouse(e.clientX, e.clientY); };
    const onLeave = () => { engine.clearMouse(); };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      engine.stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// ════════════════════════════════════════════════════════════
// STEP 1: WELCOME
// ════════════════════════════════════════════════════════════

const StepWelcome: React.FC = () => (
  <div className="flex flex-col items-center text-center px-6">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
      className="w-24 h-24 rounded-3xl mb-8 flex items-center justify-center relative"
      style={{
        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        boxShadow: "0 20px 60px rgba(124,58,237,0.35), 0 0 0 1px rgba(124,58,237,0.2)",
      }}
    >
      <span style={{ fontSize: 44 }}>🗣️</span>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-3xl"
        style={{ border: "2px solid rgba(124,58,237,0.4)" }}
      />
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="font-bold text-white mb-3"
      style={{ fontSize: 42, lineHeight: 1.1, letterSpacing: "-0.03em" }}
    >
      Welcome to{" "}
      <span style={{
        background: "linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        Elova
      </span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="max-w-md"
      style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.5)" }}
    >
      Where voices connect across languages. Join live conversation rooms,
      practice with native speakers, and become fluent together.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-2 mt-8"
    >
      {["Live Rooms", "Native Speakers", "50+ Languages", "Real Conversations"].map((tag, i) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + i * 0.1 }}
          className="px-3 py-1.5 rounded-full font-medium"
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {tag}
        </motion.span>
      ))}
    </motion.div>
  </div>
);

// ════════════════════════════════════════════════════════════
// STEP 2: NAME INPUT
// ════════════════════════════════════════════════════════════

const StepName: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);

  return (
    <div className="flex flex-col items-center text-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span style={{ fontSize: 48 }} className="mb-6 block">👋</span>
        <h2 className="font-bold text-white mb-2" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
          What should we call you?
        </h2>
        <p className="mb-8" style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
          This is how others will see you in conversation rooms
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="w-full max-w-sm">
        <div className="relative">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your name"
            maxLength={30}
            className="w-full px-5 py-4 rounded-2xl text-white text-center font-medium outline-none transition-all"
            style={{
              fontSize: 18,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: value ? "0 0 30px rgba(124,58,237,0.12)" : "none",
              caretColor: "#7c3aed",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.4)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontVariantNumeric: "tabular-nums" }}>
            {value.length}/30
          </div>
        </div>

        <AnimatePresence>
          {value.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 rounded-2xl flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", fontSize: 16 }}
              >
                {value.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-white" style={{ fontSize: 14 }}>{value}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>This is how you'll appear</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// STEP 3: LANGUAGE & LEVEL
// ════════════════════════════════════════════════════════════

const StepLanguage: React.FC<{
  selectedLanguages: string[];
  onToggleLanguage: (code: string) => void;
  selectedLevel: string;
  onSelectLevel: (id: string) => void;
}> = ({ selectedLanguages, onToggleLanguage, selectedLevel, onSelectLevel }) => (
  <div className="flex flex-col items-center text-center px-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h2 className="font-bold text-white mb-2" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>Your languages</h2>
      <p className="mb-6" style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>Select the languages you want to practice</p>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8 w-full max-w-lg">
      {LANGUAGES.map((lang, i) => {
        const isSelected = selectedLanguages.includes(lang.code);
        return (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggleLanguage(lang.code)}
            className="py-3 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all"
            style={{
              background: isSelected ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.04)",
              border: isSelected ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.07)",
              boxShadow: isSelected ? "0 0 20px rgba(124,58,237,0.1)" : "none",
            }}
          >
            <span style={{ fontSize: 22 }}>{lang.flag}</span>
            <span className="font-medium" style={{ fontSize: 11, color: isSelected ? "#a78bfa" : "rgba(255,255,255,0.5)" }}>
              {lang.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full max-w-lg">
      <p className="font-semibold text-white mb-3 text-left" style={{ fontSize: 14 }}>Your level</p>
      <div className="grid grid-cols-2 gap-2">
        {LEVELS.map((level, i) => {
          const isSelected = selectedLevel === level.id;
          const rgb = hexToRgb(level.color);
          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLevel(level.id)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: isSelected ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.1)` : "rgba(255,255,255,0.03)",
                border: isSelected ? `1px solid rgba(${rgb.r},${rgb.g},${rgb.b},0.3)` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 16 }}>{level.icon}</span>
                <span className="font-semibold" style={{ fontSize: 13, color: isSelected ? level.color : "white" }}>{level.label}</span>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", paddingLeft: 24 }}>{level.desc}</p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  </div>
);

// ════════════════════════════════════════════════════════════
// STEP 4: INTERESTS
// ════════════════════════════════════════════════════════════

const StepInterests: React.FC<{
  selectedInterests: string[];
  onToggleInterest: (id: string) => void;
}> = ({ selectedInterests, onToggleInterest }) => (
  <div className="flex flex-col items-center text-center px-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h2 className="font-bold text-white mb-2" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>Your interests</h2>
      <p className="mb-6" style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>We'll match you with rooms you'll love</p>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-2 max-w-lg">
      {INTERESTS.map((interest, i) => {
        const isSelected = selectedInterests.includes(interest.id);
        return (
          <motion.button
            key={interest.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.03 * i }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onToggleInterest(interest.id)}
            className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            style={{
              background: isSelected ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.04)",
              border: isSelected ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span style={{ fontSize: 16 }}>{interest.icon}</span>
            <span className="font-medium" style={{ fontSize: 13, color: isSelected ? "#a78bfa" : "rgba(255,255,255,0.55)" }}>
              {interest.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>

    {selectedInterests.length > 0 && (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4" style={{ fontSize: 13, color: "rgba(124,58,237,0.8)" }}>
        {selectedInterests.length} selected — great choices!
      </motion.p>
    )}
  </div>
);

// ════════════════════════════════════════════════════════════
// SVG ICONS
// ════════════════════════════════════════════════════════════

const IconArrowRight: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconArrowLeft: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" x2="5" y1="12" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconCheck: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ════════════════════════════════════════════════════════════
// MAIN ONBOARDING PAGE
// ════════════════════════════════════════════════════════════

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return displayName.trim().length >= 2;
      case 2: return languages.length > 0 && level !== "";
      case 3: return interests.length >= 1;
      default: return false;
    }
  }, [step, displayName, languages, level, interests]);

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      setIsCompleting(true);
      setTimeout(() => {
        if (onComplete) onComplete({ displayName, languages, level, interests });
      }, 600);
    }
  }, [canProceed, step, onComplete, displayName, languages, level, interests]);

  const handleBack = useCallback(() => {
    if (step > 0) { setDirection(-1); setStep((s) => s - 1); }
  }, [step]);

  const toggleLanguage = useCallback((code: string) => {
    setLanguages((prev) => prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]);
  }, []);

  const toggleInterest = useCallback((id: string) => {
    setInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter" && canProceed) handleNext(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canProceed, handleNext]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepWelcome />;
      case 1: return <StepName value={displayName} onChange={setDisplayName} />;
      case 2: return <StepLanguage selectedLanguages={languages} onToggleLanguage={toggleLanguage} selectedLevel={level} onSelectLevel={setLevel} />;
      case 3: return <StepInterests selectedInterests={interests} onToggleInterest={toggleInterest} />;
      default: return null;
    }
  };

  const stepLabels = ["Welcome", "Name", "Language", "Interests"];

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{
        background: "#0B0F19",
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <ParticleCanvas />

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 200, background: "linear-gradient(to top, rgba(11,15,25,0.85), transparent)", zIndex: 1 }} />

      <div className="relative z-10 px-6 pt-6">
        <div className="flex items-center justify-between mb-3">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-medium transition-all"
                style={{
                  fontSize: 11,
                  background: i <= step ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(255,255,255,0.06)",
                  color: i <= step ? "white" : "rgba(255,255,255,0.3)",
                  border: i <= step ? "none" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: i === step ? "0 0 15px rgba(124,58,237,0.35)" : "none",
                }}
              >
                {i < step ? <IconCheck size={14} color="white" /> : i + 1}
              </div>
              <span className="hidden sm:block font-medium" style={{ fontSize: 11, color: i <= step ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center overflow-y-auto py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-lg">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative z-10 px-6 pb-8 pt-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleBack} className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all" style={{ fontSize: 14, color: step > 0 ? "rgba(255,255,255,0.5)" : "transparent", background: step > 0 ? "rgba(255,255,255,0.04)" : "transparent", border: step > 0 ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent", pointerEvents: step > 0 ? "auto" : "none" }}>
            <IconArrowLeft size={16} color="rgba(255,255,255,0.5)" /> Back
          </motion.button>

          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontVariantNumeric: "tabular-nums" }}>{step + 1} / {TOTAL_STEPS}</span>

          <motion.button whileHover={{ scale: canProceed ? 1.03 : 1 }} whileTap={{ scale: canProceed ? 0.97 : 1 }} onClick={handleNext} disabled={!canProceed} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all" style={{ fontSize: 14, background: canProceed ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(255,255,255,0.04)", color: canProceed ? "white" : "rgba(255,255,255,0.2)", border: canProceed ? "none" : "1px solid rgba(255,255,255,0.07)", boxShadow: canProceed ? "0 0 20px rgba(124,58,237,0.35)" : "none", cursor: canProceed ? "pointer" : "not-allowed" }}>
            {step === TOTAL_STEPS - 1 ? (<>{isCompleting ? "Starting..." : "Get Started"}<IconCheck size={16} color="white" /></>) : (<>Continue<IconArrowRight size={16} color="white" /></>)}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
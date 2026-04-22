import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ════════════════════════════════════════════════════════════
// ADVANCED TYPES & INTERFACES
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

interface Language { code: string; label: string; flag: string; nativeLabel: string; }
interface ProficiencyLevel { id: string; label: string; desc: string; color: string; icon: string; }
interface InterestCategory { id: string; label: string; icon: string; category: string; }
interface StepValidation { isValid: boolean; error?: string; }

// ════════════════════════════════════════════════════════════
// COMPREHENSIVE CONSTANTS
// ════════════════════════════════════════════════════════════

const LANGUAGES: Language[] = [
  { code: "en", label: "English", flag: "🇬🇧", nativeLabel: "English" },
  { code: "es", label: "Spanish", flag: "🇪🇸", nativeLabel: "Español" },
  { code: "fr", label: "French", flag: "🇫🇷", nativeLabel: "Français" },
  { code: "de", label: "German", flag: "🇩🇪", nativeLabel: "Deutsch" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷", nativeLabel: "Português" },
  { code: "ja", label: "Japanese", flag: "🇯🇵", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", flag: "🇰🇷", nativeLabel: "한국어" },
  { code: "zh", label: "Chinese", flag: "🇨🇳", nativeLabel: "中文" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", nativeLabel: "العربية" },
  { code: "hi", label: "Hindi", flag: "🇮🇳", nativeLabel: "हिन्दी" },
  { code: "it", label: "Italian", flag: "🇮🇹", nativeLabel: "Italiano" },
  { code: "ru", label: "Russian", flag: "🇷🇺", nativeLabel: "Русский" },
  { code: "nl", label: "Dutch", flag: "🇳🇱", nativeLabel: "Nederlands" },
  { code: "sv", label: "Swedish", flag: "🇸🇪", nativeLabel: "Svenska" },
  { code: "tr", label: "Turkish", flag: "🇹🇷", nativeLabel: "Türkçe" },
  { code: "pl", label: "Polish", flag: "🇵🇱", nativeLabel: "Polski" },
];

const LEVELS: ProficiencyLevel[] = [
  { id: "beginner", label: "Beginner", desc: "Just getting started with the basics", color: "#10b981", icon: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "Can hold basic conversations and understand context", color: "#06b6d4", icon: "🌿" },
  { id: "advanced", label: "Advanced", desc: "Comfortable in most situations, minor errors", color: "#8b5cf6", icon: "🌳" },
  { id: "native", label: "Native / Fluent", desc: "Near-native or native speaker proficiency", color: "#7c3aed", icon: "🏔️" },
];

const INTERESTS: InterestCategory[] = [
  { id: "travel", label: "Travel", icon: "✈️", category: "lifestyle" },
  { id: "business", label: "Business", icon: "💼", category: "analytical" },
  { id: "culture", label: "Culture", icon: "🎭", category: "social" },
  { id: "tech", label: "Technology", icon: "💻", category: "analytical" },
  { id: "music", label: "Music", icon: "🎵", category: "creative" },
  { id: "food", label: "Food & Cooking", icon: "🍳", category: "lifestyle" },
  { id: "sports", label: "Sports", icon: "⚽", category: "lifestyle" },
  { id: "art", label: "Art & Design", icon: "🎨", category: "creative" },
  { id: "science", label: "Science", icon: "🔬", category: "analytical" },
  { id: "film", label: "Film & TV", icon: "🎬", category: "creative" },
  { id: "literature", label: "Literature", icon: "📚", category: "creative" },
  { id: "gaming", label: "Gaming", icon: "🎮", category: "lifestyle" },
  { id: "philosophy", label: "Philosophy", icon: "🤔", category: "analytical" },
  { id: "fitness", label: "Fitness", icon: "🏋️", category: "lifestyle" },
  { id: "photography", label: "Photography", icon: "📷", category: "creative" },
  { id: "networking", label: "Networking", icon: "🤝", category: "social" },
];

const TOTAL_STEPS = 4;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
  visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", damping: 20, stiffness: 100 } },
};

// ════════════════════════════════════════════════════════════
// DEEP SPACE BACKGROUND (replaces SwarmEngineV3)
// ════════════════════════════════════════════════════════════

const SpaceBackground: React.FC = () => {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bgC = bgRef.current;
    const fgC = fgRef.current;
    if (!bgC || !fgC) return;
    const bgX = bgC.getContext("2d");
    const fgX = fgC.getContext("2d");
    if (!bgX || !fgX) return;

    let W = 0, H = 0, cx = 0, cy = 0;

    /* ── Stars ── */
    const STAR_N = 400;
    const stars: { x: number; y: number; sz: number; ba: number; ts: number; tp: number }[] = [];
    for (let i = 0; i < STAR_N; i++) stars.push({
      x: Math.random(), y: Math.random(),
      sz: Math.random() * 1.3 + 0.2, ba: Math.random() * 0.25 + 0.04,
      ts: 0.4 + Math.random() * 2.5, tp: Math.random() * Math.PI * 2,
    });

    /* ── Nebulae ── */
    const nebulae = [
      { x: .22, y: .28, r: 380, c: [255, 130, 60], a: .025 },
      { x: .75, y: .35, r: 320, c: [0, 210, 185], a: .018 },
      { x: .45, y: .72, r: 340, c: [255, 179, 71], a: .014 },
      { x: .15, y: .65, r: 260, c: [140, 90, 220], a: .012 },
      { x: .82, y: .78, r: 300, c: [255, 100, 80], a: .010 },
      { x: .50, y: .50, r: 400, c: [255, 200, 100], a: .008 },
    ];

    function drawBg() {
      bgX.fillStyle = "#06080c";
      bgX.fillRect(0, 0, W, H);
      nebulae.forEach(n => {
        const px = n.x * W, py = n.y * H;
        const g = bgX.createRadialGradient(px, py, 0, px, py, n.r);
        g.addColorStop(0, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a})`);
        g.addColorStop(0.5, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a * 0.4})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        bgX.fillStyle = g;
        bgX.fillRect(0, 0, W, H);
      });
      stars.forEach(s => {
        bgX.beginPath();
        bgX.arc(s.x * W, s.y * H, s.sz * 0.6, 0, Math.PI * 2);
        bgX.fillStyle = `rgba(255,255,255,${s.ba * 0.5})`;
        bgX.fill();
      });
    }

    function resize() {
      W = bgC.width = fgC.width = window.innerWidth;
      H = bgC.height = fgC.height = window.innerHeight;
      cx = W / 2; cy = H / 2;
      drawBg();
    }

    /* ── Mouse ── */
    const ms = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMM = (e: MouseEvent) => { ms.tx = (e.clientX - cx) / cx; ms.ty = (e.clientY - cy) / cy; };
    const onTM = (e: TouchEvent) => { if (e.touches[0]) { ms.tx = (e.touches[0].clientX - cx) / cx; ms.ty = (e.touches[0].clientY - cy) / cy; } };

    /* ── Config ── */
    const PN = 170, CD = 75, FOV = 650, VD = 550, GRS = 0.005;
    const WARM = { r: 255, g: 175, b: 65 }, HOT = { r: 255, g: 120, b: 55 }, COOL = { r: 0, g: 220, b: 190 };

    /* ── Particle class ── */
    interface Pt { oR: number; oS: number; ph: number; tX: number; tZ: number; yO: number; yW: number; yS: number; bS: number; ac: boolean; pP: number; pS: number; wx: number; wy: number; wz: number; sx: number; sy: number; df: number; tr: { x: number; y: number; d: number }[]; mT: number; }
    function mkPt(): Pt {
      const ac = Math.random() < 0.1;
      return {
        oR: 45 + Math.pow(Math.random(), 0.65) * 310,
        oS: (0.012 + Math.random() * 0.043) * (Math.random() < 0.5 ? 1 : -1),
        ph: Math.random() * Math.PI * 2,
        tX: (Math.random() - 0.5) * Math.PI * 0.85,
        tZ: (Math.random() - 0.5) * Math.PI * 0.65,
        yO: (Math.random() - 0.5) * 240,
        yW: 8 + Math.random() * 35,
        yS: 0.02 + Math.random() * 0.08,
        bS: ac ? 2.2 + Math.random() * 1.8 : 1 + Math.random() * 2,
        ac, pP: Math.random() * Math.PI * 2,
        pS: 0.3 + Math.random() * 0.5,
        wx: 0, wy: 0, wz: 0, sx: 0, sy: 0, df: 0.5,
        tr: [], mT: ac ? 8 : 4,
      };
    }
    function upPt(p: Pt, t: number) {
      const a = p.ph + t * p.oS;
      let x = p.oR * Math.cos(a), y = p.yO + p.yW * Math.sin(t * p.yS + p.ph), z = p.oR * Math.sin(a);
      let c = Math.cos(p.tX), s = Math.sin(p.tX), y2 = y * c - z * s, z2 = y * s + z * c; y = y2; z = z2;
      c = Math.cos(p.tZ); s = Math.sin(p.tZ); let x2 = x * c - y * s; y = x * s + y * c; x = x2;
      p.wx = x; p.wy = y; p.wz = z;
    }
    function ptPt(p: Pt) { p.tr.push({ x: p.sx, y: p.sy, d: p.df }); if (p.tr.length > p.mT) p.tr.shift(); }

    const pts: Pt[] = Array.from({ length: PN }, mkPt);

    /* ── Meteorite class ── */
    interface Met { alive: boolean; trail: { x: number; y: number }[]; maxTrail: number; cooldown: number; timer: number; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; col: { r: number; g: number; b: number }; headSize: number; }
    function mkMet(): Met {
      return { alive: false, trail: [], maxTrail: 80, cooldown: 5 + Math.random() * 6, timer: 5 + Math.random() * 6, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 3, col: { r: 255, g: 255, b: 255 }, headSize: 4 };
    }
    function spawnMet(m: Met) {
      m.alive = true; m.trail = [];
      const side = Math.random();
      if (side < 0.25) { m.x = Math.random() * W; m.y = -40; }
      else if (side < 0.5) { m.x = W + 40; m.y = Math.random() * H; }
      else if (side < 0.75) { m.x = Math.random() * W; m.y = H + 40; }
      else { m.x = -40; m.y = Math.random() * H; }
      const tx = cx + (Math.random() - 0.5) * W * 0.5;
      const ty = cy + (Math.random() - 0.5) * H * 0.5;
      const ang = Math.atan2(ty - m.y, tx - m.x);
      const spd = 180 + Math.random() * 120;
      m.vx = Math.cos(ang) * spd; m.vy = Math.sin(ang) * spd;
      m.life = 0; m.maxLife = 3.0 + Math.random() * 1.0;
      const roll = Math.random();
      if (roll < 0.2) m.col = { r: 0, g: 255, b: 140 };
      else if (roll < 0.4) m.col = { r: 255, g: 50, b: 120 };
      else if (roll < 0.55) m.col = { r: 0, g: 200, b: 255 };
      else if (roll < 0.7) m.col = { r: 255, g: 230, b: 0 };
      else if (roll < 0.85) m.col = { r: 255, g: 80, b: 20 };
      else m.col = { r: 180, g: 50, b: 255 };
      m.headSize = 4 + Math.random() * 2.5;
    }
    function upMet(m: Met, dt: number) {
      if (!m.alive) { m.timer -= dt; if (m.timer <= 0) spawnMet(m); return; }
      m.life += dt; m.x += m.vx * dt; m.y += m.vy * dt;
      m.trail.unshift({ x: m.x, y: m.y });
      if (m.trail.length > m.maxTrail) m.trail.pop();
      const mg = 150;
      if (m.life > m.maxLife || m.x < -mg || m.x > W + mg || m.y < -mg || m.y > H + mg) {
        m.alive = false; m.timer = 5 + Math.random() * 6;
      }
    }

    const mets: Met[] = [mkMet(), mkMet()];
    mets[1].timer = 9 + Math.random() * 5;

    /* ── 3D helpers ── */
    function rY(x: number, y: number, z: number, a: number) { const c = Math.cos(a), s = Math.sin(a); return { x: x * c - z * s, y, z: x * s + z * c }; }
    function rX(x: number, y: number, z: number, a: number) { const c = Math.cos(a), s = Math.sin(a); return { x, y: y * c - z * s, z: y * s + z * c }; }
    function pj(x: number, y: number, z: number) { const d = Math.max(VD + z, 1), s = FOV / d; return { sx: cx + x * s, sy: cy + y * s, d: z }; }

    /* ── Draw helpers ── */
    function drTr(p: Pt) {
      if (p.tr.length < 2) return;
      const c = p.ac ? COOL : WARM;
      for (let i = 0; i < p.tr.length - 1; i++) {
        const t = p.tr[i], pr = i / p.tr.length, al = pr * t.d * 0.25;
        if (al < 0.005) continue;
        const sz = Math.max(0.3, p.bS * (0.3 + t.d * 0.5) * pr * 0.8);
        fgX.beginPath(); fgX.arc(t.x, t.y, sz * 2.5, 0, Math.PI * 2);
        fgX.fillStyle = `rgba(${c.r},${c.g},${c.b},${al * 0.2})`; fgX.fill();
        fgX.beginPath(); fgX.arc(t.x, t.y, sz, 0, Math.PI * 2);
        fgX.fillStyle = `rgba(${c.r},${c.g},${c.b},${al})`; fgX.fill();
      }
    }

    function drDot(p: Pt, t: number) {
      const pu = 0.8 + 0.2 * Math.sin(t * p.pS + p.pP), df = p.df;
      const sz = Math.max(0.4, p.bS * (0.4 + df * 0.9) * pu), al = (0.15 + df * 0.85) * pu;
      const c = p.ac ? COOL : WARM;
      if (sz > 0.5) {
        const wgr = sz * (p.ac ? 10 : 7);
        const g = fgX.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, wgr);
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${al * (p.ac ? 0.12 : 0.06)})`);
        g.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b},${al * 0.015})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        fgX.beginPath(); fgX.arc(p.sx, p.sy, wgr, 0, Math.PI * 2); fgX.fillStyle = g; fgX.fill();
      }
      if (sz > 0.5) {
        const gr = sz * (p.ac ? 6 : 4.5);
        const g = fgX.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, gr);
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${al * (p.ac ? 0.35 : 0.22)})`);
        g.addColorStop(0.35, `rgba(${c.r},${c.g},${c.b},${al * 0.06})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        fgX.beginPath(); fgX.arc(p.sx, p.sy, gr, 0, Math.PI * 2); fgX.fillStyle = g; fgX.fill();
      }
      const g = fgX.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, sz);
      g.addColorStop(0, `rgba(255,255,255,${al * 0.95})`);
      g.addColorStop(0.3, `rgba(${Math.min(255, c.r + 40)},${Math.min(255, c.g + 30)},${Math.min(255, c.b + 20)},${al})`);
      g.addColorStop(1, `rgba(${c.r},${c.g},${c.b},${al * 0.3})`);
      fgX.beginPath(); fgX.arc(p.sx, p.sy, sz, 0, Math.PI * 2); fgX.fillStyle = g; fgX.fill();
    }

    function drCn(a: Pt, b: Pt, df: number, ad: number) {
      const al = df * ad * 0.08; if (al < 0.003) return;
      const ac = a.ac || b.ac;
      let r: number, g: number, bl: number;
      if (ac) { r = Math.round(WARM.r * 0.35 + COOL.r * 0.65); g = Math.round(WARM.g * 0.35 + COOL.g * 0.65); bl = Math.round(WARM.b * 0.35 + COOL.b * 0.65); }
      else { r = Math.round(WARM.r * ad + HOT.r * (1 - ad)); g = Math.round(WARM.g * ad + HOT.g * (1 - ad)); bl = Math.round(WARM.b * ad + HOT.b * (1 - ad)); }
      fgX.beginPath(); fgX.moveTo(a.sx, a.sy); fgX.lineTo(b.sx, b.sy);
      fgX.strokeStyle = `rgba(${r},${g},${bl},${al})`; fgX.lineWidth = 0.3 + df * ad * 0.6;
      fgX.lineCap = "round"; fgX.stroke();
    }

    function drTw(t: number) {
      stars.forEach(s => {
        if (s.ba < 0.08) return;
        const tw = 0.4 + 0.6 * Math.sin(t * s.ts + s.tp), a = s.ba * tw;
        if (a < 0.03) return;
        fgX.beginPath(); fgX.arc(s.x * W, s.y * H, s.sz, 0, Math.PI * 2);
        fgX.fillStyle = `rgba(255,255,255,${a})`; fgX.fill();
      });
    }

    function drMet(m: Met) {
      if (!m.alive || m.trail.length < 2) return;
      const fadeOut = m.life > m.maxLife - 0.6 ? Math.max(0, (m.maxLife - m.life) / 0.6) : 1;
      const fadeIn = Math.min(1, m.life / 0.25);
      const master = fadeIn * fadeOut;
      const c = m.col;

      const awR = m.headSize * 55 * master;
      if (awR > 1) {
        const g = fgX.createRadialGradient(m.x, m.y, 0, m.x, m.y, awR);
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.06 * master})`);
        g.addColorStop(0.25, `rgba(${c.r},${c.g},${c.b},${0.02 * master})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        fgX.beginPath(); fgX.arc(m.x, m.y, awR, 0, Math.PI * 2); fgX.fillStyle = g; fgX.fill();
      }

      const mgR = m.headSize * 25 * master;
      if (mgR > 1) {
        const g = fgX.createRadialGradient(m.x, m.y, 0, m.x, m.y, mgR);
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.2 * master})`);
        g.addColorStop(0.15, `rgba(${c.r},${c.g},${c.b},${0.08 * master})`);
        g.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${0.015 * master})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        fgX.beginPath(); fgX.arc(m.x, m.y, mgR, 0, Math.PI * 2); fgX.fillStyle = g; fgX.fill();
      }

      for (let i = 0; i < m.trail.length - 1; i++) {
        const a = m.trail[i], b = m.trail[i + 1];
        const progress = 1 - i / m.trail.length;
        const alpha = progress * progress * master * 0.65;
        const width = m.headSize * 2.8 * progress;
        if (alpha < 0.003 || width < 0.15) continue;
        fgX.beginPath(); fgX.moveTo(a.x, a.y); fgX.lineTo(b.x, b.y);
        fgX.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 0.18})`;
        fgX.lineWidth = width * 4; fgX.lineCap = "round"; fgX.stroke();
        fgX.beginPath(); fgX.moveTo(a.x, a.y); fgX.lineTo(b.x, b.y);
        fgX.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        fgX.lineWidth = width; fgX.lineCap = "round"; fgX.stroke();
        if (progress > 0.6) {
          fgX.beginPath(); fgX.moveTo(a.x, a.y); fgX.lineTo(b.x, b.y);
          fgX.strokeStyle = `rgba(255,255,255,${alpha * 0.4 * (progress - 0.6) / 0.4})`;
          fgX.lineWidth = width * 0.4; fgX.lineCap = "round"; fgX.stroke();
        }
      }

      const tgR = m.headSize * 12 * master;
      if (tgR > 1) {
        const g = fgX.createRadialGradient(m.x, m.y, 0, m.x, m.y, tgR);
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.45 * master})`);
        g.addColorStop(0.2, `rgba(${c.r},${c.g},${c.b},${0.15 * master})`);
        g.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},${0.025 * master})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        fgX.beginPath(); fgX.arc(m.x, m.y, tgR, 0, Math.PI * 2); fgX.fillStyle = g; fgX.fill();
      }

      const cr = m.headSize * 1.4 * master;
      if (cr > 0.3) {
        const cg = fgX.createRadialGradient(m.x, m.y, 0, m.x, m.y, cr);
        cg.addColorStop(0, `rgba(255,255,255,${master})`);
        cg.addColorStop(0.3, `rgba(${Math.min(255, c.r + 60)},${Math.min(255, c.g + 60)},${Math.min(255, c.b + 60)},${0.9 * master})`);
        cg.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${0.5 * master})`);
        cg.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        fgX.beginPath(); fgX.arc(m.x, m.y, cr, 0, Math.PI * 2); fgX.fillStyle = cg; fgX.fill();
      }
    }

    /* ── Main loop ── */
    let time = 0, lt = performance.now(), raf = 0;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate(now: number) {
      raf = requestAnimationFrame(animate);
      const dt = Math.min((now - lt) / 1000, 0.05); lt = now; time += dt;
      ms.x += (ms.tx - ms.x) * 0.035; ms.y += (ms.ty - ms.y) * 0.035;
      const gy = time * GRS, gx = 0.18 + Math.sin(time * 0.08) * 0.06;
      const py = ms.x * 0.35, px = ms.y * 0.22;
      const br = Math.sin(time * 0.25) * 6, ed = CD + br;
      fgX.clearRect(0, 0, W, H);
      drTw(time);

      pts.forEach(p => upPt(p, time));
      pts.forEach(p => {
        let r = rY(p.wx, p.wy, p.wz, gy + py); r = rX(r.x, r.y, r.z, gx + px);
        const pr = pj(r.x, r.y, r.z); p.sx = pr.sx; p.sy = pr.sy;
        p.df = Math.max(0, Math.min(1, (350 - pr.d) / 700));
      });
      pts.forEach(p => ptPt(p));

      const cn: { a: Pt; b: Pt; df: number; ad: number }[] = [];
      for (let i = 0; i < PN; i++) {
        const a = pts[i];
        for (let j = i + 1; j < PN; j++) {
          const b = pts[j];
          const dx = a.wx - b.wx, dy = a.wy - b.wy, dz = a.wz - b.wz, d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < ed * ed) cn.push({ a, b, df: 1 - Math.sqrt(d2) / ed, ad: (a.df + b.df) * 0.5 });
        }
      }
      cn.sort((a, b) => a.ad - b.ad);
      for (let i = 0; i < cn.length; i++) drCn(cn[i].a, cn[i].b, cn[i].df, cn[i].ad);

      const so = pts.slice().sort((a, b) => a.df - b.df);
      so.forEach(p => drTr(p)); so.forEach(p => drDot(p, time));

      const ca = 0.028 + Math.sin(time * 0.4) * 0.006;
      const cg1 = fgX.createRadialGradient(cx, cy, 0, cx, cy, 350);
      cg1.addColorStop(0, `rgba(255,170,60,${ca})`); cg1.addColorStop(0.3, "rgba(255,120,50,0.008)"); cg1.addColorStop(1, "rgba(0,0,0,0)");
      fgX.fillStyle = cg1; fgX.beginPath(); fgX.arc(cx, cy, 350, 0, Math.PI * 2); fgX.fill();

      const ca2 = 0.012 + Math.sin(time * 0.3 + 1) * 0.003;
      const cg2 = fgX.createRadialGradient(cx, cy, 0, cx, cy, 500);
      cg2.addColorStop(0, `rgba(0,210,185,${ca2})`); cg2.addColorStop(0.4, "rgba(0,180,160,0.003)"); cg2.addColorStop(1, "rgba(0,0,0,0)");
      fgX.fillStyle = cg2; fgX.beginPath(); fgX.arc(cx, cy, 500, 0, Math.PI * 2); fgX.fill();

      mets.forEach(m => { upMet(m, dt); drMet(m); });
    }

    resize();
    if (!rm) { raf = requestAnimationFrame(animate); }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("touchmove", onTM, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("touchmove", onTM);
    };
  }, []);

  return (
    <>
      <canvas ref={bgRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />
      <canvas ref={fgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 20%, rgba(6,8,12,0.65) 100%)" }} />
    </>
  );
};

// ════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════

const IconArrowRight = ({ size = 20, className = "" }: { size?: number; className?: string }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconArrowLeft = ({ size = 20, className = "" }: { size?: number; className?: string }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" x2="5" y1="12" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconCheck = ({ size = 18, className = "" }: { size?: number; className?: string }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>);
const IconSparkles = ({ size = 24, className = "" }: { size?: number; className?: string }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>);
const IconSearch = ({ size = 18, className = "" }: { size?: number; className?: string }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const IconUser = ({ size = 24, className = "" }: { size?: number; className?: string }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);

// ════════════════════════════════════════════════════════════
// UI COMPONENTS
// ════════════════════════════════════════════════════════════

const ProfileStrengthMeter: React.FC<{ value: number }> = ({ value }) => {
  const getColor = (v: number) => { if (v < 30) return "#ef4444"; if (v < 70) return "#eab308"; return "#22c55e"; };
  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Profile Matrix</span>
        <span className="text-[10px] font-extrabold tracking-widest" style={{ color: getColor(value) }}>{value}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ backgroundColor: getColor(value), boxShadow: `0 0 10px ${getColor(value)}` }}
        />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// ONBOARDING WIZARD STEPS
// ════════════════════════════════════════════════════════════

const StepWelcome: React.FC = () => (
  <div className="flex flex-col items-center text-center px-4 w-full">
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15, stiffness: 80, delay: 0.1 }} className="mb-8">
      <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center relative bg-gradient-to-br from-primary to-[#22d3ee] shadow-[0_0_80px_rgba(124,58,237,0.5)]">
        <span className="text-5xl relative z-10 drop-shadow-md">🗣️</span>
        <div className="absolute inset-0 rounded-[2rem] border border-white/20 mix-blend-overlay" />
      </div>
    </motion.div>
    <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-[2.5rem] md:text-5xl font-extrabold text-white mb-6 tracking-[-0.04em] leading-[1.1] flex flex-col items-center gap-2">
      <span>Welcome to</span>
      <span className="text-[3.5rem] md:text-7xl tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#22d3ee] to-[#f472b6] drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] pb-2">Elova</span>
    </motion.h1>
    <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="max-w-[400px] text-base md:text-lg text-white/50 font-medium leading-relaxed mb-10">
      Experience liftoff. Join the next generation of live voice rooms and algorithmically forged human connection.
    </motion.p>
  </div>
);

const StepName: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);
  const validateName = (name: string) => {
    if (name.length === 0) return null;
    if (name.length < 2) return "Too short";
    if (name.length > 30) return "Max 30 characters";
    if (!/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(name)) return "Letters only";
    return null;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; onChange(val); setError(validateName(val)); };
  const initials = value.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const isValid = value.length >= 2 && !error;
  return (
    <div className="flex flex-col items-center text-center px-4 w-full">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center w-full">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-[-0.03em]">What should we call you?</h2>
          <p className="text-white/40 text-[15px] font-medium mb-10">This will be your identity across the Elova universe.</p>
        </motion.div>
        <motion.div variants={itemVariants} className="relative mb-8">
          <motion.div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold border-[3px] transition-all duration-500 shadow-xl" style={{ borderColor: isValid ? "#22d3ee" : isFocused ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)", background: isValid ? "linear-gradient(135deg, #7c3aed, #22d3ee)" : "rgba(255,255,255,0.02)", color: isValid ? "white" : "rgba(255,255,255,0.1)" }} animate={{ scale: isValid ? 1.05 : 1, rotate: isValid ? [0, -10, 0] : 0 }} transition={{ type: "spring", stiffness: 300 }}>
            {isValid ? initials : <IconUser size={36} />}
          </motion.div>
        </motion.div>
        <motion.div variants={itemVariants} className="w-full max-w-sm relative">
          <input ref={inputRef} value={value} onChange={handleChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Your name" maxLength={30} className={`w-full bg-black/40 backdrop-blur-xl border ${error ? "border-red-500/50" : isFocused ? "border-[#22d3ee]/60 shadow-[0_0_30px_rgba(34,211,238,0.15)]" : "border-white/10"} rounded-2xl py-5 px-6 text-2xl text-center text-white font-bold placeholder:text-white/10 focus:outline-none transition-all`} />
        </motion.div>
        <AnimatePresence>{error && (<motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-400 text-[13px] font-bold mt-4 tracking-wide">{error}</motion.p>)}</AnimatePresence>
      </motion.div>
    </div>
  );
};

const StepLanguage: React.FC<{ selectedLanguages: string[]; onToggleLanguage: (code: string) => void; selectedLevel: string; onSelectLevel: (id: string) => void }> = ({ selectedLanguages, onToggleLanguage, selectedLevel, onSelectLevel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = useMemo(() => { if (!searchTerm) return LANGUAGES; const l = searchTerm.toLowerCase(); return LANGUAGES.filter(lang => lang.label.toLowerCase().includes(l) || lang.nativeLabel.toLowerCase().includes(l)); }, [searchTerm]);
  return (
    <div className="flex flex-col items-center text-center px-2 w-full max-h-[60vh] overflow-hidden flex-col">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-[-0.03em]">Linguistic Matrix</h2>
        <p className="text-white/40 text-[15px] font-medium mb-6">Select up to 4 languages you wish to practice.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full max-w-md mb-4 relative">
        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search languages..." className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-[#22d3ee]/50 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all" />
      </motion.div>
      <div className="w-full overflow-y-auto no-scrollbar pb-4 flex-1 mt-2">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-8 w-full">
          {filtered.map((lang) => {
            const isSelected = selectedLanguages.includes(lang.code);
            const isDisabled = !isSelected && selectedLanguages.length >= 4;
            return (
              <motion.button key={lang.code} variants={itemVariants} whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}} whileTap={!isDisabled ? { scale: 0.95 } : {}} onClick={() => !isDisabled && onToggleLanguage(lang.code)} className={`py-3.5 px-2 rounded-xl flex flex-col items-center transition-all duration-300 border relative overflow-hidden ${isSelected ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(124,58,237,0.25)]" : isDisabled ? "opacity-30 cursor-not-allowed bg-black/20 border-transparent" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20"}`}>
                <span className="text-3xl mb-1.5 drop-shadow-md">{lang.flag}</span>
                <span className={`text-[12px] font-bold tracking-tight ${isSelected ? "text-white" : "text-white/60"}`}>{lang.label}</span>
                <span className="text-[10px] font-medium text-white/30 mt-0.5">{lang.nativeLabel}</span>
                {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#22d3ee] flex items-center justify-center border-2 border-[#06080c]"><IconCheck size={12} className="text-black" /></motion.div>)}
              </motion.button>
            );
          })}
        </motion.div>
        {selectedLanguages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-4">
            <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#22d3ee]/80 mb-3 text-left pl-1">Overall Fluency</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEVELS.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                  <motion.button key={level.id} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => onSelectLevel(level.id)} className={`p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-4 border overflow-hidden relative ${isSelected ? "bg-black/60 shadow-[0_0_30px_rgba(34,211,238,0.15)]" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20"}`} style={{ borderColor: isSelected ? level.color : undefined }}>
                    <motion.div className="absolute inset-0 opacity-20" initial={{ x: "-100%" }} animate={{ x: isSelected ? "0%" : "-100%" }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ background: `linear-gradient(90deg, transparent, ${level.color})` }} />
                    <span className="text-[28px] relative z-10 drop-shadow-lg">{level.icon}</span>
                    <div className="relative z-10">
                      <span className="font-bold text-[15px] tracking-tight block" style={{ color: isSelected ? level.color : "white" }}>{level.label}</span>
                      <p className="text-[11px] font-medium text-white/40 mt-0.5">{level.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const StepInterests: React.FC<{ selectedInterests: string[]; onToggleInterest: (id: string) => void }> = ({ selectedInterests, onToggleInterest }) => {
  const categories = useMemo(() => ({ "Creative": INTERESTS.filter(i => i.category === "creative"), "Analytical": INTERESTS.filter(i => i.category === "analytical"), "Lifestyle": INTERESTS.filter(i => i.category === "lifestyle"), "Social": INTERESTS.filter(i => i.category === "social") }), []);
  const strength = Math.min(100, selectedInterests.length * 25);
  return (
    <div className="flex flex-col items-center text-center px-2 w-full max-h-[60vh] overflow-hidden flex-col">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-[-0.03em]">Interest Algorithms</h2>
        <p className="text-white/40 text-[15px] font-medium mb-6">Select at least 2 nodes to calibrate your feed.</p>
      </motion.div>
      <div className="w-full max-w-md mb-6"><ProfileStrengthMeter value={strength} /></div>
      <div className="w-full overflow-y-auto no-scrollbar pb-4 flex-1">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="mb-8 last:mb-0">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#a78bfa]/80 mb-4 text-left pl-1">{category}</motion.p>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-wrap gap-2.5">
              {items.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <motion.button key={interest.id} variants={itemVariants} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => onToggleInterest(interest.id)} className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 border relative overflow-hidden ${isSelected ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(124,58,237,0.25)] text-white" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/20 text-white/50"}`}>
                    <span className="text-[22px] relative z-10 drop-shadow-md">{interest.icon}</span>
                    <span className="text-[13px] font-bold tracking-tight relative z-10">{interest.label}</span>
                    {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22d3ee] flex items-center justify-center border-2 border-[#06080c] z-20"><IconCheck size={10} className="text-black" /></motion.div>)}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// MAIN ONBOARDING COMPONENT
// ════════════════════════════════════════════════════════════

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const canProceed = useMemo((): StepValidation => {
    switch (step) {
      case 0: return { isValid: true };
      case 1: if (displayName.trim().length < 2) return { isValid: false, error: "Name must be at least 2 characters." }; if (!/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(displayName)) return { isValid: false, error: "Only letters and spaces are allowed." }; return { isValid: true };
      case 2: if (languages.length === 0) return { isValid: false, error: "Please select at least 1 language." }; if (level === "") return { isValid: false, error: "Please indicate your fluency level." }; return { isValid: true };
      case 3: if (interests.length < 2) return { isValid: false, error: "Please connect with at least 2 interests." }; return { isValid: true };
      default: return { isValid: false };
    }
  }, [step, displayName, languages, level, interests]);

  const handleNext = useCallback(() => {
    if (!canProceed.isValid) return;
    if (step < TOTAL_STEPS - 1) { setDirection(1); setStep(s => s + 1); }
    else {
      setIsCompleting(true);
      const interval = setInterval(() => { setLaunchProgress(prev => { if (prev >= 100) { clearInterval(interval); setTimeout(() => onComplete?.({ displayName, languages, level, interests }), 600); return 100; } return prev + 4; }); }, 50);
    }
  }, [canProceed.isValid, step, onComplete, displayName, languages, level, interests]);

  const handleBack = useCallback(() => { if (step > 0) { setDirection(-1); setStep(s => s - 1); } }, [step]);

  const toggleLanguage = useCallback((code: string) => { setLanguages(prev => { if (prev.includes(code)) return prev.filter(l => l !== code); if (prev.length >= 4) return prev; return [...prev, code]; }); }, []);

  const toggleInterest = useCallback((id: string) => { setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter" && canProceed.isValid) handleNext(); if (e.key === "Escape" && step > 0) handleBack(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canProceed.isValid, handleNext, handleBack, step]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.98, filter: "blur(5px)" }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.98, filter: "blur(5px)" }),
  };

  const stepLabels = ["Launch", "Identity", "Matrix", "Algorithms"];

  return (
    <div className="relative w-full h-screen bg-[#06080c] overflow-hidden flex flex-col font-sans select-none antialiased">
      <SpaceBackground />

      {/* Progress Header */}
      <div className="relative z-20 w-full pt-10 px-6 flex flex-col items-center gap-5">
        <div className="flex gap-2 w-full max-w-sm">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="h-[3px] flex-1 rounded-full overflow-hidden bg-white/10 relative">
              <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-[#22d3ee] rounded-full" initial={{ width: "0%" }} animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Phase 0{step + 1}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-extrabold text-[#22d3ee] tracking-[0.2em] uppercase">{stepLabels[step]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Form Container */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-xl bg-black/30 backdrop-blur-[40px] border border-white/[0.08] p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center min-h-[480px] md:min-h-[540px] justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none rounded-[2.5rem]" />
            <div className="relative z-10 w-full flex flex-col items-center">
              {step === 0 && <StepWelcome />}
              {step === 1 && <StepName value={displayName} onChange={setDisplayName} />}
              {step === 2 && <StepLanguage selectedLanguages={languages} onToggleLanguage={toggleLanguage} selectedLevel={level} onSelectLevel={setLevel} />}
              {step === 3 && <StepInterests selectedInterests={interests} onToggleInterest={toggleInterest} />}
            </div>
            <AnimatePresence>
              {isCompleting && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#06080c]/95 backdrop-blur-2xl flex flex-col items-center justify-center z-50 p-8">
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 15 }} className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <IconSparkles size={56} className="text-[#22d3ee] relative z-10" />
                  </motion.div>
                  <h3 className="text-3xl font-extrabold text-white mb-2 tracking-[-0.03em]">Aligning Galaxies</h3>
                  <p className="text-white/50 text-[15px] font-medium mb-10 text-center">Finding your optimal linguistic clusters...</p>
                  <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-primary via-[#22d3ee] to-primary bg-[length:200%_auto] rounded-full" animate={{ width: `${launchProgress}%`, backgroundPosition: ["0% center", "200% center"] }} transition={{ width: { duration: 0.1 }, backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" } }} />
                  </div>
                  <p className="text-[#22d3ee] font-bold text-xs mt-4 font-mono tracking-widest">{launchProgress}% // INIT</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="relative z-20 w-full pb-8 md:pb-12 px-6 md:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl flex items-center justify-between">
          <motion.button whileHover={{ scale: 1.05, opacity: 1 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className={`flex items-center justify-center w-14 h-14 rounded-[1.25rem] bg-white/[0.03] border border-white/5 text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 ${step === 0 ? "opacity-0 pointer-events-none scale-90" : "opacity-60 shadow-lg"}`}>
            <IconArrowLeft />
          </motion.button>
          <div className="flex items-center gap-5">
            <AnimatePresence>
              {!canProceed.isValid && step > 0 && canProceed.error && (
                <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="text-[13px] font-bold text-amber-400 hidden md:block">{canProceed.error}</motion.p>
              )}
            </AnimatePresence>
            <motion.button whileHover={canProceed.isValid ? { scale: 1.02, y: -2 } : {}} whileTap={canProceed.isValid ? { scale: 0.98 } : {}} onClick={handleNext} disabled={!canProceed.isValid || isCompleting} className={`flex items-center gap-3 px-8 py-4 rounded-[1.25rem] font-bold text-[15px] transition-all duration-300 shadow-xl relative overflow-hidden group ${canProceed.isValid ? "bg-white text-black hover:bg-gray-50 hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]" : "bg-white/[0.02] text-white/20 pointer-events-none border border-white/5"}`}>
              {canProceed.isValid && <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />}
              <span className="relative z-10">{step === TOTAL_STEPS - 1 ? "Initialize Sequence" : "Continue"}</span>
              <span className="relative z-10">{step === TOTAL_STEPS - 1 ? <IconSparkles size={18} /> : <IconArrowRight size={18} />}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
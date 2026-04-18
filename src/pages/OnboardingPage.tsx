
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Mic, Globe, Target, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingPageProps { onComplete: () => void; }

const LANGUAGES = [
  { code: "ar", name: "Arabic",     native: "العربية",    flag: "🇸🇦" },
  { code: "zh", name: "Chinese",    native: "中文",        flag: "🇨🇳" },
  { code: "fr", name: "French",     native: "Français",   flag: "🇫🇷" },
  { code: "de", name: "German",     native: "Deutsch",    flag: "🇩🇪" },
  { code: "hi", name: "Hindi",      native: "हिन्दी",      flag: "🇮🇳" },
  { code: "it", name: "Italian",    native: "Italiano",   flag: "🇮🇹" },
  { code: "ja", name: "Japanese",   native: "日本語",      flag: "🇯🇵" },
  { code: "ko", name: "Korean",     native: "한국어",      flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", native: "Português",  flag: "🇧🇷" },
  { code: "ru", name: "Russian",    native: "Русский",    flag: "🇷🇺" },
  { code: "es", name: "Spanish",    native: "Español",    flag: "🇪🇸" },
  { code: "tr", name: "Turkish",    native: "Türkçe",     flag: "🇹🇷" },
  { code: "uk", name: "Ukrainian",  native: "Українська", flag: "🇺🇦" },
  { code: "other", name: "Other",   native: "Other",      flag: "🌍" },
];

const LEVELS = [
  { code: "A1", label: "Beginner",           desc: "I know a few words and basic phrases",           color: "from-slate-500 to-slate-600" },
  { code: "A2", label: "Elementary",         desc: "I can handle simple conversations",              color: "from-blue-500 to-blue-600"  },
  { code: "B1", label: "Intermediate",       desc: "I can discuss familiar topics with some effort", color: "from-green-500 to-green-600" },
  { code: "B2", label: "Upper-Intermediate", desc: "I speak fluently on most everyday topics",       color: "from-orange-500 to-orange-600" },
  { code: "C1", label: "Advanced",           desc: "I express myself spontaneously and precisely",   color: "from-red-500 to-red-600"    },
  { code: "C2", label: "Mastery",            desc: "I speak at or near native level",                color: "from-violet-500 to-violet-600" },
];

const INTERESTS = [
  { id: "l1", emoji: "🔥", label: "Daily Debate",      desc: "Hot takes & spirited discussions"    },
  { id: "l2", emoji: "💼", label: "Business English",  desc: "Professional speaking & writing"     },
  { id: "l3", emoji: "🌱", label: "Beginner Corner",   desc: "Zero-judgment learning space"         },
  { id: "l4", emoji: "⚽", label: "Football Talk",     desc: "Match analysis & football culture"   },
  { id: "l5", emoji: "🤖", label: "Tech and AI",       desc: "The future, right now"               },
  { id: "l6", emoji: "✍️", label: "Creative Writing",  desc: "Stories, poetry, expression"          },
  { id: "l7", emoji: "🎬", label: "Film & TV",         desc: "Movies, series, and storytelling"    },
  { id: "l8", emoji: "🎵", label: "Music",             desc: "Songs, lyrics, and culture"          },
  { id: "l9", emoji: "🍳", label: "Food & Travel",     desc: "Cuisine, places, and experiences"    },
  { id: "l10",emoji: "📚", label: "Books & Ideas",     desc: "Literature, philosophy, knowledge"   },
  { id: "l11",emoji: "🏋️", label: "Health & Fitness",  desc: "Wellness, sport, and lifestyle"      },
  { id: "l12",emoji: "🎮", label: "Gaming",            desc: "Games, esports, and strategy"        },
];

const GOALS = [
  { id: "g1", icon: "✈️", label: "Travel",            desc: "Communicate confidently abroad" },
  { id: "g2", icon: "💼", label: "Career",            desc: "Advance professionally in English" },
  { id: "g3", icon: "🎓", label: "Exams",             desc: "IELTS, TOEFL, Cambridge" },
  { id: "g4", icon: "👥", label: "Make Friends",      desc: "Connect with people worldwide" },
  { id: "g5", icon: "🧠", label: "Personal Growth",   desc: "Challenge myself and grow" },
  { id: "g6", icon: "🎬", label: "Entertainment",     desc: "Enjoy content without subtitles" },
];

const SLIDE = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [motherTongue, setMotherTongue] = useState("");
  const [level, setLevel] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());

  const TOTAL_STEPS = 5;
  const progress = ((step) / (TOTAL_STEPS - 1)) * 100;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canNext = [
    true,
    !!motherTongue,
    !!level,
    selectedInterests.size >= 2,
    selectedGoals.size >= 1,
  ][step];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 overflow-hidden">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">

        {/* Progress bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                animate={{ width: progress + "%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-right">{step} of {TOTAL_STEPS - 1}</p>
          </div>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >

            {/* ── STEP 0: Welcome ── */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.5)]">
                      <Mic className="h-12 w-12 text-white" />
                    </div>
                    <motion.div
                      className="absolute -inset-3 rounded-3xl border-2 border-primary/20"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-[36px] font-extrabold gradient-text leading-tight mb-3">
                    Welcome to Elova
                  </h1>
                  <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[340px] mx-auto">
                    The speaking club where real conversations happen. Find your people. Build your confidence. Speak the world.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { icon: <Globe className="h-5 w-5" />, label: "50+ languages"  },
                    { icon: <Users className="h-5 w-5" />, label: "Real humans"    },
                    { icon: <Sparkles className="h-5 w-5" />, label: "AI coaching" },
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 text-center"
                    >
                      <div className="flex justify-center mb-1.5 text-primary">{f.icon}</div>
                      <p className="text-[11px] font-semibold text-muted-foreground">{f.label}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => go(1)}
                  className="w-full py-4 rounded-2xl bg-primary text-white text-[16px] font-bold hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2"
                >
                  Get Started <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            )}

            {/* ── STEP 1: Mother tongue ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">What is your native language?</h2>
                  <p className="text-[14px] text-muted-foreground">This helps us match you with the right learning partners.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto no-scrollbar">
                  {LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setMotherTongue(lang.code)}
                      className={
                        "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all " +
                        (motherTongue === lang.code
                          ? "bg-primary/15 border-primary/50 text-foreground"
                          : "bg-white/[0.03] border-white/[0.08] text-foreground hover:bg-white/[0.06] hover:border-white/[0.15]")
                      }
                    >
                      <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold truncate">{lang.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{lang.native}</p>
                      </div>
                      {motherTongue === lang.code && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: English level ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">Your English level?</h2>
                  <p className="text-[14px] text-muted-foreground">Be honest — we match you with speakers at your level so conversations actually work.</p>
                </div>
                <div className="space-y-2.5">
                  {LEVELS.map((l) => (
                    <motion.button
                      key={l.code}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLevel(l.code)}
                      className={
                        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all " +
                        (level === l.code
                          ? "bg-primary/12 border-primary/45"
                          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.14]")
                      }
                    >
                      <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + l.color + " flex items-center justify-center flex-shrink-0 shadow-md"}>
                        <span className="text-[13px] font-extrabold text-white">{l.code}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-foreground">{l.label}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{l.desc}</p>
                      </div>
                      {level === l.code && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Interests ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">What do you like to talk about?</h2>
                  <p className="text-[14px] text-muted-foreground">Pick at least 2. Your feed and room suggestions are built from this.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {INTERESTS.map((interest) => {
                    const active = selectedInterests.has(interest.id);
                    return (
                      <motion.button
                        key={interest.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(interest.id)}
                        className={
                          "p-3.5 rounded-xl border text-left transition-all relative overflow-hidden " +
                          (active
                            ? "bg-primary/12 border-primary/45"
                            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]")
                        }
                      >
                        {active && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-2xl block mb-1.5">{interest.emoji}</span>
                        <p className="text-[13px] font-bold text-foreground">{interest.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{interest.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-[12px] text-muted-foreground text-center">
                  {selectedInterests.size} selected {selectedInterests.size < 2 ? `· pick ${2 - selectedInterests.size} more` : "✓"}
                </p>
              </div>
            )}

            {/* ── STEP 4: Goals ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[28px] font-extrabold text-foreground mb-2">Why are you here?</h2>
                  <p className="text-[14px] text-muted-foreground">Your goals shape how we coach you and what rooms we recommend.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {GOALS.map((goal) => {
                    const active = selectedGoals.has(goal.id);
                    return (
                      <motion.button
                        key={goal.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleGoal(goal.id)}
                        className={
                          "p-4 rounded-2xl border text-left transition-all relative " +
                          (active
                            ? "bg-primary/12 border-primary/45"
                            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]")
                        }
                      >
                        {active && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-2xl block mb-2">{goal.icon}</span>
                        <p className="text-[14px] font-bold text-foreground">{goal.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{goal.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step > 0 && (
          <div className="flex items-center gap-3 mt-8">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => go(step - 1)}
              className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: canNext ? 1.02 : 1 }}
              whileTap={{ scale: canNext ? 0.97 : 1 }}
              onClick={() => {
                if (!canNext) return;
                if (step < TOTAL_STEPS - 1) go(step + 1);
                else onComplete();
              }}
              className={
                "flex-1 h-12 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all " +
                (canNext
                  ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                  : "bg-white/[0.05] text-muted-foreground cursor-not-allowed border border-white/[0.08]")
              }
            >
              {step === TOTAL_STEPS - 1 ? (
                <><Sparkles className="h-5 w-5" /> Let me in</>
              ) : (
                <>Continue <ChevronRight className="h-5 w-5" /></>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

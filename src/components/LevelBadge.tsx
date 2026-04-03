import { type EnglishLevel } from "@/lib/types";
const levelColors: Record<EnglishLevel, string> = {
A1: "bg-muted-foreground/20 text-muted-foreground",
A2: "bg-level-a2/20 text-level-a2",
B1: "bg-level-b1/20 text-level-b1",
B2: "bg-level-b2/20 text-level-b2",
C1: "bg-level-c1/20 text-level-c1",
C2: "bg-level-c2/20 text-level-c2",
};
const levelGlow: Record<EnglishLevel, string> = {
A1: "shadow-none",
A2: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
B1: "shadow-[0_0_12px_rgba(34,197,94,0.3)]",
B2: "shadow-[0_0_12px_rgba(249,115,22,0.3)]",
C1: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
C2: "shadow-[0_0_12px_rgba(124,58,237,0.4)]",
};
export function LevelBadge({ level, size = "sm" }: { level: EnglishLevel; size?: "sm" | "md" }) {
return (
<span
className={`
inline-flex items-center font-bold tracking-wider uppercase rounded-full
${levelColors[level]} ${levelGlow[level]}
${size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"}
`}
>
{level}
</span>
);
}
import { motion } from "framer-motion";
import { LevelBadge } from "@/components/LevelBadge";
import type { LoungeUser } from "@/lib/lounge-data";
import { useState } from "react";

interface MemberSidebarProps {
  members: LoungeUser[];
}

function MemberRow({ member }: { member: LoungeUser }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${
          member.is_online
            ? "hover:bg-white/[0.06] text-foreground/90"
            : "hover:bg-white/[0.04] text-muted-foreground/50"
        }`}
      >
        <div className="relative flex-shrink-0">
          <img
            src={member.avatar_url}
            alt=""
            className={`w-8 h-8 rounded-full ${!member.is_online ? "grayscale opacity-40" : ""}`}
          />
          {member.is_online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0d1117]" />
          )}
        </div>
        <span className={`text-[13px] font-medium truncate ${!member.is_online ? "opacity-50" : ""}`}>
          {member.full_name}
        </span>
      </motion.button>

      {/* Mini profile card on hover */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-2 top-0 w-64 bg-[#0a0e18] border border-white/[0.1] rounded-xl shadow-2xl p-4 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-3 mb-3">
            <img src={member.avatar_url} alt="" className="w-12 h-12 rounded-full border-2 border-white/10" />
            <div>
              <p className="text-sm font-bold text-foreground">{member.full_name}</p>
              <p className="text-[11px] text-muted-foreground">@{member.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <LevelBadge level={member.english_level} />
            <span className="text-[11px] text-muted-foreground">
              {member.xp_points.toLocaleString()} XP
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[11px] text-muted-foreground">
              🔥 {member.streak_count} streak
            </span>
          </div>
          {member.bio && (
            <p className="text-[12px] text-muted-foreground/80 leading-relaxed border-t border-white/[0.06] pt-2 mt-1">
              {member.bio}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export function MemberSidebar({ members }: MemberSidebarProps) {
  const online = members.filter((m) => m.is_online);
  const offline = members.filter((m) => !m.is_online);

  return (
    <div className="w-60 flex-shrink-0 bg-[#0b0f18] h-full border-l border-white/[0.06] overflow-y-auto px-2 py-4">
      {/* Online */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.08em] font-bold text-muted-foreground/50 px-2 mb-2">
          Online — {online.length}
        </p>
        <div className="space-y-0.5">
          {online.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </div>
      </div>

      {/* Offline */}
      {offline.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] font-bold text-muted-foreground/50 px-2 mb-2">
            Offline — {offline.length}
          </p>
          <div className="space-y-0.5">
            {offline.map((m) => (
              <MemberRow key={m.id} member={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

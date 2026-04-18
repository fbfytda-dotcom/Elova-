
import { motion } from "framer-motion";
import { Home, Compass, Users, User, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: Home,    label: "Home",        path: "/"        },
  { icon: Compass, label: "Rooms",       path: "/explore" },
  { icon: Users,   label: "Communities", path: "/rooms"   },
  { icon: Bell,    label: "Activity",    path: "/notifications" },
  { icon: User,    label: "Profile",     path: "/profile" },
];

export function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0d14]/95 backdrop-blur-xl border-t border-white/[0.07]">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const showBadge = item.path === "/notifications";
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.86 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative min-w-[56px]"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <item.icon
                  className={"h-[22px] w-[22px] relative z-10 transition-colors " + (active ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {showBadge && !active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              <span className={"text-[10px] font-semibold relative z-10 transition-colors " + (active ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

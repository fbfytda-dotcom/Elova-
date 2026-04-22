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
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t"
      style={{
        // Premium saturated frosted glass matching the desktop sidebar
        background: "linear-gradient(to top, rgba(5,5,15,0.95), rgba(11,15,25,0.8))",
        backdropFilter: "blur(24px) saturate(180%)",
        borderColor: "rgba(255,255,255,0.05)",
        // Massive depth shadow to lift it off the page
        boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const showBadge = item.path === "/notifications";
          
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl relative min-w-[60px]"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "rgba(139,92,246,0.12)",
                    boxShadow: "0 0 20px rgba(139,92,246,0.15)", // Glowing pill shadow
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <div className="relative">
                <item.icon
                  className={"h-[22px] w-[22px] relative z-10 transition-all duration-200 " + (active ? "text-white" : "text-white/40")}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ 
                    // Illuminated glow effect when active
                    filter: active ? "drop-shadow(0 0 8px rgba(139,92,246,0.7))" : "none" 
                  }}
                />
                {/* Pulsing Notification Dot */}
                {showBadge && !active && (
                  <motion.span 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ 
                      background: "#8b5cf6", 
                      borderColor: "#0a0d14",
                      boxShadow: "0 0 6px rgba(139,92,246,0.6)"
                    }} 
                  />
                )}
              </div>
              
              <span 
                className={"text-[10px] font-semibold relative z-10 tracking-wide transition-colors duration-200 " + (active ? "text-white" : "text-white/40")}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

// Helper component — used in page headers to show search + notifications
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderActionsProps {
  unread?: number;
}

export function HeaderActions({ unread = 3 }: HeaderActionsProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate("/search")}
        className="p-2 rounded-full hover:bg-white/[0.08] transition-colors"
      >
        <Search className="h-[19px] w-[19px] text-muted-foreground" />
      </button>
      <button
        onClick={() => navigate("/notifications")}
        className="p-2 rounded-full hover:bg-white/[0.08] transition-colors relative"
      >
        <Bell className="h-[19px] w-[19px] text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        )}
      </button>
    </div>
  );
}

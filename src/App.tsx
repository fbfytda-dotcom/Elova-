
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalLayout }    from "@/components/GlobalLayout";
import { DesktopSidebar }  from "@/components/DesktopSidebar";
import OnboardingPage      from "./pages/OnboardingPage";
import HomePage            from "./pages/HomePage";
import ExplorePage         from "./pages/ExplorePage";
import RoomsPage           from "./pages/RoomsPage";
import CommunityPage       from "./pages/CommunityPage";
import GamesPage           from "./pages/GamesPage";
import VoiceRoomPage       from "./pages/VoiceRoomPage";
import ProfilePage         from "./pages/ProfilePage";
import LoungePage          from "./pages/LoungePage";
import SearchPage          from "./pages/SearchPage";
import NotificationsPage   from "./pages/NotificationsPage";
import UserProfilePage     from "./pages/UserProfilePage";
import NotFound            from "./pages/NotFound";

const queryClient = new QueryClient();

const FULLSCREEN = ["/room/", "/onboarding"];

function AppShell({ onboarded, onComplete }: { onboarded: boolean; onComplete: () => void }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const location = useLocation();
  const openMenu  = () => setPanelOpen(true);
  const closeMenu = () => setPanelOpen(false);

  if (!onboarded) return <OnboardingPage onComplete={onComplete} />;

  const isFullscreen = FULLSCREEN.some((r) => location.pathname.startsWith(r));

  return (
    <GlobalLayout panelOpen={panelOpen} onPanelClose={closeMenu}>
      <div className={isFullscreen ? "" : "flex min-h-screen"}>
        {!isFullscreen && <DesktopSidebar />}
        <div className={isFullscreen ? "min-h-screen" : "flex-1 min-w-0"}>
          <Routes>
            <Route path="/"              element={<HomePage           onMenuOpen={openMenu} />} />
            <Route path="/explore"       element={<ExplorePage        onMenuOpen={openMenu} />} />
            <Route path="/rooms"         element={<RoomsPage          onMenuOpen={openMenu} />} />
            <Route path="/community"     element={<CommunityPage      onMenuOpen={openMenu} />} />
            <Route path="/games"         element={<GamesPage          onMenuOpen={openMenu} />} />
            <Route path="/room/:id"      element={<VoiceRoomPage      onMenuOpen={openMenu} />} />
            <Route path="/lounge/:id"    element={<LoungePage         onMenuOpen={openMenu} />} />
            <Route path="/profile"       element={<ProfilePage        onMenuOpen={openMenu} />} />
            <Route path="/search"        element={<SearchPage         onMenuOpen={openMenu} />} />
            <Route path="/notifications" element={<NotificationsPage  onMenuOpen={openMenu} />} />
            <Route path="/user/:id"      element={<UserProfilePage    onMenuOpen={openMenu} />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </GlobalLayout>
  );
}

function AppWithRouter() {
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    try { return localStorage.getItem("elova_onboarded") === "true"; }
    catch { return false; }
  });

  const handleComplete = () => {
    try { localStorage.setItem("elova_onboarded", "true"); } catch {}
    setOnboarded(true);
  };

  return <AppShell onboarded={onboarded} onComplete={handleComplete} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithRouter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

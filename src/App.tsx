import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalLayout } from "@/components/GlobalLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import RoomsPage from "./pages/RoomsPage";
import CommunityPage from "./pages/CommunityPage";
import GamesPage from "./pages/GamesPage";
import VoiceRoomPage from "./pages/VoiceRoomPage";
import ProfilePage from "./pages/ProfilePage";
import LoungePage from "./pages/LoungePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppInner() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <GlobalLayout panelOpen={panelOpen} onPanelClose={() => setPanelOpen(false)}>
      <Routes>
        <Route path="/"            element={<HomePage      onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/explore"     element={<ExplorePage   onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/rooms"       element={<RoomsPage     onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/community"   element={<CommunityPage onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/games"       element={<GamesPage     onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/room/:id"    element={<VoiceRoomPage onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/lounge/:id"  element={<LoungePage    onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="/profile"     element={<ProfilePage   onMenuOpen={() => setPanelOpen(true)} />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </GlobalLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/room/:id" element={<VoiceRoomPage />} />
          <Route path="/lounge/:id" element={<LoungePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

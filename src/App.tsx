import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import MyActivities from "./pages/MyActivities";
import Profile from "./pages/Profile";
import ClubDashboard from "./pages/ClubDashboard";
import ClubNewActivity from "./pages/ClubNewActivity";
import ClubActivities from "./pages/ClubActivities";
import ClubMembers from "./pages/ClubMembers";
import ClubPayments from "./pages/ClubPayments";
import ClubScores from "./pages/ClubScores";
import AdminDashboard from "./pages/AdminDashboard";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/my-activities" element={<MyActivities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/club" element={<ClubDashboard />} />
          <Route path="/club/new-activity" element={<ClubNewActivity />} />
          <Route path="/club/activities" element={<ClubActivities />} />
          <Route path="/club/members" element={<ClubMembers />} />
          <Route path="/club/payments" element={<ClubPayments />} />
          <Route path="/club/scores" element={<ClubScores />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

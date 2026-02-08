import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import NewActivity from "./pages/NewActivity";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import LineCallback from "./pages/LineCallback";
import ClubDashboard from "./pages/ClubDashboard";
import ClubNew from "./pages/ClubNew";
import ClubNewActivity from "./pages/ClubNewActivity";
import ClubEditActivity from "@/pages/ClubEditActivity";
import ClubActivityParticipants from "@/pages/ClubActivityParticipants";
import ClubActivities from "./pages/ClubActivities";
import ClubMembers from "./pages/ClubMembers";
import ClubPayments from "./pages/ClubPayments";
import ClubScores from "./pages/ClubScores";
// import CourseNew from "./pages/CourseNew";
// import CourseDashboard from "./pages/CourseDashboard";
// import CourseClasses from "./pages/CourseClasses";
// import CourseStudents from "./pages/CourseStudents";
// import CoursePayments from "./pages/CoursePayments";
// import Courses from "./pages/Courses";
// import CourseDetail from "./pages/CourseDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import ClubJoin from "./pages/ClubJoin";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/line/callback" element={<LineCallback />} />
              <Route path="/club/join/:code" element={<ClubJoin />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/new" element={<NewActivity />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/club" element={<ClubDashboard />} />
              <Route path="/club/new" element={<ClubNew />} />
              <Route path="/club/new-activity" element={<ClubNewActivity />} />
              <Route path="/club/activities" element={<ClubActivities />} />
              <Route path="/club/activities/:id/edit" element={<ClubEditActivity />} />
              <Route path="/club/activities/:id/participants" element={<ClubActivityParticipants />} />
              <Route path="/club/members" element={<ClubMembers />} />
              <Route path="/club/payments" element={<ClubPayments />} />
              <Route path="/club/scores" element={<ClubScores />} />
              {/* V2 Features - Course Management */}
              {/* <Route path="/courses" element={<Courses />} /> */}
              {/* <Route path="/courses/:id" element={<CourseDetail />} /> */}
              {/* <Route path="/course" element={<CourseDashboard />} /> */}
              {/* <Route path="/course/new" element={<CourseNew />} /> */}
              {/* <Route path="/course/classes" element={<CourseClasses />} /> */}
              {/* <Route path="/course/students" element={<CourseStudents />} /> */}
              {/* <Route path="/course/payments" element={<CoursePayments />} /> */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

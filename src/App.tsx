import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { StudentDashboardThemeProvider } from "./context/StudentDashboardThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

/* =======================
   Public Pages
======================= */
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutPlatform from "./pages/AboutPlatform";
import Services from "./pages/Services";
import Campus from "./pages/Campus";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import LatestNews from "./pages/LatestNews";
import Holidays from "./pages/Holidays";
import NotFound from "./pages/NotFound";

/* =======================
   Student Dashboard Pages
======================= */
import Dashboard from "./pages/student/Dashboard";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import StudentHelpdesk from "./pages/student/StudentHelpdesk";
import Chatbot from "./pages/Chatbot";
import LostAndFound from "./pages/student/LostAndFound";
import Events from "./pages/student/Events";
import StudentClubs from "./pages/student/StudentClubs";
import Polling from "./pages/student/Polling";
import Placements from "./pages/student/Placements";
import Notices from "./pages/student/Notices";
import StudentProfile from "./pages/student/StudentProfile";

/* =======================
   Faculty Dashboard Pages
======================= */
import FacultyIndex from "./pages/faculty/FacultyIndex";

/* =======================
   Admin Dashboard Pages
======================= */
import AdminIndex from "./pages/admin/AdminIndex";

/* =======================
   Query Client Setup
======================= */
const queryClient = new QueryClient();

/* =======================
   App Root
======================= */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <ThemeProvider>
            <Routes>
              {/* ---------- Public Routes ---------- */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about-platform" element={<AboutPlatform />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<Services />} />
              <Route path="/campus" element={<Campus />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:blogId" element={<Blogs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/help" element={<Help />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/latest-news" element={<LatestNews />} />
              <Route path="/holidays" element={<Holidays />} />

              {/* ---------- Faculty Dashboard Routes ---------- */}
              <Route
                path="/dashboard/faculty/*"
                element={
                  <ProtectedRoute allowedRole="faculty">
                    <FacultyIndex />
                  </ProtectedRoute>
                }
              />

              {/* ---------- Admin Dashboard Routes ---------- */}
              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminIndex />
                  </ProtectedRoute>
                }
              />

              {/* ---------- Student Dashboard Routes ---------- */}
              <Route
                path="/dashboard/student/*"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="raise-complaint" element={<RaiseComplaint />} />
                        <Route path="my-complaints" element={<MyComplaints />} />
                        <Route path="helpdesk" element={<StudentHelpdesk />} />
                        <Route path="chatbot" element={<Chatbot />} />
                        <Route path="lost-found" element={<LostAndFound />} />
                        <Route path="events" element={<Events />} />
                        <Route path="clubs" element={<StudentClubs />} />
                        <Route path="polling" element={<Polling />} />
                        <Route path="placements" element={<Placements />} />
                        <Route path="notices" element={<Notices />} />
                        <Route path="profile" element={<StudentProfile />} />
                        {/* Fallback for student dashboard */}
                        <Route path="*" element={<Dashboard />} />
                      </Routes>
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              {/* ---------- 404 ---------- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
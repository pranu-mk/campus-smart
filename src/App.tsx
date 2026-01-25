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
    Query Client
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

              
            {/* ---------- Faculty Dashboard Routes (wrapped with FacultyDashboardThemeProvider) ---------- */}
            <Route
              path="/dashboard/faculty/*"
              element={
                <ProtectedRoute allowedRole="faculty">
                    <FacultyIndex />
                </ProtectedRoute>
              }
            />  

              {/* ---------- Student Dashboard Routes ---------- */}
              {/* Note: All student routes are wrapped in StudentDashboardThemeProvider 
                  and ProtectedRoute to ensure role-based access control.
              */}
              
              <Route
                path="/dashboard/student/raise-complaint"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <RaiseComplaint />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/my-complaints"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <MyComplaints />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/helpdesk"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <StudentHelpdesk />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/chatbot"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Chatbot />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/lost-found"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <LostAndFound />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/events"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Events />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/clubs"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <StudentClubs />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/polling"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Polling />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/placements"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Placements />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/notices"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Notices />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              <Route
                path="/dashboard/student/profile"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <StudentProfile />
                    </ProtectedRoute>
                  </StudentDashboardThemeProvider>
                }
              />

              {/* Main Dashboard Base Route */}
              <Route
                path="/dashboard/student/*"
                element={
                  <StudentDashboardThemeProvider>
                    <ProtectedRoute allowedRole="student">
                      <Dashboard />
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
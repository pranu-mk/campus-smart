import { useState, useEffect } from "react";
import { 
  FileText, Clock, Loader2, CheckCircle, 
  MessageSquarePlus, HelpCircle, Bot,
  Calendar, MapPin, ChevronRight, Users, Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/student/MainLayout";
import TopNavbar from "@/components/layout/student/TopNavbar";
import StatCard from "@/components/dashboard/students/StatCard";
import QuickActionCard from "@/components/dashboard/students/QuickActionCard";
import ComplaintsTable from "@/components/dashboard/students/ComplaintsTable";
import ComplaintChart from "@/components/dashboard/students/ComplaintChart";
import NoticesPreview from "@/components/dashboard/students/NoticesPreview";
import ComplaintDetailModal from "@/components/dashboard/students/ComplaintDetailModal";
import PlacementTicker from "@/components/dashboard/students/PlacementTicker";

import { useStudentDashboardTheme } from "@/context/StudentDashboardThemeContext";
import { dashboardAPI } from "@/modules/student/services/api";

const quickActions = [
  { title: "Raise Complaint", description: "Submit a new issue", icon: MessageSquarePlus, path: "/dashboard/student/raise-complaint" },
  { title: "My Complaints", description: "Track your complaints", icon: FileText, path: "/dashboard/student/my-complaints" },
  { title: "Student Helpdesk", description: "Get help with queries", icon: HelpCircle, path: "/dashboard/student/helpdesk" },
  { title: "Campus Chatbot", description: "24/7 AI assistance", icon: Bot, path: "/dashboard/student/chatbot" },
];

const Dashboard = () => {
  const { theme } = useStudentDashboardTheme();
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 },
    recentComplaints: [],
    notices: [],
    upcomingEvents: [],
    joinedClubs: [],
    notifications: [],
    unreadCount: 0,
    // Default placeholder placements until backend is connected
    placements: [
      { company_name: "Google", role: "SDE-1", package_lpa: "32.00", deadline: "2026-10-25" },
      { company_name: "Microsoft", role: "Data Analyst", package_lpa: "28.50", deadline: "2026-10-28" },
      { company_name: "NVIDIA", role: "AI Research", package_lpa: "35.00", deadline: "2026-11-05" }
    ],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // We call the main dashboard data and placement data
        const [dashResponse, placementResponse] = await Promise.allSettled([
          dashboardAPI.getDashboardData(),
          dashboardAPI.getPlacements() // You can add this to your API service next
        ]);
        
        const actualData = dashResponse.status === 'fulfilled' ? (dashResponse.value?.data || dashResponse.value) : null;
        const placementData = placementResponse.status === 'fulfilled' ? (placementResponse.value?.data || []) : dashboardData.placements;
        
        if (actualData) {
          setDashboardData({ 
            ...actualData, 
            placements: placementData.length > 0 ? placementData : dashboardData.placements 
          });
        }
      } catch (error: any) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Complaints", value: dashboardData?.stats?.total || 0, icon: FileText, variant: "blue" as const },
    { title: "Pending", value: dashboardData?.stats?.pending || 0, icon: Clock, variant: "yellow" as const },
    { title: "In-Progress", value: dashboardData?.stats?.inProgress || 0, icon: Loader2, variant: "orange" as const },
    { title: "Resolved", value: dashboardData?.stats?.resolved || 0, icon: CheckCircle, variant: "green" as const },
  ];

  const handleViewComplaint = (id: string) => {
    const complaint = dashboardData?.recentComplaints?.find((c: any) => c.complaint_id === id);
    if (complaint) setSelectedComplaint(complaint);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#4f6fdc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TopNavbar
  title="Student Dashboard"
  subtitle={`Welcome back, ${dashboardData?.user?.full_name || 'Student'}`}
  notifications={dashboardData?.notifications || []}
/>

      {/* PLACEMENT TICKER COMPONENT */}
      <PlacementTicker placements={dashboardData.placements} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className={`text-lg font-semibold mb-4 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={action.title} {...action} delay={0.2 + index * 0.1} />
          ))}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="grid grid-cols-1 gap-6">
        <ComplaintsTable
          complaints={dashboardData?.recentComplaints || []}
          onView={handleViewComplaint}
        />
      </div>

      {/* Middle Section: Chart and Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col">
          <ComplaintChart stats={dashboardData?.stats} />
        </div>
        
        <div className="flex flex-col gap-6">
          {/* 1. UPCOMING EVENTS */}
          <div className={`p-6 rounded-2xl shadow-card transition-all duration-300 border ${
            theme === "light" 
              ? "bg-blue-50/30 border-blue-100 shadow-blue-100/20" 
              : theme === "dark"
                ? "bg-[#1e293b] border-blue-900/50"
                : "bg-gradient-to-br from-[#1e1e38] to-[#111122] border-blue-500/20 shadow-blue-500/5"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold flex items-center gap-2 ${
                theme === "light" ? "text-blue-700" : "text-blue-400"
              }`}>
                <Calendar className="w-5 h-5" /> Upcoming Events
              </h2>
              <button 
                onClick={() => navigate("/dashboard/student/events")}
                className="text-[#4f6fdc] text-sm font-medium hover:underline flex items-center"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {dashboardData?.upcomingEvents?.length > 0 ? (
                dashboardData.upcomingEvents.slice(0, 2).map((event: any) => (
                  <div key={event.id} className={`p-3 rounded-xl border transition-colors ${
                    theme === "light" ? "bg-white border-blue-50 hover:bg-blue-50/50" : "bg-black/20 border-white/5 hover:bg-black/40"
                  }`}>
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-medium ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}>{event.title}</h3>
                      {event.is_registered && (
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                          Registered
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{new Date(event.event_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{event.location || "TBA"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-2">No upcoming events scheduled.</p>
              )}
            </div>
          </div>

          {/* 2. STUDENT CLUBS */}
          <div className={`p-6 rounded-2xl shadow-card transition-all duration-300 border ${
            theme === "light" 
              ? "bg-emerald-50/30 border-emerald-100 shadow-emerald-100/20" 
              : theme === "dark"
                ? "bg-[#064e3b]/10 border-emerald-900/50"
                : "bg-gradient-to-br from-[#064e3b]/20 to-[#022c22]/30 border-emerald-500/20 shadow-emerald-500/5"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold flex items-center gap-2 ${
                theme === "light" ? "text-emerald-700" : "text-emerald-400"
              }`}>
                <Users className="w-5 h-5" /> My Memberships
              </h2>
              <button 
                onClick={() => navigate("/dashboard/student/clubs")}
                className="text-emerald-600 text-sm font-medium hover:underline flex items-center"
              >
                Explore <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {dashboardData?.joinedClubs?.length > 0 ? (
                dashboardData.joinedClubs.slice(0, 2).map((club: any) => (
                  <div key={club.id} className={`p-3 rounded-xl border transition-colors ${
                    theme === "light" ? "bg-white border-emerald-50 hover:bg-emerald-50/50" : "bg-black/20 border-white/5 hover:bg-black/40"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{club.image_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}>{club.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tight">{club.category}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500">Not joined any clubs yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. LATEST NOTICES */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className={`text-lg font-semibold flex items-center gap-2 ${
            theme === "light" ? "text-amber-700" : "text-amber-400"
          }`}>
            <Bell className="w-5 h-5" /> Latest Announcements
          </h2>
          <button 
            onClick={() => navigate("/dashboard/student/notices")}
            className="text-amber-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <NoticesPreview notices={dashboardData?.notices || []} />
      </div>

      {/* Modals */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
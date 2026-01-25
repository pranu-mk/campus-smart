import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquarePlus,
  FileText,
  HelpCircle,
  Search,
  Calendar,
  Users,
  Vote,
  Briefcase,
  Bell,
  Bot,
  LogOut,
  User,
} from "lucide-react";
import { useStudentDashboardTheme } from "@/context/StudentDashboardThemeContext";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/student" },
  { icon: MessageSquarePlus, label: "Raise Complaint", path: "/dashboard/student/raise-complaint" },
  { icon: FileText, label: "My Complaints", path: "/dashboard/student/my-complaints" },
  { icon: HelpCircle, label: "Student Helpdesk", path: "/dashboard/student/helpdesk" },
  { icon: Search, label: "Lost & Found", path: "/dashboard/student/lost-found" },
  { icon: Calendar, label: "Events", path: "/dashboard/student/events" },
  { icon: Users, label: "Student Clubs", path: "/dashboard/student/clubs" },
  { icon: Vote, label: "Polling", path: "/dashboard/student/polling" },
  { icon: Briefcase, label: "Placements", path: "/dashboard/student/placements" },
  { icon: Bell, label: "Notices", path: "/dashboard/student/notices" },
  { icon: Bot, label: "Chatbot", path: "/dashboard/student/chatbot" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useStudentDashboardTheme();
  const { user, logout } = useAuth(); 
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Reset image error state if the user object changes (e.g., new photo uploaded)
  useEffect(() => {
    setImgError(false);
  }, [user?.profile_picture]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getSidebarClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-gradient-to-b from-[#1a1a2e] to-[#252542]";
      case "fancy":
        return "bg-gradient-to-b from-[#0f3460] via-[#16213e] to-[#1a1a2e] shadow-[0_0_40px_rgba(79,111,220,0.4)]";
      default:
        return "bg-gradient-to-b from-[#4f6fdc] to-[#5b7cfa]";
    }
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed left-0 top-0 h-screen w-64 rounded-r-3xl ${
        theme === "light" ? "shadow-[4px_0_20px_rgba(79,111,220,0.15)]" : "shadow-sidebar"
      } z-50 flex flex-col overflow-hidden ${getSidebarClasses()}`}
    >
      {/* Student Profile Card */}
      <div className={`p-6 ${theme === "light" ? "border-b border-blue-200/30" : "border-b border-white/10"}`}>
        <div className="flex items-center gap-4">
          {/* Profile Image / Icon Circle */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-white/20 ${
            theme === "fancy" ? "ring-2 ring-purple-400/30" : ""
          }`}>
            {user?.profile_picture && !imgError ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Student Details */}
          <div className="min-w-0 flex-1">
            {user ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-white font-semibold text-sm truncate" title={user.full_name}>
                  {user.full_name || "Student"}
                </h3>
                <p className="text-white/70 text-[11px] truncate font-mono">
                  {user.prn || "ID Pending"}
                </p>
                <p className="text-white/50 text-[10px] uppercase tracking-tighter truncate font-bold">
                  {user.department || "General"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 w-20 bg-white/20 rounded"></div>
                <div className="h-2 w-24 bg-white/10 rounded"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;

            return (
              <motion.li
                key={item.path}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? theme === "fancy"
                        ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white font-medium shadow-lg shadow-[#4f6fdc]/30"
                        : theme === "light"
                        ? "bg-white/95 text-[#4f6fdc] font-medium shadow-md"
                        : "bg-white text-[#4f6fdc] font-medium shadow-md"
                      : theme === "light"
                      ? "text-white/80 hover:bg-white/20 hover:text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverBg"
                      className={`absolute inset-0 rounded-xl ${
                        theme === "fancy" ? "bg-white/5" : "bg-white/10"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                  <item.icon
                    className={`w-5 h-5 relative z-10 ${
                      isActive && theme !== "fancy" ? "text-[#4f6fdc]" : ""
                    }`}
                  />
                  <span className="text-sm relative z-10">{item.label}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Profile & Logout Section */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/dashboard/student/profile"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/90 hover:bg-white/10 transition-all duration-200 mb-2 ${
            location.pathname === "/dashboard/student/profile"
              ? theme === "fancy"
                ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] shadow-lg"
                : "bg-white text-[#4f6fdc]"
              : ""
          }`}
        >
          <User
            className={`w-5 h-5 ${
              location.pathname === "/dashboard/student/profile" && theme !== "fancy"
                ? "text-[#4f6fdc]"
                : ""
            }`}
          />
          <span className="text-sm">Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/90 hover:bg-red-500/20 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
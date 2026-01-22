import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ArrowLeft, Sun, Moon, Sparkles, X, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStudentDashboardTheme } from "@/context/StudentDashboardThemeContext";

interface TopNavbarProps {
  title: string;
  subtitle?: string;
  notifications?: any[];
  // NEW: Accept user data from the backend
  userData?: {
    full_name: string;
    email: string;
    prn: string;
    profile_picture?: string;
  };
}

const TopNavbar = ({ title, subtitle, notifications = [], userData }: TopNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useStudentDashboardTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const isHomePage = location.pathname === "/dashboard/student";
  const unreadCount = notifications.length;

  const getThemeClasses = () => {
    switch (theme) {
      case "dark": return "bg-[#1a1a2e] text-white shadow-sm";
      case "fancy": return "bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white";
      default: return "bg-white text-[#1f2937] shadow-sm border-b border-blue-100/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between mb-6 p-4 rounded-2xl ${getThemeClasses()}`}
    >
      <div className="flex items-center gap-4">
        {/* Profile Picture / Icon */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-blue-500 flex items-center justify-center shadow-inner">
          {userData?.profile_picture ? (
            <img src={userData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="text-white w-6 h-6" />
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold leading-tight">
            {/* Dynamic Name */}
            {userData?.full_name ? `Welcome, ${userData.full_name}` : title}
          </h1>
          <p className={`text-sm opacity-70`}>
            {/* Dynamic PRN and Email */}
            {userData?.prn ? `${userData.prn} | ${userData.email}` : subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggles (Keep your existing code here) */}
        <div className={`flex items-center gap-1 p-1 rounded-xl ${theme === "light" ? "bg-gray-100" : "bg-white/10"}`}>
          <button onClick={() => setTheme("light")} className={`p-2 rounded-lg ${theme === "light" ? "bg-white text-[#4f6fdc]" : "text-white/70"}`}><Sun className="w-4 h-4" /></button>
          <button onClick={() => setTheme("dark")} className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#3d3d5c] text-white" : "text-white/70"}`}><Moon className="w-4 h-4" /></button>
          <button onClick={() => setTheme("fancy")} className={`p-2 rounded-lg ${theme === "fancy" ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white" : "text-white/70"}`}><Sparkles className="w-4 h-4" /></button>
        </div>

        {/* Notifications Bell (Keep your existing code here) */}
        <div className="relative">
           <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl hover:bg-black/5 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>}
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopNavbar; 
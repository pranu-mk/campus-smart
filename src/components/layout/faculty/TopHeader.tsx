import { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Sun, Moon, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: number;
  type: string;
}

interface TopHeaderProps {
  theme: "dark" | "light" | "fancy";
  onThemeChange: (theme: "dark" | "light" | "fancy") => void;
}

const TopHeader = ({ theme, onThemeChange }: TopHeaderProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // --- FETCH NOTIFICATIONS ---
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/faculty/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/faculty/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking read");
    }
  };

  // Helper for "Time Ago"
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return past.toLocaleDateString();
  };

  // Theme Styles (Kept exactly as original)
  const getHeaderStyles = () => {
    if (theme === "dark") return "bg-gray-900 border-gray-700";
    if (theme === "fancy") return "bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-700";
    return "bg-white border-gray-200";
  };
  const textStyles = (theme === "dark" || theme === "fancy") 
    ? { welcome: "text-gray-400", name: "text-white" } 
    : { welcome: "text-gray-500", name: "text-gray-800" };

  return (
    <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors ${getHeaderStyles()}`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${textStyles.welcome}`}>Welcome,</span>
        <span className={`font-semibold ${textStyles.name}`}>{user?.full_name || "Faculty Member"}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggles */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-opacity-10 bg-gray-500">
           <button onClick={() => onThemeChange("dark")} className={`p-1.5 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "text-gray-400"}`}><Moon size={16}/></button>
           <button onClick={() => onThemeChange("light")} className={`p-1.5 rounded ${theme === "light" ? "bg-white shadow text-gray-800" : "text-gray-400"}`}><Sun size={16}/></button>
           <button onClick={() => onThemeChange("fancy")} className={`p-1.5 rounded ${theme === "fancy" ? "bg-purple-500 text-white" : "text-gray-400"}`}><Sparkles size={16}/></button>
        </div>

        {/* Dynamic Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-white/10">
              <Bell className={`w-5 h-5 ${theme === "dark" || theme === "fancy" ? "text-gray-300" : "text-gray-600"}`} />
              {unreadCount > 0 && <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500">{unreadCount}</Badge>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white shadow-xl border-gray-200">
            <div className="px-4 py-3 border-b font-semibold text-gray-800">Notifications</div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem key={n.id} onClick={() => markAsRead(n.id)} className={`px-4 py-3 cursor-pointer ${n.is_read === 0 ? "bg-blue-50" : ""}`}>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock size={10}/>{getTimeAgo(n.created_at)}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">No notifications</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopHeader;
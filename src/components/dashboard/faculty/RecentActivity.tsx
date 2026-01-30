import { Clock, AlertCircle, CheckCircle, FileText, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import type { Theme } from "@/pages/Index";

// Define the shape of data coming from our new backend query
interface ActivityData {
  id: number;
  title: string;
  status: string;
  studentName: string;
  timestamp: string;
}

interface RecentActivityProps {
  theme?: Theme;
  activities?: ActivityData[]; // Prop for dynamic data
}

const iconMap: Record<string, any> = {
  Pending: Clock,
  Resolved: CheckCircle,
  Rejected: AlertCircle,
  default: FileText,
};

const getColorMap = (theme: Theme) => {
  const isLight = theme === "light";
  return {
    Pending: { 
        bg: isLight ? "#FFFBEB" : "rgba(217, 119, 6, 0.15)", 
        icon: "#D97706" 
    },
    Resolved: { 
        bg: isLight ? "#ECFDF5" : "rgba(16, 185, 129, 0.15)", 
        icon: "#10B981" 
    },
    Rejected: { 
        bg: isLight ? "#FEF2F2" : "rgba(239, 68, 68, 0.15)", 
        icon: "#EF4444" 
    },
    default: { 
        bg: isLight ? "#EFF6FF" : "rgba(59, 130, 246, 0.15)", 
        icon: "#3B82F6" 
    },
  };
};

const RecentActivity = ({ theme = "dark", activities = [] }: RecentActivityProps) => {
  const navigate = useNavigate(); // Initialize navigation
  const colorMap = getColorMap(theme);
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";

  // Helper to format the MySQL timestamp into a readable format
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`rounded-xl p-6 border ${isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDark || isFancy ? "text-gray-100" : "text-gray-800"}`}>
          Recent Activity
        </h3>
        
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = iconMap[activity.status] || iconMap.default;
            const colors = colorMap[activity.status as keyof typeof colorMap] || colorMap.default;
            
            return (
              <div 
                key={activity.id} 
                className={`flex items-start gap-4 p-3 rounded-lg transition-colors animate-fade-in hover:${isDark || isFancy ? "bg-gray-700/50" : "bg-gray-50"}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: colors.icon }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDark || isFancy ? "text-gray-200" : "text-gray-800"}`}>
                    {activity.title}
                  </p>
                  <p className="text-sm truncate text-gray-500">
                    Raised by {activity.studentName} • {activity.status}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-xs whitespace-nowrap text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm italic">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
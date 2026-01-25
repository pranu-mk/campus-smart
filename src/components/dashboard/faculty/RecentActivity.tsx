import { Clock, AlertCircle, CheckCircle, FileText, Bell } from "lucide-react";
import type { Theme } from "@/pages/Index";

interface Activity {
  id: string;
  type: "assigned" | "updated" | "alert" | "resolved";
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  theme?: Theme;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "assigned",
    title: "New Complaint Assigned",
    description: "Hostel facility issue from John Doe - CSE Dept",
    time: "5 min ago",
  },
  {
    id: "2",
    type: "alert",
    title: "Pending Alert",
    description: "Complaint #1234 pending for 24+ hours",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "resolved",
    title: "Complaint Resolved",
    description: "Library access issue - #1230 marked as resolved",
    time: "2 hours ago",
  },
  {
    id: "4",
    type: "updated",
    title: "Status Updated",
    description: "Complaint #1228 moved to In Progress",
    time: "3 hours ago",
  },
  {
    id: "5",
    type: "assigned",
    title: "New Complaint Assigned",
    description: "Lab equipment malfunction from Sarah Smith",
    time: "5 hours ago",
  },
];

const iconMap = {
  assigned: FileText,
  updated: Bell,
  alert: AlertCircle,
  resolved: CheckCircle,
};

// Softer icon colors
const getColorMap = (theme: Theme) => {
  if (theme === "light") {
    return {
      assigned: { bg: "#EFF6FF", icon: "#3B82F6" },
      updated: { bg: "#EEF2FF", icon: "#6366F1" },
      alert: { bg: "#FFFBEB", icon: "#D97706" },
      resolved: { bg: "#ECFDF5", icon: "#10B981" },
    };
  }
  return {
    assigned: { bg: "rgba(59, 130, 246, 0.15)", icon: "#3B82F6" },
    updated: { bg: "rgba(99, 102, 241, 0.15)", icon: "#6366F1" },
    alert: { bg: "rgba(217, 119, 6, 0.15)", icon: "#D97706" },
    resolved: { bg: "rgba(16, 185, 129, 0.15)", icon: "#10B981" },
  };
};

const RecentActivity = ({ theme = "dark" }: RecentActivityProps) => {
  const colorMap = getColorMap(theme);
  const isLight = theme === "light";

  return (
    <div 
      className="rounded-xl p-6 border"
      style={{ 
        backgroundColor: isLight ? "#FFFFFF" : "#FFFFFF",
        borderColor: "#E5E7EB"
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Activity
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          const colors = colorMap[activity.type];
          return (
            <div 
              key={activity.id} 
              className="flex items-start gap-4 p-3 rounded-lg transition-colors animate-fade-in hover:bg-gray-50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: colors.icon }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {activity.title}
                </p>
                <p className="text-sm truncate text-gray-500">
                  {activity.description}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-xs whitespace-nowrap text-gray-400">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
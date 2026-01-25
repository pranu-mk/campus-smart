import { FileText, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/faculty/StatCard";
import RecentActivity from "@/components/dashboard/faculty/RecentActivity";
import ComplaintsChart from "@/components/dashboard/faculty/ComplaintsChart";
import StatusPieChart from "@/components/dashboard/faculty/StatusPieChart";
import type { Theme } from "@/pages/Index";

interface DashboardProps {
  theme?: Theme;
}

const Dashboard = ({ theme = "dark" }: DashboardProps) => {
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  
  const textPrimary = isDark || isFancy ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark || isFancy ? "text-gray-400" : "text-gray-500";

  return (
    <div className="page-enter space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Dashboard Overview</h1>
          <p className={`mt-1 ${textSecondary}`}>Welcome back, Dr. Rajesh Kumar</p>
        </div>
        <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Assigned"
          value={124}
          icon={FileText}
          variant="primary"
          theme={theme}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending"
          value={28}
          icon={Clock}
          variant="warning"
          theme={theme}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Resolved"
          value={82}
          icon={CheckCircle}
          variant="success"
          theme={theme}
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Rejected"
          value={14}
          icon={XCircle}
          variant="destructive"
          theme={theme}
        />
        <StatCard
          title="Today's Complaints"
          value={7}
          icon={Calendar}
          variant="default"
          theme={theme}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ComplaintsChart theme={theme} />
        </div>
        <div>
          <StatusPieChart theme={theme} />
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity theme={theme} />
        
        {/* Quick Actions - Theme aware */}
        <div 
          className={`rounded-xl p-6 border ${isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "View Pending", count: 28, bg: isDark || isFancy ? "bg-yellow-900/30" : "#FEF3C7", iconColor: "#D97706", textColor: isDark || isFancy ? "#FCD34D" : "#92400E" },
              { label: "High Priority", count: 5, bg: isDark || isFancy ? "bg-red-900/30" : "#FEE2E2", iconColor: "#EF4444", textColor: isDark || isFancy ? "#FCA5A5" : "#991B1B" },
              { label: "Unread Messages", count: 12, bg: isDark || isFancy ? "bg-blue-900/30" : "#DBEAFE", iconColor: "#3B82F6", textColor: isDark || isFancy ? "#93C5FD" : "#1E40AF" },
              { label: "Due Today", count: 3, bg: isDark || isFancy ? "bg-indigo-900/30" : "#EDE9FE", iconColor: "#6366F1", textColor: isDark || isFancy ? "#A5B4FC" : "#4338CA" },
            ].map((action, index) => (
              <button 
                key={index}
                className={`p-4 rounded-xl transition-all duration-200 text-left group hover:brightness-95 border ${isDark || isFancy ? "border-gray-700" : "border-gray-200"}`}
                style={{ backgroundColor: typeof action.bg === "string" && action.bg.startsWith("bg-") ? undefined : action.bg }}
              >
                <p className="text-2xl font-bold" style={{ color: action.textColor }}>{action.count}</p>
                <p className="text-sm" style={{ color: action.textColor, opacity: 0.8 }}>{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
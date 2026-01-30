import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Clock, CheckCircle, XCircle, Calendar, Loader2 } from "lucide-react";
import StatCard from "@/components/dashboard/faculty/StatCard";
import RecentActivity from "@/components/dashboard/faculty/RecentActivity";
import ComplaintsChart from "@/components/dashboard/faculty/ComplaintsChart";
import StatusPieChart from "@/components/dashboard/faculty/StatusPieChart";
import type { Theme } from "@/pages/Index";

interface DashboardProps {
  theme?: Theme;
}

// 1. Updated Interface to include chartData
interface DashboardStats {
  totalAssigned: number;
  pending: number;
  resolved: number;
  rejected: number;
  todaysComplaints: number;
  facultyName: string;
  chartData: { name: string; total: number }[];
  pieData: { name: string; value: number; color: string }[];
  recentActivity: { id: number; title: string; status: string; studentName: string; timestamp: string }[]; // Add this
}

const Dashboard = ({ theme = "dark" }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  const textPrimary = isDark || isFancy ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark || isFancy ? "text-gray-400" : "text-gray-500";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/faculty/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching faculty stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Dashboard Overview</h1>
          <p className={`mt-1 ${textSecondary}`}>
            Welcome back, {stats?.facultyName || "Faculty Member"}
          </p>
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
          value={stats?.totalAssigned || 0}
          icon={FileText}
          variant="primary"
          theme={theme}
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          variant="warning"
          theme={theme}
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          variant="success"
          theme={theme}
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected || 0}
          icon={XCircle}
          variant="destructive"
          theme={theme}
        />
        <StatCard
          title="Today's Complaints"
          value={stats?.todaysComplaints || 0}
          icon={Calendar}
          variant="default"
          theme={theme}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* 2. Passing the real chart data here */}
          <ComplaintsChart theme={theme} data={stats?.chartData || []} />
        </div>
        <div>
          <StatusPieChart theme={theme} data={stats?.pieData || []} />
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity theme={theme} activities={stats?.recentActivity || []} />
        
        <div className={`rounded-xl p-6 border ${isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "View Pending", count: stats?.pending || 0, bg: isDark || isFancy ? "bg-yellow-900/30" : "#FEF3C7", textColor: isDark || isFancy ? "#FCD34D" : "#92400E" },
              { label: "Total Assigned", count: stats?.totalAssigned || 0, bg: isDark || isFancy ? "bg-blue-900/30" : "#DBEAFE", textColor: isDark || isFancy ? "#93C5FD" : "#1E40AF" },
            ].map((action, index) => (
              <button key={index} className={`p-4 rounded-xl transition-all duration-200 text-left group hover:brightness-95 border ${isDark || isFancy ? "border-gray-700" : "border-gray-200"}`}
                style={{ backgroundColor: action.bg }}>
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
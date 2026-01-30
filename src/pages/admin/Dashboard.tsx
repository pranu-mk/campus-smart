import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  MessageSquareWarning,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { NeonCard } from '@/components/ui/NeonCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityChip } from '@/components/ui/PriorityChip';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { dashboardStats, complaints, events, placementDrives } from '@/data/admin/dummyData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const complaintTrend = [
  { month: 'Jan', complaints: 45, resolved: 38 },
  { month: 'Feb', complaints: 52, resolved: 48 },
  { month: 'Mar', complaints: 38, resolved: 35 },
  { month: 'Apr', complaints: 65, resolved: 58 },
  { month: 'May', complaints: 48, resolved: 45 },
  { month: 'Jun', complaints: 72, resolved: 68 },
];

const categoryData = [
  { name: 'Infrastructure', value: 35, color: 'hsl(180, 100%, 50%)' },
  { name: 'Academic', value: 25, color: 'hsl(270, 100%, 65%)' },
  { name: 'Maintenance', value: 20, color: 'hsl(320, 100%, 60%)' },
  { name: 'Health', value: 12, color: 'hsl(150, 100%, 50%)' },
  { name: 'Other', value: 8, color: 'hsl(50, 100%, 55%)' },
];

const departmentStats = [
  { dept: 'CS', count: 45 },
  { dept: 'EC', count: 32 },
  { dept: 'ME', count: 28 },
  { dept: 'CV', count: 22 },
  { dept: 'IT', count: 38 },
];

export function DashboardPage() {
  const recentComplaints = complaints.slice(0, 4);
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);
  const upcomingPlacements = placementDrives.filter((p) => p.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Admin. Here's your campus overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-neon-red animate-pulse" />
          <span>System Online</span>
          <span className="text-border">|</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={dashboardStats.totalStudents}
          change="+12% from last month"
          changeType="positive"
          icon={GraduationCap}
          glowColor="cyan"
          delay={0}
        />
        <StatsCard
          title="Faculty Members"
          value={dashboardStats.totalFaculty}
          change="+3 new this month"
          changeType="positive"
          icon={Users}
          glowColor="purple"
          delay={0.1}
        />
        <StatsCard
          title="Total Complaints"
          value={dashboardStats.totalComplaints}
          change="-8% from last month"
          changeType="positive"
          icon={MessageSquareWarning}
          glowColor="pink"
          delay={0.2}
        />
        <StatsCard
          title="Resolution Rate"
          value={`${dashboardStats.satisfactionRate}%`}
          change="+5% improvement"
          changeType="positive"
          icon={CheckCircle2}
          glowColor="green"
          delay={0.3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NeonCard glowColor="cyan" className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-neon-yellow">
            <Clock className="w-5 h-5" />
            <span className="text-2xl font-bold font-orbitron">{dashboardStats.pendingComplaints}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Pending</p>
        </NeonCard>
        <NeonCard glowColor="purple" className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-neon-green">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-2xl font-bold font-orbitron">{dashboardStats.resolvedComplaints}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Resolved</p>
        </NeonCard>
        <NeonCard glowColor="pink" className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-2xl font-bold font-orbitron">{dashboardStats.escalatedComplaints}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Escalated</p>
        </NeonCard>
        <NeonCard glowColor="green" className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-neon-cyan">
            <TrendingUp className="w-5 h-5" />
            <span className="text-2xl font-bold font-orbitron">{dashboardStats.averageResolutionTime}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Avg. Resolution</p>
        </NeonCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Trend Chart */}
        <NeonCard glowColor="cyan" className="lg:col-span-2">
          <h3 className="text-lg font-semibold font-orbitron mb-4 text-foreground">
            Complaint Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintTrend}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(150, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(150, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 30%, 20%)" />
                <XAxis dataKey="month" stroke="hsl(220, 15%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(220, 15%, 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(230, 30%, 10%)',
                    border: '1px solid hsl(180, 100%, 50%, 0.3)',
                    borderRadius: '8px',
                    color: 'hsl(180, 100%, 95%)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="hsl(320, 100%, 60%)"
                  strokeWidth={2}
                  fill="url(#colorComplaints)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(150, 100%, 50%)"
                  strokeWidth={2}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>

        {/* Category Pie Chart */}
        <NeonCard glowColor="purple">
          <h3 className="text-lg font-semibold font-orbitron mb-4 text-foreground">
            By Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(230, 30%, 10%)',
                    border: '1px solid hsl(270, 100%, 65%, 0.3)',
                    borderRadius: '8px',
                    color: 'hsl(180, 100%, 95%)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>
        </NeonCard>
      </div>

      {/* Department Bar Chart */}
      <NeonCard glowColor="pink">
        <h3 className="text-lg font-semibold font-orbitron mb-4 text-foreground">
          Complaints by Department
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 30%, 20%)" />
              <XAxis type="number" stroke="hsl(220, 15%, 60%)" fontSize={12} />
              <YAxis dataKey="dept" type="category" stroke="hsl(220, 15%, 60%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(230, 30%, 10%)',
                  border: '1px solid hsl(320, 100%, 60%, 0.3)',
                  borderRadius: '8px',
                  color: 'hsl(180, 100%, 95%)',
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(270, 100%, 65%)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </NeonCard>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <NeonCard glowColor="cyan" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-orbitron text-foreground">
              Recent Complaints
            </h3>
            <a href="/complaints" className="text-sm text-neon-cyan hover:underline">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {recentComplaints.map((complaint, i) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <NeonAvatar
                  initials={complaint.studentName.split(' ').map((n) => n[0]).join('')}
                  glowColor={i % 2 === 0 ? 'cyan' : 'purple'}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{complaint.title}</p>
                  <p className="text-sm text-muted-foreground">{complaint.studentName}</p>
                </div>
                <PriorityChip priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </motion.div>
            ))}
          </div>
        </NeonCard>

        {/* Upcoming Events & Placements */}
        <div className="space-y-6">
          <NeonCard glowColor="purple">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-orbitron text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neon-purple" />
                Events
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date} • {event.venue}
                  </p>
                </div>
              ))}
            </div>
          </NeonCard>

          <NeonCard glowColor="green">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-orbitron text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-neon-green" />
                Placements
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingPlacements.map((drive) => (
                <div
                  key={drive.id}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <p className="font-medium text-foreground">{drive.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {drive.role} • {drive.package}
                  </p>
                </div>
              ))}
            </div>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}

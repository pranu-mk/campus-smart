import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, FileText, Download } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { dashboardStats } from '@/data/admin/dummyData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie } from 'recharts';

const monthlyData = [
  { month: 'Jul', complaints: 85, resolved: 72 },
  { month: 'Aug', complaints: 92, resolved: 88 },
  { month: 'Sep', complaints: 78, resolved: 75 },
  { month: 'Oct', complaints: 105, resolved: 98 },
  { month: 'Nov', complaints: 88, resolved: 82 },
  { month: 'Dec', complaints: 95, resolved: 90 },
];

const departmentData = [
  { name: 'Computer Science', value: 35 },
  { name: 'Electronics', value: 25 },
  { name: 'Mechanical', value: 20 },
  { name: 'Civil', value: 12 },
  { name: 'IT', value: 8 },
];

const categoryData = [
  { category: 'Infrastructure', count: 45 },
  { category: 'Academic', count: 32 },
  { category: 'Maintenance', count: 28 },
  { category: 'Admin', count: 22 },
  { category: 'Hostel', count: 18 },
];

const COLORS = ['hsl(180, 100%, 50%)', 'hsl(270, 100%, 65%)', 'hsl(320, 100%, 60%)', 'hsl(150, 100%, 50%)', 'hsl(50, 100%, 55%)'];

type ReportType = 'complaints' | 'students' | 'department';

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('complaints');

  const handleDownloadReport = (type: string) => {
    alert(`Downloading ${type} report as PDF...`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora ">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive campus insights</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Complaints', value: dashboardStats.totalComplaints, icon: BarChart3, color: 'cyan' },
          { label: 'Resolution Rate', value: `${dashboardStats.satisfactionRate}%`, icon: TrendingUp, color: 'green' },
          { label: 'Avg Time', value: dashboardStats.averageResolutionTime, icon: Activity, color: 'purple' },
          { label: 'Escalated', value: dashboardStats.escalatedComplaints, icon: PieChart, color: 'pink' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <NeonCard glowColor={stat.color as 'cyan' | 'purple' | 'pink' | 'green'} className="text-center">
              <stat.icon className={`w-8 h-8 mx-auto text-neon-${stat.color} mb-2`} />
              <p className="text-2xl font-bold font-orbitron text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'complaints' as const, label: 'Complaint Report', icon: FileText },
          { id: 'students' as const, label: 'Student Report', icon: BarChart3 },
          { id: 'department' as const, label: 'Department Stats', icon: PieChart },
        ].map((report) => (
          <motion.button
            key={report.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveReport(report.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeReport === report.id
                ? 'bg-neon-cyan text-background glow-cyan'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <report.icon className="w-4 h-4" />
            {report.label}
          </motion.button>
        ))}
      </div>

      {/* Complaint Report */}
      <AnimatePresence mode="wait">
        {activeReport === 'complaints' && (
          <motion.div
            key="complaints"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <NeonCard glowColor="cyan">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-orbitron">Monthly Performance</h3>
                <GlowButton 
                  variant="cyan" 
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => handleDownloadReport('Complaint')}
                >
                  Download
                </GlowButton>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(150, 100%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(150, 100%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 30%, 20%)" />
                    <XAxis dataKey="month" stroke="hsl(220, 15%, 60%)" />
                    <YAxis stroke="hsl(220, 15%, 60%)" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(230, 30%, 10%)', border: '1px solid hsl(180, 100%, 50%, 0.3)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="complaints" stroke="hsl(320, 100%, 60%)" fill="url(#colorC)" strokeWidth={2} />
                    <Area type="monotone" dataKey="resolved" stroke="hsl(150, 100%, 50%)" fill="url(#colorR)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </NeonCard>
          </motion.div>
        )}

        {activeReport === 'students' && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <NeonCard glowColor="purple">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-orbitron">Category-wise Complaints</h3>
                <GlowButton 
                  variant="purple" 
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => handleDownloadReport('Student')}
                >
                  Download
                </GlowButton>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 30%, 20%)" />
                    <XAxis dataKey="category" stroke="hsl(220, 15%, 60%)" />
                    <YAxis stroke="hsl(220, 15%, 60%)" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(230, 30%, 10%)', border: '1px solid hsl(270, 100%, 65%, 0.3)', borderRadius: '8px' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </NeonCard>
          </motion.div>
        )}

        {activeReport === 'department' && (
          <motion.div
            key="department"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <NeonCard glowColor="pink">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-orbitron">Department Distribution</h3>
                <GlowButton 
                  variant="pink" 
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => handleDownloadReport('Department')}
                >
                  Download
                </GlowButton>
              </div>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(230, 30%, 10%)', border: '1px solid hsl(320, 100%, 60%, 0.3)', borderRadius: '8px' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {departmentData.map((dept, i) => (
                  <div key={dept.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{dept.name}</span>
                  </div>
                ))}
              </div>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

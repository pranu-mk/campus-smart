import { motion } from "framer-motion";
import { GraduationCap, Calendar, Briefcase, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useStudentDashboardTheme } from "@/context/StudentDashboardThemeContext";

interface Notice {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'event' | 'placement' | 'holiday' | 'technical' | 'other';
  date: string;
}

interface NoticesPreviewProps {
  notices: Notice[];
}

const getNoticeIcon = (category: string) => {
  switch (category) {
    case 'academic': return GraduationCap;
    case 'event':
    case 'technical': return Calendar;
    case 'placement': return Briefcase;
    default: return Bell;
  }
};

const getNoticeColor = (category: string) => {
  switch (category) {
    case 'academic': return "#4f6fdc";
    case 'event':
    case 'technical': return "#49b675";
    case 'placement': return "#f39c3d";
    default: return "#6b7280";
  }
};

const NoticesPreview = ({ notices }: NoticesPreviewProps) => {
  const { theme } = useStudentDashboardTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className={`p-6 rounded-2xl shadow-card transition-all duration-300 border ${
        theme === "light" 
          ? "bg-amber-50/30 border-amber-100 shadow-amber-100/20" 
          : theme === "dark"
            ? "bg-[#2d1b10]/20 border-amber-900/40"
            : "bg-gradient-to-br from-[#2d1b10]/40 to-[#1a1a2e] border-amber-500/20 shadow-blue-500/5"
      }`}
    >
      {/* THE DUPLICATE HEADER BLOCK HAS BEEN REMOVED FROM HERE */}

      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm italic">No new announcements at this time.</p>
          </div>
        ) : (
          notices.slice(0, 4).map((notice, index) => {
            const Icon = getNoticeIcon(notice.category);
            const color = getNoticeColor(notice.category);
            
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all border ${
                  theme === "light" 
                    ? "bg-white border-amber-50 hover:bg-amber-100/50" 
                    : "bg-black/20 border-white/5 hover:bg-black/40"
                } cursor-pointer`}
                onClick={() => navigate("/dashboard/student/notices")}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium line-clamp-1 ${
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}>
                    {notice.title}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(notice.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default NoticesPreview;
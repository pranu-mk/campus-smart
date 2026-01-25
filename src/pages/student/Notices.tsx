import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, GraduationCap, Calendar, Briefcase, 
  ChevronRight, Search, Loader2, Info, X 
} from "lucide-react";
import MainLayout from "@/components/layout/student/MainLayout";
import { toast } from "@/hooks/use-toast";
import { noticeAPI } from "@/modules/student/services/api"; // Ensure this matches your API service path

// Types matching the backend schema
interface Notice {
  id: string;
  title: string;
  category: 'academic' | 'event' | 'placement' | 'technical' | 'holiday' | 'other';
  date: string;
  description: string;
  important: boolean;
}

const categoryIcons: Record<string, any> = {
  academic: GraduationCap,
  event: Calendar,
  technical: Calendar,
  placement: Briefcase,
  holiday: Info,
  other: Bell,
};

const categoryColors: Record<string, string> = {
  academic: "#4f6fdc",
  event: "#49b675",
  technical: "#9333ea",
  placement: "#f39c3d",
  holiday: "#ef4444",
  other: "#6b7280",
};

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // FETCH DATA FROM BACKEND
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await noticeAPI.getNotices(); // Dynamically pulls from MySQL
      setNotices(data);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to fetch notices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesFilter = filter === "all" || notice.category === filter;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1f2937]">Digital Notice Board</h1>
        <p className="text-[#6b7280]">Stay updated with official campus announcements</p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-6 flex flex-wrap items-center gap-4 border border-gray-100"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {[
            { key: "all", label: "All", icon: Bell },
            { key: "academic", label: "Academic", icon: GraduationCap },
            { key: "event", label: "Events", icon: Calendar },
            { key: "placement", label: "Placement", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === tab.key
                    ? "bg-[#4f6fdc] text-white shadow-lg shadow-[#4f6fdc]/20"
                    : "bg-gray-100 text-[#6b7280] hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 focus:border-[#4f6fdc] focus:ring-2 focus:ring-[#4f6fdc]/10 outline-none text-[#1f2937] transition-all"
          />
        </div>
      </motion.div>

      {/* Notices List */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6b7280]">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#4f6fdc]" />
            <p>Fetching official notices...</p>
          </div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((notice, index) => {
            const Icon = categoryIcons[notice.category] || Bell;
            const color = categoryColors[notice.category] || "#6b7280";
            
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedNotice(notice)}
                className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover border border-transparent hover:border-[#4f6fdc]/20 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {notice.important && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 animate-pulse">
                          IMPORTANT
                        </span>
                      )}
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {notice.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1f2937] mb-1 group-hover:text-[#4f6fdc] transition-colors line-clamp-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-[#6b7280] line-clamp-2 mb-3">{notice.description}</p>
                    <div className="flex items-center text-[11px] text-[#9ca3af] font-medium">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9ca3af] group-hover:text-[#4f6fdc] group-hover:translate-x-1 transition-all self-center" />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No notices found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden"
            >
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: categoryColors[selectedNotice.category] }} 
              />
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    {selectedNotice.important && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                        IMPORTANT
                      </span>
                    )}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                      style={{ 
                        backgroundColor: `${categoryColors[selectedNotice.category]}15`, 
                        color: categoryColors[selectedNotice.category] 
                      }}
                    >
                      {selectedNotice.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedNotice(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-[#1f2937] mb-2 leading-tight">
                  {selectedNotice.title}
                </h2>
                <div className="flex items-center text-sm text-gray-400 mb-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(selectedNotice.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-8">
                  {selectedNotice.description}
                </div>

                <button
                  onClick={() => setSelectedNotice(null)}
                  className="w-full py-4 rounded-2xl bg-[#1f2937] text-white font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Notices;
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, GraduationCap, Calendar, Briefcase, ChevronRight, Search, Filter } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const notices = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule Released",
    category: "academic",
    date: "Jan 18, 2026",
    description: "The mid-semester examination schedule for all departments has been released. Please check the exam portal for your individual schedule.",
    important: true,
  },
  {
    id: "2",
    title: "Annual Cultural Fest Registration Open",
    category: "event",
    date: "Jan 17, 2026",
    description: "Registration for the annual cultural fest 'Resonance 2026' is now open. Register by January 25 to participate.",
    important: false,
  },
  {
    id: "3",
    title: "Google Hiring Drive - Apply Now",
    category: "placement",
    date: "Jan 16, 2026",
    description: "Google is conducting a campus hiring drive on February 5. Eligible students can apply through the placement portal.",
    important: true,
  },
  {
    id: "4",
    title: "Library Holiday on January 26",
    category: "academic",
    date: "Jan 15, 2026",
    description: "The central library will remain closed on January 26 due to Republic Day celebrations.",
    important: false,
  },
  {
    id: "5",
    title: "Workshop on Machine Learning",
    category: "event",
    date: "Jan 14, 2026",
    description: "A two-day workshop on Machine Learning and AI will be conducted on January 20-21. Limited seats available.",
    important: false,
  },
  {
    id: "6",
    title: "Microsoft Pre-Placement Talk",
    category: "placement",
    date: "Jan 13, 2026",
    description: "Microsoft will be conducting a pre-placement talk on January 22 at 2 PM in the main auditorium.",
    important: true,
  },
  {
    id: "7",
    title: "Attendance Shortage Warning",
    category: "academic",
    date: "Jan 12, 2026",
    description: "Students with attendance below 75% are advised to regularize their attendance before the end of this month.",
    important: true,
  },
  {
    id: "8",
    title: "Sports Day Registration",
    category: "event",
    date: "Jan 11, 2026",
    description: "Register for the annual sports day events through the sports portal. Last date: January 18.",
    important: false,
  },
];

const categoryIcons: Record<string, any> = {
  academic: GraduationCap,
  event: Calendar,
  placement: Briefcase,
};

const categoryColors: Record<string, string> = {
  academic: "#4f6fdc",
  event: "#49b675",
  placement: "#f39c3d",
};

const Notices = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<typeof notices[0] | null>(null);

  const filteredNotices = notices.filter((notice) => {
    const matchesFilter = filter === "all" || notice.category === filter;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
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
        <p className="text-[#6b7280]">Stay updated with the latest announcements</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-6 flex flex-wrap items-center gap-4"
      >
        <div className="flex gap-2">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-[#4f6fdc] text-white"
                    : "bg-gray-100 text-[#6b7280] hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4f6fdc] outline-none text-[#1f2937]"
          />
        </div>
      </motion.div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice, index) => {
          const Icon = categoryIcons[notice.category];
          const color = categoryColors[notice.category];
          
          return (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedNotice(notice)}
              className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-all cursor-pointer group"
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
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        Important
                      </span>
                    )}
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {notice.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-1 group-hover:text-[#4f6fdc] transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] line-clamp-2">{notice.description}</p>
                  <p className="text-xs text-[#6b7280] mt-2">{notice.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#4f6fdc] transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNotice(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              {selectedNotice.important && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  Important
                </span>
              )}
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                style={{ backgroundColor: `${categoryColors[selectedNotice.category]}15`, color: categoryColors[selectedNotice.category] }}
              >
                {selectedNotice.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#1f2937] mb-2">{selectedNotice.title}</h2>
            <p className="text-sm text-[#6b7280] mb-4">{selectedNotice.date}</p>
            <p className="text-[#1f2937] leading-relaxed">{selectedNotice.description}</p>
            <button
              onClick={() => setSelectedNotice(null)}
              className="mt-6 w-full py-3 rounded-xl bg-[#4f6fdc] text-white font-medium hover:bg-[#4560c7] transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Notices;

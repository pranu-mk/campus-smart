import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Building2, Calendar, MapPin, DollarSign, 
  Users, CheckCircle, Clock, Loader2, ChevronDown, ChevronUp, Award,
  FileText // Added missing import
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { placementAPI } from "@/modules/student/services/api";

interface TimelineItem {
  title: string;
  date: string;
  status: "completed" | "current" | "pending";
}

interface Placement {
  id: string;
  company: string;
  role: string;
  package: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed";
  applied: boolean;
  applicationStatus: string | null;
  description: string;
  requirements: string[];
  timeline: TimelineItem[];
}

const statusColors: Record<string, string> = {
  upcoming: "#4f6fdc",
  ongoing: "#f39c3d",
  completed: "#49b675",
};

const Placements = () => {
  const { theme } = useTheme();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [stats, setStats] = useState({ totalDrives: 0, applied: 0, ongoing: 0, offers: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [placementsRes, statsData] = await Promise.all([
        placementAPI.getAll(),
        placementAPI.getStats()
      ]);

      // Accessing .data property from the backend response structure
      const placementsArray = placementsRes?.data || (Array.isArray(placementsRes) ? placementsRes : []);
      
      setPlacements(placementsArray);
      setStats(statsData || { totalDrives: 0, applied: 0, ongoing: 0, offers: 0 });
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast({ title: "Error", description: "Failed to load placement data.", variant: "destructive" });
      setPlacements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleApply = async (placementId: string, companyName: string) => {
    try {
      setIsApplying(placementId);
      await placementAPI.apply(placementId);
      toast({ title: "Applied!", description: `Successfully applied to ${companyName}.` });
      fetchData(); 
    } catch (error: any) {
      toast({ title: "Failed", description: "Could not submit application.", variant: "destructive" });
    } finally { 
      setIsApplying(null); 
    }
  };

  const filteredPlacements = filter === "all" 
    ? placements 
    : (placements?.filter(p => p.status === filter) || []);

  return (
    <MainLayout>
      <TopNavbar title="Placements & Career" subtitle="View and apply for placement drives" />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <Loader2 className="w-10 h-10 animate-spin text-[#4f6fdc] mb-4" />
          <p>Loading placement drives...</p>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Total Drives", value: stats.totalDrives, icon: Building2, color: "#4f6fdc" },
              { title: "Applied", value: stats.applied, icon: CheckCircle, color: "#49b675" },
              { title: "Ongoing", value: stats.ongoing, icon: Clock, color: "#f39c3d" },
              { title: "Offers", value: stats.offers, icon: Award, color: "#9333ea" },
            ].map((stat) => (
              <div key={stat.title} className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl shadow-card border dark:border-white/5 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-xl font-bold dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "upcoming", "ongoing", "completed"].map((s) => (
              <button 
                key={s} 
                onClick={() => setFilter(s)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === s 
                    ? "bg-[#4f6fdc] text-white shadow-lg shadow-blue-500/20" 
                    : "bg-gray-100 dark:bg-white/10 dark:text-white hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Drives List */}
          <div className="space-y-4">
            {filteredPlacements.length > 0 ? (
              filteredPlacements.map((placement) => (
                <div key={placement.id} className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-card overflow-hidden border dark:border-white/5">
                  <div className="h-1.5" style={{ backgroundColor: statusColors[placement.status] }} />
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                          <Building2 className="text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold dark:text-white">{placement.company}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold" style={{ backgroundColor: `${statusColors[placement.status]}15`, color: statusColors[placement.status] }}>
                              {placement.status}
                            </span>
                          </div>
                          <p className="text-[#4f6fdc] font-medium">{placement.role}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{placement.package}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{placement.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        {placement.applied ? (
                          <span className="flex items-center justify-center gap-1 text-sm font-bold text-green-500 bg-green-500/10 px-4 py-2 rounded-xl w-full md:w-auto">
                            <CheckCircle className="w-4 h-4" /> Applied
                          </span>
                        ) : (
                          <button 
                            disabled={isApplying === placement.id || placement.status === "completed"}
                            onClick={() => handleApply(placement.id, placement.company)}
                            className="bg-[#4f6fdc] text-white px-6 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-[#3d5bc4] transition-colors w-full md:w-auto"
                          >
                            {isApplying === placement.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply Now"}
                          </button>
                        )}
                        <button 
                          onClick={() => setExpandedId(expandedId === placement.id ? null : placement.id)} 
                          className="flex items-center gap-1 text-xs text-[#4f6fdc] font-medium hover:underline mt-1"
                        >
                          {expandedId === placement.id ? (
                            <><ChevronUp size={14} /> Hide Details</>
                          ) : (
                            <><ChevronDown size={14} /> View Timeline & Requirements</>
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === placement.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 pt-6 border-t dark:border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden"
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold mb-2 dark:text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#4f6fdc]" /> Description
                              </h4>
                              <p className="text-sm text-gray-500 leading-relaxed">{placement.description}</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-2 dark:text-white">Requirements</h4>
                              <div className="flex flex-wrap gap-2">
                                {placement.requirements.map((req, i) => (
                                  <span key={i} className="text-[11px] bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-500 border dark:border-white/5">
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-4 dark:text-white">Drive Timeline</h4>
                            <div className="relative pl-6 space-y-6">
                              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-white/10" />
                              {placement.timeline.map((item, idx) => (
                                <div key={idx} className="relative flex items-center gap-4">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                                    item.status === "completed" ? "bg-green-500" : item.status === "current" ? "bg-orange-500" : "bg-gray-200 dark:bg-white/20"
                                  }`}>
                                    {item.status === "completed" && <CheckCircle className="w-3 h-3 text-white" />}
                                    {item.status === "current" && <Clock className="w-3 h-3 text-white animate-pulse" />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold dark:text-white">{item.title}</p>
                                    <p className="text-[10px] text-gray-400">{new Date(item.date).toDateString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">No drives found</h3>
                <p className="text-sm text-gray-500">There are currently no placement drives in this category.</p>
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Placements;
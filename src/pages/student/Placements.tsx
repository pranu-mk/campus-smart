import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, Calendar, MapPin, DollarSign, Users, CheckCircle, Clock, X, ChevronDown, ChevronUp } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface Placement {
  id: string;
  company: string;
  role: string;
  package: string;
  date: string;
  location: string;
  eligibility: string;
  status: "upcoming" | "ongoing" | "completed";
  applied: boolean;
  slots: number;
  stage?: string;
  result?: string;
  description: string;
  requirements: string[];
  timeline: { stage: string; date: string; status: "completed" | "current" | "pending" }[];
}

const initialPlacements: Placement[] = [
  {
    id: "1",
    company: "Google",
    role: "Software Engineer",
    package: "₹25 LPA",
    date: "Feb 5, 2026",
    location: "Bangalore",
    eligibility: "CGPA > 7.5, CS/IT only",
    status: "upcoming",
    applied: false,
    slots: 50,
    description: "Join Google as a Software Engineer and work on cutting-edge technology products used by billions.",
    requirements: ["Strong DSA skills", "System design knowledge", "Programming proficiency in any language"],
    timeline: [
      { stage: "Registration Deadline", date: "Feb 1, 2026", status: "pending" },
      { stage: "Online Assessment", date: "Feb 3, 2026", status: "pending" },
      { stage: "Technical Interviews", date: "Feb 5, 2026", status: "pending" },
      { stage: "HR Interview", date: "Feb 5, 2026", status: "pending" },
    ],
  },
  {
    id: "2",
    company: "Microsoft",
    role: "Full Stack Developer",
    package: "₹22 LPA",
    date: "Feb 10, 2026",
    location: "Hyderabad",
    eligibility: "CGPA > 7.0, All branches",
    status: "upcoming",
    applied: false,
    slots: 40,
    description: "Build next-generation cloud and productivity solutions at Microsoft.",
    requirements: ["Full stack development experience", "Azure knowledge preferred", "Problem-solving skills"],
    timeline: [
      { stage: "Registration Deadline", date: "Feb 6, 2026", status: "pending" },
      { stage: "Coding Round", date: "Feb 8, 2026", status: "pending" },
      { stage: "Technical Interviews", date: "Feb 10, 2026", status: "pending" },
    ],
  },
  {
    id: "3",
    company: "Amazon",
    role: "SDE-1",
    package: "₹28 LPA",
    date: "Jan 28, 2026",
    location: "Bangalore",
    eligibility: "CGPA > 8.0, CS/IT only",
    status: "ongoing",
    applied: true,
    stage: "Technical Round 2",
    slots: 30,
    description: "Work on world's largest e-commerce platform and cloud infrastructure.",
    requirements: ["Excellent problem-solving", "Leadership principles", "System design fundamentals"],
    timeline: [
      { stage: "Online Assessment", date: "Jan 20, 2026", status: "completed" },
      { stage: "Technical Round 1", date: "Jan 25, 2026", status: "completed" },
      { stage: "Technical Round 2", date: "Jan 28, 2026", status: "current" },
      { stage: "Bar Raiser Round", date: "Jan 28, 2026", status: "pending" },
    ],
  },
  {
    id: "4",
    company: "TCS",
    role: "System Engineer",
    package: "₹7 LPA",
    date: "Jan 15, 2026",
    location: "Multiple",
    eligibility: "CGPA > 6.0, All branches",
    status: "completed",
    applied: true,
    result: "Selected",
    slots: 100,
    description: "Join India's largest IT services company and work on diverse technology projects.",
    requirements: ["Basic programming knowledge", "Good communication skills", "Willingness to learn"],
    timeline: [
      { stage: "Aptitude Test", date: "Jan 10, 2026", status: "completed" },
      { stage: "Technical Interview", date: "Jan 14, 2026", status: "completed" },
      { stage: "HR Interview", date: "Jan 15, 2026", status: "completed" },
      { stage: "Results Announced", date: "Jan 18, 2026", status: "completed" },
    ],
  },
  {
    id: "5",
    company: "Flipkart",
    role: "Backend Developer",
    package: "₹18 LPA",
    date: "Feb 15, 2026",
    location: "Bangalore",
    eligibility: "CGPA > 7.0, CS/IT/ECE",
    status: "upcoming",
    applied: false,
    slots: 35,
    description: "Build scalable backend systems for India's leading e-commerce platform.",
    requirements: ["Strong backend skills", "Database knowledge", "API design experience"],
    timeline: [
      { stage: "Registration", date: "Feb 10, 2026", status: "pending" },
      { stage: "Online Test", date: "Feb 12, 2026", status: "pending" },
      { stage: "Interviews", date: "Feb 15, 2026", status: "pending" },
    ],
  },
  {
    id: "6",
    company: "Infosys",
    role: "Systems Engineer",
    package: "₹6.5 LPA",
    date: "Feb 20, 2026",
    location: "Multiple",
    eligibility: "CGPA > 6.0, All branches",
    status: "upcoming",
    applied: false,
    slots: 150,
    description: "Start your career with one of India's leading IT companies.",
    requirements: ["Programming basics", "Analytical skills", "Team player"],
    timeline: [
      { stage: "Online Test", date: "Feb 18, 2026", status: "pending" },
      { stage: "Technical Interview", date: "Feb 20, 2026", status: "pending" },
    ],
  },
];

const statusColors: Record<string, string> = {
  upcoming: "#4f6fdc",
  ongoing: "#f39c3d",
  completed: "#49b675",
};

const Placements = () => {
  const { theme } = useTheme();
  const [placements, setPlacements] = useState<Placement[]>(initialPlacements);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApply = (placementId: string, companyName: string) => {
    setPlacements(placements.map(p => 
      p.id === placementId ? { ...p, applied: true } : p
    ));
    toast({
      title: "Application Submitted!",
      description: `Your application for ${companyName} has been submitted successfully.`,
    });
  };

  const filteredPlacements = filter === "all" 
    ? placements 
    : placements.filter(p => p.status === filter);

  const getCardClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-[#1a1a2e]";
      case "fancy":
        return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#4f6fdc]/20";
      default:
        return "bg-white";
    }
  };

  return (
    <MainLayout>
      <TopNavbar title="Placements & Career" subtitle="View placement drives and apply for opportunities" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Drives", value: placements.length, icon: Building2, color: "#4f6fdc" },
          { title: "Applied", value: placements.filter(p => p.applied).length, icon: CheckCircle, color: "#49b675" },
          { title: "Ongoing", value: placements.filter(p => p.status === "ongoing").length, icon: Clock, color: "#f39c3d" },
          { title: "Offers", value: placements.filter(p => p.result === "Selected").length, icon: Briefcase, color: "#9333ea" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-2xl p-5 shadow-card ${getCardClasses()}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>{stat.title}</p>
                  <p className={`text-xl font-bold ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {["all", "upcoming", "ongoing", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? theme === "fancy"
                  ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
                  : "bg-[#4f6fdc] text-white"
                : theme === "light"
                  ? "bg-white text-[#6b7280] hover:bg-gray-100 shadow-card"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      {/* Placement Cards */}
      <div className="space-y-4">
        {filteredPlacements.map((placement, index) => (
          <motion.div
            key={placement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            className={`rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow ${getCardClasses()}`}
          >
            <div
              className="h-1"
              style={{ backgroundColor: statusColors[placement.status] }}
            />
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    theme === "light" ? "bg-gray-100" : "bg-white/10"
                  }`}>
                    <Building2 className={`w-7 h-7 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`text-lg font-semibold ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                        {placement.company}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{ backgroundColor: `${statusColors[placement.status]}15`, color: statusColors[placement.status] }}
                      >
                        {placement.status}
                      </span>
                    </div>
                    <p className="text-[#4f6fdc] font-medium">{placement.role}</p>
                    <div className={`flex flex-wrap items-center gap-4 mt-2 text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {placement.package}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {placement.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {placement.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {placement.slots} slots
                      </span>
                    </div>
                    <p className={`text-xs mt-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                      <span className="font-medium">Eligibility:</span> {placement.eligibility}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {placement.status === "upcoming" && !placement.applied && (
                    <button
                      onClick={() => handleApply(placement.id, placement.company)}
                      className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                        theme === "fancy"
                          ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white hover:opacity-90"
                          : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                      }`}
                    >
                      Apply Now
                    </button>
                  )}
                  {placement.applied && placement.status === "upcoming" && (
                    <span className="flex items-center gap-1 text-sm text-[#49b675] bg-[#49b675]/10 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </span>
                  )}
                  {placement.status === "ongoing" && (
                    <div className="text-right">
                      <span className="text-sm text-[#f39c3d] font-medium">{placement.stage}</span>
                      <p className={`text-xs ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>In Progress</p>
                    </div>
                  )}
                  {placement.status === "completed" && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      placement.result === "Selected" ? "badge-resolved" : "bg-red-100 text-red-600"
                    }`}>
                      {placement.result}
                    </span>
                  )}
                  
                  <button
                    onClick={() => setExpandedId(expandedId === placement.id ? null : placement.id)}
                    className={`text-sm flex items-center gap-1 ${
                      theme === "light" ? "text-[#4f6fdc]" : "text-[#4f6fdc]"
                    }`}
                  >
                    View Details
                    {expandedId === placement.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === placement.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className={`mt-6 pt-6 border-t ${theme === "light" ? "border-gray-100" : "border-white/10"}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                        About the Role
                      </h4>
                      <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                        {placement.description}
                      </p>
                      
                      <h4 className={`font-medium mt-4 mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                        Requirements
                      </h4>
                      <ul className={`text-sm space-y-1 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                        {placement.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4f6fdc]" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className={`font-medium mb-3 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                        Drive Timeline
                      </h4>
                      <div className="relative">
                        <div className={`absolute left-3 top-2 bottom-2 w-0.5 ${theme === "light" ? "bg-gray-200" : "bg-white/20"}`} />
                        <div className="space-y-4">
                          {placement.timeline.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 relative">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                                item.status === "completed" ? "bg-[#49b675]" :
                                item.status === "current" ? "bg-[#f39c3d]" :
                                theme === "light" ? "bg-gray-200" : "bg-white/20"
                              }`}>
                                {item.status === "completed" && <CheckCircle className="w-3 h-3 text-white" />}
                                {item.status === "current" && <Clock className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                                  {item.stage}
                                </p>
                                <p className={`text-xs ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                                  {item.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Placements;

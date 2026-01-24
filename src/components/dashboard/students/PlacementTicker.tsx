import { motion } from "framer-motion";
import { Briefcase, Calendar, TrendingUp } from "lucide-react";
import { useStudentDashboardTheme } from "@/context/StudentDashboardThemeContext";

// Updated Interface to match your MySQL Schema columns
interface Placement {
  company_name: string;
  role: string;
  package_lpa: string | number;
  deadline: string;
}

const PlacementTicker = ({ placements }: { placements: Placement[] }) => {
  const { theme } = useStudentDashboardTheme();

  // If no placements are found, we don't render the ticker to keep the UI clean
  if (!placements || placements.length === 0) return null;

  // Duplicate items for a seamless loop (3x for better coverage on wide screens)
  const tickerItems = [...placements, ...placements, ...placements];

  return (
    <div className={`relative overflow-hidden mb-6 py-3 rounded-xl border ${
      theme === "light" 
        ? "bg-white border-blue-100 shadow-sm" 
        : "bg-black/20 border-white/5 shadow-inner"
    }`}>
      {/* Fixed Sticky Label - Stays on the left while text scrolls behind it */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-4 bg-gradient-to-r from-[#4f6fdc] to-[#6366f1] text-white shadow-lg">
        <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider">
          <TrendingUp size={14} className="animate-pulse" /> Upcoming Placements
        </div>
      </div>
      
      {/* Animated Content Wrapper */}
      <motion.div 
        className="flex whitespace-nowrap gap-12 pl-52"
        animate={{ x: [0, -1800] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40, // Adjust speed (higher = slower, 40-50 is usually comfortable)
            ease: "linear",
          }
        }}
      >
        {tickerItems.map((item, i) => (
          <div key={i} className="flex items-center gap-4 text-sm">
            {/* Company Name */}
            <span className={`font-bold ${theme === "light" ? "text-[#4f6fdc]" : "text-blue-400"}`}>
              {item.company_name}
            </span>

            {/* Role */}
            <span className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
              {item.role}
            </span>

            {/* Deadline Date */}
            <span className="flex items-center gap-1 text-[10px] opacity-60">
              <Calendar size={12} /> 
              {item.deadline ? new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA'}
            </span>

            {/* Package with LPA Suffix */}
            <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {item.package_lpa} LPA
            </span>

            {/* Separator Icon */}
            <Briefcase size={14} className="opacity-20 ml-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default PlacementTicker;
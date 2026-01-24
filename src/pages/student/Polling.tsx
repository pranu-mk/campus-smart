import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle, Clock, Lock, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { pollAPI } from "@/modules/student/services/api"; // Added API import

interface Poll {
  id: string;
  title: string;
  description: string;
  status: "active" | "closed";
  deadline: string;
  voted: boolean;
  votedOption?: string;
  category: string;
  options: { id: string; text: string; votes: number }[];
}

const COLORS = ["#4f6fdc", "#f6c453", "#f39c3d", "#49b675", "#9333ea"];

const categoryColors: Record<string, string> = {
  Placement: "#4f6fdc",
  Academic: "#9333ea",
  Campus: "#49b675",
  Other: "#6b7280"
};

const Polling = () => {
  const { theme } = useTheme();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  // PHASE 1: Fetch Dynamic Polls from Backend
  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await pollAPI.getAll();
      setPolls(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load polls. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // PHASE 2: Handle Dynamic Vote Submission
  const handleVote = async (pollId: string) => {
    const optionId = selectedOptions[pollId];
    if (!optionId) return;
    
    try {
      await pollAPI.submitVote(pollId, optionId);
      
      toast({
        title: "Vote Submitted!",
        description: "Thank you for participating in the poll.",
      });

      // Clear selection and refresh data to show updated charts
      setSelectedOptions({ ...selectedOptions, [pollId]: "" });
      fetchPolls(); 
    } catch (error: any) {
      toast({
        title: "Voting Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const getTotalVotes = (options: { votes: number }[]) => {
    return options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const getCardClasses = () => {
    switch (theme) {
      case "dark": return "bg-[#1a1a2e]";
      case "fancy": return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#4f6fdc]/20";
      default: return "bg-white shadow-card";
    }
  };

  const filteredPolls = filter === "all" 
    ? polls 
    : polls.filter(p => p.status === filter);

  return (
    <MainLayout>
      <TopNavbar title="Student Polling" subtitle="Participate in polls and voice your opinion" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {(["all", "active", "closed"] as const).map((status) => (
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

      {/* Polls Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <Loader2 className="w-10 h-10 animate-spin text-[#4f6fdc] mb-4" />
          <p>Fetching latest polls...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPolls.length === 0 ? (
            <div className="text-center py-20 text-gray-500 italic">
              No polls found in this category.
            </div>
          ) : (
            filteredPolls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden ${getCardClasses()}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        poll.status === "active" ? "bg-[#4f6fdc]/15" : "bg-gray-100"
                      }`}>
                        {poll.status === "active" ? (
                          <Vote className="w-5 h-5 text-[#4f6fdc]" />
                        ) : (
                          <Lock className={`w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-semibold ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                            {poll.title}
                          </h3>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${categoryColors[poll.category] || "#6b7280"}15`, 
                              color: categoryColors[poll.category] || "#6b7280" 
                            }}
                          >
                            {poll.category}
                          </span>
                        </div>
                        <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                          {poll.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        poll.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-[#6b7280]"
                      }`}>
                        {poll.status === "active" ? "Active" : "Closed"}
                      </span>
                      <p className={`text-xs mt-1 flex items-center gap-1 justify-end ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                        <Clock className="w-3 h-3" />
                        {poll.status === "active" ? `Ends ${poll.deadline}` : `Ended ${poll.deadline}`}
                      </p>
                    </div>
                  </div>

                  {poll.voted ? (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm text-[#49b675] mb-4">
                        <CheckCircle className="w-4 h-4" />
                        <span>You voted for: {poll.options.find(o => o.id === poll.votedOption)?.text}</span>
                      </div>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={poll.options} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === "light" ? "#e5e7eb" : "#ffffff20"} />
                            <XAxis type="number" stroke={theme === "light" ? "#6b7280" : "#ffffff60"} />
                            <YAxis dataKey="text" type="category" width={140} tick={{ fontSize: 12, fill: theme === "light" ? "#6b7280" : "#ffffff90" }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: theme === "light" ? "#fff" : "#1a1a2e",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                              }}
                            />
                            <Bar dataKey="votes" fill="#4f6fdc" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className={`text-xs text-center mt-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                        Total votes: {getTotalVotes(poll.options)}
                      </p>
                    </div>
                  ) : poll.status === "active" ? (
                    <div className="mt-4 space-y-2">
                      {poll.options.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedOptions[poll.id] === option.id
                              ? "border-[#4f6fdc] bg-[#4f6fdc]/5"
                              : theme === "light"
                                ? "border-gray-100 hover:border-gray-200"
                                : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            value={option.id}
                            checked={selectedOptions[poll.id] === option.id}
                            onChange={() => setSelectedOptions({ ...selectedOptions, [poll.id]: option.id })}
                            className="w-4 h-4 text-[#4f6fdc]"
                          />
                          <span className={theme === "light" ? "text-[#1f2937]" : "text-white"}>{option.text}</span>
                        </label>
                      ))}
                      <button
                        onClick={() => handleVote(poll.id)}
                        disabled={!selectedOptions[poll.id]}
                        className={`w-full mt-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          theme === "fancy"
                            ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white shadow-lg"
                            : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                        }`}
                      >
                        Submit Vote
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={poll.options}
                              dataKey="votes"
                              nameKey="text"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              labelLine={false}
                            >
                              {poll.options.map((_, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <p className={`text-xs text-center mt-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                        Total votes: {getTotalVotes(poll.options)}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Polling;
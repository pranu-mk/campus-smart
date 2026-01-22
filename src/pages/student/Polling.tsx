import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle, Clock, Lock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

const initialPolls: Poll[] = [
  {
    id: "1",
    title: "Best Placement Company 2026",
    description: "Which company would you prefer for placements?",
    status: "active",
    deadline: "Jan 30, 2026",
    voted: false,
    category: "Placement",
    options: [
      { id: "a", text: "Google", votes: 245 },
      { id: "b", text: "Microsoft", votes: 312 },
      { id: "c", text: "Amazon", votes: 178 },
      { id: "d", text: "TCS", votes: 95 },
    ],
  },
  {
    id: "2",
    title: "Guest Lecture Topic Preference",
    description: "What topic should our next guest lecture cover?",
    status: "active",
    deadline: "Feb 5, 2026",
    voted: false,
    category: "Academic",
    options: [
      { id: "a", text: "AI & Machine Learning", votes: 280 },
      { id: "b", text: "Blockchain Technology", votes: 156 },
      { id: "c", text: "Cybersecurity", votes: 198 },
      { id: "d", text: "Cloud Computing", votes: 145 },
    ],
  },
  {
    id: "3",
    title: "Preferred Interview Mode",
    description: "How would you prefer placement interviews?",
    status: "active",
    deadline: "Feb 10, 2026",
    voted: true,
    votedOption: "b",
    category: "Placement",
    options: [
      { id: "a", text: "On-campus only", votes: 320 },
      { id: "b", text: "Virtual only", votes: 180 },
      { id: "c", text: "Hybrid mode", votes: 450 },
    ],
  },
  {
    id: "4",
    title: "New Cafeteria Menu",
    description: "What food options would you like to see?",
    status: "closed",
    deadline: "Jan 15, 2026",
    voted: true,
    votedOption: "b",
    category: "Campus",
    options: [
      { id: "a", text: "More Vegetarian Options", votes: 156 },
      { id: "b", text: "South Indian Food", votes: 234 },
      { id: "c", text: "Continental Cuisine", votes: 89 },
      { id: "d", text: "Chinese Food", votes: 145 },
    ],
  },
  {
    id: "5",
    title: "Library Timing Extension",
    description: "Should library hours be extended on weekends?",
    status: "closed",
    deadline: "Jan 10, 2026",
    voted: true,
    votedOption: "a",
    category: "Campus",
    options: [
      { id: "a", text: "Yes, till 10 PM", votes: 456 },
      { id: "b", text: "No, current is fine", votes: 123 },
      { id: "c", text: "Only during exams", votes: 267 },
    ],
  },
  {
    id: "6",
    title: "Preferred Package Range",
    description: "What salary package would you target?",
    status: "active",
    deadline: "Feb 15, 2026",
    voted: false,
    category: "Placement",
    options: [
      { id: "a", text: "5-10 LPA", votes: 150 },
      { id: "b", text: "10-15 LPA", votes: 280 },
      { id: "c", text: "15-25 LPA", votes: 320 },
      { id: "d", text: "25+ LPA", votes: 180 },
    ],
  },
];

const COLORS = ["#4f6fdc", "#f6c453", "#f39c3d", "#49b675", "#9333ea"];

const categoryColors: Record<string, string> = {
  Placement: "#4f6fdc",
  Academic: "#9333ea",
  Campus: "#49b675",
};

const Polling = () => {
  const { theme } = useTheme();
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  const handleVote = (pollId: string) => {
    const optionId = selectedOptions[pollId];
    if (!optionId) return;
    
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          voted: true,
          votedOption: optionId,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    }));
    
    toast({
      title: "Vote Submitted!",
      description: "Thank you for participating in the poll.",
    });
    setSelectedOptions({ ...selectedOptions, [pollId]: "" });
  };

  const getTotalVotes = (options: { votes: number }[]) => {
    return options.reduce((sum, opt) => sum + opt.votes, 0);
  };

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
        transition={{ duration: 0.3 }}
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

      {/* Polls */}
      <div className="space-y-6">
        {filteredPolls.map((poll, index) => (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`rounded-2xl shadow-card overflow-hidden ${getCardClasses()}`}
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
                        style={{ backgroundColor: `${categoryColors[poll.category]}15`, color: categoryColors[poll.category] }}
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
                    poll.status === "active" ? "badge-resolved" : "bg-gray-100 text-[#6b7280]"
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
                        ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
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
        ))}
      </div>
    </MainLayout>
  );
};

export default Polling;

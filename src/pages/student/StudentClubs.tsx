import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, UserPlus, CheckCircle, LogOut } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  joined: boolean;
  events: number;
  category: string;
  image: string;
  activities: string[];
}

const initialClubs: Club[] = [
  { id: "1", name: "Coding Club", description: "Learn programming, participate in hackathons, and build projects together.", members: 150, joined: true, events: 12, category: "Technical", image: "💻", activities: ["Weekly coding sessions", "Hackathons", "Code reviews"] },
  { id: "2", name: "AI & ML Club", description: "Explore artificial intelligence and machine learning through projects and workshops.", members: 95, joined: false, events: 8, category: "Technical", image: "🤖", activities: ["AI project building", "ML workshops", "Research discussions"] },
  { id: "3", name: "Robotics Club", description: "Build robots, learn electronics, and participate in robotics competitions.", members: 55, joined: false, events: 10, category: "Technical", image: "🦾", activities: ["Robot building", "Arduino workshops", "Competitions"] },
  { id: "4", name: "Photography Club", description: "Capture moments, learn photography techniques, and showcase your work.", members: 80, joined: false, events: 8, category: "Creative", image: "📷", activities: ["Photo walks", "Editing workshops", "Exhibitions"] },
  { id: "5", name: "Music Society", description: "Express yourself through music, perform at events, and jam with fellow musicians.", members: 65, joined: false, events: 15, category: "Cultural", image: "🎵", activities: ["Jam sessions", "Band practice", "Open mics"] },
  { id: "6", name: "Cultural Club", description: "Celebrate diversity through dance, drama, and cultural performances.", members: 120, joined: true, events: 20, category: "Cultural", image: "🎭", activities: ["Dance practice", "Drama rehearsals", "Cultural fests"] },
  { id: "7", name: "Debate Club", description: "Sharpen your public speaking skills and participate in inter-college debates.", members: 45, joined: false, events: 6, category: "Literary", image: "🎤", activities: ["Debate sessions", "MUN", "Public speaking"] },
  { id: "8", name: "Sports Club", description: "Stay fit, compete in sports events, and represent the college.", members: 200, joined: false, events: 25, category: "Sports", image: "⚽", activities: ["Daily practice", "Inter-college matches", "Fitness sessions"] },
  { id: "9", name: "Entrepreneurship Cell", description: "Learn business skills, pitch ideas, and connect with startup ecosystem.", members: 85, joined: false, events: 10, category: "Business", image: "💼", activities: ["Startup talks", "Business plan competitions", "Mentorship"] },
  { id: "10", name: "Environment Club", description: "Work towards sustainability and environmental awareness on campus.", members: 70, joined: false, events: 12, category: "Social", image: "🌱", activities: ["Tree plantation", "Awareness campaigns", "Clean drives"] },
];

const categoryColors: Record<string, string> = {
  Technical: "#4f6fdc",
  Creative: "#f39c3d",
  Cultural: "#9333ea",
  Literary: "#0ea5e9",
  Sports: "#49b675",
  Business: "#f6c453",
  Social: "#ec4899",
};

const Clubs = () => {
  const { theme } = useTheme();
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleJoin = (clubId: string, clubName: string) => {
    setClubs(clubs.map(club => 
      club.id === clubId ? { ...club, joined: true, members: club.members + 1 } : club
    ));
    toast({
      title: "Joined Successfully!",
      description: `You are now a member of ${clubName}.`,
    });
  };

  const handleLeave = (clubId: string, clubName: string) => {
    setClubs(clubs.map(club => 
      club.id === clubId ? { ...club, joined: false, members: club.members - 1 } : club
    ));
    toast({
      title: "Left Club",
      description: `You have left ${clubName}.`,
    });
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

  const myClubs = clubs.filter(c => c.joined);

  return (
    <MainLayout>
      <TopNavbar title="Student Clubs" subtitle="Explore and join clubs that match your interests" />

      {/* My Clubs */}
      {myClubs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h2 className={`text-lg font-semibold mb-4 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>My Clubs</h2>
          <div className="flex flex-wrap gap-3">
            {myClubs.map((club) => (
              <div
                key={club.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-card ${getCardClasses()}`}
              >
                <span className="text-2xl">{club.image}</span>
                <span className={`text-sm font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{club.name}</span>
                <CheckCircle className="w-4 h-4 text-[#49b675]" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow ${getCardClasses()}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                  theme === "light" ? "bg-gray-100" : "bg-white/10"
                }`}>
                  {club.image}
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${categoryColors[club.category]}15`, color: categoryColors[club.category] }}
                >
                  {club.category}
                </span>
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                {club.name}
              </h3>
              <p className={`text-sm mb-4 line-clamp-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                {club.description}
              </p>

              {/* Activities */}
              <div className="mb-4">
                <p className={`text-xs font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                  Activities:
                </p>
                <div className="flex flex-wrap gap-1">
                  {club.activities.slice(0, 2).map((activity, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-full ${
                        theme === "light" ? "bg-gray-100 text-[#6b7280]" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`flex items-center gap-4 text-sm mb-4 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {club.members} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {club.events} events
                </span>
              </div>

              {club.joined ? (
                <div className="flex gap-2">
                  <button className="flex-1 py-3 rounded-xl bg-[#49b675]/10 text-[#49b675] font-medium flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Member
                  </button>
                  <button
                    onClick={() => handleLeave(club.id, club.name)}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      theme === "light"
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleJoin(club.id, club.name)}
                  className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    theme === "fancy"
                      ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white hover:opacity-90"
                      : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Join Club
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Clubs;

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, CheckCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  registered: boolean;
  attendees: number;
  description: string;
}

const initialEvents: Event[] = [
  { id: "1", name: "Tech Fest 2026", date: "Feb 10-12, 2026", time: "9:00 AM onwards", venue: "Main Auditorium", type: "Technical", registered: false, attendees: 450, description: "Annual technical festival with workshops, hackathons, and competitions." },
  { id: "2", name: "Cultural Night", date: "Feb 14, 2026", time: "6:00 PM", venue: "Open Air Theatre", type: "Cultural", registered: false, attendees: 800, description: "A night of music, dance, and drama performances." },
  { id: "3", name: "Sports Day", date: "Feb 20, 2026", time: "7:00 AM", venue: "Sports Complex", type: "Sports", registered: false, attendees: 600, description: "Inter-department sports competitions." },
  { id: "4", name: "Alumni Meet", date: "Feb 25, 2026", time: "10:00 AM", venue: "Conference Hall", type: "Networking", registered: true, attendees: 200, description: "Annual alumni networking event." },
  { id: "5", name: "AI & ML Workshop", date: "Feb 5, 2026", time: "2:00 PM", venue: "Lab 301", type: "Workshop", registered: false, attendees: 120, description: "Hands-on workshop on machine learning fundamentals." },
  { id: "6", name: "Guest Lecture: Entrepreneurship", date: "Feb 8, 2026", time: "11:00 AM", venue: "Seminar Hall", type: "Guest Lecture", registered: true, attendees: 300, description: "Talk by successful startup founder on building a business." },
  { id: "7", name: "Coding Competition", date: "Feb 15, 2026", time: "10:00 AM", venue: "Computer Lab", type: "Technical", registered: false, attendees: 80, description: "Inter-college coding competition with exciting prizes." },
  { id: "8", name: "Dance Workshop", date: "Feb 18, 2026", time: "4:00 PM", venue: "Activity Room", type: "Cultural", registered: false, attendees: 60, description: "Learn contemporary dance from professional choreographers." },
  { id: "9", name: "Cricket Tournament", date: "Feb 22-24, 2026", time: "8:00 AM", venue: "Cricket Ground", type: "Sports", registered: false, attendees: 160, description: "Inter-department cricket championship." },
  { id: "10", name: "Career Fair 2026", date: "Mar 1, 2026", time: "9:00 AM", venue: "Main Building", type: "Networking", registered: false, attendees: 500, description: "Meet top recruiters from leading companies." },
  { id: "11", name: "Photography Contest", date: "Feb 28, 2026", time: "All Day", venue: "Campus Wide", type: "Cultural", registered: false, attendees: 100, description: "Capture the beauty of campus life and win prizes." },
  { id: "12", name: "Yoga & Wellness Session", date: "Feb 16, 2026", time: "6:00 AM", venue: "Sports Complex", type: "Sports", registered: false, attendees: 75, description: "Morning yoga session for stress relief and wellness." },
];

const typeColors: Record<string, string> = {
  Technical: "#4f6fdc",
  Cultural: "#f39c3d",
  Sports: "#49b675",
  Networking: "#9333ea",
  Workshop: "#0ea5e9",
  "Guest Lecture": "#ec4899",
};

const Events = () => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filter, setFilter] = useState("all");

  const handleRegister = (eventId: string, eventName: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, registered: true, attendees: event.attendees + 1 } : event
    ));
    toast({
      title: "Registration Successful!",
      description: `You have registered for ${eventName}.`,
    });
  };

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(e => e.type.toLowerCase() === filter.toLowerCase());

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

  const filterOptions = ["all", "technical", "cultural", "sports", "networking", "workshop", "guest lecture"];

  return (
    <MainLayout>
      <TopNavbar title="College Events" subtitle="View upcoming events and register" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {filterOptions.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === type
                ? theme === "fancy"
                  ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
                  : "bg-[#4f6fdc] text-white"
                : theme === "light"
                  ? "bg-white text-[#6b7280] hover:bg-gray-100 shadow-card"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {type}
          </button>
        ))}
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow ${getCardClasses()}`}
          >
            <div
              className="h-2"
              style={{ backgroundColor: typeColors[event.type] || "#4f6fdc" }}
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${typeColors[event.type] || "#4f6fdc"}15`, color: typeColors[event.type] || "#4f6fdc" }}
                >
                  {event.type}
                </span>
                {event.registered && (
                  <span className="flex items-center gap-1 text-xs text-[#49b675] bg-[#49b675]/10 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Registered
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                {event.name}
              </h3>
              <p className={`text-sm mb-4 line-clamp-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} registered</span>
                </div>
              </div>

              {!event.registered ? (
                <button
                  onClick={() => handleRegister(event.id, event.name)}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    theme === "fancy"
                      ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white hover:opacity-90"
                      : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                  }`}
                >
                  Register Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-medium bg-[#49b675]/10 text-[#49b675] cursor-not-allowed"
                >
                  Already Registered
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Events;

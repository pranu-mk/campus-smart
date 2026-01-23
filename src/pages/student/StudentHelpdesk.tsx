import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, Clock, CheckCircle, Send, 
  ChevronDown, ChevronUp, User, AlertTriangle, Plus, Loader2 
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios"; // Ensure axios is installed

interface Message {
  sender: "student" | "faculty";
  message: string;
  time: string;
  senderName?: string;
}

interface Ticket {
  id: string; // The Custom TKT ID from backend
  db_id: number; // The internal MySQL ID for replies
  category: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved";
  date: string;
  priority: "Low" | "Medium" | "High";
  assignedTo: string;
  department: string;
  messages: Message[];
}

const issueCategories = ["Fee Related", "Certificate", "Academic", "Exam", "Library", "Scholarship", "Other"];
const priorityOptions = ["Low", "Medium", "High"];

const Helpdesk = () => {
  const { theme } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newTicket, setNewTicket] = useState({ 
    category: "", 
    subject: "", 
    message: "",
    priority: "Medium"
  });

  // --- STEP 1: FETCH TICKETS FROM BACKEND ---
  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token"); // Assuming you store JWT here
      const response = await axios.get("http://localhost:5000/api/student/helpdesk/tickets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTickets(response.data.tickets);
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
      toast({ title: "Error", description: "Failed to load helpdesk tickets", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // --- STEP 2: SUBMIT NEW TICKET TO BACKEND ---
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/student/helpdesk/tickets", newTicket, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast({ title: "Success", description: "Your support ticket has been created!" });
        setShowNewTicket(false);
        setNewTicket({ category: "", subject: "", message: "", priority: "Medium" });
        fetchTickets(); // Refresh the list
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create ticket", variant: "destructive" });
    }
  };

  // --- STEP 3: SUBMIT REPLY TO BACKEND ---
  const handleReply = async (ticketId: string, db_id: number) => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/api/student/helpdesk/tickets/${db_id}/messages`, {
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNewMessage("");
        fetchTickets(); // Refresh to show new message
        toast({ title: "Sent", description: "Reply added to ticket." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  const getCardClasses = () => {
    switch (theme) {
      case "dark": return "bg-[#1a1a2e] border-[#3d3d5c]";
      case "fancy": return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border-[#4f6fdc]/30 shadow-[0_0_20px_rgba(79,111,220,0.1)]";
      default: return "bg-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f39c3d";
      case "Low": return "#49b675";
      default: return "#6b7280";
    }
  };

  return (
    <MainLayout>
      <TopNavbar title="Student Helpdesk" subtitle="Get help with your queries and issues" />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowNewTicket(true)}
          className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            theme === "fancy" 
              ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white hover:opacity-90"
              : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
          }`}
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-[#4f6fdc] mb-4" />
          <p className="text-gray-500">Connecting to Helpdesk...</p>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Total Tickets", count: tickets.length, icon: MessageSquare, color: "#4f6fdc" },
              { title: "Open", count: tickets.filter(t => t.status === "Open").length, icon: Clock, color: "#f39c3d" },
              { title: "In Progress", count: tickets.filter(t => t.status === "In Progress").length, icon: AlertTriangle, color: "#f6c453" },
              { title: "Resolved", count: tickets.filter(t => t.status === "Resolved").length, icon: CheckCircle, color: "#49b675" },
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
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>{stat.title}</p>
                      <p className={`text-2xl font-bold ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{stat.count}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.length === 0 && (
                <div className="text-center py-10 text-gray-400">No support tickets found. Create one to get started!</div>
            )}
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className={`rounded-2xl shadow-card overflow-hidden ${getCardClasses()}`}
              >
                <div
                  className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${
                    theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }`}
                  onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      ticket.status === "Resolved" ? "bg-[#49b675]/15" : 
                      ticket.status === "In Progress" ? "bg-[#f6c453]/15" : "bg-[#f39c3d]/15"
                    }`}>
                      <MessageSquare className={`w-5 h-5 ${
                        ticket.status === "Resolved" ? "text-[#49b675]" : 
                        ticket.status === "In Progress" ? "text-[#f6c453]" : "text-[#f39c3d]"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[#4f6fdc]">{ticket.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${theme === "light" ? "bg-gray-100 text-[#6b7280]" : "bg-white/10 text-white/70"}`}>
                          {ticket.category}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <p className={`font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{ticket.subject}</p>
                      <p className={`text-xs mt-1 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                        Assigned: {ticket.assignedTo} • {ticket.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "Open" ? "badge-progress" : 
                      ticket.status === "In Progress" ? "badge-pending" : "badge-resolved"
                    }`}>
                      {ticket.status}
                    </span>
                    {expandedTicket === ticket.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {expandedTicket === ticket.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className={`border-t p-5 ${theme === "light" ? "border-gray-100" : "border-white/10"}`}
                  >
                    <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2">
                      {ticket.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] ${msg.sender === "student" ? "order-2" : "order-1"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.sender === "student" ? "bg-[#4f6fdc]" : "bg-[#49b675]"}`}>
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs font-medium">{msg.senderName}</span>
                              <span className="text-xs opacity-50">{msg.time}</span>
                            </div>
                            <div className={`p-3 rounded-xl ${msg.sender === "student" ? "bg-[#4f6fdc] text-white" : "bg-gray-100 dark:bg-white/10"}`}>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {ticket.status !== "Resolved" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your reply..."
                          className={`flex-1 px-4 py-2.5 rounded-xl border outline-none text-sm ${
                            theme === "light" ? "border-gray-200 focus:border-[#4f6fdc]" : "border-white/20 bg-white/5"
                          }`}
                        />
                        <button
                          onClick={() => handleReply(ticket.id, ticket.db_id)}
                          className="p-2.5 rounded-xl bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewTicket(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className={`rounded-2xl shadow-xl max-w-md w-full p-6 ${getCardClasses()}`}>
            <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <select value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })} required className="w-full px-4 py-3 rounded-xl border outline-none dark:bg-white/5">
                <option value="">Select category</option>
                {issueCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} required className="w-full px-4 py-3 rounded-xl border outline-none dark:bg-white/5">
                {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="text" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} required placeholder="Brief subject" className="w-full px-4 py-3 rounded-xl border outline-none dark:bg-white/5" />
              <textarea value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} required rows={4} placeholder="Describe your issue..." className="w-full px-4 py-3 rounded-xl border outline-none resize-none dark:bg-white/5" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewTicket(false)} className="flex-1 py-3 rounded-xl border font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#4f6fdc] text-white font-medium">Submit Ticket</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Helpdesk;
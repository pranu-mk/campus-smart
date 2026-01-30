import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, MessageSquare, Clock, Send, Loader2, LifeBuoy, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Reply {
  id: string;
  sender: "faculty" | "admin";
  message: string;
  time: string;
}

interface Ticket {
  id: string;
  issueType: string;
  subject: string;
  description?: string;
  createdDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  lastReply: string;
  replies: Reply[];
}

const statusColors = {
  Open: { bg: "#FFFBEB", text: "#D97706", border: "#FCD34D" },
  "In Progress": { bg: "#EFF6FF", text: "#2563EB", border: "#93C5FD" },
  Resolved: { bg: "#ECFDF5", text: "#059669", border: "#6EE7B7" },
  Closed: { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
};

const priorityColors = {
  Low: { bg: "#ECFDF5", text: "#059669", border: "#6EE7B7" },
  Medium: { bg: "#FFFBEB", text: "#D97706", border: "#FCD34D" },
  High: { bg: "#FEF2F2", text: "#DC2626", border: "#FCA5A5" },
};

const Helpdesk = ({ theme = "dark" }: { theme?: string }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [replyTicket, setReplyTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newTicket, setNewTicket] = useState({ issueType: "", priority: "Medium", subject: "", description: "" });

  const { toast } = useToast();
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  const cardBg = isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textPrimary = isDark || isFancy ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark || isFancy ? "text-gray-400" : "text-gray-500";
  const inputClass = isDark || isFancy ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200";

 const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/faculty/helpdesk/tickets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        // Update the list of tickets
        setTickets(res.data.data); 
        
        // IMPORTANT: Update the summary stats from the backend
        if (res.data.stats) {
          setStats({
            total: res.data.stats.total || 0,
            open: res.data.stats.open || 0,
            inProgress: res.data.stats.inProgress || 0,
            resolved: res.data.stats.resolved || 0
          });
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load tickets", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      return toast({ title: "Required Fields", description: "Please fill subject and description", variant: "destructive" });
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/faculty/helpdesk/tickets", newTicket, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: "Ticket Created", description: `Assigned ID: ${res.data.customId}` });
        setIsNewTicketOpen(false);
        setNewTicket({ issueType: "", priority: "Medium", subject: "", description: "" });
        fetchTickets();
      }
    } catch (err) {
      toast({ title: "Failed", description: "Could not create ticket", variant: "destructive" });
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !replyTicket) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/faculty/helpdesk/tickets/reply", {
        ticketCustomId: replyTicket.id,
        message: replyMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: "Reply Sent", description: "Admin will be notified." });
        setReplyMessage("");
        setReplyTicket(null);
        fetchTickets();
      }
    } catch (err) {
      toast({ title: "Failed", description: "Could not send reply", variant: "destructive" });
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Helpdesk Support</h1>
          <p className={`mt-1 ${textSecondary}`}>Track and manage your technical queries</p>
        </div>
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className={cardBg}>
            <DialogHeader><DialogTitle className={textPrimary}>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className={`text-sm mb-2 block ${textSecondary}`}>Issue Type</label>
                <Select onValueChange={(v) => setNewTicket({...newTicket, issueType: v})}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className={cardBg}>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Resource">Resource</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-sm mb-2 block ${textSecondary}`}>Priority</label>
                <Select defaultValue="Medium" onValueChange={(v: any) => setNewTicket({...newTicket, priority: v})}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent className={cardBg}>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-sm mb-2 block ${textSecondary}`}>Subject</label>
                <Input value={newTicket.subject} onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})} placeholder="Brief description" className={inputClass} />
              </div>
              <div>
                <label className={`text-sm mb-2 block ${textSecondary}`}>Description</label>
                <Textarea value={newTicket.description} onChange={(e) => setNewTicket({...newTicket, description: e.target.value})} placeholder="Details..." className={`min-h-[120px] resize-none ${inputClass}`} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className={`flex-1 ${isDark || isFancy ? "border-gray-600" : "border-gray-200"}`} onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-blue-600 text-white" onClick={handleCreateTicket}>Submit Ticket</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row - Added dynamic counts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets", count: stats.total, icon: LifeBuoy, color: "#4F46E5", bg: "#EEF2FF", border: "#C7D2FE" },
          { label: "Open Tickets", count: stats.open, icon: AlertCircle, color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
          { label: "In Progress", count: stats.inProgress, icon: Clock, color: "#2563EB", bg: "#EFF6FF", border: "#93C5FD" },
          { label: "Resolved", count: stats.resolved, icon: CheckCircle2, color: "#059669", bg: "#ECFDF5", border: "#6EE7B7" },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border shadow-sm flex items-center gap-4`} style={{ backgroundColor: stat.bg, borderColor: stat.border }}>
             <div className="p-2 rounded-lg bg-white/50"><stat.icon className="w-6 h-6" style={{ color: stat.color }} /></div>
             <div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.count}</p>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Search & List */}
      <div className={`rounded-xl p-4 shadow-sm ${cardBg}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
          <Input placeholder="Search by Ticket ID or Subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`pl-10 ${inputClass}`} />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : filteredTickets.length === 0 ? (
          <div className={`text-center py-12 border-2 border-dashed rounded-xl ${cardBg} ${textSecondary}`}>No tickets found.</div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <div key={ticket.id} className={`rounded-xl shadow-sm p-5 transition-colors animate-fade-in ${cardBg} ${isDark || isFancy ? "hover:border-blue-500" : "hover:border-blue-300"}`} style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm font-mono ${isDark || isFancy ? "text-blue-400" : "text-blue-600"}`}>{ticket.id}</span>
                    <Badge variant="outline" style={{ backgroundColor: priorityColors[ticket.priority].bg, color: priorityColors[ticket.priority].text, borderColor: priorityColors[ticket.priority].border }}>{ticket.priority}</Badge>
                    <Badge variant="outline" style={{ backgroundColor: statusColors[ticket.status].bg, color: statusColors[ticket.status].text, borderColor: statusColors[ticket.status].border }}>{ticket.status}</Badge>
                  </div>
                  <h3 className={`font-medium mb-1 ${textPrimary}`}>{ticket.subject}</h3>
                  <div className={`flex items-center gap-4 text-sm ${textSecondary}`}>
                    <span className={`px-2 py-0.5 rounded ${isDark || isFancy ? "bg-gray-700" : "bg-gray-100"}`}>{ticket.issueType}</span>
                    <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1 text-xs ${textSecondary}`}><Clock className="w-3 h-3" /> {ticket.lastReply === 'No replies yet' ? ticket.lastReply : new Date(ticket.lastReply).toLocaleTimeString()}</div>
                  <Button size="sm" variant="ghost" className={isDark || isFancy ? "text-blue-400" : "text-blue-600"} onClick={() => setReplyTicket(ticket)}><MessageSquare className="w-4 h-4 mr-1" /> Reply</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      <Dialog open={!!replyTicket} onOpenChange={() => setReplyTicket(null)}>
        <DialogContent className={`max-w-2xl ${cardBg}`}>
          <DialogHeader><DialogTitle className={textPrimary}>Support Conversation - {replyTicket?.id}</DialogTitle></DialogHeader>
          {replyTicket && (
            <div className="space-y-4 pt-4">
              <div className={`max-h-60 overflow-y-auto space-y-3 border rounded-lg p-4 custom-scrollbar ${isDark || isFancy ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}>
                <div className={`p-3 rounded-lg border ${isDark || isFancy ? "bg-gray-800/50 border-gray-600" : "bg-white border-gray-200"}`}>
                   <p className={`text-xs font-bold uppercase tracking-wider ${textSecondary} mb-1`}>Initial Inquiry</p>
                   <p className={`text-sm ${textPrimary}`}>{replyTicket.description}</p>
                </div>
                {replyTicket.replies.map((reply) => (
                  <div key={reply.id} className={`p-3 rounded-lg ${reply.sender === "faculty" ? (isDark || isFancy ? "bg-blue-900/30 ml-8 border border-blue-800/50" : "bg-blue-50 ml-8 border border-blue-100") : (isDark || isFancy ? "bg-gray-600 mr-8" : "bg-gray-100 mr-8")}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${reply.sender === "faculty" ? "text-blue-400" : textSecondary}`}>{reply.sender === "faculty" ? "YOU" : "ADMIN SUPPORT"}</span>
                      <span className={`text-[10px] ${textSecondary}`}>{new Date(reply.time).toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${textPrimary}`}>{reply.message}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className={`text-sm mb-2 block ${textSecondary}`}>Add to discussion</label>
                <Textarea placeholder="Type your reply here..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className={`min-h-[100px] resize-none ${inputClass}`} />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setReplyTicket(null)}>Cancel</Button>
                <Button className="flex-1 bg-blue-600 text-white" onClick={handleSendReply} disabled={!replyMessage.trim()}><Send className="w-4 h-4 mr-2" /> Send Message</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Helpdesk;
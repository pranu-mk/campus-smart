import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, User, Clock, Check, X, Users, FileText, History, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  coordinator: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  department: string;
  status: "Pending Approval" | "Approved" | "Rejected" | "Completed";
  attendees: number;
}

interface HistoryItem {
  action: string;
  by: string;
  date: string;
  remarks: string;
}

const statusColors = {
  "Pending Approval": { bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  Approved: { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
  Rejected: { bg: "#FEF2F2", text: "#B91C1C", border: "#FCA5A5" },
  Completed: { bg: "#F3F4F6", text: "#4B5563", border: "#D1D5DB" },
};

interface EventsProps {
  theme?: "dark" | "light" | "fancy";
}

const Events = ({ theme = "dark" }: EventsProps) => {
  const { toast } = useToast();
  const [eventList, setEventList] = useState<Event[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, completed: 0, totalThisMonth: 0 });
  const [loading, setLoading] = useState(true);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [historyEvent, setHistoryEvent] = useState<Event | null>(null);
  const [eventHistory, setEventHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [confirmAction, setConfirmAction] = useState<{ event: Event; action: "approve" | "reject" } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [changeDecisionEvent, setChangeDecisionEvent] = useState<Event | null>(null);

  // --- Theme Helpers (Fixes the 'textPrimary' error) ---
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  const textPrimary = isDark || isFancy ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark || isFancy ? "text-gray-400" : "text-gray-500";

  // --- API: Fetch Initial Data ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/faculty/events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEventList(res.data.events);
        setStats(res.data.stats);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- API: Fetch History ---
  const fetchHistory = async (event: Event) => {
    setHistoryEvent(event);
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/faculty/events/${event.id}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventHistory(res.data.data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
    } finally {
      setLoadingHistory(false);
    }
  };

  // --- API: Update Status ---
  const handleStatusUpdate = async (eventId: string, newStatus: string, remarks: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/faculty/events/${eventId}/status`, 
        { status: newStatus, remarks },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (res.data.success) {
        toast({ title: `Event ${newStatus}`, description: `Action processed successfully.` });
        fetchData(); // Refresh list and stats
        setConfirmAction(null);
        setChangeDecisionEvent(null);
        setRejectionReason("");
      }
    } catch (err) {
      toast({ title: "Update Failed", description: "Server error occurred", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Event Management</h1>
        <p className="text-gray-500 mt-1">Manage and approve college events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", count: stats.pending, bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
          { label: "Approved", count: stats.approved, bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
          { label: "Completed", count: stats.completed, bg: "#F3F4F6", text: "#4B5563", border: "#D1D5DB" },
          { label: "This Month", count: stats.totalThisMonth, bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
        ].map((stat, index) => (
          <div key={index} className="rounded-xl p-4 text-center border" style={{ backgroundColor: stat.bg, borderColor: stat.border }}>
            <p className="text-3xl font-bold" style={{ color: stat.text }}>{stat.count || 0}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {eventList.map((event, index) => (
          <div key={event.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <Badge variant="outline" style={{ backgroundColor: statusColors[event.status].bg, color: statusColors[event.status].text, borderColor: statusColors[event.status].border }}>
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500"><Calendar className="w-4 h-4" /><span>{event.date}</span></div>
                  <div className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4" /><span>{event.time}</span></div>
                  <div className="flex items-center gap-2 text-gray-500"><MapPin className="w-4 h-4" /><span>{event.venue}</span></div>
                  <div className="flex items-center gap-2 text-gray-500"><Users className="w-4 h-4" /><span>{event.attendees} attendees</span></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedEvent(event)}><FileText className="w-4 h-4 mr-1" />Details</Button>
                  <Button size="sm" variant="ghost" onClick={() => fetchHistory(event)}><History className="w-4 h-4 mr-1" />History</Button>
                </div>
                {event.status === "Pending Approval" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => setConfirmAction({ event, action: "approve" })}><Check className="w-4 h-4 mr-1" />Approve</Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setConfirmAction({ event, action: "reject" })}><X className="w-4 h-4 mr-1" />Reject</Button>
                  </div>
                )}
                {(event.status === "Approved" || event.status === "Rejected") && (
                  <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50" onClick={() => setChangeDecisionEvent(event)}><History className="w-4 h-4 mr-1" />Change Decision</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader><DialogTitle>{selectedEvent?.title}</DialogTitle></DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 pt-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Event ID</p><p className="font-mono text-blue-600">EVT-{selectedEvent.id}</p></div>
                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Venue</p><p>{selectedEvent.venue}</p></div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-2 font-medium">Coordinator Details</p>
                <div className="grid grid-cols-2 gap-y-2">
                  <div><p className="text-xs text-gray-500">Name</p><p>{selectedEvent.coordinator}</p></div>
                  <div><p className="text-xs text-gray-500">Dept</p><p>{selectedEvent.department}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p>{selectedEvent.coordinatorEmail}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p>{selectedEvent.coordinatorPhone}</p></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={!!historyEvent} onOpenChange={() => setHistoryEvent(null)}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Event History</DialogTitle></DialogHeader>
          {loadingHistory ? <Loader2 className="animate-spin mx-auto my-4" /> : (
            <div className="space-y-3 pt-4">
              {eventHistory.map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-gray-500">By {item.by} on {item.date}</p>
                  {item.remarks && <p className="text-xs italic mt-1 text-gray-600">"{item.remarks}"</p>}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.action === "approve" ? "Approve Event" : "Reject Event"}</AlertDialogTitle>
            <AlertDialogDescription>Confirming action for: {confirmAction?.event.title}</AlertDialogDescription>
          </AlertDialogHeader>
          {confirmAction?.action === "reject" && (
            <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." className="mt-2" />
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className={confirmAction?.action === "approve" ? "bg-green-600" : "bg-red-600"}
              onClick={() => handleStatusUpdate(confirmAction!.event.id, confirmAction?.action === "approve" ? "Approved" : "Rejected", rejectionReason)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Decision Dialog */}
      <Dialog open={!!changeDecisionEvent} onOpenChange={() => setChangeDecisionEvent(null)}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Change Decision</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Reason for change..." />
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="text-amber-700" onClick={() => handleStatusUpdate(changeDecisionEvent!.id, "Pending Approval", rejectionReason)} disabled={!rejectionReason.trim()}>Revert to Pending</Button>
              {changeDecisionEvent?.status === "Rejected" ? (
                <Button className="bg-green-600" onClick={() => handleStatusUpdate(changeDecisionEvent!.id, "Approved", rejectionReason)} disabled={!rejectionReason.trim()}>Change to Approved</Button>
              ) : (
                <Button className="bg-red-600" onClick={() => handleStatusUpdate(changeDecisionEvent!.id, "Rejected", rejectionReason)} disabled={!rejectionReason.trim()}>Change to Rejected</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
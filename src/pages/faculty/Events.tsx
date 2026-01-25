import { useState } from "react";
import { Calendar, MapPin, User, Clock, Check, X, Users, FileText, History } from "lucide-react";
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
  history: { action: string; by: string; date: string }[];
}

const initialEvents: Event[] = [
  { 
    id: "EVT-001", 
    title: "Technical Symposium 2024", 
    description: "Annual technical symposium featuring project exhibitions, coding competitions, and guest lectures from industry experts.",
    date: "2024-01-25", 
    time: "09:00 AM", 
    venue: "Main Auditorium", 
    coordinator: "Dr. Priya Sharma",
    coordinatorEmail: "priya.sharma@college.edu",
    coordinatorPhone: "+91 98765 11111",
    department: "Computer Science", 
    status: "Pending Approval", 
    attendees: 250,
    history: [
      { action: "Event created", by: "Dr. Priya Sharma", date: "2024-01-10" }
    ]
  },
  { 
    id: "EVT-002", 
    title: "Guest Lecture: AI in Healthcare", 
    description: "A comprehensive lecture on the applications of Artificial Intelligence in modern healthcare systems.",
    date: "2024-01-22", 
    time: "02:00 PM", 
    venue: "Seminar Hall A", 
    coordinator: "Prof. Amit Kumar",
    coordinatorEmail: "amit.kumar@college.edu",
    coordinatorPhone: "+91 98765 22222",
    department: "IT", 
    status: "Approved", 
    attendees: 80,
    history: [
      { action: "Event created", by: "Prof. Amit Kumar", date: "2024-01-08" },
      { action: "Approved", by: "Dr. Rajesh Kumar", date: "2024-01-12" }
    ]
  },
  { 
    id: "EVT-003", 
    title: "Workshop: Cloud Computing", 
    description: "Hands-on workshop covering AWS, Azure, and Google Cloud Platform fundamentals.",
    date: "2024-01-20", 
    time: "10:00 AM", 
    venue: "Lab 204", 
    coordinator: "Dr. Sneha Gupta",
    coordinatorEmail: "sneha.gupta@college.edu",
    coordinatorPhone: "+91 98765 33333",
    department: "Computer Science", 
    status: "Completed", 
    attendees: 45,
    history: [
      { action: "Event created", by: "Dr. Sneha Gupta", date: "2024-01-05" },
      { action: "Approved", by: "Dr. Rajesh Kumar", date: "2024-01-07" },
      { action: "Completed", by: "System", date: "2024-01-20" }
    ]
  },
  { 
    id: "EVT-004", 
    title: "Cultural Fest Planning", 
    description: "Planning meeting for the upcoming annual cultural festival.",
    date: "2024-02-01", 
    time: "11:00 AM", 
    venue: "Conference Room", 
    coordinator: "Prof. Rahul Singh",
    coordinatorEmail: "rahul.singh@college.edu",
    coordinatorPhone: "+91 98765 44444",
    department: "Student Affairs", 
    status: "Pending Approval", 
    attendees: 20,
    history: [
      { action: "Event created", by: "Prof. Rahul Singh", date: "2024-01-15" }
    ]
  },
];

// Softer, faint status colors for professional ERP look
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
  const [eventList, setEventList] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [historyEvent, setHistoryEvent] = useState<Event | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ event: Event; action: "approve" | "reject" | "revert" } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [changeDecisionEvent, setChangeDecisionEvent] = useState<Event | null>(null);

  const handleApprove = (eventId: string) => {
    setEventList(prev => prev.map(evt => 
      evt.id === eventId 
        ? { 
            ...evt, 
            status: "Approved" as const,
            history: [...evt.history, { action: "Approved", by: "Dr. Rajesh Kumar", date: new Date().toISOString().split('T')[0] }]
          } 
        : evt
    ));
    toast({
      title: "Event Approved",
      description: "The event has been approved successfully.",
    });
    setConfirmAction(null);
  };

  const handleReject = (eventId: string) => {
    setEventList(prev => prev.map(evt => 
      evt.id === eventId 
        ? { 
            ...evt, 
            status: "Rejected" as const,
            history: [...evt.history, { action: `Rejected: ${rejectionReason}`, by: "Dr. Rajesh Kumar", date: new Date().toISOString().split('T')[0] }]
          } 
        : evt
    ));
    toast({
      title: "Event Rejected",
      description: "The event has been rejected.",
      variant: "destructive",
    });
    setConfirmAction(null);
    setRejectionReason("");
  };

  const handleRevertToPending = (eventId: string) => {
    setEventList(prev => prev.map(evt => 
      evt.id === eventId 
        ? { 
            ...evt, 
            status: "Pending Approval" as const,
            history: [...evt.history, { action: `Reverted to Pending: ${rejectionReason}`, by: "Dr. Rajesh Kumar", date: new Date().toISOString().split('T')[0] }]
          } 
        : evt
    ));
    toast({
      title: "Decision Changed",
      description: "Event has been reverted to pending approval.",
    });
    setConfirmAction(null);
    setChangeDecisionEvent(null);
    setRejectionReason("");
  };

  const handleChangeToApproved = (eventId: string) => {
    setEventList(prev => prev.map(evt => 
      evt.id === eventId 
        ? { 
            ...evt, 
            status: "Approved" as const,
            history: [...evt.history, { action: `Decision changed to Approved: ${rejectionReason}`, by: "Dr. Rajesh Kumar", date: new Date().toISOString().split('T')[0] }]
          } 
        : evt
    ));
    toast({
      title: "Decision Changed",
      description: "Event has been approved.",
    });
    setChangeDecisionEvent(null);
    setRejectionReason("");
  };

  const handleChangeToRejected = (eventId: string) => {
    setEventList(prev => prev.map(evt => 
      evt.id === eventId 
        ? { 
            ...evt, 
            status: "Rejected" as const,
            history: [...evt.history, { action: `Decision changed to Rejected: ${rejectionReason}`, by: "Dr. Rajesh Kumar", date: new Date().toISOString().split('T')[0] }]
          } 
        : evt
    ));
    toast({
      title: "Decision Changed",
      description: "Event has been rejected.",
      variant: "destructive",
    });
    setChangeDecisionEvent(null);
    setRejectionReason("");
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          <p className="text-gray-500 mt-1">Manage and approve college events</p>
        </div>
      </div>

      {/* Stats - Softer colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", count: eventList.filter(e => e.status === "Pending Approval").length, bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
          { label: "Approved", count: eventList.filter(e => e.status === "Approved").length, bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
          { label: "Completed", count: eventList.filter(e => e.status === "Completed").length, bg: "#F3F4F6", text: "#4B5563", border: "#D1D5DB" },
          { label: "This Month", count: eventList.length, bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
        ].map((stat, index) => (
          <div 
            key={index} 
            className="rounded-xl p-4 text-center border"
            style={{ backgroundColor: stat.bg, borderColor: stat.border }}
          >
            <p className="text-3xl font-bold" style={{ color: stat.text }}>{stat.count}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {eventList.map((event, index) => (
          <div 
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <Badge 
                    variant="outline" 
                    style={{
                      backgroundColor: statusColors[event.status].bg,
                      color: statusColors[event.status].text,
                      borderColor: statusColors[event.status].border,
                    }}
                  >
                    {event.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-500">Coordinator:</span>
                  <span className="text-gray-800">{event.coordinator}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{event.department}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setHistoryEvent(event)}
                  >
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                </div>
                {event.status === "Pending Approval" && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => setConfirmAction({ event, action: "approve" })}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setConfirmAction({ event, action: "reject" })}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {(event.status === "Approved" || event.status === "Rejected") && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => setChangeDecisionEvent(event)}
                  >
                    <History className="w-4 h-4 mr-1" />
                    Change Decision
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Event ID</p>
                  <p className="font-mono text-blue-600">{selectedEvent.id}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge 
                    variant="outline" 
                    style={{
                      backgroundColor: statusColors[selectedEvent.status].bg,
                      color: statusColors[selectedEvent.status].text,
                      borderColor: statusColors[selectedEvent.status].border,
                    }}
                  >
                    {selectedEvent.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm text-gray-800">{selectedEvent.date} at {selectedEvent.time}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Venue</p>
                  <p className="text-sm text-gray-800">{selectedEvent.venue}</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-2 font-medium">Coordinator Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm text-gray-800">{selectedEvent.coordinator}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm text-gray-800">{selectedEvent.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-800">{selectedEvent.coordinatorEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-800">{selectedEvent.coordinatorPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Expected Attendees</p>
                <p className="text-2xl font-bold text-gray-800">{selectedEvent.attendees}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event History Modal */}
      <Dialog open={!!historyEvent} onOpenChange={() => setHistoryEvent(null)}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Event History: {historyEvent?.title}</DialogTitle>
          </DialogHeader>
          {historyEvent && (
            <div className="space-y-3 pt-4">
              {historyEvent.history.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.action}</p>
                    <p className="text-xs text-gray-500">By {item.by} on {item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800">
              {confirmAction?.action === "approve" ? "Approve Event" : "Reject Event"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              {confirmAction?.action === "approve" 
                ? `Are you sure you want to approve "${confirmAction?.event.title}"?`
                : `Are you sure you want to reject "${confirmAction?.event.title}"?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          {confirmAction?.action === "reject" && (
            <div className="py-4">
              <label className="text-sm text-gray-500 mb-2 block">Reason for rejection</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="bg-gray-50 border-gray-200"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmAction?.action === "approve" 
                ? handleApprove(confirmAction.event.id) 
                : handleReject(confirmAction!.event.id)
              }
              className={confirmAction?.action === "approve" 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {confirmAction?.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Decision Dialog */}
      <Dialog open={!!changeDecisionEvent} onOpenChange={() => setChangeDecisionEvent(null)}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Change Decision: {changeDecisionEvent?.title}</DialogTitle>
          </DialogHeader>
          {changeDecisionEvent && (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-gray-600">
                Current status: <span className="font-medium">{changeDecisionEvent.status}</span>
              </p>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Reason for changing decision *</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for changing the decision..."
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  variant="outline"
                  className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => handleRevertToPending(changeDecisionEvent.id)}
                  disabled={!rejectionReason.trim()}
                >
                  Revert to Pending Approval
                </Button>
                {changeDecisionEvent.status === "Rejected" && (
                  <Button 
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => handleChangeToApproved(changeDecisionEvent.id)}
                    disabled={!rejectionReason.trim()}
                  >
                    Change to Approved
                  </Button>
                )}
                {changeDecisionEvent.status === "Approved" && (
                  <Button 
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => handleChangeToRejected(changeDecisionEvent.id)}
                    disabled={!rejectionReason.trim()}
                  >
                    Change to Rejected
                  </Button>
                )}
                <Button 
                  variant="ghost"
                  className="w-full text-gray-500"
                  onClick={() => {
                    setChangeDecisionEvent(null);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;

import { useState } from "react";
import { X, User, Building, Mail, Phone, FileText, Image, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: string;
  studentName: string;
  department: string;
  type: string;
  priority: "Low" | "Medium" | "High";
  date: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
}

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

const priorityColors = {
  Low: { bg: "#052E16", text: "#22C55E", border: "#16A34A" },
  Medium: { bg: "#3B2F0B", text: "#F59E0B", border: "#D97706" },
  High: { bg: "#3F0D0D", text: "#EF4444", border: "#DC2626" },
};

const ComplaintDetailModal = ({ complaint, isOpen, onClose }: ComplaintDetailModalProps) => {
  const [status, setStatus] = useState<string>(complaint?.status || "Pending");
  const [facultyResponse, setFacultyResponse] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const { toast } = useToast();

  if (!complaint) return null;

  const handleSubmit = () => {
    toast({
      title: "Response Submitted",
      description: `Complaint ${complaint.id} has been updated successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Complaint {complaint.id}
              </DialogTitle>
              <Badge 
                variant="outline" 
                style={{
                  backgroundColor: priorityColors[complaint.priority].bg,
                  color: priorityColors[complaint.priority].text,
                  borderColor: priorityColors[complaint.priority].border,
                }}
              >
                {complaint.priority} Priority
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 max-h-[calc(90vh-120px)] overflow-auto">
          {/* Left Panel - Student Info */}
          <div className="p-6 border-r border-gray-200 space-y-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Student Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-800">{complaint.studentName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-100">
                  <Building className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{complaint.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">student@college.edu</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Phone className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium text-gray-800">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Complaint Details */}
          <div className="p-6 border-r border-gray-200 space-y-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Complaint Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-800">{complaint.type}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Date Submitted</p>
                <p className="font-medium text-gray-800">{complaint.date}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-700 leading-relaxed">
                  The lab equipment in Room 204 has been malfunctioning for the past week. 
                  The oscilloscope displays incorrect readings and the function generator 
                  produces distorted waveforms. This is affecting our practical sessions 
                  and project work significantly.
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Attachments</p>
                <div className="flex gap-2">
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <Image className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">photo1.jpg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">report.pdf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Action Panel
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Faculty Response</p>
                <Textarea
                  placeholder="Enter your response to the student..."
                  value={facultyResponse}
                  onChange={(e) => setFacultyResponse(e.target.value)}
                  className="bg-gray-50 border-gray-200 min-h-[100px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Internal Note (Faculty/Admin only)</p>
                <Textarea
                  placeholder="Add internal notes..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="bg-gray-50 border-gray-200 min-h-[80px] resize-none"
                />
              </div>
              
              {status === "Resolved" && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Resolution Comment (Required)</p>
                  <Textarea
                    placeholder="Describe how the issue was resolved..."
                    className="bg-gray-50 border-gray-200 min-h-[80px] resize-none"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleSubmit}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailModal;

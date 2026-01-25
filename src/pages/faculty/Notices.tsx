import { useState } from "react";
import { Search, FileText, Download, Calendar, User, Building, Plus, Upload } from "lucide-react";
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

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  issuedBy: string;
  department: string;
  date: string;
  type: "College" | "Department" | "Exam" | "Meeting";
  hasAttachment: boolean;
  visibility: "All" | "Faculty" | "Students";
}

const initialNotices: Notice[] = [
  { id: "NOT-001", title: "Annual Exam Schedule 2024", description: "The annual examination schedule for all departments has been released. Please check the attached document for detailed timings.", issuedBy: "Examination Cell", department: "Administration", date: "2024-01-15", type: "Exam", hasAttachment: true, category: "Academic", visibility: "All" },
  { id: "NOT-002", title: "Faculty Meeting Notice", description: "All faculty members are requested to attend the quarterly review meeting scheduled for next week.", issuedBy: "Dean of Academics", department: "Administration", date: "2024-01-14", type: "Meeting", hasAttachment: false, category: "Meeting", visibility: "Faculty" },
  { id: "NOT-003", title: "Lab Maintenance Schedule", description: "Computer labs will be under maintenance from 20th to 22nd January. Please plan your practical sessions accordingly.", issuedBy: "IT Department", department: "Computer Science", date: "2024-01-13", type: "Department", hasAttachment: true, category: "Maintenance", visibility: "All" },
  { id: "NOT-004", title: "Republic Day Celebrations", description: "College will organize Republic Day celebrations on 26th January. All faculty members are expected to participate.", issuedBy: "Principal Office", department: "Administration", date: "2024-01-12", type: "College", hasAttachment: false, category: "Event", visibility: "All" },
  { id: "NOT-005", title: "Research Grant Applications", description: "Faculty members interested in applying for research grants may submit their proposals by the end of this month.", issuedBy: "Research Cell", department: "Administration", date: "2024-01-10", type: "College", hasAttachment: true, category: "Research", visibility: "Faculty" },
];

// Softer, faint type colors for professional ERP look
const typeColors = {
  College: { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
  Department: { bg: "#ECFEFF", text: "#0891B2", border: "#A5F3FC" },
  Exam: { bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  Meeting: { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
};

interface NoticesProps {
  theme?: "dark" | "light" | "fancy";
}

const Notices = ({ theme = "dark" }: NoticesProps) => {
  const [notices, setNotices] = useState(initialNotices);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "",
    description: "",
    visibility: "All" as "All" | "Faculty" | "Students",
    type: "College" as Notice["type"],
  });
  const { toast } = useToast();

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notice.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const notice: Notice = {
      id: `NOT-${String(notices.length + 1).padStart(3, '0')}`,
      title: newNotice.title,
      description: newNotice.description,
      category: newNotice.category,
      issuedBy: "Dr. Rajesh Kumar",
      department: "Computer Science",
      date: new Date().toISOString().split('T')[0],
      type: newNotice.type,
      hasAttachment: false,
      visibility: newNotice.visibility,
    };

    setNotices([notice, ...notices]);
    toast({
      title: "Notice Published",
      description: "Your notice has been published successfully.",
    });
    setIsAddModalOpen(false);
    setNewNotice({
      title: "",
      category: "",
      description: "",
      visibility: "All",
      type: "College",
    });
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
          <p className="text-gray-500 mt-1">College announcements and notifications</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Add New Notice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Title *</label>
                <Input 
                  placeholder="Notice title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Category</label>
                  <Input 
                    placeholder="e.g., Academic, Event"
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({...newNotice, category: e.target.value})}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Type</label>
                  <Select 
                    value={newNotice.type} 
                    onValueChange={(value: Notice["type"]) => setNewNotice({...newNotice, type: value})}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Department">Department</SelectItem>
                      <SelectItem value="Exam">Exam</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">Description *</label>
                <Textarea 
                  placeholder="Notice content..."
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({...newNotice, description: e.target.value})}
                  className="bg-gray-50 border-gray-200 min-h-[120px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Visibility</label>
                  <Select 
                    value={newNotice.visibility} 
                    onValueChange={(value: "All" | "Faculty" | "Students") => setNewNotice({...newNotice, visibility: value})}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Faculty">Faculty Only</SelectItem>
                      <SelectItem value="Students">Students Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Attachment</label>
                  <Button variant="outline" className="w-full border-gray-200 text-gray-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleAddNotice}
                >
                  Publish Notice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            {["all", "College", "Department", "Exam", "Meeting"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant="ghost"
                className={`${typeFilter === type ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === "all" ? "All" : type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice, index) => (
          <div 
            key={notice.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge 
                    variant="outline" 
                    style={{
                      backgroundColor: typeColors[notice.type].bg,
                      color: typeColors[notice.type].text,
                      borderColor: typeColors[notice.type].border,
                    }}
                  >
                    {notice.type}
                  </Badge>
                  {notice.hasAttachment && (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                      <FileText className="w-3 h-3 mr-1" />
                      Attachment
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {notice.visibility}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{notice.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{notice.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{notice.issuedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{notice.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{notice.date}</span>
                  </div>
                </div>
              </div>
              
              {notice.hasAttachment && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    // Create a dummy file download
                    const element = document.createElement("a");
                    const file = new Blob([`Notice: ${notice.title}\n\n${notice.description}\n\nIssued by: ${notice.issuedBy}\nDepartment: ${notice.department}\nDate: ${notice.date}`], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = `${notice.id}-${notice.title.replace(/\s+/g, '-')}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    toast({
                      title: "Download Started",
                      description: `Downloading ${notice.title}...`,
                    });
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;

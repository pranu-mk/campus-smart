import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, User, Building, Plus, Upload, Loader2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  visibility: "All" | "Faculty" | "Students";
}

const typeColors = {
  College: { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
  Department: { bg: "#ECFEFF", text: "#0891B2", border: "#A5F3FC" },
  Exam: { bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  Meeting: { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
};

const Notices = ({ theme = "dark" }: { theme?: string }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    visibility: "All" as "All" | "Faculty" | "Students",
    type: "College" as Notice["type"],
  });
  
  const { toast } = useToast();

  const isDark = theme === "dark" || theme === "fancy";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/faculty/notices", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotices(res.data.data.map((n: any) => ({
          ...n,
          type: n.type.charAt(0).toUpperCase() + n.type.slice(1),
          visibility: n.visibility.charAt(0).toUpperCase() + n.visibility.slice(1),
          date: new Date(n.date).toISOString().split('T')[0],
          department: n.department || "General",
          issuedBy: n.issuedBy || "Faculty"
        })));
      }
    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async () => {
    // DEBUG: Check what the state actually holds
    console.log("Current Form Data:", formData);

    // Hardened validation with .trim()
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({ 
        title: "Missing Fields", 
        description: "Please enter a Title and a Description.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        category: formData.category || "General" // Ensure category isn't null
      };

      let response;
      if (editingId) {
        response = await axios.put(`http://localhost:5000/api/faculty/notices/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post("http://localhost:5000/api/faculty/notices", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        toast({ 
          title: "Success", 
          description: editingId ? "Notice updated successfully." : "Notice published successfully." 
        });
        setIsModalOpen(false);
        resetForm();
        fetchNotices(); 
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Action failed";
      toast({ title: "Denied", description: errorMsg, variant: "destructive" });
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/faculty/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: "Deleted", description: "Notice removed." });
        fetchNotices();
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Delete failed";
      toast({ title: "Denied", description: errorMsg, variant: "destructive" });
    }
  };

  const openEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      category: notice.category || "",
      description: notice.description,
      visibility: notice.visibility,
      type: notice.type,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", category: "", description: "", visibility: "All", type: "College" });
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Notice Board</h1>
          <p className={`mt-1 ${textSecondary}`}>Manage campus announcements</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Notice
        </Button>
      </div>

      <div className="space-y-4">
        {notices.map((notice, index) => (
          <div key={notice.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 hover:shadow-md transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <Badge variant="outline" style={{ backgroundColor: typeColors[notice.type]?.bg, color: typeColors[notice.type]?.text, borderColor: typeColors[notice.type]?.border }}>{notice.type}</Badge>
                <Badge variant="outline" className={isDark ? "border-gray-600 text-gray-400" : ""}>{notice.visibility}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(notice)} className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"><Pencil size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(notice.id)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16}/></Button>
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{notice.title}</h3>
            <p className={`text-sm mb-4 leading-relaxed ${textSecondary}`}>{notice.description}</p>
            
            <div className={`flex gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} text-xs ${textSecondary}`}>
              <span className="flex items-center gap-1 font-medium"><User size={14} className="text-purple-500"/> {notice.issuedBy}</span>
              <span className="flex items-center gap-1 font-medium"><Building size={14} className="text-green-500"/> {notice.department}</span>
              <span className="flex items-center gap-1 font-medium"><Calendar size={14} className="text-blue-500"/> {notice.date}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsModalOpen(open); }}>
        <DialogContent className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'} max-w-2xl`}>
          <DialogHeader><DialogTitle>{editingId ? "Edit Notice" : "Create New Notice"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Input 
                placeholder="Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className={isDark ? "bg-gray-700 border-gray-600" : ""} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="Category" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className={isDark ? "bg-gray-700 border-gray-600" : ""} 
              />
              <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                <SelectTrigger className={isDark ? "bg-gray-700 border-gray-600" : ""}><SelectValue /></SelectTrigger>
                <SelectContent className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                  <SelectItem value="College">College</SelectItem>
                  <SelectItem value="Department">Department</SelectItem>
                  <SelectItem value="Exam">Exam</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea 
                placeholder="Description..." 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className={`${isDark ? "bg-gray-700 border-gray-600" : ""} min-h-[120px]`} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Select value={formData.visibility} onValueChange={(v: any) => setFormData({...formData, visibility: v})}>
                <SelectTrigger className={isDark ? "bg-gray-700 border-gray-600" : ""}><SelectValue /></SelectTrigger>
                <SelectContent className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                  <SelectItem value="All">All Members</SelectItem>
                  <SelectItem value="Faculty">Faculty Only</SelectItem>
                  <SelectItem value="Students">Students Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className={isDark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}>
                <Upload className="w-4 h-4 mr-2" /> Attachment
              </Button>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4" onClick={handleSubmit}>
              {editingId ? "Save Changes" : "Publish Notice"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notices; 
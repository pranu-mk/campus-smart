import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, History, ChevronLeft, ChevronRight, Filter, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ComplaintHistory {
  id: string;
  type: string;
  date: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  description: string;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  course: string;
  year: string;
  email: string;
  department: string;
  totalComplaints: number;
}

const statusColors = {
  Pending: { bg: "#3B2F0B", text: "#F59E0B", border: "#D97706" },
  "In Progress": { bg: "#0C4A6E", text: "#0EA5E9", border: "#0284C7" },
  Resolved: { bg: "#052E16", text: "#22C55E", border: "#16A34A" },
  Rejected: { bg: "#3F0D0D", text: "#EF4444", border: "#DC2626" },
};

const ITEMS_PER_PAGE = 5;

interface StudentsProps {
  theme?: "dark" | "light" | "fancy";
}

const Students = ({ theme = "dark" }: StudentsProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [complaintHistory, setComplaintHistory] = useState<ComplaintHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  const textPrimary = isDark || isFancy ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark || isFancy ? "text-gray-400" : "text-gray-500";

  // --- API: Fetch Students ---
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/faculty/students", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm, department: departmentFilter }
      });
      if (res.data.success) {
        setStudents(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Students Error:", err);
      toast({ title: "Error", description: "Failed to load students", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- API: Fetch History ---
  const fetchStudentHistory = async (student: Student) => {
    setHistoryStudent(student);
    setComplaintHistory([]); // Clear previous history immediately
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/faculty/students/${student.id}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setComplaintHistory(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch History Error:", err);
      toast({ title: "Error", description: "Could not load complaint history", variant: "destructive" });
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, departmentFilter]);

  // --- SAFE DATA HANDLING (Fixes White Screen) ---
  const departments = Array.isArray(students) 
    ? [...new Set(students.map(s => s.department).filter(Boolean))] 
    : [];

  const totalPages = Math.max(1, Math.ceil(students.length / ITEMS_PER_PAGE));
  const paginatedStudents = Array.isArray(students) 
    ? students.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Student Directory</h1>
        <p className={`${textSecondary} mt-1`}>Department-wise student list and complaint history</p>
      </div>

      {/* Filters */}
      <div className={`${isDark || isFancy ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, roll number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${isDark || isFancy ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
            />
          </div>
          <Select value={departmentFilter} onValueChange={(val) => { setDepartmentFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className={`w-[200px] ${isDark || isFancy ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className={`${isDark || isFancy ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className={`${isDark || isFancy ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl overflow-hidden border shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDark || isFancy ? 'bg-gray-900/50' : 'bg-gray-50'} border-b ${isDark || isFancy ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PRN</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Complaints</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    <p className={`mt-2 ${textSecondary}`}>Loading Students...</p>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-20 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto text-gray-400" />
                    <p className={`mt-2 ${textSecondary}`}>No student records found.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, index) => (
                  <tr 
                    key={student.id}
                    className={`border-b ${isDark || isFancy ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors animate-fade-in`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-4 py-4 font-mono text-blue-500 font-medium">{student.rollNumber}</td>
                    <td className={`px-4 py-4 font-medium ${textPrimary}`}>{student.name}</td>
                    <td className={`px-4 py-4 ${textPrimary}`}>{student.course}</td>
                    <td className={`px-4 py-4 ${textSecondary}`}>{student.year}</td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={`${isDark || isFancy ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {student.department}
                      </Badge>
                    </td>
                    <td className={`px-4 py-4 ${textSecondary}`}>{student.email}</td>
                    <td className="px-4 py-4">
                      <Badge 
                        variant="outline" 
                        style={student.totalComplaints > 2 
                          ? { backgroundColor: "#3F0D0D", color: "#EF4444", borderColor: "#DC2626" }
                          : { backgroundColor: isDark || isFancy ? "#1F2937" : "#F3F4F6", color: isDark || isFancy ? "#9CA3AF" : "#6B7280", borderColor: isDark || isFancy ? "#374151" : "#D1D5DB" }
                        }
                      >
                        {student.totalComplaints}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-500" onClick={() => setSelectedStudent(student)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-100 text-purple-500" onClick={() => fetchStudentHistory(student)}>
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark || isFancy ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-sm ${textSecondary}`}>
            Showing {students.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, students.length)} of {students.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${isDark || isFancy ? 'border-gray-600 text-white' : 'border-gray-200'}`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${currentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : textSecondary}`} onClick={() => handlePageChange(page)}>
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${isDark || isFancy ? 'border-gray-600 text-white' : 'border-gray-200'}`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className={`${isDark || isFancy ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}>
          <DialogHeader>
            <DialogTitle className={textPrimary}>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                  {selectedStudent.name?.split(" ").map(n => n[0]).join("") || "S"}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textPrimary}`}>{selectedStudent.name}</h3>
                  <p className={textSecondary}>{selectedStudent.rollNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${isDark || isFancy ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className={`text-sm font-medium ${textPrimary}`}>{selectedStudent.department}</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark || isFancy ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">Course</p>
                  <p className={`text-sm font-medium ${textPrimary}`}>{selectedStudent.course}</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark || isFancy ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">Year</p>
                  <p className={`text-sm font-medium ${textPrimary}`}>{selectedStudent.year}</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark || isFancy ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">Total Complaints</p>
                  <p className={`text-sm font-medium ${textPrimary}`}>{selectedStudent.totalComplaints}</p>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => { fetchStudentHistory(selectedStudent); setSelectedStudent(null); }}>
                <History className="w-4 h-4 mr-2" /> View Complaint History
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={!!historyStudent} onOpenChange={() => setHistoryStudent(null)}>
        <DialogContent className={`${isDark || isFancy ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} max-w-2xl`}>
          <DialogHeader>
            <DialogTitle className={textPrimary}>
              Complaint History: {historyStudent?.name}
            </DialogTitle>
          </DialogHeader>
          {loadingHistory ? (
            <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" /></div>
          ) : (
            <div className="space-y-4 pt-4">
              {complaintHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No complaints filed yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {complaintHistory.map((complaint) => (
                    <div key={complaint.id} className={`p-4 rounded-lg border ${isDark || isFancy ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-blue-500 text-sm font-medium">{complaint.id}</span>
                        <Badge 
                          variant="outline"
                          style={{
                            backgroundColor: statusColors[complaint.status]?.bg,
                            color: statusColors[complaint.status]?.text,
                            borderColor: statusColors[complaint.status]?.border,
                          }}
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className={`text-sm font-medium ${textPrimary} mb-1`}>{complaint.type}</p>
                      <p className={`text-sm ${textSecondary} mb-2`}>{complaint.description}</p>
                      <p className="text-xs text-gray-500">Date: {complaint.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
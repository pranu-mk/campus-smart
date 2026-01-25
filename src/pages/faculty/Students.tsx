import { useState } from "react";
import { Search, Eye, History, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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
  semester: number;
  email: string;
  department: string;
  totalComplaints: number;
  complaintHistory: ComplaintHistory[];
}

const students: Student[] = [
  { 
    id: "STU-001", 
    name: "Rahul Sharma", 
    rollNumber: "CS21001", 
    course: "B.Tech", 
    year: "3rd Year", 
    semester: 6, 
    email: "rahul.sharma@college.edu", 
    department: "Computer Science", 
    totalComplaints: 3,
    complaintHistory: [
      { id: "CMP-1245", type: "Lab Equipment", date: "2024-01-15", status: "Pending", description: "Oscilloscope in Lab 204 not working properly" },
      { id: "CMP-1200", type: "Library Access", date: "2024-01-05", status: "Resolved", description: "Unable to access digital library from hostel" },
      { id: "CMP-1150", type: "Hostel Facility", date: "2023-12-20", status: "Resolved", description: "Water heater not working in B-block" },
    ]
  },
  { 
    id: "STU-002", 
    name: "Priya Patel", 
    rollNumber: "EC21015", 
    course: "B.Tech", 
    year: "3rd Year", 
    semester: 6, 
    email: "priya.patel@college.edu", 
    department: "Electronics", 
    totalComplaints: 1,
    complaintHistory: [
      { id: "CMP-1244", type: "Hostel Facility", date: "2024-01-15", status: "In Progress", description: "AC not working in room 302" },
    ]
  },
  { 
    id: "STU-003", 
    name: "Amit Kumar", 
    rollNumber: "ME21022", 
    course: "B.Tech", 
    year: "3rd Year", 
    semester: 6, 
    email: "amit.kumar@college.edu", 
    department: "Mechanical", 
    totalComplaints: 2,
    complaintHistory: [
      { id: "CMP-1243", type: "Library Access", date: "2024-01-14", status: "Resolved", description: "Book reservation system issue" },
      { id: "CMP-1180", type: "Lab Equipment", date: "2024-01-02", status: "Resolved", description: "Lathe machine needs maintenance" },
    ]
  },
  { 
    id: "STU-004", 
    name: "Sneha Gupta", 
    rollNumber: "CE21008", 
    course: "B.Tech", 
    year: "3rd Year", 
    semester: 6, 
    email: "sneha.gupta@college.edu", 
    department: "Civil", 
    totalComplaints: 0,
    complaintHistory: []
  },
  { 
    id: "STU-005", 
    name: "Vikram Singh", 
    rollNumber: "CS21034", 
    course: "B.Tech", 
    year: "3rd Year", 
    semester: 6, 
    email: "vikram.singh@college.edu", 
    department: "Computer Science", 
    totalComplaints: 4,
    complaintHistory: [
      { id: "CMP-1241", type: "Exam Related", date: "2024-01-13", status: "Rejected", description: "Request for exam reschedule" },
      { id: "CMP-1220", type: "Faculty Issue", date: "2024-01-08", status: "Resolved", description: "Assignment deadline extension request" },
      { id: "CMP-1190", type: "Infrastructure", date: "2024-01-03", status: "Resolved", description: "Classroom projector not working" },
      { id: "CMP-1160", type: "Lab Equipment", date: "2023-12-28", status: "Resolved", description: "Computer system crash in lab" },
    ]
  },
  { 
    id: "STU-006", 
    name: "Ananya Roy", 
    rollNumber: "IT21019", 
    course: "B.Tech", 
    year: "3rd Year", 
    semester: 6, 
    email: "ananya.roy@college.edu", 
    department: "IT", 
    totalComplaints: 1,
    complaintHistory: [
      { id: "CMP-1240", type: "Infrastructure", date: "2024-01-13", status: "In Progress", description: "WiFi connectivity issues in hostel" },
    ]
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const departments = [...new Set(students.map(s => s.department))];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === "all" || student.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
        <p className="text-gray-500 mt-1">Department-wise student list and complaint history</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, roll number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Roll Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year / Semester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Complaints</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr 
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-4 py-4 font-mono text-blue-600">{student.id}</td>
                  <td className="px-4 py-4 font-medium text-gray-800">{student.name}</td>
                  <td className="px-4 py-4 text-gray-600">{student.rollNumber}</td>
                  <td className="px-4 py-4 text-gray-800">{student.course}</td>
                  <td className="px-4 py-4 text-gray-600">{student.year} / Sem {student.semester}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                      {student.department}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{student.email}</td>
                  <td className="px-4 py-4">
                    <Badge 
                      variant="outline" 
                      style={student.totalComplaints > 2 
                        ? { backgroundColor: "#3F0D0D", color: "#EF4444", borderColor: "#DC2626" }
                        : { backgroundColor: "#F3F4F6", color: "#6B7280", borderColor: "#D1D5DB" }
                      }
                    >
                      {student.totalComplaints}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-purple-100 text-purple-600"
                        onClick={() => setHistoryStudent(student)}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-gray-200"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button 
                key={page}
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 ${currentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-600"}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-gray-200"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                  {selectedStudent.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-gray-500">{selectedStudent.rollNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-800">{selectedStudent.department}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="text-sm font-medium text-gray-800">{selectedStudent.course}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Year / Semester</p>
                  <p className="text-sm font-medium text-gray-800">{selectedStudent.year} / Sem {selectedStudent.semester}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Total Complaints</p>
                  <p className="text-sm font-medium text-gray-800">{selectedStudent.totalComplaints}</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{selectedStudent.email}</p>
              </div>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  setSelectedStudent(null);
                  setHistoryStudent(selectedStudent);
                }}
              >
                <History className="w-4 h-4 mr-2" />
                View Complaint History
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complaint History Modal */}
      <Dialog open={!!historyStudent} onOpenChange={() => setHistoryStudent(null)}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              Complaint History: {historyStudent?.name}
            </DialogTitle>
          </DialogHeader>
          {historyStudent && (
            <div className="space-y-4 pt-4">
              {historyStudent.complaintHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No complaint history found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {historyStudent.complaintHistory.map((complaint) => (
                    <div 
                      key={complaint.id}
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-blue-600 text-sm">{complaint.id}</span>
                        <Badge 
                          variant="outline"
                          style={{
                            backgroundColor: statusColors[complaint.status].bg,
                            color: statusColors[complaint.status].text,
                            borderColor: statusColors[complaint.status].border,
                          }}
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-1">{complaint.type}</p>
                      <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                      <p className="text-xs text-gray-400">Date: {complaint.date}</p>
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

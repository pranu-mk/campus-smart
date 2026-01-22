import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, Loader2, CheckCircle, Search, Filter, X, MessageSquare } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const allComplaints = [
  { id: "CMP001", category: "Hostel", subject: "Water supply issue in Block A", status: "Pending", date: "Jan 18, 2026", description: "No water supply since morning in Block A rooms 201-210.", assignedTo: "Mr. Kumar", timeline: [{ status: "Submitted", date: "Jan 18, 2026", time: "9:00 AM" }] },
  { id: "CMP002", category: "Exam", subject: "Hall ticket not generated", status: "In-Progress", date: "Jan 17, 2026", description: "Unable to download hall ticket for mid-sem exams.", assignedTo: "Exam Cell", timeline: [{ status: "Submitted", date: "Jan 17, 2026", time: "2:00 PM" }, { status: "Under Review", date: "Jan 17, 2026", time: "4:30 PM" }] },
  { id: "CMP003", category: "Faculty", subject: "Attendance discrepancy", status: "Resolved", date: "Jan 16, 2026", description: "My attendance shows 60% but I have attended 85% classes.", assignedTo: "Dr. Sharma", timeline: [{ status: "Submitted", date: "Jan 16, 2026", time: "10:00 AM" }, { status: "Under Review", date: "Jan 16, 2026", time: "11:00 AM" }, { status: "Resolved", date: "Jan 17, 2026", time: "3:00 PM" }] },
  { id: "CMP004", category: "Campus", subject: "Parking lot lighting issue", status: "Pending", date: "Jan 15, 2026", description: "Two street lights not working in parking area B.", assignedTo: "Maintenance", timeline: [{ status: "Submitted", date: "Jan 15, 2026", time: "6:00 PM" }] },
  { id: "CMP005", category: "Hostel", subject: "AC not working in room", status: "In-Progress", date: "Jan 14, 2026", description: "Air conditioner in room 305 has stopped working.", assignedTo: "Hostel Warden", timeline: [{ status: "Submitted", date: "Jan 14, 2026", time: "8:00 AM" }, { status: "Technician Assigned", date: "Jan 14, 2026", time: "10:00 AM" }] },
  { id: "CMP006", category: "Exam", subject: "Re-evaluation request", status: "Resolved", date: "Jan 10, 2026", description: "Request for re-evaluation of DBMS paper.", assignedTo: "Exam Cell", timeline: [{ status: "Submitted", date: "Jan 10, 2026", time: "11:00 AM" }, { status: "Processing", date: "Jan 11, 2026", time: "2:00 PM" }, { status: "Resolved", date: "Jan 13, 2026", time: "4:00 PM" }] },
];

const summaryCards = [
  { title: "All", count: allComplaints.length, icon: FileText, color: "#4f6fdc", filter: "all" },
  { title: "Pending", count: allComplaints.filter(c => c.status === "Pending").length, icon: Clock, color: "#f6c453", filter: "Pending" },
  { title: "In-Progress", count: allComplaints.filter(c => c.status === "In-Progress").length, icon: Loader2, color: "#f39c3d", filter: "In-Progress" },
  { title: "Resolved", count: allComplaints.filter(c => c.status === "Resolved").length, icon: CheckCircle, color: "#49b675", filter: "Resolved" },
];

const statusClasses: Record<string, string> = {
  "Pending": "badge-pending",
  "In-Progress": "badge-progress",
  "Resolved": "badge-resolved",
};

const MyComplaints = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<typeof allComplaints[0] | null>(null);

  const filteredComplaints = allComplaints.filter((complaint) => {
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    const matchesSearch = complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const categories = [...new Set(allComplaints.map(c => c.category))];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1f2937]">My Complaints</h1>
        <p className="text-[#6b7280]">Track and manage all your complaints</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setStatusFilter(card.filter)}
              className={`bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer border-2 ${
                statusFilter === card.filter ? "border-[#4f6fdc]" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">{card.title}</p>
                  <p className="text-2xl font-bold" style={{ color: card.color }}>{card.count}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-6 flex flex-wrap items-center gap-4"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4f6fdc] focus:ring-2 focus:ring-[#4f6fdc]/20 outline-none transition-all text-[#1f2937]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#6b7280]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4f6fdc] outline-none text-sm text-[#1f2937] bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Complaints Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-[#6b7280]">ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[#6b7280]">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[#6b7280]">Subject</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[#6b7280]">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[#6b7280]">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[#6b7280]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint, index) => (
                <motion.tr
                  key={complaint.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm font-medium text-[#4f6fdc]">{complaint.id}</td>
                  <td className="py-4 px-6 text-sm text-[#1f2937]">{complaint.category}</td>
                  <td className="py-4 px-6 text-sm text-[#6b7280] max-w-[200px] truncate">{complaint.subject}</td>
                  <td className="py-4 px-6 text-sm text-[#6b7280]">{complaint.date}</td>
                  <td className="py-4 px-6">
                    <span className={`${statusClasses[complaint.status]} px-3 py-1 rounded-full text-xs font-medium`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="px-4 py-2 rounded-lg bg-[#4f6fdc]/10 text-[#4f6fdc] text-sm font-medium hover:bg-[#4f6fdc]/20 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedComplaint(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1f2937]">{selectedComplaint.id}</h2>
                  <span className={`${statusClasses[selectedComplaint.status]} px-3 py-1 rounded-full text-xs font-medium`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-[#6b7280]" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Subject</p>
                  <p className="text-[#1f2937] font-medium">{selectedComplaint.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Category</p>
                  <p className="text-[#1f2937]">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Description</p>
                  <p className="text-[#1f2937]">{selectedComplaint.description}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Assigned To</p>
                  <p className="text-[#1f2937]">{selectedComplaint.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6b7280] mb-3">Status Timeline</p>
                  <div className="space-y-3">
                    {selectedComplaint.timeline.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#4f6fdc] mt-1.5" />
                        <div>
                          <p className="text-sm font-medium text-[#1f2937]">{item.status}</p>
                          <p className="text-xs text-[#6b7280]">{item.date} at {item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedComplaint.status === "Resolved" && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-[#6b7280] mb-2">Your Feedback</p>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#4f6fdc]" />
                      <input
                        type="text"
                        placeholder="Leave your feedback..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4f6fdc] outline-none text-sm"
                      />
                      <button className="px-4 py-2 rounded-lg bg-[#4f6fdc] text-white text-sm font-medium">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default MyComplaints;

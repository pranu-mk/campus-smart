import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, Loader2, CheckCircle, Search, Filter, X, MessageSquare, AlertCircle, ExternalLink } from "lucide-react";
import MainLayout from "@/components/layout/student/MainLayout";
import { complaintAPI } from "@/modules/student/services/api";
import { toast } from "@/hooks/use-toast";

const statusClasses: Record<string, string> = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "In-Progress": "bg-orange-100 text-orange-700",
  "Resolved": "bg-green-100 text-green-700",
  "Closed": "bg-gray-100 text-gray-700",
};

const MyComplaints = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const response = await complaintAPI.getAll();
        if (response && response.complaints) {
          setComplaints(response.complaints);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast({ title: "Error", description: "Could not load your complaints", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = 
      complaint.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaint_id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const categories = [...new Set(complaints.map(c => c.category))];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const summaryStats = [
    { title: "All", count: complaints.length, icon: FileText, color: "#4f6fdc", filter: "all" },
    { title: "Pending", count: complaints.filter(c => c.status === "Pending").length, icon: Clock, color: "#f6c453", filter: "Pending" },
    { title: "In-Progress", count: complaints.filter(c => c.status === "In-Progress").length, icon: Loader2, color: "#f39c3d", filter: "In-Progress" },
    { title: "Resolved", count: complaints.filter(c => c.status === "Resolved").length, icon: CheckCircle, color: "#49b675", filter: "Resolved" },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-[#1f2937]">My Complaints</h1>
        <p className="text-[#6b7280]">Track and manage your submitted issues</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => setStatusFilter(card.filter)}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 cursor-pointer transition-all ${
                statusFilter === card.filter ? "border-[#4f6fdc]" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold" style={{ color: card.color }}>{card.count}</p>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center gap-4 border border-gray-100">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#4f6fdc] outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 outline-none text-sm bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-4">
             <Loader2 className="w-8 h-8 text-[#4f6fdc] animate-spin" />
             <p className="text-sm text-gray-500">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.complaint_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-bold text-[#4f6fdc]">{complaint.complaint_id}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 capitalize">{complaint.category}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-[200px] truncate">{complaint.subject}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{formatDate(complaint.created_at)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusClasses[complaint.status] || "bg-gray-100 text-gray-600"}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="text-xs font-bold text-[#4f6fdc] hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No complaints found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedComplaint(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 bg-gray-50 border-b flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-gray-800">{selectedComplaint.complaint_id}</h2>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-8 space-y-6 overflow-y-auto">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Subject</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedComplaint.subject}</p>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Category</p>
                    <p className="text-sm font-medium capitalize">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
                    <p className="text-sm font-bold text-orange-500">{selectedComplaint.status}</p>
                  </div>
                </div>

                {/* --- NEW: Attached Evidence Section --- */}
                {selectedComplaint.file_path && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Attached Evidence</p>
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img 
                        src={`http://localhost:5000/${selectedComplaint.file_path.replace(/\\/g, '/')}`} 
                        alt="Evidence"
                        className="w-full h-auto max-h-60 object-contain hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <a 
                        href={`http://localhost:5000/${selectedComplaint.file_path.replace(/\\/g, '/')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> View Full Image
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t flex justify-between items-center shrink-0">
                  <p className="text-xs text-gray-400">Filed on: {formatDate(selectedComplaint.created_at)}</p>
                  <button className="flex items-center gap-2 text-xs font-bold text-[#4f6fdc]">
                    <MessageSquare className="w-4 h-4" /> Helpdesk Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default MyComplaints;
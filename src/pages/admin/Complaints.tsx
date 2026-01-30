import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Send,
  Paperclip,
  ChevronRight,
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityChip } from '@/components/ui/PriorityChip';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { complaints, Complaint, faculty, complaintCategories } from '@/data/admin/dummyData';

export function ComplaintsPage() {
  const [complaintList, setComplaintList] = useState<Complaint[]>(complaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [adminReply, setAdminReply] = useState('');

  const filteredComplaints = complaintList.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: Complaint['status']) => {
    setComplaintList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );
  };

  const assignFaculty = (complaintId: string, facultyId: string, facultyName: string) => {
    setComplaintList((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, assignedTo: facultyId, facultyName, status: 'assigned' as const }
          : c
      )
    );
    setShowAssignModal(false);
  };

  const updatePriority = (id: string, priority: Complaint['priority']) => {
    setComplaintList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, priority } : c))
    );
  };

  const statusCounts = {
    all: complaintList.length,
    pending: complaintList.filter((c) => c.status === 'pending').length,
    assigned: complaintList.filter((c) => c.status === 'assigned').length,
    in_progress: complaintList.filter((c) => c.status === 'in_progress').length,
    resolved: complaintList.filter((c) => c.status === 'resolved').length,
    escalated: complaintList.filter((c) => c.status === 'escalated').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
            Complaint Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and resolve campus complaints
          </p>
        </div>
      </motion.div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              statusFilter === status
                ? 'bg-neon-cyan text-background glow-cyan'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()} ({count})
          </motion.button>
        ))}
      </div>

      {/* Search */}
      <NeonCard glowColor="cyan" hover={false}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ID, title, or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20
                       transition-all duration-300"
            />
          </div>
          <GlowButton variant="purple" icon={<Filter className="w-4 h-4" />}>
            Filters
          </GlowButton>
        </div>
      </NeonCard>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint, i) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <NeonCard
              glowColor={complaint.status === 'escalated' ? 'pink' : complaint.priority === 'critical' ? 'orange' : 'cyan'}
              className={`cursor-pointer ${complaint.status === 'escalated' ? 'border-destructive/50' : ''}`}
              onClick={() => {
                setSelectedComplaint(complaint);
                setShowDetailModal(true);
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Avatar & Basic Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <NeonAvatar
                    initials={complaint.studentName.split(' ').map((n) => n[0]).join('')}
                    glowColor={complaint.status === 'escalated' ? 'pink' : 'cyan'}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-neon-cyan font-mono">{complaint.id}</span>
                      <PriorityChip priority={complaint.priority} />
                    </div>
                    <h3 className="font-semibold text-foreground truncate mt-1">{complaint.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {complaint.studentName} • {complaint.department}
                    </p>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                    {complaint.facultyName && (
                      <p className="text-xs text-neon-purple">Assigned: {complaint.facultyName}</p>
                    )}
                  </div>
                  <StatusBadge status={complaint.status} />
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl glass rounded-2xl neon-border overflow-hidden my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-neon-cyan font-mono">{selectedComplaint.id}</span>
                    <PriorityChip priority={selectedComplaint.priority} />
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                  <h2 className="text-xl font-bold font-orbitron text-foreground">
                    {selectedComplaint.title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-foreground">{selectedComplaint.description}</p>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Student</p>
                    <p className="text-sm text-foreground font-medium">{selectedComplaint.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Department</p>
                    <p className="text-sm text-foreground font-medium">{selectedComplaint.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Category</p>
                    <p className="text-sm text-foreground font-medium">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Assigned To</p>
                    <p className="text-sm text-foreground font-medium">
                      {selectedComplaint.facultyName || 'Unassigned'}
                    </p>
                  </div>
                </div>

                {/* Attachments */}
                {selectedComplaint.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Attachments
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedComplaint.attachments.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50"
                        >
                          <Paperclip className="w-4 h-4 text-neon-cyan" />
                          <span className="text-sm text-foreground">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedComplaint.timeline.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            event.action === 'Resolved' ? 'bg-neon-green' :
                            event.action === 'Escalated' ? 'bg-destructive' :
                            'bg-neon-cyan'
                          }`} />
                          {i < selectedComplaint.timeline.length - 1 && (
                            <div className="w-px flex-1 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{event.action}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <p className="text-xs text-neon-purple mt-1">by {event.user}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Admin Reply */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Admin Reply
                  </h3>
                  <div className="flex gap-2">
                    <textarea
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      placeholder="Write your response..."
                      className="flex-1 px-4 py-3 bg-background/50 border border-border rounded-lg 
                               text-foreground placeholder:text-muted-foreground resize-none
                               focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-border/50 flex flex-wrap gap-3">
                <GlowButton
                  variant="purple"
                  icon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign
                </GlowButton>
                
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => {
                    updateStatus(selectedComplaint.id, e.target.value as Complaint['status']);
                    setSelectedComplaint({ ...selectedComplaint, status: e.target.value as Complaint['status'] });
                  }}
                  className="px-4 py-2 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-cyan"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={selectedComplaint.priority}
                  onChange={(e) => {
                    updatePriority(selectedComplaint.id, e.target.value as Complaint['priority']);
                    setSelectedComplaint({ ...selectedComplaint, priority: e.target.value as Complaint['priority'] });
                  }}
                  className="px-4 py-2 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-cyan"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Priority</option>
                </select>

                <GlowButton variant="cyan" icon={<Send className="w-4 h-4" />} className="ml-auto">
                  Send Reply
                </GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Faculty Modal */}
      <AnimatePresence>
        {showAssignModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Assign Faculty</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
                {faculty.filter((f) => f.status === 'active').map((fac) => (
                  <motion.button
                    key={fac.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => assignFaculty(selectedComplaint.id, fac.id, fac.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-neon-purple/50 hover:bg-muted/50 transition-all"
                  >
                    <NeonAvatar initials={fac.avatar} glowColor="purple" size="md" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{fac.name}</p>
                      <p className="text-sm text-muted-foreground">{fac.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neon-purple">{fac.assignedComplaints} assigned</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

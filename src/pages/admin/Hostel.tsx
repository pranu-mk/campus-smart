import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, AlertTriangle, Wrench, Wifi, Bug, X, Eye, CheckCircle } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityChip } from '@/components/ui/PriorityChip';
import { hostelComplaints, HostelComplaint } from '@/data/admin/dummyData';

export function HostelPage() {
  const [complaints, setComplaints] = useState<HostelComplaint[]>(hostelComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<HostelComplaint | null>(null);

  const filteredComplaints = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hostelBlock.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plumbing': return Wrench;
      case 'Security': return AlertTriangle;
      case 'IT': return Wifi;
      case 'Housekeeping': return Bug;
      default: return Building2;
    }
  };

  const stats = [
    { label: 'Block A', value: complaints.filter(c => c.hostelBlock === 'Block A').length, color: 'cyan' },
    { label: 'Block B', value: complaints.filter(c => c.hostelBlock === 'Block B').length, color: 'purple' },
    { label: 'Block C', value: complaints.filter(c => c.hostelBlock === 'Block C').length, color: 'pink' },
    { label: 'Pending', value: complaints.filter(c => c.status === 'pending').length, color: 'orange' },
  ];

  const handleViewDetails = (complaint: HostelComplaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const updateStatus = (status: HostelComplaint['status']) => {
    if (!selectedComplaint) return;
    setComplaints((prev) =>
      prev.map((c) => (c.id === selectedComplaint.id ? { ...c, status } : c))
    );
    setSelectedComplaint({ ...selectedComplaint, status });
  };

  const resolveComplaint = () => {
    if (!selectedComplaint) return;
    updateStatus('resolved');
    setShowDetailModal(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
          Hostel Complaints
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage hostel maintenance and issues
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl glass border border-border/50 text-center"
          >
            <p className={`text-2xl font-bold font-orbitron text-neon-${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <NeonCard glowColor="cyan" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by block, room, or issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground"
          />
        </div>
      </NeonCard>

      <div className="space-y-4">
        {filteredComplaints.map((complaint, i) => {
          const Icon = getCategoryIcon(complaint.category);
          return (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NeonCard glowColor={complaint.priority === 'high' ? 'pink' : 'cyan'}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-neon-cyan/10">
                    <Icon className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-neon-purple">
                        {complaint.hostelBlock} - {complaint.roomNo}
                      </span>
                      <PriorityChip priority={complaint.priority} />
                    </div>
                    <h3 className="font-semibold text-foreground mt-1">{complaint.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {complaint.category} • by {complaint.reportedBy}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={complaint.status} />
                    <GlowButton 
                      variant="cyan" 
                      size="sm"
                      onClick={() => handleViewDetails(complaint)}
                    >
                      <Eye className="w-4 h-4" />
                    </GlowButton>
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Complaint Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-mono text-neon-purple">
                      {selectedComplaint.hostelBlock} - {selectedComplaint.roomNo}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1">{selectedComplaint.title}</h3>
                  </div>
                  <StatusBadge status={selectedComplaint.status} />
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-foreground">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                    <p className="text-sm text-foreground mt-1">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Priority</p>
                    <PriorityChip priority={selectedComplaint.priority} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Reported By</p>
                    <p className="text-sm text-foreground mt-1">{selectedComplaint.reportedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                    <p className="text-sm text-foreground mt-1">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Update Status</label>
                  <div className="flex gap-2">
                    <GlowButton 
                      variant={selectedComplaint.status === 'pending' ? 'cyan' : 'purple'}
                      size="sm"
                      onClick={() => updateStatus('pending')}
                    >
                      Pending
                    </GlowButton>
                    <GlowButton 
                      variant={selectedComplaint.status === 'in_progress' ? 'cyan' : 'purple'}
                      size="sm"
                      onClick={() => updateStatus('in_progress')}
                    >
                      In Progress
                    </GlowButton>
                    <GlowButton 
                      variant={selectedComplaint.status === 'resolved' ? 'cyan' : 'purple'}
                      size="sm"
                      onClick={() => updateStatus('resolved')}
                    >
                      Resolved
                    </GlowButton>
                  </div>
                </div>

                {selectedComplaint.status !== 'resolved' && (
                  <GlowButton 
                    variant="green" 
                    className="w-full"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={resolveComplaint}
                  >
                    Mark as Resolved
                  </GlowButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

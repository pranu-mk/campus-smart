import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, MessageCircle, Clock, CheckCircle, X, Eye, Send } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { complaints, Complaint } from '@/data/admin/dummyData';

export function HelpdeskPage() {
  const [complaintList, setComplaintList] = useState<Complaint[]>(complaints);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [reply, setReply] = useState('');

  const pendingTickets = complaintList.filter(c => c.status === 'pending' || c.status === 'assigned');
  const inProgressCount = complaintList.filter(c => c.status === 'in_progress').length;
  const resolvedToday = 12; // Simulated

  const handleViewTicket = (ticket: Complaint) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (status: Complaint['status']) => {
    if (!selectedTicket) return;
    setComplaintList((prev) =>
      prev.map((c) => (c.id === selectedTicket.id ? { ...c, status } : c))
    );
    setSelectedTicket({ ...selectedTicket, status });
  };

  const handleSendReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    // Simulate adding reply to timeline
    alert(`Reply sent to ${selectedTicket.studentName}: "${reply}"`);
    setReply('');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Helpdesk</h1>
        <p className="text-muted-foreground mt-1">Support ticket management</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: pendingTickets.length, icon: MessageCircle, color: 'cyan' },
          { label: 'In Progress', value: inProgressCount, icon: Clock, color: 'purple' },
          { label: 'Resolved Today', value: resolvedToday, icon: CheckCircle, color: 'green' },
          { label: 'Avg Response', value: '2.4h', icon: Headphones, color: 'pink' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <NeonCard glowColor={stat.color as 'cyan' | 'purple' | 'pink' | 'green'} className="text-center">
              <stat.icon className={`w-8 h-8 mx-auto text-neon-${stat.color} mb-2`} />
              <p className="text-2xl font-bold font-orbitron text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      <NeonCard glowColor="cyan">
        <h3 className="font-bold text-foreground mb-4">Recent Tickets</h3>
        <div className="space-y-3">
          {pendingTickets.map((ticket, i) => (
            <motion.div 
              key={ticket.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-lg bg-muted/30 flex justify-between items-center hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{ticket.title}</p>
                <p className="text-sm text-muted-foreground">{ticket.studentName}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-neon-cyan">{ticket.id}</span>
                <GlowButton 
                  variant="cyan" 
                  size="sm"
                  onClick={() => handleViewTicket(ticket)}
                >
                  <Eye className="w-4 h-4" />
                </GlowButton>
              </div>
            </motion.div>
          ))}
        </div>
      </NeonCard>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTicket && (
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
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neon-cyan font-mono">{selectedTicket.id}</span>
                  <h2 className="text-xl font-bold font-orbitron text-foreground">{selectedTicket.title}</h2>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted by</p>
                    <p className="font-medium text-foreground">{selectedTicket.studentName}</p>
                  </div>
                  <StatusBadge status={selectedTicket.status} />
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-foreground">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                    <p className="text-sm text-foreground mt-1">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Department</p>
                    <p className="text-sm text-foreground mt-1">{selectedTicket.department}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
                      <GlowButton 
                        key={status}
                        variant={selectedTicket.status === status ? 'cyan' : 'purple'}
                        size="sm"
                        onClick={() => handleUpdateStatus(status)}
                      >
                        {status.replace('_', ' ')}
                      </GlowButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Reply to Ticket</label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan resize-none"
                  />
                  <GlowButton 
                    variant="gradient" 
                    className="w-full"
                    icon={<Send className="w-4 h-4" />}
                    onClick={handleSendReply}
                  >
                    Send Reply
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, Bell, Megaphone, Paperclip, Calendar, X, Eye, Download } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { notices, Notice, departments } from '@/data/admin/dummyData';

export function NoticesPage() {
  const [noticeList, setNoticeList] = useState<Notice[]>(notices);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    department: 'All Departments',
    priority: 'normal' as Notice['priority'],
  });

  const getPriorityStyles = (priority: Notice['priority']) => {
    switch (priority) {
      case 'urgent':
        return { color: 'pink', icon: AlertCircle, bg: 'bg-destructive/10 border-destructive/30' };
      case 'important':
        return { color: 'purple', icon: Megaphone, bg: 'bg-neon-purple/10 border-neon-purple/30' };
      default:
        return { color: 'cyan', icon: Bell, bg: 'bg-neon-cyan/10 border-neon-cyan/30' };
    }
  };

  const handlePostNotice = () => {
    if (!newNotice.title || !newNotice.content) return;
    
    const notice: Notice = {
      id: `NOT${Date.now()}`,
      title: newNotice.title,
      content: newNotice.content,
      department: newNotice.department,
      priority: newNotice.priority,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attachments: [],
    };
    
    setNoticeList((prev) => [notice, ...prev]);
    setShowAddModal(false);
    setNewNotice({ title: '', content: '', department: 'All Departments', priority: 'normal' });
  };

  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowViewModal(true);
  };

  const handleDownload = (attachment: string) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = attachment;
    alert(`Downloading: ${attachment}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
            Notice Board
          </h1>
          <p className="text-muted-foreground mt-1">
            Campus announcements and notices
          </p>
        </div>
        <GlowButton 
          variant="gradient" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Post Notice
        </GlowButton>
      </motion.div>

      <div className="space-y-4">
        {noticeList.map((notice, i) => {
          const { color, icon: Icon, bg } = getPriorityStyles(notice.priority);
          return (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard glowColor={color as 'cyan' | 'purple' | 'pink'}>
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-neon-${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${bg} text-neon-${color} uppercase tracking-wider`}>
                        {notice.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">{notice.department}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{notice.content}</p>
                    
                    <div className="flex items-center flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Expires: {notice.expiresAt}</span>
                      </div>
                      {notice.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-neon-cyan">
                          <Paperclip className="w-4 h-4" />
                          <span>{notice.attachments.length} attachment(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <GlowButton 
                      variant="cyan" 
                      size="sm"
                      onClick={() => handleViewNotice(notice)}
                    >
                      <Eye className="w-4 h-4" /> View
                    </GlowButton>
                    {notice.attachments.length > 0 && (
                      <GlowButton 
                        variant="purple" 
                        size="sm"
                        onClick={() => handleDownload(notice.attachments[0])}
                      >
                        <Download className="w-4 h-4" />
                      </GlowButton>
                    )}
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* Post Notice Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Post New Notice</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Notice Title" 
                  placeholder="Enter notice title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Content</label>
                  <textarea
                    placeholder="Enter notice content..."
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <select 
                      value={newNotice.department}
                      onChange={(e) => setNewNotice({...newNotice, department: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                    >
                      <option>All Departments</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <select 
                      value={newNotice.priority}
                      onChange={(e) => setNewNotice({...newNotice, priority: e.target.value as Notice['priority']})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handlePostNotice}>
                    Post Notice
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Notice Modal */}
      <AnimatePresence>
        {showViewModal && selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wider ${
                    selectedNotice.priority === 'urgent' ? 'bg-destructive/10 text-destructive' :
                    selectedNotice.priority === 'important' ? 'bg-neon-purple/10 text-neon-purple' :
                    'bg-neon-cyan/10 text-neon-cyan'
                  }`}>
                    {selectedNotice.priority}
                  </span>
                </div>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedNotice.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedNotice.department}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-foreground whitespace-pre-wrap">{selectedNotice.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Posted By</p>
                    <p className="text-foreground mt-1">{selectedNotice.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Posted On</p>
                    <p className="text-foreground mt-1">{new Date(selectedNotice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedNotice.attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotice.attachments.map((file, i) => (
                        <GlowButton 
                          key={i}
                          variant="cyan" 
                          size="sm"
                          icon={<Download className="w-4 h-4" />}
                          onClick={() => handleDownload(file)}
                        >
                          {file}
                        </GlowButton>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

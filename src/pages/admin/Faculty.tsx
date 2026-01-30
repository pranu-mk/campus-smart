import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Shield,
  ShieldOff,
  Star,
  MessageSquare,
  CheckCircle,
  X,
  Mail,
  Phone,
  UserPlus,
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { faculty, Faculty, departments, complaints, Complaint } from '@/data/admin/dummyData';

export function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>(faculty);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
  });

  // Get unassigned complaints
  const unassignedComplaints = complaints.filter(c => !c.assignedTo || c.status === 'pending');

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: f.status === 'active' ? 'blocked' : 'active' } : f
      )
    );
  };

  const viewFaculty = (fac: Faculty) => {
    setSelectedFaculty(fac);
    setShowModal(true);
  };

  const handleAddFaculty = () => {
    if (!newFaculty.name || !newFaculty.email) return;
    
    const fac: Faculty = {
      id: `FAC${Date.now()}`,
      name: newFaculty.name,
      email: newFaculty.email,
      department: newFaculty.department,
      designation: newFaculty.designation,
      phone: newFaculty.phone,
      avatar: newFaculty.name.split(' ').map(n => n[0]).join('').substring(0, 2),
      status: 'active',
      assignedComplaints: 0,
      resolvedComplaints: 0,
      rating: 0,
    };
    
    setFacultyList((prev) => [fac, ...prev]);
    setShowAddModal(false);
    setNewFaculty({ name: '', email: '', phone: '', department: 'Computer Science', designation: 'Assistant Professor' });
  };

  const handleAssignComplaint = (complaintId: string) => {
    if (!selectedFaculty) return;
    
    // Update faculty's assigned complaints count
    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === selectedFaculty.id
          ? { ...f, assignedComplaints: f.assignedComplaints + 1 }
          : f
      )
    );
    
    setShowAssignModal(false);
    // In a real app, this would also update the complaints list
    alert(`Complaint ${complaintId} assigned to ${selectedFaculty.name}`);
  };

  const openAssignModal = (fac: Faculty) => {
    setSelectedFaculty(fac);
    setShowAssignModal(true);
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
            Faculty Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage {facultyList.length} faculty members
          </p>
        </div>
        <GlowButton 
          variant="gradient" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Faculty
        </GlowButton>
      </motion.div>

      {/* Search */}
      <NeonCard glowColor="purple" hover={false}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search faculty by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20
                       transition-all duration-300"
            />
          </div>
          <GlowButton variant="cyan" icon={<Filter className="w-4 h-4" />}>
            Filters
          </GlowButton>
        </div>
      </NeonCard>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((fac, i) => (
          <motion.div
            key={fac.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard
              glowColor={fac.status === 'active' ? 'purple' : 'pink'}
              className="relative overflow-hidden"
            >
              {/* Status indicator */}
              <div className={`absolute top-4 right-4`}>
                <StatusBadge status={fac.status} />
              </div>

              <div className="flex flex-col items-center text-center">
                <NeonAvatar
                  initials={fac.avatar}
                  glowColor={fac.status === 'active' ? 'purple' : 'pink'}
                  size="lg"
                />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{fac.name}</h3>
                <p className="text-sm text-muted-foreground">{fac.designation}</p>
                <p className="text-sm text-neon-cyan mt-1">{fac.department}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1 text-neon-yellow">
                    <Star className="w-4 h-4" />
                    <span>{fac.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-neon-purple">
                    <MessageSquare className="w-4 h-4" />
                    <span>{fac.assignedComplaints}</span>
                  </div>
                  <div className="flex items-center gap-1 text-neon-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>{fac.resolvedComplaints}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6 w-full">
                  <GlowButton
                    variant="cyan"
                    size="sm"
                    className="flex-1"
                    onClick={() => viewFaculty(fac)}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </GlowButton>
                  <GlowButton
                    variant={fac.status === 'active' ? 'pink' : 'green'}
                    size="sm"
                    onClick={() => toggleStatus(fac.id)}
                  >
                    {fac.status === 'active' ? (
                      <ShieldOff className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Faculty Detail Modal */}
      <AnimatePresence>
        {showModal && selectedFaculty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Faculty Profile</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <NeonAvatar initials={selectedFaculty.avatar} glowColor="purple" size="lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedFaculty.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedFaculty.designation}</p>
                    <StatusBadge status={selectedFaculty.status} className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-neon-cyan" />
                      {selectedFaculty.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neon-purple" />
                      {selectedFaculty.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Department</p>
                    <p className="text-sm text-foreground">{selectedFaculty.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Rating</p>
                    <p className="text-sm text-foreground flex items-center gap-1">
                      <Star className="w-4 h-4 text-neon-yellow" />
                      {selectedFaculty.rating} / 5.0
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-orbitron text-neon-purple">
                      {selectedFaculty.assignedComplaints}
                    </p>
                    <p className="text-xs text-muted-foreground">Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold font-orbitron text-neon-green">
                      {selectedFaculty.resolvedComplaints}
                    </p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GlowButton 
                    variant="purple" 
                    className="flex-1"
                    icon={<UserPlus className="w-4 h-4" />}
                    onClick={() => {
                      setShowModal(false);
                      openAssignModal(selectedFaculty);
                    }}
                  >
                    Assign Complaint
                  </GlowButton>
                  <GlowButton
                    variant={selectedFaculty.status === 'active' ? 'pink' : 'green'}
                    onClick={() => {
                      toggleStatus(selectedFaculty.id);
                      setShowModal(false);
                    }}
                  >
                    {selectedFaculty.status === 'active' ? 'Block' : 'Unblock'}
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Faculty Modal */}
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
                <h2 className="text-xl font-bold font-orbitron text-foreground">Add New Faculty</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Full Name" 
                  placeholder="Dr. John Doe"
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                />
                <GlowInput 
                  label="Email" 
                  type="email" 
                  placeholder="faculty@college.edu"
                  value={newFaculty.email}
                  onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                />
                <GlowInput 
                  label="Phone" 
                  placeholder="+1234567890"
                  value={newFaculty.phone}
                  onChange={(e) => setNewFaculty({...newFaculty, phone: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <select 
                      value={newFaculty.department}
                      onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-purple"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Designation</label>
                    <select 
                      value={newFaculty.designation}
                      onChange={(e) => setNewFaculty({...newFaculty, designation: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-purple"
                    >
                      <option>Assistant Professor</option>
                      <option>Associate Professor</option>
                      <option>Professor</option>
                      <option>HOD</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddFaculty}>
                    Add Faculty
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

      {/* Assign Complaint Modal */}
      <AnimatePresence>
        {showAssignModal && selectedFaculty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
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
                  <h2 className="text-xl font-bold font-orbitron text-foreground">Assign Complaint</h2>
                  <p className="text-sm text-muted-foreground">To: {selectedFaculty.name}</p>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {unassignedComplaints.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-neon-green mx-auto mb-4" />
                    <p className="text-muted-foreground">No unassigned complaints</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unassignedComplaints.map((complaint, i) => (
                      <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-neon-purple/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="text-xs text-neon-cyan font-mono">{complaint.id}</span>
                            <h4 className="font-medium text-foreground mt-1">{complaint.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{complaint.studentName} • {complaint.category}</p>
                          </div>
                          <GlowButton 
                            variant="purple" 
                            size="sm"
                            onClick={() => handleAssignComplaint(complaint.id)}
                          >
                            Assign
                          </GlowButton>
                        </div>
                      </motion.div>
                    ))}
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

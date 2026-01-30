import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Building2, DollarSign, Calendar, Users, Award, X, Edit, Eye } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { placementDrives, PlacementDrive } from '@/data/admin/dummyData';

export function PlacementPage() {
  const [drives, setDrives] = useState<PlacementDrive[]>(placementDrives);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [newDrive, setNewDrive] = useState({
    company: '',
    role: '',
    package: '',
    eligibility: '',
    driveDate: '',
    registrationDeadline: '',
  });

  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDrive = () => {
    if (!newDrive.company || !newDrive.role) return;
    
    const drive: PlacementDrive = {
      id: `PLC${Date.now()}`,
      company: newDrive.company,
      role: newDrive.role,
      package: newDrive.package || 'TBD',
      eligibility: newDrive.eligibility || 'All branches',
      driveDate: newDrive.driveDate || 'TBD',
      registrationDeadline: newDrive.registrationDeadline || 'TBD',
      status: 'upcoming',
      registrations: 0,
      selected: 0,
    };
    
    setDrives((prev) => [drive, ...prev]);
    setShowAddModal(false);
    setNewDrive({ company: '', role: '', package: '', eligibility: '', driveDate: '', registrationDeadline: '' });
  };

  const handleViewDetails = (drive: PlacementDrive) => {
    setSelectedDrive(drive);
    setShowDetailModal(true);
  };

  const handleEditDrive = (drive: PlacementDrive) => {
    setSelectedDrive(drive);
    setNewDrive({
      company: drive.company,
      role: drive.role,
      package: drive.package,
      eligibility: drive.eligibility,
      driveDate: drive.driveDate,
      registrationDeadline: drive.registrationDeadline,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedDrive) return;
    setDrives((prev) =>
      prev.map((d) =>
        d.id === selectedDrive.id
          ? { ...d, ...newDrive }
          : d
      )
    );
    setShowEditModal(false);
    setNewDrive({ company: '', role: '', package: '', eligibility: '', driveDate: '', registrationDeadline: '' });
    setSelectedDrive(null);
  };

  const updateDriveStatus = (status: PlacementDrive['status']) => {
    if (!selectedDrive) return;
    setDrives((prev) =>
      prev.map((d) => (d.id === selectedDrive.id ? { ...d, status } : d))
    );
    setSelectedDrive({ ...selectedDrive, status });
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
            Placement Drives
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage campus recruitment activities
          </p>
        </div>
        <GlowButton 
          variant="gradient" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Drive
        </GlowButton>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NeonCard glowColor="cyan" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-cyan">{drives.length}</p>
          <p className="text-sm text-muted-foreground">Total Drives</p>
        </NeonCard>
        <NeonCard glowColor="purple" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-purple">
            {drives.reduce((a, b) => a + b.registrations, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Registrations</p>
        </NeonCard>
        <NeonCard glowColor="green" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-green">
            {drives.reduce((a, b) => a + b.selected, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Selected</p>
        </NeonCard>
        <NeonCard glowColor="pink" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-pink">
            {drives.filter(d => d.status === 'upcoming').length}
          </p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </NeonCard>
      </div>

      <NeonCard glowColor="purple" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search companies or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((drive, i) => (
          <motion.div
            key={drive.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard glowColor={drive.status === 'upcoming' ? 'cyan' : drive.status === 'ongoing' ? 'purple' : 'green'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{drive.company}</h3>
                      <p className="text-sm text-neon-purple">{drive.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={drive.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neon-green" />
                    <span className="text-sm text-foreground">{drive.package}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neon-pink" />
                    <span className="text-sm text-foreground">{drive.driveDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm text-foreground">{drive.registrations} registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm text-foreground">{drive.selected} selected</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Eligibility</p>
                  <p className="text-sm text-foreground">{drive.eligibility}</p>
                </div>

                <div className="flex gap-2">
                  <GlowButton 
                    variant="cyan" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(drive)}
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </GlowButton>
                  <GlowButton 
                    variant="purple" 
                    size="sm"
                    onClick={() => handleEditDrive(drive)}
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Add Drive Modal */}
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
                <h2 className="text-xl font-bold font-orbitron text-foreground">Add Placement Drive</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput 
                    label="Company Name" 
                    placeholder="Google"
                    value={newDrive.company}
                    onChange={(e) => setNewDrive({...newDrive, company: e.target.value})}
                  />
                  <GlowInput 
                    label="Role" 
                    placeholder="Software Engineer"
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({...newDrive, role: e.target.value})}
                  />
                </div>
                <GlowInput 
                  label="Package" 
                  placeholder="$150,000"
                  value={newDrive.package}
                  onChange={(e) => setNewDrive({...newDrive, package: e.target.value})}
                />
                <GlowInput 
                  label="Eligibility" 
                  placeholder="CS/IT, CGPA > 8.0"
                  value={newDrive.eligibility}
                  onChange={(e) => setNewDrive({...newDrive, eligibility: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput 
                    label="Drive Date" 
                    type="date"
                    value={newDrive.driveDate}
                    onChange={(e) => setNewDrive({...newDrive, driveDate: e.target.value})}
                  />
                  <GlowInput 
                    label="Registration Deadline" 
                    type="date"
                    value={newDrive.registrationDeadline}
                    onChange={(e) => setNewDrive({...newDrive, registrationDeadline: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddDrive}>
                    Add Drive
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

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDrive && (
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
                <h2 className="text-xl font-bold font-orbitron text-foreground">Drive Details</h2>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedDrive.company}</h3>
                    <p className="text-sm text-neon-purple">{selectedDrive.role}</p>
                    <StatusBadge status={selectedDrive.status} className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <p className="text-2xl font-bold font-orbitron text-neon-green">{selectedDrive.package}</p>
                    <p className="text-xs text-muted-foreground">Package</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <p className="text-2xl font-bold font-orbitron text-neon-cyan">{selectedDrive.registrations}</p>
                    <p className="text-xs text-muted-foreground">Registrations</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Eligibility</p>
                    <p className="text-sm text-foreground mt-1">{selectedDrive.eligibility}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Drive Date</p>
                      <p className="text-sm text-foreground mt-1">{selectedDrive.driveDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Deadline</p>
                      <p className="text-sm text-foreground mt-1">{selectedDrive.registrationDeadline}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Update Status</label>
                  <div className="flex gap-2">
                    <GlowButton 
                      variant={selectedDrive.status === 'upcoming' ? 'cyan' : 'purple'}
                      size="sm"
                      onClick={() => updateDriveStatus('upcoming')}
                    >
                      Upcoming
                    </GlowButton>
                    <GlowButton 
                      variant={selectedDrive.status === 'ongoing' ? 'cyan' : 'purple'}
                      size="sm"
                      onClick={() => updateDriveStatus('ongoing')}
                    >
                      Ongoing
                    </GlowButton>
                    <GlowButton 
                      variant={selectedDrive.status === 'completed' ? 'cyan' : 'purple'}
                      size="sm"
                      onClick={() => updateDriveStatus('completed')}
                    >
                      Completed
                    </GlowButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Drive Modal */}
      <AnimatePresence>
        {showEditModal && selectedDrive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Edit Drive</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput 
                    label="Company Name" 
                    placeholder="Google"
                    value={newDrive.company}
                    onChange={(e) => setNewDrive({...newDrive, company: e.target.value})}
                  />
                  <GlowInput 
                    label="Role" 
                    placeholder="Software Engineer"
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({...newDrive, role: e.target.value})}
                  />
                </div>
                <GlowInput 
                  label="Package" 
                  placeholder="$150,000"
                  value={newDrive.package}
                  onChange={(e) => setNewDrive({...newDrive, package: e.target.value})}
                />
                <GlowInput 
                  label="Eligibility" 
                  placeholder="CS/IT, CGPA > 8.0"
                  value={newDrive.eligibility}
                  onChange={(e) => setNewDrive({...newDrive, eligibility: e.target.value})}
                />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleSaveEdit}>
                    Save Changes
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowEditModal(false)}>
                    Cancel
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

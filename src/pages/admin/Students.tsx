import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  ShieldOff,
  Eye,
  Edit,
  Trash2,
  X,
  FileText,
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeonTable } from '@/components/ui/NeonTable';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { students, Student, departments, complaints } from '@/data/admin/dummyData';

export function StudentsPage() {
  const [studentList, setStudentList] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentNo: '',
    department: 'Computer Science',
    semester: '1',
  });

  const filteredStudents = studentList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setStudentList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'blocked' : 'active' } : s
      )
    );
  };

  const viewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const viewComplaints = (student: Student) => {
    setSelectedStudent(student);
    setShowComplaintsModal(true);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) return;
    
    const student: Student = {
      id: `STU${Date.now()}`,
      name: newStudent.name,
      email: newStudent.email,
      department: newStudent.department,
      semester: parseInt(newStudent.semester),
      enrollmentNo: newStudent.enrollmentNo || `EN${Date.now()}`,
      phone: newStudent.phone,
      avatar: newStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2),
      status: 'active',
      complaintsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    setStudentList((prev) => [student, ...prev]);
    setShowAddModal(false);
    setNewStudent({ name: '', email: '', phone: '', enrollmentNo: '', department: 'Computer Science', semester: '1' });
  };

  // Get complaints for selected student
  const studentComplaints = selectedStudent 
    ? complaints.filter(c => c.studentId === selectedStudent.id || c.studentName === selectedStudent.name)
    : [];

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <NeonAvatar
            initials={student.avatar}
            glowColor={student.status === 'active' ? 'cyan' : 'pink'}
            size="sm"
          />
          <div>
            <p className="font-medium text-foreground">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.enrollmentNo}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'department', header: 'Department' },
    { key: 'semester', header: 'Semester' },
    {
      key: 'complaintsCount',
      header: 'Complaints',
      render: (s: Student) => (
        <span className={s.complaintsCount > 5 ? 'text-destructive' : 'text-foreground'}>
          {s.complaintsCount}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: Student) => <StatusBadge status={s.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); viewStudent(student); }}
            className="p-1.5 rounded-lg hover:bg-neon-cyan/10 text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleStatus(student.id); }}
            className={`p-1.5 rounded-lg transition-colors ${
              student.status === 'active'
                ? 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                : 'hover:bg-neon-green/10 text-muted-foreground hover:text-neon-green'
            }`}
          >
            {student.status === 'active' ? (
              <ShieldOff className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    },
  ];

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
            Student Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage {studentList.length} registered students
          </p>
        </div>
        <GlowButton variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Student
        </GlowButton>
      </motion.div>

      {/* Search and Filters */}
      <NeonCard glowColor="cyan" hover={false}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students by name, email, or enrollment..."
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: studentList.length, color: 'cyan' },
          { label: 'Active', value: studentList.filter((s) => s.status === 'active').length, color: 'green' },
          { label: 'Blocked', value: studentList.filter((s) => s.status === 'blocked').length, color: 'pink' },
          { label: 'Avg Complaints', value: (studentList.reduce((a, b) => a + b.complaintsCount, 0) / studentList.length).toFixed(1), color: 'purple' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl glass border border-border/50 text-center`}
          >
            <p className={`text-2xl font-bold font-orbitron text-neon-${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <NeonTable data={filteredStudents} columns={columns} onRowClick={viewStudent} />

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showModal && selectedStudent && (
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
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Student Profile</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <NeonAvatar
                    initials={selectedStudent.avatar}
                    glowColor="cyan"
                    size="lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.enrollmentNo}</p>
                    <StatusBadge status={selectedStudent.status} className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-neon-cyan" />
                      {selectedStudent.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neon-purple" />
                      {selectedStudent.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Department</p>
                    <p className="text-sm text-foreground">{selectedStudent.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Semester</p>
                    <p className="text-sm text-foreground">{selectedStudent.semester}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                    <p className="text-sm text-foreground">{selectedStudent.joinedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Complaints</p>
                    <p className="text-sm text-foreground">{selectedStudent.complaintsCount} filed</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GlowButton 
                    variant="cyan" 
                    className="flex-1"
                    icon={<FileText className="w-4 h-4" />}
                    onClick={() => {
                      setShowModal(false);
                      viewComplaints(selectedStudent);
                    }}
                  >
                    View Complaints
                  </GlowButton>
                  <GlowButton
                    variant={selectedStudent.status === 'active' ? 'pink' : 'green'}
                    onClick={() => {
                      toggleStatus(selectedStudent.id);
                      setShowModal(false);
                    }}
                  >
                    {selectedStudent.status === 'active' ? 'Block' : 'Unblock'}
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
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
                <h2 className="text-xl font-bold font-orbitron text-foreground">Add New Student</h2>
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
                  placeholder="Enter student name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
                <GlowInput 
                  label="Email" 
                  type="email" 
                  placeholder="student@college.edu"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
                <GlowInput 
                  label="Phone" 
                  placeholder="+1234567890"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                />
                <GlowInput 
                  label="Enrollment No" 
                  placeholder="CS2024XXX"
                  value={newStudent.enrollmentNo}
                  onChange={(e) => setNewStudent({...newStudent, enrollmentNo: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <select 
                      value={newStudent.department}
                      onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <GlowInput 
                    label="Semester" 
                    type="number" 
                    placeholder="1-8"
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({...newStudent, semester: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddStudent}>
                    Add Student
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

      {/* Student Complaints Modal */}
      <AnimatePresence>
        {showComplaintsModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowComplaintsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-orbitron text-foreground">Complaint History</h2>
                  <p className="text-sm text-muted-foreground">{selectedStudent.name}</p>
                </div>
                <button
                  onClick={() => setShowComplaintsModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {studentComplaints.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No complaints found for this student</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentComplaints.map((complaint, i) => (
                      <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs text-neon-cyan font-mono">{complaint.id}</span>
                            <h4 className="font-medium text-foreground mt-1">{complaint.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
                          </div>
                          <StatusBadge status={complaint.status} />
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>{complaint.category}</span>
                          <span>•</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          {complaint.facultyName && (
                            <>
                              <span>•</span>
                              <span className="text-neon-purple">Assigned: {complaint.facultyName}</span>
                            </>
                          )}
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

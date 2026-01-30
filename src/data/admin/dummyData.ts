// Dummy data based on college complaint management system schema

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  enrollmentNo: string;
  phone: string;
  avatar: string;
  status: 'active' | 'blocked';
  complaintsCount: number;
  joinedDate: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  avatar: string;
  status: 'active' | 'blocked';
  assignedComplaints: number;
  resolvedComplaints: number;
  rating: number;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'escalated' | 'closed';
  studentId: string;
  studentName: string;
  assignedTo: string | null;
  facultyName: string | null;
  department: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrations: number;
  maxCapacity: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  president: string;
  members: number;
  established: string;
  status: 'active' | 'inactive';
  upcomingEvents: number;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  createdBy: string;
  department: string;
  status: 'active' | 'closed';
  endDate: string;
}

export interface LostItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  location: string;
  reportedBy: string;
  reportedDate: string;
  status: 'lost' | 'found' | 'claimed';
  image: string;
}

export interface HostelComplaint {
  id: string;
  title: string;
  hostelBlock: string;
  roomNo: string;
  category: string;
  description: string;
  reportedBy: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  department: string;
  priority: 'normal' | 'important' | 'urgent';
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  attachments: string[];
}

export interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  package: string;
  eligibility: string;
  driveDate: string;
  registrationDeadline: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
  selected: number;
}

// Dummy Students
export const students: Student[] = [
  { id: 'STU001', name: 'Alex Chen', email: 'alex.chen@college.edu', department: 'Computer Science', semester: 6, enrollmentNo: 'CS2021001', phone: '+1234567890', avatar: 'AC', status: 'active', complaintsCount: 3, joinedDate: '2021-08-15' },
  { id: 'STU002', name: 'Maria Garcia', email: 'maria.g@college.edu', department: 'Electronics', semester: 4, enrollmentNo: 'EC2022015', phone: '+1234567891', avatar: 'MG', status: 'active', complaintsCount: 1, joinedDate: '2022-08-10' },
  { id: 'STU003', name: 'James Wilson', email: 'j.wilson@college.edu', department: 'Mechanical', semester: 8, enrollmentNo: 'ME2020045', phone: '+1234567892', avatar: 'JW', status: 'active', complaintsCount: 5, joinedDate: '2020-08-12' },
  { id: 'STU004', name: 'Priya Sharma', email: 'priya.s@college.edu', department: 'Computer Science', semester: 2, enrollmentNo: 'CS2023089', phone: '+1234567893', avatar: 'PS', status: 'active', complaintsCount: 0, joinedDate: '2023-08-01' },
  { id: 'STU005', name: 'David Kim', email: 'david.kim@college.edu', department: 'Civil', semester: 6, enrollmentNo: 'CV2021034', phone: '+1234567894', avatar: 'DK', status: 'blocked', complaintsCount: 12, joinedDate: '2021-08-15' },
  { id: 'STU006', name: 'Emma Thompson', email: 'emma.t@college.edu', department: 'Electronics', semester: 4, enrollmentNo: 'EC2022078', phone: '+1234567895', avatar: 'ET', status: 'active', complaintsCount: 2, joinedDate: '2022-08-10' },
  { id: 'STU007', name: 'Raj Patel', email: 'raj.p@college.edu', department: 'Information Technology', semester: 6, enrollmentNo: 'IT2021056', phone: '+1234567896', avatar: 'RP', status: 'active', complaintsCount: 4, joinedDate: '2021-08-15' },
  { id: 'STU008', name: 'Sophie Martin', email: 'sophie.m@college.edu', department: 'Computer Science', semester: 4, enrollmentNo: 'CS2022102', phone: '+1234567897', avatar: 'SM', status: 'active', complaintsCount: 1, joinedDate: '2022-08-10' },
];

// Dummy Faculty
export const faculty: Faculty[] = [
  { id: 'FAC001', name: 'Dr. Sarah Johnson', email: 'sarah.j@college.edu', department: 'Computer Science', designation: 'Professor', phone: '+1234560001', avatar: 'SJ', status: 'active', assignedComplaints: 8, resolvedComplaints: 45, rating: 4.8 },
  { id: 'FAC002', name: 'Prof. Michael Brown', email: 'michael.b@college.edu', department: 'Electronics', designation: 'Associate Professor', phone: '+1234560002', avatar: 'MB', status: 'active', assignedComplaints: 5, resolvedComplaints: 32, rating: 4.5 },
  { id: 'FAC003', name: 'Dr. Emily Davis', email: 'emily.d@college.edu', department: 'Mechanical', designation: 'Professor', phone: '+1234560003', avatar: 'ED', status: 'active', assignedComplaints: 3, resolvedComplaints: 28, rating: 4.7 },
  { id: 'FAC004', name: 'Prof. Robert Lee', email: 'robert.l@college.edu', department: 'Civil', designation: 'Assistant Professor', phone: '+1234560004', avatar: 'RL', status: 'active', assignedComplaints: 6, resolvedComplaints: 19, rating: 4.3 },
  { id: 'FAC005', name: 'Dr. Lisa Anderson', email: 'lisa.a@college.edu', department: 'Information Technology', designation: 'Professor', phone: '+1234560005', avatar: 'LA', status: 'blocked', assignedComplaints: 0, resolvedComplaints: 52, rating: 4.9 },
  { id: 'FAC006', name: 'Prof. John Martinez', email: 'john.m@college.edu', department: 'Computer Science', designation: 'Associate Professor', phone: '+1234560006', avatar: 'JM', status: 'active', assignedComplaints: 4, resolvedComplaints: 37, rating: 4.6 },
];

// Dummy Complaints
export const complaints: Complaint[] = [
  {
    id: 'CMP001',
    title: 'WiFi Connectivity Issues in Library',
    description: 'The WiFi connection in the main library building has been extremely slow for the past week. Students are unable to access online resources for their research work.',
    category: 'Infrastructure',
    priority: 'high',
    status: 'in_progress',
    studentId: 'STU001',
    studentName: 'Alex Chen',
    assignedTo: 'FAC001',
    facultyName: 'Dr. Sarah Johnson',
    department: 'IT Services',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-16T14:20:00',
    attachments: ['screenshot1.png', 'speed_test.pdf'],
    timeline: [
      { id: 'TL001', action: 'Created', description: 'Complaint registered', timestamp: '2024-01-15T10:30:00', user: 'Alex Chen' },
      { id: 'TL002', action: 'Assigned', description: 'Assigned to Dr. Sarah Johnson', timestamp: '2024-01-15T11:00:00', user: 'Admin' },
      { id: 'TL003', action: 'Status Update', description: 'Investigation started', timestamp: '2024-01-16T14:20:00', user: 'Dr. Sarah Johnson' },
    ]
  },
  {
    id: 'CMP002',
    title: 'Broken Air Conditioning in Lab 204',
    description: 'The AC unit in Computer Lab 204 is not working. The room temperature is unbearable during afternoon sessions.',
    category: 'Maintenance',
    priority: 'critical',
    status: 'escalated',
    studentId: 'STU003',
    studentName: 'James Wilson',
    assignedTo: 'FAC003',
    facultyName: 'Dr. Emily Davis',
    department: 'Mechanical',
    createdAt: '2024-01-14T09:15:00',
    updatedAt: '2024-01-16T16:45:00',
    attachments: ['photo_ac.jpg'],
    timeline: [
      { id: 'TL004', action: 'Created', description: 'Complaint registered', timestamp: '2024-01-14T09:15:00', user: 'James Wilson' },
      { id: 'TL005', action: 'Assigned', description: 'Assigned to Dr. Emily Davis', timestamp: '2024-01-14T10:00:00', user: 'Admin' },
      { id: 'TL006', action: 'Escalated', description: 'Escalated due to no resolution', timestamp: '2024-01-16T16:45:00', user: 'System' },
    ]
  },
  {
    id: 'CMP003',
    title: 'Request for Additional Study Materials',
    description: 'The library does not have the latest edition of the Database Management textbook required for our course.',
    category: 'Academic',
    priority: 'medium',
    status: 'resolved',
    studentId: 'STU002',
    studentName: 'Maria Garcia',
    assignedTo: 'FAC001',
    facultyName: 'Dr. Sarah Johnson',
    department: 'Library',
    createdAt: '2024-01-10T14:00:00',
    updatedAt: '2024-01-15T11:30:00',
    attachments: [],
    timeline: [
      { id: 'TL007', action: 'Created', description: 'Complaint registered', timestamp: '2024-01-10T14:00:00', user: 'Maria Garcia' },
      { id: 'TL008', action: 'Resolved', description: 'Books ordered and will arrive next week', timestamp: '2024-01-15T11:30:00', user: 'Dr. Sarah Johnson' },
    ]
  },
  {
    id: 'CMP004',
    title: 'Cafeteria Food Quality Issues',
    description: 'The food quality in the main cafeteria has deteriorated significantly. Several students have reported stomach issues.',
    category: 'Health & Safety',
    priority: 'critical',
    status: 'pending',
    studentId: 'STU007',
    studentName: 'Raj Patel',
    assignedTo: null,
    facultyName: null,
    department: 'Administration',
    createdAt: '2024-01-16T08:00:00',
    updatedAt: '2024-01-16T08:00:00',
    attachments: ['photo1.jpg', 'photo2.jpg'],
    timeline: [
      { id: 'TL009', action: 'Created', description: 'Complaint registered', timestamp: '2024-01-16T08:00:00', user: 'Raj Patel' },
    ]
  },
  {
    id: 'CMP005',
    title: 'Parking Space Shortage',
    description: 'There are not enough parking spaces for students. Many have to park outside the campus which is unsafe.',
    category: 'Infrastructure',
    priority: 'low',
    status: 'assigned',
    studentId: 'STU004',
    studentName: 'Priya Sharma',
    assignedTo: 'FAC004',
    facultyName: 'Prof. Robert Lee',
    department: 'Administration',
    createdAt: '2024-01-12T16:30:00',
    updatedAt: '2024-01-13T09:00:00',
    attachments: [],
    timeline: [
      { id: 'TL010', action: 'Created', description: 'Complaint registered', timestamp: '2024-01-12T16:30:00', user: 'Priya Sharma' },
      { id: 'TL011', action: 'Assigned', description: 'Assigned to Prof. Robert Lee', timestamp: '2024-01-13T09:00:00', user: 'Admin' },
    ]
  },
];

// Dummy Events
export const events: Event[] = [
  { id: 'EVT001', title: 'Tech Fest 2024', description: 'Annual technology festival featuring competitions, workshops, and exhibitions', date: '2024-02-15', time: '09:00 AM', venue: 'Main Auditorium', organizer: 'Computer Science Dept', category: 'Technical', status: 'upcoming', registrations: 450, maxCapacity: 500 },
  { id: 'EVT002', title: 'Cultural Night', description: 'Showcase of diverse cultural performances and traditions', date: '2024-01-25', time: '06:00 PM', venue: 'Open Air Theatre', organizer: 'Cultural Committee', category: 'Cultural', status: 'ongoing', registrations: 800, maxCapacity: 1000 },
  { id: 'EVT003', title: 'Career Fair 2024', description: 'Connect with top recruiters and explore job opportunities', date: '2024-02-01', time: '10:00 AM', venue: 'Convention Center', organizer: 'Placement Cell', category: 'Career', status: 'upcoming', registrations: 620, maxCapacity: 700 },
  { id: 'EVT004', title: 'Hackathon', description: '24-hour coding competition with exciting prizes', date: '2024-01-20', time: '08:00 AM', venue: 'CS Lab Complex', organizer: 'Coding Club', category: 'Technical', status: 'completed', registrations: 200, maxCapacity: 200 },
];

// Dummy Clubs
export const clubs: Club[] = [
  { id: 'CLB001', name: 'Coding Club', description: 'Learn programming, participate in competitions, and build projects', category: 'Technical', president: 'Alex Chen', members: 156, established: '2018', status: 'active', upcomingEvents: 3 },
  { id: 'CLB002', name: 'Robotics Society', description: 'Design and build robots for competitions and research', category: 'Technical', president: 'James Wilson', members: 89, established: '2015', status: 'active', upcomingEvents: 2 },
  { id: 'CLB003', name: 'Drama Club', description: 'Theater performances and acting workshops', category: 'Cultural', president: 'Emma Thompson', members: 67, established: '2012', status: 'active', upcomingEvents: 1 },
  { id: 'CLB004', name: 'Photography Club', description: 'Capture moments and learn photography techniques', category: 'Arts', president: 'Sophie Martin', members: 112, established: '2016', status: 'active', upcomingEvents: 4 },
  { id: 'CLB005', name: 'Debate Society', description: 'Develop public speaking and argumentation skills', category: 'Literary', president: 'Maria Garcia', members: 45, established: '2010', status: 'inactive', upcomingEvents: 0 },
];

// Dummy Polls
export const polls: Poll[] = [
  { id: 'POL001', question: 'What should be the theme for the annual fest?', options: [{ id: 'O1', text: 'Retro 80s', votes: 234 }, { id: 'O2', text: 'Futuristic', votes: 456 }, { id: 'O3', text: 'Nature', votes: 189 }, { id: 'O4', text: 'Space', votes: 321 }], totalVotes: 1200, createdBy: 'Student Council', department: 'All', status: 'active', endDate: '2024-01-30' },
  { id: 'POL002', question: 'Preferred timing for library hours extension?', options: [{ id: 'O5', text: 'Till 10 PM', votes: 567 }, { id: 'O6', text: 'Till 12 AM', votes: 823 }, { id: 'O7', text: '24/7 Access', votes: 445 }], totalVotes: 1835, createdBy: 'Library Committee', department: 'All', status: 'active', endDate: '2024-01-25' },
  { id: 'POL003', question: 'New sports facility priority?', options: [{ id: 'O8', text: 'Swimming Pool', votes: 412 }, { id: 'O9', text: 'Indoor Stadium', votes: 389 }, { id: 'O10', text: 'Tennis Courts', votes: 178 }], totalVotes: 979, createdBy: 'Sports Committee', department: 'All', status: 'closed', endDate: '2024-01-15' },
];

// Dummy Lost Items
export const lostItems: LostItem[] = [
  { id: 'LI001', itemName: 'MacBook Pro 14"', description: 'Silver MacBook Pro with stickers on the back', category: 'Electronics', location: 'Library 2nd Floor', reportedBy: 'Raj Patel', reportedDate: '2024-01-16', status: 'lost', image: '💻' },
  { id: 'LI002', itemName: 'Student ID Card', description: 'ID card of Maria Garcia, CS Department', category: 'Documents', location: 'Cafeteria', reportedBy: 'Security', reportedDate: '2024-01-15', status: 'found', image: '🪪' },
  { id: 'LI003', itemName: 'Wireless Earbuds', description: 'White AirPods Pro in black case', category: 'Electronics', location: 'Gym', reportedBy: 'David Kim', reportedDate: '2024-01-14', status: 'claimed', image: '🎧' },
  { id: 'LI004', itemName: 'Textbook - Data Structures', description: 'Book by Cormen, has name written inside', category: 'Books', location: 'CS Lab 101', reportedBy: 'Alex Chen', reportedDate: '2024-01-13', status: 'lost', image: '📚' },
];

// Dummy Hostel Complaints
export const hostelComplaints: HostelComplaint[] = [
  { id: 'HC001', title: 'Water Leakage in Bathroom', hostelBlock: 'Block A', roomNo: 'A-204', category: 'Plumbing', description: 'Continuous water leakage from the bathroom tap', reportedBy: 'Alex Chen', status: 'in_progress', priority: 'high', createdAt: '2024-01-16T08:00:00' },
  { id: 'HC002', title: 'Broken Window Lock', hostelBlock: 'Block B', roomNo: 'B-112', category: 'Security', description: 'Window lock is broken, security concern', reportedBy: 'James Wilson', status: 'pending', priority: 'medium', createdAt: '2024-01-15T14:30:00' },
  { id: 'HC003', title: 'Pest Issue', hostelBlock: 'Block C', roomNo: 'C-301', category: 'Housekeeping', description: 'Cockroach infestation in the room', reportedBy: 'Raj Patel', status: 'resolved', priority: 'high', createdAt: '2024-01-14T10:00:00' },
  { id: 'HC004', title: 'Internet Not Working', hostelBlock: 'Block A', roomNo: 'A-118', category: 'IT', description: 'WiFi not connecting for 2 days', reportedBy: 'Priya Sharma', status: 'pending', priority: 'low', createdAt: '2024-01-16T11:00:00' },
];

// Dummy Notices
export const notices: Notice[] = [
  { id: 'NOT001', title: 'Semester Examination Schedule', content: 'The end semester examinations will commence from February 15, 2024. Detailed schedule available on the student portal.', department: 'Examination Cell', priority: 'urgent', createdBy: 'Controller of Exams', createdAt: '2024-01-16T09:00:00', expiresAt: '2024-02-20', attachments: ['exam_schedule.pdf'] },
  { id: 'NOT002', title: 'Library Renovation Notice', content: 'The central library will be closed for renovation from January 20-25. Digital resources will remain accessible.', department: 'Library', priority: 'important', createdBy: 'Chief Librarian', createdAt: '2024-01-15T10:00:00', expiresAt: '2024-01-26', attachments: [] },
  { id: 'NOT003', title: 'Sports Day Registration', content: 'Register for annual sports day events. Last date: January 25, 2024.', department: 'Sports', priority: 'normal', createdBy: 'Sports Director', createdAt: '2024-01-14T11:00:00', expiresAt: '2024-01-26', attachments: ['registration_form.pdf'] },
];

// Dummy Placement Drives
export const placementDrives: PlacementDrive[] = [
  { id: 'PLC001', company: 'Google', role: 'Software Engineer', package: '$150,000', eligibility: 'CS/IT, CGPA > 8.0', driveDate: '2024-02-10', registrationDeadline: '2024-01-31', status: 'upcoming', registrations: 89, selected: 0 },
  { id: 'PLC002', company: 'Microsoft', role: 'Product Manager', package: '$140,000', eligibility: 'Any Branch, CGPA > 7.5', driveDate: '2024-02-05', registrationDeadline: '2024-01-28', status: 'upcoming', registrations: 156, selected: 0 },
  { id: 'PLC003', company: 'Amazon', role: 'SDE-1', package: '$130,000', eligibility: 'CS/IT/EC, CGPA > 7.0', driveDate: '2024-01-20', registrationDeadline: '2024-01-15', status: 'completed', registrations: 234, selected: 12 },
  { id: 'PLC004', company: 'Apple', role: 'iOS Developer', package: '$145,000', eligibility: 'CS/IT, CGPA > 8.5', driveDate: '2024-02-15', registrationDeadline: '2024-02-05', status: 'upcoming', registrations: 45, selected: 0 },
];

// Dashboard Stats
export const dashboardStats = {
  totalStudents: 2847,
  totalFaculty: 156,
  totalComplaints: 1234,
  pendingComplaints: 89,
  resolvedComplaints: 987,
  escalatedComplaints: 23,
  activeEvents: 12,
  upcomingPlacements: 8,
  averageResolutionTime: '2.4 days',
  satisfactionRate: 87,
};

// Departments
export const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Information Technology',
  'Electrical',
  'Chemical',
  'Biotechnology',
];

// Complaint Categories
export const complaintCategories = [
  'Infrastructure',
  'Academic',
  'Maintenance',
  'Health & Safety',
  'Administration',
  'Library',
  'Hostel',
  'Transportation',
  'Other',
];

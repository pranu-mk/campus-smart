import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, ArrowLeft, Building2, IdCard, Phone, BookOpen, Calendar, Briefcase, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Added Auth Context
import AuthHeader from '../components/auth/AuthHeader';
import RoleSelector from '../components/auth/RoleSelector';
import AuthModeToggle from '../components/auth/AuthModeToggle';
import FloatingInput from '../components/auth/FloatingInput';
import PasswordInput from '../components/auth/PasswordInput';
import PhotoUpload from '../components/auth/PhotoUpload';
import AuthButton from '../components/auth/AuthButton';
import StatusFeedback from '../components/auth/StatusFeedback';

const headlineVariants = {
  login: {
    student: "Welcome back, Scholar",
    faculty: "Welcome back, Educator",
    admin: "Admin Portal Access",
  },
  register: {
    student: "Join the Campus Community",
    faculty: "Register as Faculty",
    admin: "",
  },
};

const sublineVariants = {
  login: "Enter your credentials to continue",
  register: "Create your account in less than a minute",
};

export default function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login } = useAuth(); // Initialize login from context
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  
  const [formData, setFormData] = useState({
    photo: '',
    fullName: '',
    email: '',
    mobile: '',
    studentId: '',
    facultyId: '',
    department: '',
    course: '',
    yearSemester: '',
    designation: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role === 'admin') {
      setMode('login');
    }
  }, [role]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (mode === 'register') {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (role === 'student') {
        if (!formData.studentId) newErrors.studentId = 'Student ID / PRN is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.course) newErrors.course = 'Course is required';
      }
      
      if (role === 'faculty') {
        if (!formData.facultyId) newErrors.facultyId = 'Faculty ID is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setStatus({ 
      type: 'loading', 
      message: mode === 'register' ? 'Saving details to database...' : 'Verifying credentials...' 
    });

    try {
      const endpoint = mode === 'register' ? '/register' : '/login';
      const url = `http://localhost:5000/api/auth${endpoint}`;

      const payload = mode === 'register' ? {
        role: role,
        photo: formData.photo,
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        studentId: formData.studentId, 
        facultyId: formData.facultyId,
        department: formData.department,
        course: formData.course,
        yearSemester: formData.yearSemester,
        designation: formData.designation,
        username: formData.username,
        password: formData.password
      } : {
        identifier: formData.username,
        password: formData.password,
        role: role // Include role for login consistency
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: mode === 'register' ? 'Registration Successful! Please login.' : 'Login Successful! Redirecting...' 
        });

        if (mode === 'login') {
          // Clear any old data
          localStorage.clear();
          
          // Store basic session data
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);

          // CRITICAL: Update AuthContext state so Sidebar/Dashboard can see data
          login({
            id: data.id,
            role: data.role,
            full_name: data.full_name || data.name,
            prn: data.prn,
            department: data.department,
            profile_picture: data.profile_picture
          });

          // Redirect to the appropriate dashboard
          setTimeout(() => navigate(`/dashboard/${data.role.toLowerCase()}`), 1500);
        } else {
          // Reset and switch to login mode after successful registration
          setTimeout(() => {
            setMode('login');
            setIsLoading(false);
            setStatus({ type: null, message: '' });
          }, 2000);
        }
      } else {
        setStatus({ type: 'error', message: data.message || 'Operation failed' });
        setIsLoading(false);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection refused. Is the backend server running?' });
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-accent/10 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
        />
      </div>

      <AuthHeader />

      <main className="relative min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <div className="glass-card p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${role}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center mb-8"
              >
                <h1 className="text-2xl font-bold text-foreground font-display mb-2">
                  {headlineVariants[mode][role] || headlineVariants.login[role]}
                </h1>
                <p className="text-muted-foreground text-sm">{sublineVariants[mode]}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mb-6">
              <RoleSelector value={role} onChange={setRole} />
            </div>

            <AnimatePresence mode="wait">
              {role === 'admin' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2 className="text-lg font-semibold mb-2">Admin Access Only</h2>
                  <p className="text-muted-foreground text-sm mb-6">Contact the system owner for credentials.</p>
                  <button onClick={() => setRole('student')} className="text-primary hover:underline font-medium">Register as Student</button>
                </motion.div>
              )}
            </AnimatePresence>

            {role !== 'admin' && (
              <form onSubmit={handleSubmit}>
                <motion.div key={`${mode}-${role}-form`} variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <div className="mb-6">
                    <AuthModeToggle mode={mode} onModeChange={setMode} />
                  </div>

                  <AnimatePresence mode="wait">
                    {mode === 'register' && (
                      <motion.div key="register-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                        <motion.div variants={itemVariants} className="flex justify-center mb-4">
                          <PhotoUpload value={formData.photo} onChange={(v) => setFormData((prev) => ({ ...prev, photo: v }))} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <FloatingInput label="Full Name" value={formData.fullName} onChange={handleChange('fullName')} error={errors.fullName} required icon={User} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <FloatingInput label={role === 'student' ? 'College Email' : 'Official Email'} type="email" value={formData.email} onChange={handleChange('email')} error={errors.email} required icon={Mail} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <FloatingInput label="Mobile Number" type="tel" value={formData.mobile} onChange={handleChange('mobile')} error={errors.mobile} required icon={Phone} />
                        </motion.div>

                        {role === 'student' && (
                          <>
                            <motion.div variants={itemVariants}><FloatingInput label="Student ID / PRN" value={formData.studentId} onChange={handleChange('studentId')} error={errors.studentId} required icon={IdCard} /></motion.div>
                            <motion.div variants={itemVariants}><FloatingInput label="Department" value={formData.department} onChange={handleChange('department')} error={errors.department} required icon={Building2} /></motion.div>
                            <motion.div variants={itemVariants}><FloatingInput label="Course" value={formData.course} onChange={handleChange('course')} error={errors.course} required icon={BookOpen} /></motion.div>
                            <motion.div variants={itemVariants}><FloatingInput label="Year / Semester" value={formData.yearSemester} onChange={handleChange('yearSemester')} icon={Calendar} /></motion.div>
                          </>
                        )}

                        {role === 'faculty' && (
                          <>
                            <motion.div variants={itemVariants}><FloatingInput label="Faculty ID" value={formData.facultyId} onChange={handleChange('facultyId')} error={errors.facultyId} required icon={IdCard} /></motion.div>
                            <motion.div variants={itemVariants}><FloatingInput label="Department" value={formData.department} onChange={handleChange('department')} error={errors.department} required icon={Building2} /></motion.div>
                            <motion.div variants={itemVariants}><FloatingInput label="Designation" value={formData.designation} onChange={handleChange('designation')} error={errors.designation} required icon={Briefcase} /></motion.div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <FloatingInput label="Username" value={formData.username} onChange={handleChange('username')} error={errors.username} required icon={User} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PasswordInput label="Password" value={formData.password} onChange={handleChange('password')} error={errors.password} required showStrength={mode === 'register'} />
                  </motion.div>

                  {mode === 'register' && (
                    <motion.div variants={itemVariants}>
                      <PasswordInput label="Confirm Password" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} required />
                    </motion.div>
                  )}

                  <StatusFeedback status={status.type} message={status.message} />

                  <motion.div variants={itemVariants}>
                    <AuthButton isLoading={isLoading}>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </AuthButton>
                  </motion.div>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
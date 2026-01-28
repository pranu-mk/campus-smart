import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, ArrowLeft, Building2, IdCard, Phone, BookOpen, Calendar, Briefcase, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  const { login } = useAuth();
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  
  const [formData, setFormData] = useState({
    photo: '',
    fullName: '',
    email: '',
    mobile: '',
    studentId: '', // Maps to 'prn' in DB
    facultyId: '', // Maps to 'faculty_id' in DB
    department: '',
    course: '',
    yearSemester: '', // Maps to 'year' in DB
    designation: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role === 'admin') setMode('login');
  }, [role]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (mode === 'register') {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (role === 'student') {
        if (!formData.studentId) newErrors.studentId = 'PRN is required';
        if (!formData.department) newErrors.department = 'Department is required';
      }
      if (role === 'faculty') {
        if (!formData.facultyId) newErrors.facultyId = 'Faculty ID is required';
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
    setStatus({ type: 'loading', message: mode === 'register' ? 'Registering...' : 'Logging in...' });

    try {
      const endpoint = mode === 'register' ? '/register' : '/login';
      const url = `http://localhost:5000/api/auth${endpoint}`;

      // CRITICAL FIX: Maps frontend names to exact MySQL database columns
      const payload = mode === 'register' ? {
        role,
        full_name: formData.fullName,
        email: formData.email,
        mobile_number: formData.mobile,
        username: formData.username,
        password: formData.password,
        profile_picture: formData.photo,
        department: formData.department,
        // Role specific mapping
        prn: formData.studentId, // maps to prn column
        course: formData.course,
        year: formData.yearSemester, // maps to year column
        faculty_id: formData.facultyId, // maps to faculty_id column
        designation: formData.designation
      } : {
        identifier: formData.username,
        password: formData.password,
        role
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: mode === 'register' ? 'Success! Switching to Login...' : 'Login Successful!' });
        
        if (mode === 'login') {
          localStorage.clear();
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          login(data.user);
          setTimeout(() => navigate(`/dashboard/${data.role.toLowerCase()}`), 1000);
        } else {
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
      setStatus({ type: 'error', message: 'Connection refused. Check if Backend is running.' });
      setIsLoading(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.03 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background relative overflow-hidden">
      <AuthHeader />
      <main className="relative min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass-card p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{headlineVariants[mode][role] || headlineVariants.login[role]}</h1>
              <p className="text-muted-foreground text-sm">{sublineVariants[mode]}</p>
            </div>

            <div className="mb-6"><RoleSelector value={role} onChange={setRole} /></div>

            {role !== 'admin' && (
              <form onSubmit={handleSubmit}>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <div className="mb-6"><AuthModeToggle mode={mode} onModeChange={setMode} /></div>
                  
                  <AnimatePresence mode="wait">
                    {mode === 'register' && (
                      <motion.div key="reg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <PhotoUpload value={formData.photo} onChange={(v) => setFormData(p => ({ ...p, photo: v }))} />
                        <FloatingInput label="Full Name" value={formData.fullName} onChange={handleChange('fullName')} error={errors.fullName} icon={User} />
                        <FloatingInput label="Email" type="email" value={formData.email} onChange={handleChange('email')} error={errors.email} icon={Mail} />
                        <FloatingInput label="Mobile" type="tel" value={formData.mobile} onChange={handleChange('mobile')} error={errors.mobile} icon={Phone} />
                        
                        {role === 'student' ? (
                          <>
                            <FloatingInput label="PRN / Student ID" value={formData.studentId} onChange={handleChange('studentId')} error={errors.studentId} icon={IdCard} />
                            <FloatingInput label="Department" value={formData.department} onChange={handleChange('department')} icon={Building2} />
                            <FloatingInput label="Course" value={formData.course} onChange={handleChange('course')} icon={BookOpen} />
                          </>
                        ) : (
                          <>
                            <FloatingInput label="Faculty ID" value={formData.facultyId} onChange={handleChange('facultyId')} error={errors.facultyId} icon={IdCard} />
                            <FloatingInput label="Designation" value={formData.designation} onChange={handleChange('designation')} icon={Briefcase} />
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FloatingInput label="Username" value={formData.username} onChange={handleChange('username')} error={errors.username} icon={User} />
                  <PasswordInput label="Password" value={formData.password} onChange={handleChange('password')} error={errors.password} showStrength={mode === 'register'} />
                  
                  {mode === 'register' && (
                    <PasswordInput label="Confirm Password" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} />
                  )}

                  <StatusFeedback status={status.type} message={status.message} />
                  <AuthButton isLoading={isLoading}>{mode === 'login' ? 'Sign In' : 'Create Account'}</AuthButton>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
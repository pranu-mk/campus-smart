import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, Save, LogOut, Camera, Lock, Hash, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    collegeEmail: "john.doe@college.edu",
    mobileNumber: "+91 98765 43210",
    prn: "CS2021001",
    department: "Computer Science",
    course: "B.Tech",
    year: "3rd Year",
    username: "johndoe2021",
    password: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    if (profile.password && profile.password !== profile.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Profile Saved!",
      description: "Your profile information has been updated successfully.",
    });
    setProfile({ ...profile, password: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const getCardClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-[#1a1a2e]";
      case "fancy":
        return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#4f6fdc]/20";
      default:
        return "bg-white";
    }
  };

  const getInputClasses = () => {
    return theme === "light"
      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937] bg-white"
      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white";
  };

  return (
    <MainLayout>
      <TopNavbar title="My Profile" subtitle="View and manage your profile information" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-1"
        >
          <div className={`rounded-2xl shadow-card p-6 text-center ${getCardClasses()}`}>
            <div className="relative inline-block">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                theme === "fancy" 
                  ? "bg-gradient-to-br from-[#4f6fdc] to-[#9333ea]" 
                  : "bg-[#4f6fdc]"
              }`}>
                <User className="w-12 h-12 text-white" />
              </div>
              <button className={`absolute bottom-3 right-0 w-8 h-8 rounded-full flex items-center justify-center ${
                theme === "light" ? "bg-white shadow-md" : "bg-[#3d3d5c]"
              }`}>
                <Camera className={`w-4 h-4 ${theme === "light" ? "text-[#4f6fdc]" : "text-white"}`} />
              </button>
            </div>
            <h2 className={`text-xl font-semibold ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
              {profile.fullName}
            </h2>
            <p className="text-[#4f6fdc] font-medium">{profile.prn}</p>
            <p className={`text-sm mt-1 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
              {profile.department}
            </p>
            <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
              {profile.course} • {profile.year}
            </p>

            <div className={`mt-6 pt-6 border-t ${theme === "light" ? "border-gray-100" : "border-white/10"}`}>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className={`rounded-2xl shadow-card p-6 ${getCardClasses()}`}>
            <h3 className={`text-lg font-semibold mb-6 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
              Student Profile Form
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  />
                </div>
              </div>

              {/* College Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  College Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="email"
                    value={profile.collegeEmail}
                    onChange={(e) => setProfile({ ...profile, collegeEmail: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="tel"
                    value={profile.mobileNumber}
                    onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  />
                </div>
              </div>

              {/* PRN */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  PRN (Permanent Registration Number)
                </label>
                <div className="relative">
                  <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="text"
                    value={profile.prn}
                    disabled
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${
                      theme === "light" ? "bg-gray-50 text-[#6b7280]" : "bg-white/5 text-white/50"
                    }`}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <select
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
              </div>

              {/* Course */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Course
                </label>
                <div className="relative">
                  <BookOpen className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <select
                    value={profile.course}
                    onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
              </div>

              {/* Year */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Year
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <select
                    value={profile.year}
                    onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Username
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  New Password (optional)
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="password"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <input
                    type="password"
                    value={profile.confirmPassword}
                    onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${getInputClasses()}`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  theme === "fancy"
                    ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white hover:opacity-90"
                    : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                }`}
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Profile;

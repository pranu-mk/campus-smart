import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, Save, LogOut, Camera, Lock, Hash, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/student/MainLayout";
import TopNavbar from "@/components/layout/student/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { dashboardAPI } from "@/modules/student/services/api";


const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    collegeEmail: "",
    mobileNumber: "",
    prn: "",
    department: "",
    course: "",
    year: "",
    username: "",
    oldPassword: "", // Added for security flow
    password: "",
    confirmPassword: "",
    profilePicture: null
  });

  // FETCH REAL DATA
 useEffect(() => {
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardAPI.getDashboardData();
      const userData = response?.user || response?.data?.user;

      if (userData) {
        setProfile(prev => ({
          ...prev,
          // LEFT SIDE: Your Frontend State names
          // RIGHT SIDE: The names from your Backend JSON
          fullName: userData.full_name || "", 
          collegeEmail: userData.email || "",
          mobileNumber: userData.mobile_number || "",
          prn: userData.prn || "",
          department: userData.department || "",
          course: userData.course || "",
          year: userData.year || "",
          username: userData.username || "",
          profilePicture: userData.profile_picture || null
        }));
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfileData();
}, []);

  // HANDLE SAVE LOGIC (Personal Info)
  const handleSave = async () => {
    try {
      if (!profile.fullName || !profile.mobileNumber) {
        toast({ title: "Error", description: "Name and Mobile are required", variant: "destructive" });
        return;
      }

      const response = await dashboardAPI.updateProfile({
        fullName: profile.fullName,
        mobileNumber: profile.mobileNumber,
        username: profile.username
      });

      if (response.success) {
        toast({ title: "Success", description: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  // NEW: HANDLE PASSWORD RESET (Logic to be completed tomorrow)
 const handlePasswordReset = async () => {
    // 1. Basic Frontend Validation
    if (!profile.oldPassword || !profile.password || !profile.confirmPassword) {
        toast({ title: "Required", description: "Please fill all password fields", variant: "destructive" });
        return;
    }
    if (profile.password !== profile.confirmPassword) {
        toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
        return;
    }
    
    try {
      // 2. Call the API
      const response = await dashboardAPI.changePassword({
        oldPassword: profile.oldPassword,
        newPassword: profile.password
      });

      if (response.success) {
        toast({ title: "Success", description: "Password changed! Use your new password next time." });
        // 3. Clear the password fields for security
        setProfile(prev => ({ ...prev, oldPassword: "", password: "", confirmPassword: "" }));
      }
    } catch (error: any) {
      toast({ 
        title: "Update Failed", 
        description: error.message || "Incorrect current password", 
        variant: "destructive" 
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user_role");
    toast({ title: "Logged Out", description: "See you soon!" });
    navigate("/"); 
  };

  const getCardClasses = () => theme === "light" ? "bg-white" : "bg-[#1a1a2e]";
  const getInputClasses = () => "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all " + 
    (theme === "light" ? "border-gray-200 bg-white focus:border-[#4f6fdc]" : "border-white/20 bg-white/5 text-white focus:border-[#4f6fdc]");

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-bold">Loading Records...</div>;
  }

  return (
    <MainLayout>
      <TopNavbar title="My Profile" subtitle="Your official campus records" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        
        {/* Profile Sidebar */}
        <div className={`p-6 rounded-2xl text-center shadow-md ${getCardClasses()}`}>
          <div className="w-24 h-24 bg-[#4f6fdc] rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
             {profile.profilePicture ? (
               <img src={profile.profilePicture} className="h-full w-full object-cover" />
             ) : (
               <User className="text-white w-12 h-12" />
             )}
          </div>
          
          <h2 className="text-xl font-bold text-black">{profile.fullName || "Name Not Set"}</h2>
          <p className="text-[#4f6fdc] font-semibold">{profile.prn || "PRN Not Available"}</p>
          <p className={`text-sm mt-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            {profile.department || "Department Not Set"}
          </p>
          <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            {profile.course || "N/A"} • {profile.year || "N/A"}
          </p>
          
          <div className="mt-6 pt-6 border-t border-gray-100/10">
            <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className={`lg:col-span-2 p-6 rounded-2xl shadow-md ${getCardClasses()}`}>
          <h3 className="text-lg font-semibold mb-6">Update Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm opacity-70">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 opacity-40" size={18} />
                <input 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className={getInputClasses()} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">Username</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 opacity-40" size={18} />
                <input 
                  value={profile.username} 
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                  className={getInputClasses()} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">College Email (Locked)</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 opacity-20" size={18} />
                <input value={profile.collegeEmail} readOnly className={`${getInputClasses()} opacity-60 cursor-not-allowed`} />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">Mobile Number</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 opacity-40" size={18} />
                <input 
                  value={profile.mobileNumber} 
                  onChange={(e) => setProfile({...profile, mobileNumber: e.target.value})}
                  className={getInputClasses()} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">PRN (Locked)</label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-3 opacity-20" size={18} />
                <input value={profile.prn} readOnly className={`${getInputClasses()} opacity-60 cursor-not-allowed`} />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">Department (Locked)</label>
              <div className="relative mt-1">
                <BookOpen className="absolute left-3 top-3 opacity-20" size={18} />
                <input value={profile.department} readOnly className={`${getInputClasses()} opacity-60 cursor-not-allowed`} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-[#4f6fdc] text-white rounded-xl font-medium hover:bg-[#3d59b8] transition-all flex items-center gap-2 shadow-lg shadow-[#4f6fdc]/20"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-100/10" />

          {/* Reset Password Section */}
          <h3 className="text-lg font-semibold mb-6 text-red-500">Security: Reset Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm opacity-70">Old Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 opacity-40" size={18} />
                <input 
                  type="password"
                  placeholder="Current Password"
                  onChange={(e) => setProfile({...profile, oldPassword: e.target.value})}
                  className={getInputClasses()} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">New Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 opacity-40" size={18} />
                <input 
                  type="password"
                  placeholder="Min 6 characters"
                  onChange={(e) => setProfile({...profile, password: e.target.value})}
                  className={getInputClasses()} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-70">Confirm New</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 opacity-40" size={18} />
                <input 
                  type="password"
                  placeholder="Repeat Password"
                  onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
                  className={getInputClasses()} 
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handlePasswordReset}
              className="px-8 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Save size={18} />
              Update Password
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, Save, LogOut, Camera, Lock, Hash, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
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
        toast({ title: "Error", description: "Could not load profile", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // NEW: HANDLE SAVE LOGIC
  const handleSave = async () => {
    try {
      // Basic validation
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
          
          {/* Dynamic Format Reference: John Doe / PRN / Dept / Course • Year */}
          <h2 className="text-xl font-bold">{profile.fullName || "Name Not Set"}</h2>
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
            
            {/* Full Name - Editable */}
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

            {/* Username - Editable */}
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

            {/* Email Field - Read Only (Secure) */}
            <div>
              <label className="text-sm opacity-70">College Email (Locked)</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 opacity-20" size={18} />
                <input value={profile.collegeEmail} readOnly className={`${getInputClasses()} opacity-60 cursor-not-allowed`} />
              </div>
            </div>

            {/* Mobile Field - Editable */}
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

            {/* PRN Field - Read Only */}
            <div>
              <label className="text-sm opacity-70">PRN (Locked)</label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-3 opacity-20" size={18} />
                <input value={profile.prn} readOnly className={`${getInputClasses()} opacity-60 cursor-not-allowed`} />
              </div>
            </div>

            {/* Department Field - Read Only */}
            <div>
              <label className="text-sm opacity-70">Department (Locked)</label>
              <div className="relative mt-1">
                <BookOpen className="absolute left-3 top-3 opacity-20" size={18} />
                <input value={profile.department} readOnly className={`${getInputClasses()} opacity-60 cursor-not-allowed`} />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-[#4f6fdc] text-white rounded-xl font-medium hover:bg-[#3d59b8] transition-all flex items-center gap-2 shadow-lg shadow-[#4f6fdc]/20"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
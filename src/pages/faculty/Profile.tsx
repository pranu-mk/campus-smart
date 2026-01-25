import { useState, useRef } from "react";
import { User, Building, Mail, Phone, BadgeCheck, Camera, Lock, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Theme } from "@/pages/Index";

interface FacultyProfile {
  fullName: string;
  officeMail: string;
  mobileNumber: string;
  facultyId: string;
  department: string;
  designation: string;
  username: string;
  photo: string;
}

interface ProfileProps {
  theme?: Theme;
}

const Profile = ({ theme = "dark" }: ProfileProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<FacultyProfile>({
    fullName: "Dr. Rajesh Kumar",
    officeMail: "rajesh.kumar@college.edu",
    mobileNumber: "+91 98765 43210",
    facultyId: "FAC-2018-001",
    department: "Computer Science",
    designation: "Associate Professor",
    username: "rajesh.kumar",
    photo: "",
  });

  // Theme-based styling
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  const isLight = theme === "light";

  const cardBg = isDark ? "bg-gray-800 border-gray-700" : isFancy ? "bg-purple-900/30 border-purple-700/50" : "bg-white border-gray-200";
  const textPrimary = isDark || isFancy ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark || isFancy ? "text-gray-400" : "text-gray-500";
  const inputClass = isDark || isFancy 
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400" 
    : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400";
  
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({ ...profile, photo: event.target?.result as string });
        toast({
          title: "Photo Uploaded",
          description: "Your profile photo has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    if (passwords.new.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    setPasswords({ current: "", new: "", confirm: "" });
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Faculty Profile</h1>
        <p className={`mt-1 ${textSecondary}`}>Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className={`rounded-xl p-8 shadow-sm ${cardBg}`}>
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className={`w-32 h-32 border-4 ${isDark || isFancy ? "border-blue-500/50" : "border-blue-200"}`}>
                <AvatarImage src={profile.photo} />
                <AvatarFallback className={`text-3xl font-bold ${isDark || isFancy ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                  {profile.fullName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className={isDark || isFancy ? "border-blue-500/50 text-blue-400 hover:bg-blue-900/30" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-500">Verified Faculty</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <Input 
                    value={profile.fullName}
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-medium ${textPrimary}`}>{profile.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                  <BadgeCheck className="w-4 h-4" />
                  Faculty ID
                </label>
                <p className={`text-lg font-mono ${isDark || isFancy ? "text-blue-400" : "text-blue-600"}`}>{profile.facultyId}</p>
              </div>

              <div className="space-y-2">
                <label className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                  <Mail className="w-4 h-4" />
                  Office Mail
                </label>
                {isEditing ? (
                  <Input 
                    value={profile.officeMail}
                    onChange={(e) => setProfile({...profile, officeMail: e.target.value})}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-medium ${textPrimary}`}>{profile.officeMail}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </label>
                {isEditing ? (
                  <Input 
                    value={profile.mobileNumber}
                    onChange={(e) => setProfile({...profile, mobileNumber: e.target.value})}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-medium ${textPrimary}`}>{profile.mobileNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`text-sm flex items-center gap-2 ${textSecondary}`}>
                  <Building className="w-4 h-4" />
                  Department
                </label>
                {isEditing ? (
                  <Input 
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-medium ${textPrimary}`}>{profile.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`text-sm ${textSecondary}`}>Designation</label>
                {isEditing ? (
                  <Input 
                    value={profile.designation}
                    onChange={(e) => setProfile({...profile, designation: e.target.value})}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-medium ${textPrimary}`}>{profile.designation}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`text-sm ${textSecondary}`}>Username</label>
                {isEditing ? (
                  <Input 
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-medium ${textPrimary}`}>{profile.username}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-wrap gap-4 mt-8 pt-6 border-t ${isDark || isFancy ? "border-gray-700" : "border-gray-200"}`}>
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                className={isDark || isFancy ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="ghost"
                className={isDark || isFancy ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className={isDark || isFancy ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className={isDark || isFancy ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}>
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className={isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}>
              <DialogHeader>
                <DialogTitle className={textPrimary}>Change Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className={`text-sm mb-2 block ${textSecondary}`}>Current Password</label>
                  <Input 
                    type="password" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`text-sm mb-2 block ${textSecondary}`}>New Password</label>
                  <Input 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`text-sm mb-2 block ${textSecondary}`}>Confirm New Password</label>
                  <Input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handlePasswordChange}
                >
                  Update Password
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Card */}
      <div className={`rounded-xl p-6 shadow-sm ${cardBg}`}>
        <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Activity Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Complaints Resolved", value: 82, color: isDark || isFancy ? "text-green-400" : "text-green-600", bg: isDark || isFancy ? "bg-green-900/30" : "bg-green-50" },
            { label: "Pending Review", value: 12, color: isDark || isFancy ? "text-yellow-400" : "text-yellow-600", bg: isDark || isFancy ? "bg-yellow-900/30" : "bg-yellow-50" },
            { label: "Avg. Resolution Time", value: "2.5 days", color: isDark || isFancy ? "text-blue-400" : "text-blue-600", bg: isDark || isFancy ? "bg-blue-900/30" : "bg-blue-50" },
            { label: "Rating", value: "4.8/5", color: isDark || isFancy ? "text-indigo-400" : "text-indigo-600", bg: isDark || isFancy ? "bg-indigo-900/30" : "bg-indigo-50" },
          ].map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${stat.bg} text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className={`text-sm mt-1 ${textSecondary}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
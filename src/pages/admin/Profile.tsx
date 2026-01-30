import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Shield, Settings, LogOut, X, Save, Key, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { useUI } from '@/context/admin/UIContext';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout, addNotification, setShowSettingsModal } = useUI();
  const [showSettingsLocalModal, setShowSettingsLocalModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileSettings, setProfileSettings] = useState({
    name: 'System Administrator',
    email: 'admin@campus.edu',
    phone: '+1 234 567 8900',
    notificationsEnabled: true,
  });

  const handleSaveSettings = () => {
    addNotification({
      title: 'Profile Updated',
      message: 'Your profile settings have been saved successfully',
      type: 'success',
    });
    setShowSettingsLocalModal(false);
  };

  const handleLogout = () => {
    logout();
    addNotification({
      title: 'Logged Out',
      message: 'You have been successfully logged out',
      type: 'info',
    });
    setShowLogoutConfirm(false);
    navigate('/');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Admin Profile</h1>
      </motion.div>

      <NeonCard glowColor="purple">
        <div className="flex flex-col items-center text-center">
          <NeonAvatar initials="AD" glowColor="purple" size="lg" />
          <h2 className="text-2xl font-bold text-foreground mt-4">{profileSettings.name}</h2>
          <p className="text-neon-cyan">Super Admin Access</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-neon-green" />
            <span>All Permissions Granted</span>
          </div>
        </div>
      </NeonCard>

      <NeonCard glowColor="cyan">
        <h3 className="font-bold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-neon-cyan" />
            <span className="text-foreground">{profileSettings.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-neon-purple" />
            <span className="text-foreground">{profileSettings.phone}</span>
          </div>
        </div>
      </NeonCard>

      <div className="flex gap-4">
        <GlowButton 
          variant="cyan" 
          icon={<Settings className="w-4 h-4" />} 
          className="flex-1"
          onClick={() => setShowSettingsLocalModal(true)}
        >
          Settings
        </GlowButton>
        <GlowButton 
          variant="pink" 
          icon={<LogOut className="w-4 h-4" />}
          onClick={() => setShowLogoutConfirm(true)}
        >
          Logout
        </GlowButton>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsLocalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSettingsLocalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Profile Settings</h2>
                <button onClick={() => setShowSettingsLocalModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Full Name" 
                  placeholder="Your name"
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
                />
                <GlowInput 
                  label="Email" 
                  type="email"
                  placeholder="admin@campus.edu"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                />
                <GlowInput 
                  label="Phone" 
                  placeholder="+1 234 567 8900"
                  value={profileSettings.phone}
                  onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                />
                
                <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-neon-cyan" />
                    <span className="font-medium text-foreground">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => setProfileSettings({...profileSettings, notificationsEnabled: !profileSettings.notificationsEnabled})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      profileSettings.notificationsEnabled ? 'bg-neon-cyan' : 'bg-muted'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      profileSettings.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-5 h-5 text-neon-purple" />
                    <span className="font-medium text-foreground">Change Password</span>
                  </div>
                  <GlowButton variant="purple" size="sm" className="w-full">
                    Update Password
                  </GlowButton>
                </div>

                <div className="flex gap-3 pt-4">
                  <GlowButton 
                    variant="gradient" 
                    className="flex-1"
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowSettingsLocalModal(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm glass rounded-2xl neon-border-pink overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-xl font-bold font-orbitron text-foreground">Confirm Logout</h2>
                <p className="text-muted-foreground">Are you sure you want to logout from the admin panel?</p>
                <div className="flex gap-3 pt-2">
                  <GlowButton 
                    variant="pink" 
                    className="flex-1"
                    onClick={handleLogout}
                  >
                    Yes, Logout
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowLogoutConfirm(false)}>
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

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Bell, Shield, Palette, Globe, Database, Save } from 'lucide-react';
import { useState } from 'react';
import { useUI } from '@/context/admin/UIContext';
import { GlowButton } from '@/components/ui/GlowButton';
import { NeonCard } from '@/components/ui/NeonCard';

export function SettingsModal() {
  const { showSettingsModal, setShowSettingsModal, addNotification } = useUI();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    autoAssign: false,
    darkMode: true,
    language: 'English',
    timezone: 'UTC+5:30',
  });

  const handleSave = () => {
    addNotification({
      title: 'Settings Saved',
      message: 'Your preferences have been updated successfully',
      type: 'success',
    });
    setShowSettingsModal(false);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <AnimatePresence>
      {showSettingsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowSettingsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass rounded-2xl neon-border overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-purple/10">
                  <Settings className="w-5 h-5 text-neon-purple" />
                </div>
                <h2 className="text-xl font-bold font-orbitron text-foreground">Settings</h2>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex">
              {/* Sidebar Tabs */}
              <div className="w-48 border-r border-border/50 p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-neon-purple/10 text-neon-purple'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-6 max-h-[400px] overflow-y-auto">
                {activeTab === 'general' && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Regional Settings
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-foreground">Language</label>
                          <select 
                            value={settings.language}
                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                            className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-cyan"
                          >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-foreground">Timezone</label>
                          <select 
                            value={settings.timezone}
                            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                            className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-cyan"
                          >
                            <option>UTC+5:30</option>
                            <option>UTC+0:00</option>
                            <option>UTC-5:00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Automation
                      </h3>
                      <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div>
                          <p className="font-medium text-foreground">Auto-assign Complaints</p>
                          <p className="text-sm text-muted-foreground">Automatically assign complaints to available faculty</p>
                        </div>
                        <button
                          onClick={() => setSettings({...settings, autoAssign: !settings.autoAssign})}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.autoAssign ? 'bg-neon-cyan' : 'bg-muted'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            settings.autoAssign ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Notification Preferences
                    </h3>
                    <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-neon-cyan' : 'bg-muted'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div>
                        <p className="font-medium text-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, pushNotifications: !settings.pushNotifications})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.pushNotifications ? 'bg-neon-cyan' : 'bg-muted'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Security Settings
                    </h3>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      <GlowButton variant="cyan" size="sm">Enable 2FA</GlowButton>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
                      <p className="font-medium text-foreground">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                      <GlowButton variant="purple" size="sm">Change Password</GlowButton>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Theme Settings
                    </h3>
                    <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div>
                        <p className="font-medium text-foreground">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Use dark theme for the dashboard</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.darkMode ? 'bg-neon-cyan' : 'bg-muted'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 flex justify-end gap-3">
              <GlowButton variant="purple" onClick={() => setShowSettingsModal(false)}>
                Cancel
              </GlowButton>
              <GlowButton variant="gradient" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                Save Changes
              </GlowButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

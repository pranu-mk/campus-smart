import { motion } from 'framer-motion';
import { Bell, Search, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { useUI } from '@/context/admin/UIContext';

interface NavbarProps {
  sidebarCollapsed: boolean;
}

export function Navbar({ sidebarCollapsed }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { setShowNotificationsDrawer, setShowSettingsModal, notifications } = useUI();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 right-0 h-16 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-neon-cyan/20 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <motion.div
            className={`relative flex items-center ${
              searchFocused ? 'ring-2 ring-neon-cyan/30' : ''
            } rounded-lg transition-all duration-300`}
          >
            <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg 
                       text-sm text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:border-neon-cyan/50 focus:bg-muted
                       transition-all duration-300"
            />
            <kbd className="absolute right-3 px-2 py-0.5 text-xs bg-background/50 border border-border rounded text-muted-foreground">
              ⌘K
            </kbd>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotificationsDrawer(true)}
            className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-neon-pink text-white rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Profile */}
          <Link to="/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <NeonAvatar initials="AD" glowColor="purple" size="sm" />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
    </motion.header>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageSquareWarning,
  HeadphonesIcon,
  Building2,
  Search,
  Calendar,
  Users2,
  Vote,
  Briefcase,
  Bell,
  BarChart3,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
  { id: 'students', label: 'Students', icon: GraduationCap, path: '/dashboard/admin/students' },
  { id: 'faculty', label: 'Faculty', icon: Users, path: '/dashboard/admin/faculty' },
  { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning, path: '/dashboard/admin/complaints' },
  { id: 'helpdesk', label: 'Helpdesk', icon: HeadphonesIcon, path: '/dashboard/admin/helpdesk' },
  { id: 'hostel', label: 'Hostel', icon: Building2, path: '/dashboard/admin/hostel' },
  { id: 'lost-found', label: 'Lost & Found', icon: Search, path: '/dashboard/admin/lost-found' },
  { id: 'events', label: 'Events', icon: Calendar, path: '/dashboard/admin/events' },
  { id: 'clubs', label: 'Clubs', icon: Users2, path: '/dashboard/admin/clubs' },
  { id: 'polls', label: 'Polls', icon: Vote, path: '/dashboard/admin/polls' },
  { id: 'placement', label: 'Placement', icon: Briefcase, path: '/dashboard/admin/placement' },
  { id: 'notices', label: 'Notices', icon: Bell, path: '/dashboard/admin/notices' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/dashboard/admin/reports' },
  { id: 'profile', label: 'Profile', icon: UserCircle, path: '/dashboard/admin/profile' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'fixed left-0 top-0 h-screen z-50 flex flex-col',
        'bg-slate-900/95 backdrop-blur-sm border-r border-neon-cyan/20',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan">
            <Zap className="w-6 h-6 text-background" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold font-orbitron gradient-text-aurora">
                  NEXUS
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Admin Panel
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          // Check if current path matches the menu item path or starts with it
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard/admin' && location.pathname.startsWith(item.path));
          const isHovered = hoveredItem === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.div
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'transition-all duration-200',
                  isActive 
                    ? 'bg-neon-cyan/10 text-neon-cyan' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-cyan rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Hover glow */}
                {(isHovered || isActive) && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/5 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <item.icon className={cn(
                  'w-5 h-5 flex-shrink-0 relative z-10',
                  isActive && 'text-glow-cyan'
                )} />
                
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {collapsed && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-2 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-xl z-50 whitespace-nowrap"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <motion.button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg',
            'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            'transition-all duration-200'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Neon glow line on the right edge */}
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/50 to-transparent" />
    </motion.aside>
  );
}

import { useState } from "react";
import { 
  LayoutDashboard, 
  FileWarning, 
  HeadphonesIcon, 
  Calendar, 
  Bell, 
  Users, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import LogoutModal from "@/components/modals/faculty/LogoutModal";
import type { Theme } from "@/pages/Index";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: Theme;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "complaints", label: "Complaints", icon: FileWarning },
  { id: "helpdesk", label: "Helpdesk", icon: HeadphonesIcon },
  { id: "events", label: "Events", icon: Calendar },
  { id: "notices", label: "Notices", icon: Bell },
  { id: "students", label: "Students", icon: Users },
];

// Theme-based sidebar colors
const getSidebarColors = (theme: Theme) => {
  if (theme === "light") {
    return {
      bg: "#4A3728", // Slightly lighter dark brown-orange
      border: "#6B4F3A",
      text: "#FFF7ED",
      icon: "#FBBF24", // Yellow icon
      hoverBg: "#5C4633",
      hoverText: "#FEF3C7",
      activeBg: "#D97706", // Orange active
      activeText: "#FFFFFF",
      activeIcon: "#FFFFFF",
      toggleBg: "#6B4F3A",
    };
  }
  // Dark and Fancy themes use the same orange-yellow dark professional tone
  return {
    bg: "#3D2914", // Dark orange-brown base
    border: "#5C4020", // Muted yellow-brown border
    text: "#FFF7ED",
    icon: "#FBBF24", // Yellow icon
    hoverBg: "#4A3520",
    hoverText: "#FEF3C7",
    activeBg: "#D97706", // Orange active
    activeText: "#FFFFFF",
    activeIcon: "#FFFFFF",
    toggleBg: "#5C4020",
  };
};

const Sidebar = ({ activeTab, onTabChange, theme }: SidebarProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colors = getSidebarColors(theme);

  return (
    <>
      <aside 
        className={`fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50 ${
          isCollapsed ? "w-[70px]" : "w-[250px]"
        }`}
        style={{ 
          backgroundColor: colors.bg,
          borderRight: `1px solid ${colors.border}`
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: colors.border }}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.activeBg }}
              >
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-lg font-semibold" style={{ color: colors.text }}>Faculty Panel</span>
            </div>
          )}
          {isCollapsed && (
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto"
              style={{ backgroundColor: colors.activeBg }}
            >
              <span className="text-white font-bold text-lg">F</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={{ 
            backgroundColor: colors.toggleBg,
            color: colors.text
          }}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isCollapsed ? "justify-center" : ""
                }`}
                style={{
                  backgroundColor: isActive ? colors.activeBg : "transparent",
                  color: isActive ? colors.activeText : colors.text,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                    e.currentTarget.style.color = colors.hoverText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.text;
                  }
                }}
              >
                <Icon 
                  className="w-5 h-5 flex-shrink-0" 
                  style={{ color: isActive ? colors.activeIcon : colors.icon }}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-1 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={() => onTabChange("profile")}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
            style={{
              backgroundColor: activeTab === "profile" ? colors.activeBg : "transparent",
              color: activeTab === "profile" ? colors.activeText : colors.text,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "profile") {
                e.currentTarget.style.backgroundColor = colors.hoverBg;
                e.currentTarget.style.color = colors.hoverText;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "profile") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.text;
              }
            }}
          >
            <User 
              className="w-5 h-5 flex-shrink-0" 
              style={{ color: activeTab === "profile" ? colors.activeIcon : colors.icon }}
            />
            {!isCollapsed && <span className="font-medium text-sm">Profile</span>}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
            style={{ color: colors.text }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hoverBg;
              e.currentTarget.style.color = colors.hoverText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.text;
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" style={{ color: colors.icon }} />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </>
  );
};

export default Sidebar;
import { useState } from "react";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LogoutModal from "@/components/modals/faculty/LogoutModal";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "complaints", label: "Complaints" },
  { id: "helpdesk", label: "Helpdesk" },
  { id: "events", label: "Events" },
  { id: "notices", label: "Notices" },
  { id: "students", label: "Students" },
];

const TopNavigation = ({ activeTab, onTabChange, onProfileClick }: TopNavigationProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const notificationCount = 5;

  return (
    <>
      <nav className="glass-card border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-primary font-bold text-lg">F</span>
              </div>
              <span className="text-lg font-semibold text-foreground">Faculty Panel</span>
            </div>

            {/* Center Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive border-none">
                    {notificationCount}
                  </Badge>
                )}
              </button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors outline-none">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">DR</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">Dr. Rajesh Kumar</span>
                    <span className="text-xs text-muted-foreground">Computer Science</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
                  <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    onClick={() => setShowLogoutModal(true)} 
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </>
  );
};

export default TopNavigation;

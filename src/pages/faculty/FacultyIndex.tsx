import { useState } from "react";
import Sidebar from "@/components/layout/faculty/Sidebar";
import TopHeader from "@/components/layout/faculty/TopHeader";
import Dashboard from "@/pages/faculty/FacultyDashboard";
import Complaints from "@/pages/faculty/Complaints";
import Helpdesk from "@/pages/faculty/Helpdesk";
import Events from "@/pages/faculty/Events";
import Notices from "@/pages/faculty/Notices";
import Students from "@/pages/faculty/Students";
import Profile from "@/pages/faculty/Profile";

export type Theme = "dark" | "light" | "fancy";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState<Theme>("dark");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard theme={theme} />;
      case "complaints":
        return <Complaints theme={theme} />;
      case "helpdesk":
        return <Helpdesk theme={theme} />;
      case "events":
        return <Events theme={theme} />;
      case "notices":
        return <Notices theme={theme} />;
      case "students":
        return <Students theme={theme} />;
      case "profile":
        return <Profile theme={theme} />;
      default:
        return <Dashboard theme={theme} />;
    }
  };

  // Theme-based classes for the entire app
  const getAppContainerClass = () => {
    if (theme === "dark") return "bg-gray-900";
    if (theme === "fancy") return "bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900";
    return "bg-gray-50";
  };

  const getMainBgClass = () => {
    if (theme === "dark") return "bg-gray-800";
    if (theme === "fancy") return "bg-purple-950/50";
    return "bg-white";
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${getAppContainerClass()}`} data-theme={theme}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        theme={theme}
      />
      <div className="flex-1 ml-[250px] transition-all duration-300" style={{ marginLeft: "250px" }}>
        <TopHeader theme={theme} onThemeChange={setTheme} />
        <main className={`p-6 min-h-[calc(100vh-64px)] transition-colors duration-300 ${getMainBgClass()}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
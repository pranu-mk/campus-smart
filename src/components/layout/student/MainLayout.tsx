import { ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { useStudentDashboardTheme } from "@/context/StudentDashboardThemeContext";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme } = useStudentDashboardTheme();

  const getBackgroundClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-[#0f0f1a]";
      case "fancy":
        return "bg-gradient-to-br from-[#0a0a14] via-[#0f1629] to-[#1a1a2e]";
      default:
        return "bg-gradient-to-br from-[#f8fafc] via-[#f0f4f9] to-[#e8eef7]";
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getBackgroundClasses()}`}>
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="ml-64 min-h-screen"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default MainLayout;

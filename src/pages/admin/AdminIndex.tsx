import { useLocation } from "react-router-dom";
import { UIProvider } from "@/context/admin/UIContext";
import { DashboardLayout } from "@/components/layout/admin/DashboardLayout";
import { DashboardPage } from "@/pages/admin/Dashboard";
import { ComplaintsPage } from "@/pages/admin/Complaints";
import { StudentsPage } from "@/pages/admin/Students";
import { FacultyPage } from "@/pages/admin/Faculty";
import { EventsPage } from "@/pages/admin/Events";
import { NoticesPage } from "@/pages/admin/Notices";
import { LostFoundPage } from "@/pages/admin/LostFound";
import { PlacementPage } from "@/pages/admin/Placement";
import { PollsPage } from "@/pages/admin/Polls";
import { HelpdeskPage } from "@/pages/admin/Helpdesk";
import { HostelPage } from "@/pages/admin/Hostel";
import { ReportsPage } from "@/pages/admin/Reports";
import { ProfilePage } from "@/pages/admin/Profile";
import { ClubsPage } from "@/pages/admin/Clubs";

const AdminDashboardContent = () => {
  const location = useLocation();

  const renderContent = () => {
    // Extract the path after '/dashboard/admin'
    const path = location.pathname.replace("/dashboard/admin", "") || "/";

    switch (path) {
      case "/":
      case "":
        return <DashboardPage />;
      case "/complaints":
        return <ComplaintsPage />;
      case "/students":
        return <StudentsPage />;
      case "/faculty":
        return <FacultyPage />;
      case "/events":
        return <EventsPage />;
      case "/notices":
        return <NoticesPage />;
      case "/lost-found":
        return <LostFoundPage />;
      case "/placement":
        return <PlacementPage />;
      case "/polls":
        return <PollsPage />;
      case "/helpdesk":
        return <HelpdeskPage />;
      case "/hostel":
        return <HostelPage />;
      case "/reports":
        return <ReportsPage />;
      case "/profile":
        return <ProfilePage />;
      case "/clubs":
        return <ClubsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
};

const Index = () => {
  return (
    <UIProvider>
      <AdminDashboardContent />
    </UIProvider>
  );
};

export default Index;
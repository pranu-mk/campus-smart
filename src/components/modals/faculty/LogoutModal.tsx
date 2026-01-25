import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const handleLogout = () => {
    // Clear any auth tokens/session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Close modal
    onClose();
    
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center text-gray-800">
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-500">
            Are you sure you want to log out of the Faculty Panel? 
            You will need to sign in again to access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-3">
          <AlertDialogCancel className="bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;

import { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Faculty, Complaint, Event, Club, Poll, LostItem, PlacementDrive, Notice, HostelComplaint } from '@/data/admin/dummyData';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface UIContextType {
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  showNotificationsDrawer: boolean;
  setShowNotificationsDrawer: (show: boolean) => void;
  
  // Global Settings
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  
  // Admin state
  isLoggedIn: boolean;
  logout: () => void;
  
  // Selected entities for cross-module actions
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  selectedFaculty: Faculty | null;
  setSelectedFaculty: (faculty: Faculty | null) => void;
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (complaint: Complaint | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N001',
      title: 'New Critical Complaint',
      message: 'Cafeteria food quality issue reported with high priority',
      type: 'error',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 'N002',
      title: 'Placement Drive Reminder',
      message: 'Google placement drive registration deadline is approaching',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 'N003',
      title: 'Complaint Resolved',
      message: 'WiFi connectivity issue has been resolved',
      type: 'success',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: 'N004',
      title: 'New Event Created',
      message: 'Tech Fest 2024 has been added to the calendar',
      type: 'info',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
  ]);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `N${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const logout = () => {
    setIsLoggedIn(false);
    // In a real app, this would redirect to login
    setTimeout(() => {
      setIsLoggedIn(true); // Reset for demo
    }, 2000);
  };

  return (
    <UIContext.Provider
      value={{
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        showNotificationsDrawer,
        setShowNotificationsDrawer,
        showSettingsModal,
        setShowSettingsModal,
        isLoggedIn,
        logout,
        selectedStudent,
        setSelectedStudent,
        selectedFaculty,
        setSelectedFaculty,
        selectedComplaint,
        setSelectedComplaint,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

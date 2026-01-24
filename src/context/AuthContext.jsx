import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // STEP 1: Initialize state from localStorage to prevent "blank on reload"
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_data");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      return null;
    }
  });

  // STEP 2: Update both State and LocalStorage on login
  const login = (userData) => {
    // Expected structure based on your SQL: 
    // { id, role, full_name, prn, department, profile_picture }
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  // STEP 3: Clear everything on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
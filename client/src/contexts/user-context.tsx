import { createContext, useContext, useState, ReactNode } from "react";

export type UserType = "student" | "teacher" | null;

interface UserContextType {
  userType: UserType;
  isAuthenticated: boolean;
  setUserData: (type: UserType, authenticated: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Check for stored user data in localStorage
  const storedUserType = localStorage.getItem("userType") as UserType;
  const storedAuth = localStorage.getItem("isAuthenticated") === "true";

  const [userType, setUserType] = useState<UserType>(storedUserType);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storedAuth);

  const setUserData = (type: UserType, authenticated: boolean) => {
    setUserType(type);
    setIsAuthenticated(authenticated);
    
    // Store in localStorage for persistence
    localStorage.setItem("userType", type || "");
    localStorage.setItem("isAuthenticated", authenticated.toString());
  };

  const logout = () => {
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userType");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <UserContext.Provider value={{ userType, isAuthenticated, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

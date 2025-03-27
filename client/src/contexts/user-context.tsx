import { createContext, useContext, useState, ReactNode } from "react";

export type UserType = "student" | "teacher" | null;

interface UserContextType {
  userType: UserType;
  isAuthenticated: boolean;
  token?: string;
  setUserData: (type: UserType, authenticated: boolean, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Check for stored user data in localStorage
  const storedUserType = localStorage.getItem("userType") as UserType;
  const storedAuth = localStorage.getItem("isAuthenticated") === "true";

  const [userType, setUserType] = useState<UserType>(storedUserType);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storedAuth);

  const [_token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const setUserData = (type: UserType, authenticated: boolean, token: string) => {
    setUserType(type);
    setIsAuthenticated(authenticated);
    setToken(token);
    
    // Store in localStorage for persistence
    localStorage.setItem("userType", type || "");
    localStorage.setItem("isAuthenticated", authenticated.toString());
    localStorage.setItem("token", token || "");
  };

  const logout = () => {
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userType");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
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

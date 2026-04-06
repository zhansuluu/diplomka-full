/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, studentService, companyService, resolveUserFromAccessToken } from "../api";
import type { StudentResponse, CompanyResponse } from "../api/types";

export type UserRole = "student" | "company" | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole;
  user: StudentResponse | CompanyResponse | null;
  login: (
    email: string,
    password: string,
    expectedRole?: "student" | "company"
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: StudentResponse | CompanyResponse | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<StudentResponse | CompanyResponse | null>(null);

  // Restore session from JWT (and sync userRole / userId). GuestRoute needs isAuthenticated + userRole.
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { role, user } = await resolveUserFromAccessToken(token);
        setUser(user);
        setUserRole(role);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", user.id);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to restore auth state:", err);
        authService.logout();
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    expectedRole?: "student" | "company"
  ) => {
    try {
      const response = await authService.login({ email, password });
      authService.setToken(response.accessToken);

      const { role, user } = await resolveUserFromAccessToken(
        response.accessToken,
        email
      );

      if (expectedRole && role !== expectedRole) {
        authService.logout();
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        throw new Error(
          expectedRole === "student"
            ? "This account is not a student account. Use company login."
            : "This account is not a company account. Use student login."
        );
      }

      setUser(user);
      setUserRole(role);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", user.id);
      setIsAuthenticated(true);
    } catch (err) {
      authService.logout();
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      throw err;
    }
  };

  const refreshUser = async () => {
    const id = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole") as UserRole;
    if (!id || !role || (role !== "student" && role !== "company")) return;
    if (role === "student") {
      const studentData = await studentService.getStudent(id);
      setUser(studentData);
    } else {
      const companyData = await companyService.getCompany(id);
      setUser(companyData);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    try {
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userRole,
        user,
        login,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Alias for compatibility
export const useAuthContext = useAuth;

import { useState, useCallback } from "react";
import { authService, studentService, companyService, resolveUserFromAccessToken } from "../api";
import type { StudentResponse, CompanyResponse, CreateStudentRequest, CreateCompanyRequest } from "../api/types";

export type UserRole = "student" | "company";

interface UseAuthReturnType {
  login: (email: string, password: string) => Promise<{
    role: UserRole;
    user: StudentResponse | CompanyResponse;
  }>;
  signup: (data: CreateStudentRequest | CreateCompanyRequest, role: UserRole) => Promise<StudentResponse | CompanyResponse>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export function useAuthApi(): UseAuthReturnType {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login({ email, password });
        authService.setToken(response.accessToken);
        const { role, user } = await resolveUserFromAccessToken(
          response.accessToken,
          email
        );
        return { role: role as UserRole, user };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(async (data: CreateStudentRequest | CreateCompanyRequest, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      if (role === "student") {
        const response = await studentService.createStudent(data as CreateStudentRequest);
        // Auto-login after signup
        await login((data as CreateStudentRequest).email, (data as CreateStudentRequest).password);
        return response;
      } else {
        const response = await companyService.createCompany(data as CreateCompanyRequest);
        // Auto-login after signup
        await login((data as CreateCompanyRequest).email, (data as CreateCompanyRequest).password);
        return response;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    authService.logout();
    setError(null);
  }, []);

  return { login, signup, logout, isLoading, error };
}

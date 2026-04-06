import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: ReactNode;
  /** Override default dashboard redirect (e.g. after OAuth). */
  redirectTo?: string;
};

/**
 * “Middleware” for login/signup routes: only guests see the page.
 * Authenticated users are sent to the correct dashboard.
 */
export function GuestRoute({ children, redirectTo }: Props) {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9FF]">
        <p className="text-gray-600 text-sm">Loading…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    if (userRole === "company") {
      return <Navigate to="/company/dashboard" replace />;
    }
    if (userRole === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function CompanyAuthOutlet() {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9FF]">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace state={{ from: location.pathname }} />;
  }

  if (userRole !== "company") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

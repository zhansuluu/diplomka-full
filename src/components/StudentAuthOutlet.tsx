import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/** Вся зона /student только для авторизованного студента; гости → /landing. */
export function StudentAuthOutlet() {
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

  if (userRole !== "student") {
    return <Navigate to="/company/dashboard" replace />;
  }

  return <Outlet />;
}

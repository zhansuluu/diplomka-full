import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, resolveUserFromAccessToken } from "../../api";

export const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const role = urlParams.get('role');
    const error = urlParams.get('error');

    if (error) {
      navigate(role === "company" ? '/login/company' : '/login/student', {
        state: { error: 'Google authentication failed' },
      });
      return;
    }

    if (mode === "local-google") {
      const email =
        role === "company" ? "company@caseup.local" : "student@caseup.local";
      const password = role === "company" ? "company123" : "student123";

      authService
        .login({ email, password })
        .then(async (response) => {
          authService.setToken(response.accessToken);
          const resolved = await resolveUserFromAccessToken(response.accessToken, email);
          localStorage.setItem("userRole", resolved.role);
          localStorage.setItem("userId", resolved.user.id);
          navigate(
            resolved.role === "company" ? "/company/dashboard" : "/student/dashboard",
            { replace: true }
          );
        })
        .catch(() => {
          navigate(role === "company" ? '/login/company' : '/login/student', {
            replace: true,
          });
        });
      return;
    }

    navigate('/landing', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FBF9FF] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D0CA0] mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google authentication...</p>
      </div>
    </div>
  );
};

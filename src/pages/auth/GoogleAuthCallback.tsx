import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      // Handle error - redirect to login with error message
      navigate('/login', { state: { error: 'Google authentication failed' } });
      return;
    }

    if (code) {
      // TODO: Send code to backend for token exchange
      console.log('Authorization code:', code);

      // For now, just redirect to dashboard
      // In real implementation, exchange code for tokens and authenticate user
      navigate('/student/dashboard');
    } else {
      navigate('/login');
    }
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
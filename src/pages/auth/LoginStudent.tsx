import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { Loader } from "lucide-react";

export const LoginStudent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, "student");
      // Small delay to ensure AuthContext has updated
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Replace with your actual Google OAuth client ID
    const clientId = 'your-google-client-id.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const scope = encodeURIComponent('openid email profile');
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent`;
    
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-[#FBF9FF] flex items-center justify-center relative overflow-hidden animate-fadeIn">

      <div className="w-full max-w-[950px] grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">

        {/* LEFT SIDE */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_black] p-6 relative">

          <span className="bg-[#5D0CA0] text-white text-xs px-3 py-1 inline-block mb-6 border-2 border-black">
            FOR STUDENTS
          </span>

          <h1 className="text-4xl font-bold mb-6">
            Start Learning
            <br />
            With AI
          </h1>

          <p className="text-gray-700 mb-8">
            Join virtual internships from top companies.
            <br />
            Learn real skills. Build your career.
          </p>

          <div className="space-y-6">
            <Feature
              color="bg-yellow-400"
              title="AI-Powered Learning"
              text="Personalized internship experience"
            />
            <Feature
              color="bg-[#6BCF7F]"
              title="Real Projects"
              text="Work on actual company challenges"
            />
            <Feature
              color="bg-pink-400"
              title="Certificates"
              text="Earn verified completion certificates"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_black] p-6">
          
          <h2 className="text-2xl font-bold mb-6">Student Login</h2>

          <div className="border-2 border-black p-3 flex justify-between items-center mb-6">
            <span className="text-sm">Looking for company access?</span>
            <Link
              to="/login/company"
              className="bg-black text-white px-4 py-1 text-xs"
            >
              COMPANY LOGIN
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 p-3 mb-6 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-xs font-bold tracking-wide">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black p-3 mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wide">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 mt-1 focus:outline-none"
              />
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="border-2 border-black" />
                Remember me
              </label>
              <Link to="/forgot-password" className="underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5D0CA0] text-white py-3 border-2 border-black shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t-2 border-black" />
            <span className="px-3 text-sm">OR</span>
            <div className="flex-1 border-t-2 border-black" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full border-2 border-black py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            GOOGLE
          </button>

          <p className="text-center text-sm mt-6">
            New here?{" "}
            <Link to="/signup" className="underline">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

const Feature = ({
  color,
  title,
  text,
}: {
  color: string;
  title: string;
  text: string;
}) => (
  <div className="flex gap-4">
    <div className="relative">
      <div className={`w-8 h-8 ${color} border-[3px] border-black flex items-center justify-center
        shadow-[3px_3px_0px_black]`}>
        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  </div>
);

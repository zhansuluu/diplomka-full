import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUpChoice = () => {
  const [role, setRole] = useState<"student" | "company" | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!role) return;

    if (role === "student") {
      setShowWarning(false);
      navigate("/signup/student");
    } else {
      setShowWarning(false);
      navigate("/signup/company");
    }
  };
  const handleLoginClick = () => {
    if (!role) {
      setShowWarning(true);
      return;
    }

    if (role === "student") {
      setShowWarning(false);
      navigate("/login/student");
    } else {
      setShowWarning(false);
      navigate("/login/company");
    }
  };

  return (
    <div className="min-h-screen bg-[#EDECF2] flex flex-col items-center py-16 px-4">

      {/* Header */}
      <h1 className="text-5xl font-semibold mb-4">Join CaseUp</h1>
      <p className="text-gray-600 mb-12">
        Choose your path. It's 100% free.
      </p>

      {/* Cards */}
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-4xl">

        {/* Student Card */}
        <div
          onClick={() => {
            setRole("student");
            setShowWarning(false);
          }}
          className={`flex-1 bg-white border-2 p-10 cursor-pointer transition-all
            ${role === "student"
              ? "border-black shadow-[8px_8px_0px_black]"
              : "border-black shadow-[4px_4px_0px_black]"}
          `}
        >
          <div
            className={`w-14 h-14 border-2 border-black flex items-center justify-center mb-6
              ${role === "student" ? "bg-[#5D0CA0] text-white" : ""}
            `}
          >
            🎓
          </div>

          <h2 className="text-2xl font-semibold mb-4">I'm a Student</h2>

          <p className="text-gray-700 mb-6">
            Join virtual internships. Learn from real projects. Build your portfolio.
          </p>

          <div className="space-y-4">
            {[
              "Access 500+ internships",
              "AI-powered learning",
              "Earn certificates",
            ].map((text) => (
              <div key={text} className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-[#6BCF7F] border-2 border-black flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-800">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Card */}
        <div
          onClick={() => {
            setRole("company");
            setShowWarning(false);
          }}
          className={`flex-1 bg-white border-2 p-10 cursor-pointer transition-all
            ${role === "company"
              ? "border-black shadow-[8px_8px_0px_black]"
              : "border-black shadow-[4px_4px_0px_black]"}
          `}
        >
          <div
            className={`w-14 h-14 border-2 border-black flex items-center justify-center mb-6
              ${role === "company" ? "bg-[#5D0CA0] text-white" : ""}
            `}
          >
            🏢
          </div>

          <h2 className="text-2xl font-semibold mb-4">I'm a Company</h2>

          <p className="text-gray-700 mb-6">
            Create virtual internships. Find skilled talent. Build your team faster.
          </p>

          <div className="space-y-4">
            {[
              "Post unlimited internships",
              "AI candidate matching",
              "Real-time analytics",
            ].map((text) => (
              <div key={text} className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-[#5D0CA0] border-2 border-black flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-800">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        disabled={!role}
        onClick={handleContinue}
        className={`mt-8 w-full max-w-4xl py-4 border-2 border-black text-lg tracking-widest transition-all
          ${role
            ? "bg-black text-white "
            : "bg-gray-300 text-gray-500 cursor-not-allowed"}
        `}
      >
        CONTINUE TO SIGN UP
      </button>

      {/* Warning */}
      {showWarning && (
        <div className="mt-6 w-full max-w-5xl border-2 border-black bg-[#6BCF7F] px-4 py-3 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span className="font-medium">
            You need to choose a role first.
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="w-full max-w-4xl border-t-2 border-black mt-8 pt-6 text-center">
        <p className="text-gray-700">
          Already have an account?{" "}
          <span
            onClick={handleLoginClick}
            className="underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

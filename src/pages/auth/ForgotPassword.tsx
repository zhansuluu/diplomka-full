import { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWarning(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9FF] p-6 flex items-center justify-center">

      <div className="flex flex-col items-center w-full">

        {/* Main Card */}
        <div className="bg-white border-2 border-black p-9 w-full max-w-[650px] shadow-[12px_12px_0px_black]">

          {/* Label */}
          <span className="border-2 border-black px-4 py-2 text-xs inline-block mb-8">
            PASSWORD RESET
          </span>

          {/* Title */}
          <h1 className="text-4xl mb-4">Forgot Password?</h1>

          <p className="text-gray-700 mb-10">
            No worries! Enter your email and we'll send you reset instructions.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-[8px]">

                <div>
                    <label className="text-xs tracking-widest block mb-2">
                    EMAIL ADDRESS
                    </label>
                    <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-black p-4 bg-white focus:outline-none"
                    />
                </div>

                {/* Warning */}
                {showWarning && (
                    <div className="border-2 border-black bg-[#6BCF7F] px-4 py-1 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">
                        Email not found in our system
                    </span>
                    </div>
                )}

                </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 border-2 border-black shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition"
            >
              SEND RESET LINK
            </button>
          </form>

          <div className="border-t-2 border-black my-8" />

          <div className="text-center text-sm">
            <Link to="/login/company" className="hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Bottom Color Bars */}
        <div className="mt-12 flex gap-6">
          <div className="w-50 h-4 bg-yellow-400 border-2 border-black" />
          <div className="w-50 h-4 bg-purple-700 border-2 border-black" />
          <div className="w-50 h-4 bg-[#6BCF7F] border-2 border-black" />
        </div>

      </div>
    </div>
  );
};
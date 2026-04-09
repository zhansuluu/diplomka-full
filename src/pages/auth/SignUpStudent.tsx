import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentService } from "../../api";
import { Loader } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";

export const SignUpStudent = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");

    if (!fullName || !email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    try {
      await studentService.createStudent({
        firstName,
        lastName: lastName || "Student",
        email,
        password: form.password,
        contactEmail: email,
        skills: [],
      });
      await login(email, form.password, "student");
      navigate("/student/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9FF] p-5 flex flex-col items-center">

      {/* Wrapper для выравнивания кнопки и карточки */}
      <div className="w-full max-w-[700px] flex flex-col">

        {/* Back Button слева */}
        <Link
          to="/signup"
          className="border-2 border-black px-4 py-2 mb-6 bg-white text-sm w-fit"
        >
          ← BACK TO SELECTION
        </Link>

        {/* Main Card */}
        <div className="w-full bg-white border-2 border-black shadow-[8px_8px_0px_black]">

        {/* Purple Header */}
        <div className="bg-purple-800 text-white px-8 py-6 border-b-2 border-black">

        <div className="flex items-start gap-3">

            {/* Icon */}
            <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-lg mt-[2px]">
            🎓
            </div>

            {/* Two-line block */}
            <div>
            <p className="text-[10px] tracking-widest uppercase leading-none">
                STUDENT ACCOUNT
            </p>

            <h1 className="text-2xl font-semibold leading-tight mt-[2px]">
                Create Your Profile
            </h1>
            </div>

        </div>

        {/* Subtitle */}
        <p className="text-sm mt-3 leading-tight">
            Start your journey to real-world experience
        </p>

        </div>

          {/* Form Body */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-300 p-4 mb-6 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Обёртка с гапом */}
              <div className="flex flex-col gap-5">

                {/* Full Name */}
                <div>
                  <label className="text-xs tracking-widest block mb-2 font-bold">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border-2 border-black p-3 bg-white focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs tracking-widest block mb-2 font-bold">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@university.edu"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border-2 border-black p-3 bg-white focus:outline-none"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    We recommend using your university email
                  </p>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">

                  <div>
                    <label className="text-xs tracking-widest block mb-2">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-widest block mb-2">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 bg-white focus:outline-none"
                    />
                  </div>

                </div>

                {/* Terms */}
                <div className="border-2 border-black p-3 flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className="border-2 border-black"
                  />
                  <p className="text-sm">
                    I agree to the{" "}
                    <span className="underline">Terms of Service</span>{" "}
                    and{" "}
                    <span className="underline">Privacy Policy</span>
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-800 text-white py-3 border-2 border-black shadow-[6px_6px_0px_black] hover:translate-y-[2px] hover:shadow-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader size={20} className="animate-spin" />}
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>

              </div>
            </form>

            {/* Divider */}
            <div className="border-t-2 border-black mt-8 pt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login/student" className="underline">
                Log In
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Color Bars */}
      <div className="mt-10 flex gap-6">
        <div className="w-54 h-4 bg-purple-800 border-2 border-black" />
        <div className="w-54 h-4 bg-green-400 border-2 border-black" />
        <div className="w-54 h-4 bg-yellow-400 border-2 border-black" />
      </div>

    </div>
  );
};

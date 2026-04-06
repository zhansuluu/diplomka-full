import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { companyService } from "../../api";
import { Loader } from "lucide-react";

const REQUIRED_MSG = "Please fill in all required fields.";

export const SignUpCompany = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    industry: "",
    description: "",
    websiteUrl: "",
    contactPerson: "",
    contactEmail: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const companyName = form.companyName.trim();
    const email = form.email.trim();
    const industry = form.industry.trim();
    const description = form.description.trim();
    const websiteUrl = form.websiteUrl.trim();
    const contactPerson = form.contactPerson.trim();
    const contactEmail = form.contactEmail.trim();

    if (
      !companyName ||
      !email ||
      !industry ||
      !description ||
      !websiteUrl ||
      !contactPerson ||
      !contactEmail
    ) {
      setError(REQUIRED_MSG);
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
      await companyService.createCompany({
        email,
        password: form.password,
        companyName,
        description,
        industry,
        headquarters: "N/A",
        foundedYear: new Date().getFullYear(),
        companySize: "1–10",
        websiteUrl,
        contactPerson,
        contactEmail,
        contactPhone: "N/A",
        focusAreas: [],
      });

      navigate("/login/company");
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

      <div className="w-full max-w-[700px] flex flex-col">

        <Link
          to="/signup"
          className="border-2 border-black px-4 py-2 mb-6 bg-white text-sm w-fit"
        >
          ← BACK TO SELECTION
        </Link>

        <div className="w-full bg-white border-2 border-black shadow-[8px_8px_0px_black]">

        <div className="bg-[#6BCF7F] text-black px-8 py-6 border-b-2 border-black">

        <div className="flex items-start gap-3">

            <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-lg mt-[2px]">
            🏢
            </div>

            <div>
            <p className="text-[10px] tracking-widest uppercase leading-none">
                COMPANY ACCOUNT
            </p>

            <h1 className="text-2xl font-semibold leading-tight mt-[2px]">
                Register your company
            </h1>
            </div>

        </div>

        <p className="text-sm mt-3 leading-tight">
            All fields below are required to complete registration.
        </p>

        </div>

          <div className="p-8">

            {error && (
              <div className="bg-red-50 border-2 border-red-300 p-4 mb-6 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="flex flex-col gap-5">

                <Field
                  label="COMPANY NAME *"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                />

                <Field
                  label="INDUSTRY *"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="FinTech, EdTech, …"
                />

                <div>
                  <label className="text-xs tracking-widest block mb-2 font-bold">
                    DESCRIPTION *
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Brief description of your company and what you do"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-black p-3 bg-white focus:outline-none resize-y min-h-[100px]"
                  />
                </div>

                <Field
                  label="WEBSITE URL *"
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  type="url"
                />

                <Field
                  label="WORK EMAIL (LOGIN) *"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  type="email"
                />

                <Field
                  label="CONTACT PERSON *"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                />

                <Field
                  label="CONTACT EMAIL *"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  type="email"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">

                  <div>
                    <label className="text-xs tracking-widest block mb-2">
                      PASSWORD *
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full border-2 border-black p-3 bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-widest block mb-2">
                      CONFIRM PASSWORD *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black p-3 bg-white focus:outline-none"
                    />
                  </div>

                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6BCF7F] text-black py-3 border-2 border-black shadow-[6px_6px_0px_black] hover:translate-y-[2px] hover:shadow-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader size={20} className="animate-spin" />}
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>

              </div>
            </form>

            <div className="border-t-2 border-black mt-8 pt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login/company" className="underline">
                Log In
              </Link>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-6">
        <div className="w-54 h-4 bg-purple-800 border-2 border-black" />
        <div className="w-54 h-4 bg-green-400 border-2 border-black" />
        <div className="w-54 h-4 bg-yellow-400 border-2 border-black" />
      </div>

    </div>
  );
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs tracking-widest block mb-2 font-bold">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full border-2 border-black p-3 bg-white focus:outline-none"
      />
    </div>
  );
}

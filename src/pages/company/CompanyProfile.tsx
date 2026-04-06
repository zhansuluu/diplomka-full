import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Loader,
  AlertCircle,
  Tag,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { companyService, internshipService } from "../../api";
import type { InternshipResponse, UpdateCompanyRequest } from "../../api/types";

type Tab = "overview" | "profile";

export const CompanyProfile = () => {
  const { user, refreshUser } = useAuth();
  const companyId = user?.id;

  const [tab, setTab] = useState<Tab>("overview");

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [focusAreas, setFocusAreas] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [internships, setInternships] = useState<InternshipResponse[]>([]);

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    (async () => {
      try {
        const c = await companyService.getCompany(companyId);
        if (cancelled) return;
        setCompanyName(c.companyName ?? "");
        setIndustry(c.industry ?? "");
        setDescription(c.description ?? "");
        setHeadquarters(c.headquarters ?? "");
        setCompanySize(c.companySize ?? "");
        setFoundedYear(c.foundedYear != null ? String(c.foundedYear) : "");
        setWebsiteUrl(c.websiteUrl ?? "");
        setLogoUrl(c.logoUrl ?? "");
        setContactPerson(c.contactPerson ?? "");
        setContactEmail(c.contactEmail ?? "");
        setContactPhone(c.contactPhone ?? "");
        setFocusAreas((c.focusAreas ?? []).join(", "));
        setLoaded(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    (async () => {
      try {
        const { items } = await internshipService.listInternships(companyId, 50, 0);
        if (!cancelled) setInternships(items ?? []);
      } catch {
        if (!cancelled) setInternships([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const handleSave = async (e: React.FormEvent, goToOverview: boolean) => {
    e.preventDefault();
    if (!companyId) return;
    setSaving(true);
    setError(null);
    const body: UpdateCompanyRequest = {
      companyName: companyName || undefined,
      industry: industry || undefined,
      description: description || undefined,
      headquarters: headquarters || undefined,
      companySize: companySize || undefined,
      foundedYear: foundedYear ? parseInt(foundedYear, 10) : undefined,
      websiteUrl: websiteUrl || undefined,
      logoUrl: logoUrl || undefined,
      contactPerson: contactPerson || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      focusAreas: focusAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      await companyService.updateCompany(companyId, body);
      await refreshUser();
      if (goToOverview) setTab("overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const focusAreasList = focusAreas
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!companyId) {
    return (
      <div className="w-full px-30 py-10 max-w-5xl mx-auto">
        <p className="text-gray-600">Sign in as a company to edit your profile.</p>
      </div>
    );
  }

  if (!loaded && !error) {
    return (
      <div className="w-full px-30 py-10 flex items-center gap-3 text-gray-700">
        <Loader className="animate-spin" />
        Loading profile…
      </div>
    );
  }

  if (error && !loaded) {
    return (
      <div className="w-full px-30 py-10 max-w-5xl mx-auto">
        <div className="bg-red-50 border-2 border-red-300 p-4 rounded flex gap-2 items-start">
          <AlertCircle className="shrink-0 text-red-600" size={20} />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {tab === "profile" && (
        <>
          <div className="mt-10 px-30 pt-5 flex gap-4 animate-slideInRight flex-wrap">
            <button
              type="button"
              onClick={() => setTab("profile")}
              className="border-2 border-black px-6 py-2 bg-[#5D0CA0] text-white shadow-[4px_4px_0px_black] rounded"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setTab("overview")}
              className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:bg-gray-50"
            >
              Overview
            </button>
          </div>

          {error && (
            <div className="px-30">
              <div className="bg-red-50 border-2 border-red-300 p-4 rounded flex gap-2 items-start max-w-3xl">
                <AlertCircle className="shrink-0 text-red-600" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="px-30 mb-15 pb-10">
            <form
              onSubmit={(e) => handleSave(e, true)}
              className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded p-10 flex flex-col gap-8 animate-stagger-1 max-w-4xl"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black] overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={36} />
                  )}
                </div>
                <span className="text-gray-600">
                  {logoUrl ? "Logo preview (from URL below)" : "No logo uploaded"}
                </span>
              </div>

              <Field label="Company name *" value={companyName} onChange={setCompanyName} required />
              <Field label="Industry *" value={industry} onChange={setIndustry} required />

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Company size" value={companySize} onChange={setCompanySize} />
                <Field label="Founded year" value={foundedYear} onChange={setFoundedYear} type="number" />
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-semibold">Company description *</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="border-2 border-black p-3 rounded"
                  placeholder="No data added"
                  required
                />
              </label>

              <Field label="Website URL" value={websiteUrl} onChange={setWebsiteUrl} />
              <Field label="Headquarters" value={headquarters} onChange={setHeadquarters} />
              <Field label="Logo URL" value={logoUrl} onChange={setLogoUrl} />

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Contact person" value={contactPerson} onChange={setContactPerson} />
                <Field label="Contact email" value={contactEmail} onChange={setContactEmail} type="email" />
              </div>
              <Field label="Contact phone" value={contactPhone} onChange={setContactPhone} />
              <label className="flex flex-col gap-2">
                <span className="font-semibold">Focus areas (comma-separated)</span>
                <input
                  value={focusAreas}
                  onChange={(e) => setFocusAreas(e.target.value)}
                  className="border-2 border-black p-3 rounded"
                  placeholder="e.g. AI, FinTech, Education"
                />
              </label>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save & view overview"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {tab === "overview" && (
        <CompanyOverviewPreview
          companyName={companyName}
          industry={industry}
          description={description}
          headquarters={headquarters}
          companySize={companySize}
          foundedYear={foundedYear}
          websiteUrl={websiteUrl}
          logoUrl={logoUrl}
          focusAreas={focusAreasList}
          internships={internships}
          onBackToProfile={() => setTab("profile")}
        />
      )}
    </div>
  );
};

function CompanyOverviewPreview({
  companyName,
  industry,
  description,
  headquarters,
  companySize,
  foundedYear,
  websiteUrl,
  logoUrl,
  focusAreas,
  internships,
  onBackToProfile,
}: {
  companyName: string;
  industry: string;
  description: string;
  headquarters: string;
  companySize: string;
  foundedYear: string;
  websiteUrl: string;
  logoUrl: string;
  focusAreas: string[];
  internships: InternshipResponse[];
  onBackToProfile: () => void;
}) {
  const displayName = companyName.trim() || "Your company name";
  const foundedDisplay = foundedYear.trim() || "—";

  return (
    <div className="flex flex-col gap-10 mb-15">
      <div className="relative w-full">
        <div className="h-48 bg-[#EDE7FF] border-b-2 border-black" />
        <div className="px-20 -mt-24 relative z-10">
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 flex flex-col sm:flex-row items-start gap-8">
            <div className="w-28 h-28 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black] overflow-hidden shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} />
              )}
            </div>

            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <h2 className="text-3xl font-bold break-words">{displayName}</h2>

              <div className="flex gap-6 text-[#5D0CA0]">
                <Tag size={18} aria-hidden />
                <MapPin size={18} aria-hidden />
                <Globe size={18} aria-hidden />
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/company/dashboard"
                  className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded text-center"
                >
                  View active internships
                </Link>

                <button
                  type="button"
                  disabled
                  title="Students can follow your company from the public listing."
                  className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] rounded opacity-70 cursor-not-allowed"
                >
                  Follow company
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card title="ABOUT THE COMPANY">
            <p className="text-gray-700 whitespace-pre-wrap">
              {description.trim() || "No company description added yet."}
            </p>
          </Card>

          <Card title="ACTIVE INTERNSHIP CASES">
            {internships.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="w-16 h-16 border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black]">
                  <Briefcase size={28} />
                </div>
                <p className="font-semibold">No active internships yet.</p>
                <Link to="/company/create" className="text-[#5D0CA0] font-medium underline">
                  Create an internship
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {internships.map((i) => (
                  <li key={i.id} className="border-2 border-black p-4 rounded">
                    <Link
                      to={`/company/internships/${i.id}`}
                      className="font-bold text-[#5D0CA0] hover:underline"
                    >
                      {i.title}
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{i.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="SKILLS & FOCUS AREAS">
            <p>{focusAreas.length ? focusAreas.join(", ") : "Not specified yet."}</p>
          </Card>
        </div>

        <div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded p-6 flex flex-col gap-6">
            <h3 className="font-bold border-b border-black pb-3">COMPANY DETAILS</h3>

            <Detail label="INDUSTRY" value={industry || "—"} icon={Tag} />
            <Detail label="COMPANY SIZE" value={companySize || "—"} icon={Users} />
            <Detail label="FOUNDED" value={foundedDisplay} icon={Calendar} />
            <Detail label="HEADQUARTERS" value={headquarters || "—"} icon={MapPin} />
            {websiteUrl ? (
              <a
                href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border-b border-gray-300 pb-3 text-[#5D0CA0] underline break-all"
              >
                <Globe size={16} className="shrink-0 text-[#5D0CA0]" />
                <span className="font-medium">WEBSITE</span>
              </a>
            ) : (
              <Detail label="WEBSITE" value="—" icon={Globe} />
            )}
          </div>
        </div>
      </div>

      <div className="px-20 flex justify-end">
        <button
          type="button"
          onClick={onBackToProfile}
          className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
        >
          Complete profile
        </button>
      </div>
    </div>
  );
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded p-8">
    <h3 className="font-bold border-b border-black pb-3 mb-6">{title}</h3>
    {children}
  </div>
);

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-300 pb-3">
      <Icon size={16} className="text-[#5D0CA0] shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="font-medium text-gray-500 uppercase text-xs tracking-wide">{label}</span>
        <p className="text-gray-800 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-black p-3 rounded"
        placeholder="No data added"
      />
    </label>
  );
}

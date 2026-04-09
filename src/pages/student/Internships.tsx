import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Code, Loader, AlertCircle, Search } from "lucide-react";
import ApplyModal from "../../components/ApplyModal";
import { useAsyncData } from "../../hooks/useAsyncData";
import { applicationService, companyService, internshipService } from "../../api";
import type { CompanyResponse, InternshipResponse } from "../../api/types";
import { useAuth } from "../../contexts/AuthContext";

function monthsDuration(startIso: string, endIso: string): string {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return "Duration TBA";
  const m = Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24 * 30)));
  return `${m} month${m === 1 ? "" : "s"}`;
}

function isActive(i: InternshipResponse): boolean {
  if (!i.endDate) return true;
  return new Date(i.endDate) >= new Date(new Date().toDateString());
}

export const Internships = () => {
  const { user, userRole } = useAuth();
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [applyError, setApplyError] = useState("");

  const load = useCallback(async () => {
    const { items } = await internshipService.listInternships(undefined, 100, 0);
    const companyIds = [...new Set(items.map((i) => i.companyId))];
    const results = await Promise.all(
      companyIds.map(async (cid) => {
        try {
          return await companyService.getCompany(cid);
        } catch {
          return null;
        }
      })
    );
    const companyById: Record<string, CompanyResponse> = {};
    results.forEach((c) => {
      if (c) companyById[c.id] = c;
    });
    return { items, companyById };
  }, []);

  const { data, loading, error } = useAsyncData(load, [load]);
  const { data: applications = [], refetch: refetchApplications } = useAsyncData(
    () =>
      userRole === "student" && user?.id
        ? applicationService.listForStudent(user.id)
        : Promise.resolve([]),
    [user?.id, userRole]
  );

  const appliedIds = useMemo(
    () => new Set((applications ?? []).map((application) => application.internshipId)),
    [applications]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    let items = data.items;
    if (activeOnly) items = items.filter(isActive);
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      const company = data.companyById[i.companyId];
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (company?.companyName ?? "").toLowerCase().includes(q) ||
        (company?.headquarters ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, query, activeOnly]);

  const selected = useMemo(
    () => (selectedId && data ? data.items.find((i) => i.id === selectedId) : null) ?? null,
    [selectedId, data]
  );

  return (
    <div className="flex flex-col gap-10 px-20 py-5">
      <div>
        <h2 className="text-4xl font-bold">Find your perfect internship</h2>
        <p className="text-gray-600 mt-2">Explore opportunities from companies on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-stretch sm:items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder="Search title, company, location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-2 border-black pl-10 pr-4 py-2 rounded shadow-[4px_4px_0px_black]"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer border-2 border-black px-4 py-2 rounded bg-white shadow-[4px_4px_0px_black] text-sm font-medium">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="accent-[#5D0CA0]"
          />
          <span>Active listings only</span>
        </label>
      </div>

      {loading && (
        <div className="bg-white border-2 border-black p-12 rounded flex items-center justify-center gap-3 shadow-[4px_4px_0px_black]">
          <Loader className="animate-spin" size={28} />
          <p className="text-gray-700">Loading internships…</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-4 items-start">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-800">Could not load internships</h3>
            <p className="text-gray-800 mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white border-2 border-black p-16 shadow-[4px_4px_0px_black] rounded flex flex-col items-center text-center gap-6">
          <h3 className="text-2xl font-bold">No internships found</h3>
          <p className="text-gray-600 max-w-lg">
            {data?.items.length === 0
              ? "There are no listings yet. Check back later."
              : "Try adjusting your search or turn off “Active only” to see more results."}
          </p>
          <Link
            to="/student/dashboard"
            className="border-2 border-black px-6 py-3 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            Back to dashboard
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((internship) => {
            const company = data.companyById[internship.companyId];
            const hasApplied = appliedIds.has(internship.id);
            const duration =
              internship.startDate && internship.endDate
                ? monthsDuration(internship.startDate, internship.endDate)
                : "Duration TBA";
            const location = company?.headquarters?.trim() || "Location TBA";

            return (
              <div
                key={internship.id}
                className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded flex flex-col gap-4"
              >
                <div className="flex gap-5 items-start">
                  <div className="w-16 h-16 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] flex items-center justify-center shrink-0">
                    <Code size={28} />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm text-gray-500 font-medium">
                      {company?.companyName ?? "Company"}
                    </span>
                    <h3 className="text-xl font-bold break-words">{internship.title}</h3>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {duration}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">{internship.description}</p>

                <div className="flex gap-3 flex-wrap">
                  <span className="border border-black px-3 py-1 rounded-full text-sm bg-gray-100">Virtual</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm border border-black ${
                      isActive(internship) ? "bg-[#5D0CA0] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {isActive(internship) ? "Open" : "Ended"}
                  </span>
                </div>

                <div className="flex gap-4 mt-4">
                  <Link
                    to={`/student/internships/${internship.id}`}
                    className="flex-1 text-center border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    disabled={!isActive(internship) || hasApplied}
                    onClick={() => {
                      setApplyError("");
                      setSelectedId(internship.id);
                    }}
                    className="flex-1 bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {hasApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {successMsg && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow z-50 border-2 border-black">
          {successMsg}
        </div>
      )}

      {applyError && (
        <div className="fixed top-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow z-50 border-2 border-black max-w-sm">
          {applyError}
        </div>
      )}

      <ApplyModal
        open={!!selected}
        title={selected?.title}
        onClose={() => setSelectedId(null)}
        onSubmit={async (coverLetter: string) => {
          if (!selected) return;
          try {
            await applicationService.submit(selected.id, coverLetter);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Could not submit application.";
            setApplyError(message);
            setTimeout(() => setApplyError(""), 3000);
            throw error;
          }
          await refetchApplications();
          setSuccessMsg("Application submitted");
          setTimeout(() => setSuccessMsg(""), 3000);
        }}
      />
    </div>
  );
};

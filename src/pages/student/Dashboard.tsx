import { useCallback } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ListTodo, Loader, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import useFavorites from "../../hooks/useFavorites";
import { companyService, internshipService, studentService } from "../../api";
import type { CompanyResponse, InternshipResponse } from "../../api/types";

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

type DashboardPayload = {
  followedTotal: number;
  recommended: { internship: InternshipResponse; company: CompanyResponse | null } | null;
};

export const Dashboard = () => {
  const { user, userRole } = useAuth();
  const { favorites, toggle, isFavorite } = useFavorites();

  const firstName =
    userRole === "student" && user && "firstName" in user ? user.firstName : "there";

  const load = useCallback(async (): Promise<DashboardPayload> => {
    const [followed, listRes] = await Promise.all([
      studentService.getFollowedCompanies(100, 0),
      internshipService.listInternships(undefined, 100, 0),
    ]);

    const items = listRes.items ?? [];
    const active = items.filter(isActive);
    let recommended: DashboardPayload["recommended"] = null;
    if (active.length > 0) {
      const internship = active[0];
      try {
        const company = await companyService.getCompany(internship.companyId);
        recommended = { internship, company };
      } catch {
        recommended = { internship, company: null };
      }
    }

    return {
      followedTotal: followed.total ?? followed.items?.length ?? 0,
      recommended,
    };
  }, []);

  const { data, loading, error } = useAsyncData(load, [load]);

  const rec = data?.recommended;

  return (
    <div className="flex flex-col gap-10 px-20 py-5">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold">Welcome Back, {firstName}!</h2>
        <p className="text-gray-700 mt-2">
          {loading
            ? "Loading your overview…"
            : `You're following ${data?.followedTotal ?? 0} ${
                data?.followedTotal === 1 ? "company" : "companies"
              }`}
        </p>
      </div>

      {/* Task Progress Card — progress bar left as static UI */}
      <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded">
        <p className="text-sm text-gray-500">Keep going! You&apos;re making great progress 🚀</p>

        <h3 className="text-xl font-bold mt-2">Task Progress</h3>

        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-700">Overall Completion</span>
          <span className="text-2xl font-bold">65%</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 border-2 border-black h-6 bg-gray-200 relative rounded">
          <div className="h-full bg-[#5D0CA0] w-[65%] rounded-[2px]" />
        </div>

        <p className="text-sm text-gray-600 mt-4">13 of 20 tasks completed</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex justify-between items-start">
          <div>
            <h4 className="text-3xl font-bold text-[#6BCF7F]">13</h4>
            <p className="text-gray-600 mt-2">Completed Tasks</p>
          </div>
          <div className="border-2 border-black p-2 rounded bg-[#6BCF7F] text-white">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex justify-between items-start">
          <div>
            <h4 className="text-3xl font-bold">4</h4>
            <p className="text-gray-600 mt-2">In Progress</p>
          </div>
          <div className="border-2 border-black p-2 rounded bg-yellow-400 text-black">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex justify-between items-start">
          <div>
            <h4 className="text-3xl font-bold text-[#5D0CA0]">3</h4>
            <p className="text-gray-600 mt-2">Pending Tasks</p>
          </div>
          <div className="border-2 border-black p-2 rounded bg-[#5D0CA0] text-white">
            <ListTodo size={24} />
          </div>
        </div>
      </div>

      {/* Recommended Internships */}
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Recommended Internships</h3>

        {loading && (
          <div className="bg-white border-2 border-black p-8 rounded shadow-[4px_4px_0px_black] flex items-center gap-3 text-gray-700">
            <Loader className="animate-spin" size={24} />
            Loading recommendations…
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-4 items-start">
            <AlertCircle className="text-red-600 shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-red-800">Could not load dashboard data</h3>
              <p className="text-gray-800 mt-1">{error.message}</p>
            </div>
          </div>
        )}

        {!loading && !error && !rec && (
          <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded text-gray-700">
            No open internships yet. Check back later or browse{" "}
            <Link to="/student/internships" className="underline font-medium text-[#5D0CA0]">
              all listings
            </Link>
            .
          </div>
        )}

        {!loading && !error && rec && (
          <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded flex flex-col gap-4">
            <h4 className="text-xl font-semibold">{rec.internship.title}</h4>

            <p className="text-gray-600">
              {rec.company?.companyName ?? "Company"} • {rec.company?.headquarters?.trim() || "Location TBA"} •{" "}
              {rec.internship.startDate && rec.internship.endDate
                ? monthsDuration(rec.internship.startDate, rec.internship.endDate)
                : "Duration TBA"}
            </p>

            <p className="text-gray-700 text-sm line-clamp-4">{rec.internship.description}</p>

            <div className="flex gap-4 mt-4">
              <Link
                to={`/student/internships/${rec.internship.id}`}
                className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition rounded"
              >
                View Details
              </Link>

              <button
                type="button"
                onClick={() => toggle(rec.internship.id)}
                className={`border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition rounded ${
                  isFavorite(rec.internship.id) ? "bg-red-500 text-white" : "bg-white"
                }`}
              >
                {isFavorite(rec.internship.id) ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

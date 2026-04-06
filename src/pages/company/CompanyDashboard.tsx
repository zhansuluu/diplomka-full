import {
  AlertCircle,
  Loader,
  Building2,
  Code,
  Users,
  Clock,
  Plus,
  Gift,
  ClipboardList,
  Award,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { internshipService, companyService } from "../../api";
import type { InternshipResponse } from "../../api/types";

function monthsDuration(startIso: string, endIso: string): number {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24 * 30)));
}

/** Timeline progress through the internship window (0–100). */
function programProgressPercent(startIso: string, endIso: string): number {
  const s = new Date(startIso).getTime();
  const e = new Date(endIso).getTime();
  const now = Date.now();
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 0;
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

function isInternshipActive(i: InternshipResponse): boolean {
  if (!i.endDate) return true;
  return new Date(i.endDate) >= new Date(new Date().toDateString());
}

export const CompanyDashboard = () => {
  const { user } = useAuthContext();

  const { data: internshipsData, loading: loadingInternships, error: internshipsError } = useAsyncData(
    () => (user?.id ? internshipService.listInternships(user.id, 50, 0) : Promise.reject(new Error("No user ID"))),
    [user?.id]
  );

  const { data: company } = useAsyncData(
    () => (user?.id ? companyService.getCompany(user.id) : Promise.reject(new Error("No user ID"))),
    [user?.id]
  );

  const { data: followersData, loading: loadingFollowers } = useAsyncData(
    () => (user?.id ? companyService.getFollowers(user.id, 100, 0) : Promise.reject(new Error("No user ID"))),
    [user?.id]
  );

  const internships = internshipsData?.items ?? [];
  const activeInternships = internships.filter(isInternshipActive);
  const featured = activeInternships[0] ?? internships[0];
  const hasInternships = internships.length > 0;

  const progress =
    featured?.startDate && featured?.endDate
      ? programProgressPercent(featured.startDate, featured.endDate)
      : 0;

  const months =
    featured?.startDate && featured?.endDate
      ? monthsDuration(featured.startDate, featured.endDate)
      : null;

  const followersCount = followersData?.total ?? followersData?.items?.length ?? 0;

  return (
    <div className="flex flex-col gap-10 px-30 py-15">
      <div className="animate-slideInRight">
        <h2 className="text-4xl font-bold">Company Dashboard</h2>
        <p className="text-gray-600 mt-2">
          {company?.companyName ? `${company.companyName} — ` : ""}
          Manage your internship cases and review candidates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Gift} title="Active cases" value={String(activeInternships.length)} />
        <StatCard icon={ClipboardList} title="Total submissions" value="—" />
        <StatCard icon={Award} title="Average score" value="—" />
        <StatCard
          icon={UserCheck}
          title="Company followers"
          value={loadingFollowers ? "…" : String(followersCount)}
        />
      </div>

      {loadingInternships ? (
        <div className="bg-white border-2 border-black p-8 rounded flex items-center justify-center gap-3 shadow-[4px_4px_0px_black]">
          <Loader className="animate-spin" size={24} />
          <p>Loading internships…</p>
        </div>
      ) : internshipsError ? (
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-4 items-start">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-800">Error loading internships</h3>
            <p className="text-gray-800 mt-2">{internshipsError.message}</p>
          </div>
        </div>
      ) : hasInternships && featured ? (
        <div className="flex flex-col gap-6 animate-stagger-2">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <h3 className="text-2xl font-bold">Your active case</h3>
            {internships.length > 1 && (
              <Link to="/company/cases" className="text-[#5D0CA0] font-medium underline text-sm">
                View all cases ({internships.length})
              </Link>
            )}
          </div>

          <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black] rounded flex flex-col gap-6">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#EDE7FF] border-2 border-black rounded-xl shadow-[4px_4px_0px_black] flex items-center justify-center shrink-0">
                <Code size={28} />
              </div>

              <div className="flex flex-col gap-2 min-w-0">
                <h4 className="text-xl font-bold break-words">{featured.title}</h4>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {months != null ? `${months} month${months === 1 ? "" : "s"}` : "Duration TBA"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    {followersCount} followers
                  </div>
                </div>

                <div className="flex gap-3 mt-2 flex-wrap">
                  <span className="border border-black px-3 py-1 rounded-full text-sm bg-gray-100">Virtual</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm border border-black ${
                      isInternshipActive(featured) ? "bg-[#5D0CA0] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {isInternshipActive(featured) ? "Active" : "Ended"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Program timeline progress</p>
              <div className="w-full border-2 border-black h-5 overflow-hidden rounded bg-white">
                <div className="bg-[#5D0CA0] h-full transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm mt-1 font-medium">{progress}% through the program window</p>
            </div>

            <div className="flex gap-4 mt-2 flex-col sm:flex-row">
              <Link
                to={`/company/cases/${featured.id}`}
                className="flex-1 text-center border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
              >
                View details
              </Link>
              <Link
                to={`/company/submissions?internshipId=${featured.id}`}
                className="flex-1 text-center bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
              >
                Review applications
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-black p-12 rounded text-center shadow-[4px_4px_0px_black]">
          <Code className="mx-auto mb-4 text-gray-400" size={40} />
          <h3 className="text-xl font-bold mb-2">No active internships</h3>
          <p className="text-gray-600 mb-4">Create your first internship opportunity</p>
          <Link
            to="/company/create"
            className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 rounded inline-flex items-center gap-2 shadow-[4px_4px_0px_black]"
          >
            <Plus size={18} />
            Create internship
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        <Link
          to="/company/create"
          className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
        >
          <Plus size={18} />
          Create new case
        </Link>

        <Link
          to="/company/profile"
          className="border-2 border-black px-6 py-3 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
        >
          <Building2 size={18} />
          Edit company profile
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) => (
  <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex flex-col gap-4 animate-stagger-1">
    <div className="w-12 h-12 bg-[#5D0CA0] border-2 border-black rounded flex items-center justify-center text-white">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-4xl font-bold">{value}</h4>
      <p className="text-gray-600 mt-1">{title}</p>
    </div>
  </div>
);

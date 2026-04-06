import { Folder, Plus, Code, Clock, Loader, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { internshipService, companyService } from "../../api";

function monthsBetween(startIso: string, endIso: string): number {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24 * 30)));
}

export const MyCases = () => {
  const { user } = useAuthContext();

  const { data: internshipsData, loading, error } = useAsyncData(
    () =>
      user?.id
        ? internshipService.listInternships(user.id, 50, 0)
        : Promise.reject(new Error("No user ID")),
    [user?.id]
  );

  const { data: company } = useAsyncData(
    () =>
      user?.id ? companyService.getCompany(user.id) : Promise.reject(new Error("No user ID")),
    [user?.id]
  );

  const internships = internshipsData?.items ?? [];
  const hasCases = internships.length > 0;
  const companyName = company?.companyName ?? "Your company";

  return (
    <div className="flex flex-col gap-10 px-30 py-15">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 animate-slideInRight">
        <div>
          <h2 className="text-4xl font-bold">My Cases</h2>
          <p className="text-gray-600 mt-2">Manage your internship cases and track performance</p>
        </div>

        <Link
          to="/company/create"
          className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2 w-fit shrink-0"
        >
          <Plus size={18} />
          Create New Case
        </Link>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-gray-700">
          <Loader className="animate-spin" size={22} />
          Loading cases…
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-300 p-4 rounded flex gap-3 items-start">
          <AlertCircle className="text-red-600 shrink-0" size={22} />
          <div>
            <h3 className="font-bold text-red-800">Could not load cases</h3>
            <p className="text-red-800 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {!loading && !error && hasCases && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {internships.map((internship) => {
            const months =
              internship.startDate && internship.endDate
                ? monthsBetween(internship.startDate, internship.endDate)
                : null;
            const active =
              internship.endDate && !Number.isNaN(new Date(internship.endDate).getTime())
                ? new Date(internship.endDate) >= new Date()
                : true;

            return (
              <div
                key={internship.id}
                className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black] rounded flex flex-col gap-6 animate-stagger-1"
              >
                <div className="flex gap-5 items-start">
                  <div className="w-16 h-16 bg-[#EDE7FF] border-2 border-black rounded-xl shadow-[4px_4px_0px_black] flex items-center justify-center shrink-0">
                    <Code size={28} />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm text-gray-500 font-medium">{companyName}</span>
                    <h3 className="text-xl font-bold break-words">{internship.title}</h3>
                    <div className="flex items-center gap-5 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {months != null ? `${months} month${months === 1 ? "" : "s"}` : "Duration TBA"}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">{internship.description}</p>

                <div className="flex gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm border border-black ${
                      active ? "bg-[#5D0CA0] text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {active ? "Active" : "Ended"}
                  </span>
                </div>

                <div className="flex gap-4 mt-4">
                  <Link
                    to={`/company/cases/${internship.id}`}
                    className="flex-1 text-center border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/company/submissions?internshipId=${internship.id}`}
                    className="flex-1 text-center bg-[#5D0CA0] border-2 border-black px-4 py-2 text-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition text-sm"
                  >
                    Applications
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && !hasCases && (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded flex flex-col items-center justify-center text-center gap-6 p-20 animate-stagger-1">
          <div className="w-24 h-24 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black]">
            <Folder size={40} />
          </div>

          <h3 className="text-2xl font-bold">You haven&apos;t created any cases yet.</h3>

          <p className="text-gray-600 max-w-lg">
            Create your first internship case to start attracting talented students.
          </p>

          <Link
            to="/company/create"
            className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
          >
            <Plus size={18} />
            Create Case
          </Link>
        </div>
      )}
    </div>
  );
};

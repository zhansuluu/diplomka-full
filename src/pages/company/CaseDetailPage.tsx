import { Link, useParams } from "react-router-dom";
import { MapPin, Clock, ArrowLeft, Loader, AlertCircle, Pencil } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { companyService, internshipService } from "../../api";
import { useAsyncData } from "../../hooks/useAsyncData";

function monthsDuration(startIso: string, endIso: string): string {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return "Duration TBA";
  const m = Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24 * 30)));
  return `${m} month${m === 1 ? "" : "s"}`;
}

function parseRequirementTags(requirements: string): string[] {
  const firstLine = requirements.split(/\r?\n/)[0] ?? "";
  return firstLine
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseResponsibilityLines(requirements: string): string[] {
  const lines = requirements.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  return lines.slice(1);
}

export const CaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: internship, loading, error } = useAsyncData(
    () => internshipService.getInternship(id!),
    [id]
  );

  const { data: company, loading: loadingCompany } = useAsyncData(
    () =>
      internship?.companyId
        ? companyService.getCompany(internship.companyId)
        : Promise.reject(new Error("No company")),
    [internship?.companyId]
  );

  const wrongCompany =
    internship && user?.id && internship.companyId !== user.id;

  if (loading) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6">
        <Link
          to="/company/cases"
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to My Cases
        </Link>
        <div className="flex items-center gap-3 text-gray-700">
          <Loader className="animate-spin" size={24} />
          Loading case…
        </div>
      </div>
    );
  }

  if (error || !internship || !id) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6">
        <Link
          to="/company/cases"
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to My Cases
        </Link>
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <p>{error?.message ?? "Case not found"}</p>
        </div>
      </div>
    );
  }

  if (wrongCompany) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6">
        <Link to="/company/cases" className="w-fit border-2 border-black px-4 py-2 bg-white rounded flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to My Cases
        </Link>
        <p className="text-red-600 font-semibold">You can only view your own cases.</p>
      </div>
    );
  }

  const tags = internship.requirements ? parseRequirementTags(internship.requirements) : [];
  const responsibilityLines = internship.requirements ? parseResponsibilityLines(internship.requirements) : [];
  const duration =
    internship.startDate && internship.endDate
      ? monthsDuration(internship.startDate, internship.endDate)
      : "Duration TBA";
  const active =
    internship.endDate && !Number.isNaN(new Date(internship.endDate).getTime())
      ? new Date(internship.endDate) >= new Date()
      : true;

  return (
    <div className="flex flex-col gap-8 px-20 py-6">
      <Link
        to="/company/cases"
        className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to My Cases
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded flex gap-6 items-center">
            <div className="w-20 h-20 border-2 border-black rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden shrink-0 text-3xl">
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                "🚀"
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-3xl font-bold break-words">{internship.title}</h2>

              <p className="text-gray-600 mt-1">
                {loadingCompany ? "…" : company?.companyName ?? "Company"}
              </p>

              <div className="flex gap-4 mt-3 flex-wrap">
                <span className="flex items-center gap-1 text-sm border border-black px-3 py-1 rounded-full bg-gray-100">
                  <MapPin size={14} />
                  {company?.headquarters || "Location TBA"}
                </span>

                <span className="flex items-center gap-1 text-sm border border-black px-3 py-1 rounded-full bg-gray-100">
                  <Clock size={14} />
                  {duration}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black] rounded flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">About the role</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Requirements</h4>
              <div className="flex gap-3 flex-wrap">
                {tags.length ? (
                  tags.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#5D0CA0] text-white border-2 border-black px-4 py-1 rounded shadow-[3px_3px_0px_black] text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No specific requirements listed.</p>
                )}
              </div>
            </div>

            {responsibilityLines.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Responsibilities</h4>
                <ul className="flex flex-col gap-2 text-gray-700">
                  {responsibilityLines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-[#5D0CA0]">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded flex flex-col gap-6 h-fit">
          <h3 className="text-xl font-bold">Company info</h3>

          {loadingCompany ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader className="animate-spin" size={18} />
              Loading…
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-1">INDUSTRY</p>
                <div className="border border-black px-4 py-2 rounded bg-gray-100">
                  {company?.industry ?? "—"}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">COMPANY SIZE</p>
                <div className="border border-black px-4 py-2 rounded bg-gray-100">
                  {company?.companySize ?? "—"}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">STATUS</p>
                <div
                  className={`w-fit border-2 border-black px-4 py-1 rounded shadow-[3px_3px_0px_black] text-sm ${
                    active ? "bg-[#5D0CA0] text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {active ? "Active" : "Ended"}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">FORMAT</p>
                <div className="w-fit bg-green-500 text-white border-2 border-black px-4 py-1 rounded shadow-[3px_3px_0px_black] text-sm">
                  Virtual internship
                </div>
              </div>
            </>
          )}

          <Link
            to={`/company/internships/${internship.id}`}
            className="flex items-center justify-center gap-2 text-center border-2 border-black px-4 py-2 bg-[#5D0CA0] text-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition font-semibold"
          >
            <Pencil size={18} />
            Edit internship
          </Link>

          <Link
            to={`/company/submissions?internshipId=${internship.id}`}
            className="text-center border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            View applications
          </Link>

          <Link
            to={`/company/cases/${internship.id}/tasks`}
            className="text-center bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            Manage tasks
          </Link>
        </div>
      </div>
    </div>
  );
};

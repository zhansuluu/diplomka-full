import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Clock, ArrowLeft, Loader, AlertCircle } from "lucide-react";
import { companyService, internshipService } from "../../api";
import type { CompanyResponse, InternshipResponse } from "../../api/types";
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

export const MyInternship = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("internshipId");

  const { data: internship, loading, error } = useAsyncData(
    async (): Promise<InternshipResponse | null> => {
      if (!id) return null;
      return internshipService.getInternship(id);
    },
    [id]
  );

  const { data: company, loading: loadingCompany } = useAsyncData(
    async (): Promise<CompanyResponse | null> => {
      if (!internship?.companyId) return null;
      return companyService.getCompany(internship.companyId);
    },
    [internship?.companyId]
  );

  if (!id) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6 max-w-2xl">
        <Link
          to="/student/internships"
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Internships
        </Link>
        <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black] rounded">
          <h2 className="text-2xl font-bold mb-2">No internship selected</h2>
          <p className="text-gray-600 mb-4">
            Open an internship from the catalog, then add{" "}
            <code className="bg-gray-100 px-1 rounded">?internshipId=…</code> to this page URL, or use a link from
            internship details.
          </p>
          <Link
            to="/student/internships"
            className="inline-block bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded"
          >
            Browse internships
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6">
        <Link
          to="/student/internships"
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Internships
        </Link>
        <div className="flex items-center gap-3 text-gray-700">
          <Loader className="animate-spin" size={24} />
          Loading…
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6">
        <Link
          to="/student/internships"
          className="w-fit border-2 border-black px-4 py-2 bg-white rounded flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Internships
        </Link>
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <p>{error?.message ?? "Internship not found"}</p>
        </div>
      </div>
    );
  }

  const tags = internship.requirements ? parseRequirementTags(internship.requirements) : [];
  const responsibilityLines = internship.requirements ? parseResponsibilityLines(internship.requirements) : [];
  const duration =
    internship.startDate && internship.endDate
      ? monthsDuration(internship.startDate, internship.endDate)
      : "Duration TBA";

  return (
    <div className="flex flex-col gap-8 px-20 py-6">
      <Link
        to="/student/internships"
        className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Internships
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded flex gap-6 items-center">
            <div className="w-20 h-20 border-2 border-black rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden text-3xl shrink-0">
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
                <div className="border border-black px-4 py-2 rounded bg-gray-100">{company?.industry ?? "—"}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">COMPANY SIZE</p>
                <div className="border border-black px-4 py-2 rounded bg-gray-100">{company?.companySize ?? "—"}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">WORK TYPE</p>
                <div className="w-fit bg-green-500 text-white border-2 border-black px-4 py-1 rounded shadow-[3px_3px_0px_black] text-sm">
                  Virtual internship
                </div>
              </div>
            </>
          )}

          <Link
            to="/student/my-internship/tasks"
            className="flex-1 text-center border-2 border-black px-4 py-2 bg-[#5D0CA0] text-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            Go to tasks
          </Link>
        </div>
      </div>
    </div>
  );
};

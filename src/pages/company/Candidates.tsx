import { useMemo } from "react";
import { Filter, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { applicationService } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";

export const Candidates = () => {
  const { user } = useAuth();
  const companyId = user?.id;

  const { data: candidates = [], loading } = useAsyncData(
    () =>
      companyId
        ? applicationService.listCandidatesForCompany(companyId)
        : Promise.resolve([]),
    [companyId]
  );

  const cards = useMemo(
    () =>
      (candidates ?? []).map((candidate) => ({
        id: candidate.id,
        name: `${candidate.firstName} ${candidate.lastName}`.trim(),
        university:
          candidate.education[0]?.institutionName || "University not specified",
        skills: candidate.skills.slice(0, 4),
        internships: candidate.experience.length,
      })),
    [candidates]
  );

  return (
    <div className="flex flex-col gap-10 px-24 py-14 animate-fadeIn">
      <div>
        <h2 className="text-4xl font-bold">Candidates</h2>
        <p className="text-gray-600 mt-2">
          High-performing students ready to join your team
        </p>
      </div>

      <div className="bg-[#F8F8F8] border-2 border-black shadow-[6px_6px_0px_black] rounded p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Filter size={20} />
          <h3 className="text-xl font-bold">Filter Candidates</h3>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {["Industry", "Skill", "Score", "Experience"].map((label) => (
            <div key={label} className="flex flex-col gap-2">
              <label className="text-sm font-semibold">{label}</label>
              <input
                type="text"
                className="border-2 border-black rounded px-3 py-2 bg-white focus:outline-none focus:ring-0"
              />
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8">
          Loading candidates...
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8">
          No candidates yet. Student applications will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {cards.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-6 flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#5D0CA0] text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-black">
                  {candidate.name
                    .split(" ")
                    .map((part) => part[0] ?? "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{candidate.name}</h4>
                  <p className="text-gray-500 text-sm">{candidate.university}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 tracking-wide font-semibold">
                  KEY SKILLS
                </p>

                <div className="flex gap-2 flex-wrap">
                  {candidate.skills.length > 0 ? (
                    candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm bg-[#EDE7FF] text-purple-700 border border-black rounded"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No skills listed</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4 text-gray-700">
                <span>Completed Internships</span>
                <span className="font-bold text-purple-700">
                  {candidate.internships}
                </span>
              </div>

              <Link
                to={`/company/candidates/${candidate.id}`}
                className="mt-2 bg-[#5D0CA0] text-white border-2 border-black rounded py-3 flex items-center justify-center gap-2 shadow-[4px_4px_0px_black] transition"
              >
                <Eye size={18} />
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

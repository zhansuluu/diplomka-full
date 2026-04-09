import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Briefcase, Clock, Github, Link as LinkIcon } from "lucide-react";
import { applicationService, internshipService, studentService } from "../../api";

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.round(diffHours / 24);
  return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
}

export const ReviewApplication = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [candidate, setCandidate] = useState<{
    name: string;
    internship: string;
    appliedAt: string;
    github: string;
    portfolio: string;
    motivation: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      const application = await applicationService.getById(id);
      const [student, internship] = await Promise.all([
        studentService.getStudent(application.studentId),
        internshipService.getInternship(application.internshipId),
      ]);

      if (cancelled) return;

      setStatus(
        application.status === "ACCEPTED"
          ? "Approved"
          : application.status === "REJECTED"
            ? "Rejected"
            : "Pending"
      );
      setCandidate({
        name: `${student.firstName} ${student.lastName}`.trim(),
        internship: internship.title,
        appliedAt: formatRelative(application.appliedAt),
        github: application.githubUrl || student.githubUrl || "#",
        portfolio: application.portfolioUrl || student.resumeUrl || "#",
        motivation: application.coverLetter || "No cover letter provided.",
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateStatus = async (next: "Approved" | "Rejected") => {
    if (!id) return;
    const mapped = next === "Approved" ? "ACCEPTED" : "REJECTED";
    await applicationService.updateStatus(id, mapped);
    setStatus(next);
  };

  if (!candidate) {
    return <div className="px-30 py-15">Loading application...</div>;
  }

  return (
    <div className="flex flex-col gap-10 px-30 py-15">
      <button
        onClick={() => navigate(-1)}
        className="w-fit border-[3px] border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded-[4px] hover:translate-y-[2px] hover:shadow-none transition font-bold"
      >
        Back
      </button>

      <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_black] rounded-[4px] p-10 flex flex-col gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-[4px] bg-[#5D0CA0] border-[3px] border-black text-white shadow-[4px_4px_0px_black]">
            <User size={32} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-2xl font-black">{candidate.name}</div>

            <div className="flex items-center gap-2 text-[#9810FA] font-bold">
              <Briefcase size={16} />
              {candidate.internship}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              Applied {candidate.appliedAt}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <a
            href={candidate.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 underline font-bold"
          >
            <Github size={16} />
            GitHub
          </a>

          <a
            href={candidate.portfolio}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 underline font-bold"
          >
            <LinkIcon size={16} />
            Portfolio
          </a>
        </div>

        <div className="border-[3px] border-black rounded-[4px] p-6 shadow-[4px_4px_0px_black] bg-[#F8F7FF]">
          <h3 className="font-black mb-3">Motivation Letter</h3>
          <p>{candidate.motivation}</p>
        </div>

        <div className="flex gap-4">
          {status === "Pending" && (
            <>
              <button
                onClick={() => updateStatus("Approved")}
                className="bg-[#5D0CA0] text-white border-[3px] border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded-[4px] hover:translate-y-[2px] hover:shadow-none transition font-black"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus("Rejected")}
                className="bg-white text-black border-[3px] border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded-[4px] hover:translate-y-[2px] hover:shadow-none transition font-black"
              >
                Reject
              </button>
            </>
          )}

          {status !== "Pending" && (
            <div className="px-6 py-3 border-[3px] border-black shadow-[4px_4px_0px_black] rounded-[4px] font-black bg-[#EDE7FF]">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

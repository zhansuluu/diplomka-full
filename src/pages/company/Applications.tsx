import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { User, Clock, Briefcase, ArrowUpRight } from "lucide-react";
import { applicationService, internshipService, studentService } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";

type ApplicationView = {
  id: string;
  student: string;
  internship: string;
  program?: string;
  appliedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  studentId: string;
};

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.round(diffHours / 24);
  return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
}

export const Applications = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeProgram, setActiveProgram] = useState<string>("All");

  const internshipIdFilter = searchParams.get("internshipId");

  const { data: applications = [] } = useAsyncData(
    () => (user?.id ? applicationService.listForCompany(user.id) : Promise.resolve([])),
    [user?.id]
  );

  const { data: internships = [] } = useAsyncData(
    async () => {
      const ids = [...new Set((applications ?? []).map((application) => application.internshipId))];
      return Promise.all(ids.map((id) => internshipService.getInternship(id)));
    },
    [(applications ?? []).map((item) => item.id).join(",")]
  );

  const { data: students = [] } = useAsyncData(
    async () => {
      const ids = [...new Set((applications ?? []).map((application) => application.studentId))];
      return Promise.all(ids.map((id) => studentService.getStudent(id)));
    },
    [(applications ?? []).map((item) => item.id).join(",")]
  );

  const rows = useMemo<ApplicationView[]>(() => {
    const internshipById = Object.fromEntries((internships ?? []).map((item) => [item.id, item]));
    const studentById = Object.fromEntries((students ?? []).map((item) => [item.id, item]));
    return (applications ?? [])
      .filter((application) =>
        internshipIdFilter ? application.internshipId === internshipIdFilter : true
      )
      .map((application) => ({
        id: application.id,
        student:
          studentById[application.studentId]
            ? `${studentById[application.studentId].firstName} ${studentById[application.studentId].lastName}`
            : "Student",
        internship: internshipById[application.internshipId]?.title ?? "Internship",
        program: internshipById[application.internshipId]?.title,
        appliedAt: formatRelative(application.appliedAt),
        status:
          application.status === "ACCEPTED"
            ? "Approved"
            : application.status === "REJECTED"
              ? "Rejected"
              : "Pending",
        studentId: application.studentId,
      }));
  }, [applications, internshipIdFilter, internships, students]);

  const programs = Array.from(new Set(rows.map((row) => row.program).filter(Boolean))) as string[];
  const filtered =
    activeProgram === "All"
      ? rows
      : rows.filter((application) => application.program === activeProgram);

  return (
    <div className="flex flex-col gap-10 px-30 py-15">
      <div>
        <h2 className="text-4xl font-bold">Student Applications</h2>
        <p className="text-gray-600 mt-2">Review and manage student applications</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            onClick={() => setActiveProgram("All")}
            className={`border-2 border-black px-4 py-2 rounded ${activeProgram === "All" ? "bg-[#5D0CA0] text-white" : "bg-white"}`}
          >
            All
          </button>
          {programs.map((program) => (
            <button
              key={program}
              onClick={() => setActiveProgram(program)}
              className={`border-2 border-black px-4 py-2 rounded ${activeProgram === program ? "bg-[#5D0CA0] text-white" : "bg-white"}`}
            >
              {program}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_black] rounded-[4px] p-8">
            No applications yet.
          </div>
        ) : (
          filtered.map((application) => (
            <div
              key={application.id}
              className="bg-white border-[3px] border-black shadow-[4px_4px_0px_black] rounded-[4px] p-8 flex justify-between items-center transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-26 h-26 flex items-center justify-center rounded-[4px] bg-[#5D0CA0] border-2 border-black text-white shadow-[4px_4px_0px_black]">
                  <User size={26} />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="text-xl font-black">{application.student}</div>

                  <div className="flex items-center gap-2 text-[#9810FA] font-bold">
                    <Briefcase size={16} />
                    {application.internship}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} />
                    Applied {application.appliedAt}
                  </div>

                  <div className="flex flex-row items-center text-center gap-5">
                    <StatusBadge status={application.status} />

                    {application.program && (
                      <div className="inline-block mt-2 px-3 py-1 border-2 border-black rounded-[4px] text-sm font-bold bg-gray-100">
                        {application.program}
                      </div>
                    )}

                    <Link
                      to={`/company/candidates/${application.studentId}`}
                      className="text-sm font-bold text-black underline flex items-center gap-1"
                    >
                      View Candidate Profile
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to={`/company/applications/review/${application.id}`}
                className="bg-[#5D0CA0] text-white border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded-[4px] font-bold transition"
              >
                Review
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    status === "Approved"
      ? "bg-green-500"
      : status === "Rejected"
        ? "bg-[#5D0CA0]"
        : "bg-yellow-400";

  return (
    <div className={`inline-block mt-2 px-3 py-1 border-2 border-black shadow-[4px_4px_0px_black] rounded-[4px] text-sm font-bold ${styles}`}>
      {status}
    </div>
  );
};

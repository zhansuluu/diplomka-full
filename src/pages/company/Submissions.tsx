import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Clock, Briefcase, ArrowUpRight } from "lucide-react";

type Application = {
  id: number;
  student: string;
  internship: string;
  program?: string;
  appliedAt: string;
  status: "Pending" | "Approved" | "Rejected";
};

const initialApplications: Application[] = [
  {
    id: 1,
    student: "Sarah Chen",
    internship: "Frontend Developer Internship",
    program: "Frontend",
    appliedAt: "2 hours ago",
    status: "Pending",
  },
  {
    id: 2,
    student: "Daniel Brooks",
    internship: "Data Science Internship",
    program: "Data Science",
    appliedAt: "Yesterday",
    status: "Approved",
  },
];

export const Submissions = () => {
  const [applications] = useState(initialApplications);
  const programs = Array.from(new Set(initialApplications.map((a) => a.program).filter(Boolean))) as string[];
  const [activeProgram, setActiveProgram] = useState<string>("All");

  const filtered =
    activeProgram === "All"
      ? applications
      : applications.filter((a) => a.program === activeProgram);

  return (
    <div className="flex flex-col gap-10 px-30 py-15">

      <div>
        <h2 className="text-4xl font-bold">Student Applications</h2>
        <p className="text-gray-600 mt-2">
          Review and manage student applications
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Program filters */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveProgram("All")}
            className={`border-2 border-black px-4 py-2 rounded ${activeProgram === "All" ? 'bg-[#5D0CA0] text-white' : 'bg-white'}`}
          >
            All
          </button>
          {programs.map((p) => (
            <button
              key={p}
              onClick={() => setActiveProgram(p)}
              className={`border-2 border-black px-4 py-2 rounded ${activeProgram === p ? 'bg-[#5D0CA0] text-white' : 'bg-white'}`}
            >
              {p}
            </button>
          ))}
        </div>

        {filtered.map((application) => (
          <div
            key={application.id}
            className="bg-white border-[3px] border-black shadow-[4px_4px_0px_black] rounded-[4px] p-8 flex justify-between items-center transition-all"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-6">

              {/* Avatar */}
              <div className="w-26 h-26 flex items-center justify-center rounded-[4px] bg-[#5D0CA0] border-2 border-black text-white shadow-[4px_4px_0px_black]">
                <User size={26} />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">

                <div className="text-xl font-black">
                  {application.student}
                </div>

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

                {/* View Profile Link */}
                <Link
                  to={`/company/candidates/1`}
                  className="text-sm font-bold text-black underline flex items-center gap-1"
                >
                  View Candidate Profile
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <Link
              to={`/company/review/1`}
              className="bg-[#5D0CA0] text-white border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded-[4px] font-bold transition"
            >
              Review
            </Link>

          </div>
        ))}
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
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Briefcase, Clock, Github, Link as LinkIcon } from "lucide-react";

export const ReviewSubmission = () => {
  useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"Pending" | "Approved" | "Rejected">(
    "Pending"
  );

  const candidate = {
    name: "Sarah Chen",
    internship: "Frontend Developer Internship",
    appliedAt: "2 hours ago",
    github: "https://github.com/sarahchen",
    portfolio: "https://portfolio.com",
    motivation:
      "I want to gain structured real-world frontend experience and contribute to a professional development team.",
  };

  return (
    <div className="flex flex-col gap-10 px-30 py-15">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="w-fit border-[3px] border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded-[4px] hover:translate-y-[2px] hover:shadow-none transition font-bold"
      >
        ← Back
      </button>

      {/* CARD */}
      <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_black] rounded-[4px] p-10 flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex items-center gap-6">

          {/* AVATAR */}
          <div className="w-24 h-24 flex items-center justify-center rounded-[4px] bg-[#5D0CA0] border-[3px] border-black text-white shadow-[4px_4px_0px_black]">
            <User size={32} />
          </div>

          <div className="flex flex-col gap-3">

            <div className="text-2xl font-black">
              {candidate.name}
            </div>

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

        {/* LINKS */}
        <div className="flex gap-6">

          <a
            href={candidate.github}
            target="_blank"
            className="flex items-center gap-2 underline font-bold"
          >
            <Github size={16} />
            GitHub
          </a>

          <a
            href={candidate.portfolio}
            target="_blank"
            className="flex items-center gap-2 underline font-bold"
          >
            <LinkIcon size={16} />
            Portfolio
          </a>

        </div>

        {/* MOTIVATION */}
        <div className="border-[3px] border-black rounded-[4px] p-6 shadow-[4px_4px_0px_black] bg-[#F8F7FF]">
          <h3 className="font-black mb-3">Motivation Letter</h3>
          <p>{candidate.motivation}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">

          {status === "Pending" && (
            <>
              {/* APPROVE - ФИОЛЕТОВАЯ */}
              <button
                onClick={() => setStatus("Approved")}
                className="bg-[#5D0CA0] text-white border-[3px] border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded-[4px] hover:translate-y-[2px] hover:shadow-none transition font-black"
              >
                Approve
              </button>

              {/* REJECT - БЕЛАЯ */}
              <button
                onClick={() => setStatus("Rejected")}
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
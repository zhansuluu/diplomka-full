import { ArrowLeft, Mail, Star } from "lucide-react";
import { FileText, Download } from "lucide-react";
import { useState } from "react";

export const CandidateProfile = () => {
  const [showResume, setShowResume] = useState(false);
  const candidate = {
    name: "Sarah Chen",
    university: "Stanford University",
    score: 92,
    experience: "1 year",
    skills: ["Marketing", "Data Analysis", "Excel", "Power BI"],
    internships: [
      {
        title: "Marketing Strategy Case",
        company: "TechStart Inc",
        score: 95,
      },
      {
        title: "Data Analytics Internship",
        company: "FinCorp",
        score: 89,
      },
      {
        title: "Growth Marketing Project",
        company: "StartupX",
        score: 91,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-10 px-24 py-14 animate-fadeIn">

      {/* Main Profile Card */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 flex flex-col gap-8">

        {/* Top Section */}
        <div className="flex justify-between items-start">

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-purple-700 text-white rounded-full flex items-center justify-center text-3xl font-bold border-2 border-black">
              SC
            </div>

            <div>
              <h2 className="text-3xl font-bold">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.university}</p>
              <p className="text-gray-600 mt-1">
                Experience: {candidate.experience}
              </p>
            </div>
          </div>

          {/* Score Badge */}
          <div className="bg-[#EDE7FF] border-2 border-black px-6 py-3 rounded shadow-[4px_4px_0px_black] flex items-center gap-2">
            <Star size={18} />
            <span className="font-bold text-lg">
              {candidate.score} / 100
            </span>
          </div>

        </div>

        {/* Internship Results */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Completed Internships</h3>

          <div className="flex flex-col gap-4">
            {candidate.internships.map((internship, index) => (
              <div
                key={index}
                className="border-2 border-black rounded p-5 shadow-[4px_4px_0px_black] bg-[#F8F8F8] flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{internship.title}</p>
                  <p className="text-gray-600 text-sm">
                    {internship.company}
                  </p>
                </div>

                <div className="font-bold text-purple-700 text-lg">
                  {internship.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

<button
  onClick={() => setShowResume(!showResume)}
  className="mt-4 bg-purple-700 text-white border-2 border-black rounded py-4 text-lg shadow-[6px_6px_0px_black]  flex items-center justify-center gap-2"
>
  {showResume ? "Hide Resume" : "See Resume"}
</button>
{showResume && (
  <div className="mt-10">

  <div className="bg-white border-2 border-black py-18 px-22 shadow-[4px_4px_0px_black] rounded max-w-4xl mx-auto">

    <h1 className="text-3xl font-bold text-center">
      Jessica Smith
    </h1>

    <p className="text-center text-gray-600 mt-2">
      jessica.smith@email.com • +7 (777) 777-7777 • San Francisco, CA
    </p>

    <hr className="my-8 border-black" />

    <SectionTitle title="EDUCATION" />
    <div className="mb-8">
      <h4 className="font-bold">
        Bachelor of Science in Computer Science
      </h4>
      <p className="text-gray-600">
        University of California, Berkeley
      </p>
      <p className="text-gray-600 text-sm">
        Expected Graduation: May 2026 • GPA: 3.8/4.0
      </p>
    </div>

    <SectionTitle title="EXPERIENCE" />

    <div className="mb-6">
      <h4 className="font-bold">
        Software Engineering Intern • TechCorp
      </h4>
      <p className="text-gray-600 text-sm">
        June 2025 – August 2025
      </p>
      <ul className="list-disc ml-6 text-gray-700 text-sm mt-2 space-y-1">
        <li>Developed and deployed 5+ full-stack features using React and Node.js</li>
        <li>Improved application performance by 30%</li>
        <li>Collaborated in Agile environment</li>
      </ul>
    </div>

    <div className="mb-8">
      <h4 className="font-bold">
        Frontend Developer Intern • StartupXYZ
      </h4>
      <p className="text-gray-600 text-sm">
        June 2024 – August 2024
      </p>
      <ul className="list-disc ml-6 text-gray-700 text-sm mt-2 space-y-1">
        <li>Built responsive UI components with React and Tailwind CSS</li>
        <li>Implemented design system used across 10+ pages</li>
        <li>Participated in code reviews</li>
      </ul>
    </div>

    <SectionTitle title="SKILLS" />

    <div className="text-sm text-gray-700 space-y-2">
      <p><strong>Languages:</strong> JavaScript, TypeScript, Python</p>
      <p><strong>Frameworks:</strong> React, Node.js, Tailwind CSS</p>
      <p><strong>Tools:</strong> Git, Docker, AWS</p>
    </div>

  </div>
</div>)}
      </div>

    </div>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <>
    <h2 className="font-bold text-lg tracking-wide">{title}</h2>
    <hr className="my-4 border-black" />
  </>
);
import { ArrowLeft, Mail, Star, Github } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { applicationService, studentService, internshipService } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";

export const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showResume, setShowResume] = useState(false);

  const { data: candidate, loading } = useAsyncData(
    () => (id ? studentService.getStudent(id) : Promise.reject(new Error("Missing candidate ID"))),
    [id]
  );

  const { data: applications = [] } = useAsyncData(
    () =>
      user?.id ? applicationService.listForCompany(user.id) : Promise.resolve([]),
    [user?.id]
  );

  const candidateApplications = useMemo(
    () => (applications ?? []).filter((application) => application.studentId === id),
    [applications, id]
  );

  const { data: internships = [] } = useAsyncData(
    async () => {
      const loaded = await Promise.all(
        candidateApplications.map((application) =>
          internshipService.getInternship(application.internshipId)
        )
      );
      return loaded;
    },
    [candidateApplications.map((item) => item.id).join(",")]
  );

  const averageScore =
    candidateApplications.length > 0
      ? Math.round(
          candidateApplications.reduce((sum, application) => sum + application.score, 0) /
            candidateApplications.length
        )
      : 0;

  if (loading || !candidate) {
    return <div className="px-24 py-14">Loading candidate...</div>;
  }

  return (
    <div className="flex flex-col gap-10 px-24 py-14 animate-fadeIn">
      <Link
        to="/company/candidates"
        className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to candidates
      </Link>

      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-purple-700 text-white rounded-full flex items-center justify-center text-3xl font-bold border-2 border-black">
              {`${candidate.firstName[0] ?? ""}${candidate.lastName[0] ?? ""}`.toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {candidate.firstName} {candidate.lastName}
              </h2>
              <p className="text-gray-600">
                {candidate.education[0]?.institutionName ?? "University not specified"}
              </p>
              <p className="text-gray-600 mt-1">
                Experience: {candidate.experience.length} roles
              </p>
            </div>
          </div>

          <div className="bg-[#EDE7FF] border-2 border-black px-6 py-3 rounded shadow-[4px_4px_0px_black] flex items-center gap-2">
            <Star size={18} />
            <span className="font-bold text-lg">{averageScore} / 100</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span className="inline-flex items-center gap-2">
            <Mail size={16} />
            {candidate.contactEmail || candidate.email}
          </span>
          {candidate.githubUrl && (
            <a
              href={candidate.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 underline font-semibold"
            >
              <Github size={16} />
              GitHub
            </a>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Completed Internships</h3>

          <div className="flex flex-col gap-4">
            {candidateApplications.length > 0 ? (
              candidateApplications.map((application, index) => (
                <div
                  key={application.id}
                  className="border-2 border-black rounded p-5 shadow-[4px_4px_0px_black] bg-[#F8F8F8] flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {internships?.[index]?.title ?? "Internship"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Status: {application.status}
                    </p>
                  </div>

                  <div className="font-bold text-purple-700 text-lg">
                    {application.score}%
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No applications yet.</div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm bg-[#EDE7FF] text-purple-700 border border-black rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowResume(!showResume)}
          className="mt-4 bg-purple-700 text-white border-2 border-black rounded py-4 text-lg shadow-[6px_6px_0px_black] flex items-center justify-center gap-2"
        >
          {showResume ? "Hide Resume" : "See Resume"}
        </button>

        {showResume && (
          <div className="mt-10">
            <div className="bg-white border-2 border-black py-18 px-22 shadow-[4px_4px_0px_black] rounded max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-center">
                {candidate.firstName} {candidate.lastName}
              </h1>

              <p className="text-center text-gray-600 mt-2">
                {candidate.contactEmail || candidate.email}
                {candidate.phone ? ` • ${candidate.phone}` : ""}
                {candidate.location ? ` • ${candidate.location}` : ""}
              </p>

              <hr className="my-8 border-black" />

              <SectionTitle title="EDUCATION" />
              {candidate.education.map((education) => (
                <div key={education.id} className="mb-8">
                  <h4 className="font-bold">{education.degree}</h4>
                  <p className="text-gray-600">{education.institutionName}</p>
                  <p className="text-gray-600 text-sm">
                    {education.fieldOfStudy}
                    {education.gpa ? ` • GPA: ${education.gpa}` : ""}
                  </p>
                </div>
              ))}

              <SectionTitle title="EXPERIENCE" />
              {candidate.experience.map((experience) => (
                <div key={experience.id} className="mb-6">
                  <h4 className="font-bold">{experience.jobTitle}</h4>
                  <p className="text-gray-600 text-sm">{experience.companyName}</p>
                  {experience.description && (
                    <ul className="list-disc ml-6 text-gray-700 text-sm mt-2 space-y-1">
                      {experience.description.split(/\r?\n/).map((line, index) => (
                        <li key={`${experience.id}-${index}`}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <SectionTitle title="SKILLS" />
              <div className="text-sm text-gray-700 space-y-2">
                <p>{candidate.skills.join(", ") || "No skills listed"}</p>
              </div>
            </div>
          </div>
        )}
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

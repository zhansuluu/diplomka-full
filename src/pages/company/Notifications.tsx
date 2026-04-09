import { Mail, UserCheck, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { applicationService, internshipService, studentService, taskSubmissionService } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";

type Notification = {
  id: string;
  type: "application" | "submission";
  title: string;
  body: string;
  time: string;
  link?: string;
};

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.round(diffHours / 24);
  return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
}

export const Notifications = () => {
  const { user } = useAuth();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const { data: applications = [] } = useAsyncData(
    () => (user?.id ? applicationService.listForCompany(user.id) : Promise.resolve([])),
    [user?.id]
  );

  const { data: submissions = [] } = useAsyncData(
    () => (user?.id ? taskSubmissionService.listForCompany(user.id) : Promise.resolve([])),
    [user?.id]
  );

  const { data: internships = [] } = useAsyncData(
    async () => {
      const internshipIds = [
        ...new Set([
          ...(applications ?? []).map((item) => item.internshipId),
          ...(submissions ?? []).map((item) => item.internshipId),
        ]),
      ];

      return Promise.all(internshipIds.map((id) => internshipService.getInternship(id)));
    },
    [
      user?.id,
      (applications ?? []).map((item) => item.id).join(","),
      (submissions ?? []).map((item) => item.id).join(","),
    ]
  );

  const { data: students = [] } = useAsyncData(
    async () => {
      const studentIds = [
        ...new Set([
          ...(applications ?? []).map((item) => item.studentId),
          ...(submissions ?? []).map((item) => item.studentId),
        ]),
      ];

      return Promise.all(studentIds.map((id) => studentService.getStudent(id)));
    },
    [
      user?.id,
      (applications ?? []).map((item) => item.id).join(","),
      (submissions ?? []).map((item) => item.id).join(","),
    ]
  );

  const items = useMemo<Notification[]>(() => {
    const safeApplications = applications ?? [];
    const safeSubmissions = submissions ?? [];
    const internshipById = Object.fromEntries((internships ?? []).map((item) => [item.id, item]));
    const studentById = Object.fromEntries((students ?? []).map((item) => [item.id, item]));

    const applicationNotifications: Notification[] = safeApplications.map((application) => {
      const student = studentById[application.studentId];
      const internship = internshipById[application.internshipId];
      const studentName = student
        ? `${student.firstName} ${student.lastName}`.trim()
        : "A student";

      return {
        id: `application-${application.id}`,
        type: "application",
        title: `New applicant for ${internship?.title ?? "your internship"}`,
        body: `${studentName} applied to ${internship?.title ?? "this internship"}.`,
        time: formatRelative(application.appliedAt),
        link: `/company/applications/review/${application.id}`,
      };
    });

    const submissionNotifications: Notification[] = safeSubmissions.map((submission) => {
      const student = studentById[submission.studentId];
      const internship = internshipById[submission.internshipId];
      const studentName = student
        ? `${student.firstName} ${student.lastName}`.trim()
        : "A student";

      return {
        id: `submission-${submission.id}`,
        type: "submission",
        title: `New task submission for ${internship?.title ?? "your internship"}`,
        body: `${studentName} submitted "${submission.taskTitle}".`,
        time: formatRelative(submission.submittedAt),
        link: `/company/review/${submission.id}`,
      };
    });

      return [...submissionNotifications, ...applicationNotifications]
      .filter((item) => !dismissedIds.includes(item.id))
      .sort((a, b) => {
        const aSource = a.type === "submission"
          ? safeSubmissions.find((item) => `submission-${item.id}` === a.id)?.submittedAt ?? ""
          : safeApplications.find((item) => `application-${item.id}` === a.id)?.appliedAt ?? "";
        const bSource = b.type === "submission"
          ? safeSubmissions.find((item) => `submission-${item.id}` === b.id)?.submittedAt ?? ""
          : safeApplications.find((item) => `application-${item.id}` === b.id)?.appliedAt ?? "";
        return new Date(bSource).getTime() - new Date(aSource).getTime();
      });
  }, [applications, dismissedIds, internships, students, submissions]);

  const dismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-10 px-30 py-8">
      <div className="animate-slideInRight">
        <h2 className="text-4xl font-bold">Notifications</h2>
        <p className="text-gray-600 mt-2">
          Get news about students interested in your cases and fresh task submissions.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded flex flex-col items-center justify-center text-center gap-6 p-20 animate-stagger-1">
          <div className="w-24 h-24 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black]">
            <Mail size={40} />
          </div>

          <h3 className="text-2xl font-bold">No notifications yet.</h3>

          <p className="text-gray-600 max-w-lg">Your notifications will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((n) => (
            <div
              key={n.id}
              className="bg-white border-2 border-black p-6 rounded shadow-[4px_4px_0px_black] flex items-start gap-4 justify-between"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center">
                  {n.type === "application" && <UserCheck size={20} />}
                  {n.type === "submission" && <FileText size={20} />}
                </div>

                <div>
                  <h4 className="font-semibold">{n.title}</h4>
                  <p className="text-sm text-gray-600">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {n.link && (
                  <Link
                    to={n.link}
                    className="border-2 border-black px-4 py-2 bg-white rounded text-center"
                  >
                    Open
                  </Link>
                )}
                <button
                  onClick={() => dismiss(n.id)}
                  className="border-2 border-black px-4 py-2 bg-white rounded"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

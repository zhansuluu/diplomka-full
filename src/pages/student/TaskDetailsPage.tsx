import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, X, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { applicationService, mentorService, taskSubmissionService } from "../../api";
import { getCaseTaskById } from "../../api/localDb";
import { useAsyncData } from "../../hooks/useAsyncData";

const MENTOR_STORAGE_PREFIX = "caseup:mentor-thread";

type Status = "not_started" | "in_progress" | "completed";
type MentorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function getStorageKey(studentId: string, internshipId: string) {
  return `caseup:student-task-status:${studentId}:${internshipId}`;
}

function getActiveInternshipStorageKey(userId: string) {
  return `caseup:selected-internship-id:${userId}`;
}

function readStatuses(studentId: string, internshipId: string): Record<string, Status | "locked"> {
  try {
    const raw = localStorage.getItem(getStorageKey(studentId, internshipId));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Status | "locked">;
  } catch {
    return {};
  }
}

function writeStatuses(studentId: string, internshipId: string, statuses: Record<string, Status | "locked">) {
  localStorage.setItem(getStorageKey(studentId, internshipId), JSON.stringify(statuses));
}

function getMentorStorageKey(studentId: string, internshipId: string, taskId: string) {
  return `${MENTOR_STORAGE_PREFIX}:${studentId}:${internshipId}:${taskId}`;
}

function readMentorMessages(studentId: string, internshipId: string, taskId: string): MentorMessage[] {
  try {
    const raw = localStorage.getItem(getMentorStorageKey(studentId, internshipId, taskId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MentorMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMentorMessages(
  studentId: string,
  internshipId: string,
  taskId: string,
  messages: MentorMessage[]
) {
  localStorage.setItem(getMentorStorageKey(studentId, internshipId, taskId), JSON.stringify(messages));
}

export const TaskDetailsPage = () => {
  const { user, userRole } = useAuth();
  const { taskId } = useParams<{ taskId: string }>();
  const [mentorOpen, setMentorOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState<Status>("in_progress");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([]);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorError, setMentorError] = useState("");

  const { data: applications = [] } = useAsyncData(
    () =>
      userRole === "student" && user?.id
        ? applicationService.listForStudent(user.id)
        : Promise.resolve([]),
    [user?.id, userRole]
  );

  const savedInternshipId =
    typeof window !== "undefined" && user?.id
      ? window.localStorage.getItem(getActiveInternshipStorageKey(user.id))
      : null;

  const activeApplication =
    (applications ?? []).find((application) => application.internshipId === savedInternshipId) ??
    [...(applications ?? [])]
    .sort((a, b) => {
      const rank = (value: string) => (value === "ACCEPTED" ? 0 : value === "PENDING" ? 1 : 2);
      return rank(a.status) - rank(b.status);
    })[0];

  const internshipId = activeApplication?.internshipId ?? null;
  const task = useMemo(() => (taskId ? getCaseTaskById(taskId) : null), [taskId]);
  const { data: existingSubmission, refetch: refetchSubmission } = useAsyncData(
    () =>
      user?.id && internshipId && taskId
        ? taskSubmissionService.getForStudentTask(user.id, internshipId, taskId)
        : Promise.resolve(null),
    [internshipId, taskId, user?.id]
  );

  useEffect(() => {
    if (!user?.id || !internshipId || !taskId) return;
    const statuses = readStatuses(user.id, internshipId);
    const next = statuses[taskId];
    if (next === "not_started" || next === "in_progress" || next === "completed") {
      setStatus(next);
    }
  }, [internshipId, taskId, user?.id]);

  useEffect(() => {
    if (existingSubmission) {
      setSubmitMessage("Your latest submission is saved and waiting for company review.");
    }
  }, [existingSubmission]);

  useEffect(() => {
    if (!user?.id || !internshipId || !taskId) return;
    setMentorMessages(readMentorMessages(user.id, internshipId, taskId));
  }, [internshipId, taskId, user?.id]);

  useEffect(() => {
    if (!user?.id || !internshipId || !taskId) return;
    writeMentorMessages(user.id, internshipId, taskId, mentorMessages);
  }, [internshipId, mentorMessages, taskId, user?.id]);

  const getStatusLabel = () => {
    switch (status) {
      case "not_started":
        return "Not Started";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "not_started":
        return "bg-yellow-400";
      case "in_progress":
        return "bg-[#5D0CA0]";
      case "completed":
        return "bg-green-500";
    }
  };

  const setTaskStatus = (nextStatus: Status) => {
    setStatus(nextStatus);
    if (!user?.id || !internshipId || !taskId) return;
    const statuses = readStatuses(user.id, internshipId);
    statuses[taskId] = nextStatus;
    writeStatuses(user.id, internshipId, statuses);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const readFileAsDataUrl = (input: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Could not read the selected file."));
      reader.readAsDataURL(input);
    });

  const handleSubmit = async () => {
    if (!file || !internshipId || !taskId) return;

    try {
      setSubmitting(true);
      setSubmitMessage("");

      const fileDataUrl = await readFileAsDataUrl(file);
      await taskSubmissionService.submit({
        internshipId,
        taskId,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        fileDataUrl,
      });

      await refetchSubmission();
      setTaskStatus("completed");
      setSubmitMessage("Submission saved. The company can now review it in Submissions.");
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Could not submit the task.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendMentorMessage = async (messageText?: string) => {
    const message = (messageText ?? mentorInput).trim();
    if (!message || !task) return;

    const nextUserMessage: MentorMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    const nextHistory = [...mentorMessages, nextUserMessage];
    setMentorMessages(nextHistory);
    setMentorInput("");
    setMentorLoading(true);
    setMentorError("");

    try {
      const reply = await mentorService.askAboutTask({
        task,
        history: mentorMessages.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        userMessage: message,
      });

      setMentorMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      setMentorError(
        error instanceof Error ? error.message : "The AI mentor could not answer right now."
      );
    } finally {
      setMentorLoading(false);
    }
  };

  const quickPrompts = [
    "Summarize this task for me",
    "Break this task into steps",
    "What should I check before submission?",
  ];

  if (!task || !internshipId) {
    return (
      <div className="flex-1 px-20 py-8">
        <Link
          to="/student/my-internship/tasks"
          className="w-fit flex items-center gap-2 border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to Board
        </Link>
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 max-w-2xl">
          <p className="text-gray-700">Task not found for the current internship.</p>
        </div>
      </div>
    );
  }

  const requirementLines = task.requirements.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const acceptanceLines = task.acceptance.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  return (
    <div className="flex relative">
      <div className={`flex-1 px-20 py-8 transition-all duration-300 ${mentorOpen ? "mr-[400px]" : ""}`}>
        <Link
          to="/student/my-internship/tasks"
          className="w-fit flex items-center gap-2 border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to Board
        </Link>

        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-6 flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>

            <div className="flex gap-3 flex-wrap">
              <span className="border border-black px-3 py-1 rounded bg-black text-white text-sm">
                {task.difficulty}
              </span>

              <span className="border border-black px-3 py-1 rounded bg-black text-white text-sm">
                {task.duration}
              </span>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-4 py-1 rounded border-2 border-black shadow-[4px_4px_0px_black] text-sm text-white transition ${getStatusColor()}`}
                >
                  {getStatusLabel()}
                  <span className="text-xs">Р Р‹</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded z-20 animate-fadeIn">
                    <button
                      onClick={() => {
                        setTaskStatus("not_started");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-yellow-100 transition"
                    >
                      Not Started
                    </button>

                    <button
                      onClick={() => {
                        setTaskStatus("in_progress");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-100 transition"
                    >
                      In Progress
                    </button>

                    <button
                      onClick={() => {
                        setTaskStatus("completed");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-100 transition"
                    >
                      Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setMentorOpen((prev) => !prev)}
            className="border-2 border-black px-4 py-2 bg-purple-100 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            AI Mentor
          </button>
        </div>

        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 flex flex-col gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Objective</h3>
            <p className="text-gray-700 leading-relaxed">{task.objective}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="flex flex-col gap-2">
              {requirementLines.map((line) => (
                <li key={line}>? {line}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Acceptance Criteria</h3>
            <ul className="list-disc ml-5 text-gray-700 flex flex-col gap-2">
              {acceptanceLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8">
          <h3 className="text-lg font-semibold mb-6">Your Solution</h3>

          {existingSubmission && (
            <div className="mb-6 border-2 border-black rounded p-4 bg-[#F8F7FF]">
              <p className="font-semibold">{existingSubmission.fileName}</p>
              <p className="text-sm text-gray-600 mt-1">
                Latest status: {existingSubmission.status}
              </p>
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed border-black rounded p-16 flex flex-col items-center justify-center gap-6 transition ${
              dragActive ? "bg-[#EDE7FF]" : ""
            }`}
          >
            <p className="text-gray-600 text-lg">
              {file ? file.name : "Drag and drop your files"}
            </p>

            <label className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] rounded cursor-pointer hover:translate-y-[2px] hover:shadow-none transition">
              {file ? "Choose Another File" : "Choose File"}
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!file || submitting}
              className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_black]"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {submitMessage && <p className="mt-4 text-sm text-gray-700">{submitMessage}</p>}
        </div>
      </div>

      {mentorOpen && (
        <div className="fixed right-0 top-0 h-full w-[400px] bg-white border-l-2 border-black shadow-[-6px_0px_0px_black] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles size={18} className="text-[#5D0CA0]" />
              AI Mentor
            </div>

            <button onClick={() => setMentorOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="bg-[#EDE7FF] p-4 rounded text-sm mb-4">
            I can help you break this task down, clarify requirements, and check whether your solution covers the acceptance criteria.
          </div>

          <div className="border-2 border-black rounded p-3 mb-4 bg-[#F8F7FF] text-sm">
            <p className="font-semibold">AI Mentor is configured through environment variables.</p>
            <p className="text-gray-600 mt-1">
              Set <code>VITE_OPENAI_API_KEY</code> in your local <code>.env</code> file to enable responses.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => void sendMentorMessage(prompt)}
                disabled={mentorLoading}
                className="border-2 border-black px-3 py-2 bg-white rounded text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto border-2 border-black rounded p-3 bg-[#FCFCFF] flex flex-col gap-3">
            {mentorMessages.length === 0 && (
              <p className="text-sm text-gray-500">
                Ask about requirements, planning, risks, or how to self-check your work.
              </p>
            )}

            {mentorMessages.map((message) => (
              <div
                key={message.id}
                className={`rounded p-3 text-sm whitespace-pre-wrap ${
                  message.role === "assistant"
                    ? "bg-[#EDE7FF] border border-black"
                    : "bg-white border border-gray-300"
                }`}
              >
                <p className="font-semibold mb-1">
                  {message.role === "assistant" ? "AI Mentor" : "You"}
                </p>
                <p>{message.content}</p>
              </div>
            ))}

            {mentorLoading && (
              <div className="rounded p-3 text-sm bg-[#EDE7FF] border border-black">
                <p className="font-semibold mb-1">AI Mentor</p>
                <p>Thinking through your task...</p>
              </div>
            )}
          </div>

          {mentorError && (
            <div className="mt-4 border-2 border-red-300 bg-red-50 rounded p-3 text-sm text-red-700">
              {mentorError}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={mentorInput}
              onChange={(e) => setMentorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void sendMentorMessage();
                }
              }}
              placeholder="Ask About This Task..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <button
              onClick={() => void sendMentorMessage()}
              disabled={mentorLoading || !mentorInput.trim()}
              className="bg-[#5D0CA0] text-white px-4 rounded disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { applicationService } from "../../api";
import { getCaseTasks } from "../../api/localDb";

function getActiveInternshipStorageKey(userId: string) {
  return `caseup:selected-internship-id:${userId}`;
}

type Status = "locked" | "not_started" | "in_progress" | "completed";

type Task = {
  id: string;
  title: string;
  status: Status;
  tools: string[];
};

function getStorageKey(studentId: string, internshipId: string) {
  return `caseup:student-task-status:${studentId}:${internshipId}`;
}

function buildDefaultStatuses(taskIds: string[]): Record<string, Status> {
  return Object.fromEntries(
    taskIds.map((taskId, index) => {
      if (index === 0) return [taskId, "in_progress" as Status];
      if (index === 1) return [taskId, "not_started" as Status];
      return [taskId, "locked" as Status];
    })
  );
}

function readStatuses(studentId: string, internshipId: string, taskIds: string[]): Record<string, Status> {
  try {
    const raw = localStorage.getItem(getStorageKey(studentId, internshipId));
    if (!raw) return buildDefaultStatuses(taskIds);
    const parsed = JSON.parse(raw) as Record<string, Status>;
    return { ...buildDefaultStatuses(taskIds), ...parsed };
  } catch {
    return buildDefaultStatuses(taskIds);
  }
}

function writeStatuses(studentId: string, internshipId: string, statuses: Record<string, Status>) {
  localStorage.setItem(getStorageKey(studentId, internshipId), JSON.stringify(statuses));
}

function inferTools(requirements: string): string[] {
  return requirements
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export const KanbanBoard = () => {
  const { user, userRole } = useAuth();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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
      const rank = (status: string) => (status === "ACCEPTED" ? 0 : status === "PENDING" ? 1 : 2);
      return rank(a.status) - rank(b.status);
    })[0];

  const internshipId = activeApplication?.internshipId ?? null;
  const caseTasks = internshipId ? getCaseTasks(internshipId) : [];
  const taskIds = caseTasks.map((task) => task.id);

  const [taskStatuses, setTaskStatuses] = useState<Record<string, Status>>(() =>
    user?.id && internshipId ? readStatuses(user.id, internshipId, taskIds) : {}
  );

  useEffect(() => {
    if (!user?.id || !internshipId) {
      setTaskStatuses({});
      return;
    }
    setTaskStatuses(readStatuses(user.id, internshipId, taskIds));
  }, [internshipId, taskIds.join(","), user?.id]);

  const tasks = useMemo<Task[]>(() => {
    if (!user?.id || !internshipId) return [];
    const statuses = Object.keys(taskStatuses).length > 0
      ? taskStatuses
      : readStatuses(user.id, internshipId, taskIds);

    return caseTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: statuses[task.id] ?? "locked",
      tools: inferTools(task.requirements),
    }));
  }, [caseTasks, internshipId, taskIds, taskStatuses, user?.id]);

  const columns: { title: string; key: Status }[] = [
    { title: "Locked", key: "locked" },
    { title: "Not Started", key: "not_started" },
    { title: "In Progress", key: "in_progress" },
    { title: "Completed", key: "completed" },
  ];

  const updateStatuses = (nextStatuses: Record<string, Status>) => {
    if (!user?.id || !internshipId) return;
    setTaskStatuses(nextStatuses);
    writeStatuses(user.id, internshipId, nextStatuses);
  };

  const handleDrop = (status: Status) => {
    if (!draggedTask || !user?.id || !internshipId) return;
    if (draggedTask.status === "locked") return;
    if (status === "locked") return;

    const nextStatuses = {
      ...readStatuses(user.id, internshipId, taskIds),
      [draggedTask.id]: status,
    };

    updateStatuses(nextStatuses);
    setDraggedTask(null);
  };

  const getBadgeColor = (status: Status) => {
    switch (status) {
      case "locked":
        return "bg-gray-500";
      case "not_started":
        return "bg-yellow-400";
      case "in_progress":
        return "bg-[#5D0CA0]";
      case "completed":
        return "bg-green-500";
    }
  };

  if (!internshipId) {
    return (
      <div className="h-[calc(100vh-120px)] px-10 flex flex-col">
        <h2 className="text-3xl font-bold mb-6">Project Board</h2>
        <div className="bg-white border-2 border-black rounded shadow-[4px_4px_0px_black] p-8 max-w-2xl">
          <p className="text-gray-700 mb-4">No active internship selected yet.</p>
          <Link
            to="/student/my-internship"
            className="inline-block bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded"
          >
            Open My Internship
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] px-10 flex flex-col">
      <h2 className="text-3xl font-bold mb-6">Project Board</h2>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 min-w-max h-full pb-4">
          {columns.map((column) => (
            <div
              key={column.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.key)}
              className="bg-white border-2 border-black rounded shadow-[4px_4px_0px_black] w-[320px] flex-shrink-0 flex flex-col"
            >
              <div className="p-4 border-b-2 bg-purple-100 border-black font-semibold">
                {column.title}
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scroll">
                {tasks
                  .filter((task) => task.status === column.key)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable={task.status !== "locked"}
                      onDragStart={() =>
                        task.status !== "locked" && setDraggedTask(task)
                      }
                      className={`border-2 border-black rounded p-4 shadow-[4px_4px_0px_black] transition
                        ${
                          task.status === "locked"
                            ? "bg-gray-200 cursor-not-allowed opacity-70"
                            : "bg-gray-100 hover:translate-y-[2px] hover:shadow-none cursor-grab"
                        }`}
                    >
                      <Link to={`/student/my-internship/tasks/${task.id}`} className="block">
                        <p className="font-medium">{task.title}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {task.tools.map((tool, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 border border-black rounded bg-white"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>

                        <span
                          className={`mt-2 inline-block text-white text-xs px-3 py-1 rounded border border-black ${getBadgeColor(task.status)}`}
                        >
                          {column.title}
                        </span>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

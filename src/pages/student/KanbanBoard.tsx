import { useState } from "react";
import { Link } from "react-router-dom";

type Status =
  | "locked"
  | "not_started"
  | "in_progress"
  | "completed";

type Task = {
  id: number;
  title: string;
  status: Status;
  tools: string[];
};

const initialTasks: Task[] = [
  { id: 101, title: "Project Setup", status: "locked", tools: ["Node", "Vite"] },
  { id: 102, title: "Environment Config", status: "locked", tools: ["Docker"] },
  { id: 103, title: "Design Review", status: "locked", tools: ["Figma"] },
  { id: 104, title: "Architecture Plan", status: "locked", tools: ["Miro"] },

  { id: 1, title: "Build Header Component", status: "not_started", tools: ["React", "Tailwind"] },
  { id: 2, title: "Implement useState logic", status: "in_progress", tools: ["React"] },
  { id: 3, title: "Responsive Layout", status: "completed", tools: ["CSS", "Flexbox"] },
  { id: 4, title: "Add Validation", status: "not_started", tools: ["TypeScript", "Zod"] },
];

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: { title: string; key: Status }[] = [
    { title: "Locked", key: "locked" },
    { title: "Not Started", key: "not_started" },
    { title: "In Progress", key: "in_progress" },
    { title: "Completed", key: "completed" },
  ];

  const handleDrop = (status: Status) => {
    if (!draggedTask) return;

    // 🔒 Нельзя трогать locked
    if (draggedTask.status === "locked") return;

    // Нельзя дропать в locked
    if (status === "locked") return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggedTask.id ? { ...task, status } : task
      )
    );

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

  return (
  <div className="h-[calc(100vh-120px)] px-10 flex flex-col">

    <h2 className="text-3xl font-bold mb-6">
      Project Board
    </h2>

    {/* 🔥 Horizontal Scroll Area */}
    <div className="flex-1 overflow-x-auto overflow-y-hidden">

      <div className="flex gap-6 min-w-max h-full pb-4">

        {columns.map((column) => (
          <div
            key={column.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.key)}
            className="bg-white border-2 border-black rounded shadow-[4px_4px_0px_black] w-[320px] flex-shrink-0 flex flex-col"
          >

            {/* Column Header */}
            <div className="p-4 border-b-2 bg-purple-100 border-black font-semibold">
              {column.title}
            </div>

            {/* 🔥 Vertical Scroll Inside Column */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scroll">

              {tasks
                .filter((task) => task.status === column.key)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable={task.status !== "locked"}
                    onDragStart={() =>
                      task.status !== "locked" &&
                      setDraggedTask(task)
                    }
                    className={`border-2 border-black rounded p-4 shadow-[4px_4px_0px_black] transition
                      ${
                        task.status === "locked"
                          ? "bg-gray-200 cursor-not-allowed opacity-70"
                          : "bg-gray-100 hover:translate-y-[2px] hover:shadow-none cursor-grab"
                      }`}
                  >
                    <Link
                      to="/student/my-internship/tasks/1"
                      className="block"
                    >
                      <p className="font-medium">
  {task.title}
</p>

{/* 🔥 Tools */}
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
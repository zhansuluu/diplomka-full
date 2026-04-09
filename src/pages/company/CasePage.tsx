import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ensureCaseTasksForInternship, saveCaseTasks } from "../../api/localDb";

type CaseTask = {
  id: string;
  caseId?: string;
  title: string;
  difficulty: string;
  duration: string;
  objective: string;
  requirements: string;
  acceptance: string;
};

export const CasePage = () => {
  const { id } = useParams<{ id: string }>();
  const caseKey = id ?? "default";

  const [tasks, setTasks] = useState<CaseTask[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const loaded = ensureCaseTasksForInternship(caseKey);
    setTasks(loaded);
    setSelectedId(loaded[0]?.id ?? null);
  }, [caseKey]);

  const selected = useMemo(
    () => tasks.find((t) => t.id === selectedId) ?? null,
    [tasks, selectedId]
  );

  const persist = useCallback(() => {
    saveCaseTasks(caseKey, tasks.map((task) => ({ ...task, caseId: caseKey })));
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, [caseKey, tasks]);

  const updateSelected = (patch: Partial<CaseTask>) => {
    if (!selectedId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, ...patch } : t))
    );
  };

  const addTask = () => {
    const t: CaseTask = {
      id: crypto.randomUUID(),
      title: "New task",
      difficulty: "Easy",
      duration: "1 day",
      objective: "",
      requirements: "",
      acceptance: "",
    };
    setTasks((prev) => [...prev, t]);
    setSelectedId(t.id);
  };

  const deleteSelected = () => {
    if (!selectedId || tasks.length <= 1) return;
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== selectedId);
      setSelectedId(next[0]?.id ?? null);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-10 px-8 sm:px-16 lg:px-24 py-14 animate-fadeIn max-w-[1600px]">
      {id && (
        <Link
          to={`/company/cases/${id}`}
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2 hover:translate-y-[2px] hover:shadow-none transition"
        >
          <ArrowLeft size={16} />
          Back to case
        </Link>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Manage tasks</h1>
          <p className="text-gray-600 mt-2">
            Edits are saved locally in this browser for case{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">{caseKey}</code>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {savedFlash && (
            <span className="text-sm text-green-700 font-medium">Saved</span>
          )}
          <button
            type="button"
            onClick={persist}
            className="flex items-center gap-2 border-2 border-black px-6 py-3 rounded bg-[#5D0CA0] text-white shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addTask}
              className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded bg-white shadow-[4px_4px_0px_black] text-sm font-semibold hover:bg-gray-50"
            >
              <Plus size={16} />
              Add task
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              disabled={!selectedId || tasks.length <= 1}
              className="flex items-center gap-2 border-2 border-red-300 text-red-700 px-4 py-2 rounded bg-white text-sm disabled:opacity-40"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedId(task.id)}
                className={`text-left border-2 border-black rounded px-4 py-3 shadow-[4px_4px_0px_black] transition ${
                  selectedId === task.id ? "bg-[#EDE7FF]" : "bg-white hover:bg-gray-50"
                }`}
              >
                <p className="font-semibold line-clamp-2">{task.title}</p>
                <div className="flex gap-3 text-sm mt-1">
                  <span className="text-green-700">{task.difficulty}</span>
                  <span className="text-gray-500">{task.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded p-10 shadow-[6px_6px_0px_black] min-h-[480px]">
          {selected ? (
            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="font-semibold">Title</span>
                <input
                  value={selected.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  className="border-2 border-black px-3 py-2 rounded text-sm"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="font-semibold">Difficulty</span>
                  <select
                    value={selected.difficulty}
                    onChange={(e) => updateSelected({ difficulty: e.target.value })}
                    className="border-2 border-black px-3 py-2 rounded text-sm bg-white"
                  >
                    {["Easy", "Medium", "Hard"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-semibold">Duration</span>
                  <input
                    value={selected.duration}
                    onChange={(e) => updateSelected({ duration: e.target.value })}
                    className="border-2 border-black px-3 py-2 rounded text-sm"
                    placeholder="e.g. 2 days"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-semibold">Objective</span>
                <textarea
                  value={selected.objective}
                  onChange={(e) => updateSelected({ objective: e.target.value })}
                  rows={4}
                  className="border-2 border-black px-3 py-2 rounded text-sm"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-semibold">Requirements (one per line)</span>
                <textarea
                  value={selected.requirements}
                  onChange={(e) => updateSelected({ requirements: e.target.value })}
                  rows={4}
                  className="border-2 border-black px-3 py-2 rounded text-sm font-mono"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-semibold">Acceptance criteria (one per line)</span>
                <textarea
                  value={selected.acceptance}
                  onChange={(e) => updateSelected({ acceptance: e.target.value })}
                  rows={4}
                  className="border-2 border-black px-3 py-2 rounded text-sm font-mono"
                />
              </label>
            </div>
          ) : (
            <p className="text-gray-500">Select a task.</p>
          )}
        </div>
      </div>
    </div>
  );
};

import { useMemo, useState } from "react";
import { Bot, CheckCircle, Trash2, FileText, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { creatorService, internshipService, mapGeneratedTasksToLocal } from "../../api";
import { saveCaseTasks } from "../../api/localDb";
import { useAuth } from "../../contexts/AuthContext";

type Step =
  | "idle"
  | "dragging"
  | "files-added"
  | "generating"
  | "success";

function isReadableTextFile(file: File): boolean {
  return (
    file.type.startsWith("text/") ||
    /\.(txt|md|json|csv|js|ts|tsx|jsx|html|css)$/i.test(file.name)
  );
}

async function readSupportedFiles(files: File[]): Promise<Array<{ name: string; content: string }>> {
  const readable = files.filter(isReadableTextFile);
  const results = await Promise.all(
    readable.map(async (file) => ({
      name: file.name,
      content: await file.text(),
    }))
  );

  return results.filter((file) => file.content.trim().length > 0);
}

function addWeeks(base: Date, weeks: number): string {
  const next = new Date(base);
  next.setDate(next.getDate() + weeks * 7);
  return next.toISOString();
}

export const AICreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const companyId = user?.id;

  const [step, setStep] = useState<Step>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(10);
  const [extraContext, setExtraContext] = useState("");
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [generatedProgram, setGeneratedProgram] = useState<Awaited<
    ReturnType<typeof creatorService.generateProgram>
  > | null>(null);

  const unsupportedFiles = useMemo(
    () => files.filter((file) => !isReadableTextFile(file)),
    [files]
  );

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const newFiles = Array.from(selected);
    setFiles((prev) => [...prev, ...newFiles]);
    setStep("files-added");
    setError("");
  };

  const handleGenerate = async () => {
    try {
      setError("");
      setGeneratedProgram(null);
      setStep("generating");
      setProgress(12);

      const interval = window.setInterval(() => {
        setProgress((value) => Math.min(value + 11, 88));
      }, 400);

      const readableFiles = await readSupportedFiles(files);
      const program = await creatorService.generateProgram({
        files: readableFiles,
        extraContext,
      });

      window.clearInterval(interval);
      setProgress(100);
      setGeneratedProgram(program);
      window.setTimeout(() => setStep("success"), 300);
    } catch (err) {
      setStep(files.length > 0 || extraContext.trim() ? "files-added" : "idle");
      setProgress(10);
      setError(
        err instanceof Error
          ? err.message
          : "The AI Creator could not generate a program."
      );
    }
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    if (updated.length === 0 && !extraContext.trim()) setStep("idle");
  };

  const handleCreateDraft = async () => {
    if (!companyId || !generatedProgram) {
      setError("You must be logged in as a company to create a draft.");
      return;
    }

    try {
      setPublishing(true);
      setError("");

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const created = await internshipService.createInternship({
        companyId,
        title: generatedProgram.title,
        description: generatedProgram.description,
        requirements: generatedProgram.requirements,
        startDate: startDate.toISOString(),
        endDate: addWeeks(startDate, generatedProgram.durationWeeks),
      });

      const aiTasks = mapGeneratedTasksToLocal(created.id, generatedProgram.tasks);
      saveCaseTasks(created.id, aiTasks);
      navigate(`/company/cases/${created.id}/tasks`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create the internship draft."
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="px-30 py-15 flex flex-col items-center relative z-10">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="bg-[#6D28D9] p-4 rounded shadow-[4px_4px_0px_black] border-2 border-black">
            <Bot className="text-white" size={28} />
          </div>

          <h1 className="text-3xl font-bold">AI Program Creator</h1>
          <p className="text-gray-600">
            Upload your job description and let AI create a complete internship program
          </p>
        </div>

        <div className="w-full max-w-3xl bg-white border-2 border-black shadow-[8px_8px_0px_black] p-8">
          {error && (
            <div className="mb-6 border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {step !== "generating" && step !== "success" && (
            <>
              <h2 className="text-xl font-bold mb-2">
                Upload Program Details
              </h2>
              <p className="mb-6 font-medium">
                Upload a text-based job description or role brief
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setStep("dragging");
                }}
                onDragLeave={() => {
                  if (files.length === 0 && !extraContext.trim()) setStep("idle");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed p-12 flex flex-col items-center gap-4 text-center transition-all ${
                  step === "dragging" ? "border-purple-600 bg-purple-50" : "border-black"
                }`}
              >
                <FileText size={40} className="text-gray-400" />
                <p className="text-gray-600">Drag and drop your files</p>

                <label className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              </div>

              <div className="mt-6">
                <p className="font-medium mb-3">Additional context</p>
                <textarea
                  value={extraContext}
                  onChange={(e) => {
                    setExtraContext(e.target.value);
                    if (e.target.value.trim()) setStep("files-added");
                  }}
                  rows={5}
                  className="w-full border-2 border-black p-3 rounded"
                  placeholder="Role level, preferred stack, desired outcomes, team context, or anything AI should consider..."
                />
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="font-medium">Uploaded Files</p>

                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex justify-between items-center border-2 border-black p-3 shadow-[3px_3px_0px_black]"
                    >
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className={`text-sm ${isReadableTextFile(file) ? "text-green-600" : "text-amber-700"}`}>
                          {isReadableTextFile(file)
                            ? "Ready for AI analysis"
                            : "Uploaded, but this demo reads text-based files best"}
                        </p>
                      </div>

                      <Trash2
                        size={18}
                        className="cursor-pointer"
                        onClick={() => removeFile(index)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {unsupportedFiles.length > 0 && (
                <div className="mt-6 bg-yellow-100 border-2 border-black p-4 shadow-[4px_4px_0px_black] text-sm">
                  PDF parsing is not enabled in this demo build yet. For the best result, upload `.txt`, `.md`, `.json`, `.csv`, or paste the brief into Additional context.
                </div>
              )}

              <div className="mt-8 bg-purple-100 border-2 border-black p-6 shadow-[4px_4px_0px_black]">
                <p className="font-semibold mb-3">What AI will create:</p>
                <ul className="space-y-2 text-sm">
                  <li>Structured task breakdown with milestones</li>
                  <li>Estimated timelines and dependencies</li>
                  <li>Learning objectives for each task</li>
                  <li>Acceptance criteria for review</li>
                  <li>An internship draft ready for Manage tasks</li>
                </ul>
              </div>

              <button
                disabled={(files.length === 0 && !extraContext.trim()) || !companyId}
                onClick={() => void handleGenerate()}
                className="mt-6 w-full bg-[#A78BFA] border-2 border-black py-3 font-semibold shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition disabled:opacity-50"
              >
                Generate Program with AI
              </button>
            </>
          )}

          {step === "generating" && (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <div className="w-14 h-14 bg-purple-600 animate-pulse border-2 border-black shadow-[4px_4px_0px_black]" />

              <h2 className="text-xl font-bold">
                AI is Generating Your Program...
              </h2>
              <p className="text-gray-600">
                This will take about 10 to 20 seconds
              </p>

              <div className="w-full border-2 border-black h-6 mt-4 overflow-hidden rounded-[4px]">
                <div
                  className="bg-purple-600 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-left text-sm mt-6 space-y-2">
                <p>Analyzing the role brief...</p>
                <p>Creating an internship structure...</p>
                <p>Generating task objectives and criteria...</p>
                <p>Preparing an editable draft...</p>
              </div>
            </div>
          )}

          {step === "success" && generatedProgram && (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <div className="bg-purple-600 p-4 border-2 border-black shadow-[4px_4px_0px_black]">
                <CheckCircle size={28} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold">
                Program Generated Successfully!
              </h2>

              <div className="w-full border-2 border-black p-6 shadow-[4px_4px_0px_black] text-left">
                <p className="font-semibold mb-3">Program Overview</p>
                <p><span className="font-medium">Title:</span> {generatedProgram.title}</p>
                <p><span className="font-medium">Total Tasks:</span> {generatedProgram.tasks.length}</p>
                <p><span className="font-medium">Estimated Duration:</span> {generatedProgram.durationWeeks} weeks</p>
                <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{generatedProgram.description}</p>
              </div>

              <div className="w-full border-2 border-black p-6 shadow-[4px_4px_0px_black] text-left bg-[#FCFCFF]">
                <p className="font-semibold mb-4">Generated Tasks</p>
                <div className="flex flex-col gap-4">
                  {generatedProgram.tasks.map((task) => (
                    <div key={task.title} className="border-2 border-black p-4 rounded">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold">{task.title}</p>
                        <div className="flex gap-2 text-xs">
                          <span className="border border-black px-2 py-1 rounded">{task.difficulty}</span>
                          <span className="border border-black px-2 py-1 rounded">{task.duration}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{task.objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 w-full">
                <button
                  onClick={() => {
                    setGeneratedProgram(null);
                    setFiles([]);
                    setExtraContext("");
                    setError("");
                    setProgress(10);
                    setStep("idle");
                  }}
                  className="w-1/2 border-2 border-black py-3 shadow-[4px_4px_0px_black]"
                >
                  Generate New Program
                </button>

                <button
                  onClick={() => void handleCreateDraft()}
                  disabled={publishing}
                  className="w-1/2 bg-[#A78BFA] border-2 border-black py-3 shadow-[4px_4px_0px_black] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {publishing ? <Loader size={18} className="animate-spin" /> : null}
                  {publishing ? "Creating Draft..." : "Edit & Customize Program"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Bot, CheckCircle, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

type Step =
  | "idle"
  | "dragging"
  | "files-added"
  | "generating"
  | "success";

export const AICreator = () => {
  const [step, setStep] = useState<Step>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(10);

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const newFiles = Array.from(selected);
    setFiles((prev) => [...prev, ...newFiles]);
    setStep("files-added");
  };

  const handleGenerate = () => {
    setStep("generating");

    let value = 10;
    const interval = setInterval(() => {
      value += 20;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep("success"), 600);
      }
    }, 600);
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    if (updated.length === 0) setStep("idle");
  };

  return (
    <div className="animate-fadeIn">

      <div className="px-30 py-15 flex flex-col items-center relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="bg-[#6D28D9] p-4 rounded shadow-[4px_4px_0px_black] border-2 border-black">
            <Bot className="text-white" size={28} />
          </div>

          <h1 className="text-3xl font-bold">AI Program Creator</h1>
          <p className="text-gray-600">
            Upload your job description and let AI create a complete internship program
          </p>
        </div>

        {/* CARD */}
        <div className="w-full max-w-3xl bg-white border-2 border-black shadow-[8px_8px_0px_black] p-8">

          {step !== "generating" && step !== "success" && (
            <>
              <h2 className="text-xl font-bold mb-2">
                Upload Program Details
              </h2>
              <p className="mb-6 font-medium">
                Upload Job Description (PDF or Text)
              </p>

              {/* DROPZONE */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setStep("dragging");
                }}
                onDragLeave={() => {
                  if (files.length === 0) setStep("idle");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed p-12 flex flex-col items-center gap-4 text-center transition-all
                  ${
                    step === "dragging"
                      ? "border-purple-600 bg-purple-50"
                      : "border-black"
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

              {/* FILES LIST */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="font-medium">Uploaded Files</p>

                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-2 border-black p-3 shadow-[3px_3px_0px_black]"
                    >
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-green-600">
                          Uploaded Successfully
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

              {/* INFO BOX */}
              <div className="mt-8 bg-purple-100 border-2 border-black p-6 shadow-[4px_4px_0px_black]">
                <p className="font-semibold mb-3">What AI will create:</p>
                <ul className="space-y-2 text-sm">
                  <li>✔ Structured task breakdown with milestones</li>
                  <li>✔ Estimated timelines and dependencies</li>
                  <li>✔ Learning objectives for each task</li>
                  <li>✔ Resource recommendations</li>
                  <li>✔ Evaluation criteria</li>
                </ul>
              </div>

              <button
                disabled={files.length === 0}
                onClick={handleGenerate}
                className="mt-6 w-full bg-[#A78BFA] border-2 border-black py-3 font-semibold shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition disabled:opacity-50"
              >
                Generate Program with AI
              </button>
            </>
          )}

          {/* GENERATING STATE */}
          {step === "generating" && (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <div className="w-14 h-14 bg-purple-600 animate-pulse border-2 border-black shadow-[4px_4px_0px_black]" />

              <h2 className="text-xl font-bold">
                AI is Generating Your Program...
              </h2>
              <p className="text-gray-600">
                This will take about 30 seconds
              </p>

<div className="w-full border-2 border-black h-6 mt-4 overflow-hidden rounded-[4px]">                <div
                  className="bg-purple-600 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-left text-sm mt-6 space-y-2">
                <p>✔ Analyzing job description...</p>
                <p>✔ Creating task structure...</p>
                <p>✔ Generating learning objectives...</p>
                <p>○ Finalizing program...</p>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <div className="bg-purple-600 p-4 border-2 border-black shadow-[4px_4px_0px_black]">
                <CheckCircle size={28} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold">
                Program Generated Successfully!
              </h2>

              <div className="w-full border-2 border-black p-6 shadow-[4px_4px_0px_black] text-left">
                <p className="font-semibold mb-3">Program Overview</p>
                <p>Total Tasks: 10</p>
                <p>Estimated Duration: 4 weeks</p>
                <p>Difficulty Level: Intermediate</p>
              </div>

              <div className="flex gap-6 w-full">
                <button
                  onClick={() => {
                    setFiles([]);
                    setStep("idle");
                  }}
                  className="w-1/2 border-2 border-black py-3 shadow-[4px_4px_0px_black]"
                >
                  Generate New Program
                </button>

                <Link to={`/company/cases/1/tasks`} className="w-1/2 bg-[#A78BFA] border-2 border-black py-3 shadow-[4px_4px_0px_black] flex items-center justify-center">
                  Edit & Customize Program
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
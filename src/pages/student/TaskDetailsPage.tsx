import { useState } from "react";
import { ArrowLeft, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type Status = "not_started" | "in_progress" | "completed";

export const TaskDetailsPage = () => {
  const [status, setStatus] = useState<Status>("in_progress");
  const [mentorOpen, setMentorOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const updateStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  // ===== File Logic =====
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

  const handleSubmit = () => {
    alert("File submitted successfully 🚀");
  };

  return (
    <div className="flex relative">

      {/* MAIN CONTENT */}
      <div className={`flex-1 px-20 py-8 transition-all duration-300 ${mentorOpen ? "mr-[400px]" : ""}`}>

        {/* Back */}
        <Link
          to="/student/my-internship/tasks"
          className="w-fit flex items-center gap-2 border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to Board
        </Link>

        {/* HEADER */}
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-6 flex justify-between items-start mb-8">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Build useState Interactive Component
            </h2>

            <div className="flex gap-3 flex-wrap">
              <span className="border border-black px-3 py-1 rounded bg-black text-white text-sm">
                Medium
              </span>

              <span className="border border-black px-3 py-1 rounded bg-black text-white text-sm">
                2 hours
              </span>
<div className="relative">

  {/* Selected */}
  <button
    onClick={() => setDropdownOpen((prev) => !prev)}
    className={`flex items-center gap-2 px-4 py-1 rounded border-2 border-black shadow-[4px_4px_0px_black] text-sm text-white transition ${getStatusColor()}`}
  >
    {getStatusLabel()}
    <span className="text-xs">▼</span>
  </button>

  {/* Dropdown */}
  {dropdownOpen && (
    <div className="absolute mt-2 w-full bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded z-20 animate-fadeIn">

      <button
        onClick={() => {
          setStatus("not_started");
          setDropdownOpen(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-yellow-100 transition"
      >
        Not Started
      </button>

      <button
        onClick={() => {
          setStatus("in_progress");
          setDropdownOpen(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-purple-100 transition"
      >
        In Progress
      </button>

      <button
        onClick={() => {
          setStatus("completed");
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

        {/* CONTENT */}
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 flex flex-col gap-8 mb-8">

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Objective
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Build a functional component that demonstrates your understanding
              of React hooks and state management.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Requirements
            </h3>

            <ul className="flex flex-col gap-2">
              <li>☐ Implement useState hook</li>
              <li>☐ Create at least 3 interactive elements</li>
              <li>☐ Handle input validation</li>
              <li>☐ Display feedback messages</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Acceptance Criteria
            </h3>

            <ul className="list-disc ml-5 text-gray-700 flex flex-col gap-2">
              <li>No console errors</li>
              <li>Code follows best practices</li>
              <li>UI is responsive</li>
            </ul>
          </div>

        </div>

        {/* FILE UPLOAD */}
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8">

          <h3 className="text-lg font-semibold mb-6">
            Your Solution
          </h3>

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
            {!file ? (
              <>
                <p className="text-gray-600 text-lg">
                  Drag and drop your files
                </p>

                <label className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] rounded cursor-pointer hover:translate-y-[2px] hover:shadow-none transition">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  {file.name}
                </p>

                <button
                  onClick={handleSubmit}
                  className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
                >
                  Submit
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* AI MENTOR SIDEBAR */}
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
            Hi! I'm your AI Mentor. Feel free to ask me anything about this task.
          </div>

          <div className="mt-auto flex gap-2">
            <input
              type="text"
              placeholder="Ask About This Task..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <button className="bg-[#5D0CA0] text-white px-4 rounded">
              →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
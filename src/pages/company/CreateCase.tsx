import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Loader, AlertCircle } from "lucide-react";
import { internshipService } from "../../api";
import { useAuth } from "../../contexts/AuthContext";

export const CreateCase = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const companyId = user?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setError("You must be logged in as a company.");
      return;
    }
    if (!title.trim() || !description.trim() || !requirements.trim() || !startDate || !endDate) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await internshipService.createInternship({
        companyId,
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      navigate(`/company/internships/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-10 px-30 py-15">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div>
          <h2 className="text-4xl font-bold">Create internship</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl">
            Publish a virtual internship listing for students to discover and apply.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded flex gap-2 items-start w-full">
            <AlertCircle className="text-red-600 shrink-0" size={22} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={handlePublish}
          className="bg-white border-2 border-black p-8 sm:p-12 shadow-[6px_6px_0px_black] rounded flex flex-col gap-8 w-full"
        >
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-black p-3 rounded"
            placeholder="e.g. Frontend engineering internship"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Description *</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="border-2 border-black p-3 rounded"
            placeholder="What will the intern do?"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Requirements *</span>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
            className="border-2 border-black p-3 rounded"
            placeholder="Skills, stack, time commitment…"
            required
          />
        </label>

        <div className="grid md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Start date *</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-black p-3 rounded"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">End date *</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 border-black p-3 rounded"
              required
            />
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !companyId}
            className="bg-[#5D0CA0] text-white border-2 border-black px-8 py-3 shadow-[4px_4px_0px_black] rounded inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? "Publishing…" : "Publish internship"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

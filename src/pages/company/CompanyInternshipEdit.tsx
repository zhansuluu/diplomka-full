import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader, Trash2, AlertCircle } from "lucide-react";
import { internshipService } from "../../api";
import { useAsyncData, useAsyncMutation } from "../../hooks/useAsyncData";
import { useAuth } from "../../contexts/AuthContext";

export function CompanyInternshipEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: internship, loading, error } = useAsyncData(
    () => internshipService.getInternship(id!),
    [id]
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!internship) return;
    setTitle(internship.title);
    setDescription(internship.description);
    setRequirements(internship.requirements);
    setStartDate(internship.startDate?.slice(0, 10) ?? "");
    setEndDate(internship.endDate?.slice(0, 10) ?? "");
  }, [internship]);

  const { execute: save, loading: saving } = useAsyncMutation(() =>
    internshipService.updateInternship(id!, {
      title,
      description,
      requirements,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    })
  );

  const { execute: remove, loading: deleting } = useAsyncMutation(() =>
    internshipService.deleteInternship(id!)
  );

  const wrongCompany =
    internship && user?.id && internship.companyId !== user.id;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-20 py-10">
        <Loader className="animate-spin" size={28} />
        <p>Loading internship…</p>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="px-20 py-10">
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-3">
          <AlertCircle className="text-red-600 shrink-0" />
          <p>{error?.message ?? "Internship not found"}</p>
        </div>
        <Link to="/company/dashboard" className="mt-4 inline-block underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (wrongCompany) {
    return (
      <div className="px-20 py-10">
        <p className="text-red-600 font-bold">You can only edit your own internships.</p>
        <Link to="/company/dashboard" className="mt-4 inline-block underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-20 py-10 max-w-3xl">
      <div className="flex flex-wrap gap-3">
        <Link
          to="/company/dashboard"
          className="flex items-center gap-2 w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>
        <Link
          to={`/company/cases/${id}`}
          className="flex items-center gap-2 w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded"
        >
          View case
        </Link>
      </div>

      <h1 className="text-3xl font-bold">Edit internship</h1>

      <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-black p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="border-2 border-black p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Requirements</span>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
            className="border-2 border-black p-2"
          />
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold">Start</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-black p-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold">End</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 border-black p-2"
            />
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              await save();
              navigate("/company/dashboard");
            }}
            className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              if (!confirm("Delete this internship permanently?")) return;
              await remove();
              navigate("/company/dashboard");
            }}
            className="border-2 border-red-600 text-red-600 px-6 py-2 rounded inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={18} />
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

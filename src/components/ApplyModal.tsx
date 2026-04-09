import React, { useState } from "react";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (coverLetter: string) => Promise<void>;
  title?: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
}) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(coverLetter);
      setCoverLetter("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white border-2 border-black p-6 rounded w-full max-w-lg shadow-[8px_8px_0px_black]">
        <h3 className="text-xl font-bold mb-3">Apply{title ? ` — ${title}` : ""}</h3>

        <p className="text-sm text-gray-600 mb-4">
          You may include a short cover letter explaining why you're a good fit (optional).
        </p>

        <label className="block text-sm text-gray-700 mb-2">Cover letter</label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#5D0CA0]"
          placeholder="Write a brief cover letter (optional)..."
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;

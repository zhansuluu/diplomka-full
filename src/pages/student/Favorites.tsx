import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Code, MapPin, Clock, Loader, AlertCircle } from "lucide-react";
import useFavorites from "../../hooks/useFavorites";
import { useAsyncData } from "../../hooks/useAsyncData";
import { companyService, internshipService } from "../../api";
import type { CompanyResponse, InternshipResponse } from "../../api/types";

function monthsDuration(startIso: string, endIso: string): string {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return "Duration TBA";
  const m = Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24 * 30)));
  return `${m} month${m === 1 ? "" : "s"}`;
}

type SavedRow = { internship: InternshipResponse; company: CompanyResponse | null };

export const Favorites: React.FC = () => {
  const { favorites, toggle, isFavorite } = useFavorites();

  const load = useCallback(async (): Promise<{ rows: SavedRow[] }> => {
    if (favorites.length === 0) return { rows: [] };

    const results = await Promise.all(
      favorites.map(async (id): Promise<SavedRow | null> => {
        try {
          const internship = await internshipService.getInternship(id);
          try {
            const company = await companyService.getCompany(internship.companyId);
            return { internship, company };
          } catch {
            return { internship, company: null };
          }
        } catch {
          return null;
        }
      })
    );

    return { rows: results.filter((r): r is SavedRow => r != null) };
  }, [favorites]);

  const { data, loading, error } = useAsyncData(load, [load]);

  const rows = data?.rows ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Heart size={28} className="text-[#5D0CA0]" />
          Saved Internships
        </h2>
        <p className="text-gray-600 mt-2">Saved on this device only (browser storage).</p>
      </div>

      {favorites.length === 0 && (
        <div className="bg-white border-2 border-black p-8 rounded shadow-[4px_4px_0px_black] text-center">
          No saved internships yet.
        </div>
      )}

      {favorites.length > 0 && loading && (
        <div className="bg-white border-2 border-black p-8 rounded shadow-[4px_4px_0px_black] flex items-center gap-3 text-gray-700">
          <Loader className="animate-spin" size={24} />
          Loading saved listings…
        </div>
      )}

      {favorites.length > 0 && error && !loading && (
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-4 items-start">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-800">Could not load saved internships</h3>
            <p className="text-gray-800 mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {favorites.length > 0 && !loading && !error && rows.length === 0 && (
        <div className="bg-white border-2 border-black p-8 rounded shadow-[4px_4px_0px_black] text-center text-gray-700">
          Saved IDs could not be loaded (removed or unavailable). Clear them from the list or save again from an internship page.
        </div>
      )}

      {favorites.length > 0 && !loading && !error && rows.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rows.map(({ internship, company }) => {
            const location = company?.headquarters?.trim() || "Location TBA";
            const duration =
              internship.startDate && internship.endDate
                ? monthsDuration(internship.startDate, internship.endDate)
                : "Duration TBA";

            return (
              <div key={internship.id} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shrink-0">
                    <Code size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold break-words">{internship.title}</h3>
                    <p className="text-sm text-gray-500">{company?.companyName ?? "Company"}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      to={`/student/internships/${internship.id}`}
                      className="border-2 border-black px-4 py-2 bg-white rounded shadow-[4px_4px_0px_black] text-sm text-center"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(internship.id)}
                      className={`mt-2 w-full py-2 rounded border-2 border-black text-sm ${
                        isFavorite(internship.id) ? "bg-red-500 text-white" : "bg-white"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;

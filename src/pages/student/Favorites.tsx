import React from "react";
import { Link } from "react-router-dom";
import { Heart, Code, MapPin, Clock } from "lucide-react";
import useFavorites from "../../hooks/useFavorites";

// Minimal lookup for demo purposes. Keep in sync with internships data.
const INTERN_LOOKUP: Record<number, { title: string; company: string; location: string; duration: string }> = {
  1: { title: "Frontend Developer Intern", company: "TechStart Inc", location: "San Francisco, CA", duration: "3 months" },
  2: { title: "Data Science Intern", company: "DataFlow Systems", location: "New York, NY", duration: "6 months" },
  3: { title: "DevOps Intern", company: "CloudNet", location: "Austin, TX", duration: "4 months" },
  4: { title: "ML Engineer Intern", company: "AI Innovations", location: "Seattle, WA", duration: "5 months" },
};

export const Favorites: React.FC = () => {
  const { favorites, toggle, isFavorite } = useFavorites();

  const items = favorites.map((id) => ({ id, ...INTERN_LOOKUP[id] })).filter(Boolean as any);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Heart size={28} className="text-[#5D0CA0]" />
          Saved Internships
        </h2>
        <p className="text-gray-600 mt-2">Your saved internship opportunities.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border-2 border-black p-8 rounded shadow-[4px_4px_0px_black] text-center">
          No saved internships yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.map((it) => (
            <div key={it.id} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center">
                  <Code size={20} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{it.title}</h3>
                  <p className="text-sm text-gray-500">{it.company}</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1"><MapPin size={14} />{it.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} />{it.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link to="/student/internships/frontend-internship" className="border-2 border-black px-4 py-2 bg-white rounded shadow-[4px_4px_0px_black] text-sm">View</Link>
                  <button className="bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 rounded shadow-[4px_4px_0px_black] text-sm">Apply</button>
                  <button
                    onClick={() => toggle(it.id)}
                    className={`mt-2 w-full py-2 rounded border-2 border-black ${isFavorite(it.id) ? 'bg-red-500 text-white' : 'bg-white'}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

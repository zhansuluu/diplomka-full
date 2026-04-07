import { useEffect, useState } from "react";

const SAVED_INTERNSHIPS_STORAGE_KEY = "caseup:saved-internship-ids";
const LEGACY_FAVORITES_KEY = "caseup:favorites";

function parseIdList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.map((x) => String(x)).filter(Boolean))];
  } catch {
    return [];
  }
}

function loadIds(): string[] {
  const next = parseIdList(localStorage.getItem(SAVED_INTERNSHIPS_STORAGE_KEY));
  if (next.length > 0) return next;

  const legacy = parseIdList(localStorage.getItem(LEGACY_FAVORITES_KEY));
  if (legacy.length > 0) {
    try {
      localStorage.setItem(SAVED_INTERNSHIPS_STORAGE_KEY, JSON.stringify(legacy));
    } catch {
      /* ignore */
    }
  }
  return legacy;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(loadIds);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_INTERNSHIPS_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggle = (id: string | number) => {
    const s = String(id);
    setFavorites((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const isFavorite = (id: string | number) => favorites.includes(String(id));

  return { favorites, toggle, isFavorite } as const;
};

export default useFavorites;

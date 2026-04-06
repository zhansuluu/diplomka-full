import { useEffect, useState } from "react";

const KEY = "caseup:favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const toggle = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggle, isFavorite } as const;
};

export default useFavorites;

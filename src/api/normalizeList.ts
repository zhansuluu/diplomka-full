/** Prefer inner `{ data: { items, total } }` when present (same envelope as login). */
function pickListRoot(raw: unknown): Record<string, unknown> {
  if (raw == null || typeof raw !== "object") return {};
  const root = raw as Record<string, unknown>;
  const inner = root.data ?? root.Data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const n = inner as Record<string, unknown>;
    if (
      "items" in n ||
      "Items" in n ||
      "total" in n ||
      "Total" in n
    ) {
      return n;
    }
  }
  return root;
}

/** Go/jsoniter often emits PascalCase; some APIs use `data` instead of `items`. */
export function normalizeListPayload<T>(raw: unknown): { items: T[]; total: number } {
  if (raw == null || typeof raw !== "object") {
    return { items: [], total: 0 };
  }
  const o = pickListRoot(raw);

  const itemsRaw =
    o.items ??
    o.Items ??
    o.data ??
    o.Data ??
    o.results ??
    o.Results;

  const items: T[] = Array.isArray(itemsRaw) ? (itemsRaw as T[]) : [];

  const totalRaw = o.total ?? o.Total ?? o.count ?? o.Count;
  const total =
    typeof totalRaw === "number" && !Number.isNaN(totalRaw)
      ? totalRaw
      : items.length;

  return { items, total };
}

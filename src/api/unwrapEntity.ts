/** Many backends wrap payloads as `{ code, data: { ... }, message }`. */
export function unwrapEntity<T>(raw: unknown): T {
  if (raw == null || typeof raw !== "object") {
    return raw as T;
  }
  const o = raw as Record<string, unknown>;
  const inner = o.data ?? o.Data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as T;
  }
  return raw as T;
}

/**
 * Build a compact page-number window for list pagination, e.g.
 * `[1, "...", 5, 6, 7, "...", 42]`. Shared by every Phase 2 directory list.
 */
export function pageWindow(current: number, total: number): (number | "...")[] {
  if (total <= 1) return [1];

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out: (number | "...")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("...");
    out.push(p);
    prev = p;
  }
  return out;
}

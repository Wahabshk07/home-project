/**
 * Shared URL query keys for hero job search → `/jobs` and {@link JobsBrowseWithFilters}.
 */

export type JobBrowseFilters = {
  q: string;
  category: string;
  employment: string;
  level: string;
  experience: string;
};

export const emptyJobBrowseFilters = (): JobBrowseFilters => ({
  q: "",
  category: "",
  employment: "",
  level: "",
  experience: "",
});

export function parseJobBrowseFilters(
  sp: Record<string, string | string[] | undefined>,
): JobBrowseFilters {
  const one = (k: string): string => {
    const v = sp[k];
    if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : "";
    return typeof v === "string" ? v : "";
  };
  return {
    q: one("q"),
    category: one("category"),
    employment: one("employment"),
    level: one("level"),
    experience: one("experience"),
  };
}

/** Build query string for `/jobs` (includes `page` when ≥ 2). */
export function buildJobBrowseSearchParams(
  f: JobBrowseFilters,
  page: number,
): string {
  const u = new URLSearchParams();
  if (f.q.trim()) u.set("q", f.q.trim());
  if (f.category.trim()) u.set("category", f.category.trim());
  if (f.employment.trim()) u.set("employment", f.employment.trim());
  if (f.level.trim()) u.set("level", f.level.trim());
  if (f.experience.trim()) u.set("experience", f.experience.trim());
  if (page >= 2) u.set("page", String(page));
  const s = u.toString();
  return s ? `?${s}` : "";
}

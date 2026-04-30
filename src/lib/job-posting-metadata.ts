/** Values accepted by POST/PATCH /jobs (matches Nest `JobEmploymentType` / `JobLevel`). */

export type JobEmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "per_diem"
  | "temporary";

export type JobLevel =
  | "intern"
  | "entry"
  | "mid"
  | "senior"
  | "lead"
  | "executive";

export const EMPLOYMENT_TYPE_OPTIONS: ReadonlyArray<{
  value: JobEmploymentType;
  label: string;
}> = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "per_diem", label: "Per diem" },
  { value: "temporary", label: "Temporary" },
];

export const JOB_LEVEL_OPTIONS: ReadonlyArray<{
  value: JobLevel;
  label: string;
}> = [
  { value: "intern", label: "Intern / student" },
  { value: "entry", label: "Entry level" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / charge" },
  { value: "executive", label: "Management / executive" },
];

/** Stored on jobs as `expectedSalaryRange`; same values as hero / jobs browse `salary` filter. */
export const EXPECTED_SALARY_RANGE_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
}> = [
  { value: "", label: "Not specified" },
  { value: "40-60", label: "$40k – $60k" },
  { value: "60-90", label: "$60k – $90k" },
  { value: "90-120", label: "$90k – $120k" },
  { value: "120+", label: "$120k+" },
];

export function expectedSalaryRangeLabel(
  code: string | null | undefined,
): string {
  if (!code?.trim()) return "";
  const hit = EXPECTED_SALARY_RANGE_OPTIONS.find((o) => o.value === code.trim());
  return hit?.label ?? code;
}

export const JOB_CATEGORY_SUGGESTIONS: readonly string[] = [
  "Critical care (ICU)",
  "Emergency (ED)",
  "Med-Surg",
  "Operating room (OR)",
  "Labor & delivery",
  "Pediatrics",
  "Home health",
  "Case management",
  "Administration",
  "Other",
];

export function employmentTypeLabel(
  v: JobEmploymentType | null | undefined,
): string {
  if (!v) return "";
  const hit = EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === v);
  return hit?.label ?? v;
}

export function jobLevelLabel(v: JobLevel | null | undefined): string {
  if (!v) return "";
  const hit = JOB_LEVEL_OPTIONS.find((o) => o.value === v);
  return hit?.label ?? v;
}

/** Compact subtitle for cards (employment · level · category). */
export function jobListingMetaLine(job: {
  employmentType?: JobEmploymentType | null;
  jobLevel?: JobLevel | null;
  jobCategory?: string | null;
  expectedSalaryRange?: string | null;
}): string | undefined {
  const parts: string[] = [];
  const et = employmentTypeLabel(job.employmentType);
  if (et) parts.push(et);
  const jl = jobLevelLabel(job.jobLevel);
  if (jl) parts.push(jl);
  const cat = job.jobCategory?.trim();
  if (cat) parts.push(cat);
  const sal = expectedSalaryRangeLabel(job.expectedSalaryRange);
  if (sal) parts.push(sal);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export type JobRoleDetailRow = { label: string; value: string };

/** Label/value rows for cards, apply sidebar, and filters (submit-job parity). */
export function jobRoleDetailEntries(job: {
  jobCategory?: string | null;
  employmentType?: JobEmploymentType | null;
  jobLevel?: JobLevel | null;
  location?: string | null;
  expectedSalaryRange?: string | null;
}): JobRoleDetailRow[] {
  const rows: JobRoleDetailRow[] = [];
  const cat = job.jobCategory?.trim();
  if (cat) rows.push({ label: "Category / specialty", value: cat });
  const et = employmentTypeLabel(job.employmentType);
  if (et) rows.push({ label: "Employment type", value: et });
  const jl = jobLevelLabel(job.jobLevel);
  if (jl) rows.push({ label: "Job level", value: jl });
  const sal = expectedSalaryRangeLabel(job.expectedSalaryRange);
  if (sal) rows.push({ label: "Expected salary", value: sal });
  const loc = job.location?.trim();
  if (loc) rows.push({ label: "Location", value: loc });
  return rows;
}

import { authedJson, authedVoid } from "./authed-client";
import type { JobEmploymentType, JobLevel } from "../job-posting-metadata";

export type JobStatus = "draft" | "published" | "closed";

export type EmployerJob = {
  id: string;
  clientName: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  location: string | null;
  stateCode?: string | null;
  employmentType?: JobEmploymentType | null;
  jobLevel?: JobLevel | null;
  jobCategory?: string | null;
  expectedSalaryRange?: string | null;
  status: JobStatus;
  featured: boolean;
  adminReviewRequired: boolean;
  approvedForListing: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateJobBody = {
  title: string;
  /** Omit to let the API generate a unique slug from the title. */
  slug?: string;
  description: string;
  requirements?: string;
  location?: string;
  /** US state postal code, e.g. GA */
  stateCode?: string;
  employmentType?: JobEmploymentType;
  jobLevel?: JobLevel;
  jobCategory?: string;
  /** `40-60` | `60-90` | `90-120` | `120+` — omit or empty for unspecified. */
  expectedSalaryRange?: string;
};

export type UpdateJobBody = {
  title?: string;
  description?: string;
  requirements?: string | null;
  location?: string | null;
  stateCode?: string | null;
  employmentType?: JobEmploymentType | null;
  jobLevel?: JobLevel | null;
  jobCategory?: string | null;
  expectedSalaryRange?: string | null;
  status?: JobStatus;
};

export async function listEmployerJobs(
  accessToken: string,
): Promise<EmployerJob[]> {
  return authedJson<EmployerJob[]>("/jobs/mine", accessToken, {
    method: "GET",
  });
}

export async function createEmployerJob(
  accessToken: string,
  body: CreateJobBody,
): Promise<EmployerJob> {
  return authedJson<EmployerJob>("/jobs", accessToken, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateEmployerJob(
  accessToken: string,
  jobId: string,
  body: UpdateJobBody,
): Promise<EmployerJob> {
  return authedJson<EmployerJob>(
    `/jobs/mine/${encodeURIComponent(jobId)}`,
    accessToken,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
}

export async function deleteEmployerJob(
  accessToken: string,
  jobId: string,
): Promise<void> {
  return authedVoid(
    `/jobs/mine/${encodeURIComponent(jobId)}`,
    accessToken,
    { method: "DELETE" },
  );
}

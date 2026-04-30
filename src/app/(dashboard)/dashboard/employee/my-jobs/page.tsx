"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Heart, 
  Eye, 
  Users, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Building2, 
  FileText,
  CheckCircle2,
  XCircle,
  X,
  Trash2, 
  Plus,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { BackendRequestError } from "@/lib/api/authed-client";
import {
  deleteEmployerJob,
  listEmployerJobs,
  updateEmployerJob,
  type EmployerJob,
  type JobStatus,
} from "@/lib/api/jobs-employer-api";
import { listApplicationsForJob } from "@/lib/api/applications-employer-api";
import {
  listMyApplications,
  listSavedJobs,
  type NurseApplication,
  type SavedJobRow,
} from "@/lib/api/nurse-jobs-api";

// Modern status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    published: "bg-green-600 text-white shadow-sm shadow-green-200",
    draft: "bg-white border-2 border-gray-100 text-gray-600",
    closed: "bg-gray-100 border border-gray-200 text-gray-500",
    applied: "bg-blue-50 text-blue-600 border border-blue-100",
    accepted: "bg-green-50 text-green-600 border border-green-100",
    rejected: "bg-gray-50 text-gray-600 border border-gray-100",
  };
  
  const current = styles[status as keyof typeof styles] || styles.closed;
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${current}`}>
      {status}
    </span>
  );
};

export default function MyJobsPage() {
  const router = useRouter();
  const { user, accessToken, ready } = useAuth();
  const [tab, setTab] = useState<"applied" | "saved">("applied");
  const [applications, setApplications] = useState<NurseApplication[]>([]);
  const [saved, setSaved] = useState<SavedJobRow[]>([]);
  const [employerJobs, setEmployerJobs] = useState<EmployerJob[]>([]);
  const [applicantCountByJobId, setApplicantCountByJobId] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const loadNurse = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [a, s] = await Promise.all([listMyApplications(accessToken), listSavedJobs(accessToken)]);
      setApplications(a);
      setSaved(s);
    } catch (e) {
      setError("Failed to sync your applications.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const loadEmployer = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const j = await listEmployerJobs(accessToken);
      setEmployerJobs(j);
      const pairs = await Promise.all(
        j.map(async (job) => {
          try {
            const apps = await listApplicationsForJob(accessToken, job.id);
            return [job.id, apps.length] as const;
          } catch {
            return [job.id, 0] as const;
          }
        }),
      );
      setApplicantCountByJobId(Object.fromEntries(pairs));
    } catch (e) {
      setError("Failed to sync your job listings.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/sign-in?next=/dashboard/employee/my-jobs");
      return;
    }
    if (user.role === "nurse") void loadNurse();
    else if (user.role === "employer") void loadEmployer();
    else setLoading(false);
  }, [ready, user, router, loadNurse, loadEmployer]);

  async function setJobStatus(jobId: string, status: JobStatus) {
    if (!accessToken) return;
    setActionId(jobId);
    try {
      await updateEmployerJob(accessToken, jobId, { status });
      await loadEmployer();
    } catch (e) {
      if (e instanceof BackendRequestError) {
        setError(e.status >= 500 ? "Server error — please try again." : e.message);
      } else {
        setError("Could not update this job.");
      }
    } finally {
      setActionId(null);
    }
  }

  async function handleDeleteJob(job: EmployerJob) {
    if (!accessToken) return;
    if (!window.confirm("Delete this job permanently?")) return;
    setDeletingId(job.id);
    setError(null);
    try {
      await deleteEmployerJob(accessToken, job.id);
      await loadEmployer();
    } catch (e) {
      setError("Could not delete this job.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [error]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-red-50 border-t-red-600 animate-spin" />
          <Briefcase className="absolute inset-0 m-auto h-6 w-6 text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-4 py-8 md:px-8 lg:px-12 min-w-full">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">My Jobs</h1>
          <p className="mt-2 text-lg font-medium text-gray-500">
            {user?.role === "employer" 
              ? "Manage your active listings and track candidate progress."
              : "Keep track of your applications and saved opportunities."}
          </p>
        </div>

        {user?.role === "employer" && (
          <div className="flex shrink-0">
            <Link
              href="./submit-job" 
              className="flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              Create Jobs
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div ref={errorRef} className="mb-8 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-red-700 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto p-1"><X className="h-4 w-4" /></button>
        </div>
      )}

      {user?.role === "nurse" ? (
        <div className="space-y-8">
          {/* Tabs */}
          <div className="inline-flex w-full rounded-2xl bg-gray-100 p-1.5 md:w-auto">
            <button onClick={() => setTab("applied")} className={`flex-1 rounded-xl px-8 py-2.5 text-sm font-bold ${tab === "applied" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}>Applied</button>
            <button onClick={() => setTab("saved")} className={`flex-1 rounded-xl px-8 py-2.5 text-sm font-bold ${tab === "saved" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}>Saved</button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(tab === "applied" ? applications : saved).map((item) => (
              <div key={item.id} className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:shadow-xl">
                <div className="mb-6 flex items-start justify-between">
                  <div className="rounded-2xl bg-red-50 p-3 text-red-600"><Building2 className="h-6 w-6" /></div>
                  {tab === "applied" && 'status' in item &&  <StatusBadge status={(item as any).status} />}
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900 line-clamp-1">{item.job?.title}</h3>
                <p className="mb-6 text-sm font-medium text-gray-400">{item.job?.company?.name}</p>
                <div className="mt-auto pt-6 border-t border-gray-50">
                  <Link href={`/jobs/${item.job?.slug}`} className="text-xs font-bold uppercase tracking-widest text-red-600">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Table Header */}
          <div className="hidden grid-cols-5 gap-4 px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 md:grid">
            <div className="col-span-2">Position Detail</div>
            <div className="text-center">Activity</div>
            <div className="text-center">Status</div>
            <div className="text-right">Actions</div>
          </div>

          {employerJobs.map((job) => {
            const count = applicantCountByJobId[job.id] ?? 0;
            return (
              <div key={job.id} className="relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all md:grid md:grid-cols-5 md:items-center md:gap-4 md:py-4">
                {/* Column 1 & 2: Detail */}
                <div className="col-span-2 mb-4 md:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 md:flex">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 md:text-lg">{job.title}</h4>
                    </div>
                  </div>
                </div> {/* FIXED: Added missing closing div here */}

                {/* Column 3: Activity */}
                <div className="mb-4 flex flex-col items-start justify-center md:mb-0 md:items-center">
                  <Link 
                    href={`/dashboard/employee/my-jobs/${job.id}/applicants`}
                    className="group flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-2 hover:bg-red-50"
                  >
                    <Users className="h-4 w-4 text-gray-400 group-hover:text-red-600" />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-red-600">
                      {count} <span className="hidden lg:inline">Applicants</span>
                    </span>
                  </Link>
                </div>

                {/* Column 4: Status */}
                <div className="mb-6 flex flex-col items-start justify-center md:mb-0 md:items-center">
                  <StatusBadge status={job.status} />
                </div>

                {/* Column 5: Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-4 md:justify-end md:border-0 md:pt-0">
                  <Link href={`/jobs/${job.slug}`} className="text-gray-400 hover:text-red-600 md:mr-2">
                    <Eye className="h-5 w-5" />
                  </Link>
                  <div className="flex items-center gap-2">
                    {actionId === job.id || deletingId === job.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <>
                        {job.status === "draft" && (
                          <button onClick={() => void setJobStatus(job.id, "published")} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white">Publish</button>
                        )}
                        {job.status === "published" && (
                          <button onClick={() => void setJobStatus(job.id, "closed")} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600">Close</button>
                        )}
                        <button onClick={() => void handleDeleteJob(job)} className="p-2 text-red-700 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
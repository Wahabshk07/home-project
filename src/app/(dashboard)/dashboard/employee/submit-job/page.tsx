"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ImageIcon, 
  UploadCloud, 
  Info, 
  CheckCircle2, 
  Clock,
  LayoutGrid,
  FileText,
  Settings2,
  ChevronRight,
  X
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { BackendRequestError } from "@/lib/api/authed-client";
import {
  createEmployerJob,
  updateEmployerJob,
} from "@/lib/api/jobs-employer-api";
import {
  getMyCompany,
  uploadCompanyHero,
  uploadCompanyLogo,
  type CompanyResponse,
} from "@/lib/api/company-api";
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor";
import { blogCoverSrc } from "@/lib/blog-cover-image";
import {
  isRichTextEffectivelyEmpty,
  sanitizeJobRichHtml,
} from "@/lib/sanitize-job-html";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  EXPECTED_SALARY_RANGE_OPTIONS,
  JOB_CATEGORY_SUGGESTIONS,
  JOB_LEVEL_OPTIONS,
  type JobEmploymentType,
  type JobLevel,
} from "@/lib/job-posting-metadata";

// Reusable professional focus classes
const focusClasses = "outline-none focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all";
const focusWithinClasses = "focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 transition-all";

export default function SubmitJobPage() {
  const router = useRouter();
  const { user, accessToken, ready } = useAuth();
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [employmentType, setEmploymentType] = useState<JobEmploymentType | "">("");
  const [jobLevel, setJobLevel] = useState<JobLevel | "">("");
  const [expectedSalaryRange, setExpectedSalaryRange] = useState("");
  const [featured, setFeatured] = useState(false);
  const [adminReviewRequired, setAdminReviewRequired] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploading, setUploading] = useState<"logo" | "hero" | null>(null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const loadCompany = useCallback(async () => {
    if (!accessToken) return;
    setCompanyError(null);
    try {
      const c = await getMyCompany(accessToken);
      setCompany(c);
    } catch (e) {
      if (e instanceof BackendRequestError && e.status === 404) {
        setCompany(null);
        setCompanyError("Complete your company profile first to post jobs.");
      } else {
        setCompanyError("Could not load company.");
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/sign-in?next=/dashboard/employee/submit-job");
      return;
    }
    if (user.role === "super_admin") {
      router.replace("/dashboard");
      return;
    }
    if (user.role === "employer" && accessToken) void loadCompany();
  }, [ready, user, router, accessToken, loadCompany]);

  async function handleUploadLogo(file: File | null) {
    if (!file || !accessToken) return;
    setUploading("logo");
    try {
      await uploadCompanyLogo(accessToken, file);
      await loadCompany();
    } catch (e) {
      setFormError("Logo upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function handleUploadHero(file: File | null) {
    if (!file || !accessToken) return;
    setUploading("hero");
    try {
      await uploadCompanyHero(accessToken, file);
      await loadCompany();
    } catch (e) {
      setFormError("Hero image upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function submit(publish: boolean) {
    if (!accessToken) return;
    setFormError(null);
    if (!title.trim() || isRichTextEffectivelyEmpty(description)) {
      setFormError("Job title and description are required.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(publish ? "publish" : "draft");
    try {
      let expires: string | undefined;
      if (expiresAt.trim()) {
        const d = new Date(expiresAt);
        if (!Number.isNaN(d.getTime())) expires = d.toISOString();
      }
      const job = await createEmployerJob(accessToken, {
        title: title.trim(),
        description: sanitizeJobRichHtml(description.trim()),
        requirements: isRichTextEffectivelyEmpty(requirements) ? undefined : sanitizeJobRichHtml(requirements.trim()),
        location: location.trim() || undefined,
        jobCategory: jobCategory.trim() || undefined,
        employmentType: employmentType || undefined,
        jobLevel: jobLevel || undefined,
        expectedSalaryRange: expectedSalaryRange.trim() || undefined,
        featured,
        adminReviewRequired,
        expiresAt: expires,
      });
      if (publish) {
        await updateEmployerJob(accessToken, job.id, { status: "published" });
      }
      router.push("/dashboard/employee/my-jobs");
      router.refresh();
    } catch (e) {
      if (e instanceof BackendRequestError) {
        setFormError(e.message);
      } else {
        setFormError("An error occurred while creating the job posting.");
      }
    } finally {
      setSaving(null);
    }
  }

  if (!ready || !user) return <div className="flex h-screen items-center justify-center font-medium text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      {/* --- HEADER --- */}
      <header className="w-full border-b border-gray-100 bg-white py-10">
        <div className=" w-full px-6 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Create Job Posting
              </h1>
              <p className="mt-3 max-w-2xl text-lg font-medium text-gray-500">
                Fill in the details below to find your next great hire.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-3 text-sm font-bold text-gray-500 transition-colors hover:text-red-600 outline-none"
              >
                Discard
              </button>
              <button
                type="button"
                disabled={!!saving}
                onClick={() => void submit(false)}
                className="rounded-xl border-2 border-gray-900 bg-white px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 outline-none"
              >
                {saving === "draft" ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={!!saving}
                onClick={() => void submit(true)}
                className="rounded-xl bg-red-600 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 outline-none"
              >
                {saving === "publish" ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className=" mt-12 max-wid-full  px-6 lg:px-12">
        {formError && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border-l-4 border-red-600 bg-red-50 p-5 text-sm text-red-800 shadow-sm animate-in fade-in slide-in-from-top-2">
            <Info className="h-5 w-5 shrink-0 text-red-600" />
            <p className="font-bold">{formError}</p>
            <button
              onClick={() => setFormError(null)}
              className="ml-auto rounded-lg p-1 hover:bg-red-100 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            {/* 1. Branding */}
            <section className="group">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-red-50">
                    <ImageIcon className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-red-600">Branding</h2>
              </div>
              
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                {companyError && !company ? (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                    {companyError}
                  </div>
                ) : (
                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Company Logo</label>
                      <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-gray-100 bg-gray-50 shadow-inner">
                          {blogCoverSrc(company?.logoUrl) ? (
                            <img src={blogCoverSrc(company?.logoUrl)!} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <UploadCloud className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => void handleUploadLogo(e.target.files?.[0] ?? null)} />
                          <button 
                            type="button" 
                            onClick={() => logoInputRef.current?.click()}
                            className="text-sm font-black  hover:text-red-700 transition-colors outline-none"
                          >
                            {uploading === "logo" ? "Uploading..." : "Upload New Logo"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Hero Banner</label>
                      <div className="flex items-center gap-6">
                        <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-gray-100 bg-gray-50 shadow-inner">
                          {blogCoverSrc(company?.heroImageUrl) ? (
                            <img src={blogCoverSrc(company?.heroImageUrl)!} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <LayoutGrid className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input ref={heroInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => void handleUploadHero(e.target.files?.[0] ?? null)} />
                          <button 
                            type="button" 
                            onClick={() => heroInputRef.current?.click()}
                            className="text-sm font-black  hover:text-red-700 transition-colors outline-none"
                          >
                            {uploading === "hero" ? "Uploading..." : "Upload Banner"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 2. Job Details */}
            <section className="group">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-red-50">
                    <FileText className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-red-600">Job Details</h2>
              </div>

              <div className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div>
                  <label className="mb-3 block text-sm font-bold text-slate-900">
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={title}
                    placeholder="e.g. Senior Registered Nurse (ICU)"
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-5 py-4 text-lg font-bold text-gray-900 placeholder:text-gray-300 hover:border-gray-200 ${focusClasses}`}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-slate-900">
                    Job Description <span className="text-red-600">*</span>
                  </label>
                  <div className={`overflow-hidden rounded-2xl border-2 border-gray-50 bg-white ${focusWithinClasses}`}>
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="What does a typical day look like?"
                      contentMinClass="min-h-[320px] p-5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-slate-900">
                    Requirements & Qualifications
                  </label>
                  <div className={`overflow-hidden rounded-2xl border-2 border-gray-50 bg-white ${focusWithinClasses}`}>
                    <RichTextEditor
                      value={requirements}
                      onChange={setRequirements}
                      placeholder="Degrees, certifications, or specific skills..."
                      contentMinClass="min-h-[200px] p-5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <aside className="space-y-8 lg:col-span-4">
            <div className="sticky top-10 space-y-8">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-xl border-2 border-red-300 bg-white p-2.5">
                        <Settings2 className="h-5 w-5 text-red-600" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-red-600">Classification</h2>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Category", val: jobCategory, set: setJobCategory, list: "job-category-suggestions", placeholder: "Search specialties..." },
                    { label: "Location", val: location, set: setLocation, placeholder: "e.g. Remote, New York" }
                  ].map((field, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{field.label}</label>
                      <input
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                        list={field.list}
                        placeholder={field.placeholder}
                        className={`w-full rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-3 text-sm font-bold hover:border-gray-200 ${focusClasses}`}
                      />
                      {field.list && (
                        <datalist id={field.list}>
                          {JOB_CATEGORY_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                        </datalist>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Employment Type</label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType((e.target.value || "") as JobEmploymentType | "")}
                      className={`w-full rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-3 text-sm font-bold hover:border-gray-200 ${focusClasses}`}
                    >
                      <option value="">Select type...</option>
                      {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Experience Level</label>
                    <select
                      value={jobLevel}
                      onChange={(e) => setJobLevel((e.target.value || "") as JobLevel | "")}
                      className={`w-full rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-3 text-sm font-bold hover:border-gray-200 ${focusClasses}`}
                    >
                      <option value="">Select level...</option>
                      {JOB_LEVEL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Salary Range</label>
                    <select
                      value={expectedSalaryRange}
                      onChange={(e) => setExpectedSalaryRange(e.target.value)}
                      className={`w-full rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-3 text-sm font-bold hover:border-gray-200 ${focusClasses}`}
                    >
                      {EXPECTED_SALARY_RANGE_OPTIONS.map((o) => (
                        <option key={o.value || "sal-none"} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <label className="mb-4 block text-[10px] font-black uppercase tracking-widest text-gray-400">Listing Management</label>
                <div className="relative mb-6">
                    <Clock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className={`w-full rounded-xl border-2 border-gray-50 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold hover:border-gray-200 ${focusClasses}`}
                    />
                </div>
                
                <label className={`group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-50 p-4 hover:border-red-600/10 hover:bg-red-50/30 ${focusWithinClasses}`}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-5 w-5 rounded-lg border-gray-300 text-red-600 focus:ring-red-600 outline-none"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-black uppercase tracking-tight text-red-600">Feature Listing</span>
                    </div>
                </label>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { buildJobBrowseSearchParams, emptyJobBrowseFilters } from "@/lib/job-browse-search-params";

import { heroContent } from "./content";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
}) {
  const defaultValue = options[0]?.value ?? "";
  return (
    <div>
      <label
        htmlFor={`hero-${name}`}
        className="mb-2 block text-xs font-semibold text-slate-700 uppercase tracking-wide"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={`hero-${name}`}
          name={name}
          defaultValue={defaultValue}
          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-300"
        >
          {options.map((opt) => (
            <option key={`${name}-${opt.value || "__all"}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

/**
 * White job search panel — matches JobStock-style marketing hero.
 * Submits to `/jobs` with query params consumed by {@link JobsBrowseWithFilters}.
 */
export function HeroSearchCard() {
  const router = useRouter();
  const { searchCard } = heroContent;
  const s = searchCard.selects;

  return (
    <div className="rounded-3xl border border-white/20 bg-white/98 p-6 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
      <h2 className="text-center text-base font-semibold text-slate-700 md:text-lg">
        {searchCard.titleBefore}
        <span className="text-cyan-600 font-bold">{siteConfig.brandMarkParts.america}</span>{" "}
        <span className="text-cyan-600 font-bold">{siteConfig.brandMarkParts.needs}</span>{" "}
        <span className="text-cyan-600 font-bold">{siteConfig.brandMarkParts.nurses}</span>
      </h2>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const base = emptyJobBrowseFilters();
          const f = {
            ...base,
            q: String(fd.get("q") ?? "").trim(),
            category: String(fd.get("category") ?? "").trim(),
            employment: String(fd.get("employment") ?? "").trim(),
            level: String(fd.get("level") ?? "").trim(),
            experience: String(fd.get("experience") ?? "").trim(),
          };
          router.push(`/jobs${buildJobBrowseSearchParams(f, 1)}`);
        }}
      >
        <div>
          <label htmlFor="hero-q" className="sr-only">
            Search keywords
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="hero-q"
              type="search"
              name="q"
              placeholder={searchCard.keywordPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label={s.category.label}
            name={s.category.name}
            options={s.category.options}
          />
          <SelectField
            label={s.jobType.label}
            name={s.jobType.name}
            options={s.jobType.options}
          />
          <SelectField
            label={s.level.label}
            name={s.level.name}
            options={s.level.options}
          />
          <SelectField
            label={s.experience.label}
            name={s.experience.name}
            options={s.experience.options}
          />
        </div>

        <button
          type="submit"
          className="btn w-full justify-center rounded-lg py-3.5 text-base font-semibold shadow-md"
        >
          {searchCard.submitLabel}
        </button>
      </form>
    </div>
  );
}

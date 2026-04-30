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
        className="mb-1.5 block text-xs font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={`hero-${name}`}
          name={name}
          defaultValue={defaultValue}
          className="w-full cursor-pointer appearance-none rounded-lg border border-blue-200/80 bg-white py-2.5 pl-3 pr-10 text-sm text-black shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          {options.map((opt) => (
            <option key={`${name}-${opt.value || "__all"}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-blue-400/80" />
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
    <div className="rounded-2xl border border-primary/25 bg-white/95 p-6 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] backdrop-blur-sm md:p-8">
      <h2 className="text-center text-lg font-bold text-button md:text-xl">
        {searchCard.titleBefore}
        <span className="text-button">{siteConfig.brandMarkParts.america}</span>{" "}
        <span className="text-button">{siteConfig.brandMarkParts.needs}</span>{" "}
        <span className="text-button">{siteConfig.brandMarkParts.nurses}</span>
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
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400/90" />
            <input
              id="hero-q"
              type="search"
              name="q"
              placeholder={searchCard.keywordPlaceholder}
              className="w-full rounded-lg border border-blue-200/80 bg-white py-3 pl-11 pr-3 text-sm text-black shadow-sm outline-none placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/30"
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

/**
 * Home hero — copy, image, stats, and job search card fields.
 * Image: `public/hero/images.jpg` → `/hero/images.jpg`
 */
export const heroContent = {
  image: {
    src: "/hero/images.jpg" as const,
    alt: "Professional nurse in modern healthcare facility",
    width: 1920,
    height: 1080,
  },
  eyebrow: "Professional Nursing Careers",
  title: "Find Your Next Opportunity in Healthcare",
  subtitle:
    "Discover thousands of nursing positions across America's leading healthcare facilities. Connect with employers seeking your expertise and advance your career today.",
  stats: [
    { digits: "5,000", accent: "+", label: "Active Positions" },
    { digits: "1,200", accent: "+", label: "Healthcare Facilities" },
    { digits: "50,000", accent: "+", label: "Nurses Placed" },
  ],
  searchCard: {
    titleBefore: "Start Your Search on ",
    submitLabel: "Search Positions",
    keywordPlaceholder: "Job Title, Specialty...",
    selects: {
      category: {
        label: "Job Category",
        name: "category" as const,
        /** `value` is sent in the URL and matched against listing category / text. */
        options: [
          { value: "", label: "All categories" },
          { value: "Critical care", label: "Critical care (ICU)" },
          { value: "Emergency", label: "Emergency (ED)" },
          { value: "Med-Surg", label: "Med-Surg" },
          { value: "Operating room", label: "Operating room (OR)" },
          { value: "Pediatrics", label: "Pediatrics" },
          { value: "Home health", label: "Home health" },
          { value: "Case management", label: "Case management" },
          { value: "Administration", label: "Administration" },
        ],
      },
      jobType: {
        label: "Job Type",
        name: "employment" as const,
        options: [
          { value: "", label: "All types" },
          { value: "full_time", label: "Full time" },
          { value: "part_time", label: "Part time" },
          { value: "contract", label: "Contract" },
          { value: "per_diem", label: "Per diem" },
          { value: "temporary", label: "Temporary / travel" },
        ],
      },
      experience: {
        label: "Experience",
        name: "experience" as const,
        options: [
          { value: "", label: "Any experience" },
          { value: "1", label: "1+ years" },
          { value: "2", label: "2+ years" },
          { value: "3", label: "3+ years" },
          { value: "5", label: "5+ years" },
        ],
      },
    },
  },
} as const;

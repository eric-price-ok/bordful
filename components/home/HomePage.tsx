"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import type { Job, CareerLevel } from "@/lib/db/airtable";
import { normalizeAnnualSalary } from "@/lib/db/airtable";
import { formatDistanceToNow, isToday } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { JobFilters } from "@/components/ui/job-filters";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { HeroSection } from "@/components/ui/hero-section";
import config from "@/config";
import { LanguageCode } from "@/lib/constants/languages";
import { JobsPerPageSelect } from "@/components/ui/jobs-per-page-select";
import { SortOrderSelect } from "@/components/ui/sort-order-select";
import { useSortOrder } from "@/lib/hooks/useSortOrder";
import { usePagination } from "@/lib/hooks/usePagination";
import { PaginationControl } from "@/components/ui/pagination-control";
import { JobSearchInput } from "@/components/ui/job-search-input";
import { useJobSearch } from "@/lib/hooks/useJobSearch";
import { filterJobsBySearch } from "@/lib/utils/filter-jobs";

type Filters = {
  types: string[];
  roles: CareerLevel[];
  remote: boolean;
  salaryRanges: string[];
  visa: boolean;
  languages: LanguageCode[];
};

type FilterType =
  | "type"
  | "role"
  | "remote"
  | "salary"
  | "visa"
  | "language"
  | "clear";
type FilterValue = string[] | boolean | CareerLevel[] | LanguageCode[] | true;

function HomePageContent({ initialJobs }: { initialJobs: Job[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchTerm } = useJobSearch();
  const { sortOrder } = useSortOrder();
  const { page } = usePagination();

  // Parse initial filters from URL
  const initialFilters = {
    types: searchParams.get("types")?.split(",").filter(Boolean) || [],
    roles: (searchParams.get("roles")?.split(",").filter(Boolean) ||
      []) as CareerLevel[],
    remote: searchParams.get("remote") === "true",
    salaryRanges: searchParams.get("salary")?.split(",").filter(Boolean) || [],
    visa: searchParams.get("visa") === "true",
    languages: (searchParams.get("languages")?.split(",").filter(Boolean) ||
      []) as LanguageCode[],
  };

  const [filters, setFilters] = useState<Filters>({
    types: initialFilters?.types || [],
    roles: initialFilters?.roles || [],
    remote: initialFilters?.remote || false,
    salaryRanges: initialFilters?.salaryRanges || [],
    visa: initialFilters?.visa || false,
    languages: initialFilters?.languages || ([] as LanguageCode[]),
  });
  const [pendingUrlUpdate, setPendingUrlUpdate] = useState<Record<
    string,
    string | null
  > | null>(null);

  // Get jobs per page from URL or default
  const jobsPerPage = parseInt(searchParams.get("per_page") || "10", 10);

  // Update URL with new parameters
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    setPendingUrlUpdate(updates);
  }, []);

  // Handle URL updates
  useEffect(() => {
    if (pendingUrlUpdate) {
      const params = new URLSearchParams(searchParams);

      Object.entries(pendingUrlUpdate).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.replace(`/?${params.toString()}`, { scroll: false });
      setPendingUrlUpdate(null);
    }
  }, [pendingUrlUpdate, router, searchParams]);

  // Update URL when filters change
  const updateFilterParams = useCallback(
    (newFilters: Filters) => {
      const updates: Record<string, string | null> = {
        types: newFilters.types.length ? newFilters.types.join(",") : null,
        roles: newFilters.roles.length ? newFilters.roles.join(",") : null,
        remote: newFilters.remote ? "true" : null,
        salary: newFilters.salaryRanges.length
          ? newFilters.salaryRanges.join(",")
          : null,
        visa: newFilters.visa ? "true" : null,
        languages: newFilters.languages.length
          ? newFilters.languages.join(",")
          : null,
        page: "1", // Reset to first page when filters change
      };

      updateParams(updates);
    },
    [updateParams]
  );

  const handleFilterChange = useCallback(
    (filterType: FilterType, value: FilterValue) => {
      if (filterType === "clear") {
        const clearedFilters = {
          types: [],
          roles: [] as CareerLevel[],
          remote: false,
          salaryRanges: [],
          visa: false,
          languages: [],
        };
        setFilters(clearedFilters);
        updateFilterParams(clearedFilters);
        return;
      }

      setFilters((prev) => {
        const newFilters = { ...prev };

        switch (filterType) {
          case "type":
            if (
              Array.isArray(value) &&
              JSON.stringify(value) !== JSON.stringify(prev.types)
            ) {
              newFilters.types = value;
            } else {
              return prev;
            }
            break;
          case "role":
            if (
              Array.isArray(value) &&
              JSON.stringify(value) !== JSON.stringify(prev.roles)
            ) {
              newFilters.roles = value as CareerLevel[];
            } else {
              return prev;
            }
            break;
          case "remote":
            if (typeof value === "boolean" && value !== prev.remote) {
              newFilters.remote = value;
            } else {
              return prev;
            }
            break;
          case "salary":
            if (
              Array.isArray(value) &&
              JSON.stringify(value) !== JSON.stringify(prev.salaryRanges)
            ) {
              newFilters.salaryRanges = value;
            } else {
              return prev;
            }
            break;
          case "visa":
            if (typeof value === "boolean" && value !== prev.visa) {
              newFilters.visa = value;
            } else {
              return prev;
            }
            break;
          case "language":
            if (
              Array.isArray(value) &&
              JSON.stringify(value) !== JSON.stringify(prev.languages)
            ) {
              newFilters.languages = value as LanguageCode[];
            } else {
              return prev;
            }
            break;
        }

        updateFilterParams(newFilters);
        return newFilters;
      });
    },
    [updateFilterParams]
  );

  // Sort and filter jobs
  const filteredJobs = useMemo(() => {
    let filtered = [...initialJobs];

    // Apply search filter using our utility function
    filtered = filterJobsBySearch(filtered, searchTerm || "");

    // Apply job type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter((job) => filters.types.includes(job.type));
    }

    // Apply career level filter
    if (filters.roles.length > 0) {
      filtered = filtered.filter((job) => {
        if (!job.career_level) return false;
        return filters.roles.some((role) => job.career_level.includes(role));
      });
    }

    // Apply remote filter
    if (filters.remote) {
      filtered = filtered.filter((job) => job.workplace_type === "Remote");
    }

    // Apply visa sponsorship filter
    if (filters.visa) {
      filtered = filtered.filter((job) => job.visa_sponsorship === "Yes");
    }

    // Apply salary range filter
    if (filters.salaryRanges.length > 0) {
      filtered = filtered.filter((job) => {
        if (!job.salary) return false;
        const annualSalary = normalizeAnnualSalary(job.salary);

        return filters.salaryRanges.some((range) => {
          switch (range) {
            case "< $50K":
              return annualSalary < 50000;
            case "$50K - $100K":
              return annualSalary >= 50000 && annualSalary <= 100000;
            case "$100K - $200K":
              return annualSalary > 100000 && annualSalary <= 200000;
            case "> $200K":
              return annualSalary > 200000;
            default:
              return false;
          }
        });
      });
    }

    // Apply language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter((job) => {
        if (!job.languages || job.languages.length === 0) return false;
        return filters.languages.some((lang) => job.languages.includes(lang));
      });
    }

    // Apply sorting
    switch (sortOrder) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.posted_date).getTime() -
            new Date(b.posted_date).getTime()
        );
        break;
      case "salary":
        filtered.sort((a, b) => {
          const salaryA = a.salary ? normalizeAnnualSalary(a.salary) : -1;
          const salaryB = b.salary ? normalizeAnnualSalary(b.salary) : -1;

          if (salaryA === -1 && salaryB === -1) return 0;
          if (salaryA === -1) return 1;
          if (salaryB === -1) return -1;
          return salaryB - salaryA;
        });
        break;
      default: // "newest"
        filtered.sort(
          (a, b) =>
            new Date(b.posted_date).getTime() -
            new Date(a.posted_date).getTime()
        );
    }

    return filtered;
  }, [initialJobs, searchTerm, sortOrder, filters]);

  // Sort jobs based on selected option and featured status
  const sortedJobs = useMemo(() => {
    // First sort by featured status, then by the selected sort option
    return [...filteredJobs].sort((a, b) => {
      // First compare by featured status
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      // Then apply the selected sort for jobs with the same featured status
      switch (sortOrder) {
        case "newest":
          return (
            new Date(b.posted_date).getTime() -
            new Date(a.posted_date).getTime()
          );
        case "oldest":
          return (
            new Date(a.posted_date).getTime() -
            new Date(b.posted_date).getTime()
          );
        case "salary":
          const aSalary = a.salary ? normalizeAnnualSalary(a.salary) : 0;
          const bSalary = b.salary ? normalizeAnnualSalary(b.salary) : 0;
          return bSalary - aSalary;
        default:
          return 0;
      }
    });
  }, [filteredJobs, sortOrder]);

  // Calculate pagination
  const startIndex = (page - 1) * jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

  // Get the most recent job's posted date (timestamp or null)
  const lastUpdatedTimestamp = useMemo(() => {
    if (initialJobs.length === 0) return null;

    const mostRecentDate = Math.max(
      ...initialJobs.map((job) => new Date(job.posted_date).getTime())
    );

    return mostRecentDate; // Return the timestamp
  }, [initialJobs]);

  // Calculate jobs added today
  const jobsAddedToday = useMemo(() => {
    return initialJobs.filter((job) => isToday(new Date(job.posted_date)))
      .length;
  }, [initialJobs]);

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        badge={config.badge}
        title={config.title}
        description={config.description}
        // Will use the global config.ui.heroImage since we're not specifying a custom one
      >
        {/* Search Bar - Replace with our new component */}
        <div className="max-w-[480px]">
          <JobSearchInput />
        </div>

        {/* Quick Stats - Reverted to original structure with color customization */}
        {(config.quickStats?.enabled ?? true) && (
          <div
            className="mt-6 grid grid-cols-3 gap-4 text-xs text-muted-foreground max-w-[480px]"
            // Apply base color here, specific elements might override
            style={{ color: config.ui.heroStatsColor || undefined }}
          >
            {/* Open Jobs */}
            {(config.quickStats?.sections?.openJobs?.enabled ?? true) && (
              <div>
                <div
                  className="font-medium text-foreground"
                  // Override title color if heroStatsColor is set
                  style={{
                    color:
                      config.ui.heroStatsColor ||
                      undefined /* Default: text-foreground */,
                  }}
                >
                  {config.quickStats?.sections?.openJobs?.title || "Open Jobs"}
                </div>
                <div className="flex items-center">
                  {(config.quickStats?.sections?.openJobs
                    ?.showNewJobsIndicator ??
                    true) &&
                    jobsAddedToday > 0 && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 pulse-dot"></span>
                    )}
                  <span /* Value inherits color from parent div */>
                    {initialJobs.length.toLocaleString()}
                  </span>
                  {(config.quickStats?.sections?.openJobs
                    ?.showNewJobsIndicator ??
                    true) &&
                    jobsAddedToday > 0 && (
                      <span
                        className="ml-1"
                        /* Added today text inherits color */
                      >
                        ({jobsAddedToday.toLocaleString()} added today)
                      </span>
                    )}
                </div>
              </div>
            )}

            {/* Last Updated */}
            {(config.quickStats?.sections?.lastUpdated?.enabled ?? true) &&
              lastUpdatedTimestamp && ( // Ensure timestamp exists
                <div>
                  <div
                    className="font-medium text-foreground"
                    style={{
                      color:
                        config.ui.heroStatsColor ||
                        undefined /* Default: text-foreground */,
                    }}
                  >
                    {config.quickStats?.sections?.lastUpdated?.title ||
                      "Last Updated"}
                  </div>
                  <div /* Value inherits color */>
                    {formatDistanceToNow(new Date(lastUpdatedTimestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              )}

            {/* Trending Companies */}
            {(config.quickStats?.sections?.trending?.enabled ?? true) && (
              <div>
                <div
                  className="font-medium text-foreground"
                  style={{
                    color:
                      config.ui.heroStatsColor ||
                      undefined /* Default: text-foreground */,
                  }}
                >
                  {config.quickStats?.sections?.trending?.title || "Trending"}
                </div>
                <div /* Value inherits color */>
                  {Array.from(new Set(initialJobs.map((job) => job.company)))
                    .slice(
                      0,
                      config.quickStats?.sections?.trending?.maxCompanies || 3
                    )
                    .join(", ")}
                </div>
              </div>
            )}
          </div>
        )}
      </HeroSection>

      {/* Jobs Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-[3] order-2 md:order-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 sm:gap-0">
              <div className="space-y-1 w-full sm:w-auto">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 flex-wrap">
                  Latest Opportunities
                  {page > 1 && (
                    <span className="text-gray-500 font-normal">
                      Page {page}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedJobs.length.toLocaleString()} of{" "}
                  {sortedJobs.length.toLocaleString()} positions
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto overflow-x-auto pb-1">
                <JobsPerPageSelect />
                <SortOrderSelect />
              </div>
            </div>

            <div className="space-y-4">
              {paginatedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No positions found matching your search criteria. Try
                    adjusting your search terms.
                  </p>
                </div>
              ) : (
                paginatedJobs.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>

            {/* Pagination with optimized range */}
            {sortedJobs.length > jobsPerPage && (
              <PaginationControl
                totalItems={sortedJobs.length}
                itemsPerPage={jobsPerPage}
              />
            )}

            {/* Post Job Banner - Moved below pagination */}
            <div className="mt-8">
              <PostJobBanner />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-[240px] lg:w-[250px] xl:w-[260px] order-1 md:order-2">
            <div className="space-y-6">
              <JobFilters
                onFilterChange={handleFilterChange}
                initialFilters={initialFilters}
                jobs={initialJobs}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export function HomePage({ initialJobs }: { initialJobs: Job[] }) {
  return (
    <Suspense>
      <HomePageContent initialJobs={initialJobs} />
    </Suspense>
  );
}

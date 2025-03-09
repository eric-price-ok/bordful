"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import type { Job, CareerLevel } from "@/lib/db/airtable";
import { normalizeAnnualSalary } from "@/lib/db/airtable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDistanceToNow, isToday } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFilters } from "@/components/ui/job-filters";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { HeroSection } from "@/components/ui/hero-section";
import config from "@/config";
import { LanguageCode } from "@/lib/constants/languages";

type SortOption = "newest" | "oldest" | "salary";

interface Filters {
  types: string[];
  roles: CareerLevel[];
  remote: boolean;
  salaryRanges: string[];
  visa: boolean;
  languages: LanguageCode[];
}

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFiltering, setIsFiltering] = useState(false);

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

  // Get current page and jobs per page from URL or defaults
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
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

  // Handle jobs per page change
  const handleJobsPerPageChange = useCallback(
    (value: string) => {
      updateParams({
        per_page: value === "10" ? null : value,
        page: "1", // Reset to first page when changing items per page
      });
    },
    [updateParams]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (value: SortOption) => {
      setSortBy(value);
      updateParams({
        sort: value === "newest" ? null : value,
        page: "1", // Reset to first page when changing sort
      });
    },
    [updateParams]
  );

  // Handle search with debounce
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setIsFiltering(true);
      const timer = setTimeout(() => {
        updateParams({ page: null }); // Reset to first page when searching
        setIsFiltering(false);
      }, 300);
      return () => clearTimeout(timer);
    },
    [updateParams]
  );

  // Handle keyboard navigation
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setSearchTerm("");
        updateParams({ page: null });
      }
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

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          (job.workplace_city?.toLowerCase() || "").includes(searchLower) ||
          (job.workplace_country?.toLowerCase() || "").includes(searchLower)
      );
    }

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
    switch (sortBy) {
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
  }, [initialJobs, searchTerm, sortBy, filters]);

  // Sort jobs based on selected option and featured status
  const sortedJobs = useMemo(() => {
    // First sort by featured status, then by the selected sort option
    return [...filteredJobs].sort((a, b) => {
      // First compare by featured status
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      // Then apply the selected sort for jobs with the same featured status
      switch (sortBy) {
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
  }, [filteredJobs, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

  // Get the most recent job's posted date
  const lastUpdated = useMemo(() => {
    if (initialJobs.length === 0) return "No jobs yet";

    const mostRecentDate = Math.max(
      ...initialJobs.map((job) => new Date(job.posted_date).getTime())
    );

    return formatDistanceToNow(mostRecentDate, { addSuffix: true });
  }, [initialJobs]);

  // Calculate jobs added today
  const jobsAddedToday = useMemo(() => {
    return initialJobs.filter((job) => isToday(new Date(job.posted_date)))
      .length;
  }, [initialJobs]);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage < 1) {
      updateParams({ page: null });
    } else if (totalPages > 0 && currentPage > totalPages) {
      updateParams({ page: totalPages.toString() });
    }
  }, [currentPage, totalPages, updateParams]);

  // Optimize pagination range calculation
  const getPaginationRange = useCallback((current: number, total: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.5;
          }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
      `}</style>

      <HeroSection
        badge={config.badge}
        title={config.title}
        description={config.description}
      >
        {/* Search Bar */}
        <div className="max-w-[480px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by role, company, or location..."
              className="pl-9 h-10"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search jobs"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  updateParams({ page: null });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground max-w-[480px]">
          <div>
            <div className="font-medium text-foreground">Open Jobs</div>
            <div className="flex items-center">
              {jobsAddedToday > 0 && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 pulse-dot"></span>
              )}
              {initialJobs.length.toLocaleString()}
              {jobsAddedToday > 0 && (
                <span className="ml-1">
                  ({jobsAddedToday.toLocaleString()} added today)
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium text-foreground">Last Updated</div>
            <div>{lastUpdated}</div>
          </div>
          <div>
            <div className="font-medium text-foreground">Trending</div>
            <div>
              {Array.from(new Set(initialJobs.map((job) => job.company)))
                .slice(0, 3)
                .join(", ")}
            </div>
          </div>
        </div>
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
                  {currentPage > 1 && (
                    <span className="text-gray-500 font-normal">
                      Page {currentPage}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedJobs.length.toLocaleString()} of{" "}
                  {sortedJobs.length.toLocaleString()} positions
                </p>
              </div>
              <div className="flex items-center gap-3 pb-[1px] w-full sm:w-auto">
                <Select
                  value={jobsPerPage.toString()}
                  onValueChange={handleJobsPerPageChange}
                >
                  <SelectTrigger className="w-full sm:w-[130px] h-7 text-xs">
                    <SelectValue placeholder="Show" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white min-w-[130px]"
                    position="popper"
                  >
                    <SelectItem value="10" className="text-xs">
                      10 per page
                    </SelectItem>
                    <SelectItem value="25" className="text-xs">
                      25 per page
                    </SelectItem>
                    <SelectItem value="50" className="text-xs">
                      50 per page
                    </SelectItem>
                    <SelectItem value="100" className="text-xs">
                      100 per page
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[140px] h-7 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white" position="popper">
                    <SelectItem value="newest" className="text-xs">
                      Newest first
                    </SelectItem>
                    <SelectItem value="oldest" className="text-xs">
                      Oldest first
                    </SelectItem>
                    <SelectItem value="salary" className="text-xs">
                      Highest salary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {isFiltering ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Updating results...
                  </p>
                </div>
              ) : paginatedJobs.length === 0 ? (
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
              <div className="mt-8 flex justify-center sm:justify-start">
                <Pagination>
                  <PaginationContent className="flex gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        href={
                          currentPage > 1 ? `/?page=${currentPage - 1}` : "#"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setIsFiltering(true);
                            updateParams({
                              page: (currentPage - 1).toString(),
                            });
                            setTimeout(() => setIsFiltering(false), 300);
                          }
                        }}
                        className={`hover:bg-gray-100 transition-colors ${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {getPaginationRange(currentPage, totalPages).map(
                      (pageNum, idx) =>
                        pageNum === "..." ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href={`/?page=${pageNum}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsFiltering(true);
                                updateParams({ page: pageNum.toString() });
                                setTimeout(() => setIsFiltering(false), 300);
                              }}
                              isActive={currentPage === pageNum}
                              className="hover:bg-gray-100 transition-colors"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href={
                          currentPage < totalPages
                            ? `/?page=${currentPage + 1}`
                            : "#"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setIsFiltering(true);
                            updateParams({
                              page: (currentPage + 1).toString(),
                            });
                            setTimeout(() => setIsFiltering(false), 300);
                          }
                        }}
                        className={`hover:bg-gray-100 transition-colors ${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-[240px] lg:w-[250px] xl:w-[260px] order-1 md:order-2">
            <div className="space-y-6">
              <JobFilters
                onFilterChange={handleFilterChange}
                initialFilters={initialFilters}
                jobs={initialJobs}
              />
              <PostJobBanner />
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

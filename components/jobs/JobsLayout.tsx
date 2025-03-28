"use client";

import { useState, useCallback } from "react";
import type { Job, CareerLevel } from "@/lib/db/airtable";
import { JobListings } from "@/components/jobs/JobListings";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { useSearchParams } from "next/navigation";
import { ClientBreadcrumb } from "@/components/ui/client-breadcrumb";
import { JobsPerPageSelect } from "@/components/ui/jobs-per-page-select";
import { SortOrderSelect } from "@/components/ui/sort-order-select";
import { useSortOrder } from "@/lib/hooks/useSortOrder";
import { usePagination } from "@/lib/hooks/usePagination";
import { PaginationControl } from "@/components/ui/pagination-control";
import { JobFilters } from "@/components/ui/job-filters";
import { LanguageCode } from "@/lib/constants/languages";
import { JobType } from "@/lib/constants/job-types";

interface JobsLayoutProps {
  allJobs: Job[];
  filteredJobs: Job[];
}

export function JobsLayout({ allJobs, filteredJobs }: JobsLayoutProps) {
  const searchParams = useSearchParams();
  const { sortOrder } = useSortOrder();
  const { page } = usePagination();

  // Filter state
  const [selectedJobs, setSelectedJobs] = useState<Job[]>(filteredJobs);
  
  // Get URL params or defaults
  const jobsPerPage = Number(searchParams.get("per_page")) || 10;

  // Handle filter changes
  const handleFilterChange = useCallback(
    (
      filterType: "type" | "role" | "remote" | "salary" | "visa" | "language" | "clear",
      value: string[] | boolean | CareerLevel[] | LanguageCode[] | JobType[] | true
    ) => {
      if (filterType === "clear") {
        setSelectedJobs(filteredJobs);
        return;
      }

      let newFilteredJobs = [...filteredJobs];

      // Apply type filter
      if (filterType === "type" && Array.isArray(value) && value.length > 0) {
        // Type assertion to tell TypeScript this is a JobType array
        const jobTypes = value as JobType[];
        newFilteredJobs = newFilteredJobs.filter((job) =>
          jobTypes.includes(job.type as JobType)
        );
      }

      // Apply role/career level filter
      if (filterType === "role" && Array.isArray(value) && value.length > 0) {
        // Type assertion to tell TypeScript this is a CareerLevel array
        const careerLevels = value as CareerLevel[];
        newFilteredJobs = newFilteredJobs.filter((job) =>
          careerLevels.some((level) => job.career_level.includes(level))
        );
      }

      // Apply remote filter
      if (filterType === "remote" && value === true) {
        newFilteredJobs = newFilteredJobs.filter(
          (job) => job.workplace_type === "Remote"
        );
      }

      // Apply salary filter
      if (filterType === "salary" && Array.isArray(value) && value.length > 0) {
        // Type assertion to tell TypeScript this is a string array
        const salaryRanges = value as string[];
        // Handle salary filtering logic here
        newFilteredJobs = newFilteredJobs.filter((job) => {
          if (!job.salary) return false;
          
          // Calculate annual salary based on available data
          let annualSalary = 0;
          if (job.salary.max) {
            annualSalary = job.salary.max;
          } else if (job.salary.min) {
            // If hourly, convert to annual (assuming 2080 hours per year)
            annualSalary = job.salary.min * 2080;
          }
          
          if (annualSalary === 0) return false;
            
          if (salaryRanges.includes("< $50K") && annualSalary < 50000) return true;
          if (salaryRanges.includes("$50K - $100K") && annualSalary >= 50000 && annualSalary <= 100000) return true;
          if (salaryRanges.includes("$100K - $200K") && annualSalary > 100000 && annualSalary <= 200000) return true;
          if (salaryRanges.includes("> $200K") && annualSalary > 200000) return true;
          
          return false;
        });
      }

      // Apply visa filter
      if (filterType === "visa" && value === true) {
        newFilteredJobs = newFilteredJobs.filter(
          (job) => job.visa_sponsorship === "Yes"
        );
      }

      // Apply language filter
      if (filterType === "language" && Array.isArray(value) && value.length > 0) {
        // Type assertion to tell TypeScript this is a LanguageCode array
        const languageCodes = value as LanguageCode[];
        newFilteredJobs = newFilteredJobs.filter((job) =>
          job.languages?.some((lang) => languageCodes.includes(lang as LanguageCode))
        );
      }

      setSelectedJobs(newFilteredJobs);
    },
    [filteredJobs]
  );

  // Sort jobs
  const sortedJobs = [...selectedJobs].sort((a, b) => {
    switch (sortOrder) {
      case "oldest":
        return (
          new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime()
        );
      case "salary":
        const aMax = a.salary?.max || 0;
        const bMax = b.salary?.max || 0;
        return bMax - aMax;
      default: // newest
        return (
          new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
        );
    }
  });

  // Pagination
  const startIndex = (page - 1) * jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <main className="container py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Main Content */}
        <div className="flex-[3] space-y-6">
          {/* Breadcrumbs */}
          <div className="mb-2">
            <ClientBreadcrumb />
          </div>

          {/* Controls */}
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
            <div className="flex items-center gap-3 pb-[1px] w-full sm:w-auto">
              <JobsPerPageSelect />
              <SortOrderSelect />
            </div>
          </div>

          {/* Job Listings */}
          {paginatedJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No positions found matching your search criteria. Try adjusting
                your search terms.
              </p>
            </div>
          ) : (
            <JobListings jobs={paginatedJobs} showFiltered={false} />
          )}

          {/* Pagination */}
          {sortedJobs.length > jobsPerPage && (
            <PaginationControl
              totalItems={sortedJobs.length}
              itemsPerPage={jobsPerPage}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[240px] xl:w-[260px] order-first lg:order-last">
          <div className="space-y-6">
            <JobFilters
              onFilterChange={handleFilterChange}
              initialFilters={{
                types: [],
                roles: [],
                remote: false,
                salaryRanges: [],
                visa: false,
                languages: [],
              }}
              jobs={allJobs}
            />
            <PostJobBanner />
          </div>
        </aside>
      </div>
    </main>
  );
}

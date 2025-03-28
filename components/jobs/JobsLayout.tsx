"use client";

import type { Job } from "@/lib/db/airtable";
import { JobListings } from "@/components/jobs/JobListings";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { useSearchParams } from "next/navigation";
import { ClientBreadcrumb } from "@/components/ui/client-breadcrumb";
import { JobsPerPageSelect } from "@/components/ui/jobs-per-page-select";
import { SortOrderSelect } from "@/components/ui/sort-order-select";
import { useSortOrder } from "@/lib/hooks/useSortOrder";
import { usePagination } from "@/lib/hooks/usePagination";
import { PaginationControl } from "@/components/ui/pagination-control";

interface JobsLayoutProps {
  allJobs: Job[];
  filteredJobs: Job[];
}

export function JobsLayout({ filteredJobs }: JobsLayoutProps) {
  const searchParams = useSearchParams();
  const { sortOrder } = useSortOrder();
  const { page } = usePagination();

  // Get URL params or defaults
  const jobsPerPage = Number(searchParams.get("per_page")) || 10;

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
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
            <PostJobBanner />
          </div>
        </aside>
      </div>
    </main>
  );
}

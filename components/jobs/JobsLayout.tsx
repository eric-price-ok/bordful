"use client";

import type { Job } from "@/lib/db/airtable";
import { JobListings } from "@/components/jobs/JobListings";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ClientBreadcrumb } from "@/components/ui/client-breadcrumb";
import { JobsPerPageSelect } from "@/components/ui/jobs-per-page-select";

interface JobsLayoutProps {
  allJobs: Job[];
  filteredJobs: Job[];
}

type SortOption = "newest" | "oldest" | "salary";

export function JobsLayout({ filteredJobs }: JobsLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltering, setIsFiltering] = useState(false);

  // Get URL params or defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sort") as SortOption) || "newest";
  const jobsPerPage = Number(searchParams.get("per_page")) || 10;

  // Update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
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
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

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
              <JobsPerPageSelect />

              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => {
                  setIsFiltering(true);
                  updateParams({
                    sort: value === "newest" ? null : value,
                    page: "1",
                  });
                  setTimeout(() => setIsFiltering(false), 300);
                }}
              >
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

          {/* Job Listings */}
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
                No positions found matching your search criteria. Try adjusting
                your search terms.
              </p>
            </div>
          ) : (
            <JobListings jobs={paginatedJobs} showFiltered={false} />
          )}

          {/* Pagination */}
          {sortedJobs.length > jobsPerPage && (
            <div className="mt-8 flex justify-center sm:justify-start">
              <Pagination>
                <PaginationContent className="flex gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setIsFiltering(true);
                          updateParams({ page: (currentPage - 1).toString() });
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
                            href={`?page=${pageNum}`}
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
                          ? `?page=${currentPage + 1}`
                          : "#"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setIsFiltering(true);
                          updateParams({ page: (currentPage + 1).toString() });
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
        <aside className="w-full lg:w-[240px] xl:w-[260px] order-first lg:order-last">
          <div className="space-y-6">
            <PostJobBanner />
          </div>
        </aside>
      </div>
    </main>
  );
}

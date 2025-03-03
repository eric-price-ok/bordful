"use client";

import Link from "next/link";
import { Job, formatSalary } from "@/lib/db/airtable";
import { formatDate } from "@/lib/utils/formatDate";
import { generateJobSlug } from "@/lib/utils/slugify";
import { JobBadge } from "@/components/ui/job-badge";

export function CompactJobCard({ job }: { job: Job }) {
  const { relativeTime } = formatDate(job.posted_date);

  // Check if job was posted within the last 48 hours
  const isNew = () => {
    const now = new Date();
    const postedDate = new Date(job.posted_date);
    const diffInHours = Math.floor(
      (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60)
    );
    return diffInHours <= 48;
  };

  // Simplify location to just the type
  const workplaceType = job.workplace_type || "";

  // Limit title length to prevent layout issues
  const limitedTitle =
    job.title.length > 40 ? `${job.title.substring(0, 40)}...` : job.title;

  return (
    <Link
      href={`/jobs/${generateJobSlug(job.title, job.company)}`}
      className={`block py-2.5 px-3 hover:bg-zinc-50 transition-colors ${
        job.featured ? "bg-zinc-50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Title and badges */}
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-medium line-clamp-1 max-w-[calc(100%-70px)]">
              {limitedTitle}
            </h3>
            <div className="flex flex-nowrap gap-1 shrink-0">
              {isNew() && (
                <JobBadge
                  type="new"
                  className="text-[10px] py-0 px-1.5 h-4 flex items-center"
                >
                  New
                </JobBadge>
              )}
              {job.featured && (
                <JobBadge
                  type="featured"
                  className="text-[9px] py-0 px-1.5 h-4 flex items-center"
                >
                  Featured
                </JobBadge>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="text-xs text-gray-600 line-clamp-1">
            {job.company}
          </div>
        </div>

        {/* Essential info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
          <span className="whitespace-nowrap">{job.type}</span>
          {workplaceType && (
            <>
              <span className="text-gray-300">•</span>
              <span className="whitespace-nowrap">{workplaceType}</span>
            </>
          )}
          <span className="text-gray-300">•</span>
          <span className="whitespace-nowrap">{relativeTime}</span>
        </div>
      </div>
    </Link>
  );
}

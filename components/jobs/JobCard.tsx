import Link from "next/link";
import { Job, formatSalary } from "@/lib/db/airtable";
import { formatDate } from "@/lib/utils/formatDate";
import { generateJobSlug } from "@/lib/utils/slugify";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobBadge } from "@/components/ui/job-badge";
import config from "@/config";

export function JobCard({ job }: { job: Job }) {
  const { fullDate, relativeTime } = formatDate(job.posted_date);
  const showSalary =
    job.salary && (job.salary.min !== null || job.salary.max !== null);

  // Format location based on workplace type
  const location =
    job.workplace_type === "Remote"
      ? job.remote_region
        ? `Remote (${job.remote_region})`
        : null
      : job.workplace_type === "Hybrid"
      ? [
          job.workplace_city,
          job.workplace_country,
          job.remote_region ? `Hybrid (${job.remote_region})` : null,
        ]
          .filter(Boolean)
          .join(", ") || null
      : [job.workplace_city, job.workplace_country]
          .filter(Boolean)
          .join(", ") || null;

  // Check if job was posted within the last 48 hours
  const isNew = () => {
    const now = new Date();
    const postedDate = new Date(job.posted_date);
    const diffInHours = Math.floor(
      (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60)
    );
    return diffInHours <= 48;
  };

  return (
    <div className="group relative">
      <Link
        href={`/jobs/${generateJobSlug(job.title, job.company)}`}
        className={`block p-4 sm:p-5 border rounded-lg transition-all ${
          job.featured
            ? "bg-zinc-100 hover:bg-zinc-50"
            : "hover:border-gray-400"
        }`}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <h2 className="text-base font-medium line-clamp-2">
                {job.title}
              </h2>
              {isNew() && <JobBadge type="new">New</JobBadge>}
            </div>
            {job.featured && (
              <JobBadge
                type="featured"
                icon={<Sparkles className="w-3 h-3" />}
                className="shrink-0"
              >
                Featured
              </JobBadge>
            )}
          </div>
          <div className="text-sm text-gray-600">{job.company}</div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
            <span className="whitespace-nowrap">{job.type}</span>
            {showSalary && (
              <>
                <span>•</span>
                <span className="whitespace-nowrap">
                  {formatSalary(job.salary, true)}
                </span>
              </>
            )}
            {location && (
              <>
                <span>•</span>
                <span className="whitespace-nowrap">{location}</span>
              </>
            )}
            <span>•</span>
            <time dateTime={job.posted_date} className="whitespace-nowrap">
              {fullDate} ({relativeTime})
            </time>
          </div>
        </div>
      </Link>
      {job.apply_url && (
        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          <Button
            asChild
            size="xs"
            className="gap-1.5 text-xs"
            variant="primary"
            style={{ backgroundColor: config.ui.primaryColor }}
          >
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Apply Now
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

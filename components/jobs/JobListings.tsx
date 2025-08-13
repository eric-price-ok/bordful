import type { Job } from "@/lib/db/prisma";
import { JobCard } from "@/components/jobs/JobCard";

interface JobListingsProps {
  jobs: Job[];
  showFiltered?: boolean;
}

export function JobListings({ jobs, showFiltered = true }: JobListingsProps) {
  return (
    <div className="space-y-4">
      {showFiltered && (
        <p className="text-sm text-gray-500">
          Showing {jobs.length.toLocaleString()}{" "}
          {jobs.length === 1 ? "position" : "positions"}
        </p>
      )}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

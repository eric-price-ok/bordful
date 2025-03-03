"use client";

import { Job } from "@/lib/db/airtable";
import { CompactJobCard } from "@/components/jobs/CompactJobCard";

export function CompactJobCardList({
  jobs,
  className = "",
}: {
  jobs: Job[];
  className?: string;
}) {
  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      {jobs.map((job, index) => (
        <div key={job.id} className={index !== 0 ? "border-t" : ""}>
          <CompactJobCard job={job} />
        </div>
      ))}
    </div>
  );
}

import { getJobs } from "@/lib/db/prisma";
import { Briefcase } from "lucide-react";
import type { Metadata } from "next";
import config from "@/config";
import { HeroSection } from "@/components/ui/hero-section";
import Link from "next/link";
import {
  JobType,
  JOB_TYPE_DISPLAY_NAMES,
  JOB_TYPE_DESCRIPTIONS,
} from "@/lib/constants/job-types";
import { generateMetadata } from "@/lib/utils/metadata";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";

// Generate metadata for SEO
export const metadata: Metadata = generateMetadata({
  title: "Browse Jobs by Type | " + config.title,
  description:
    "Explore tech jobs by employment type. Find full-time, part-time, or contract positions that match your preferences.",
  path: "/jobs/types",
});

// Revalidate page every 5 minutes
export const revalidate = 300;

interface TypeCardProps {
  href: string;
  title: string;
  description: string;
  count: number;
}

function TypeCard({ href, title, description, count }: TypeCardProps) {
  return (
    <Link
      href={href}
      className="block p-4 sm:p-5 border rounded-lg transition-all hover:border-gray-400"
      aria-label={`Browse ${count.toLocaleString()} ${title} ${
        count === 1 ? "position" : "positions"
      }`}
    >
      <div className="space-y-1.5 sm:space-y-2">
        <h2 className="text-sm sm:text-base font-medium">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
          {description}
        </p>
        <div className="text-xs sm:text-sm text-gray-500">
          {count.toLocaleString()} {count === 1 ? "position" : "positions"}{" "}
          available
        </div>
      </div>
    </Link>
  );
}

export default async function JobTypesPage() {
  const jobs = await getJobs();

  // Aggregate job counts by type
  const typeCounts = jobs.reduce<Partial<Record<JobType, number>>>(
    (acc, job) => {
      if (job.type) {
        acc[job.type] = (acc[job.type] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  // Sort types by job count
  const sortedTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      type: type as JobType,
      title: JOB_TYPE_DISPLAY_NAMES[type as JobType],
      description: JOB_TYPE_DESCRIPTIONS[type as JobType],
      count,
    }));

  return (
    <>
      <HeroSection
        badge="Job Types"
        title="Browse Jobs by Type"
        description={`Explore ${jobs.length.toLocaleString()} open positions across different employment types. Find the perfect role that matches your preferences.`}
        heroImage={config.jobsPages?.types?.heroImage}
      />

      <main className="container py-6 sm:py-8">
        <div className="max-w-5xl">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <MetadataBreadcrumb
              metadata={metadata}
              pathname="/jobs/types"
              items={[
                { name: "Home", url: "/" },
                { name: "Jobs", url: "/jobs" },
                { name: "Types", url: "/jobs/types" },
              ]}
            />
          </div>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase
                className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-semibold">
                Available Job Types
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortedTypes.map(({ type, title, description, count }) => (
                <TypeCard
                  key={type}
                  href={`/jobs/type/${type.toLowerCase()}`}
                  title={title}
                  description={description}
                  count={count}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

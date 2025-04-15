import { getJobs, formatSalary } from "@/lib/db/airtable";
import { formatDate } from "@/lib/utils/formatDate";
import { generateJobSlug } from "@/lib/utils/slugify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { JobDetailsSidebar } from "@/components/ui/job-details-sidebar";
import { SimilarJobs } from "@/components/ui/similar-jobs";
import { JobSchema } from "@/components/ui/job-schema";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { Metadata } from "next";
import config from "@/config";
import { generateMetadata as createMetadata } from "@/lib/utils/metadata";
import { notFound } from "next/navigation";
import { ClientBreadcrumb } from "@/components/ui/client-breadcrumb";
import { resolveColor } from "@/lib/utils/colors";

// Generate static params for all active jobs
export async function generateStaticParams() {
  const jobs = await getJobs();
  // getJobs already filters for active jobs, but we'll explicitly filter here for clarity
  return jobs
    .filter((job) => job.status === "active")
    .map((job) => ({
      slug: generateJobSlug(job.title, job.company),
    }));
}

// Generate metadata for the job page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Get all jobs first and resolve params
  const [allJobs, { slug }] = await Promise.all([getJobs(), params]);

  // Find the job with matching slug
  const job = allJobs.find((j) => {
    const jobSlug = generateJobSlug(j.title, j.company);
    return jobSlug === slug;
  });

  if (!job) {
    return {
      title: "Job Not Found | " + config.title,
      description: "The job you're looking for could not be found.",
    };
  }

  // Format location for metadata based on workplace type
  const metaLocation = (() => {
    // For Remote jobs, show the region if available
    if (job.workplace_type === "Remote") {
      if (!job.remote_region) {
        return "Remote position (Worldwide)";
      }

      // For Worldwide specifically, don't use "in"
      if (job.remote_region === "Worldwide") {
        return "Remote position (Worldwide)";
      }

      // For other regions, use "in"
      return `Remote position in ${job.remote_region}`;
    }

    // For Hybrid jobs, show the location with Hybrid prefix
    if (job.workplace_type === "Hybrid") {
      const location = [job.workplace_city, job.workplace_country]
        .filter(Boolean)
        .join(", ");
      return location ? `Hybrid position in ${location}` : "Hybrid position";
    }

    // For On-site jobs, show the location directly
    if (job.workplace_type === "On-site") {
      const location = [job.workplace_city, job.workplace_country]
        .filter(Boolean)
        .join(", ");
      return location ? `in ${location}` : "";
    }

    // Default case (Not specified)
    return "";
  })();

  // Format deadline if available
  const deadlineText = job.valid_through
    ? `Apply before ${new Date(job.valid_through).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
    : "Apply now";

  // Build description parts dynamically
  const parts = [];

  // First part - company, job type and title (removing parentheses if present in the title)
  const cleanTitle = job.title.replace(/\s*\([^)]*\)\s*/g, " ").trim();

  // Base description
  let baseDescription = `${
    job.company
  } is hiring ${job.type.toLowerCase()} ${cleanTitle}`;
  let baseDescriptionAdded = false;

  // Add location only if it exists
  if (metaLocation) {
    // For "in X" format, append directly; for other formats, add as new sentence
    if (metaLocation.startsWith("in ")) {
      baseDescription += ` ${metaLocation}`;
    } else {
      parts.push(baseDescription);
      parts.push(metaLocation);
      baseDescriptionAdded = true;
    }
  }

  // Add the base description if it wasn't added already
  if (!baseDescriptionAdded) {
    parts.push(baseDescription);
  }

  // Salary
  if (job.salary) {
    parts.push(`Salary: ${formatSalary(job.salary, true)}`);
  }

  // Deadline
  parts.push(deadlineText);

  // Use our utility to generate consistent metadata
  // Join with periods and ensure proper formatting
  const description = parts
    .join(". ")
    // Fix any double periods
    .replace(/\.\./g, ".")
    // Ensure there's a period at the end
    .replace(/(\w)$/, "$1.");

  return createMetadata({
    title: `${job.title} at ${job.company}`,
    description,
    path: `/jobs/${slug}`,
    openGraph: {
      type: "article",
      images: [
        {
          url: `/api/og/jobs/${slug}`,
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company}`,
        },
      ],
    },
  });
}

// Revalidate page every 5 minutes (300 seconds) instead of forcing dynamic rendering
export const revalidate = 300;

export default async function JobPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Await the params to resolve before using
  const { slug } = await params;

  const jobs = await getJobs();
  const job = jobs.find((j) => generateJobSlug(j.title, j.company) === slug);

  if (!job) {
    notFound();
  }

  // Return 404 for inactive jobs as per Google's structured data guidelines
  if (job.status !== "active") {
    notFound();
  }

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

  return (
    <main className="container py-6">
      <JobSchema job={job} slug={slug} />

      <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
        {/* Main content */}
        <article className="flex-[3] order-1">
          <div className="mb-6">
            <ClientBreadcrumb
              dynamicData={{
                name: job.title,
                url: `/jobs/${slug}`,
              }}
            />
          </div>
          <div className="mb-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">{job.title}</h1>
              <div className="text-base text-gray-600">{job.company}</div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span>{job.type}</span>
                  {showSalary && (
                    <>
                      <span>•</span>
                      <span>{formatSalary(job.salary, true)}</span>
                    </>
                  )}
                  {location && (
                    <>
                      <span>•</span>
                      <span>{location}</span>
                    </>
                  )}
                </div>
                <Button
                  asChild
                  size="xs"
                  className="gap-1.5 text-xs w-full sm:w-auto"
                  variant="primary"
                  style={{
                    backgroundColor: resolveColor(config.ui.primaryColor),
                  }}
                >
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="prose prose-sm prose-gray max-w-none">
            <div className="h-px bg-gray-200 my-8" aria-hidden="true" />
            <div className="markdown-content [&_a]:text-zinc-900 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-zinc-800 [&_a]:transition-colors">
              {!job.description && (
                <p className="text-red-500">No description available</p>
              )}
              <div className="hidden">
                Raw description: {JSON.stringify(job.description)}
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  // Customize heading styles
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl font-bold my-4" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-xl font-bold my-3" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-lg font-bold my-2" {...props} />
                  ),
                  // Style links
                  a: ({ ...props }) => (
                    <a
                      className="text-blue-600 hover:text-blue-800"
                      {...props}
                    />
                  ),
                  // Style lists
                  ul: ({ ...props }) => (
                    <ul className="list-disc ml-4 my-2" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal ml-4 my-2" {...props} />
                  ),
                  // Style paragraphs
                  p: ({ ...props }) => <p className="my-2" {...props} />,
                }}
              >
                {job.description || ""}
              </ReactMarkdown>
            </div>
          </div>

          {/* Application Requirements - Prominently displayed before apply button */}
          {job.application_requirements && (
            <div className="mt-6 mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="text-xs font-semibold flex items-center gap-1 mb-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-amber-600" />
                Application Requirements
              </h3>
              <p className="text-xs text-gray-700">
                {job.application_requirements}
              </p>
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
              <Button
                asChild
                size="xs"
                className="gap-1.5 text-xs w-full sm:w-auto"
                variant="primary"
                style={{
                  backgroundColor: resolveColor(config.ui.primaryColor),
                }}
              >
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </Button>
              {job.valid_through && (
                <span className="text-xs text-gray-500 text-center sm:text-left w-full sm:w-auto">
                  Apply before:{" "}
                  {new Date(job.valid_through).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full md:w-[240px] lg:w-[250px] xl:w-[260px] flex flex-col gap-6 order-2">
          {/* Job Details - Always show first in sidebar */}
          <JobDetailsSidebar
            fullDate={fullDate}
            relativeTime={relativeTime}
            workplace_type={job.workplace_type}
            remote_region={job.remote_region}
            timezone_requirements={job.timezone_requirements}
            workplace_city={job.workplace_city}
            workplace_country={job.workplace_country}
            salary={job.salary}
            career_level={job.career_level}
            apply_url={job.apply_url}
            visa_sponsorship={job.visa_sponsorship}
            languages={job.languages}
            benefits={job.benefits}
            valid_through={job.valid_through || null}
            job_identifier={job.job_identifier || null}
          />

          {/* On mobile, Similar Jobs appear before Post Job Banner */}
          <div className="md:order-3">
            <SimilarJobs currentJob={job} allJobs={jobs} />
          </div>
          <div className="md:order-2">
            <PostJobBanner />
          </div>
        </aside>
      </div>
    </main>
  );
}

import { getJobs, formatSalary } from "@/lib/db/airtable";
import { formatDate } from "@/lib/utils/formatDate";
import { generateJobSlug } from "@/lib/utils/slugify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { PostJobBanner } from "@/components/ui/post-job-banner";
import { JobDetailsSidebar } from "@/components/ui/job-details-sidebar";
import { SimilarJobs } from "@/components/ui/similar-jobs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import config from "@/config";

// Generate static params for all active jobs
export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({
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

  // Format location for metadata
  const metaLocation =
    job.workplace_type === "Remote"
      ? job.remote_region || "Worldwide"
      : [job.workplace_city, job.workplace_country].filter(Boolean).join(", ");

  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.type} position at ${job.company}${
      metaLocation ? `. Location: ${metaLocation}` : ""
    }${job.salary ? `. Salary: ${formatSalary(job.salary)}` : ""}.`,
    alternates: {
      canonical: `/jobs/${slug}`,
      languages: {
        en: `${config.url}/jobs/${slug}`,
        "x-default": `${config.url}/jobs/${slug}`,
      },
    },
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `${job.type} position at ${job.company}${
        metaLocation ? `. Location: ${metaLocation}` : ""
      }${job.salary ? `. Salary: ${formatSalary(job.salary)}` : ""}.`,
    },
  };
}

// Revalidate page every 5 minutes (300 seconds) instead of forcing dynamic rendering
export const revalidate = 300;

export default async function JobPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // Get all jobs first and resolve params
    const [allJobs, { slug }] = await Promise.all([getJobs(), params]);

    // Find the job with matching slug
    const job = allJobs.find((j) => {
      const jobSlug = generateJobSlug(j.title, j.company);
      return jobSlug === slug;
    });

    if (!job) {
      return null; // This will trigger the not-found page
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
        <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
          {/* Main content */}
          <article className="flex-[3] order-1">
            <div className="mb-4">
              <Breadcrumb>
                <BreadcrumbList className="gap-1 text-xs">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                      href="/"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-300 mx-[-0.25rem]" />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                      href="/"
                    >
                      Jobs
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-300 mx-[-0.25rem]" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-900">
                      {job.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
                        <span>{formatSalary(job.salary)}</span>
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
                    className="bg-zinc-900 text-white hover:bg-zinc-800 gap-1.5 text-xs w-full sm:w-auto"
                  >
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                      <ArrowUpRight
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
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

            <div className="mt-8">
              <Button
                asChild
                size="xs"
                className="bg-zinc-900 text-white hover:bg-zinc-800 gap-1.5 text-xs w-full sm:w-auto"
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
            />

            {/* On mobile, Similar Jobs appear before Post Job Banner */}
            <div className="md:order-3">
              <SimilarJobs currentJob={job} allJobs={allJobs} />
            </div>
            <div className="md:order-2">
              <PostJobBanner />
            </div>
          </aside>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in JobPage:", error);
    return null; // This will trigger the not-found page
  }
}

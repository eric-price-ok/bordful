import { getJobs } from "@/lib/db/airtable";
import { HeroSection } from "@/components/ui/hero-section";
import config from "@/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobsLayout } from "@/components/jobs/JobsLayout";
import type { Language } from "@/lib/constants/languages";
import { LANGUAGE_DISPLAY_NAMES } from "@/lib/constants/languages";

// Revalidate page every 5 minutes
export const revalidate = 300;

interface Props {
  params: {
    language: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const languageSlug = decodeURIComponent(params.language).toUpperCase();
  const language = Object.keys(LANGUAGE_DISPLAY_NAMES).find(
    (key) => key.toLowerCase() === languageSlug.toLowerCase()
  ) as Language | undefined;

  if (!language) {
    return {
      title: "Language Not Found | " + config.title,
      description: "The language you're looking for doesn't exist.",
    };
  }

  const displayName = LANGUAGE_DISPLAY_NAMES[language];

  return {
    title: `${displayName} Jobs | ${config.title}`,
    description: `Browse jobs requiring ${displayName} language skills. Find the perfect role that matches your language abilities.`,
  };
}

export default async function LanguagePage({ params }: Props) {
  const jobs = await getJobs();
  const languageSlug = decodeURIComponent(params.language).toUpperCase();

  // Find the language from our constants
  const language = Object.keys(LANGUAGE_DISPLAY_NAMES).find(
    (key) => key.toLowerCase() === languageSlug.toLowerCase()
  ) as Language | undefined;

  if (!language) {
    return notFound();
  }

  const displayName = LANGUAGE_DISPLAY_NAMES[language];

  // Filter jobs by language
  const filteredJobs = jobs.filter((job) => job.languages?.includes(language));

  if (filteredJobs.length === 0) return notFound();

  return (
    <>
      <HeroSection
        badge={displayName}
        title={`${displayName} Jobs`}
        description={`Browse ${filteredJobs.length.toLocaleString()} ${
          filteredJobs.length === 1 ? "position" : "positions"
        } requiring ${displayName} language skills. Find the perfect role that matches your language abilities.`}
      />
      <JobsLayout allJobs={jobs} filteredJobs={filteredJobs} />
    </>
  );
}

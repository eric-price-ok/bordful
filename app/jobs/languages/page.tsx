import { getJobs } from "@/lib/db/airtable";
import { Languages } from "lucide-react";
import type { Metadata } from "next";
import config from "@/config";
import { HeroSection } from "@/components/ui/hero-section";
import Link from "next/link";
import {
  LanguageCode,
  getDisplayNameFromCode,
} from "@/lib/constants/languages";
import { generateMetadata } from "@/lib/utils/metadata";
import { MetadataBreadcrumb } from "@/components/ui/metadata-breadcrumb";

// Generate metadata for SEO
export const metadata: Metadata = generateMetadata({
  title: "Browse Jobs by Language | " + config.title,
  description:
    "Explore tech jobs by required languages. Find positions that match your language skills and preferences.",
  path: "/jobs/languages",
});

// Revalidate page every 5 minutes
export const revalidate = 300;

interface LanguageCardProps {
  href: string;
  title: string;
  count: number;
}

function LanguageCard({ href, title, count }: LanguageCardProps) {
  return (
    <Link
      href={href}
      className="block p-4 sm:p-5 border rounded-lg transition-all hover:border-gray-400"
    >
      <div className="space-y-1.5 sm:space-y-2">
        <h2 className="text-sm sm:text-base font-medium">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          {count.toLocaleString()} {count === 1 ? "position" : "positions"}{" "}
          available
        </p>
      </div>
    </Link>
  );
}

export default async function LanguagesPage() {
  const jobs = await getJobs();

  // Aggregate job counts by language code
  const languageCounts = jobs.reduce<Record<LanguageCode, number>>(
    (acc, job) => {
      if (job.languages) {
        job.languages.forEach((langCode) => {
          acc[langCode] = (acc[langCode] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<LanguageCode, number>
  );

  // Sort languages by alphabetical order of name
  const sortedLanguages = Object.entries(languageCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => {
      // Sort alphabetically by language name
      const nameA = getDisplayNameFromCode(a[0] as LanguageCode);
      const nameB = getDisplayNameFromCode(b[0] as LanguageCode);
      return nameA.localeCompare(nameB);
    })
    .map(([code, count]) => ({
      code: code as LanguageCode,
      title: getDisplayNameFromCode(code as LanguageCode),
      count,
    }));

  return (
    <>
      <HeroSection
        badge="Languages"
        title="Browse Jobs by Language"
        description={`Explore ${jobs.length.toLocaleString()} open positions across different language requirements. Find the perfect role that matches your language skills.`}
      />

      <main className="container py-6 sm:py-8">
        <div className="max-w-5xl">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <MetadataBreadcrumb
              metadata={metadata}
              pathname="/jobs/languages"
              items={[
                { name: "Home", url: "/" },
                { name: "Jobs", url: "/jobs" },
                { name: "Languages", url: "/jobs/languages" },
              ]}
            />
          </div>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Languages
                className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-semibold">
                Available Languages
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortedLanguages.map(({ code, title, count }) => (
                <LanguageCard
                  key={code}
                  href={`/jobs/language/${code}`}
                  title={title}
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

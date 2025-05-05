import {
  CareerLevel,
  Salary,
  formatSalary,
  formatUSDApproximation,
} from "@/lib/db/airtable";
import { WorkplaceType, RemoteRegion } from "@/lib/constants/workplace";
import {
  LanguageCode,
  getDisplayNameFromCode,
} from "@/lib/constants/languages";
import {
  Calendar,
  MapPin,
  Laptop,
  Wallet,
  Briefcase,
  Link,
  Globe,
  Clock,
  Flag,
  Languages,
  Gift,
  Hash,
} from "lucide-react";
import { JobBadge } from "@/components/ui/job-badge";
import { CollapsibleText } from "@/components/ui/collapsible-text";
import { formatDistanceToNow } from "date-fns";
import config from "@/config";

interface JobDetailsSidebarProps {
  title: string;
  jobUrl: string;
  fullDate: string;
  relativeTime: string;
  workplace_type: WorkplaceType;
  remote_region: RemoteRegion;
  timezone_requirements: string | null;
  workplace_city: string | null;
  workplace_country: string | null;
  salary: Salary | null;
  career_level: CareerLevel[];
  apply_url: string;
  visa_sponsorship: string;
  languages: LanguageCode[];
  benefits: string | null;
  valid_through: string | null;
  job_identifier: string | null;
  job_source_name: string | null;
}

function formatCareerLevel(level: CareerLevel): string {
  const formatMap: Record<CareerLevel, string> = {
    Internship: "Internship",
    EntryLevel: "Entry Level",
    Associate: "Associate",
    Junior: "Junior",
    MidLevel: "Mid Level",
    Senior: "Senior",
    Staff: "Staff",
    Principal: "Principal",
    Lead: "Lead",
    Manager: "Manager",
    SeniorManager: "Senior Manager",
    Director: "Director",
    SeniorDirector: "Senior Director",
    VP: "VP",
    SVP: "SVP",
    EVP: "EVP",
    CLevel: "C-Level",
    Founder: "Founder",
    NotSpecified: "Not Specified",
  };

  return formatMap[level] || level;
}

export function JobDetailsSidebar({
  title,
  jobUrl,
  fullDate,
  relativeTime,
  workplace_type,
  remote_region,
  timezone_requirements,
  workplace_city,
  workplace_country,
  salary,
  career_level,
  apply_url,
  visa_sponsorship,
  languages,
  benefits,
  valid_through,
  job_identifier,
  job_source_name,
}: JobDetailsSidebarProps) {
  const showSalary = salary && (salary.min !== null || salary.max !== null);
  const usdApprox = showSalary ? formatUSDApproximation(salary) : null;
  const careerLevels = Array.from(
    new Set(Array.isArray(career_level) ? career_level : [career_level])
  );

  // Format location
  const location = [workplace_city, workplace_country]
    .filter(Boolean)
    .join(", ");

  // Format the application deadline if available
  const formatDeadline = () => {
    if (!valid_through) return null;

    const deadlineDate = new Date(valid_through);
    const now = new Date();
    const isPastDeadline = deadlineDate < now;

    // Calculate relative time to deadline
    const relativeDeadline = formatDistanceToNow(deadlineDate, {
      addSuffix: false,
    });

    // Format the date to a user-friendly string
    return {
      fullDate: deadlineDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      relativeTime: isPastDeadline
        ? `${relativeDeadline} ago`
        : `in ${relativeDeadline}`,
      isPastDeadline,
    };
  };

  const deadline = formatDeadline();

  return (
    <div className="p-5 border rounded-lg space-y-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold">Job Details</h2>
        {config.jobReport.enabled && config.jobReport.showInSidebar && (
          <a
            href={`mailto:${
              config.jobReport.email
            }?subject=${encodeURIComponent(
              config.jobReport.emailSubject.replace("[Job Title]", title)
            )}&body=${encodeURIComponent(
              config.jobReport.emailMessage
                .replace("[Job Title]", title)
                .replace("[Job URL]", jobUrl)
            )}`}
            className="text-red-700 hover:text-red-800 text-xs font-medium flex items-center gap-1"
          >
            <Flag className="h-3 w-3" />
            {config.jobReport.buttonText}
          </a>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium">Date Posted</h3>
        </div>
        <p className="text-sm text-gray-600 ml-6">
          {fullDate} ({relativeTime})
        </p>
      </div>

      {/* Application Deadline */}
      {deadline && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="text-sm font-medium">Application Deadline</h3>
          </div>
          <div className="ml-6">
            <p className="text-sm text-gray-600">
              {deadline.fullDate} ({deadline.relativeTime})
            </p>
            {deadline.isPastDeadline && (
              <p className="text-xs text-amber-600 mt-1">
                This deadline has passed, but the job may still be accepting
                applications.
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium">Job Location</h3>
        </div>
        {workplace_type === "Remote" ? (
          <>
            <span className="text-sm text-gray-600 ml-6">
              Remote ({remote_region || "Worldwide"})
            </span>
          </>
        ) : workplace_type === "Hybrid" ? (
          <>
            <span className="text-sm text-gray-600 ml-6">
              {[location, `Hybrid (${remote_region})`]
                .filter(Boolean)
                .join(", ")}
            </span>
          </>
        ) : (
          <p className="text-sm text-gray-600 ml-6">
            {location || "Not specified"}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Laptop className="h-4 w-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium">Workplace Type</h3>
        </div>
        <div className="ml-6">
          <JobBadge
            type={
              workplace_type === "Not specified"
                ? "not specified"
                : workplace_type === "On-site"
                ? "onsite"
                : (workplace_type.toLowerCase() as
                    | "remote"
                    | "hybrid"
                    | "default")
            }
          >
            {workplace_type}
          </JobBadge>
        </div>
      </div>

      {showSalary && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="text-sm font-medium">Salary</h3>
          </div>
          <div className="ml-6">
            <p className="text-sm text-gray-600">
              {formatSalary(salary, true)}
            </p>
            {usdApprox && (
              <p className="text-xs text-gray-500 mt-0.5">{usdApprox}</p>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="h-4 w-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium">Career Level</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 ml-6">
          {careerLevels.map((level, index) => (
            <JobBadge
              key={`${level}-${index}`}
              type="career-level"
              href={
                level !== "NotSpecified"
                  ? `/jobs/level/${level.toLowerCase()}`
                  : undefined
              }
            >
              {formatCareerLevel(level)}
            </JobBadge>
          ))}
        </div>
      </div>

      {job_source_name && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="text-sm font-medium">Job Source</h3>
          </div>
          <a
            href={apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-900 underline underline-offset-4 hover:text-zinc-800 transition-colors ml-6"
          >
            {job_source_name}
          </a>
        </div>
      )}

      {/* Job Identifier */}
      {job_identifier && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hash className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="text-sm font-medium">Job ID</h3>
          </div>
          <p className="text-sm text-gray-600 ml-6">{job_identifier}</p>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium">Visa Sponsorship</h3>
        </div>
        <div className="ml-6">
          <JobBadge
            type={
              visa_sponsorship === "Yes"
                ? "visa-yes"
                : visa_sponsorship === "No"
                ? "visa-no"
                : "visa-not-specified"
            }
          >
            {visa_sponsorship}
          </JobBadge>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium">Job Timezones</h3>
        </div>
        <p className="text-sm text-gray-600 ml-6">
          {timezone_requirements || "Not specified"}
        </p>
      </div>

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Languages className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="text-sm font-medium">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-6">
            {languages.map((langCode) => (
              <JobBadge
                key={langCode}
                type="language"
                href={`/jobs/language/${langCode}`}
              >
                {getDisplayNameFromCode(langCode)}
              </JobBadge>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {benefits && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="text-sm font-medium">Benefits & Perks</h3>
          </div>
          <div className="ml-6">
            <CollapsibleText text={benefits} maxLength={150} />
          </div>
        </div>
      )}
    </div>
  );
}

import { Job, Salary } from "@/lib/db/airtable";
import Script from "next/script";
import config from "@/config";

// Utility functions for schema formatting
function formatJobLocationType(job: Job): string | null {
  return job.workplace_type === "Remote" ? "TELECOMMUTE" : null;
}

function formatEmploymentType(type: string): string {
  const mappings: Record<string, string> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACTOR",
    Freelance: "CONTRACTOR",
  };
  return mappings[type] || "OTHER";
}

function formatSalaryForSchema(
  salary: Salary | null
): Record<string, string | number | object> | null {
  if (!salary || (!salary.min && !salary.max)) return null;

  // Convert salary unit to schema.org unitText format
  const unitTextMapping: Record<string, string> = {
    hour: "HOUR",
    day: "DAY",
    week: "WEEK",
    month: "MONTH",
    year: "YEAR",
    project: "HOUR", // Default to HOUR for project as schema.org doesn't have a project unit
  };

  const unitText = unitTextMapping[salary.unit];

  // For a range, include minValue and maxValue
  if (salary.min && salary.max) {
    return {
      "@type": "MonetaryAmount",
      currency: salary.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: salary.min,
        maxValue: salary.max,
        unitText: unitText,
      },
    };
  }

  // For a single value (either min or max)
  return {
    "@type": "MonetaryAmount",
    currency: salary.currency,
    value: {
      "@type": "QuantitativeValue",
      value: salary.min || salary.max,
      unitText: unitText,
    },
  };
}

function formatLocation(job: Job): Record<string, string | object> | null {
  // For remote jobs with no physical location
  if (
    job.workplace_type === "Remote" &&
    !job.workplace_city &&
    !job.workplace_country
  ) {
    return null;
  }

  // For jobs with a physical location component
  return {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      ...(job.workplace_city && { addressLocality: job.workplace_city }),
      ...(job.workplace_country && { addressCountry: job.workplace_country }),
    },
  };
}

function formatApplicantLocationRequirements(
  job: Job
): Record<string, string> | Array<Record<string, string>> | null {
  // Only needed for remote jobs, but always return something for remote jobs
  if (job.workplace_type !== "Remote") {
    return null;
  }

  // If no remote region specified or it's Worldwide, return a worldwide requirement
  if (!job.remote_region || job.remote_region === "Worldwide") {
    return {
      "@type": "Country",
      name: "WORLDWIDE",
    };
  }

  // Format based on remote region
  switch (job.remote_region) {
    case "US Only":
      return {
        "@type": "Country",
        name: "USA",
      };
    case "EU Only":
      return {
        "@type": "Country",
        name: "EU",
      };
    case "UK/EU Only":
      return [
        {
          "@type": "Country",
          name: "UK",
        },
        {
          "@type": "Country",
          name: "EU",
        },
      ];
    case "US/Canada Only":
      return [
        {
          "@type": "Country",
          name: "USA",
        },
        {
          "@type": "Country",
          name: "Canada",
        },
      ];
    case "Americas Only":
      return {
        "@type": "Country",
        name: "Americas",
      };
    case "Europe Only":
      return {
        "@type": "Country",
        name: "Europe",
      };
    case "Asia-Pacific Only":
      return {
        "@type": "Country",
        name: "Asia-Pacific",
      };
    default:
      return null;
  }
}

interface JobSchemaProps {
  job: Job;
  slug: string;
}

// Helper to check if a string field exists and has content
function hasContent(field: string | null | undefined): boolean {
  return !!field && field.trim().length > 0;
}

export function JobSchema({ job, slug }: JobSchemaProps) {
  // Format base URL for absolute links
  const baseUrl =
    config.url || process.env.NEXT_PUBLIC_APP_URL || "https://bordful.com";

  // Use slug to create the job URL
  const jobUrl = `${baseUrl}/jobs/${slug}`;

  // Calculate valid through date if not provided (default to 30 days from posted date)
  const postDate = new Date(job.posted_date);
  const defaultValidThrough = new Date(postDate);
  defaultValidThrough.setDate(defaultValidThrough.getDate() + 30);

  // Only add valid_through if the job has it (will need to be added to Airtable)
  const validThrough = job.valid_through
    ? new Date(job.valid_through).toISOString()
    : defaultValidThrough.toISOString();

  // Create schema data object
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: new Date(job.posted_date).toISOString(),
    validThrough: validThrough,
    // Job URL at the root level (correct placement)
    url: jobUrl,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },

    // Optional but recommended properties
    ...(job.job_identifier && {
      identifier: {
        "@type": "PropertyValue",
        name: job.company,
        value: job.job_identifier,
      },
    }),

    // Employment type
    employmentType: formatEmploymentType(job.type),

    // For remote jobs
    ...(formatJobLocationType(job) && {
      jobLocationType: formatJobLocationType(job),
    }),

    // Location handling
    ...(formatLocation(job) && {
      jobLocation: formatLocation(job),
    }),

    // Applicant location requirements for remote jobs
    ...(formatApplicantLocationRequirements(job) && {
      applicantLocationRequirements: formatApplicantLocationRequirements(job),
    }),

    // Salary information
    ...(formatSalaryForSchema(job.salary) && {
      baseSalary: formatSalaryForSchema(job.salary),
    }),

    // Always set directApply to false since we always link to external application forms
    // Ensure this is a boolean false, not a string
    directApply: false as const,

    // Add skills and requirements when available
    ...(hasContent(job.skills) && {
      skills: job.skills,
    }),
    ...(hasContent(job.qualifications) && {
      qualifications: job.qualifications,
    }),
    ...(hasContent(job.education_requirements) && {
      educationRequirements: job.education_requirements,
    }),
    ...(hasContent(job.experience_requirements) && {
      experienceRequirements: job.experience_requirements,
    }),

    // Add industry classification when available
    ...(hasContent(job.industry) && {
      industry: job.industry,
    }),
    ...(hasContent(job.occupational_category) && {
      occupationalCategory: job.occupational_category,
    }),

    // Add job benefits when available
    ...(hasContent(job.benefits) && {
      jobBenefits: job.benefits,
    }),

    // Add responsibilities if available (might be extracted from description in the future)
    ...(hasContent(job.responsibilities) && {
      responsibilities: job.responsibilities,
    }),

    // Add visa sponsorship information
    ...(job.visa_sponsorship !== "Not specified" && {
      eligibilityToWorkRequirement:
        job.visa_sponsorship === "Yes"
          ? "Visa sponsorship is available for this position."
          : "Visa sponsorship is not available for this position.",
    }),
  };

  return (
    <Script
      id="job-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
}

import Airtable from "airtable";
import { WorkplaceType, RemoteRegion } from "@/lib/constants/workplace";
import {
  LanguageCode,
  getLanguageByName,
  LANGUAGE_CODES,
} from "@/lib/constants/languages";

// Initialize Airtable with Personal Access Token
const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
  endpointUrl: "https://api.airtable.com",
}).base(process.env.AIRTABLE_BASE_ID || "");

// Get table name from environment variables with fallback
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Jobs";

export type CareerLevel =
  | "Internship"
  | "EntryLevel"
  | "Associate"
  | "Junior"
  | "MidLevel"
  | "Senior"
  | "Staff"
  | "Principal"
  | "Lead"
  | "Manager"
  | "SeniorManager"
  | "Director"
  | "SeniorDirector"
  | "VP"
  | "SVP"
  | "EVP"
  | "CLevel"
  | "Founder"
  | "NotSpecified";

export type SalaryUnit = "hour" | "day" | "week" | "month" | "year" | "project";
export type SalaryCurrency = "USD" | "EUR" | "GBP";

export interface Salary {
  min: number | null;
  max: number | null;
  currency: SalaryCurrency;
  unit: SalaryUnit;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  salary: Salary | null;
  description: string;
  apply_url: string;
  posted_date: string;
  status: "active" | "inactive";
  career_level: CareerLevel[];
  visa_sponsorship: "Yes" | "No" | "Not specified";
  featured: boolean;
  workplace_type: WorkplaceType;
  remote_region: RemoteRegion;
  timezone_requirements: string | null;
  workplace_city: string | null;
  workplace_country: string | null;
  languages: LanguageCode[];
}

// Format salary for display
export function formatSalary(salary: Salary | null): string {
  if (!salary || (!salary.min && !salary.max)) return "Not specified";

  const currencySymbols: Record<SalaryCurrency, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const formatNumber = (num: number | null): string => {
    if (!num) return "";
    // Only use k format for numbers >= 10000
    if (num >= 10000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    // For smaller numbers, show the full value with thousands separator
    return num.toLocaleString();
  };

  const symbol = currencySymbols[salary.currency];

  // Handle single value cases (only min or only max)
  let range;
  if (salary.min && salary.max) {
    range =
      salary.min === salary.max
        ? formatNumber(salary.min)
        : `${formatNumber(salary.min)}-${formatNumber(salary.max)}`;
  } else {
    range = formatNumber(salary.min || salary.max);
  }

  // Use full words with slash
  const unitDisplay = {
    hour: "/hour",
    day: "/day",
    week: "/week",
    month: "/month",
    year: "/year",
    project: "/project",
  }[salary.unit];

  return `${symbol}${range}${unitDisplay}`;
}

// Normalize salary for comparison (convert to annual USD)
export function normalizeAnnualSalary(salary: Salary | null): number {
  if (!salary || (!salary.min && !salary.max)) return -1;

  // Currency conversion rates (simplified - in production, use real-time rates)
  const currencyRates: Record<SalaryCurrency, number> = {
    USD: 1,
    EUR: 1.1,
    GBP: 1.27,
  };

  // Annualization multipliers
  const annualMultiplier: Record<SalaryUnit, number> = {
    hour: 2080, // 40 hours/week * 52 weeks
    day: 260, // 52 weeks * 5 days
    week: 52,
    month: 12,
    year: 1,
    project: 1, // Projects treated as one-time annual equivalent
  };

  // Use the maximum value for comparison, or minimum if no maximum
  const value = salary.max || salary.min || 0;

  // Convert to USD and annualize
  return value * currencyRates[salary.currency] * annualMultiplier[salary.unit];
}

// Ensure career level is always returned as an array
function normalizeCareerLevel(value: unknown): CareerLevel[] {
  if (!value) {
    return ["NotSpecified"];
  }

  if (Array.isArray(value)) {
    // Convert Airtable's display values to our enum values
    return value.map((level) => {
      // Handle Airtable's display format (e.g., "Entry Level" -> "EntryLevel")
      const normalized = level.replace(/\s+/g, "");
      return normalized as CareerLevel;
    });
  }

  // Handle single value
  const normalized = (value as string).replace(/\s+/g, "");
  return [normalized as CareerLevel];
}

// Clean up Markdown formatting
function cleanMarkdownFormatting(text: string): string {
  if (!text) return "";

  return (
    text
      // First, normalize line endings
      .replace(/\r\n/g, "\n")
      // Fix bold text with extra spaces before closing asterisks and ensure space after
      .replace(/\*\*(.*?)\s*:\s*\*\*(\S)/g, "**$1:** $2")
      // Ensure proper spacing around headers
      .replace(/([^\n])\s*###/g, "$1\n\n###")
      .replace(/###\s*(.*?)\n/g, "### $1\n\n")
      // Fix headers with bold text
      .replace(/###\s*\*\*(.*?)\*\*/g, "### **$1**")
      // Fix bold headers that appear after list items or text
      .replace(/([^\n]+?)\s*\*\*([\w\s,]+?):\*\*/g, "$1\n\n**$2:**")
      // Fix any remaining bold headers
      .replace(/\*\*([\w\s,]+?):\*\*/g, "**$1:**")
      // Fix nested list indentation
      .replace(/\n- ([^\n]+)\n {1,2}-/g, "\n- $1\n    -")
      // Fix list items with bold text (but not headers)
      .replace(/(\n- .*?[^:])\n\s*\*\*([^:]+?)\*\*/g, "$1 **$2**")
      // Ensure consecutive bold sections are separated
      .replace(/\*\*([^*]+?)\*\*\*\*([^*]+?)\*\*/g, "**$1**\n\n**$2**")
      // Remove extra blank lines
      .replace(/\n{3,}/g, "\n\n")
      // Clean up extra spaces
      .replace(/[ \t]+/g, " ")
      // Process line by line
      .split("\n")
      .map((line) => {
        const trimmedLine = line.trim();
        // If line starts with a list marker and is not a bold text, preserve it
        if (trimmedLine.startsWith("- ") || trimmedLine.match(/^\d+\./)) {
          return line;
        }
        // For all other lines (including bold text), remove indentation
        return trimmedLine;
      })
      .join("\n")
      // Final pass to ensure bold headers are on their own lines
      .replace(/([^\n]+)\s*(\*\*[\w\s,]+?:\*\*)/g, "$1\n\n$2")
      // Final pass to ensure space after bold headers
      .replace(/\*\*([\w\s,]+?):\*\*(\S)/g, "**$1:** $2")
      // Ensure proper spacing around multi-line bold text
      .replace(/\*\*([^*]+?)\*\*\n([^\n-])/g, "**$1**\n\n$2")
      // Ensure proper spacing around final paragraphs
      .replace(/\n\s*(\*\*[^*]+?\*\*)\s*\n/g, "\n\n$1\n\n")
      .replace(/\n\s*([^-\n][^*\n]+?)\s*$/g, "\n\n$1")
      .trim()
  );
}

function normalizeWorkplaceType(value: unknown): WorkplaceType {
  if (
    typeof value === "string" &&
    ["On-site", "Hybrid", "Remote"].includes(value)
  ) {
    return value as WorkplaceType;
  }
  // If the value is undefined or invalid, check if there's a remote_region
  // If there is, it's probably a remote job
  if (value === undefined || value === null) {
    return "Not specified";
  }
  return "Not specified";
}

function normalizeRemoteRegion(value: unknown): RemoteRegion {
  if (typeof value === "string") {
    const validRegions = [
      "Worldwide",
      "Americas Only",
      "Europe Only",
      "Asia-Pacific Only",
      "US Only",
      "EU Only",
      "UK/EU Only",
      "US/Canada Only",
    ];
    if (validRegions.includes(value)) {
      return value as RemoteRegion;
    }
  }
  return null;
}

// Function to normalize language data from Airtable
// This can handle multiple formats:
// - ISO codes directly: "en", "fr"
// - "Language Name (code)" format: "English (en)", "French (fr)"
// - Language names: "English", "French" (via lookup)
function normalizeLanguages(value: unknown): LanguageCode[] {
  if (!value) return [];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        // Format 1: Extract code from "Language Name (code)" format
        const languageCodeMatch = /.*?\(([a-z]{2})\)$/i.exec(item);
        if (languageCodeMatch && languageCodeMatch[1]) {
          const extractedCode = languageCodeMatch[1].toLowerCase();

          // Verify the extracted code is valid
          if (LANGUAGE_CODES.includes(extractedCode as LanguageCode)) {
            return extractedCode as LanguageCode;
          }
        }

        // Format 2: Check if the string itself is a valid 2-letter code
        if (
          item.length === 2 &&
          LANGUAGE_CODES.includes(item.toLowerCase() as LanguageCode)
        ) {
          return item.toLowerCase() as LanguageCode;
        }

        // Format 3: Try to look up by language name
        const language = getLanguageByName(item);
        if (language) {
          return language.code as LanguageCode;
        }
      }

      return null;
    })
    .filter((code): code is LanguageCode => code !== null);
}

export async function getJobs(): Promise<Job[]> {
  try {
    // Check for required environment variables
    if (!process.env.AIRTABLE_ACCESS_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      throw new Error("Airtable credentials are not configured");
    }

    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: "{status} = 'active'",
        sort: [{ field: "posted_date", direction: "desc" }],
      })
      .all();

    return records.map((record): Job => {
      const fields = record.fields;
      return {
        id: record.id,
        title: fields.title as string,
        company: fields.company as string,
        type: fields.type as Job["type"],
        salary: {
          min: (fields.salary_min as number) || null,
          max: (fields.salary_max as number) || null,
          currency: (fields.salary_currency as SalaryCurrency) || "USD",
          unit: (fields.salary_unit as SalaryUnit) || "year",
        },
        description: cleanMarkdownFormatting(fields.description as string),
        apply_url: fields.apply_url as string,
        posted_date: fields.posted_date as string,
        status: fields.status as Job["status"],
        career_level: normalizeCareerLevel(fields.career_level),
        visa_sponsorship:
          (fields.visa_sponsorship as Job["visa_sponsorship"]) ||
          "Not specified",
        featured: fields.featured === true,
        workplace_type: normalizeWorkplaceType(fields.workplace_type),
        remote_region: normalizeRemoteRegion(fields.remote_region),
        timezone_requirements: (fields.timezone_requirements as string) || null,
        workplace_city: (fields.workplace_city as string) || null,
        workplace_country: (fields.workplace_country as string) || null,
        languages: normalizeLanguages(fields.languages),
      };
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    // Check for required environment variables
    if (!process.env.AIRTABLE_ACCESS_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      throw new Error("Airtable credentials are not configured");
    }

    const record = await base(TABLE_NAME).find(id);

    if (!record || !record.fields) {
      return null;
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "company",
      "type",
      "description",
      "apply_url",
      "posted_date",
      "status",
    ];

    const missingFields = requiredFields.filter(
      (field) => !record.fields[field]
    );

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(", ")}`);
      return null;
    }

    const job = {
      id: record.id,
      title: record.fields.title as string,
      company: record.fields.company as string,
      type: record.fields.type as Job["type"],
      salary: {
        min: (record.fields.salary_min as number) || null,
        max: (record.fields.salary_max as number) || null,
        currency: (record.fields.salary_currency as SalaryCurrency) || "USD",
        unit: (record.fields.salary_unit as SalaryUnit) || "year",
      },
      description: record.fields.description as string,
      apply_url: record.fields.apply_url as string,
      posted_date: record.fields.posted_date as string,
      status: record.fields.status as Job["status"],
      career_level: normalizeCareerLevel(record.fields.career_level),
      visa_sponsorship:
        (record.fields.visa_sponsorship as Job["visa_sponsorship"]) ||
        "Not specified",
      featured: record.fields.featured === true,
      workplace_type: normalizeWorkplaceType(record.fields.workplace_type),
      remote_region: normalizeRemoteRegion(record.fields.remote_region),
      timezone_requirements:
        (record.fields.timezone_requirements as string) || null,
      workplace_city: (record.fields.workplace_city as string) || null,
      workplace_country: (record.fields.workplace_country as string) || null,
      languages: normalizeLanguages(record.fields.languages),
    };

    return job;
  } catch (error) {
    console.error("Error fetching job:", {
      message: (error as Error).message,
    });
    return null;
  }
}

export async function testConnection() {
  try {
    const records = await base(TABLE_NAME)
      .select({
        maxRecords: 1, // Just get one record to test
      })
      .all();

    console.log(
      "Connected to Airtable successfully.",
      `Found ${records.length} records in ${TABLE_NAME} table.`
    );
    return true;
  } catch (error) {
    console.error("Airtable connection test failed:", {
      message: (error as Error).message,
    });
    return false;
  }
}

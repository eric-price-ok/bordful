import { PrismaClient } from '../generated/prisma' 

declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    // Check if globalThis exists and use it, otherwise create a new client
    if (typeof globalThis !== 'undefined' && !globalThis.prisma) {
        globalThis.prisma = new PrismaClient()
    }
    prisma = (typeof globalThis !== 'undefined' && globalThis.prisma) || new PrismaClient()
}

// Simple stub function - returns null since everything is already USD
export function formatUSDApproximation(salary: Salary | null): string | null {
    return null; // No approximation needed for USD-only salaries
}

export type CareerLevel =
    | "Intern"
    | "Entry Level"
    | "Trained"
    | "Proficient"
    | "Senior"
    | "Principal"
    | "Manager"
    | "Unspecified";

export type SalaryUnit = "hour" | "day" | "week" | "month" | "year" | "project";

export interface Salary {
    min: number | null;
    max: number | null;
    unit: "hour" | "day" | "week" | "month" | "year" | "project";
}

export const CURRENCY_RATES = {
    USD: 1
};

export function normalizeAnnualSalary(salary: Salary | null): number {
    if (!salary || (!salary.min && !salary.max)) return -1;

    // Use the conversion rates from the currency constants
    const exchangeRate = 1; // Always USD, no conversion needed

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
    return value * exchangeRate * annualMultiplier[salary.unit];
}

export interface Job {
    id: string;
    title: string;
    company: string;
    description: string;
    apply_url: string;
    date_posted: string;
    status: "active" | "inactive";
    salary: Salary | null;
    type: string;
    featured: boolean;
    workplace_type: string;
    workplace_city: string | null;
    function?: number;
    experience_id?: number;
}

export function formatSalary(salary: Salary | null): string {
    if (!salary || (!salary.min && !salary.max)) return "Not specified";

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
        } else if (num >= 10000) {
            return `${(num / 1000).toFixed(0)}k`;
        }
        return num.toLocaleString();
    };

    let range;
    if (salary.min && salary.max) {
        range = salary.min === salary.max
            ? formatNumber(salary.min)
            : `${formatNumber(salary.min)}-${formatNumber(salary.max)}`;
    } else {
        range = formatNumber(salary.min || salary.max || 0);
    }

    const unitDisplay = {
        hour: "/hour",
        day: "/day",
        week: "/week",
        month: "/month",
        year: "/year",
        project: "/project",
    }[salary.unit];

    return `$${range}${unitDisplay}`;
}

// Ensure career level is always returned as an array
function normalizeCareerLevel(value: unknown): CareerLevel[] {
    if (!value) {
        return ["Unspecified"];
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

// New function to replace Airtable getJobs()
export async function getJobs() {
    try {
        console.log("Fetching jobs from PostgreSQL...");

        const jobs = await prisma.joblistings.findMany({
            where: {
                approved: true,
                job_status_id: 1  // Active jobs only
            },
            include: {
                company: {
                    select: {
                        common_name: true,
                        website: true
                    }
                },
                jobtype: {
                    select: {
                        name: true
                    }
                },
                officelocations: {
                    select: {
                        name: true
                    }
                },
                cities: {  // Add this include
                    select: {
                        city_name: true
                    }
                }
            },
            orderBy: {
                date_posted: 'desc'
            },
        })

        // Transform to match Airtable's Job interface
        return jobs.map(job => ({
            id: job.id.toString(),
            title: job.job_title,
            company: job.company.common_name,
            type: job.jobtype?.name || "Not specified",
            workplace_type: job.officelocations?.name || "Not specified",
            salary: job.minimum_salary ? {
                min: Number(job.minimum_salary),
                max: job.maximum_salary ? Number(job.maximum_salary) : null,
                unit: "year" // or whatever unit your salaries are in
            } : null,
            description: job.job_description || "",
            benefits: null,
            application_requirements: null,
            apply_url: job.posting_url || "#",
            date_posted: job.date_posted ? job.date_posted.toISOString().split('T')[0] : "",
            status: "active",
            career_level: ["NotSpecified"],
            visa_sponsorship: "Not specified",
            featured: job.featured || false,
            remote_region: null,
            timezone_requirements: null,
            workplace_city: job.cities?.city_name || null,
            workplace_country: null,
            languages: []
        }))

    } catch (error) {
        console.error('Error fetching jobs from PostgreSQL:', error)
        return []
    }
}

export { prisma }
import type { Job } from "@/lib/db/prisma";

export type JobType = Job["type"];

export const JOB_TYPE_DISPLAY_NAMES: Record<JobType, string> = {
  "Full-time": "Full Time",
  "Part-time": "Part Time",
  "Contract to Hire": "Contract to Hire",
  "Contract (1099)": "Contract (1099)",
} as const;

export const JOB_TYPE_DESCRIPTIONS: Record<JobType, string> = {
  "Full Time": "Permanent positions with standard working hours",
  "Part Time": "Positions with reduced or flexible hours",
  "Contract to Hire": "Fixed-term or project-based positions",
  "Contract (1099)": "Self-employed or project-based contractual work",
} as const;

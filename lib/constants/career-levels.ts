import type { CareerLevel } from "@/lib/db/prisma";

export const CAREER_LEVEL_DISPLAY_NAMES: Record<CareerLevel, string> = {
  Intern: "Internship",
  "Entry Level": "Entry Level",
  Trained: "Trained",
  Proficient: "Proficient",
  Senior: "Senior",
  Principal: "Principal",
  Manager: "Manager",
  Unspecified: "Unspecified",
} as const;

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatLocationTitle } from "@/lib/constants/locations";
import { getDisplayNameFromCode } from "@/lib/constants/languages";
import { JOB_TYPE_DISPLAY_NAMES } from "@/lib/constants/job-types";
import { CAREER_LEVEL_DISPLAY_NAMES } from "@/lib/constants/career-levels";

// Category-related constants
const CATEGORY_SECTIONS = ["types", "levels", "languages", "locations"];
const CATEGORY_TYPES = ["type", "level", "language", "location"];

// Special case mappings for better display names (just for section names)
const SEGMENT_DISPLAY_NAMES: Record<string, string> = {
  // Main sections
  jobs: "Jobs",
  pricing: "Pricing",
  about: "About",
  contact: "Contact",
  faq: "FAQ",
  "job-alerts": "Job Alerts",
  changelog: "Changelog",

  // Job categories
  types: "Job Types",
  levels: "Career Levels",
  languages: "Languages",
  locations: "Job Locations",

  // Type mapping - match with URL segment
  type: "Type",
  level: "Level",
  language: "Language",
  location: "Location",
};

// Words that should not be capitalized in title case (unless they're the first word)
const LOWERCASE_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "for",
  "nor",
  "on",
  "at",
  "to",
  "from",
  "by",
  "with",
  "in",
  "of",
]);

interface SimpleBreadcrumbProps {
  /**
   * Optional job title to display for job detail pages
   */
  dynamicData?: {
    name: string;
    url: string;
  };
}

// Apply standard title casing rules - extracted outside component
const applyTitleCase = (text: string): string => {
  // Split the text into words
  const words = text.split("-");

  // Process each word
  return words
    .map((word, index) => {
      // Check if this looks like an acronym (all uppercase or 2-3 characters)
      if (word.length <= 3) {
        return word.toUpperCase();
      }

      // Check if it's a common lowercase word (unless it's the first word)
      if (index > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }

      // Default: capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// Format a segment using existing utility functions and smart title casing - extracted outside component
const formatSegment = (
  segment: string,
  context?: {
    type?: "jobType" | "careerLevel" | "language" | "location";
    parentSegment?: string;
  }
): string => {
  // Check if we have a named mapping first (for section names)
  if (SEGMENT_DISPLAY_NAMES[segment]) {
    return SEGMENT_DISPLAY_NAMES[segment];
  }

  // Handle based on context if provided
  if (context) {
    if (context.type === "location" || context.parentSegment === "location") {
      // Handle hyphenated location names by converting to spaces before formatting
      // This is necessary for country names like "united-states"
      const formattedLocation = segment.replace(/-/g, " ");
      return formatLocationTitle(formattedLocation);
    }

    if (context.type === "language" || context.parentSegment === "language") {
      // getDisplayNameFromCode expects a valid language code
      // We'll try to use it but fall back to default formatting
      try {
        return getDisplayNameFromCode(segment as string);
      } catch {
        // Fall back to default formatting below
      }
    }

    if (context.type === "jobType" || context.parentSegment === "type") {
      // Check if it matches any of our job types (case-insensitive)
      const match = Object.entries(JOB_TYPE_DISPLAY_NAMES).find(
        ([key]) => key.toLowerCase() === segment.toLowerCase()
      );
      if (match) return match[1];
    }

    if (context.type === "careerLevel" || context.parentSegment === "level") {
      // Check if it matches any of our career levels (case-insensitive)
      const match = Object.entries(CAREER_LEVEL_DISPLAY_NAMES).find(
        ([key]) => key.toLowerCase() === segment.toLowerCase()
      );
      if (match) return match[1];
    }
  }

  // Apply standard title casing for anything not handled above
  return applyTitleCase(segment);
};

export function SimpleBreadcrumb({ dynamicData }: SimpleBreadcrumbProps) {
  const pathname = usePathname();
  const [items, setItems] = React.useState<{ name: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  // Mount effect for hydration safety
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle job detail page breadcrumbs (like /jobs/job-title)
  const handleJobDetailPage = (
    segments: string[],
    dynamicData: { name: string; url: string }
  ): { name: string; url: string }[] => {
    return [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
      dynamicData,
    ];
  };

  // Handle job category detail page breadcrumbs (like /jobs/type/full-time)
  const handleCategoryDetailPage = (
    segments: string[]
  ): { name: string; url: string }[] => {
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
    ];

    // Add Category segment (Type, Level, etc.)
    const categoryName = formatSegment(segments[1]);
    const categoryPlural = `${segments[1]}s`; // e.g., types, levels
    breadcrumbs.push({
      name: categoryName,
      url: `/jobs/${categoryPlural}`,
    });

    // Add the specific value with nice formatting based on category type
    const valueSegment = formatSegment(segments[2], {
      parentSegment: segments[1],
    });

    // Add "Jobs" to the end for job categories
    breadcrumbs.push({
      name: `${valueSegment} Jobs`,
      url: `/${segments[0]}/${segments[1]}/${segments[2]}`,
    });

    return breadcrumbs;
  };

  // Handle standard page breadcrumbs
  const handleStandardPage = (
    segments: string[]
  ): { name: string; url: string }[] => {
    const breadcrumbs = [{ name: "Home", url: "/" }];
    let currentPath = "";

    // Build breadcrumbs for each segment
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Determine context for better formatting
      const context = i > 0 ? { parentSegment: segments[i - 1] } : undefined;

      breadcrumbs.push({
        name: formatSegment(segment, context),
        url: currentPath,
      });
    }

    return breadcrumbs;
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbItems = React.useCallback(
    (pathname: string, dynamicData?: { name: string; url: string }) => {
      const segments = pathname.split("/").filter(Boolean);

      // Handle special case for job detail pages
      if (
        dynamicData &&
        segments.length >= 2 &&
        segments[0] === "jobs" &&
        !CATEGORY_SECTIONS.includes(segments[1])
      ) {
        return handleJobDetailPage(segments, dynamicData);
      }

      // Special handling for job category detail pages (job/type/full-time, etc.)
      if (
        segments.length >= 3 &&
        segments[0] === "jobs" &&
        CATEGORY_TYPES.includes(segments[1])
      ) {
        return handleCategoryDetailPage(segments);
      }

      // Standard case for all other pages
      return handleStandardPage(segments);
    },
    []
  );

  // Update breadcrumb items when path or dynamic data changes
  React.useEffect(() => {
    if (!isMounted) return;

    setIsLoading(true);
    const newItems = generateBreadcrumbItems(pathname, dynamicData);
    setItems(newItems);

    // Small delay to prevent a flash during fast loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, dynamicData, generateBreadcrumbItems, isMounted]);

  // Placeholder that matches breadcrumb dimensions
  const renderPlaceholder = () => (
    <div
      className="flex items-center gap-1 text-xs animate-pulse"
      aria-hidden="true"
    >
      <div className="h-4 w-10 bg-gray-100 rounded" /> {/* Home */}
      <div className="text-gray-200 mx-1">&gt;</div> {/* Separator */}
      <div className="h-4 w-16 bg-gray-100 rounded" /> {/* Second level */}
      {pathname.split("/").length > 2 && (
        <>
          <div className="text-gray-200 mx-1">&gt;</div> {/* Separator */}
          <div className="h-4 w-24 bg-gray-100 rounded" /> {/* Third level */}
        </>
      )}
    </div>
  );

  // During server-side rendering or before mounting, render the placeholder
  if (!isMounted || isLoading) {
    return renderPlaceholder();
  }

  return (
    <div className="transition-opacity duration-200 ease-in-out opacity-100">
      <Breadcrumb items={items}>
        <BreadcrumbList className="gap-1 text-xs">
          {items.map((item, index) => (
            <React.Fragment key={item.url}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="text-gray-900">
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                    href={item.url}
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator className="text-gray-300 mx-[-0.25rem]" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

import { formatLocationTitle } from "@/lib/constants/locations";
import { JOB_TYPE_DISPLAY_NAMES } from "@/lib/constants/job-types";
import { CAREER_LEVEL_DISPLAY_NAMES } from "@/lib/constants/career-levels";
import { getDisplayNameFromCode } from "@/lib/constants/languages";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface RouteParams {
  [key: string]: string;
}

export interface RouteConfig {
  path: string;
  name: string;
  dynamic?: boolean;
  getBreadcrumbData?: (params: RouteParams) => Promise<BreadcrumbItem>;
}

// Route configuration for breadcrumb generation
export const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/jobs",
    name: "Jobs",
  },
  {
    path: "/jobs/[slug]",
    name: "Job Details",
    dynamic: true,
    getBreadcrumbData: async (params) => {
      // We'll get the job title from the page component instead
      return {
        name: "Job Details",
        url: `/jobs/${params.slug}`,
      };
    },
  },
  {
    path: "/jobs/type/[type]",
    name: "Job Type",
    dynamic: true,
    getBreadcrumbData: async (params) => {
      try {
        const type = params.type.toLowerCase();
        const displayName =
          JOB_TYPE_DISPLAY_NAMES[type as keyof typeof JOB_TYPE_DISPLAY_NAMES] ||
          type;
        return {
          name: displayName,
          url: `/jobs/type/${type}`,
        };
      } catch (_) {
        // Fallback to basic type name
        return {
          name: params.type.charAt(0).toUpperCase() + params.type.slice(1),
          url: `/jobs/type/${params.type}`,
        };
      }
    },
  },
  {
    path: "/jobs/level/[level]",
    name: "Career Level",
    dynamic: true,
    getBreadcrumbData: async (params) => {
      try {
        const level = params.level.toLowerCase();
        const displayName =
          CAREER_LEVEL_DISPLAY_NAMES[
            level as keyof typeof CAREER_LEVEL_DISPLAY_NAMES
          ] || level;
        return {
          name: displayName,
          url: `/jobs/level/${level}`,
        };
      } catch (_) {
        // Fallback to basic level name
        return {
          name: params.level.charAt(0).toUpperCase() + params.level.slice(1),
          url: `/jobs/level/${params.level}`,
        };
      }
    },
  },
  {
    path: "/jobs/language/[language]",
    name: "Language",
    dynamic: true,
    getBreadcrumbData: async (params) => {
      try {
        const language = params.language.toLowerCase();
        const displayName = getDisplayNameFromCode(language) || language;
        return {
          name: displayName,
          url: `/jobs/language/${language}`,
        };
      } catch (_) {
        // Fallback to basic language name
        return {
          name:
            params.language.charAt(0).toUpperCase() + params.language.slice(1),
          url: `/jobs/language/${params.language}`,
        };
      }
    },
  },
  {
    path: "/jobs/location/[location]",
    name: "Location",
    dynamic: true,
    getBreadcrumbData: async (params) => {
      try {
        const location = params.location.toLowerCase();
        const displayName = formatLocationTitle(location);
        return {
          name: displayName,
          url: `/jobs/location/${location}`,
        };
      } catch (_) {
        // Fallback to basic location name
        return {
          name:
            params.location.charAt(0).toUpperCase() + params.location.slice(1),
          url: `/jobs/location/${params.location}`,
        };
      }
    },
  },
  {
    path: "/jobs/types",
    name: "Job Types",
  },
  {
    path: "/jobs/levels",
    name: "Career Levels",
  },
  {
    path: "/jobs/languages",
    name: "Languages",
  },
  {
    path: "/jobs/locations",
    name: "Job Locations",
  },
  {
    path: "/pricing",
    name: "Pricing",
  },
  {
    path: "/about",
    name: "About",
  },
  {
    path: "/contact",
    name: "Contact",
  },
];

// Helper function to match a path against route configurations
export function matchRoute(path: string): RouteConfig | undefined {
  return routes.find((route) => {
    if (route.dynamic) {
      // Convert route path to regex pattern
      const pattern = route.path
        .replace(/\[([^\]]+)\]/g, "([^/]+)") // Replace [param] with regex capture group
        .replace(/\//g, "\\/"); // Escape forward slashes
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return route.path === path;
  });
}

// Helper function to extract params from dynamic route
export function extractParams(
  path: string,
  route: RouteConfig
): Record<string, string> {
  if (!route.dynamic) return {};

  const pattern = route.path
    .replace(/\[([^\]]+)\]/g, "([^/]+)") // Replace [param] with regex capture group
    .replace(/\//g, "\\/"); // Escape forward slashes
  const regex = new RegExp(`^${pattern}$`);
  const matches = path.match(regex);

  if (!matches) return {};

  const params: Record<string, string> = {};
  const paramNames =
    route.path.match(/\[([^\]]+)\]/g)?.map((p) => p.slice(1, -1)) || [];

  paramNames.forEach((name, index) => {
    params[name] = matches[index + 1];
  });

  return params;
}

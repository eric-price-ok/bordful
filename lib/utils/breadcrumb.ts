import { BreadcrumbItem, matchRoute, extractParams } from "@/lib/config/routes";

/**
 * Generates breadcrumb items for a given path
 * @param path The current path
 * @returns Array of breadcrumb items
 */
export async function generateBreadcrumbs(
  path: string
): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = [];
  const segments = path.split("/").filter(Boolean);
  let currentPath = "";

  // Always start with home
  breadcrumbs.push({
    name: "Home",
    url: "/",
  });

  // Build breadcrumbs for each segment
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = matchRoute(currentPath);

    if (route) {
      if (route.dynamic && route.getBreadcrumbData) {
        try {
          const params = extractParams(currentPath, route);
          const data = await route.getBreadcrumbData(params);
          breadcrumbs.push(data);
        } catch (_) {
          // If we can't get dynamic data, fall back to the route name
          breadcrumbs.push({
            name: route.name,
            url: currentPath,
          });
        }
      } else {
        breadcrumbs.push({
          name: route.name,
          url: currentPath,
        });
      }
    }
  }

  return breadcrumbs;
}

/**
 * Generates breadcrumb items for a given path with caching
 * @param path The current path
 * @returns Array of breadcrumb items
 */
const breadcrumbCache = new Map<string, BreadcrumbItem[]>();

export async function generateBreadcrumbsWithCache(
  path: string
): Promise<BreadcrumbItem[]> {
  // Check cache first
  if (breadcrumbCache.has(path)) {
    return breadcrumbCache.get(path)!;
  }

  // Generate breadcrumbs
  const breadcrumbs = await generateBreadcrumbs(path);

  // Cache the result
  breadcrumbCache.set(path, breadcrumbs);

  return breadcrumbs;
}

/**
 * Clears the breadcrumb cache
 */
export function clearBreadcrumbCache() {
  breadcrumbCache.clear();
}

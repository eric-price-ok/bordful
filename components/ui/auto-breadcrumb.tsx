"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { generateBreadcrumbsWithCache } from "@/lib/utils/breadcrumb";
import type { BreadcrumbItem } from "@/lib/config/routes";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AutoBreadcrumbProps {
  jobTitle?: string;
}

// Memoized breadcrumb item component to prevent unnecessary re-renders
const MemoizedBreadcrumbItem = React.memo(
  ({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) => (
    <BreadcrumbItemComponent>
      {isLast ? (
        <BreadcrumbPage className="text-gray-900">{item.name}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink
          className="text-gray-500 hover:text-gray-900 transition-colors"
          href={item.url}
        >
          {item.name}
        </BreadcrumbLink>
      )}
    </BreadcrumbItemComponent>
  )
);

MemoizedBreadcrumbItem.displayName = "MemoizedBreadcrumbItem";

// Memoized separator component
const MemoizedSeparator = React.memo(() => (
  <BreadcrumbSeparator className="text-gray-300 mx-[-0.25rem]" />
));

MemoizedSeparator.displayName = "MemoizedSeparator";

export function AutoBreadcrumb({ jobTitle }: AutoBreadcrumbProps) {
  const pathname = usePathname();
  const [items, setItems] = React.useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Memoize the job items to prevent unnecessary recalculations
  const jobItems = React.useMemo(
    () => [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
      { name: jobTitle || "Job Details", url: pathname },
    ],
    [jobTitle, pathname]
  );

  // Memoize loading items
  const loadingItems = React.useMemo(
    () => [
      { name: "Home", url: "/" },
      ...(pathname !== "/" ? [{ name: "Loading...", url: pathname }] : []),
    ],
    [pathname]
  );

  // Memoize error items
  const errorItems = React.useMemo(
    () => [
      { name: "Home", url: "/" },
      ...(pathname !== "/" ? [{ name: "Error", url: pathname }] : []),
    ],
    [pathname]
  );

  React.useEffect(() => {
    let mounted = true;

    async function loadBreadcrumbs() {
      setIsLoading(true);
      setError(null);
      try {
        const breadcrumbs = await generateBreadcrumbsWithCache(pathname);
        if (mounted) {
          // If we have a job title and we're on a job page, use it
          if (jobTitle && pathname.startsWith("/jobs/")) {
            const jobBreadcrumb = breadcrumbs.find((b) => b.url === pathname);
            if (jobBreadcrumb) {
              jobBreadcrumb.name = jobTitle;
            }
          }
          setItems(breadcrumbs);
        }
      } catch (error) {
        console.error("Error loading breadcrumbs:", error);
        if (mounted) {
          setError(error as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadBreadcrumbs();

    return () => {
      mounted = false;
    };
  }, [pathname, jobTitle]);

  // If we have a job title and we're on a job page, use it immediately
  if (jobTitle && pathname.startsWith("/jobs/")) {
    return (
      <Breadcrumb items={jobItems}>
        <BreadcrumbList className="gap-1 text-xs">
          {jobItems.map((item, index) => (
            <React.Fragment key={item.url}>
              <MemoizedBreadcrumbItem
                item={item}
                isLast={index === jobItems.length - 1}
              />
              {index < jobItems.length - 1 && <MemoizedSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // For other pages, show loading state or error state
  if (isLoading || items.length === 0) {
    return (
      <Breadcrumb items={loadingItems}>
        <BreadcrumbList className="gap-1 text-xs">
          {loadingItems.map((item, index) => (
            <React.Fragment key={item.url}>
              <MemoizedBreadcrumbItem
                item={item}
                isLast={index === loadingItems.length - 1}
              />
              {index < loadingItems.length - 1 && <MemoizedSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (error) {
    return (
      <Breadcrumb items={errorItems}>
        <BreadcrumbList className="gap-1 text-xs">
          {errorItems.map((item, index) => (
            <React.Fragment key={item.url}>
              <MemoizedBreadcrumbItem
                item={item}
                isLast={index === errorItems.length - 1}
              />
              {index < errorItems.length - 1 && <MemoizedSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb items={items}>
      <BreadcrumbList className="gap-1 text-xs">
        {items.map((item, index) => (
          <React.Fragment key={item.url}>
            <MemoizedBreadcrumbItem
              item={item}
              isLast={index === items.length - 1}
            />
            {index < items.length - 1 && <MemoizedSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

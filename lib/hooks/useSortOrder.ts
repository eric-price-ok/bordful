"use client";

import { parseAsString, useQueryState } from "nuqs";

export type SortOption = "newest" | "oldest" | "salary";

export function useSortOrder() {
  const [sortOrder, setSortOrder] = useQueryState(
    "sort",
    parseAsString.withDefault("newest")
  );

  return {
    sortOrder: sortOrder as SortOption,
    setSortOrder: (value: SortOption) => {
      // If value is "newest" (default), remove the parameter from URL
      setSortOrder(value === "newest" ? null : value);
    },
  };
}

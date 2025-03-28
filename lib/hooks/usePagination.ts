"use client";

import { parseAsInteger, useQueryState } from "nuqs";

export function usePagination() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  return {
    page,
    setPage: (value: number) => {
      // If value is 1 (default), remove the parameter from URL
      setPage(value === 1 ? null : value);
    },
  };
}

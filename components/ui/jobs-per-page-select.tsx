"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/lib/hooks/usePagination";
import config from "@/config";

export function JobsPerPageSelect() {
  const { perPage, setPerPage } = usePagination();
  const defaultPerPage = config.jobListings?.defaultPerPage || 10;

  // Options for per page
  const perPageOptions = [5, 10, 25, 50, 100];

  // Ensure perPage is a valid option
  const validPerPage = perPageOptions.includes(perPage)
    ? perPage
    : defaultPerPage;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="per-page-trigger"
        className="text-sm text-muted-foreground whitespace-nowrap"
      >
        Jobs per page:
      </label>
      <Select
        value={validPerPage.toString()}
        onValueChange={(value) => {
          const newValue = parseInt(value, 10);
          setPerPage(newValue === defaultPerPage ? null : newValue);
        }}
      >
        <SelectTrigger
          id="per-page-trigger"
          className="w-[90px] h-7 text-xs"
          aria-label="Select number of jobs to display per page"
        >
          <SelectValue placeholder="Show" />
        </SelectTrigger>
        <SelectContent
          className="bg-white min-w-[90px]"
          position="popper"
          aria-label="Jobs per page options"
        >
          {perPageOptions.map((option) => (
            <SelectItem
              key={option}
              value={option.toString()}
              className="text-xs"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

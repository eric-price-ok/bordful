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

  // Get label configuration with fallbacks
  const showLabel = config.jobListings?.labels?.perPage?.show ?? true;
  const labelText =
    config.jobListings?.labels?.perPage?.text || "Jobs per page:";

  // Ensure perPage is a valid option
  const validPerPage = perPageOptions.includes(perPage)
    ? perPage
    : defaultPerPage;

  // Adjust width based on whether label is shown
  const triggerWidth = showLabel ? "w-[90px]" : "w-[120px]";

  return (
    <div className="flex items-center gap-2">
      {/* Only show label if configured */}
      {showLabel && (
        <label
          htmlFor="per-page-trigger"
          className="text-sm text-muted-foreground whitespace-nowrap"
        >
          {labelText}
        </label>
      )}
      <Select
        value={validPerPage.toString()}
        onValueChange={(value) => {
          const newValue = parseInt(value, 10);
          setPerPage(newValue === defaultPerPage ? null : newValue);
        }}
      >
        <SelectTrigger
          id="per-page-trigger"
          className={`${triggerWidth} h-7 text-xs`}
          aria-label="Select number of jobs to display per page"
        >
          <SelectValue
            placeholder={showLabel ? "" : `${defaultPerPage} per page`}
          />
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
              {showLabel ? option : `${option} per page`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

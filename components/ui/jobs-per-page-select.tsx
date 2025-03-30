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
  const isDefault = perPage === defaultPerPage;

  // Options for per page
  const perPageOptions = [5, 10, 25, 50, 100];

  // Ensure perPage is a valid option
  const validPerPage = perPageOptions.includes(perPage)
    ? perPage
    : defaultPerPage;

  return (
    <div className="flex items-center gap-2 z-10">
      <label
        htmlFor="per-page"
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
        <SelectTrigger id="per-page" className="w-[80px] h-8 px-3 text-sm">
          <SelectValue placeholder={defaultPerPage.toString()} />
        </SelectTrigger>
        <SelectContent>
          {perPageOptions.map((option) => (
            <SelectItem
              key={option}
              value={option.toString()}
              className={
                isDefault && option === defaultPerPage ? "font-medium" : ""
              }
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

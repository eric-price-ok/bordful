"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSortOrder } from "@/lib/hooks/useSortOrder";
import config from "@/config";

type SortOption = "newest" | "oldest" | "salary";

// Sort option labels mapping
const sortOptionLabels: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  salary: "Highest salary",
};

export function SortOrderSelect() {
  const { sortOrder, setSortOrder } = useSortOrder();

  // Get available sort options from config or use default
  const availableSortOptions = config.jobListings?.sortOptions || [
    "newest",
    "oldest",
    "salary",
  ];

  // Get default sort order from config or use "newest"
  const defaultSortOrder =
    (config.jobListings?.defaultSortOrder as SortOption) || "newest";

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-order-trigger"
        className="text-sm text-muted-foreground whitespace-nowrap"
      >
        Sort by:
      </label>
      <Select
        value={sortOrder}
        onValueChange={(value: SortOption) => {
          // Only pass null if it's the default value
          if (value === defaultSortOrder) {
            setSortOrder(null);
          } else {
            setSortOrder(value);
          }
        }}
      >
        <SelectTrigger
          id="sort-order-trigger"
          className="w-[110px] h-7 text-xs"
          aria-label="Select sort order for job listings"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-white" position="popper">
          {availableSortOptions.map((option) => (
            <SelectItem key={option} value={option} className="text-xs">
              {sortOptionLabels[option as SortOption]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

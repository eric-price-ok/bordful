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

  // Check if current sort is the default
  const isDefault = sortOrder === defaultSortOrder;

  return (
    <div className="flex items-center gap-2 z-10">
      <label
        htmlFor="sort-order"
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
        <SelectTrigger id="sort-order" className="w-[140px] h-8 px-3 text-sm">
          <SelectValue placeholder={sortOptionLabels[defaultSortOrder]} />
        </SelectTrigger>
        <SelectContent>
          {availableSortOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className={
                isDefault && option === defaultSortOrder ? "font-medium" : ""
              }
            >
              {sortOptionLabels[option as SortOption]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

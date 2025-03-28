"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSortOrder, SortOption } from "@/lib/hooks/useSortOrder";
import { useState } from "react";

export function SortOrderSelect() {
  const { sortOrder, setSortOrder } = useSortOrder();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleValueChange = (value: string) => {
    setIsUpdating(true);
    try {
      setSortOrder(value as SortOption);
    } catch (error) {
      console.error("Invalid sort order value:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={sortOrder}
      onValueChange={handleValueChange}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="w-full sm:w-[140px] h-7 text-xs"
        aria-label="Select sort order for job listings"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="bg-white" position="popper">
        <SelectItem value="newest" className="text-xs">
          Newest first
        </SelectItem>
        <SelectItem value="oldest" className="text-xs">
          Oldest first
        </SelectItem>
        <SelectItem value="salary" className="text-xs">
          Highest salary
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

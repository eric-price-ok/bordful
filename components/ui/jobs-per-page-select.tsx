"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobsPerPage } from "@/lib/hooks/useJobsPerPage";
import { useState } from "react";

export function JobsPerPageSelect() {
  const { jobsPerPage, setJobsPerPage } = useJobsPerPage();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleValueChange = (value: string) => {
    setIsUpdating(true);
    try {
      setJobsPerPage(parseInt(value, 10));
    } catch (error) {
      console.error("Invalid jobs per page value:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={jobsPerPage.toString()}
      onValueChange={handleValueChange}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="w-full sm:w-[130px] h-7 text-xs"
        aria-label="Select number of jobs to display per page"
      >
        <SelectValue placeholder="Show" />
      </SelectTrigger>
      <SelectContent
        className="bg-white min-w-[130px]"
        position="popper"
        aria-label="Jobs per page options"
      >
        <SelectItem value="10" className="text-xs">
          10 per page
        </SelectItem>
        <SelectItem value="25" className="text-xs">
          25 per page
        </SelectItem>
        <SelectItem value="50" className="text-xs">
          50 per page
        </SelectItem>
        <SelectItem value="100" className="text-xs">
          100 per page
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

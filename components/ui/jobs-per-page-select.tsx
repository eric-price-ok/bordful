"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobsPerPage } from "@/lib/hooks/useJobsPerPage";

export function JobsPerPageSelect() {
  const { jobsPerPage, setJobsPerPage } = useJobsPerPage();

  return (
    <Select
      value={jobsPerPage.toString()}
      onValueChange={(value) => setJobsPerPage(parseInt(value, 10))}
    >
      <SelectTrigger className="w-full sm:w-[130px] h-7 text-xs">
        <SelectValue placeholder="Show" />
      </SelectTrigger>
      <SelectContent className="bg-white min-w-[130px]" position="popper">
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

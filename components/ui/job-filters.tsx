import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo, useCallback } from "react";
import { CareerLevel, Job, normalizeAnnualSalary } from "@/lib/db/airtable";
import { CAREER_LEVEL_DISPLAY_NAMES } from "@/lib/constants/career-levels";
import {
  LanguageCode,
  getDisplayNameFromCode,
} from "@/lib/constants/languages";

type FilterType =
  | "type"
  | "role"
  | "remote"
  | "salary"
  | "visa"
  | "language"
  | "clear";
type FilterValue = string[] | boolean | CareerLevel[] | LanguageCode[] | true;

interface JobFiltersProps {
  onFilterChange: (filterType: FilterType, value: FilterValue) => void;
  initialFilters: {
    types: string[];
    roles: CareerLevel[];
    remote: boolean;
    salaryRanges: string[];
    visa: boolean;
    languages: LanguageCode[];
  };
  jobs: Job[];
}

// Generic handler for array-based filters
function useArrayFilter<T>(
  initialValue: T[],
  filterType: FilterType,
  onFilterChange: (type: FilterType, value: T[]) => void
) {
  const [selected, setSelected] = useState<T[]>(initialValue);

  const handleChange = useCallback(
    (checked: boolean, value: T) => {
      const newArray = checked
        ? [...selected, value]
        : selected.filter((item) => item !== value);
      setSelected(newArray);
      onFilterChange(filterType, newArray);
    },
    [filterType, onFilterChange, selected]
  );

  // Reset function
  const reset = useCallback(() => {
    setSelected([]);
  }, []);

  return [selected, handleChange, reset] as const;
}

// Generic handler for boolean filters
function useBooleanFilter(
  initialValue: boolean,
  filterType: FilterType,
  onFilterChange: (type: FilterType, value: boolean) => void
) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    (checked: boolean) => {
      setValue(checked);
      onFilterChange(filterType, checked);
    },
    [filterType, onFilterChange]
  );

  // Reset function
  const reset = useCallback(() => {
    setValue(false);
  }, []);

  return [value, handleChange, reset] as const;
}

export function JobFilters({
  onFilterChange,
  initialFilters,
  jobs,
}: JobFiltersProps) {
  // Use generic array filter hooks
  const [selectedTypes, handleTypeChange, resetTypes] = useArrayFilter(
    initialFilters.types,
    "type",
    onFilterChange
  );
  const [selectedLevels, handleLevelChange, resetLevels] = useArrayFilter(
    initialFilters.roles,
    "role",
    onFilterChange
  );
  const [selectedSalaryRanges, handleSalaryChange, resetSalary] =
    useArrayFilter(initialFilters.salaryRanges, "salary", onFilterChange);
  const [selectedLanguages, handleLanguageChange, resetLanguages] =
    useArrayFilter(initialFilters.languages, "language", onFilterChange);

  // Use generic boolean filter hooks
  const [isRemoteOnly, handleRemoteChange, resetRemote] = useBooleanFilter(
    initialFilters.remote,
    "remote",
    onFilterChange
  );
  const [isVisaSponsorship, handleVisaChange, resetVisa] = useBooleanFilter(
    initialFilters.visa,
    "visa",
    onFilterChange
  );

  // Toggle states for expandable sections
  const [showAllLevels, setShowAllLevels] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  // Predefined lists
  const initialLevels: CareerLevel[] = [
    "Internship",
    "EntryLevel",
    "Associate",
    "Junior",
    "MidLevel",
    "Senior",
    "Staff",
    "Principal",
  ];

  const additionalLevels: CareerLevel[] = [
    "Lead",
    "Manager",
    "SeniorManager",
    "Director",
    "SeniorDirector",
    "VP",
    "SVP",
    "EVP",
    "CLevel",
    "Founder",
  ];

  // Handle clearing all filters
  const handleClearFilters = useCallback(() => {
    resetTypes();
    resetLevels();
    resetSalary();
    resetLanguages();
    resetRemote();
    resetVisa();
    onFilterChange("clear", true);
  }, [
    onFilterChange,
    resetTypes,
    resetLevels,
    resetSalary,
    resetLanguages,
    resetRemote,
    resetVisa,
  ]);

  // Memoized counts and calculations
  const counts = useMemo(
    () => ({
      types: jobs.reduce((acc, job) => {
        if (job.type) acc[job.type] = (acc[job.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),

      roles: jobs.reduce((acc, job) => {
        job.career_level.forEach((level) => {
          if (level !== "NotSpecified") acc[level] = (acc[level] || 0) + 1;
        });
        return acc;
      }, {} as Record<CareerLevel, number>),

      remote: jobs.filter((job) => job.workplace_type === "Remote").length,

      visa: jobs.filter((job) => job.visa_sponsorship === "Yes").length,

      salary: jobs.reduce(
        (acc, job) => {
          if (!job.salary) return acc;
          const annualSalary = normalizeAnnualSalary(job.salary);
          if (annualSalary < 50000) acc["< $50K"]++;
          else if (annualSalary <= 100000) acc["$50K - $100K"]++;
          else if (annualSalary <= 200000) acc["$100K - $200K"]++;
          else acc["> $200K"]++;
          return acc;
        },
        {
          "< $50K": 0,
          "$50K - $100K": 0,
          "$100K - $200K": 0,
          "> $200K": 0,
        }
      ),

      languages: jobs.reduce((acc, job) => {
        job.languages?.forEach((lang) => {
          acc[lang] = (acc[lang] || 0) + 1;
        });
        return acc;
      }, {} as Record<LanguageCode, number>),
    }),
    [jobs]
  );

  // Sort and filter languages
  const languageEntries = useMemo(() => {
    const entries = Object.entries(counts.languages)
      // Sort alphabetically by language name for better UX
      .sort((a, b) => {
        const nameA = getDisplayNameFromCode(a[0] as LanguageCode);
        const nameB = getDisplayNameFromCode(b[0] as LanguageCode);
        return nameA.localeCompare(nameB);
      })
      .filter(([, count]) => count > 0);

    return {
      initial: entries.slice(0, 5),
      additional: entries.slice(5),
      visible: showAllLanguages ? entries : entries.slice(0, 5),
    };
  }, [counts.languages, showAllLanguages]);

  // Visible levels based on toggle
  const visibleLevels = showAllLevels
    ? [...initialLevels, ...additionalLevels]
    : initialLevels;

  return (
    <div className="p-5 border rounded-lg space-y-6 bg-gray-50 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-md font-semibold">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm underline underline-offset-4 text-zinc-900 hover:text-zinc-700 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Job Type */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Job Type</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="full-time"
                checked={selectedTypes.includes("Full-time")}
                onCheckedChange={(checked: boolean) =>
                  handleTypeChange(checked, "Full-time")
                }
              />
              <Label htmlFor="full-time" className="text-sm font-normal">
                Full-time
              </Label>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedTypes.includes("Full-time")
                  ? "bg-zinc-900 text-zinc-50"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {(counts.types["Full-time"] || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="part-time"
                checked={selectedTypes.includes("Part-time")}
                onCheckedChange={(checked: boolean) =>
                  handleTypeChange(checked, "Part-time")
                }
              />
              <Label htmlFor="part-time" className="text-sm font-normal">
                Part-time
              </Label>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedTypes.includes("Part-time")
                  ? "bg-zinc-900 text-zinc-50"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {(counts.types["Part-time"] || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contract"
                checked={selectedTypes.includes("Contract")}
                onCheckedChange={(checked: boolean) =>
                  handleTypeChange(checked, "Contract")
                }
              />
              <Label htmlFor="contract" className="text-sm font-normal">
                Contract
              </Label>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedTypes.includes("Contract")
                  ? "bg-zinc-900 text-zinc-50"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {(counts.types["Contract"] || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freelance"
                checked={selectedTypes.includes("Freelance")}
                onCheckedChange={(checked: boolean) =>
                  handleTypeChange(checked, "Freelance")
                }
              />
              <Label htmlFor="freelance" className="text-sm font-normal">
                Freelance
              </Label>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedTypes.includes("Freelance")
                  ? "bg-zinc-900 text-zinc-50"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {(counts.types["Freelance"] || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Career Level */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Career Level</h2>
        <div className="space-y-3">
          {visibleLevels.map((level) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={level.toLowerCase().replace(" ", "-")}
                  checked={selectedLevels.includes(level)}
                  onCheckedChange={(checked: boolean) =>
                    handleLevelChange(checked, level)
                  }
                />
                <Label
                  htmlFor={level.toLowerCase().replace(" ", "-")}
                  className="text-sm font-normal"
                >
                  {CAREER_LEVEL_DISPLAY_NAMES[level]}
                </Label>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedLevels.includes(level)
                    ? "bg-zinc-900 text-zinc-50"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {(counts.roles[level] || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAllLevels(!showAllLevels)}
          className="text-sm underline underline-offset-4 text-zinc-900 hover:text-zinc-700 transition-colors"
        >
          {showAllLevels ? "Show fewer levels" : "Show more levels"}
        </button>
      </div>

      {/* Remote Only */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Remote Only</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="remote-only"
              checked={isRemoteOnly}
              onCheckedChange={handleRemoteChange}
            />
            <Label
              htmlFor="remote-only"
              className="text-sm font-normal text-gray-500"
            >
              {isRemoteOnly ? "Yes" : "No"}
            </Label>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isRemoteOnly
                ? "bg-zinc-900 text-zinc-50"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {counts.remote.toLocaleString()} of {jobs.length.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Salary Range */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Salary Range</h2>
        <div className="space-y-3">
          {Object.entries(counts.salary).map(([range, count]) => (
            <div key={range} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`salary-${range.toLowerCase().replace(/[\s\$>]/g, "-")}`}
                  checked={selectedSalaryRanges.includes(range)}
                  onCheckedChange={(checked: boolean) =>
                    handleSalaryChange(checked, range)
                  }
                />
                <Label
                  htmlFor={`salary-${range
                    .toLowerCase()
                    .replace(/[\s\$>]/g, "-")}`}
                  className="text-sm font-normal"
                >
                  {range}/year
                </Label>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedSalaryRanges.includes(range)
                    ? "bg-zinc-900 text-zinc-50"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Visa Sponsorship */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Visa Sponsorship</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="visa-sponsorship"
              checked={isVisaSponsorship}
              onCheckedChange={handleVisaChange}
            />
            <Label
              htmlFor="visa-sponsorship"
              className="text-sm font-normal text-gray-500"
            >
              {isVisaSponsorship ? "Yes" : "No"}
            </Label>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isVisaSponsorship
                ? "bg-zinc-900 text-zinc-50"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {(counts.visa || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Languages</h2>
        <div className="space-y-3">
          {languageEntries.visible.map(([lang, count]) => (
            <div key={lang} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang.toLowerCase()}`}
                  checked={selectedLanguages.includes(lang as LanguageCode)}
                  onCheckedChange={(checked: boolean) =>
                    handleLanguageChange(checked, lang as LanguageCode)
                  }
                />
                <Label
                  htmlFor={`lang-${lang.toLowerCase()}`}
                  className="text-sm font-normal"
                >
                  {getDisplayNameFromCode(lang as LanguageCode)}
                </Label>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedLanguages.includes(lang as LanguageCode)
                    ? "bg-zinc-900 text-zinc-50"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        {languageEntries.additional.length > 0 && (
          <button
            onClick={() => setShowAllLanguages(!showAllLanguages)}
            className="text-sm underline underline-offset-4 text-zinc-900 hover:text-zinc-700 transition-colors"
          >
            {showAllLanguages ? "Show fewer languages" : "Show more languages"}
          </button>
        )}
      </div>
    </div>
  );
}

// Test

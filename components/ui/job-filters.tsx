import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo, useCallback, useEffect } from "react";
import { CareerLevel, Job, normalizeAnnualSalary } from "@/lib/db/airtable";
import { CAREER_LEVEL_DISPLAY_NAMES } from "@/lib/constants/career-levels";
import {
  LanguageCode,
  getDisplayNameFromCode,
} from "@/lib/constants/languages";
import { JOB_TYPE_DISPLAY_NAMES, JobType } from "@/lib/constants/job-types";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsBoolean,
  useQueryState,
} from "nuqs";

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

// Filter Item component to make UI more DRY
interface FilterItemProps {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function FilterItem({
  id,
  label,
  count,
  checked,
  onCheckedChange,
}: FilterItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id} className="text-sm font-normal">
          {label}
        </Label>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          checked ? "bg-zinc-900 text-zinc-50" : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {count.toLocaleString()}
      </span>
    </div>
  );
}

// Switch Item component for boolean filters
interface SwitchItemProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  count: number;
  total?: number;
}

function SwitchItem({
  id,
  checked,
  onCheckedChange,
  count,
  total,
}: SwitchItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id} className="text-sm font-normal text-gray-500">
          {checked ? "Yes" : "No"}
        </Label>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          checked ? "bg-zinc-900 text-zinc-50" : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {count.toLocaleString()}
        {total ? ` of ${total.toLocaleString()}` : ""}
      </span>
    </div>
  );
}

export function JobFilters({
  onFilterChange,
  initialFilters,
  jobs,
}: JobFiltersProps) {
  // URL state for job types filter using nuqs
  const [typesParam, setTypesParam] = useQueryState(
    "types",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // URL state for career levels filter using nuqs
  const [rolesParam, setRolesParam] = useQueryState(
    "roles",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // URL state for salary ranges filter using nuqs
  const [salaryRangesParam, setSalaryRangesParam] = useQueryState(
    "salary",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // URL state for languages filter using nuqs
  const [languagesParam, setLanguagesParam] = useQueryState(
    "languages",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // URL state for boolean filters using nuqs
  const [remoteParam, setRemoteParam] = useQueryState(
    "remote",
    parseAsBoolean.withDefault(false)
  );

  const [visaParam, setVisaParam] = useQueryState(
    "visa",
    parseAsBoolean.withDefault(false)
  );

  // Initialize URL state with initialFilters when there are no URL params
  useEffect(() => {
    // Only set initial values if URL params are empty
    if (typesParam.length === 0 && initialFilters.types.length > 0) {
      setTypesParam(initialFilters.types);
    }

    if (rolesParam.length === 0 && initialFilters.roles.length > 0) {
      setRolesParam(initialFilters.roles);
    }

    if (
      salaryRangesParam.length === 0 &&
      initialFilters.salaryRanges.length > 0
    ) {
      setSalaryRangesParam(initialFilters.salaryRanges);
    }

    if (languagesParam.length === 0 && initialFilters.languages.length > 0) {
      setLanguagesParam(initialFilters.languages);
    }

    if (!remoteParam && initialFilters.remote) {
      setRemoteParam(initialFilters.remote);
    }

    if (!visaParam && initialFilters.visa) {
      setVisaParam(initialFilters.visa);
    }
  }, [
    initialFilters,
    typesParam.length,
    rolesParam.length,
    salaryRangesParam.length,
    languagesParam.length,
    remoteParam,
    visaParam,
    setTypesParam,
    setRolesParam,
    setSalaryRangesParam,
    setLanguagesParam,
    setRemoteParam,
    setVisaParam,
  ]);

  // Generic handler for array-based filters
  const createArrayFilterHandler = useCallback(
    (
      filterType: Extract<FilterType, "type" | "role" | "salary" | "language">,
      currentValues: string[],
      setter: (value: string[] | null) => Promise<URLSearchParams>
    ) => {
      return async (checked: boolean, value: string) => {
        const newValues = checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value);

        // Remove parameter from URL if empty but ensure we pass [] to filters
        await setter(newValues.length ? newValues : null);
        onFilterChange(filterType, newValues);
      };
    },
    [onFilterChange]
  );

  // Generic handler for boolean filters
  const createBooleanFilterHandler = useCallback(
    (
      filterType: Extract<FilterType, "remote" | "visa">,
      setter: (value: boolean | null) => Promise<URLSearchParams>
    ) => {
      return async (checked: boolean) => {
        await setter(checked || null);
        onFilterChange(filterType, checked);
      };
    },
    [onFilterChange]
  );

  // Generic reset function for array filters
  const createArrayFilterReset = useCallback(
    (
      filterType: Extract<FilterType, "type" | "role" | "salary" | "language">,
      setter: (value: null) => Promise<URLSearchParams>
    ) => {
      return async () => {
        await setter(null);
        onFilterChange(filterType, []);
      };
    },
    [onFilterChange]
  );

  // Generic reset function for boolean filters
  const createBooleanFilterReset = useCallback(
    (
      filterType: Extract<FilterType, "remote" | "visa">,
      setter: (value: null) => Promise<URLSearchParams>
    ) => {
      return async () => {
        await setter(null);
        onFilterChange(filterType, false);
      };
    },
    [onFilterChange]
  );

  // Create handlers using the generic functions
  const handleTypeChange = useCallback(
    createArrayFilterHandler("type", typesParam, setTypesParam),
    [typesParam, setTypesParam, createArrayFilterHandler]
  );

  const handleLevelChange = useCallback(
    createArrayFilterHandler("role", rolesParam, setRolesParam),
    [rolesParam, setRolesParam, createArrayFilterHandler]
  );

  const handleSalaryChange = useCallback(
    createArrayFilterHandler("salary", salaryRangesParam, setSalaryRangesParam),
    [salaryRangesParam, setSalaryRangesParam, createArrayFilterHandler]
  );

  const handleLanguageChange = useCallback(
    createArrayFilterHandler("language", languagesParam, setLanguagesParam),
    [languagesParam, setLanguagesParam, createArrayFilterHandler]
  );

  const handleRemoteChange = useCallback(
    createBooleanFilterHandler("remote", setRemoteParam),
    [setRemoteParam, createBooleanFilterHandler]
  );

  const handleVisaChange = useCallback(
    createBooleanFilterHandler("visa", setVisaParam),
    [setVisaParam, createBooleanFilterHandler]
  );

  // Create reset functions using the generic functions
  const resetTypes = useCallback(
    createArrayFilterReset("type", setTypesParam),
    [setTypesParam, createArrayFilterReset]
  );

  const resetLevels = useCallback(
    createArrayFilterReset("role", setRolesParam),
    [setRolesParam, createArrayFilterReset]
  );

  const resetSalary = useCallback(
    createArrayFilterReset("salary", setSalaryRangesParam),
    [setSalaryRangesParam, createArrayFilterReset]
  );

  const resetLanguages = useCallback(
    createArrayFilterReset("language", setLanguagesParam),
    [setLanguagesParam, createArrayFilterReset]
  );

  const resetRemote = useCallback(
    createBooleanFilterReset("remote", setRemoteParam),
    [setRemoteParam, createBooleanFilterReset]
  );

  const resetVisa = useCallback(
    createBooleanFilterReset("visa", setVisaParam),
    [setVisaParam, createBooleanFilterReset]
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
  const handleClearFilters = useCallback(async () => {
    await Promise.all([
      resetTypes(),
      resetLevels(),
      resetSalary(),
      resetLanguages(),
      resetRemote(),
      resetVisa(),
    ]);
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
          {/* Map over job types from constants instead of hardcoding */}
          {Object.entries(JOB_TYPE_DISPLAY_NAMES).map(([type, displayName]) => (
            <FilterItem
              key={type}
              id={`job-type-${type}`}
              label={displayName}
              count={counts.types[type as JobType] || 0}
              checked={typesParam.includes(type)}
              onCheckedChange={(checked) => handleTypeChange(checked, type)}
            />
          ))}
        </div>
      </div>

      {/* Career Level */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Career Level</h2>
        <div className="space-y-3">
          {visibleLevels.map((level) => (
            <FilterItem
              key={level}
              id={level.toLowerCase().replace(" ", "-")}
              label={CAREER_LEVEL_DISPLAY_NAMES[level]}
              count={counts.roles[level] || 0}
              checked={rolesParam.includes(level)}
              onCheckedChange={(checked) => handleLevelChange(checked, level)}
            />
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
        <SwitchItem
          id="remote-only"
          checked={remoteParam}
          onCheckedChange={handleRemoteChange}
          count={counts.remote}
          total={jobs.length}
        />
      </div>

      {/* Salary Range */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Salary Range</h2>
        <div className="space-y-3">
          {Object.entries(counts.salary).map(([range, count]) => (
            <FilterItem
              key={range}
              id={`salary-${range.toLowerCase().replace(/[\s\$>]/g, "-")}`}
              label={`${range}/year`}
              count={count}
              checked={salaryRangesParam.includes(range)}
              onCheckedChange={(checked) => handleSalaryChange(checked, range)}
            />
          ))}
        </div>
      </div>

      {/* Visa Sponsorship */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Visa Sponsorship</h2>
        <SwitchItem
          id="visa-sponsorship"
          checked={visaParam}
          onCheckedChange={handleVisaChange}
          count={counts.visa || 0}
        />
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h2 className="text-md font-semibold">Languages</h2>
        <div className="space-y-3">
          {languageEntries.visible.map(([lang, count]) => (
            <FilterItem
              key={lang}
              id={`lang-${lang.toLowerCase()}`}
              label={getDisplayNameFromCode(lang as LanguageCode)}
              count={count}
              checked={languagesParam.includes(lang)}
              onCheckedChange={(checked) =>
                handleLanguageChange(checked, lang as LanguageCode)
              }
            />
          ))}
        </div>
        {languageEntries.additional.length > 0 && (
          <button
            onClick={() => setShowAllLanguages(!showAllLanguages)}
            className="text-sm underline underline-offset-4 text-zinc-900 hover:text-zinc-700 transition-colors"
          >
            {showAllLanguages
              ? "Show fewer languages"
              : `Show ${languageEntries.additional.length} more language${
                  languageEntries.additional.length > 1 ? "s" : ""
                }`}
          </button>
        )}
      </div>
    </div>
  );
}

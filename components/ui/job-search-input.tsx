import { Input } from "@/components/ui/input";
import { useJobSearch } from "@/lib/hooks/useJobSearch";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import config from "@/config";

interface JobSearchInputProps {
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export function JobSearchInput({
  placeholder,
  className = "pl-9 h-10",
  "aria-label": ariaLabel,
}: JobSearchInputProps) {
  // Get config values with fallbacks
  const defaultPlaceholder =
    config.search?.placeholder || "Search by role, company, or location...";
  const defaultAriaLabel = config.search?.ariaLabel || "Search jobs";

  // Use provided props or fallback to config values
  const finalPlaceholder = placeholder || defaultPlaceholder;
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  const { searchTerm, isSearching, handleSearch, clearSearch } = useJobSearch();
  const [inputValue, setInputValue] = useState(searchTerm || "");

  // Keep input value in sync with URL search term
  useEffect(() => {
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  // Handle input changes without triggering search on every keystroke
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    // The debounced search is handled in the hook
    handleSearch(value);
  };

  // Handle keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputValue("");
      clearSearch();
    }
    // Explicitly don't search on Enter - we use debounce instead
  };

  // Handle clear button click
  const onClear = () => {
    setInputValue("");
    clearSearch();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={finalPlaceholder}
        className={className}
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label={finalAriaLabel}
      />
      {inputValue && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isSearching && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 rounded-full bg-blue-500 opacity-75 pulse-dot" />
        </div>
      )}
    </div>
  );
}

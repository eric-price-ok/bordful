import { parseAsString } from "nuqs";
import { useQueryState } from "nuqs";
import { useCallback, useState, useRef, useEffect } from "react";

export function useJobSearch() {
  const [searchTerm, setSearchTermState] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle search with debounce
  const handleSearch = useCallback(
    (value: string) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Only show searching indicator for non-empty searches
      if (value) {
        setIsSearching(true);
      }

      // Set a new timer
      timerRef.current = setTimeout(() => {
        setSearchTermState(value || null);
        setIsSearching(false);
        timerRef.current = null;
      }, 500); // Increased debounce time for better UX
    },
    [setSearchTermState]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    // Cancel any pending search
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsSearching(false);
    setSearchTermState(null);
  }, [setSearchTermState]);

  return {
    searchTerm,
    isSearching,
    handleSearch,
    clearSearch,
  };
}

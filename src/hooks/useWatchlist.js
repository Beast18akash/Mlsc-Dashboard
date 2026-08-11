import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY = "mlsc-watchlist";

/**
 * useWatchlist
 *
 * Manages a persisted set of watchlisted workshop IDs.
 * Stores only IDs in localStorage — never full workshop objects —
 * keeping the data model normalized.
 *
 * Stored format:  ["WS-001", "WS-007", "WS-012"]
 *
 * Returns:
 *   watchlistIds   : string[]         — ordered array of currently watchlisted IDs
 *   watchlistCount : number           — convenience length
 *   isWatchlisted  : (id) => boolean  — O(1) Set lookup
 *   toggleWatchlist: (id) => void     — adds if absent, removes if present
 */
const useWatchlist = () => {
  const [watchlistIds, setWatchlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Keep a Set in sync for O(1) lookups without an extra useMemo dep
  const watchlistSet = useMemo(() => new Set(watchlistIds), [watchlistIds]);

  const isWatchlisted = useCallback(
    (id) => watchlistSet.has(id),
    [watchlistSet],
  );

  const toggleWatchlist = useCallback((id) => {
    setWatchlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((existingId) => existingId !== id)
        : [...prev, id];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage may be unavailable in some environments; fail silently
      }

      return next;
    });
  }, []);

  return {
    watchlistIds,
    watchlistCount: watchlistIds.length,
    isWatchlisted,
    toggleWatchlist,
  };
};

export default useWatchlist;

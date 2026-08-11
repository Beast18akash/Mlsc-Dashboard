import { useMemo } from "react";

/**
 * useWorkshopFilters
 *
 * Derives a filtered and sorted list from the live workshop state.
 * Accepts the full workshop array (from React state, not the raw import)
 * and the sponsors array for sponsor-name search resolution.
 *
 * Controls shape:
 *   search   : string  — matches title, speaker, or sponsor name (case-insensitive)
 *   category : string  — exact match, "" means all
 *   status   : string  — exact match, "" means all
 *   mode     : string  — exact match, "" means all
 *   sortBy   : string  — "date-asc" | "date-desc" | "seats-asc" | "seats-desc" | "title-asc" | ""
 *
 * Returns:
 *   filteredWorkshops : Workshop[]
 *   categories        : string[]  — unique sorted categories derived from current workshop list
 *   hasActiveControls : boolean   — true when any control is non-default (drives reset-button visibility)
 */
const useWorkshopFilters = (workshops, sponsors, controls) => {
  const { search, category, status, mode, sortBy } = controls;

  // Sponsor name lookup map — derived once per sponsors reference change
  const sponsorMap = useMemo(() => {
    const map = new Map();
    sponsors.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [sponsors]);

  // Unique sorted category list derived from the live workshop array so that
  // categories added via the Edit modal appear in the dropdown immediately.
  const categories = useMemo(() => {
    const set = new Set(workshops.map((w) => w.category));
    return Array.from(set).sort();
  }, [workshops]);

  const filteredWorkshops = useMemo(() => {
    const query = search.trim().toLowerCase();

    // ── 1. Filter ────────────────────────────────────────────────────────────
    let result = workshops.filter((workshop) => {
      // Search: title, speaker, sponsor name
      if (query) {
        const sponsorName = (sponsorMap.get(workshop.sponsorId) ?? "").toLowerCase();
        const matchesSearch =
          workshop.title.toLowerCase().includes(query) ||
          workshop.speaker.toLowerCase().includes(query) ||
          sponsorName.includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (category && workshop.category !== category) return false;

      // Status filter
      if (status && workshop.status !== status) return false;

      // Mode filter
      if (mode && workshop.mode !== mode) return false;

      return true;
    });

    // ── 2. Sort ──────────────────────────────────────────────────────────────
    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return a.date.localeCompare(b.date);
          case "date-desc":
            return b.date.localeCompare(a.date);
          case "seats-asc": {
            // Completed workshops have no meaningful "remaining" — sort them last
            const aRemaining = a.status === "Completed" ? -1 : a.capacity - a.seatsFilled;
            const bRemaining = b.status === "Completed" ? -1 : b.capacity - b.seatsFilled;
            return aRemaining - bRemaining;
          }
          case "seats-desc": {
            const aRemaining = a.status === "Completed" ? -1 : a.capacity - a.seatsFilled;
            const bRemaining = b.status === "Completed" ? -1 : b.capacity - b.seatsFilled;
            return bRemaining - aRemaining;
          }
          case "title-asc":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [workshops, sponsorMap, search, category, status, mode, sortBy]);

  const hasActiveControls =
    search.trim() !== "" ||
    category !== "" ||
    status !== "" ||
    mode !== "" ||
    sortBy !== "";

  return { filteredWorkshops, categories, hasActiveControls };
};

export default useWorkshopFilters;

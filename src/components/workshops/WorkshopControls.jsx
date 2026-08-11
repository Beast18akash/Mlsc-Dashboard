import { Search, X } from "lucide-react";

// Each select is full-width on mobile, auto-width on sm+
const selectClassName =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-slate-500 sm:h-9 sm:w-auto";

const SORT_OPTIONS = [
  { value: "",           label: "Default order" },
  { value: "date-asc",   label: "Date — earliest first" },
  { value: "date-desc",  label: "Date — latest first" },
  { value: "seats-asc",  label: "Seats remaining — fewest first" },
  { value: "seats-desc", label: "Seats remaining — most first" },
  { value: "title-asc",  label: "Title A → Z" },
];

const STATUS_OPTIONS = ["Upcoming", "Ongoing", "Completed"];
const MODE_OPTIONS   = ["Online", "Offline"];

const WorkshopControls = ({
  controls,
  categories,
  hasActiveControls,
  onSearchChange,
  onFilterChange,
  onReset,
}) => {
  const { search, category, status, mode, sortBy } = controls;

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-5">

      {/* Row 1 — search (always full-width) */}
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, speaker, or sponsor…"
          aria-label="Search workshops"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white py-0 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 sm:h-9"
        />
      </div>

      {/* Row 2 — filters + sort + reset
          Mobile: 2-column grid so selects are large enough to tap.
          sm+: flex-wrap row as before.
      */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <select
          value={category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          aria-label="Filter by category"
          className={selectClassName}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          aria-label="Filter by status"
          className={selectClassName}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={mode}
          onChange={(e) => onFilterChange("mode", e.target.value)}
          aria-label="Filter by mode"
          className={selectClassName}
        >
          <option value="">Online &amp; Offline</option>
          {MODE_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
          aria-label="Sort workshops"
          className={selectClassName}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {hasActiveControls && (
          <button
            type="button"
            onClick={onReset}
            className="col-span-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-600 dark:hover:text-slate-100 sm:h-9 sm:w-auto sm:justify-start"
          >
            <X size={14} aria-hidden="true" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkshopControls;

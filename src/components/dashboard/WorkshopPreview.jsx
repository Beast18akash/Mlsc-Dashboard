import { ArrowRight, Heart } from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";

/**
 * WorkshopPreview
 *
 * Dashboard overview card — shows up to PREVIEW_LIMIT upcoming or ongoing
 * workshops from the live workshop state. Read-only: no edit, no filters.
 * A "View all workshops" button navigates to the full Workshops view.
 *
 * Selection logic:
 *   1. Prioritise Ongoing workshops (currently running)
 *   2. Then Upcoming workshops sorted by date (soonest first)
 *   3. Slice to PREVIEW_LIMIT
 *
 * Props:
 *   workshops   : Workshop[]   — full live workshop list from Dashboard
 *   sponsors    : Sponsor[]
 *   onViewAll   : () => void   — navigates to the "workshops" view
 */

const PREVIEW_LIMIT = 5;

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Ongoing: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Completed: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const WorkshopPreview = ({ workshops, sponsors, onViewAll }) => {
  const { isWatchlisted } = useWatchlistContext();

  const getSponsor = (sponsorId) => sponsors.find((s) => s.id === sponsorId);

  // Select the most relevant workshops for the overview
  const previewWorkshops = (() => {
    const ongoing = workshops
      .filter((w) => w.status === "Ongoing")
      .sort((a, b) => a.date.localeCompare(b.date));

    const upcoming = workshops
      .filter((w) => w.status === "Upcoming")
      .sort((a, b) => a.date.localeCompare(b.date));

    return [...ongoing, ...upcoming].slice(0, PREVIEW_LIMIT);
  })();

  const totalActive = workshops.filter(
    (w) => w.status === "Upcoming" || w.status === "Ongoing",
  ).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Upcoming Workshops</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {totalActive} active workshop{totalActive !== 1 ? "s" : ""} —
            showing the next {Math.min(PREVIEW_LIMIT, previewWorkshops.length)}
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          View all
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Preview rows */}
      {previewWorkshops.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">
            No active workshops right now.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            All workshops are either completed or none have been scheduled yet.
          </p>
          <button
            type="button"
            onClick={onViewAll}
            className="mt-4 flex items-center gap-1.5 mx-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            View all workshops
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100" aria-label="Upcoming workshops preview">
          {previewWorkshops.map((workshop) => {
            const sponsor = getSponsor(workshop.sponsorId);
            const seatsRemaining = workshop.capacity - workshop.seatsFilled;
            const watchlisted = isWatchlisted(workshop.id);

            return (
              <li
                key={workshop.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                {/* Date block */}
                <div className="hidden w-12 shrink-0 text-center sm:block">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {new Date(workshop.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-xl font-bold leading-tight text-slate-800">
                    {new Date(workshop.date).getDate()}
                  </p>
                </div>

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {workshop.title}
                    </p>
                    {/* Watchlist indicator — read-only dot, not a toggle */}
                    {watchlisted && (
                      <Heart
                        size={12}
                        aria-label="In your watchlist"
                        className="shrink-0 fill-rose-500 text-rose-500"
                      />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {workshop.speaker}
                    {sponsor ? ` · ${sponsor.name}` : ""}
                    {" · "}
                    {workshop.mode}
                  </p>
                </div>

                {/* Right-side meta */}
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      statusStyles[workshop.status]
                    }`}
                  >
                    {workshop.status}
                  </span>
                  <p className="text-xs text-slate-400">
                    {seatsRemaining <= 0 ? (
                      <span className="font-semibold text-red-500">Full</span>
                    ) : (
                      `${seatsRemaining} seats left`
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer link */}
      {previewWorkshops.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            View all {workshops.length} workshops
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkshopPreview;

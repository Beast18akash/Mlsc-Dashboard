import { ArrowRight, Heart } from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";

const PREVIEW_LIMIT = 5;

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30",
  Ongoing:  "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30",
  Completed:"bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700 dark:text-slate-400 dark:ring-slate-500/30",
};

const WorkshopPreview = ({ workshops, sponsors, onViewAll }) => {
  const { isWatchlisted } = useWatchlistContext();
  const getSponsor = (sponsorId) => sponsors.find((s) => s.id === sponsorId);

  const previewWorkshops = (() => {
    const ongoing  = workshops.filter((w) => w.status === "Ongoing").sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = workshops.filter((w) => w.status === "Upcoming").sort((a, b) => a.date.localeCompare(b.date));
    return [...ongoing, ...upcoming].slice(0, PREVIEW_LIMIT);
  })();

  const totalActive = workshops.filter((w) => w.status === "Upcoming" || w.status === "Ongoing").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Upcoming Workshops</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {totalActive} active workshop{totalActive !== 1 ? "s" : ""} —{" "}
            showing the next {Math.min(PREVIEW_LIMIT, previewWorkshops.length)}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100"
        >
          View all <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Empty state */}
      {previewWorkshops.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No active workshops right now.</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            All workshops are either completed or none have been scheduled yet.
          </p>
          <button
            type="button"
            onClick={onViewAll}
            className="mx-auto mt-4 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            View all workshops <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700" aria-label="Upcoming workshops preview">
          {previewWorkshops.map((workshop) => {
            const sponsor       = getSponsor(workshop.sponsorId);
            const seatsRemaining = workshop.capacity - workshop.seatsFilled;
            const watchlisted   = isWatchlisted(workshop.id);

            return (
              <li
                key={workshop.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                {/* Date block */}
                <div className="hidden w-12 shrink-0 text-center sm:block">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {new Date(workshop.date).toLocaleDateString("en-US", { month: "short" })}
                  </p>
                  <p className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-200">
                    {new Date(workshop.date).getDate()}
                  </p>
                </div>

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {workshop.title}
                    </p>
                    {watchlisted && (
                      <Heart size={12} aria-label="In your watchlist" className="shrink-0 fill-rose-500 text-rose-500" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {workshop.speaker}{sponsor ? ` · ${sponsor.name}` : ""} · {workshop.mode}
                  </p>
                </div>

                {/* Right meta */}
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[workshop.status]}`}>
                    {workshop.status}
                  </span>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {seatsRemaining <= 0 ? (
                      <span className="font-semibold text-red-500 dark:text-red-400">Full</span>
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

      {/* Footer */}
      {previewWorkshops.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-700">
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            View all {workshops.length} workshops <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkshopPreview;

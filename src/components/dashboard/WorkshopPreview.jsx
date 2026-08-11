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

  // Status-based accent colors for dashboard cards
  const getAccentStyles = (status) => {
    switch (status) {
      case "Ongoing":
        return {
          glowClass: "card-glow-ongoing",
          border: "border-teal-500/20 dark:border-teal-400/30",
          progress: "bg-gradient-to-r from-teal-400 to-emerald-400",
          progressBg: "bg-slate-700/50 dark:bg-slate-800/50",
        };
      case "Completed":
        return {
          glowClass: "card-glow-completed",
          border: "border-slate-500/20 dark:border-slate-400/20",
          progress: "bg-gradient-to-r from-slate-400 to-slate-500",
          progressBg: "bg-slate-700/50 dark:bg-slate-800/50",
        };
      default: // Upcoming
        return {
          glowClass: "card-glow-upcoming",
          border: "border-blue-500/20 dark:border-indigo-400/30",
          progress: "bg-gradient-to-r from-blue-400 to-indigo-400",
          progressBg: "bg-slate-700/50 dark:bg-slate-800/50",
        };
    }
  };

  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Upcoming Workshops</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {totalActive} active workshop{totalActive !== 1 ? "s" : ""} —{" "}
            showing the next {Math.min(PREVIEW_LIMIT, previewWorkshops.length)}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="btn-gradient-cta px-4 py-2 text-sm"
        >
          <span>View all</span>
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Empty state */}
      {previewWorkshops.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewWorkshops.map((workshop) => {
            const sponsor = getSponsor(workshop.sponsorId);
            const seatsRemaining = workshop.capacity - workshop.seatsFilled;
            const watchlisted = isWatchlisted(workshop.id);
            const capacityPercent = Math.round((workshop.seatsFilled / workshop.capacity) * 100);
            const isFull = seatsRemaining === 0;
            const accent = getAccentStyles(workshop.status);

            return (
              <article
                key={workshop.id}
                className={`group relative overflow-hidden rounded-2xl border bg-slate-50 shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl dark:bg-slate-900/95 ${accent.border}`}
                aria-label={workshop.title}
              >
                {/* Corner glow effect */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-60 ${accent.glowClass}`}
                  aria-hidden="true"
                />

                {/* Card content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between p-4 pb-3">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {workshop.date}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
                        {workshop.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[workshop.status]}`}
                      >
                        {workshop.status}
                      </span>
                      {watchlisted && (
                        <Heart
                          size={14}
                          className="fill-rose-500 text-rose-500"
                          aria-label="In your watchlist"
                        />
                      )}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="px-4 pb-4">
                    {/* Title */}
                    <h3 className="mb-1.5 text-xl font-bold leading-tight text-slate-900 dark:text-white">
                      {workshop.title}
                    </h3>

                    {/* Category */}
                    <p className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {workshop.category}
                    </p>

                    {/* Progress section */}
                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Capacity
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {capacityPercent}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className={`h-1.5 w-full overflow-hidden rounded-full ${accent.progressBg}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${accent.progress}`}
                          style={{ width: `${capacityPercent}%` }}
                          role="progressbar"
                          aria-valuenow={capacityPercent}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={`${capacityPercent}% capacity filled`}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{workshop.speaker}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{workshop.venue} · {workshop.mode}</span>
                      </div>
                      {sponsor && (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{sponsor.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-200/50 bg-slate-100/50 px-4 py-2.5 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-800/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {workshop.seatsFilled}/{workshop.capacity}
                      </span>
                      <span
                        className={`font-medium ${
                          isFull
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {isFull ? "Full" : `${seatsRemaining} left`}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkshopPreview;

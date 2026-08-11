import { Heart } from "lucide-react";
import { useWatchlistContext } from "../context/WatchlistContext";
import WorkshopTable from "../components/workshops/WorkshopTable";

/**
 * WatchlistView
 *
 * Displays only the workshops the user has marked as Interested.
 *
 * Architecture:
 *   - Receives the full live workshopList from Dashboard (React state, not the
 *     raw import) so edits and status changes from Feature 3 are reflected here.
 *   - Filters down to watchlisted IDs using the WatchlistContext — no duplicate
 *     filtering logic; the existing WorkshopTable + useWorkshopFilters pipeline
 *     (Feature 4) runs on top of this pre-filtered list automatically.
 *   - Passes the pre-filtered array to WorkshopTable as the `workshops` prop.
 *     WorkshopTable is reused as-is; Feature 4 search/filter/sort all work.
 *
 * Props:
 *   workshopList     : Workshop[]   — live workshop state from Dashboard
 *   sponsors         : Sponsor[]
 *   onUpdateWorkshop : fn
 *   onMarkCompleted  : fn
 */
const WatchlistView = ({
  workshopList,
  sponsors,
  onUpdateWorkshop,
  onMarkCompleted,
}) => {
  const { watchlistIds } = useWatchlistContext();

  // Pre-filter to only watchlisted workshops.
  // WorkshopTable's own Feature 4 controls apply on top of this.
  const watchlistedWorkshops = workshopList.filter((w) =>
    watchlistIds.includes(w.id),
  );

  return (
    <div>
      {/* Section heading */}
      <section className="mb-6" aria-labelledby="watchlist-title">
        <p className="text-sm font-semibold text-slate-600">My Watchlist</p>
        <h1
          id="watchlist-title"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          Interested Workshops
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Workshops you&apos;ve marked as Interested. Use the controls below to
          search and filter within your watchlist.
        </p>
      </section>

      {/* Empty state — shown when the watchlist itself is empty (before any
          Feature 4 filtering). WorkshopTable handles the "no filter results"
          empty state internally. */}
      {watchlistedWorkshops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <Heart size={28} className="text-rose-400" aria-hidden="true" />
          </span>
          <p className="mt-4 text-base font-semibold text-slate-800">
            Your watchlist is empty
          </p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Browse the workshops and click the{" "}
            <Heart
              size={13}
              className="mb-0.5 inline text-slate-400"
              aria-hidden="true"
            />{" "}
            Interested button on any workshop to add it here.
          </p>
        </div>
      ) : (
        <WorkshopTable
          workshops={watchlistedWorkshops}
          sponsors={sponsors}
          onUpdateWorkshop={onUpdateWorkshop}
          onMarkCompleted={onMarkCompleted}
        />
      )}
    </div>
  );
};

export default WatchlistView;

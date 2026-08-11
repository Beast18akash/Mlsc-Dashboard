import { Heart } from "lucide-react";
import { useWatchlistContext } from "../context/WatchlistContext";
import WorkshopTable from "../components/workshops/WorkshopTable";

const WatchlistView = ({ workshopList, sponsors, onUpdateWorkshop, onMarkCompleted }) => {
  const { watchlistIds } = useWatchlistContext();
  const watchlistedWorkshops = workshopList.filter((w) => watchlistIds.includes(w.id));

  return (
    <div>
      <section className="mb-6" aria-labelledby="watchlist-title">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">My Watchlist</p>
        <h1 id="watchlist-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Interested Workshops
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Workshops you&apos;ve marked as Interested. Use the controls below to search and filter within your watchlist.
        </p>
      </section>

      {watchlistedWorkshops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/30">
            <Heart size={28} className="text-rose-400 dark:text-rose-500" aria-hidden="true" />
          </span>
          <p className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">Your watchlist is empty</p>
          <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Browse the workshops and click the{" "}
            <Heart size={13} className="mb-0.5 inline text-slate-400 dark:text-slate-500" aria-hidden="true" />{" "}
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

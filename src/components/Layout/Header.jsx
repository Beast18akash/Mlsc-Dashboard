import { Menu, Bell, Sun, Heart } from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";

/**
 * Header
 *
 * Props:
 *   activeView : string          — "dashboard" | "watchlist"
 *   onNavigate : (view) => void
 *
 * Shows a watchlist count badge on the Heart button (mobile shortcut).
 * The Heart button is only shown on smaller screens (lg:hidden) since the
 * Sidebar already provides the full navigation on large screens.
 */
const Header = ({ activeView, onNavigate }) => {
  const { watchlistCount } = useWatchlistContext();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:h-20 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <p className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          MLSC <span className="font-normal text-slate-500">Admin Portal</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Watchlist shortcut — visible on all screen sizes as a quick-access
            button; the count badge shows how many workshops are watchlisted */}
        <button
          onClick={() =>
            onNavigate(activeView === "watchlist" ? "dashboard" : "watchlist")
          }
          className={`relative rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
            activeView === "watchlist"
              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          aria-label={
            activeView === "watchlist"
              ? "Back to Dashboard"
              : `My Watchlist${watchlistCount > 0 ? ` (${watchlistCount})` : ""}`
          }
          title={
            activeView === "watchlist" ? "Back to Dashboard" : "My Watchlist"
          }
        >
          <Heart
            size={20}
            aria-hidden="true"
            className={
              activeView === "watchlist" ? "fill-rose-500 text-rose-500" : ""
            }
          />

          {/* Count badge — only shown when there are watchlisted items */}
          {watchlistCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold tabular-nums text-white"
            >
              {watchlistCount > 99 ? "99+" : watchlistCount}
            </span>
          )}
        </button>

        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-label="Notifications"
        >
          <Bell size={20} aria-hidden="true" />
        </button>

        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-label="Toggle theme"
        >
          <Sun size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;

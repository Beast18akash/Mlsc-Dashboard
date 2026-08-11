import { Menu, Bell, Sun, Moon, Heart } from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";
import { useTheme } from "../../context/ThemeContext";

const Header = ({ activeView, onNavigate }) => {
  const { watchlistCount } = useWatchlistContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 sm:h-20 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <p className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
          MLSC{" "}
          <span className="font-normal text-slate-500 dark:text-slate-400">
            Admin Portal
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Watchlist shortcut */}
        <button
          onClick={() =>
            onNavigate(activeView === "watchlist" ? "dashboard" : "watchlist")
          }
          className={`relative rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
            activeView === "watchlist"
              ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
              activeView === "watchlist" ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" : ""
            }
          />
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
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell size={20} aria-hidden="true" />
        </button>

        {/* Theme toggle — Sun in dark mode (click to go light), Moon in light mode */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun size={20} aria-hidden="true" />
          ) : (
            <Moon size={20} aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

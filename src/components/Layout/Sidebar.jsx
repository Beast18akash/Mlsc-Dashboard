import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Users,
  Handshake,
} from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";

const Sidebar = ({ activeView, onNavigate }) => {
  const { watchlistCount } = useWatchlistContext();

  const navigationItems = [
    { label: "Dashboard",     icon: LayoutDashboard, view: "dashboard" },
    { label: "Workshops",     icon: CalendarDays,    view: "workshops" },
    { label: "My Watchlist",  icon: Heart,           view: "watchlist", badge: watchlistCount > 0 ? watchlistCount : null },
    { label: "Registrations", icon: Users,           view: "registrations" },
    { label: "Sponsors",      icon: Handshake,       view: null },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-700">
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">MLSC</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Workshop Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActiveItem = item.view ? activeView === item.view : false;

          return (
            <button
              key={item.label}
              onClick={() => item.view && onNavigate(item.view)}
              disabled={!item.view}
              aria-current={isActiveItem ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActiveItem
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : item.view
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  : "cursor-not-allowed text-slate-400 dark:text-slate-600"
              }`}
            >
              <Icon size={19} aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>

              {item.badge != null && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                    isActiveItem
                      ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                  }`}
                  aria-label={`${item.badge} watchlisted`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs text-slate-400 dark:text-slate-500">MLSC Workshop Portal</p>
      </div>
    </aside>
  );
};

export default Sidebar;

import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Users,
  Handshake,
} from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";

/**
 * Sidebar
 *
 * Props:
 *   activeView : "dashboard" | "workshops" | "watchlist" | "registrations"
 *   onNavigate : (view: string) => void
 *
 * Each nav item has its own unique view key. Unimplemented items (Sponsors)
 * are visually muted and non-interactive.
 */
const Sidebar = ({ activeView, onNavigate }) => {
  const { watchlistCount } = useWatchlistContext();

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      view: "dashboard",
    },
    {
      label: "Workshops",
      icon: CalendarDays,
      view: "workshops",
    },
    {
      label: "My Watchlist",
      icon: Heart,
      view: "watchlist",
      badge: watchlistCount > 0 ? watchlistCount : null,
    },
    {
      label: "Registrations",
      icon: Users,
      view: "registrations",
    },
    {
      label: "Sponsors",
      icon: Handshake,
      view: null, // future feature
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <p className="text-lg font-bold text-slate-900">MLSC</p>
          <p className="text-xs text-slate-500">Workshop Console</p>
        </div>
      </div>

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
                  ? "bg-slate-900 text-white"
                  : item.view
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "cursor-not-allowed text-slate-400"
              }`}
            >
              <Icon size={19} aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>

              {/* Watchlist count badge */}
              {item.badge != null && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                    isActiveItem
                      ? "bg-white/20 text-white"
                      : "bg-rose-100 text-rose-700"
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

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-400">MLSC Workshop Portal</p>
      </div>
    </aside>
  );
};

export default Sidebar;

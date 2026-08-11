import { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Users,
  Handshake,
  X,
} from "lucide-react";
import { useWatchlistContext } from "../../context/WatchlistContext";

/**
 * Sidebar
 *
 * Props:
 *   activeView      : string
 *   onNavigate      : (view) => void
 *   isMobileOpen    : boolean   — controls mobile drawer visibility
 *   onMobileClose   : () => void
 *
 * Desktop (lg+): always-visible static sidebar.
 * Mobile (< lg): off-canvas drawer controlled by isMobileOpen.
 *   - Closes on overlay click, close button, Escape key, or nav item tap.
 *   - Focus moves to close button when drawer opens.
 */
const Sidebar = ({ activeView, onNavigate, isMobileOpen, onMobileClose }) => {
  const { watchlistCount } = useWatchlistContext();
  const closeButtonRef     = useRef(null);

  const navigationItems = [
    { label: "Dashboard",     icon: LayoutDashboard, view: "dashboard" },
    { label: "Workshops",     icon: CalendarDays,    view: "workshops" },
    {
      label: "My Watchlist",
      icon: Heart,
      view: "watchlist",
      badge: watchlistCount > 0 ? watchlistCount : null,
    },
    { label: "Registrations", icon: Users,    view: "registrations" },
    { label: "Sponsors",      icon: Handshake, view: null },
  ];

  // Move focus to close button when the drawer opens on mobile
  useEffect(() => {
    if (isMobileOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isMobileOpen]);

  // Close on Escape while drawer is open
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onMobileClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileOpen, onMobileClose]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleNavigate = (view) => {
    if (view) {
      onNavigate(view);
      onMobileClose(); // auto-close drawer on navigation
    }
  };

  const NavContent = () => (
    <>
      <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon        = item.icon;
          const isActiveItem = item.view ? activeView === item.view : false;

          return (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.view)}
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
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-700">
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">MLSC</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Workshop Console</p>
          </div>
        </div>
        <NavContent />
      </aside>

      {/* ── Mobile drawer (< lg) ──────────────────────────────────────── */}
      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-slate-950/70 lg:hidden"
          aria-hidden="true"
          onClick={onMobileClose}
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header with close button */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-700">
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">MLSC</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Workshop Console</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <NavContent />
      </div>
    </>
  );
};

export default Sidebar;

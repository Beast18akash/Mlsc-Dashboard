import { useCallback, useState } from "react";

import { workshops as initialWorkshops } from "../data/workshops";
import { sponsors } from "../data/sponsors";
import { registrations } from "../data/registrations";

import WorkshopPreview from "../components/dashboard/WorkshopPreview";
import WorkshopsView from "./WorkshopsView";
import WatchlistView from "./WatchlistView";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import AlertBar from "../components/notifications/AlertBar";
import MetricsGrid from "../components/dashboard/MetricsGrid";

/**
 * Dashboard
 *
 * Single source of truth for the live workshop list (Features 3–5).
 * Receives activeView + onNavigate from App; renders the correct view.
 *
 * Views:
 *   "dashboard"  — overview: metrics + limited WorkshopPreview
 *   "workshops"  — full WorkshopsView with all 14 workshops + F4 controls
 *   "watchlist"  — WatchlistView (watchlisted workshops only)
 *
 * Props:
 *   activeView : "dashboard" | "workshops" | "watchlist"
 *   onNavigate : (view: string) => void
 */
const Dashboard = ({ activeView, onNavigate }) => {
  const [workshopList, setWorkshopList] = useState(initialWorkshops);

  const totalWorkshops = workshopList.length;
  const totalSponsors = sponsors.length;
  const totalAttendees = registrations.length;

  const updateWorkshop = useCallback((workshopId, updates) => {
    setWorkshopList((current) =>
      current.map((workshop) =>
        workshop.id === workshopId
          ? { ...workshop, ...updates }
          : workshop,
      ),
    );
  }, []);

  const markWorkshopCompleted = useCallback((workshopId) => {
    setWorkshopList((current) =>
      current.map((workshop) =>
        workshop.id === workshopId
          ? { ...workshop, status: "Completed" }
          : workshop,
      ),
    );
  }, []);

  // Common props forwarded to every view that renders WorkshopTable
  const tableProps = {
    workshopList,
    sponsors,
    onUpdateWorkshop: updateWorkshop,
    onMarkCompleted: markWorkshopCompleted,
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />

      <div className="min-w-0 flex-1">
        <Header activeView={activeView} onNavigate={onNavigate} />

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 lg:px-8">
          <AlertBar />
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">

            {/* ── Dashboard overview ──────────────────────────────────── */}
            {activeView === "dashboard" && (
              <>
                <section className="mb-8" aria-labelledby="dashboard-title">
                  <p className="text-sm font-semibold text-slate-600">
                    Dashboard overview
                  </p>
                  <h1
                    id="dashboard-title"
                    className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                  >
                    MLSC Workshop &amp; Sponsor Console
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                    Live overview of workshops, sponsors, registrations, and the
                    next upcoming session.
                  </p>
                </section>

                <MetricsGrid
                  workshops={workshopList}
                  totalWorkshops={totalWorkshops}
                  totalSponsors={totalSponsors}
                  totalAttendees={totalAttendees}
                />

                <div className="mt-8">
                  <WorkshopPreview
                    workshops={workshopList}
                    sponsors={sponsors}
                    onViewAll={() => onNavigate("workshops")}
                  />
                </div>
              </>
            )}

            {/* ── Full workshops management ───────────────────────────── */}
            {activeView === "workshops" && (
              <WorkshopsView {...tableProps} />
            )}

            {/* ── My Watchlist ────────────────────────────────────────── */}
            {activeView === "watchlist" && (
              <WatchlistView {...tableProps} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

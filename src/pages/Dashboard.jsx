import { useCallback, useState } from "react";

import { workshops as initialWorkshops } from "../data/workshops";
import { sponsors } from "../data/sponsors";
import { registrations as initialRegistrations } from "../data/registrations";

import WorkshopPreview from "../components/dashboard/WorkshopPreview";
import WorkshopsView from "./WorkshopsView";
import WatchlistView from "./WatchlistView";
import RegistrationsView from "./RegistrationsView";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import AlertBar from "../components/notifications/AlertBar";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import AuroraBackground from "../components/ui/AuroraBackground";

/**
 * Dashboard
 *
 * Single source of truth for:
 *   workshopList     — live workshop state (Features 3–5)
 *   registrationList — live registration state (Feature 6)
 *
 * Receives activeView + onNavigate from App; renders the correct view.
 *
 * Views:
 *   "dashboard"     — overview: metrics + limited WorkshopPreview
 *   "workshops"     — full WorkshopsView with all workshops + F4 controls
 *   "watchlist"     — WatchlistView (watchlisted workshops only)
 *   "registrations" — RegistrationsView (3-step registration flow)
 *
 * Props:
 *   activeView : "dashboard" | "workshops" | "watchlist" | "registrations"
 *   onNavigate : (view: string) => void
 */
const Dashboard = ({ activeView, onNavigate }) => {
  // ── Workshop state (Features 3–5) ─────────────────────────────────────────
  const [workshopList, setWorkshopList] = useState(initialWorkshops);

  const updateWorkshop = useCallback((workshopId, updates) => {
    setWorkshopList((current) =>
      current.map((w) => w.id === workshopId ? { ...w, ...updates } : w),
    );
  }, []);

  const markWorkshopCompleted = useCallback((workshopId) => {
    setWorkshopList((current) =>
      current.map((w) => w.id === workshopId ? { ...w, status: "Completed" } : w),
    );
  }, []);

  // ── Registration state (Feature 6) ────────────────────────────────────────
  const [registrationList, setRegistrationList] = useState(initialRegistrations);

  const addRegistration = useCallback((registration) => {
    setRegistrationList((current) => [...current, registration]);
  }, []);

  // ── Mobile navigation state ───────────────────────────────────────────────
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // ── Derived metrics ───────────────────────────────────────────────────────
  const totalWorkshops = workshopList.length;
  const totalSponsors = sponsors.length;
  const totalAttendees = registrationList.length;

  // ── Shared workshop table props ───────────────────────────────────────────
  const tableProps = {
    workshopList,
    sponsors,
    onUpdateWorkshop: updateWorkshop,
    onMarkCompleted: markWorkshopCompleted,
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <Header
          activeView={activeView}
          onNavigate={onNavigate}
          onMobileMenuOpen={() => setIsMobileNavOpen(true)}
        />

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 sm:px-6 lg:px-8">
          <AlertBar />
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <AuroraBackground className="min-h-[calc(100vh-5rem)]">
            <div className="mx-auto max-w-7xl">

            {/* ── Dashboard overview ──────────────────────────────────── */}
            {activeView === "dashboard" && (
              <>
                <section className="mb-8" aria-labelledby="dashboard-title">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    Dashboard Overview
                  </p>
                  <h1
                    id="dashboard-title"
                    className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
                  >
                    MLSC Workshop &amp; Sponsor Console
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
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

            {/* ── Registrations ───────────────────────────────────────── */}
            {activeView === "registrations" && (
              <RegistrationsView
                workshopList={workshopList}
                sponsors={sponsors}
                registrationList={registrationList}
                onAddRegistration={addRegistration}
                onUpdateWorkshop={updateWorkshop}
              />
            )}

            </div>
          </AuroraBackground>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

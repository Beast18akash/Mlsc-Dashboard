import { useState } from "react";
import { Eye, Pencil, CheckCircle2, SearchX, Heart } from "lucide-react";

import { useNotifications } from "../../context/NotificationContext";
import { useWatchlistContext } from "../../context/WatchlistContext";
import { sponsors } from "../../data/sponsors";
import useWorkshopFilters from "../../hooks/useWorkshopFilters";
import WorkshopControls from "./WorkshopControls";
import WorkshopDetailsModal from "./WorkshopDetailsModal";
import WorkshopEditModal from "./WorkshopEditModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_CONTROLS = { search: "", category: "", status: "", mode: "", sortBy: "" };

const statusStyles = {
  Upcoming:  "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30",
  Ongoing:   "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30",
  Completed: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700 dark:text-slate-400 dark:ring-slate-500/30",
};

const actionBtn =
  "rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100";

// ─── WorkshopCard — shown on mobile (< lg) ────────────────────────────────────

const WorkshopCard = ({
  workshop,
  sponsor,
  seatsRemaining,
  isCompleted,
  watchlisted,
  onView,
  onEdit,
  onMarkCompleted,
  onToggleWatchlist,
}) => (
  <article
    className="border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
    aria-label={workshop.title}
  >
    {/* Title row */}
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">{workshop.title}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{workshop.date} · {workshop.time}</p>
      </div>
      <span className={`shrink-0 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[workshop.status]}`}>
        {workshop.status}
      </span>
    </div>

    {/* Details grid */}
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div>
        <dt className="font-medium text-slate-400 dark:text-slate-500">Speaker</dt>
        <dd className="mt-0.5 text-slate-700 dark:text-slate-300 truncate">{workshop.speaker}</dd>
      </div>
      <div>
        <dt className="font-medium text-slate-400 dark:text-slate-500">Category</dt>
        <dd className="mt-0.5">
          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {workshop.category}
          </span>
        </dd>
      </div>
      <div>
        <dt className="font-medium text-slate-400 dark:text-slate-500">Sponsor</dt>
        <dd className="mt-0.5 text-slate-700 dark:text-slate-300 truncate">{sponsor?.name ?? "—"}</dd>
      </div>
      <div>
        <dt className="font-medium text-slate-400 dark:text-slate-500">Venue / Mode</dt>
        <dd className="mt-0.5 text-slate-700 dark:text-slate-300 truncate">{workshop.venue} · {workshop.mode}</dd>
      </div>
      <div>
        <dt className="font-medium text-slate-400 dark:text-slate-500">Seats</dt>
        <dd className="mt-0.5 text-slate-700 dark:text-slate-300">
          {workshop.seatsFilled}/{workshop.capacity}
          {!isCompleted && (
            <span className={`ml-1 ${seatsRemaining === 0 ? "font-semibold text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
              ({seatsRemaining === 0 ? "Full" : `${seatsRemaining} left`})
            </span>
          )}
        </dd>
      </div>
    </dl>

    {/* Actions */}
    <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3 dark:border-slate-700">
      <button type="button" className={actionBtn} title="View Details" aria-label={`View details for ${workshop.title}`} onClick={onView}>
        <Eye size={17} aria-hidden="true" />
      </button>
      {!isCompleted && (
        <button type="button" className={actionBtn} title="Edit Workshop" aria-label={`Edit ${workshop.title}`} onClick={onEdit}>
          <Pencil size={17} aria-hidden="true" />
        </button>
      )}
      {!isCompleted && (
        <button type="button" className={`${actionBtn} hover:text-emerald-600 dark:hover:text-emerald-400`} title="Mark Completed" aria-label={`Mark ${workshop.title} as completed`} onClick={onMarkCompleted}>
          <CheckCircle2 size={17} aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        onClick={onToggleWatchlist}
        title={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        aria-label={watchlisted ? `Remove ${workshop.title} from watchlist` : `Add ${workshop.title} to watchlist`}
        aria-pressed={watchlisted}
        className={`rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
          watchlisted
            ? "text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
            : "text-slate-500 hover:bg-slate-100 hover:text-rose-500 dark:text-slate-400 dark:hover:bg-slate-700"
        }`}
      >
        <Heart size={17} aria-hidden="true" className={watchlisted ? "fill-rose-500" : "fill-none"} />
      </button>
    </div>
  </article>
);

// ─── WorkshopTable ────────────────────────────────────────────────────────────

const WorkshopTable = ({ workshops, sponsors: sponsorsProp, onUpdateWorkshop, onMarkCompleted }) => {
  const sponsorList = sponsorsProp ?? sponsors;
  const { addNotification }       = useNotifications();
  const { isWatchlisted, toggleWatchlist } = useWatchlistContext();

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [activeModal, setActiveModal]           = useState(null);
  const [controls, setControls]                 = useState(INITIAL_CONTROLS);

  const { filteredWorkshops, categories, hasActiveControls } =
    useWorkshopFilters(workshops, sponsorList, controls);

  const getSponsor = (id) => sponsorList.find((s) => s.id === id);

  const openModal = (workshop, type) => {
    if (type === "edit" && workshop.status === "Completed") return;
    setSelectedWorkshop(workshop);
    setActiveModal(type);
  };

  const closeModal = () => { setActiveModal(null); setSelectedWorkshop(null); };

  const handleSave = (id, updates) => onUpdateWorkshop(id, updates);

  const handleMarkCompleted = (workshop) => {
    onMarkCompleted(workshop.id);
    addNotification({
      id: `info-completed-${workshop.id}-${Date.now()}`,
      type: "info",
      message: `${workshop.title} has been marked as completed.`,
    });
  };

  const handleSearchChange = (v) => setControls((p) => ({ ...p, search: v }));
  const handleFilterChange = (f, v) => setControls((p) => ({ ...p, [f]: v }));
  const handleReset        = () => setControls(INITIAL_CONTROLS);

  // ─── Empty state (shared between mobile cards and desktop table) ──────────

  const emptyState = (
    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
        <SearchX size={24} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No workshops match your current filters.</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search or filters, or reset to see all workshops.</p>
      <button
        type="button" onClick={handleReset}
        className="mt-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

        {/* Card header */}
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Workshops</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your upcoming and completed workshops.</p>
        </div>

        <WorkshopControls
          controls={controls} categories={categories} hasActiveControls={hasActiveControls}
          onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} onReset={handleReset}
        />

        {/* ── MOBILE: card list (< lg) ──────────────────────────────────── */}
        <div className="lg:hidden">
          {filteredWorkshops.length === 0 ? emptyState : (
            <div>
              {filteredWorkshops.map((workshop) => {
                const sponsor        = getSponsor(workshop.sponsorId);
                const seatsRemaining = workshop.capacity - workshop.seatsFilled;
                const isCompleted    = workshop.status === "Completed";
                const watchlisted    = isWatchlisted(workshop.id);

                return (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    sponsor={sponsor}
                    seatsRemaining={seatsRemaining}
                    isCompleted={isCompleted}
                    watchlisted={watchlisted}
                    onView={() => openModal(workshop, "details")}
                    onEdit={() => openModal(workshop, "edit")}
                    onMarkCompleted={() => handleMarkCompleted(workshop)}
                    onToggleWatchlist={() => toggleWatchlist(workshop.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ── DESKTOP: full table (lg+) ─────────────────────────────────── */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
              <tr>
                {["Workshop","Speaker","Category","Sponsor","Seats","Status","Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredWorkshops.length === 0 && (
                <tr><td colSpan={7}>{emptyState}</td></tr>
              )}

              {filteredWorkshops.map((workshop) => {
                const sponsor        = getSponsor(workshop.sponsorId);
                const seatsRemaining = workshop.capacity - workshop.seatsFilled;
                const isCompleted    = workshop.status === "Completed";
                const watchlisted    = isWatchlisted(workshop.id);

                return (
                  <tr key={workshop.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{workshop.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{workshop.date} · {workshop.time}</p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{workshop.venue} · {workshop.mode}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{workshop.speaker}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {workshop.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{sponsor?.name ?? "Unknown Sponsor"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{workshop.seatsFilled}/{workshop.capacity}</p>
                      {!isCompleted && (
                        <p className={`mt-1 text-xs ${seatsRemaining === 0 ? "font-semibold text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
                          {seatsRemaining === 0 ? "Full" : `${seatsRemaining} seats remaining`}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[workshop.status]}`}>
                        {workshop.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button type="button" className={actionBtn} title="View Details" aria-label={`View details for ${workshop.title}`} onClick={() => openModal(workshop, "details")}>
                          <Eye size={17} aria-hidden="true" />
                        </button>
                        {!isCompleted && (
                          <button type="button" className={actionBtn} title="Edit Workshop" aria-label={`Edit ${workshop.title}`} onClick={() => openModal(workshop, "edit")}>
                            <Pencil size={17} aria-hidden="true" />
                          </button>
                        )}
                        {!isCompleted && (
                          <button type="button" className={`${actionBtn} hover:text-emerald-600 dark:hover:text-emerald-400`} title="Mark Completed" aria-label={`Mark ${workshop.title} as completed`} onClick={() => handleMarkCompleted(workshop)}>
                            <CheckCircle2 size={17} aria-hidden="true" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(workshop.id)}
                          title={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                          aria-label={watchlisted ? `Remove ${workshop.title} from watchlist` : `Add ${workshop.title} to watchlist`}
                          aria-pressed={watchlisted}
                          className={`rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                            watchlisted
                              ? "text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                              : "text-slate-500 hover:bg-slate-100 hover:text-rose-500 dark:text-slate-400 dark:hover:bg-slate-700"
                          }`}
                        >
                          <Heart size={17} aria-hidden="true" className={watchlisted ? "fill-rose-500" : "fill-none"} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWorkshop && (
        <>
          <WorkshopDetailsModal
            key={`details-${selectedWorkshop.id}`}
            workshop={selectedWorkshop}
            sponsor={getSponsor(selectedWorkshop.sponsorId)}
            isOpen={activeModal === "details"}
            onClose={closeModal}
          />
          <WorkshopEditModal
            key={`edit-${selectedWorkshop.id}`}
            workshop={selectedWorkshop}
            sponsors={sponsorList}
            isOpen={activeModal === "edit"}
            onClose={closeModal}
            onSave={handleSave}
          />
        </>
      )}
    </>
  );
};

export default WorkshopTable;

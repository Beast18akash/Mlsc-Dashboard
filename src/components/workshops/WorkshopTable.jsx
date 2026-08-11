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

const INITIAL_CONTROLS = {
  search: "",
  category: "",
  status: "",
  mode: "",
  sortBy: "",
};

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Ongoing: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Completed: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const actionButtonClassName =
  "rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500";

// ─── Component ────────────────────────────────────────────────────────────────

const WorkshopTable = ({
  workshops,
  sponsors: sponsorsProp,
  onUpdateWorkshop,
  onMarkCompleted,
}) => {
  // Fall back to the imported sponsors if the parent doesn't pass them,
  // keeping backward compatibility with the existing Dashboard wiring.
  const sponsorList = sponsorsProp ?? sponsors;

  const { addNotification } = useNotifications();
  const { isWatchlisted, toggleWatchlist } = useWatchlistContext();

  // ── Modal state ────────────────────────────────────────────────────────────
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // ── Controls state (search + filters + sort) ───────────────────────────────
  const [controls, setControls] = useState(INITIAL_CONTROLS);

  // ── Derived filtered/sorted list ───────────────────────────────────────────
  // Runs against the live `workshops` prop (React state in Dashboard),
  // so every edit, mark-completed, or capacity change is reflected instantly.
  const { filteredWorkshops, categories, hasActiveControls } =
    useWorkshopFilters(workshops, sponsorList, controls);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getSponsor = (sponsorId) =>
    sponsorList.find((s) => s.id === sponsorId);

  const openModal = (workshop, modalType) => {
    // Guard: completed workshops cannot be edited even if called directly
    if (modalType === "edit" && workshop.status === "Completed") {
      return;
    }
    setSelectedWorkshop(workshop);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedWorkshop(null);
  };

  const handleSave = (workshopId, updates) => {
    onUpdateWorkshop(workshopId, updates);
  };

  const handleMarkCompleted = (workshop) => {
    onMarkCompleted(workshop.id);
    addNotification({
      id: `info-completed-${workshop.id}-${Date.now()}`,
      type: "info",
      message: `${workshop.title} has been marked as completed.`,
    });
  };

  // ── Controls handlers ──────────────────────────────────────────────────────

  const handleSearchChange = (value) => {
    setControls((prev) => ({ ...prev, search: value }));
  };

  const handleFilterChange = (field, value) => {
    setControls((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setControls(INITIAL_CONTROLS);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Card header */}
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Workshops</h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage your upcoming and completed workshops.
          </p>
        </div>

        {/* Search, filters & sort controls */}
        <WorkshopControls
          controls={controls}
          categories={categories}
          hasActiveControls={hasActiveControls}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Workshop
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Speaker
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sponsor
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Seats
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ── Empty state ─────────────────────────────────────────── */}
              {filteredWorkshops.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <SearchX
                          size={24}
                          className="text-slate-400"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="text-sm font-medium text-slate-700">
                        No workshops match your current filters.
                      </p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your search or filters, or reset to see
                        all workshops.
                      </p>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="mt-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* ── Workshop rows ────────────────────────────────────────── */}
              {filteredWorkshops.map((workshop) => {
                const sponsor = getSponsor(workshop.sponsorId);
                const seatsRemaining = workshop.capacity - workshop.seatsFilled;
                const isCompleted = workshop.status === "Completed";
                const watchlisted = isWatchlisted(workshop.id);

                return (
                  <tr
                    key={workshop.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Title / date / venue */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {workshop.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {workshop.date} · {workshop.time}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {workshop.venue} · {workshop.mode}
                        </p>
                      </div>
                    </td>

                    {/* Speaker */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {workshop.speaker}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {workshop.category}
                      </span>
                    </td>

                    {/* Sponsor */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {sponsor?.name ?? "Unknown Sponsor"}
                      </p>
                    </td>

                    {/* Seats */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {workshop.seatsFilled}/{workshop.capacity}
                      </p>
                      {/* Feature 3 rule: no remaining-seats line for completed */}
                      {!isCompleted && (
                        <p
                          className={`mt-1 text-xs ${
                            seatsRemaining === 0
                              ? "font-semibold text-red-600"
                              : "text-slate-500"
                          }`}
                        >
                          {seatsRemaining === 0
                            ? "Full"
                            : `${seatsRemaining} seats remaining`}
                        </p>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          statusStyles[workshop.status]
                        }`}
                      >
                        {workshop.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {/* View — always visible */}
                        <button
                          type="button"
                          className={actionButtonClassName}
                          title="View Details"
                          aria-label={`View details for ${workshop.title}`}
                          onClick={() => openModal(workshop, "details")}
                        >
                          <Eye size={17} aria-hidden="true" />
                        </button>

                        {/* Edit — hidden for completed (Feature 3) */}
                        {!isCompleted && (
                          <button
                            type="button"
                            className={actionButtonClassName}
                            title="Edit Workshop"
                            aria-label={`Edit ${workshop.title}`}
                            onClick={() => openModal(workshop, "edit")}
                          >
                            <Pencil size={17} aria-hidden="true" />
                          </button>
                        )}

                        {/* Mark Completed — hidden for completed (Feature 3) */}
                        {!isCompleted && (
                          <button
                            type="button"
                            className={`${actionButtonClassName} hover:text-emerald-600`}
                            title="Mark Completed"
                            aria-label={`Mark ${workshop.title} as completed`}
                            onClick={() => handleMarkCompleted(workshop)}
                          >
                            <CheckCircle2 size={17} aria-hidden="true" />
                          </button>
                        )}

                        {/* Interested / Watchlist toggle — always visible */}
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(workshop.id)}
                          title={
                            watchlisted
                              ? "Remove from Watchlist"
                              : "Add to Watchlist"
                          }
                          aria-label={
                            watchlisted
                              ? `Remove ${workshop.title} from watchlist`
                              : `Add ${workshop.title} to watchlist`
                          }
                          aria-pressed={watchlisted}
                          className={`rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                            watchlisted
                              ? "text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                              : "text-slate-500 hover:bg-slate-100 hover:text-rose-500"
                          }`}
                        >
                          <Heart
                            size={17}
                            aria-hidden="true"
                            className={
                              watchlisted ? "fill-rose-500" : "fill-none"
                            }
                          />
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

      {/* Modals */}
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

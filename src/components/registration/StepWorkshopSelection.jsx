import { CalendarDays, MapPin, Users, Wifi, WifiOff, AlertCircle } from "lucide-react";

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30",
  Ongoing:  "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30",
};

const StepWorkshopSelection = ({ workshops, sponsors, selectedWorkshopId, onSelect, onNext, onBack, error }) => {
  const getSponsor = (id) => sponsors.find((s) => s.id === id);
  const available  = workshops.filter((w) => w.status !== "Completed");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Select a Workshop</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose the workshop you want to attend. Fully booked workshops cannot be selected.</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle size={15} aria-hidden="true" className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Available workshops">
        {available.map((workshop) => {
          const sponsor        = getSponsor(workshop.sponsorId);
          const seatsRemaining = workshop.capacity - workshop.seatsFilled;
          const isFull         = seatsRemaining <= 0;
          const isSelected     = selectedWorkshopId === workshop.id;

          return (
            <button
              key={workshop.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isFull}
              onClick={() => !isFull && onSelect(workshop.id)}
              className={`relative w-full rounded-xl border-2 p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                isFull
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/50"
                  : isSelected
                  ? "border-slate-900 bg-slate-900 text-white shadow-md dark:border-slate-100 dark:bg-slate-100"
                  : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-400"
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold leading-snug ${isSelected ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-100"}`}>
                  {workshop.title}
                </p>
                <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  isSelected ? "bg-white/15 text-white ring-white/20 dark:bg-slate-900/15 dark:text-slate-900 dark:ring-slate-900/20" : statusStyles[workshop.status]
                }`}>
                  {workshop.status}
                </span>
              </div>

              <div className={`space-y-1.5 text-xs ${isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>
                <div className="flex items-center gap-1.5"><CalendarDays size={12} aria-hidden="true" className="shrink-0" /><span>{workshop.date} · {workshop.time}</span></div>
                <div className="flex items-center gap-1.5"><MapPin size={12} aria-hidden="true" className="shrink-0" /><span>{workshop.venue}</span></div>
                <div className="flex items-center gap-1.5">
                  {workshop.mode === "Online" ? <Wifi size={12} aria-hidden="true" className="shrink-0" /> : <WifiOff size={12} aria-hidden="true" className="shrink-0" />}
                  <span>{workshop.mode}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} aria-hidden="true" className="shrink-0" />
                  <span>{isFull ? <span className="font-semibold text-red-500 dark:text-red-400">Fully booked</span> : `${seatsRemaining} of ${workshop.capacity} seats available`}</span>
                </div>
                {sponsor && <p className="pt-0.5 text-xs">Sponsored by {sponsor.name}</p>}
              </div>

              {isSelected && (
                <span aria-hidden="true" className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
          Back
        </button>
        <button type="button" onClick={onNext}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
          Next: Review &amp; Confirm
        </button>
      </div>
    </div>
  );
};

export default StepWorkshopSelection;

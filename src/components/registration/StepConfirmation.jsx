import { CalendarDays, MapPin, Users, Wifi, WifiOff, User, Mail, GraduationCap, Building2, AlertCircle } from "lucide-react";

const SummaryRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
      <Icon size={14} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const cardCls = "rounded-xl border border-slate-200 bg-white px-4 shadow-sm dark:border-slate-600 dark:bg-slate-700/50";
const sectionLabelCls = "border-b border-slate-100 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-600 dark:text-slate-400";
const dividerCls = "divide-y divide-slate-100 dark:divide-slate-600";

const StepConfirmation = ({ formData, workshop, sponsor, onConfirm, onBack, isSubmitting, submitError }) => {
  const seatsRemaining = workshop.capacity - workshop.seatsFilled;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Review &amp; Confirm</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Please review your details before submitting. You can go back to make changes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Personal */}
        <div className={cardCls}>
          <p className={sectionLabelCls}>Your Details</p>
          <div className={dividerCls}>
            <SummaryRow icon={User}          label="Full Name"      value={formData.name} />
            <SummaryRow icon={Mail}          label="Academic Email" value={formData.email} />
            <SummaryRow icon={GraduationCap} label="Year of Study"  value={formData.year} />
            <SummaryRow icon={Building2}     label="Department"     value={formData.department} />
          </div>
        </div>

        {/* Workshop */}
        <div className={cardCls}>
          <p className={sectionLabelCls}>Selected Workshop</p>
          <div className={dividerCls}>
            <div className="py-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Workshop</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{workshop.title}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{workshop.category}</p>
            </div>
            <SummaryRow icon={CalendarDays}                        label="Date &amp; Time" value={`${workshop.date} · ${workshop.time}`} />
            <SummaryRow icon={MapPin}                              label="Venue"           value={workshop.venue} />
            <SummaryRow icon={workshop.mode === "Online" ? Wifi : WifiOff} label="Mode"   value={workshop.mode} />
            <SummaryRow icon={Users} label="Availability" value={`${seatsRemaining} seat${seatsRemaining !== 1 ? "s" : ""} remaining`} />
            {sponsor && (
              <div className="py-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Sponsor</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{sponsor.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {submitError && (
        <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
          {submitError}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} disabled={isSubmitting}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
          Back
        </button>
        <button type="button" onClick={onConfirm} disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
          {isSubmitting ? "Registering…" : "Confirm Registration"}
        </button>
      </div>
    </div>
  );
};

export default StepConfirmation;

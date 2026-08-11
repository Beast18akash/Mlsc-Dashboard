import { useState } from "react";
import { CheckCircle2, Copy, Check, Download, CalendarDays, MapPin, Wifi, WifiOff, User, Mail, GraduationCap, Building2, Handshake, ClipboardList } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

const formatDate = (iso) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

const PassRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5">
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
      <Icon size={14} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const RegistrationPass = ({ registration, workshop, sponsor, onRegisterAnother }) => {
  const { addNotification } = useNotifications();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(registration.id);
      setCopied(true);
      addNotification({ id: `info-copy-${registration.id}-${Date.now()}`, type: "info", message: "Registration ID copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addNotification({ id: `warn-copy-fail-${Date.now()}`, type: "warning", message: "Could not copy to clipboard. Please copy the ID manually." });
    }
  };

  const handleDownload = () => {
    const lines = [
      "================================================",
      "          MLSC WORKSHOP REGISTRATION PASS       ",
      "================================================",
      "",
      `Registration ID : ${registration.id}`,
      `Issued          : ${formatDate(registration.registeredAt)}`,
      "",
      "── REGISTRANT DETAILS ──────────────────────────",
      `Name            : ${registration.name}`,
      `Email           : ${registration.email}`,
      `Year            : ${registration.year}`,
      `Department      : ${registration.department}`,
      "",
      "── WORKSHOP DETAILS ────────────────────────────",
      `Workshop        : ${workshop.title}`,
      `Category        : ${workshop.category}`,
      `Date            : ${formatDate(workshop.date)} at ${workshop.time}`,
      `Venue           : ${workshop.venue}`,
      `Mode            : ${workshop.mode}`,
      sponsor ? `Sponsor         : ${sponsor.name}` : "",
      "",
      "================================================",
      "  Please keep this pass for your records.       ",
      "  MLSC Workshop & Sponsor Console               ",
      "================================================",
    ].filter((l) => l !== null).join("\n");

    const blob   = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url    = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href     = url;
    anchor.download = `MLSC-Registration-${registration.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    addNotification({ id: `info-download-${registration.id}-${Date.now()}`, type: "info", message: "Registration pass download started." });
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Success banner */}
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
          <CheckCircle2 size={32} className="text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">Registration Confirmed!</h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Your pass has been generated. Save or download it for your records.</p>
      </div>

      {/* Pass card */}
      <article aria-label="Registration Pass" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Header strip */}
        <div className="bg-slate-900 px-6 py-4 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">MLSC Workshop Portal</p>
          <p className="mt-0.5 text-lg font-bold text-white">Registration Pass</p>
        </div>

        {/* Registration ID row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Registration ID</p>
            <p className="mt-0.5 break-all font-mono text-base font-bold tracking-wide text-slate-900 dark:text-slate-100" aria-label={`Registration ID: ${registration.id}`}>
              {registration.id}
            </p>
          </div>
          <button
            type="button" onClick={handleCopy}
            aria-label={copied ? "Registration ID copied" : "Copy Registration ID"}
            title={copied ? "Copied!" : "Copy Registration ID"}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
              copied
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            {copied ? "Copied!" : "Copy ID"}
          </button>
        </div>

        {/* Two-column detail grid */}
        <div className="grid gap-0 sm:grid-cols-2">
          {/* Registrant */}
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700 sm:border-b-0 sm:border-r">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Registrant</p>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <PassRow icon={User}          label="Full Name"      value={registration.name} />
              <PassRow icon={Mail}          label="Academic Email" value={registration.email} />
              <PassRow icon={GraduationCap} label="Year"           value={registration.year} />
              <PassRow icon={Building2}     label="Department"     value={registration.department} />
            </div>
          </div>

          {/* Workshop */}
          <div className="px-6 py-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Workshop</p>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <div className="py-2.5">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Title</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{workshop.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{workshop.category}</p>
              </div>
              <PassRow icon={CalendarDays}                                 label="Date & Time" value={`${formatDate(workshop.date)} · ${workshop.time}`} />
              <PassRow icon={workshop.mode === "Online" ? Wifi : WifiOff}  label="Mode"        value={workshop.mode} />
              <PassRow icon={MapPin}                                        label="Venue"       value={workshop.venue} />
              {sponsor && <PassRow icon={Handshake} label="Sponsor" value={sponsor.name} />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-xs text-slate-400 dark:text-slate-500 sm:order-first">
            Issued <span className="font-medium text-slate-600 dark:text-slate-300">{formatDate(registration.registeredAt)}</span>
          </p>
          <button type="button" onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 sm:w-auto">
            <Download size={14} aria-hidden="true" />
            Download Pass
          </button>
        </div>
      </article>

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onRegisterAnother}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
          <ClipboardList size={16} aria-hidden="true" />
          Register Another
        </button>
      </div>
    </div>
  );
};

export default RegistrationPass;

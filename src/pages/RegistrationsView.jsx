import { useState } from "react";
import { CheckCircle2, ClipboardList } from "lucide-react";

import { useNotifications } from "../context/NotificationContext";
import RegistrationStepIndicator from "../components/registration/RegistrationStepIndicator";
import StepPersonalInfo from "../components/registration/StepPersonalInfo";
import StepWorkshopSelection from "../components/registration/StepWorkshopSelection";
import StepConfirmation from "../components/registration/StepConfirmation";

/**
 * RegistrationsView
 *
 * Orchestrates the 3-step registration flow. Owns all transient form state
 * so Back/Next never loses entered data. Calls onAddRegistration on final
 * confirmation — it does NOT mutate registrations.js directly.
 *
 * State:
 *   step               : 1 | 2 | 3
 *   formData           : { name, email, year, department }
 *   selectedWorkshopId : string | ""
 *   step1Errors        : { name?, email?, year?, department? }
 *   step2Error         : string | null
 *   submitError        : string | null — duplicate/capacity error at step 3
 *   isSubmitting       : boolean
 *   submitted          : boolean  — shows success screen after registration
 *
 * Props:
 *   workshopList       : Workshop[]      — live state from Dashboard
 *   sponsors           : Sponsor[]
 *   registrationList   : Registration[]  — used for duplicate detection
 *   onAddRegistration  : (registration: object) => void
 *   onUpdateWorkshop   : (workshopId, updates) => void  — increments seatsFilled
 */

/**
 * isLikelyRealEmail
 *
 * Checks that an email looks like it belongs to a real person.
 * Any domain is allowed (gmail.com, company.com, university.edu, etc.).
 * Only obviously fake/throwaway patterns are rejected:
 *
 *   - Local part (before @) must be ≥ 2 characters  →  blocks a@gmail.com
 *   - Domain name (between @ and last dot) must be ≥ 3 chars → blocks x@b.com
 *   - TLD (after last dot) must be ≥ 2 characters  →  blocks user@mail.c
 *   - No consecutive dots anywhere
 *   - Domain must not start or end with a hyphen
 */
const isLikelyRealEmail = (email) => {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.indexOf("@");
  if (atIndex < 2) return false; // local part must be ≥ 2 chars

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  if (local.length < 2) return false;
  if (/\.\./.test(trimmed)) return false; // no consecutive dots

  const lastDot = domain.lastIndexOf(".");
  if (lastDot < 0) return false;

  const domainName = domain.slice(0, lastDot);
  const tld = domain.slice(lastDot + 1);

  if (domainName.length < 3) return false;
  if (tld.length < 2) return false;
  if (domainName.startsWith("-") || domainName.endsWith("-")) return false;

  return true;
};

const STEPS = [
  { label: "Personal Info" },
  { label: "Select Workshop" },
  { label: "Confirm" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  year: "",
  department: "",
};

const RegistrationsView = ({ workshopList, sponsors, registrationList, onAddRegistration, onUpdateWorkshop }) => {
  const { addNotification } = useNotifications();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState("");
  const [step1Errors, setStep1Errors] = useState({});
  const [step2Error, setStep2Error] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────

  const selectedWorkshop = workshopList.find((w) => w.id === selectedWorkshopId) ?? null;
  const selectedSponsor = selectedWorkshop
    ? sponsors.find((s) => s.id === selectedWorkshop.sponsorId)
    : null;

  // ── Field change handler ──────────────────────────────────────────────────

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the individual field error as soon as the user types
    if (step1Errors[field]) {
      setStep1Errors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ── Step 1 validation ─────────────────────────────────────────────────────

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    } else if (!isLikelyRealEmail(formData.email)) {
      errs.email = "Please enter a real email address (e.g. yourname@gmail.com or yourname@company.com).";
    }
    if (!formData.year) errs.year = "Please select your year of study.";
    if (!formData.department) errs.department = "Please select your department.";
    return errs;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleStep1Next = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setStep1Errors(errs);
      return;
    }
    setStep1Errors({});
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedWorkshopId) {
      setStep2Error("Please select a workshop to continue.");
      return;
    }
    // Guard: re-check full status using live workshop state
    const workshop = workshopList.find((w) => w.id === selectedWorkshopId);
    if (!workshop || workshop.capacity - workshop.seatsFilled <= 0) {
      setStep2Error(
        "The selected workshop is now fully booked. Please choose another.",
      );
      setSelectedWorkshopId("");
      return;
    }
    setStep2Error(null);
    setStep(3);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  // ── Submission ────────────────────────────────────────────────────────────

  const handleConfirm = () => {
    if (!selectedWorkshop) return;

    // ── Duplicate registration guard ──────────────────────────────────────
    const emailLower = formData.email.trim().toLowerCase();
    const alreadyRegistered = registrationList.some(
      (r) =>
        r.workshopId === selectedWorkshop.id &&
        r.email.toLowerCase() === emailLower,
    );
    if (alreadyRegistered) {
      setSubmitError(
        `${formData.email.trim()} is already registered for ${selectedWorkshop.title}. Each attendee can only register once per workshop.`,
      );
      return;
    }

    // ── Re-check capacity using live state ────────────────────────────────
    const seatsLeft = selectedWorkshop.capacity - selectedWorkshop.seatsFilled;
    if (seatsLeft <= 0) {
      setSubmitError(
        `${selectedWorkshop.title} is now fully booked. Please go back and select another workshop.`,
      );
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    // Simulate a brief async tick so the "Registering…" state is visible
    setTimeout(() => {
      const registration = {
        id: `REG-${Date.now()}`,
        workshopId: selectedWorkshop.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        year: formData.year,
        department: formData.department,
        registeredAt: new Date().toISOString(),
      };

      // Append the new registration (increments attendee count metric)
      onAddRegistration(registration);

      // Increment seatsFilled on the workshop so capacity reflects immediately
      onUpdateWorkshop(selectedWorkshop.id, {
        seatsFilled: selectedWorkshop.seatsFilled + 1,
      });

      addNotification({
        id: `info-registration-${registration.id}`,
        type: "info",
        message: `${formData.name.trim()} has been registered for ${selectedWorkshop.title}.`,
      });

      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  // ── Reset — allows registering again ─────────────────────────────────────

  const handleReset = () => {
    setStep(1);
    setFormData(INITIAL_FORM);
    setSelectedWorkshopId("");
    setStep1Errors({});
    setStep2Error(null);
    setSubmitError(null);
    setSubmitted(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Page heading */}
      <section className="mb-8" aria-labelledby="registrations-title">
        <p className="text-sm font-semibold text-slate-600">Registrations</p>
        <h1
          id="registrations-title"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          Workshop Registration
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Register for an upcoming workshop in three simple steps.
        </p>
      </section>

      <div className="mx-auto max-w-3xl">
        {/* ── Success screen ─────────────────────────────────────────── */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2
                size={36}
                className="text-emerald-500"
                aria-hidden="true"
              />
            </span>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Registration Confirmed!
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {formData.name}
              </span>{" "}
              has been successfully registered for{" "}
              <span className="font-semibold text-slate-700">
                {selectedWorkshop?.title}
              </span>
              .
            </p>
            <p className="mt-1 text-sm text-slate-400">
              A confirmation was sent to{" "}
              <span className="font-medium">{formData.email}</span>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <ClipboardList size={16} aria-hidden="true" />
                Register Another
              </button>
            </div>
          </div>
        ) : (
          /* ── Multi-step form ─────────────────────────────────────── */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <RegistrationStepIndicator currentStep={step} steps={STEPS} />

            {step === 1 && (
              <StepPersonalInfo
                formData={formData}
                onChange={handleFieldChange}
                onNext={handleStep1Next}
                errors={step1Errors}
              />
            )}

            {step === 2 && (
              <StepWorkshopSelection
                workshops={workshopList}
                sponsors={sponsors}
                selectedWorkshopId={selectedWorkshopId}
                onSelect={setSelectedWorkshopId}
                onNext={handleStep2Next}
                onBack={handleBack}
                error={step2Error}
              />
            )}

            {step === 3 && selectedWorkshop && (
              <StepConfirmation
                formData={formData}
                workshop={selectedWorkshop}
                sponsor={selectedSponsor}
                onConfirm={handleConfirm}
                onBack={handleBack}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationsView;

import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import RegistrationStepIndicator from "../components/registration/RegistrationStepIndicator";
import StepPersonalInfo from "../components/registration/StepPersonalInfo";
import StepWorkshopSelection from "../components/registration/StepWorkshopSelection";
import StepConfirmation from "../components/registration/StepConfirmation";
import RegistrationPass from "../components/registration/RegistrationPass";

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
 * INSTITUTIONAL_EMAIL_REGEX
 *
 * Custom regex for institutional/academic email validation.
 * Assignment requirement: "Custom regex-based validation for institutional
 * email format."
 *
 * Rules enforced by the regex:
 *   1. Standard local part: letters, digits, dots, +, -, _ (≥ 2 chars)
 *   2. @ separator
 *   3. Optional subdomain prefix (e.g. cs.university, dept.college)
 *   4. Domain name of ≥ 3 characters
 *   5. TLD restricted to institutional/professional patterns:
 *        .edu        — US universities
 *        .edu.XX     — international academic (edu.in, edu.au, edu.sg …)
 *        .ac.XX      — academic outside US  (ac.in, ac.uk, ac.nz …)
 *        .org        — non-profit / research institutions
 *        .gov        — government bodies
 *        .net        — some research networks
 *        .XX (2-char country TLD) at least 2 chars — institutional domains
 *          registered under their country (e.g. .in, .uk, .au, .de)
 *          combined with a domain name of ≥ 4 chars to avoid trivial fakes
 *
 * Blocked by this regex (personal/consumer providers):
 *   @gmail.com, @yahoo.com, @hotmail.com, @outlook.com, @icloud.com, etc.
 *   — these end in .com and therefore do not match the allowed TLD list.
 *
 * A professional .com address (e.g. @microsoft.com) is intentionally
 * blocked too — the field label explicitly says "Academic / Institutional
 * Email". If a student or faculty member only has a @gmail.com address,
 * the placeholder and hint text explain what is expected.
 */
const INSTITUTIONAL_EMAIL_REGEX =
  /^[a-zA-Z0-9][a-zA-Z0-9._%+\-]{1,}@(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]{3,}\.(?:edu|edu\.[a-zA-Z]{2}|ac\.[a-zA-Z]{2}|org|gov|net|[a-zA-Z]{2})$/;

/**
 * validateInstitutionalEmail
 *
 * Returns true only when the email passes both:
 *   1. The INSTITUTIONAL_EMAIL_REGEX (structure + allowed TLDs)
 *   2. Structural sanity checks (no consecutive dots, no leading/trailing
 *      hyphens in the domain, TLD ≥ 2 chars)
 */
const validateInstitutionalEmail = (email) => {
  const trimmed = email.trim();

  if (!INSTITUTIONAL_EMAIL_REGEX.test(trimmed)) return false;

  // Extra sanity: no consecutive dots
  if (/\.\./.test(trimmed)) return false;

  const atIndex = trimmed.indexOf("@");
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  const firstLabel = domain.split(".")[0];

  // Domain must not start or end with a hyphen
  if (firstLabel.startsWith("-") || firstLabel.endsWith("-")) return false;

  return true;
};

/**
 * generateRegistrationId
 *
 * Produces a readable, unique Registration ID in the format:
 *   MLSC-WS-2026-0142
 *
 * Components:
 *   MLSC    — org prefix
 *   WS      — workshop registration type
 *   YYYY    — current year
 *   NNNN    — zero-padded sequential number (current list length + 1)
 *
 * The sequence number is derived from the current registrationList length
 * so each new registration within a session gets a higher number.
 * The timestamp suffix ensures no collision even if two registrations happen
 * in the same second across different sessions.
 */
const generateRegistrationId = (registrationCount) => {
  const year = new Date().getFullYear();
  const seq = String(registrationCount + 1).padStart(4, "0");
  return `MLSC-WS-${year}-${seq}`;
};

const STEPS = [
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
  // Stores the finalised registration object + workshop/sponsor snapshot
  // so the pass always shows correct data regardless of later state changes.
  const [completedRegistration, setCompletedRegistration] = useState(null);

  // ── Derived ──────────────────────────────────────────────────────────────

  const selectedWorkshop = workshopList.find((w) => w.id === selectedWorkshopId) ?? null;
  const selectedSponsor = selectedWorkshop
    ? sponsors.find((s) => s.id === selectedWorkshop.sponsorId)
    : null;

  // ── Step 1 validation ─────────────────────────────────────────────────────
  // Defined FIRST so handleFieldChange can call it safely.
  // Pure function — takes a data snapshot, returns an errors object.

  const validateStep1WithData = (data) => {
    const errs = {};

    // Name: required, reject whitespace-only
    if (!data.name.trim()) {
      errs.name = "Full name is required and cannot be blank.";
    }

    // Email: required + institutional format (custom regex)
    if (!data.email.trim()) {
      errs.email = "Academic email address is required.";
    } else if (!validateInstitutionalEmail(data.email)) {
      errs.email =
        "Please enter a valid institutional email (e.g. yourname@university.edu or yourname@college.ac.in). Personal email providers like Gmail or Outlook are not accepted.";
    }

    // Year: required
    if (!data.year) {
      errs.year = "Please select your year of study.";
    }

    // Department: required
    if (!data.department) {
      errs.department = "Please select your department.";
    }

    return errs;
  };

  const validateStep1 = () => validateStep1WithData(formData);

  // ── Field change handler ──────────────────────────────────────────────────
  // Re-validates the changed field immediately so the error clears as soon
  // as the user fixes it. Only fires if that field already has an error
  // showing — avoids marking fields red before the user has touched them.

  const handleFieldChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // `field in step1Errors` is true even when the value is undefined,
    // which means we correctly re-validate fields that were previously set
    // to undefined (cleared) as well as fields with an active error string.
    if (field in step1Errors) {
      const freshErrors = validateStep1WithData(updated);
      setStep1Errors((prev) => ({
        ...prev,
        [field]: freshErrors[field],
      }));
    }
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

  // ── Workshop selection handler ────────────────────────────────────────────
  // Clears the step 2 error as soon as a valid (non-full) workshop is chosen.

  const handleWorkshopSelect = (workshopId) => {
    setSelectedWorkshopId(workshopId);
    // Clear the "please select a workshop" error once a selection is made
    if (step2Error) setStep2Error(null);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  // ── Submission ────────────────────────────────────────────────────────────

  const handleConfirm = () => {
    if (!selectedWorkshop) return;

    // ── Final submission safety pass ──────────────────────────────────────
    // Re-validate Step 1 fields in case the user somehow reached Step 3
    // with stale/invalid data (e.g. via browser state restoration).
    const step1SafetyErrors = validateStep1();
    if (Object.keys(step1SafetyErrors).length > 0) {
      // Push user back to Step 1 with the errors shown
      setStep1Errors(step1SafetyErrors);
      setStep(1);
      return;
    }

    // ── Workshop still exists ─────────────────────────────────────────────
    const freshWorkshop = workshopList.find((w) => w.id === selectedWorkshop.id);
    if (!freshWorkshop) {
      setSubmitError("The selected workshop no longer exists. Please go back and choose another.");
      return;
    }

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
      // Generate readable, sequential Registration ID
      const registrationId = generateRegistrationId(registrationList.length);

      const registration = {
        id: registrationId,
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

      // Snapshot workshop and sponsor at submission time so the pass
      // shows the correct data even if live state is edited afterwards.
      setCompletedRegistration({
        registration,
        workshop: { ...selectedWorkshop },
        sponsor: selectedSponsor ? { ...selectedSponsor } : null,
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
    setCompletedRegistration(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Page heading */}
      <section className="mb-8" aria-labelledby="registrations-title">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Registrations</p>
        <h1
          id="registrations-title"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl"
        >
          Workshop Registration
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Register for an upcoming workshop in three simple steps.
        </p>
      </section>

      <div className="mx-auto max-w-3xl">
        {/* ── Registration Pass (success screen) ─────────────────────── */}
        {submitted && completedRegistration ? (
          <RegistrationPass
            registration={completedRegistration.registration}
            workshop={completedRegistration.workshop}
            sponsor={completedRegistration.sponsor}
            onRegisterAnother={handleReset}
          />
        ) : (
          /* ── Multi-step form ─────────────────────────────────────── */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
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
                onSelect={handleWorkshopSelect}
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

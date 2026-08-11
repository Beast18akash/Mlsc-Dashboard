import { Check } from "lucide-react";

/**
 * RegistrationStepIndicator
 *
 * Pure display component — renders a horizontal step progress bar.
 *
 * Props:
 *   currentStep : number   — 1-indexed active step (1 | 2 | 3)
 *   steps       : { label: string }[]
 */
const RegistrationStepIndicator = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Registration progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className={`flex items-center ${isLast ? "" : "flex-1"}`}
            >
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-current={isActive ? "step" : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "border-slate-900 bg-slate-900 text-white"
                      : isActive
                      ? "border-slate-900 bg-white text-slate-900"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} aria-hidden="true" strokeWidth={2.5} />
                  ) : (
                    <span aria-hidden="true">{stepNumber}</span>
                  )}
                  <span className="sr-only">
                    {isCompleted
                      ? `Step ${stepNumber} complete`
                      : isActive
                      ? `Step ${stepNumber} current`
                      : `Step ${stepNumber} upcoming`}
                    : {step.label}
                  </span>
                </span>

                <span
                  className={`hidden text-xs font-medium sm:block ${
                    isActive
                      ? "text-slate-900"
                      : isCompleted
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`mx-2 h-0.5 flex-1 transition-colors sm:mx-4 ${
                    isCompleted ? "bg-slate-900" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default RegistrationStepIndicator;

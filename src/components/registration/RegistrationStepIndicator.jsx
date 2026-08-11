import { Check } from "lucide-react";

const RegistrationStepIndicator = ({ currentStep, steps }) => (
  <nav aria-label="Registration progress" className="mb-8">
    <ol className="flex items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive    = stepNumber === currentStep;
        const isLast      = index === steps.length - 1;

        return (
          <li key={step.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={isActive ? "step" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : isActive
                    ? "border-slate-900 bg-white text-slate-900 dark:border-slate-100 dark:bg-slate-800 dark:text-slate-100"
                    : "border-slate-200 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500"
                }`}
              >
                {isCompleted ? <Check size={16} aria-hidden="true" strokeWidth={2.5} /> : <span aria-hidden="true">{stepNumber}</span>}
                <span className="sr-only">
                  {isCompleted ? `Step ${stepNumber} complete` : isActive ? `Step ${stepNumber} current` : `Step ${stepNumber} upcoming`}: {step.label}
                </span>
              </span>
              <span className={`hidden text-xs font-medium sm:block ${
                isActive ? "text-slate-900 dark:text-slate-100" : isCompleted ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"
              }`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div aria-hidden="true" className={`mx-2 h-0.5 flex-1 transition-colors sm:mx-4 ${
                isCompleted ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-200 dark:bg-slate-700"
              }`} />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default RegistrationStepIndicator;

import { useId } from "react";
import useCountUp from "../../hooks/useCountUp";

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  animate = false, 
  valueLabel,
  glowClass = "",
  borderClass = "",
  iconGlowClass = ""
}) => {
  const titleId = useId();
  const isNumeric = typeof value === "number";
  const animatedValue = useCountUp(isNumeric ? value : 0, { enabled: animate && isNumeric });
  const displayValue = animate && isNumeric ? animatedValue : value;

  return (
    <article
      className={`group relative min-h-40 min-w-0 overflow-hidden rounded-2xl border bg-white p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-slate-900/95 dark:shadow-2xl ${borderClass}`}
      aria-labelledby={titleId}
    >
      {/* Corner glow effect */}
      {glowClass && (
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-60 ${glowClass}`}
          aria-hidden="true"
        />
      )}

      {/* Card content */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </h2>
          <p
            className="mt-3 break-words text-3xl font-bold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-white sm:text-4xl"
            aria-label={valueLabel}
          >
            {displayValue}
          </p>
          <p className="mt-3 break-words text-sm leading-5 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        {Icon && (
          <div className={`relative ml-3 shrink-0 overflow-hidden rounded-xl bg-slate-100 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-200 dark:bg-slate-800/50 dark:group-hover:bg-slate-800/70 ${iconGlowClass ? 'shadow-lg' : ''}`}>
            {iconGlowClass && (
              <div
                className={`pointer-events-none absolute inset-0 opacity-15 blur-xl transition-opacity duration-300 group-hover:opacity-30 dark:opacity-20 dark:group-hover:opacity-40 ${iconGlowClass}`}
                aria-hidden="true"
              />
            )}
            <Icon size={22} className="relative z-10 text-slate-700 dark:text-slate-200" aria-hidden="true" />
          </div>
        )}
      </div>
    </article>
  );
};

export default MetricCard;

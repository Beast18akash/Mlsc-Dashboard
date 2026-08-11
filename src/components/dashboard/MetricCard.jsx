import { useId } from "react";

import useCountUp from "../../hooks/useCountUp";

const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
  animate = false,
  valueLabel,
}) => {
  const titleId = useId();
  const isNumeric = typeof value === "number";
  const animatedValue = useCountUp(isNumeric ? value : 0, {
    enabled: animate && isNumeric,
  });
  const displayValue = animate && isNumeric ? animatedValue : value;

  return (
    <article
      className="group flex min-w-0 min-h-40 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
      aria-labelledby={titleId}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-sm font-medium text-slate-600">
            {title}
          </h2>

          <p
            className="mt-2 break-words text-2xl font-semibold leading-tight tracking-tight text-slate-900 tabular-nums sm:text-3xl"
            aria-label={valueLabel}
          >
            {displayValue}
          </p>

          <p className="mt-2 break-words text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>

        {Icon && (
          <div className="ml-3 shrink-0 rounded-xl bg-slate-100 p-3 text-slate-700 transition-colors group-hover:bg-slate-200">
            <Icon size={20} aria-hidden="true" />
          </div>
        )}
      </div>
    </article>
  );
};

export default MetricCard;

import { CalendarDays, Handshake, Users, Clock3 } from "lucide-react";

import useCountdown from "../../hooks/useCountdown";
import MetricCard from "./MetricCard";

const MetricsGrid = ({
  workshops,
  totalWorkshops,
  totalSponsors,
  totalAttendees,
}) => {
  const { label, workshop, hasTarget, expired } = useCountdown(workshops);

  const countdownDescription = !hasTarget
    ? "No workshops scheduled"
    : expired
      ? `${workshop.title} is starting`
      : `Until ${workshop.title}`;

  return (
    <section
      className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Live dashboard metrics"
    >
      <MetricCard
        title="Total Workshops"
        value={totalWorkshops}
        description="Workshops this semester"
        icon={CalendarDays}
        animate
        glowClass="metric-glow-workshops"
        borderClass="border-blue-500/20 dark:border-indigo-400/30"
        iconGlowClass="metric-glow-workshops"
      />

      <MetricCard
        title="Total Sponsors"
        value={totalSponsors}
        description="Active sponsors"
        icon={Handshake}
        animate
        glowClass="metric-glow-sponsors"
        borderClass="border-violet-500/20 dark:border-purple-400/30"
        iconGlowClass="metric-glow-sponsors"
      />

      <MetricCard
        title="Registered Attendees"
        value={totalAttendees}
        description="Total registrations"
        icon={Users}
        animate
        glowClass="metric-glow-attendees"
        borderClass="border-teal-500/20 dark:border-cyan-400/30"
        iconGlowClass="metric-glow-attendees"
      />

      <MetricCard
        title="Next workshop"
        value={label}
        description={countdownDescription}
        icon={Clock3}
        valueLabel="Countdown to the next upcoming workshop"
        glowClass="metric-glow-countdown"
        borderClass="border-indigo-500/25 dark:border-indigo-400/35"
        iconGlowClass="metric-glow-countdown"
      />
    </section>
  );
};

export default MetricsGrid;

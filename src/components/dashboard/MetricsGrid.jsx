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
      className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Live dashboard metrics"
    >
      <MetricCard
        title="Total Workshops"
        value={totalWorkshops}
        description="Workshops this semester"
        icon={CalendarDays}
        animate
      />

      <MetricCard
        title="Total Sponsors"
        value={totalSponsors}
        description="Active sponsors"
        icon={Handshake}
        animate
      />

      <MetricCard
        title="Registered Attendees"
        value={totalAttendees}
        description="Total registrations"
        icon={Users}
        animate
      />

      <MetricCard
        title="Next workshop"
        value={label}
        description={countdownDescription}
        icon={Clock3}
        valueLabel="Countdown to the next upcoming workshop"
      />
    </section>
  );
};

export default MetricsGrid;

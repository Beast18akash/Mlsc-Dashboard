import { CalendarDays, Handshake, Users, Clock3 } from "lucide-react";

import MetricCard from "./MetricCard";

const MetricsGrid = ({
  totalWorkshops,
  totalSponsors,
  totalAttendees,
  nextWorkshop,
}) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Total Workshops"
        value={totalWorkshops}
        description="Workshops this semester"
        icon={CalendarDays}
      />

      <MetricCard
        title="Total Sponsors"
        value={totalSponsors}
        description="Active sponsors"
        icon={Handshake}
      />

      <MetricCard
        title="Registered Attendees"
        value={totalAttendees}
        description="Total registrations"
        icon={Users}
      />

      <MetricCard
        title="Next Workshop"
        value={nextWorkshop}
        description="Upcoming workshop"
        icon={Clock3}
      />
    </section>
  );
};

export default MetricsGrid;

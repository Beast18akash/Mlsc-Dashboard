import { workshops } from "../data/workshops";
import { sponsors } from "../data/sponsors";
import { registrations } from "../data/registrations";
import WorkshopTable from "../components/workshops/WorkshopTable";

import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import MetricsGrid from "../components/dashboard/MetricsGrid";

const Dashboard = () => {
  const totalWorkshops = workshops.length;
  const totalSponsors = sponsors.length;
  const totalAttendees = registrations.length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500">Overview</p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome to MLSC
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Manage workshops, sponsors, registrations, and attendee activity
                from one place.
              </p>
            </div>

            <MetricsGrid
              totalWorkshops={totalWorkshops}
              totalSponsors={totalSponsors}
              totalAttendees={totalAttendees}
              nextWorkshop="Coming Soon"
            />

<div className="mt-8">
  <WorkshopTable
    workshops={workshops}
    sponsors={sponsors}
  />
</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

import { workshops } from "../data/workshops";
import { sponsors } from "../data/sponsors";
import { registrations } from "../data/registrations";
import WorkshopTable from "../components/workshops/WorkshopTable";

import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import AlertBar from "../components/notifications/AlertBar";
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

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 lg:px-8">
          <AlertBar />
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <section className="mb-8" aria-labelledby="dashboard-title">
              <p className="text-sm font-semibold text-slate-600">
                Dashboard overview
              </p>

              <h1
                id="dashboard-title"
                className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                MLSC Workshop & Sponsor Console
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Live overview of workshops, sponsors, registrations, and the
                next upcoming session.
              </p>
            </section>

            <MetricsGrid
              workshops={workshops}
              totalWorkshops={totalWorkshops}
              totalSponsors={totalSponsors}
              totalAttendees={totalAttendees}
            />

            <div className="mt-8">
              <WorkshopTable workshops={workshops} sponsors={sponsors} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

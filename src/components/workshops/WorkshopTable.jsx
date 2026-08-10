import { Eye, Pencil, CheckCircle2 } from "lucide-react";

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Ongoing: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Completed: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const WorkshopTable = ({ workshops, sponsors }) => {
  const getSponsor = (sponsorId) => {
    return sponsors.find((sponsor) => sponsor.id === sponsorId);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-semibold text-slate-900">
          Workshops
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Manage your upcoming and completed workshops.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workshop
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Speaker
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sponsor
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Seats
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {workshops.map((workshop) => {
              const sponsor = getSponsor(workshop.sponsorId);
              const seatsRemaining =
                workshop.capacity - workshop.seatsFilled;

              return (
                <tr
                  key={workshop.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {workshop.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {workshop.date} · {workshop.time}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {workshop.venue} · {workshop.mode}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {workshop.speaker}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {workshop.category}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {sponsor?.name ?? "Unknown Sponsor"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {workshop.seatsFilled}/{workshop.capacity}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        seatsRemaining === 0
                          ? "font-semibold text-red-600"
                          : "text-slate-500"
                      }`}
                    >
                      {seatsRemaining === 0
                        ? "Full"
                        : `${seatsRemaining} seats remaining`}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        statusStyles[workshop.status]
                      }`}
                    >
                      {workshop.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        title="View Details"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        title="Edit Seats"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                        title="Mark Completed"
                      >
                        <CheckCircle2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkshopTable;
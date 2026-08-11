import Modal from "./Modal";

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Ongoing: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Completed: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const DetailItem = ({ label, value, children }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </dt>
    <dd className="mt-1 text-sm font-medium text-slate-900">
      {children ?? value ?? "—"}
    </dd>
  </div>
);

const WorkshopDetailsModal = ({ workshop, sponsor, isOpen, onClose }) => {
  if (!workshop) {
    return null;
  }

  const seatsRemaining = workshop.capacity - workshop.seatsFilled;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Workshop Details"
      size="lg"
    >
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailItem label="Workshop ID" value={workshop.id} />
        <DetailItem label="Title" value={workshop.title} />
        <DetailItem label="Date" value={workshop.date} />
        <DetailItem label="Time" value={workshop.time} />
        <DetailItem label="Speaker" value={workshop.speaker} />
        <DetailItem label="Category" value={workshop.category} />
        <DetailItem label="Sponsor" value={sponsor?.name ?? "Unknown Sponsor"} />
        <DetailItem label="Venue" value={workshop.venue} />
        <DetailItem label="Mode" value={workshop.mode} />
        <DetailItem
          label="Seats Filled"
          value={`${workshop.seatsFilled} / ${workshop.capacity}`}
        />
        {workshop.status !== "Completed" && (
          <DetailItem
            label="Seats Remaining"
            value={seatsRemaining <= 0 ? "Full" : `${seatsRemaining} remaining`}
          />
        )}
        <DetailItem label="Status">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              statusStyles[workshop.status] ?? statusStyles.Upcoming
            }`}
          >
            {workshop.status}
          </span>
        </DetailItem>
      </dl>

      {sponsor?.description && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sponsor Description
          </p>
          <p className="mt-2 text-sm text-slate-600">{sponsor.description}</p>
        </div>
      )}
    </Modal>
  );
};

export default WorkshopDetailsModal;

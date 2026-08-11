import { useState } from "react";

import Modal from "./Modal";

const inputClassName =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

const labelClassName = "text-sm font-medium text-slate-700";

const WorkshopEditModal = ({
  workshop,
  sponsors,
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(workshop);
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({
      ...current,
      [field]:
        field === "capacity" || field === "seatsFilled"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title?.trim()) {
      setError("Title is required.");
      return;
    }

    if (form.capacity <= 0) {
      setError("Capacity must be greater than zero.");
      return;
    }

    if (form.seatsFilled < 0) {
      setError("Seats filled cannot be negative.");
      return;
    }

    if (form.seatsFilled > form.capacity) {
      setError("Seats filled cannot exceed capacity.");
      return;
    }

    const { id, ...updates } = form;
    onSave(id, updates);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Workshop" size="lg">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="workshop-id" className={labelClassName}>
            Workshop ID
          </label>
          <input
            id="workshop-id"
            type="text"
            value={form.id}
            readOnly
            className={`${inputClassName} cursor-not-allowed bg-slate-50 text-slate-500`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="workshop-title" className={labelClassName}>
              Title
            </label>
            <input
              id="workshop-title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-date" className={labelClassName}>
              Date
            </label>
            <input
              id="workshop-date"
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-time" className={labelClassName}>
              Time
            </label>
            <input
              id="workshop-time"
              type="time"
              value={form.time}
              onChange={handleChange("time")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-speaker" className={labelClassName}>
              Speaker
            </label>
            <input
              id="workshop-speaker"
              type="text"
              value={form.speaker}
              onChange={handleChange("speaker")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-category" className={labelClassName}>
              Category
            </label>
            <input
              id="workshop-category"
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-sponsor" className={labelClassName}>
              Sponsor
            </label>
            <select
              id="workshop-sponsor"
              value={form.sponsorId}
              onChange={handleChange("sponsorId")}
              required
              className={inputClassName}
            >
              {sponsors.map((sponsor) => (
                <option key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="workshop-mode" className={labelClassName}>
              Mode
            </label>
            <select
              id="workshop-mode"
              value={form.mode}
              onChange={handleChange("mode")}
              required
              className={inputClassName}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="workshop-venue" className={labelClassName}>
              Venue
            </label>
            <input
              id="workshop-venue"
              type="text"
              value={form.venue}
              onChange={handleChange("venue")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-capacity" className={labelClassName}>
              Capacity
            </label>
            <input
              id="workshop-capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange("capacity")}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="workshop-seats-filled" className={labelClassName}>
              Seats Filled
            </label>
            <input
              id="workshop-seats-filled"
              type="number"
              min="0"
              value={form.seatsFilled}
              onChange={handleChange("seatsFilled")}
              required
              className={inputClassName}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkshopEditModal;

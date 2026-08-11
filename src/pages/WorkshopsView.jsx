import WorkshopTable from "../components/workshops/WorkshopTable";

/**
 * WorkshopsView
 *
 * Full workshop management section — displays ALL workshops with the
 * complete Feature 4 search/filter/sort controls and all Feature 3
 * and Feature 5 actions (View, Edit, Mark Completed, Interested).
 *
 * Receives the live workshopList from Dashboard (single source of truth).
 * Does not own or copy any workshop data.
 *
 * Props:
 *   workshopList     : Workshop[]  — live state from Dashboard
 *   sponsors         : Sponsor[]
 *   onUpdateWorkshop : fn
 *   onMarkCompleted  : fn
 */
const WorkshopsView = ({
  workshopList,
  sponsors,
  onUpdateWorkshop,
  onMarkCompleted,
}) => {
  return (
    <div>
      <section className="mb-6" aria-labelledby="workshops-title">
        <p className="text-sm font-semibold text-slate-600">
          Workshop management
        </p>
        <h1
          id="workshops-title"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          All Workshops
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Browse, search, filter, and manage all {workshopList.length}{" "}
          workshops. Use the controls below to find what you need.
        </p>
      </section>

      <WorkshopTable
        workshops={workshopList}
        sponsors={sponsors}
        onUpdateWorkshop={onUpdateWorkshop}
        onMarkCompleted={onMarkCompleted}
      />
    </div>
  );
};

export default WorkshopsView;

import CustomSelect from "../common/CustomSelect";

const YEAR_OPTIONS = ["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"];
const DEPARTMENT_OPTIONS = [
  "Computer Science","Information Technology","Electronics & Communication",
  "Electrical Engineering","Mechanical Engineering","Civil Engineering",
  "Chemical Engineering","Biotechnology","Mathematics","Physics","Other",
];

// Transform string arrays into { value, label } format for CustomSelect
const yearOptions = YEAR_OPTIONS.map((year) => ({ value: year, label: year }));
const departmentOptions = DEPARTMENT_OPTIONS.map((dept) => ({ value: dept, label: dept }));

const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const inputBase  = "w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:placeholder:text-slate-400";
const inputNormal = "border-slate-200 bg-white text-slate-900 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500";
const inputError  = "border-red-400 bg-red-50 text-slate-900 dark:border-red-600 dark:bg-red-950/30 dark:text-slate-100";
const errorClass  = "mt-1.5 text-xs font-medium text-red-600 dark:text-red-400";

const StepPersonalInfo = ({ formData, onChange, onNext, errors }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal Information</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter your details so we can confirm your registration.</p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2">
      {/* Full Name */}
      <div className="sm:col-span-2">
        <label htmlFor="reg-name" className={labelClass}>
          Full Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input id="reg-name" type="text" autoComplete="name" value={formData.name}
          onChange={(e) => onChange("name", e.target.value)} placeholder="e.g. Arjun Mehta"
          aria-required="true" aria-describedby={errors.name ? "reg-name-error" : undefined}
          className={`${inputBase} ${errors.name ? inputError : inputNormal}`} />
        {errors.name && <p id="reg-name-error" role="alert" className={errorClass}>{errors.name}</p>}
      </div>

      {/* Academic Email */}
      <div className="sm:col-span-2">
        <label htmlFor="reg-email" className={labelClass}>
          Academic Email <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input id="reg-email" type="email" autoComplete="email" value={formData.email}
          onChange={(e) => onChange("email", e.target.value)} placeholder="e.g. yourname@university.edu"
          aria-required="true" aria-describedby={errors.email ? "reg-email-error" : "reg-email-hint"}
          className={`${inputBase} ${errors.email ? inputError : inputNormal}`} />
        {errors.email ? (
          <p id="reg-email-error" role="alert" className={errorClass}>{errors.email}</p>
        ) : (
          <p id="reg-email-hint" className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Must be an institutional address — e.g.{" "}
            <span className="font-medium text-slate-500 dark:text-slate-400">@university.edu</span>{" "}
            or <span className="font-medium text-slate-500 dark:text-slate-400">@college.ac.in</span>.
            Personal emails (Gmail, Outlook, etc.) are not accepted.
          </p>
        )}
      </div>

      {/* Year */}
      <div>
        <label htmlFor="reg-year" className={labelClass}>
          Year of Study <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <CustomSelect
          id="reg-year"
          value={formData.year}
          onChange={(value) => onChange("year", value)}
          options={yearOptions}
          placeholder="Select year…"
          hasError={!!errors.year}
          ariaRequired={true}
          ariaDescribedby={errors.year ? "reg-year-error" : undefined}
        />
        {errors.year && <p id="reg-year-error" role="alert" className={errorClass}>{errors.year}</p>}
      </div>

      {/* Department */}
      <div>
        <label htmlFor="reg-dept" className={labelClass}>
          Department <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <CustomSelect
          id="reg-dept"
          value={formData.department}
          onChange={(value) => onChange("department", value)}
          options={departmentOptions}
          placeholder="Select department…"
          hasError={!!errors.department}
          ariaRequired={true}
          ariaDescribedby={errors.department ? "reg-dept-error" : undefined}
        />
        {errors.department && <p id="reg-dept-error" role="alert" className={errorClass}>{errors.department}</p>}
      </div>
    </div>

    <div className="mt-8 flex justify-end">
      <button type="button" onClick={onNext} className="btn-gradient-cta px-5 py-2.5 text-sm">
        <span>Next: Select Workshop</span>
      </button>
    </div>
  </div>
);

export default StepPersonalInfo;

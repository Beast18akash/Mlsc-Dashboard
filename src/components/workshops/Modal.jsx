import { useEffect, useId } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const titleId = useId();
  const sizeClass =
    size === "lg"
      ? "max-w-2xl"
      : size === "sm"
        ? "max-w-md"
        : "max-w-xl";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 flex max-h-[90vh] w-full ${sizeClass} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <h2
            id={titleId}
            className="pr-4 text-lg font-semibold text-slate-900"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

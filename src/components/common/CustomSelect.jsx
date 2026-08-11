import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomSelect
 *
 * A reusable accessible custom dropdown component that replaces native <select>.
 *
 * Props:
 *   id             : string — for label association
 *   value          : string — current selected value
 *   onChange       : (value: string) => void
 *   options        : Array<{ value: string, label: string }>
 *   placeholder    : string — shown when value is empty
 *   hasError       : boolean — applies error styling
 *   disabled       : boolean
 *   ariaLabel      : string — accessibility label
 *   ariaDescribedby: string — for error/hint association
 *   ariaRequired   : boolean
 *
 * Features:
 *   - Click to open/close
 *   - Keyboard navigation (Arrow Up/Down, Enter, Space, Escape, Home, End)
 *   - Click outside to close
 *   - Visible focus states
 *   - Consistent with existing MLSC input styling
 *   - Light/dark theme support
 *   - Mobile friendly
 */
const CustomSelect = ({
  id,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  hasError = false,
  disabled = false,
  ariaLabel,
  ariaDescribedby,
  ariaRequired = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listboxId = useId();

  // Find the label for the currently selected value
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Handle option selection
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Toggle dropdown
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  // Close dropdown
  const handleClose = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      }

      case "Escape": {
        e.preventDefault();
        if (isOpen) {
          handleClose();
          buttonRef.current?.focus();
        }
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      }

      case "Home": {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(0);
        }
        break;
      }

      case "End": {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(options.length - 1);
        }
        break;
      }

      case "Tab": {
        if (isOpen) {
          handleClose();
        }
        break;
      }

      default:
        break;
    }
  };

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0) {
      const highlightedElement = document.getElementById(
        `${listboxId}-option-${highlightedIndex}`
      );
      highlightedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen, listboxId]);

  // Base classes for button
  const buttonBaseClass =
    "w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

  const buttonNormalClass = hasError
    ? "border-red-400 bg-red-50 text-slate-900 dark:border-red-600 dark:bg-red-950/30 dark:text-slate-100"
    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500";

  const buttonDisabledClass =
    "cursor-not-allowed opacity-50 dark:opacity-40";

  const buttonClass = `${buttonBaseClass} ${
    disabled ? buttonDisabledClass : buttonNormalClass
  }`;

  const placeholderClass = !value ? "text-slate-400 dark:text-slate-400" : "";

  return (
    <div ref={containerRef} className="relative">
      {/* Custom select button */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-required={ariaRequired}
        className={buttonClass}
      >
        <span className="flex items-center justify-between">
          <span className={`truncate text-left ${placeholderClass}`}>
            {displayText}
          </span>
          <ChevronDown
            size={16}
            className={`ml-2 shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            } ${disabled ? "text-slate-400 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div
          role="listbox"
          id={listboxId}
          tabIndex={-1}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-700"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <div
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                  isHighlighted
                    ? "bg-slate-100 dark:bg-slate-600"
                    : "bg-white dark:bg-slate-700"
                } ${
                  isSelected
                    ? "font-semibold text-slate-900 dark:text-slate-100"
                    : "text-slate-700 dark:text-slate-300"
                } hover:bg-slate-100 dark:hover:bg-slate-600`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check
                    size={16}
                    className="ml-2 shrink-0 text-slate-900 dark:text-slate-100"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

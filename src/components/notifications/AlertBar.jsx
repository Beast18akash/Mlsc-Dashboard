import { AlertTriangle, Info, X } from "lucide-react";

import { useNotifications } from "../../context/NotificationContext";

const typeStyles = {
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-900",
    icon: Info,
    iconClass: "text-blue-600",
    dismissClass:
      "text-blue-700 hover:bg-blue-100 focus-visible:outline-blue-600",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    icon: AlertTriangle,
    iconClass: "text-amber-600",
    dismissClass:
      "text-amber-700 hover:bg-amber-100 focus-visible:outline-amber-600",
  },
};

const AlertBar = () => {
  const { notifications, dismissNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="space-y-2"
      role="region"
      aria-label="Global notifications"
    >
      {notifications.map(({ id, type, message }) => {
        const styles = typeStyles[type] ?? typeStyles.info;
        const Icon = styles.icon;

        return (
          <div
            key={id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${styles.container}`}
            role="alert"
          >
            <Icon
              className={`mt-0.5 shrink-0 ${styles.iconClass}`}
              size={18}
              aria-hidden="true"
            />

            <p className="min-w-0 flex-1 text-sm font-medium leading-5">
              {message}
            </p>

            <button
              type="button"
              onClick={() => dismissNotification(id)}
              className={`shrink-0 rounded-lg p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.dismissClass}`}
              aria-label={`Dismiss notification: ${message}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AlertBar;

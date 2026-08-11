/* eslint-disable react-refresh/only-export-components -- context module exports provider and hook */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { workshops } from "../data/workshops";

const STORAGE_KEY = "mlsc-dismissed-notifications";

function loadDismissedIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDismissedIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore write failures (e.g. private browsing quota).
  }
}

export function buildWorkshopNotifications(workshopList) {
  const list = Array.isArray(workshopList) ? workshopList : [];
  const notifications = [];

  if (list.length > 0) {
    notifications.push({
      id: "info-workshop-count",
      type: "info",
      message: `${list.length} workshop${list.length === 1 ? "" : "s"} are currently available.`,
    });
  }

  list
    .filter((workshop) => workshop.capacity - workshop.seatsFilled <= 0)
    .forEach((workshop) => {
      notifications.push({
        id: `warning-full-${workshop.id}`,
        type: "warning",
        message: `${workshop.title} is fully booked.`,
      });
    });

  return notifications;
}

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    buildWorkshopNotifications(workshops),
  );
  const [dismissedIds, setDismissedIds] = useState(loadDismissedIds);

  const addNotification = useCallback((notification) => {
    const id = notification.id ?? `notification-${Date.now()}`;

    setNotifications((current) => {
      if (current.some((item) => item.id === id)) {
        return current;
      }

      return [...current, { ...notification, id }];
    });

    return id;
  }, []);

  const dismissNotification = useCallback((id) => {
    setDismissedIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const next = [...current, id];
      saveDismissedIds(next);
      return next;
    });
  }, []);

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !dismissedIds.includes(item.id)),
    [notifications, dismissedIds],
  );

  const value = useMemo(
    () => ({
      notifications: visibleNotifications,
      addNotification,
      dismissNotification,
    }),
    [visibleNotifications, addNotification, dismissNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }

  return context;
}

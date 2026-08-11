import { useEffect, useMemo, useState } from "react";

export function parseWorkshopDateTime(workshop) {
  if (!workshop?.date || !workshop?.time) {
    return null;
  }

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(workshop.date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(workshop.time);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const [, year, month, day] = dateMatch.map(Number);
  const [, hours, minutes] = timeMatch.map(Number);
  const parsed = new Date(year, month - 1, day, hours, minutes);

  const isValidDate =
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day &&
    parsed.getHours() === hours &&
    parsed.getMinutes() === minutes;

  return isValidDate ? parsed : null;
}

export function getNextUpcomingWorkshop(workshops) {
  const now = Date.now();

  return (
    (Array.isArray(workshops) ? workshops : [])
      .filter((workshop) => workshop.status === "Upcoming")
      .map((workshop) => ({
        workshop,
        startTime: parseWorkshopDateTime(workshop),
      }))
      .filter(({ startTime }) => startTime && startTime.getTime() > now)
      .sort((a, b) => a.startTime - b.startTime)[0]?.workshop ?? null
  );
}

function formatCountdown(remainingMs) {
  if (remainingMs <= 0) {
    return { label: "Starting now", expired: true };
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    label: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    expired: false,
  };
}

export function useCountdown(workshops) {
  const nextWorkshop = useMemo(
    () => getNextUpcomingWorkshop(workshops),
    [workshops],
  );
  const targetTime = useMemo(
    () => (nextWorkshop ? parseWorkshopDateTime(nextWorkshop) : null),
    [nextWorkshop],
  );
  const [currentTime, setCurrentTime] = useState(Date.now);

  useEffect(() => {
    if (!targetTime || targetTime.getTime() <= Date.now()) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      if (targetTime.getTime() <= now) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  if (!targetTime) {
    return {
      label: "No upcoming workshops",
      expired: false,
      hasTarget: false,
      workshop: null,
    };
  }

  return {
    ...formatCountdown(targetTime.getTime() - currentTime),
    hasTarget: true,
    workshop: nextWorkshop,
  };
}

export default useCountdown;

import { useEffect, useRef, useState } from "react";

const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

export function useCountUp(target, { duration = 800, enabled = true } = {}) {
  const isNumericTarget = typeof target === "number" && Number.isFinite(target);
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(display);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (!enabled || !isNumericTarget) {
      return undefined;
    }

    const from = displayRef.current;
    const start = performance.now();
    const animationDuration = Math.max(duration, 0);
    let frameId;

    const tick = (now) => {
      const progress = animationDuration === 0
        ? 1
        : Math.min((now - start) / animationDuration, 1);
      const nextValue = Math.round(from + (target - from) * easeOutCubic(progress));
      setDisplay(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, enabled, isNumericTarget]);

  if (!enabled || !isNumericTarget) {
    return target;
  }

  return display;
}

export default useCountUp;
